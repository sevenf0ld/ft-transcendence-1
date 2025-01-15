from django.shortcuts import render

# Create your views here.
from dj_rest_auth.registration.views import RegisterView
from .serializers import (
    CustomRegisterSerializer,
    #UserAccountUpdateModelSerializer,
)
from dj_rest_auth.views import LoginView
from dj_rest_auth.utils import jwt_encode
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from datetime import timedelta
import random
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.cache import cache
from django.middleware.csrf import get_token
import smtplib
from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from .utils import (
    is_mfa_enabled,
    is_current_email,
    is_existing_email,
    is_current_password,
    is_valid_password,
    enable_mfa,
    disable_mfa,
    get_mfa_status,
)

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
        except smtplib.SMTPException:
            retval = Response({'detail': 'Server failed to send OTP to registered email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
        retval = Response({'detail': 'OTP verification success.'}, status=status.HTTP_200_OK)
    else:
        if otp_sent is None:
            content = {'detail': 'OTP has expired.'}
            re_status=status.HTTP_410_GONE
        elif otp_received != otp_sent:
            content = {'detail': 'OTP verification failed.'}
            re_status=status.HTTP_400_BAD_REQUEST
        retval = Response(content, status=re_status)
    csrf_token = get_token(request)
    retval.set_cookie('csrftoken', csrf_token)
    return retval

#class UserAccountUpdateAPIView(generics.UpdateAPIView):
#    queryset = User.objects.all()
#    serializer_class = UserAccountUpdateModelSerializer
#    #permission_classes = [IsAuthenticated]
#    permission_classes = [AllowAny]
#@api_view(['PATCH'])
#@permission_classes([IsAuthenticated])
#@permission_classes([AllowAny])
#def update_user_account(request):
#    user = request.user
#
#    current_pw = request.data.get('current_pw')
#    # remove after frontend form validation
#    if current_pw is None:
#        return Response({'details': 'Password required.'}, status=status.HTTP_400_BAD_REQUEST)
#
#    new_email = request.data.get('new_email')
#    new_pw = request.data.get('new_pw')
#    confirm_pw = request.data.get('confirm_pw')
#
#    # remove after frontend form validation
#    if new_email is None and new_pw is None and confirm_pw is None:
#        return Response({'details': 'All empty fields.'}, status=status.HTTP_400_BAD_REQUEST)
#    if new_pw and confirm_pw is None or confirm_pw and new_pw is None:
#        return Response({'details': 'Empty password field.'}, status=status.HTTP_400_BAD_REQUEST)
#
#    if new_email:
#        if is_current_email(user, new_email):
#            return Response({'details': 'New e-mail same as current e-mail.'}, status=status.HTTP_400_BAD_REQUEST)
#        if is_existing_email(new_email):
#            return Response({'details': 'E-mail address is already taken.'}, status=status.HTTP_400_BAD_REQUEST)
#        user.email = new_email
#        user.save()
#        enable_mfa(user)
#        content = {'detail': 'E-mail address updated. 2FA is automatically enabled on e-mail change.'}
#        #return Response({'details': 'E-mail address updated.'}, status=status.HTTP_200_OK)
#
#    if new_pw != confirm_pw:
#        return Response({'details': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
#    if is_current_password(user, new_pw):
#        return Response({'details': 'New password same as old password.'}, status=status.HTTP_400_BAD_REQUEST)
#    invalidity = is_valid_password(user, new_pw)
#    if invalidity is None:
#        #user.password = make_password(new_pw)
#        user.set_password(new_pw)
#        user.save()
#        content = {'detail': 'Password updated.'}
#        #return Response({'details': 'Password updated.'}, status=status.HTTP_200_OK)
#    else:
#        return Response({'details': invalidity}, status=status.HTTP_400_BAD_REQUEST)
#
#    if new_email and new_password:
#        content = {'detail': 'E-mail address and password updated. 2FA is automatically enabled on e-mail change.'}
#
#    return Response(content, status=status.HTTP_200_OK)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTCookieAuthentication])
def update_user_password(request):
    user = request.user

    current_pw = request.data.get('current_pw')
    if current_pw == "":
        return Response({'details': 'Password required.'}, status=status.HTTP_400_BAD_REQUEST)

    new_pw = request.data.get('new_pw')
    confirm_pw = request.data.get('confirm_pw')

    if new_pw == "" and confirm_pw == "":
        return Response({'details': 'Empty password fields.'}, status=status.HTTP_400_BAD_REQUEST)
    if new_pw != "" and confirm_pw == "" or confirm_pw != "" and new_pw == "":
        return Response({'details': 'Empty password field.'}, status=status.HTTP_400_BAD_REQUEST)

    if new_pw != confirm_pw:
        return Response({'details': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
    if not is_current_password(user, current_pw):
        return Response({'details': 'Invalid current password.'}, status=status.HTTP_400_BAD_REQUEST)
    if is_current_password(user, new_pw):
        return Response({'details': 'New password same as old password.'}, status=status.HTTP_400_BAD_REQUEST)
    invalidity = is_valid_password(user, new_pw)
    if invalidity is None:
        user.set_password(new_pw)
        user.save()
        content = {'detail': 'Password updated.'}
    else:
        return Response({'details': invalidity}, status=status.HTTP_400_BAD_REQUEST)

    return Response(content, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTCookieAuthentication])
def update_user_mfa(request):
    user = request.user

    mfa = request.data.get('mfa')
    if mfa is None:
        return Response({'details': '2FA instruction required.'}, status=status.HTTP_400_BAD_REQUEST)

    if mfa == 'on' and get_mfa_status(request) == True:
        return Response({'details': '2FA is already enabled.'}, status=status.HTTP_400_BAD_REQUEST)
    if mfa == 'off' and get_mfa_status(request) == False:
        return Response({'details': '2FA is already disabled.'}, status=status.HTTP_400_BAD_REQUEST)

    if mfa == 'on' and get_mfa_status(request) == False:
        enable_mfa(user)
        content = {'detail': '2FA enabled.'}
    elif mfa == 'off' and get_mfa_status(request) == True:
        disable_mfa(user)
        content = {'detail': '2FA disabled.'}
    return Response(content, status=status.HTTP_200_OK)
