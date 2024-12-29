import json
from channels.generic.websocket import WebsocketConsumer
from friends.models import FriendList
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync

# on connect, as in when a user logs in and views the homeview, the webscoket will automatically be connected to. the webconsumer should detect whose friends list does this user appear in/belong to, and trigger the addition of this user into that person's online friends list (not actual friend list)
# on disconnect, when a user logs out, the websocket will be triggered to close. the webconsumer should again detect in which friend list this user appeared in to trigger the remove of that person from the online friends list (not actual friend list)

class OnlineConsumer(WebsocketConsumer):
    logged_in = {}
    playing = {} # busy

    # when a user logs in
    def connect(self):
        self.user = self.scope['user']
        user_id = self.scope['url_route']['kwargs']['user_id']
        if not self.user.is_authenticated or str(self.user.id) != user_id:
            self.close(3000)
            return

        self.room_name = self.user.id
        self.room_group_name = f'friends_{self.room_name}'
        if self.room_group_name not in self.logged_in:
            self.logged_in[self.room_group_name] = set()

        self.accept()

        # find friends
        self.friends = self.get_friends()

        # send the online status
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.notify_friends_online()

        # change to check friends (and then decide in there if they are online or playing)
        self.check_friends_online()
        self.check_friends_playing()

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
            room_friend_name = f'friends_{friend.id}'
            async_to_sync(self.channel_layer.group_send)(
                room_friend_name,
                {
                    'type': 'notify.online',
                    'user': self.user.username
                }
            )

    def notify_online(self, event):
        friend = event['user']

        self.send(text_data=json.dumps({
            'status': 'online',
            'friend': friend,
            'message': f'{friend} has come online.',
            'type': 'notified'
        }))

    def check_friends_online(self):
        friends = async_to_sync(self.get_friends)()

        for friend in friends:
            room_friend_name = f'friends_{friend.id}'
            if room_friend_name in self.logged_in:
                #async_to_sync(self.channel_layer.group_send)(
                #    self.room_group_name,
                #    {
                #        'type': 'check.online',
                #        'user': friend.username
                #    }
                #)
                self.send(text_data=json.dumps({
                    'status': 'online',
                    'friend': friend.username,
                    'message': f'{friend} is online.',
                    'type': 'checking'
                }))

    #def check_online(self, event):
    #    friend = event['user']

    #    self.send(text_data=json.dumps({
    #        'status': 'online',
    #        'friend': friend,
    #        'message': f'{friend} is online.',
    #        'type': 'checking'
    #    }))

    def check_friends_playing(self):
        friends = async_to_sync(self.get_friends)()

        for friend in friends:
            room_friend_name = f'friends_{friend.id}'
            if room_friend_name in self.playing:
                #async_to_sync(self.channel_layer.group_send)(
                #    self.room_group_name,
                #    {
                #        'type': 'check.playing',
                #        'user': friend.username
                #    }
                #)
                self.send(text_data=json.dumps({
                    'status': 'playing',
                    'friend': friend.username,
                    'message': f'{friend} is busy.',
                    'type': 'checking'
                }))

    #def check_playing(self, event):
    #    friend = event['user']

    #    self.send(text_data=json.dumps({
    #        'status': 'playing',
    #        'friend': friend,
    #        'message': f'{friend} is busy.',
    #        'type': 'checking'
    #    }))

    # when a user logs out
    def disconnect(self, code):
        self.notify_friends_offline()

        if self.room_group_name in self.logged_in:
            del self.logged_in[self.room_group_name]
        if self.room_group_name in self.playing:
            del self.playing[self.room_group_name]

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def notify_friends_offline(self):
        friends = async_to_sync(self.get_friends)()

        for friend in friends:
            room_friend_name = f'friends_{friend.id}'
            async_to_sync(self.channel_layer.group_send)(
                room_friend_name,
                {
                    'type': 'notify.offline',
                    'user': self.user.username,
                }
            )

    def notify_offline(self, event):
        friend = event['user']

        self.send(text_data=json.dumps({
            'status': 'offline',
            'friend': friend,
            'message': f'{friend} has gone offline.',
            'type': 'notified'
        }))

    def receive(self, text_data):
        text_json = json.loads(text_data)
        sender = text_json['user']
        action = text_json['action']

        # before a user logs out (detected by disconnect)
        #if action == 'logout':

        if action == 'change_view':
            self.notify_friends_playing()

    def notify_friends_playing(self):
        friends = async_to_sync(self.get_friends)()

        if self.room_group_name not in self.playing:
            self.playing[self.room_group_name] = set()
        if self.room_group_name in self.logged_in:
            del self.logged_in[self.room_group_name]

        for friend in friends:
            room_friend_name = f'friends_{friend.id}'
            async_to_sync(self.channel_layer.group_send)(
                room_friend_name,
                {
                    'type': 'notify.playing',
                    'user': self.user.username,
                }
            )

    def notify_playing(self, event):
        friend = event['user']

        self.send(text_data=json.dumps({
            'status': 'playing',
            'friend': friend,
            'message': f'{friend} is busy.',
            'type': 'notified'
        }))
