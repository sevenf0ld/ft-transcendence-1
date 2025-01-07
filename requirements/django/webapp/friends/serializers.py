from rest_framework import serializers

from .models import FriendList, FriendRequest
from django.contrib.auth.models import User
from user_profiles.models import Profile

#=================================#
#=========friend request==========#
#=================================#

class FriendRequestModelSerializer(serializers.ModelSerializer):
    sender_avatar_url = serializers.SerializerMethodField()
    recipient_avatar_url = serializers.SerializerMethodField()

    def get_sender_avatar_url(self, instance):
        sender_profile = Profile.objects.get(user=instance.sender)
        return self.context.get('request').build_absolute_uri(sender_profile.avatar.url)

    def get_recipient_avatar_url(self, instance):
        recipient_profile = Profile.objects.get(user=instance.recipient)
        return self.context.get('request').build_absolute_uri(recipient_profile.avatar.url)

    def to_representation(self, instance):
        return {
            'sender': instance.sender.username,
            'sender_avatar_url': self.get_sender_avatar_url(instance),
            'recipient': instance.recipient.username,
            'recipient_avatar_url': self.get_recipient_avatar_url(instance),
            #'pk': instance.id # for development purposes, to test retrieve
        }

    # customized .validated_data accessible upon calling is_valid
    def to_internal_value(self, data):
        sender_username = data.get('sender')
        if not sender_username:
            raise serializers.ValidationError({
                'sender': 'This field is required.'
            })
        recipient_username = data.get('recipient')
        if not recipient_username:
            raise serializers.ValidationError({
                'recipient': 'This field is required.'
            })
        try:
            sender = User.objects.get(username__iexact=sender_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'sender': 'Non-existent user.'
            })
        try:
            recipient = User.objects.get(username__iexact=recipient_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'recipient': 'Non-existent user.'
            })
        return {
            'sender': sender,
            'recipient': recipient
        }

    # {'sender': <User: tmp>, 'recipient': <User: fake>}
    # data is as designed by to_internal_value
    def validate(self, data):
        sender = data.get('sender')
        recipient = data.get('recipient')
        if sender == recipient:
            raise serializers.ValidationError({
                'detail': 'Friend requests to oneself is prohibited.'
            })
        return data

    class Meta: 
        model = FriendRequest
        exclude = ['is_active', 'timestamp']

#=================================#
#==========friend list============#
#=================================#

# consider omitting display and create separate urls (not preferable)
class FriendListDisplayModelSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    friends = serializers.SerializerMethodField()
    friends_avatars = serializers.SerializerMethodField()
    num_of_friends = serializers.SerializerMethodField()
    blocked = serializers.SerializerMethodField()
    blocked_avatars = serializers.SerializerMethodField()
    num_of_blocked = serializers.SerializerMethodField()
    outgoing = serializers.SerializerMethodField()
    outgoing_avatars = serializers.SerializerMethodField()
    num_of_outgoing = serializers.SerializerMethodField()
    incoming = serializers.SerializerMethodField()
    incoming_avatars = serializers.SerializerMethodField()
    num_of_incoming = serializers.SerializerMethodField()

    #def to_internal_value(self, data):
    #    user_username = data.get('user')
    #    if not user_username:
    #        raise serializers.ValidationError({
    #            'user': 'This field is required.'
    #        })
    #    try:
    #        user = User.objects.get(username=user_username)
    #    except User.DoesNotExist:
    #        raise serializers.ValidationError({
    #            'sender': 'Non-existent user.'
    #        })
    #    #display = data.get('display')
    #    #if display is None:
    #    #    raise serializers.ValidationError({
    #    #        'display': 'This field is required.'
    #    #    })
    #    #if display.lower() not in ['added', 'pending', 'blocked']:
    #    #    raise serializers.ValidationError({
    #    #        'display': 'Non-existent friend list section.'
    #    #    })
    #    return {
    #        'user': user,
    #        #'display': display
    #    }

    def get_friends(self, obj):
        return [friend.username for friend in obj.friends.all()]

    def get_friends_avatars(self, obj):
        return [self.context['request'].build_absolute_uri(Profile.objects.get(user=friend).avatar.url) for friend in obj.friends.all()]

    def get_num_of_friends(self, obj):
        return obj.friends.count()

    def get_blocked(self, obj):
        return [blockee.username for blockee in obj.blocked.all()]

    def get_blocked_avatars(self, obj):
        return [self.context['request'].build_absolute_uri(Profile.objects.get(user=blockee).avatar.url) for blockee in obj.blocked.all()]

    def get_num_of_blocked(self, obj):
        return obj.blocked.count()

    def get_outgoing(self, obj):
        outgoing = FriendRequest.objects.filter(sender=obj.user, is_active=True)
        return [request.recipient.username for request in outgoing]

    def get_outgoing_avatars(self, obj):
        outgoing = FriendRequest.objects.filter(sender=obj.user, is_active=True)
        return [self.context['request'].build_absolute_uri(Profile.objects.get(user=request.recipient).avatar.url) for request in outgoing]

    def get_num_of_outgoing(self, obj):
        return FriendRequest.objects.filter(sender=obj.user, is_active=True).count()

    def get_incoming(self, obj):
        incoming = FriendRequest.objects.filter(recipient=obj.user, is_active=True)
        return [request.sender.username for request in incoming]

    def get_incoming_avatars(self, obj):
        incoming = FriendRequest.objects.filter(recipient=obj.user, is_active=True)
        return [self.context['request'].build_absolute_uri(Profile.objects.get(user=request.sender).avatar.url) for request in incoming]

    def get_num_of_incoming(self, obj):
        return FriendRequest.objects.filter(recipient=obj.user, is_active=True).count()

    class Meta: 
        model = FriendList
        fields = ['user', 'friends', 'friends_avatars', 'num_of_friends', 'blocked', 'blocked_avatars', 'num_of_blocked', 'outgoing', 'outgoing_avatars', 'num_of_outgoing', 'incoming', 'incoming_avatars', 'num_of_incoming']

class FriendListUpdateModelSerializer(serializers.ModelSerializer):
    sender_avatar_url = serializers.SerializerMethodField()
    recipient_avatar_url = serializers.SerializerMethodField()

    def get_sender_avatar_url(self, instance):
        sender_profile = Profile.objects.get(user=instance.sender)
        return self.context.get('request').build_absolute_uri(sender_profile.avatar.url)

    def get_recipient_avatar_url(self, instance):
        recipient_profile = Profile.objects.get(user=instance.recipient)
        return self.context.get('request').build_absolute_uri(recipient_profile.avatar.url)

    def to_internal_value(self, data):
        user_username = data.get('user')
        if not user_username:
            raise serializers.ValidationError({
                'user': 'This field is required.'
            })
        target_username = data.get('target')
        if not target_username:
            raise serializers.ValidationError({
                'target': 'This field is required.'
            })
        try:
            user = User.objects.get(username__iexact=user_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'user': 'Non-existent user.'
            })
        try:
            target = User.objects.get(username__iexact=target_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'target': 'Non-existent user.'
            })
        return {
            'user': user,
            'target': target
        }

    def validate(self, data):
        user = data.get('user')
        target = data.get('target')
        if user == target:
            raise serializers.ValidationError({
                'detail': 'Updating friendship status with yourself is prohibited.'
            })
        return data

    class Meta: 
        model = FriendList
        exclude = ['friends', 'blocked']
