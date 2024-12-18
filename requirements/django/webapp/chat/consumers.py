import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'playground'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected to the chat socket.'
        }))

    def receive(self, text_data):
        text_json = json.loads(text_data)
        message = text_json['message']
        sender = text_json['sender']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'reply_chat',
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
