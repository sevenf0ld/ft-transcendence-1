from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .models import Profile, Match
from .serializers import FriendGetSerializer, FriendPostSerializer, LoginSerializer, LogoutSerializer, MatchSerializer, ProfileGetSerializer, ProfilePutSerializer, RegisterSerializer, ResetPasswordSerializer

class FriendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = request.user.profile
        friends = user_profile.friends.all()
        serializer = FriendGetSerializer(friends, many=True)
        return Response(serializer.data)

    def post(self, request, username):
        serializer = FriendPostSerializer(data={'friend_username': username}, context={'request': request})
        if serializer.is_valid():
            result = serializer.save()
            return Response(result, status=status.HTTP_200_OK)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            tokens = serializer.save()
            return Response({
                'access_token': tokens['access_token'],
                'refresh_token': tokens['refresh_token']
            }, status=status.HTTP_200_OK)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'User logged out successfully!'}, status=status.HTTP_200_OK)


class MatchView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer

    def get_queryset(self):
        user_profile = self.request.user.profile
        return Match.objects.filter(player_one=user_profile)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # TODO: Not checked yet
    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileGetSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfilePutSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully!'}, status=status.HTTP_200_OK)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update_password(serializer.validated_data)
            return Response({'message': 'Password reset successfully!'}, status=status.HTTP_200_OK)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
