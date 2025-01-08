import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from .models import Room
from .serializers import RoomModelSerializer
from django.db import transaction
from django.db.models import F
from django.contrib.auth.models import User

# xxx_room
class LobbyConsumer(WebsocketConsumer):
    #=================================#
    #               CONNECT
    #=================================#
    def connect(self):
        self.user = self.scope['user']
        self.lobby_type = self.scope['url_route']['kwargs']['lobby_type']
        if not self.user.is_authenticated or self.lobby_type != 'PVP' and self.lobby_type != 'TNM':
            self.close(3000)
            return
        self.group_name = f'lobby_{self.lobby_type}'
        self.accept()
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.display_lobby()

    #=================================#
    #               DISCONNECT
    #=================================#
    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    #=================================#
    #               RECEIVE
    #=================================#
    def receive(self, text_data=None, bytes_data=None):
        text_json = json.loads(text_data)
        update = text_json['lobby_update']
        if update in ['create_room']:
            self.update_lobby()

    #=======================================================#
    #               ASYNC - CHANNEL LAYER COMMUNICATION
    #=======================================================#
    def display_lobby(self):
        rooms = async_to_sync(self.get_rooms)()
        if rooms:
            serializer = RoomModelSerializer(rooms, many=True)
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                {
                    'type': 'list.rooms',
                    'rooms': serializer.data
                }
            )
        else:
            self.send(text_data=json.dumps({
                'type': 'display',
                'rooms': rooms
            }))

    #=======================================================#
    #              EVENTS BY CONSUMER
    #=======================================================#
    def list_rooms(self, event):
        self.send(text_data=json.dumps({
            'type': 'display',
            'rooms': event['rooms']
        }))

    # for room creation or deletion & member join or leave
    def update_lobby(self, event=None):
        self.display_lobby()

    #=================================#
    #               UTIL
    #=================================#
    @database_sync_to_async
    def get_rooms(self):
        return list(Room.objects.filter(room_type=self.lobby_type))


MAX_PVP_MEMBERS = 2
MAX_TNM_MEMBERS = 5

# room_xxx
class GameRoomConsumer(WebsocketConsumer):
    in_room = {}

    #=================================#
    #               CONNECT
    #=================================#
    def connect(self):
        self.user = self.scope['user']
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        if not self.user.is_authenticated or len(self.room_id) != 6:
            self.close(3000)
            return
        self.group_id = f'gameroom_{self.room_id}'
        if self.group_id not in self.in_room:
            self.in_room[self.group_id] = set()
        in_room_count = len(self.in_room[self.group_id])
        if in_room_count < MAX_PVP_MEMBERS:
            self.accept()
            self.in_room[self.group_id].add(self.user.username)
            async_to_sync(self.channel_layer.group_add)(
                self.group_id,
                self.channel_name
            )
            is_host = async_to_sync(self.is_host)()
            if not is_host:
                self.increment_room_members()
        else:
            self.accept()
            self.send(text_data=json.dumps({
                'type': 'full_room',
                'message': 'Room is at max capacity.'
            }))
            self.close(3003)
            return 

        members = list(self.in_room[self.group_id])
        async_to_sync(self.channel_layer.group_send)(
            self.group_id,
            {
                'type': 'members.update',
                'members': members,
                'update_type': 'joined_room',
                'person': self.user.username
            }
        )

    #=================================#
    #               DISCONNECT
    #=================================#
    def disconnect(self, code):
        if code == 3003:
            return

        if self.group_id in self.in_room:
            self.in_room[self.group_id].discard(self.user.username)
            if not self.in_room[self.group_id]:
                del self.in_room[self.group_id]
            async_to_sync(self.channel_layer.group_discard)(
                self.group_id,
                self.channel_name
            )
            is_host = async_to_sync(self.is_host)()
            if not is_host:
                self.decrement_room_members()
                members = list(self.in_room.get(self.group_id, []))
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,
                    {
                        'type': 'members.update',
                        'members': members,
                        'update_type': 'left_room',
                        'person': self.user.username
                    }
                )
            else:
                self.delete_room_object()
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,
                    {
                        'type': 'room.disband',
                        'message': 'Host has left the game. Room disbanded.'
                    }
                )

    #=================================#
    #               RECEIVE
    #=================================#
    def receive(self, text_data=None, bytes_data=None):
        text_json = json.loads(text_data)
        update = text_json['game_state']
        if update == 'game_started':
            self.update_room_start()
            members = list(self.in_room.get(self.group_id, []))
            async_to_sync(self.channel_layer.group_send)(
                self.group_id,
                {
                    'type': 'game.start',
                    'members': members,
                }
            )
        # frontend
        if update == 'pre_game':
            is_host = async_to_sync(self.is_host)()
            if is_host:
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,
                    {
                        'type': 'pre.game',
                        'dy': text_json['dy'],
                        'dx': text_json['dx']
                    }
                )

    #=======================================================#
    #               ASYNC - CHANNEL LAYER COMMUNICATION
    #=======================================================#
    @transaction.atomic
    def increment_room_members(self):
        room = Room.objects.select_for_update().get(room_id=self.room_id)
        Room.objects.filter(room_id=self.room_id).update(members=F('members') + 1)
        async_to_sync(self.channel_layer.group_send)(
            f'lobby_{room.room_type}',
            {
                'type': 'update.lobby',
            }
        )

    @transaction.atomic
    def decrement_room_members(self):
        room = Room.objects.select_for_update().get(room_id=self.room_id)
        Room.objects.filter(room_id=self.room_id).update(members=F('members') - 1)
        async_to_sync(self.channel_layer.group_send)(
            f'lobby_{room.room_type}',
            {
                'type': 'update.lobby',
            }
        )

    @transaction.atomic
    def delete_room_object(self):
        room = Room.objects.select_for_update().get(room_id=self.room_id)
        room_type = room.room_type
        room.delete()
        async_to_sync(self.channel_layer.group_send)(
            f'lobby_{room_type}',
            {
                'type': 'update.lobby',
            }
        )

    @transaction.atomic
    def update_room_start(self):
        room = Room.objects.select_for_update().get(room_id=self.room_id)
        room.started = True
        room.save()
        async_to_sync(self.channel_layer.group_send)(
            f'lobby_{room.room_type}',
            {
                'type': 'update.lobby',
            }
        )

    #=======================================================#
    #              EVENTS BY CONSUMER
    #=======================================================#
    def members_update(self, event):
        members = event['members']
        in_room_count = len(members)
        capacity = 'full' if in_room_count == MAX_PVP_MEMBERS else 'not_full'
        room = async_to_sync(self.get_room_object)()
        is_host = async_to_sync(self.is_host)()
        self.send(text_data=json.dumps({
            'type': event['update_type'],
            'members': members,
            'num': in_room_count,
            'capacity': capacity,
            'details': room,
            'is_host': is_host,
            'person': event['person']
        }))

    def room_disband(self, event):
        self.send(text_data=json.dumps({
            'type': 'disbanded_room',
            'message': 'Host has left the game. Room disbanded.'
        }))

    def game_start(self, event):
        self.send(text_data=json.dumps({
            'type': 'started_game',
            'members': event['members'],
            #'playing': in_room_count,
            #'waiting': capacity,
            #'eliminated': room,
        }))

    # frontend
    def pre_game(self, event):
        self.send(text_data=json.dumps({
            'type': 'pre_game',
            'dy': event['dy'],
            'dx': event['dx']
        }))

    #=================================#
    #               UTIL
    #=================================#
    @database_sync_to_async
    def get_room_object(self):
        try:
            room = Room.objects.get(room_id=self.room_id)
            serializer = RoomModelSerializer(room)
            return serializer.data
        except Room.DoesNotExist:
            return None

    @database_sync_to_async
    def is_host(self):
        room = Room.objects.get(room_id=self.room_id)
        if self.user.id == room.host.id:
            return True
        return False

