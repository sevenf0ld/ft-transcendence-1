from rest_framework import serializers

from .models import Profile

class ProfileModelSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Profile
        fields = '__all__'

class UploadAvatarSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance

    class Meta:
        model = Profile
        fields = ['avatar']
