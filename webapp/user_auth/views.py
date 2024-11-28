from django.shortcuts import render

# Create your views here.
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer
from dj_rest_auth.views import LoginView
from dj_rest_auth.utils import jwt_encode
from user_profiles.models import Profile
from mfa_email.models import MfaEmail

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

class CustomLoginView(LoginView):
    def generate_otp():
        return "".join(map(str, random.sample(range(0, 10), n)))

    def login(self):
        self.user = self.serializer.validated_data['user']
        self.access_token, self.refresh_token = jwt_encode(self.user)
