from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
import re
from django.conf import settings

try:
    from allauth.account import app_settings as allauth_account_settings
    from allauth.account.adapter import get_adapter
    #from allauth.socialaccount.models import EmailAddress
    #from allauth.account.models import EmailAddress
    from allauth.utils import email_address_exists
except ImportError:
    raise ImportError('allauth needs to be added to INSTALLED_APPS.')

# dj_rest_auth/registration/serializers.py
# https://github.com/iMerica/dj-rest-auth/pull/539/files
class CustomRegisterSerializer(RegisterSerializer):
    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_account_settings.UNIQUE_EMAIL:
            #if email and EmailAddress.objects.is_verified(email):
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    ('A user is already registered with this e-mail address.'),
                )
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('Email address is taken.')
        return email

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        blacklisted = allauth_account_settings.USERNAME_BLACKLIST
        pattern = r'(?i)(' + '|'.join(map(re.escape, blacklisted)) + r')'
        if re.search(pattern, username):
            raise serializers.ValidationError('Username is blacklisted.')
        return username

class UserLoginDetailsModelSerializer(serializers.ModelSerializer):
    @staticmethod
    def validate_username(username):
        if 'allauth.account' not in settings.INSTALLED_APPS:
            return username

        from allauth.account.adapter import get_adapter
        username = get_adapter().clean_username(username)
        return username

    # exclude pk, first name and last name
    class Meta:
        model = User
        fields = ['username', 'email']
        read_only_fields = ['email']
