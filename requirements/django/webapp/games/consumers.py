import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
rom channels.db import database_sync_to_async

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
        self.display_rooms()

    @database_sync_to_async
    def get_rooms(self):
        try:
            rooms = Room.objects.all()


    def disconnect(self, code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        text_json = json.loads(text_data)
