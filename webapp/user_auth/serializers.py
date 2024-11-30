from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from dj_rest_auth.serializers import LoginSerializer
from mfa_email.models import MfaEmail

try:
    from allauth.account import app_settings as allauth_account_settings
    from allauth.account.adapter import get_adapter
    from allauth.socialaccount.models import EmailAddress
except ImportError:
    raise ImportError('allauth needs to be added to INSTALLED_APPS.')

# dj_rest_auth/registration/serializers.py
class CustomRegisterSerializer(RegisterSerializer):
    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_account_settings.UNIQUE_EMAIL:
            if email and EmailAddress.objects.is_verified(email):
                raise serializers.ValidationError(
                    ('A user is already registered with this e-mail address.'),
                )
        existing_email = User.objects.filter(email=email).first()
        if existing_email:
            raise serializers.ValidationError('A user is already registered with this e-mail address.')
        return email

# dj_rest_auth/serializers.py
class CustomLoginSerializer(LoginSerializer):
    pass
    #mfa_enabled = serializers.BooleanField(required=False)
    #mfa_otp = serializers.CharField(required=False, allow_blank=True)
    #mfa_expiry = serializers.DateTimeField(required=False)
