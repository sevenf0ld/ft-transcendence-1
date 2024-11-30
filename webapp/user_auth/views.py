from django.shortcuts import render

# Create your views here.
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer, CustomLoginSerializer
from dj_rest_auth.views import LoginView
from dj_rest_auth.utils import jwt_encode
from mfa_email.models import MfaEmail
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from mfa_email.views import send_otp

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

# dj_rest_auth/views.py
class CustomLoginView(LoginView):
    #serializer_class = CustomLoginSerializer

    def get_response(self, mfa_enabled):
        serializer_class = self.get_response_serializer()

        if not mfa_enabled:
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
                data['refresh'] = ""

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

        mfa_enabled = MfaEmail.is_mfa_enabled(request)
        if not mfa_enabled:
            self.login()
            return self.get_response(mfa_enabled)

        return self.get_response(mfa_enabled)
        #if timezone.localtime(timezone.now()) >= mfa_data.otp_expiry_time:
        #    print("EXPIRED BITCH")
        #else:
        #    print("YOUR OTP HASNT EXPIRED")

class ProcessLoginView(APIView):
    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        # nonexistent user
        user_data = User.objects.filter(username=username).first()
        if not user_data:
            return Response({'detail': 'Unable to log in with provided credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        email = user_data.email
        # wrong password
        user = authenticate(request, username=username, email=email, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        mfa_enabled = MfaEmail.is_mfa_enabled(request)
        return Response({'mfa': mfa_enabled}, status=status.HTTP_200_OK)
        if mfa_enabled:
            mfa_data = MfaEmail.get_mfa_details(request)
