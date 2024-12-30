import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from .models import Room
from .serializers import RoomModelSerializer

MAX_PVP_MEMBERS = 2
MAX_TNM_MEMBERS = 5

# display the rooms open/closed in pvp and tnm lobby
class LobbyConsumer(WebsocketConsumer):
    # display the list of rooms
    def connect(self):
        self.user = self.scope['user']
        self.lobby_type = self.scope['url_route']['kwargs']['lobby_type']
        if not self.user.is_authenticated or self.lobby_type != 'PVP' and self.lobby_type != 'TNM':
            self.close(3000)
            return

        self.group_name = f'lobby_{self.lobby_type}'

        self.accept()

        self.rooms = self.get_rooms()

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
                    'type': 'display.rooms',
                    'rooms': serializer.data
                }
            )

    def display_rooms(self, event):
        rooms = event['rooms']

        self.send(text_data=json.dumps({
            'type': 'display',
            'rooms': rooms
        }))

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        text_json = json.loads(text_data)
