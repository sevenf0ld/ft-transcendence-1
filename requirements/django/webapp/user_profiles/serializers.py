from rest_framework import serializers

from .models import Profile

class ProfileModelSerializer(serializers.ModelSerializer):
    played = serializers.SerializerMethodField()
    win_rate = serializers.SerializerMethodField()

    def get_played(self, obj):
        total_matches = obj.wins + obj.losses
        return total_matches

    def get_win_rate(self, obj):
        total_matches = obj.wins + obj.losses
        if total_matches == 0:
            return 0
        return round(obj.wins / total_matches * 100, 2)

    class Meta:
        model = Profile
        # avatar and language to be added
        #fields = '__all__'
        fields = ['played', 'win_rate', 'wins', 'losses', 'nickname', 'mfa_email_enabled', 'language']

class UploadAvatarSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance

    class Meta:
        model = Profile
        fields = ['avatar']

class FriendProfileModelSerializer(serializers.ModelSerializer):
    played = serializers.SerializerMethodField()
    win_rate = serializers.SerializerMethodField()

    def get_played(self, obj):
        total_matches = obj.wins + obj.losses
        return total_matches

    def get_win_rate(self, obj):
        total_matches = obj.wins + obj.losses
        if total_matches == 0:
            return 0
        return round(obj.wins / total_matches * 100, 2)

    class Meta:
        model = Profile
        # avatar to add
        fields = ['played', 'win_rate', 'wins', 'losses']

class FriendProfileTargetSerializer(serializers.Serializer):
    target = serializers.CharField(required=True)
