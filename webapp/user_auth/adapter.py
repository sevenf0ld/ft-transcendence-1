from allauth.account.adapter import DefaultAccountAdapter
from allauth.account import app_settings
#from allauth.core.internal.adapter import validation_error
from django.core.exceptions import ValidationError
import re
#from django.contrib.auth.models import User

# relevant to registration
class CustomAccountAdapter(DefaultAccountAdapter):
    # filter_users_by_username is case-insensitive
    def clean_username(self, username, shallow=False):
        for validator in app_settings.USERNAME_VALIDATORS:
            validator(username)

        # TODO: Add regexp support to USERNAME_BLACKLIST
        blacklisted = app_settings.USERNAME_BLACKLIST
        pattern = r'(?i)(' + '|'.join(map(re.escape, blacklisted)) + r')'
        if re.search(pattern, username):
            raise ValidationError(self.error_messages['username_blacklisted'], code='username_blacklisted')

        #username_blacklist_lower = [
        #    ub.lower() for ub in app_settings.USERNAME_BLACKLIST
        #]
        #if username.lower() in username_blacklist_lower:
        #    #raise self.validation_error("username_blacklisted")
        #    raise ValidationError(self.error_messages['username_blacklisted'], code='username_blacklisted')
        # Skipping database lookups when shallow is True, needed for unique
        # username generation.
        if not shallow:
            from allauth.account.utils import filter_users_by_username

            if filter_users_by_username(username).exists():
                #raise self.validation_error("username_taken")
                raise ValidationError(self.error_messages['username_taken'], code='username_taken')
        return username

    # https://stackoverflow.com/a/45867672
    # integrity error
    #def clean_email(self, email):
    #    if app_settings.UNIQUE_EMAIL:
    #        existing_email = User.objects.filter(email__iexact=email).last()
    #        if existing_email:
    #            raise ValidationError('Email address is taken.')
    #        if User.objects.filter(email__iexact=email).exists():
    #            raise ValidationError('Email address is taken.')

    # https://github.com/pennersr/django-allauth/issues/1770
    # allauth/utils.py
    def populate_username(self, request, user):
        """
        Fills in a valid username, if required and missing.  If the
        username is already present it is assumed to be valid
        (unique).
        """
        from allauth.account.utils import user_email, user_field, user_username

        first_name = user_field(user, "first_name")
        last_name = user_field(user, "last_name")
        email = user_email(user)
        username = user_username(user)
        if app_settings.USER_MODEL_USERNAME_FIELD:
            user_username(
                user,
                username
            )
