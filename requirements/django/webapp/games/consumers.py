import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from .models import Room
from .serializers import RoomModelSerializer

class LobbyConsumer(WebsocketConsumer):
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

    @database_sync_to_async
    def get_rooms(self):
        rooms = Room.objects.filter(room_type=self.lobby_type)
        if rooms.exists():
            return rooms
        return []

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

    def list_rooms(self, event):
        self.send(text_data=json.dumps({
            'type': 'display',
            'rooms': event['rooms']
        }))

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        text_json = json.loads(text_data)

MAX_PVP_MEMBERS = 2
MAX_TNM_MEMBERS = 5

class GameRoomConsumer(WebsocketConsumer):
    in_room = {}

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
        else:
            self.close(3003)

        members = list(self.in_room[self.group_id])
        async_to_sync(self.channel_layer.group_send)(
            self.group_id,
            {
                'type': 'room.join',
                'members': members,
            }
        )

    def room_join(self, event):
        members = event['members']
        in_room_count = len(members)
        capacity = 'full' if in_room_count == MAX_PVP_MEMBERS else 'not_full'
        room = async_to_sync(self.get_room_object)()
        is_host = async_to_sync(self.is_host)()

        self.send(text_data=json.dumps({
            'type': 'join_room',
            'members': members,
            'num': in_room_count,
            'capacity': capacity,
            'details': room,
            'is_host': is_host,
        }))

    @database_sync_to_async
    def get_room_object(self):
        # handle if does not exist
        room = Room.objects.get(room_id=self.room_id)
        serializer = RoomModelSerializer(room)
        return serializer.data

    @database_sync_to_async
    def is_host(self):
        # handle if does not exist
        room = Room.objects.get(room_id=self.room_id)
        if self.user.id == room.host.id:
            return True
        return False

    def disconnect(self, code):
        members = list(self.in_room[self.group_id])
        async_to_sync(self.channel_layer.group_send)(
            self.group_id,
            {
                'type': 'room.leave',
                'members': members,
            }
        )

        if self.group_id in self.in_room:
            self.in_room[self.group_id].discard(self.user.username)
            if not self.in_room[self.group_id]:
                del self.in_room[self.group_id]

        async_to_sync(self.channel_layer.group_discard)(
            self.group_id,
            self.channel_name
        )

    def room_leave(self, event):
        members = event['members']
        in_room_count = len(members)
        capacity = 'full' if in_room_count == MAX_PVP_MEMBERS else 'not_full'
        room = async_to_sync(self.get_room_object)()
        is_host = async_to_sync(self.is_host)()

        self.send(text_data=json.dumps({
            'type': 'leave_room',
            'members': members,
            'num': in_room_count,
            'capacity': capacity,
            'details': room,
            'is_host': is_host,
        }))
