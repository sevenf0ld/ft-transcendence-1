from django.shortcuts import render

# Create your views here.
#from rest_framework import viewsets
from .models import Profile
#from .serializers import ProfileModelSerializer
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
#from .forms import UploadAvatarForm
from .serializers import UploadAvatarSerializer

#class ProfileViewSet(viewsets.ModelViewSet):
#    serializer_class = ProfileModelSerializer
#    queryset = Profile.objects.all()

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
#@authentication_classes([JWTCookieAuthentication])
@permission_classes([AllowAny])
def upload_avatar(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'details': 'Unauthenticated user.'}, status=status.HTTP_401_UNAUTHORIZED)

    avatar = request.FILES.get('avatar')
    if not avatar:
        return Response({'details': 'No profile picture provided for upload.'}, status=status.HTTP_400_BAD_REQUEST)

    profile_data = Profile.objects.get(user=user)

    #serializer = UploadAvatarSerializer(
    #    instance=profile_data,
    #    data={'avatar': avatar},
    #    partial=True
    #)
    #if serializer.is_valid():
    #    serializer.save()
    #    return Response({'details': 'Profile picture uploaded.'}, status=status.HTTP_200_OK)
    #return Response({'details': 'Failed to upload profile picture'}, status=status.HTTP_400_BAD_REQUEST)

    profile_data.avatar = avatar
    profile_data.save()
    return Response({'details': 'Profile picture uploaded.'}, status=status.HTTP_200_OK)

