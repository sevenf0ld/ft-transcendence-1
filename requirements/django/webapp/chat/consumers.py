import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f"{self.scope['user']} is now connected to {self.room_group_name}."
        }))

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        self.send(text_data=json.dumps({
            'type': 'connection_closed',
            'message': f"{self.scope['user']} has disconnected from {self.scope['room_group_name']}."
        }))


    def receive(self, text_data):
        text_json = json.loads(text_data)
        message = text_json['message']
        sender = text_json['sender']

        print(self.scope['path']) # /ws/chat/
        print(self.scope['raw_path']) # b'/ws/chat/
        print(self.scope['user']) # maiman-m
        print(self.scope['url_route']) # {'args': (), 'kwargs': {}}

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'reply.chat',
                'message': message,
                'sender': sender
            }
        )

    def reply_chat(self, event):
        message = event['message']
        sender = event['sender']

        self.send(text_data=json.dumps({
            'type': 'message_received',
            'message': message,
            'sender': sender
        }))
