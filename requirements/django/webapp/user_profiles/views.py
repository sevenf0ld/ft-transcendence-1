from django.shortcuts import render

# Create your views here.
#from rest_framework import viewsets
from .models import Profile
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import FriendProfileModelSerializer, FriendProfileTargetSerializer, ProfileModelSerializer
from typing import Dict, Any
from .utils import is_current_lang
from dj_rest_auth.jwt_auth import JWTCookieAuthentication

#class ProfileViewSet(viewsets.ModelViewSet):
#    serializer_class = ProfileModelSerializer
#    queryset = Profile.objects.all()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTCookieAuthentication])
def upload_avatar(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'details': 'Unauthenticated user.'}, status=status.HTTP_401_UNAUTHORIZED)

    avatar = request.FILES.get('avatar')
    if not avatar:
        return Response({'details': 'No profile picture provided for upload.'}, status=status.HTTP_400_BAD_REQUEST)

    profile_data = Profile.objects.get(user=user)

    profile_data.avatar = avatar
    profile_data.save()
    content = {
        'details': 'Profile picture uploaded.',
        'avatar_url': request.build_absolute_uri(profile_data.avatar.url)
    }
    return Response(content, status=status.HTTP_200_OK)

class FriendProfileRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = FriendProfileModelSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_serializer_context(self) -> Dict[str, Any]:
        context: Dict[str, Any] = super().get_serializer_context()
        query = FriendProfileTargetSerializer(data=self.request.query_params)
        context['request'] = self.request

        if query.is_valid(raise_exception=True):
            data = query.validated_data
            self.query_data = data
            context['target'] = self.query_data.get('target')
        return context

    def get_object(self):
        target =  self.get_serializer_context().get('target')
        print(target)
        target_data = User.objects.get(username__iexact=target)

        fp = Profile.objects.get(user=target_data)

        self.check_object_permissions(self.request, fp)

        return fp

class HomeProfileRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileModelSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def get_object(self):
        profile = Profile.objects.get(user=self.request.user)

        self.check_object_permissions(self.request, profile)

        return profile

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTCookieAuthentication])
def update_user_language(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'details': 'Unauthenticated user.'}, status=status.HTTP_401_UNAUTHORIZED)

    lang = request.data.get('lang')
    if lang is None:
        return Response({'details': 'Language selection required.'}, status=status.HTTP_400_BAD_REQUEST)

    if lang not in Profile.LANGUAGE_CHOICES:
        return Response({'details': 'Selected language is not supported.'}, status=status.HTTP_400_BAD_REQUEST)
    if is_current_lang(user, lang):
        return Response({'details': f'{lang} has already been selected.'}, status=status.HTTP_400_BAD_REQUEST)

    profile = Profile.objects.get(user=user)
    profile.language = lang
    profile.save()
    return Response({'details': f'{lang} has been updated.'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
#@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTCookieAuthentication])
def remove_avatar(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'details': 'Unauthenticated user.'}, status=status.HTTP_401_UNAUTHORIZED)

    profile_data = Profile.objects.get(user=user)

    if profile_data.avatar.name != 'avatars/default.jpg':
        profile_data.avatar.delete(save=False)
        profile_data.avatar = 'avatars/default.jpg'
        profile_data.save()

        return Response({'details': 'Profile picture removed. Set to default.'}, status=status.HTTP_204_NO_CONTENT)
        #return Response({'details': 'Profile picture removed. Set to default.'}, status=status.HTTP_200_OK)
    else:
        return Response({'details': 'No profile picture to remove.'}, status=status.HTTP_400_BAD_REQUEST)
