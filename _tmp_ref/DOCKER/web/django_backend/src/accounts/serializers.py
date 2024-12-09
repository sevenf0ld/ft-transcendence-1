from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import Profile, Match

class FriendGetSerializer(serializers.ModelSerializer):
    online_status = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user', 'online_status']
        depth = 1

    def get_online_status(self, obj):
        return obj.is_online()


class FriendPostSerializer(serializers.Serializer):
    friend_username = serializers.CharField(write_only=True)
    message = serializers.CharField(read_only=True)

    def validate_friend_username(self, value):
        request_user = self.context['request'].user
        if value == request_user.username:
            raise serializers.ValidationError('You cannot add yourself as a friend.')
        try:
            friend_user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found.')
        friend_profile = Profile.objects.get(user=friend_user)
        if friend_profile in request_user.profile.friends.all():
            raise serializers.ValidationError('You are already friends with this user.')
        return value

    def create(self, validate_data):
        user = self.context['request'].user
        friend_username = validate_data['friend_username']
        friend_user = User.objects.get(username=friend_username)
        friend_profile = Profile.objects.get(user=friend_user)
        user.profile.friends.add(friend_profile)
        return {'message': f'{friend_username} has been added as a friend.'}


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    access_token = serializers.CharField(read_only=True)
    refresh_token = serializers.CharField(read_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid username or password.')
        data['user'] = user 
        return data

    def create(self, validated_data):
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)
        return {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }


class LogoutSerializer(serializers.Serializer):
    refreshToken = serializers.CharField()

    def validate_refresh_token(self, value):
        try:
            token = RefreshToken(value)
            token.blacklist()
        except TokenError:
            pass
        return value


class MatchSerializer(serializers.ModelSerializer):
    player_one = serializers.StringRelatedField()
    player_two = serializers.CharField()

    class Meta:
        model = Match
        fields = ['player_one', 'player_two', 'match_date', 'player_one_score', 'player_two_score']


class ProfileGetSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'avatar', 'wins', 'losses', 'friends']
        depth = 1


class ProfilePutSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.CharField(source='user.email', required=False)
    password = serializers.CharField(write_only=True, required=False)
    confirmPassword = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'password', 'confirmPassword', 'avatar']

    def validate_username(self, value):
        if value and User.objects.filter(username=value).exclude(pk=self.instance.user.pk).exists():
            raise serializers.ValidationError('This username is already taken. Please choose another.')
        return value

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exclude(pk=self.instance.user.pk).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate(self, data):
        password = data.get('password')
        confirmPassword = data.get('confirmPassword')
        if password or confirmPassword:
            if password != confirmPassword:
                raise serializers.ValidationError('Passwords do not match')
            validate_password(password)
        return data

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        if username:
            instance.user.username = username
        if email:
            instance.user.email = email
        if password:
            instance.user.set_password(password)
        instance.user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta: 
        model = User
        fields = ['username', 'email', 'password', 'confirmPassword']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('This username is already taken, please choose another one.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists')
        return value

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError('Passwords do not match')        
        validate_password(data.get('password'))
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user)
        return user


class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if not User.objects.filter(username=value).exists():
            raise serializers.ValidationError('User does not exist')
        return value

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError('Passwords do not match')
        validate_password(data.get('password'))
        return data

    def update_password(self, validated_data):
        user = User.objects.get(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
