from django.shortcuts import render

# Create your views here.
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer
from dj_rest_auth.views import LoginView
from dj_rest_auth.utils import jwt_encode
from user_auth.utils import is_mfa_enabled
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from datetime import timedelta
import random
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.core.cache import cache
from django.middleware.csrf import get_token
import smtplib

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

# dj_rest_auth/views.py
class CustomLoginView(LoginView):
    def get_response(self, mfa_enabled, data):
        serializer_class = self.get_response_serializer()

        if mfa_enabled and data.get('phase') == 'four':
            self.login()

        if (not mfa_enabled and data.get('phase') == 'one') or (mfa_enabled and data.get('phase') == 'four'):
            from dj_rest_auth.app_settings import api_settings
            from rest_framework_simplejwt.settings import (
                api_settings as jwt_settings,
            )
            access_token_expiration = (timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME)
            refresh_token_expiration = (timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME)
            return_expiration_times = api_settings.JWT_AUTH_RETURN_EXPIRATION
            auth_httponly = api_settings.JWT_AUTH_HTTPONLY

            data = {
                'user': self.user,
                'access': self.access_token,
            }

            if not auth_httponly:
                data['refresh'] = self.refresh_token
            else:
                data['refresh'] = ''

            if return_expiration_times:
                data['access_expiration'] = access_token_expiration
                data['refresh_expiration'] = refresh_token_expiration

            serializer = serializer_class(
                instance=data,
                context=self.get_serializer_context(),
            )

            response = Response(serializer.data, status=status.HTTP_200_OK)
            from dj_rest_auth.jwt_auth import set_jwt_cookies
            set_jwt_cookies(response, self.access_token, self.refresh_token)
            return response
        else:
            return Response({'mfa': mfa_enabled}, status=status.HTTP_202_ACCEPTED)

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(data=self.request.data)
        self.serializer.is_valid(raise_exception=True)

        mfa_enabled = is_mfa_enabled(request)
        if not mfa_enabled:
            self.login()
            return self.get_response(mfa_enabled, request.data)

        return self.get_response(mfa_enabled, request.data)

OTP_EXPIRATION = 80
# OTP_MAX_ATTEMPTS = 3

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    username = request.data.get('username')
    user_data = User.objects.filter(username__iexact=username).last()
    email = user_data.email

    key_otp_code = f'otp_code_{email}'
    otp_stored = cache.get(key_otp_code)

    if otp_stored is None:
        otp = str(random.randint(100000, 999999))
        cache.set(key_otp_code, otp, timeout=OTP_EXPIRATION)
        try:
            send_mail(
                '[FT_PONG] Verify the OTP',
                f'Your 6-digit OTP code is: {otp}. Enjoy your Pong game!',
                'team@ftpong.com',
                [email],
                fail_silently=False,
            )
            retval = Response({'detail': 'OTP sent to registered email.'}, status=status.HTTP_200_OK)
            csrf_token = get_token(request)
            retval.set_cookie('csrftoken', csrf_token)
            return retval
        except smtplib.SMTPException:
            retval = Response({'detail': 'Server failed to send OTP to registered email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            csrf_token = get_token(request)
            retval.set_cookie('csrftoken', csrf_token)
            return retval
    else:
        retval = Response({'detail': 'OTP verification pending.'}, status=status.HTTP_200_OK)
        csrf_token = get_token(request)
        retval.set_cookie('csrftoken', csrf_token)
        return retval

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    username = request.data.get('username')
    otp_received = request.data.get('otp')
    user_data = User.objects.filter(username__iexact=username).last()
    email = user_data.email

    key_otp_code = f'otp_code_{email}'
    otp_sent = cache.get(key_otp_code)

    if otp_sent and otp_received == otp_sent:
        cache.clear() # or set a cache for verified
        return Response({'detail': 'OTP verification success.'}, status=status.HTTP_200_OK)
    else:
        if otp_sent is None:
            content = {'detail': 'OTP has expired.'}
            re_status=status.HTTP_410_GONE
        elif otp_received != otp_sent:
            content = {'detail': 'OTP verification failed.'}
            re_status=status.HTTP_401_UNAUTHORIZED
        return Response(content, status=re_status)
