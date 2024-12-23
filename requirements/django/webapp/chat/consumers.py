import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

MAX_PRIVATE_CHAT_USERS = 2

# maybe change everything to 4k+
class ChatConsumer(WebsocketConsumer):
    in_room = {}

    #========================================#
    #========== GETS CONNECTED TO ===========#
    #========================================#
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        if self.room_group_name not in self.in_room:
            self.in_room[self.room_group_name] = set()

        user = self.scope['user']
        if user.is_authenticated:
            if user.username in self.in_room[self.room_group_name]:
                self.accept()

                in_room_users = len(self.in_room[self.room_group_name])
                self.send(text_data=json.dumps({
                    'type': 'reconnect',
                    'message': f"{user} has reconnected to {self.room_group_name}.",
                    'num_in_room': in_room_users
                }))

                if in_room_users == 2:
                    async_to_sync(self.channel_layer.group_send)(
                        self.room_group_name,
                        {
                            'type': 'chat.ready'
                        }
                    )
            elif len(self.in_room[self.room_group_name]) < MAX_PRIVATE_CHAT_USERS:
                self.accept()

                self.in_room[self.room_group_name].add(user.username)

                async_to_sync(self.channel_layer.group_add)(
                    self.room_group_name,
                    self.channel_name
                )

                in_room_users = len(self.in_room[self.room_group_name])
                self.send(text_data=json.dumps({
                    'type': 'connect',
                    'message': f"{user} is now connected to {self.room_group_name}.",
                    'num_in_room': in_room_users
                }))

                if in_room_users == 2:
                    async_to_sync(self.channel_layer.group_send)(
                        self.room_group_name,
                        {
                            'type': 'chat.ready'
                        }
                    )
            else:
                self.close(3003)
        else:
            self.close(3000)

    def chat_ready(self, event):
        self.send(text_data=json.dumps({
            'type': 'chat_ready'
        }))

    #========================================#
    #========== DISCONNECTED FROM ===========#
    #========================================#
    def disconnect(self, code):
        user = self.scope['user']

        if self.room_group_name in self.in_room:
            self.in_room[self.room_group_name].discard(user.username)
            if not self.in_room[self.room_group_name]:
                del self.in_room[self.room_group_name]

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        # change to group send
        self.send(text_data=json.dumps({
            'type': 'disconnect',
            'message': f"{self.scope['user']} has disconnected from {self.room_group_name}.",
        }))

    #========================================#
    #========== RECEIVE A MESSAGE ===========#
    #============== BROADCAST ===============#
    #========================================#
    def receive(self, text_data):
        text_json = json.loads(text_data)
        message = text_json['message']
        sender = text_json['sender']
        message_type = text_json['type']

        if message_type == 'chat_reply':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat.reply',
                    'message': message,
                    'sender': sender
                }
            )
        elif message_type == 'chat_close':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat.close',
                    'message': f'{sender} has left the room.',
                }
            )

            # self.close()

    #========================================#
    #========== RECEIVE A MESSAGE ===========#
    #============== CHATTING ================#
    #========================================#
    def chat_reply(self, event):
        message = event['message']
        sender = event['sender']

        self.send(text_data=json.dumps({
            'type': 'chat_reply',
            'message': message,
            'sender': sender
        }))

    #========================================#
    #========== RECEIVE A MESSAGE ===========#
    #============ NOTIFY CLIENT =============#
    #========================================#
    def chat_close(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type': 'chat_close',
            'message': message,
        }))
