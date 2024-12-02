from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth.models import User

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
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('Email address is taken.')
        return email