class InvitationConsumer(WebsocketConsumer):
    #=================================#
    #               CONNECT
    #=================================#
    def connect(self):
        # room details to be extracted
        self.invitee = self.scope['url_route']['kwargs']['invitee']
        try:
            self.invitee_data = (User.objects.get)(username=self.invitee)
        except:
            self.accept()
            self.send(text_data=json.dumps({
                'type': 'invalid_invitee',
                'message': 'Invitee does not exist.'
            }))
            self.close(3003)
            return
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            self.close(3000)
            return
        self.invitor_group = f'invite_{self.user.username}'
        self.invitee_group = f'invite_{self.invitee}'
        self.accept()
        async_to_sync(self.channel_layer.group_add)(
            self.invitor_group,
            self.channel_name
        )
        async_to_sync(self.channel_layer.group_add)(
            self.invitee_group,
            self.channel_name
        )

    #=================================#
    #               DISCONNECT
    #=================================#
    def disconnect(self, code):
        if code == 3003:
            return
        async_to_sync(self.channel_layer.group_discard)(
            self.invitor_group,
            self.channel_name
        )
        async_to_sync(self.channel_layer.group_discard)(
            self.invitee_group,
            self.channel_name
        )

    #=================================#
    #               RECEIVE
    #=================================#
    def receive(self, text_data=None, bytes_data=None):
        text_json = json.loads(text_data)
        print('INVITE CONSUMER RECEIVES', text_json)
        invite_update = text_json['invite_update']

        if invite_update == 'send_invitation':
            room_id = text_json['room_id']

        async_to_sync(self.channel_layer.group_send)(
            self.invitee_group,
            {
                'type': 'invite.send',
                'room_id': room_id
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            self.invitor_group,
            {
                'type': 'invite.confirm',
            }
        )

    #=======================================================#
    #               ASYNC - CHANNEL LAYER COMMUNICATION
    #=======================================================#

    #=======================================================#
    #              EVENTS BY CONSUMER
    #=======================================================#
    def invite_send(self, event):
        # room details to be added
        self.send(text_data=json.dumps({
            'type': 'invitation_received',
            'message': f'{self.user.username} has invited you PVP!',
            'room_id': event['room_id']
        }))

    def invite_confirm(self, event):
        self.send(text_data=json.dumps({
            'type': 'invitation_sent',
            'message': f'PVP invitation has been sent to {self.invitee}!'
        }))

    #=================================#
    #               UTIL
    #=================================#
