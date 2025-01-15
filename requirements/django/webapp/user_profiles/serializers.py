from rest_framework import serializers

from .models import Profile

class ProfileModelSerializer(serializers.ModelSerializer):
    played = serializers.SerializerMethodField()
    win_rate = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    def get_played(self, obj):
        total_matches = obj.wins + obj.losses
        return total_matches

    def get_win_rate(self, obj):
        total_matches = obj.wins + obj.losses
        if total_matches == 0:
            return 0
        return round(obj.wins / total_matches * 100, 2)

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        avatar_url = obj.avatar.url
        return request.build_absolute_uri(avatar_url)

    class Meta:
        model = Profile
        fields = ['played', 'win_rate', 'wins', 'losses', 'nickname', 'mfa_email_enabled', 'language', 'avatar_url']

class FriendProfileModelSerializer(serializers.ModelSerializer):
    played = serializers.SerializerMethodField()
    win_rate = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    def get_played(self, obj):
        total_matches = obj.wins + obj.losses
        return total_matches

    def get_win_rate(self, obj):
        total_matches = obj.wins + obj.losses
        if total_matches == 0:
            return 0
        return round(obj.wins / total_matches * 100, 2)

    def get_avatar_url(self, obj):
        return self.context.get('request').build_absolute_uri(obj.avatar.url)

    class Meta:
        model = Profile
        fields = ['played', 'win_rate', 'wins', 'losses', 'avatar_url']

class FriendProfileTargetSerializer(serializers.Serializer):
    target = serializers.CharField(required=True)
