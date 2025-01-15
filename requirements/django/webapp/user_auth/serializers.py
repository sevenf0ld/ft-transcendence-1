from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
import re
from django.conf import settings
from user_profiles.serializers import ProfileModelSerializer
from user_profiles.models import Profile
from allauth.socialaccount.models import SocialAccount

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
            raise serializers.ValidationError('E-mail address is taken.')
        return email

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        blacklisted = allauth_account_settings.USERNAME_BLACKLIST
        pattern = r'(?i)(' + '|'.join(map(re.escape, blacklisted)) + r')'
        if re.search(pattern, username):
            raise serializers.ValidationError('Username is blacklisted.')
        return username

# exclude pk, first name and last name from json response
class UserLoginDetailsModelSerializer(serializers.ModelSerializer):
    #profile = serializers.SerializerMethodField()
    ft_acc = serializers.SerializerMethodField()

    @staticmethod
    def validate_username(username):
        if 'allauth.account' not in settings.INSTALLED_APPS:
            return username

        from allauth.account.adapter import get_adapter
        username = get_adapter().clean_username(username)
        return username

    #def get_profile(self, obj):
    #    profile_data = Profile.objects.get(user=obj)
    #    return ProfileModelSerializer(profile_data).data

    def get_ft_acc(self, obj):
        if SocialAccount.objects.filter(user=obj).exists():
            return True
        return False

    class Meta:
        model = User
        #fields = ['pk', 'username', 'email', 'profile']
        #read_only_fields = ['email', 'profile']
        fields = ['pk', 'username', 'email', 'ft_acc']
        read_only_fields = ['email']

#class UserAccountUpdateModelSerializer(serializers.ModelSerializer):
#    # mandatory in request
#    current_password = serializers.CharField(required='True')
#    new_email = serializers.EmailField()
#    new_password = serializers.CharField()
#    confirm_password = serializers.CharField()
#
#    print(current_password)
#
#    class Meta:
#        model = User
#        # not included in json response
#        write_only_fields = ['current_password']
#        # needed in request processing
#        #read_only_fields = ['new_email']
