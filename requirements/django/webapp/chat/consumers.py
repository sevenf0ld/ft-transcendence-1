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
        user = self.scope['user']
        if not user.is_authenticated:
            self.close(3000)
            return

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        if self.room_group_name not in self.in_room:
            self.in_room[self.room_group_name] = set()

        if user.username in self.in_room[self.room_group_name]:
            self.accept()
        elif len(self.in_room[self.room_group_name]) < MAX_PRIVATE_CHAT_USERS:
            self.accept()

            self.in_room[self.room_group_name].add(user.username)

            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
        else:
            self.close(3003)

        in_room_users = len(self.in_room[self.room_group_name])
        if in_room_users == MAX_PRIVATE_CHAT_USERS:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat.available'
                }
            )
        else:
            self.send(text_data=json.dumps({
                'type': 'chat_unavailable'
            }))

    def chat_available(self, event):
        self.send(text_data=json.dumps({
            'type': 'chat_available'
        }))

    #========================================#
    #========== DISCONNECTED FROM ===========#
    #========================================#
    def disconnect(self, code):
        user = self.scope['user']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                #'type': 'chat.offline'
                'type': 'chat.unavailable'
            }
        )

        if self.room_group_name in self.in_room:
            self.in_room[self.room_group_name].discard(user.username)
            if not self.in_room[self.room_group_name]:
                del self.in_room[self.room_group_name]

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        self.close()

    #def chat_offline(self, event):
    def chat_unavailable(self, event):
        self.send(text_data=json.dumps({
            'type': 'chat_unavailable',
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
        #elif message_type == 'chat_close':
        #    async_to_sync(self.channel_layer.group_send)(
        #        self.room_group_name,
        #        {
        #            'type': 'chat.unavailable',
        #        }
        #    )

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
    #def chat_unavailable(self, event):
    #    self.send(text_data=json.dumps({
    #        'type': 'chat_unavailable',
    #    }))
