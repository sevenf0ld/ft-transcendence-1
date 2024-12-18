import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    # handle initial requests to this consumer
    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected real-time!'
        }))

    # receive messages sent to this consumer

    # handle client disconnecting from this consumer

#import json
#from asgiref.sync import async_to_sync
#from channels.generic.websocket import WebsocketConsumer
#
#class MyConsumer(WebsocketConsumer):
#    def connect(self):
#        async_to_sync(self.channel_layer.group_add)(
#            'chat_room',
#            self.channel_name
#        )
#        self.accept()
#
#    def disconnect(self, close_code):
#        async_to_sync(self.channel_layer.group_discard)(
#            'chat_room',
#            self.channel_name
#        )
#
#    def receive(self, text_data=None, bytes_data=None):
#        text_data_json = json.loads(text_data)
#        message = text_data_json['message']
#        async_to_sync(self.channel_layer.group_send)(
#            'chat_room',
#            {
#                'type': 'chat_message',
#                'message': message
#            }
#        )
#
#    def chat_message(self, event):
#        message = event['message']
#        self.send(text_data=json.dumps(
#            {
#                'message': message
#            }
#        ))
