import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from .serializers import RoomModelSerializer

MAX_PVP_MEMBERS = 2
MAX_TNM_MEMBERS = 5

# display the rooms open/closed in pvp and tnm lobby
class LobbyConsumer(WebsocketConsumer):
    # display the list of rooms
    def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            self.close(3000)
            return

        self.accept()

        self.rooms = self.get_rooms()

        async_to_sync(self.channel_layer.group_add)(
            'lobby',
            self.channel_name
        )
        self.display_lobby()

    @database_sync_to_async
    def get_rooms(self):
        rooms = Room.objects.all()
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
            'rooms': rooms
        }))

    def disconnect(self, code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        text_json = json.loads(text_data)
