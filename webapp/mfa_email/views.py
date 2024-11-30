from django.shortcuts import render

# Create your views here.
from datetime import timedelta
import random
from django.utils import timezone
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
#from user_profiles.models import Profile
from mfa_email.models import MfaEmail
from django.contrib.auth.models import User

def generate_random_digits(n=6):
    return "".join(map(str, random.sample(range(0, 10), n)))

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    username = request.data.get('username')
    user_data = User.objects.get(username=username)
    email = user_data.email

    mfa_user = MfaEmail.objects.create(user=user_data)
    mfa_user.otp = generate_random_digits()
    #mfa_user.otp_expiry_time = timezone.localtime(timezone.now()) + timedelta(hours=1)
    mfa_user.otp_expiry_time = timezone.now() + timedelta(hours=1)
    mfa_user.save()

    send_mail(
        '[FT_PONG] Verify the OTP',
        f'Your OTP code is: {mfa_user.otp}',
        'team@ftpong.com',
        [email],
        fail_silently=False,
    )

    return Response({'detail': 'OTP sent successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    username = request.data.get('username')
    otp_code = request.data.get('otp')
    user_data = User.objects.get(username=username)

    mfa_user = MfaEmail.objects.filter(user=user_data).last()
    if mfa_user.otp == otp_code and
        mfa_user.otp_expiry_time < timezone.now():
        return Response({'detail': 'OTP verification success.'}, status=status.HTTP_200_OK)
    return Response({'detail': 'OTP verification failed.'}, status=status.HTTP_401_UNAUTHORIZED)
