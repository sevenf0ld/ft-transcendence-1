import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import sync_to_async
from user_profiles.models import Profile
from friends.models import FriendList
from django.contrib.auth.models import User
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync

# on connect, as in when a user logs in and views the homeview, the webscoket will automatically be connected to. the webconsumer should detect whose friends list does this user appear in/belong to, and trigger the addition of this user into that person's online friends list (not actual friend list)
# on disconnect, when a user logs out, the websocket will be triggered to close. the webconsumer should again detect in which friend list this user appeared in to trigger the remove of that person from the online friends list (not actual friend list)

class OnlineConsumer(WebsocketConsumer):
    # when a user logs in
    def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            self.close(3000)
            return

        self.room_name = self.user.id
        self.room_group_name = f'friends_{self.room_name}'

        # find friends
        self.friends = self.get_friends()

        # send the online status
        async_to_sync(self.channel_layer.group_add)(
        self.room_group_name,
            self.channel_name
        )
        self.notify_friends_online()

        self.accept()

    @database_sync_to_async
    def get_friends(self):
        try:
            friends_data = FriendList.objects.get(user=self.user)
            return friends_data.friends.all()
        except FriendList.DoesNotExist:
            return []

    def notify_friends_online(self):
        friends = async_to_sync(self.get_friends)()

        for friend in friends:
            room_friend_name = f'friend_{friend.id}'
            async_to_sync(self.channel_layer.group_send)(
                room_friend_name,
                {
                    'type': 'friend.online',
                    'user': self.user.username,
                    'update': f'{self.user.username} has come online.'
                }
            )

    def friend_online(self, event):
        friend = event['user']
        message = event['update']

        self.send(text_data=json.dumps({
            'status': 'online',
            'friend': friend,
            'message': message
        }))

    # when a user logs out
    def disconnect(self):
        self.notify_friends_offline()

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def notify_friends_offline(self):
        for friend in self.friends:
            room_friend_name = f'friend_{friend.id}'
            async_to_sync(self.channel_layer.group_send)(
                room_friend_name,
                {
                    'type': 'friend.offline',
                    'user': self.user.username,
                    'update': f'{self.user.username} has gone offline.'
                }
            )

    def friend_offline(self, event):
        friend = event['user']
        message = event['update']

        self.send(text_data=json.dumps({
            'status': 'offline',
            'friend': friend,
            'message': message
        }))

    # before a user logs out
    def receive(self, text_data):
        text_json = json.loads(text_data)
        action = text_json['action']
        sender = text_json['user']

        if action == 'logout':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'friend.offline',
                    'user': sender,
                }
            )

            self.close()
