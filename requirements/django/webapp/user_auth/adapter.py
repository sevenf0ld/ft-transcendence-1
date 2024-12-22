from allauth.account.adapter import DefaultAccountAdapter
from allauth.account import app_settings
#from allauth.core.internal.adapter import validation_error
from django.core.exceptions import ValidationError
import re
#from django.contrib.auth.models import User

# relevant to registration (normal and oauth2.0)
class CustomAccountAdapter(DefaultAccountAdapter):
    pass
    # filter_users_by_username is case-insensitive
    #def clean_username(self, username, shallow=False):
    #    for validator in app_settings.USERNAME_VALIDATORS:
    #        validator(username)

    #    blacklisted = app_settings.USERNAME_BLACKLIST
    #    pattern = r'(?i)(' + '|'.join(map(re.escape, blacklisted)) + r')'
    #    if re.search(pattern, username):
    #        raise ValidationError(self.error_messages['username_blacklisted'], code='username_blacklisted')

    #    if not shallow:
    #        from allauth.account.utils import filter_users_by_username

    #        if filter_users_by_username(username).exists():
    #            #raise self.validation_error("username_taken")
    #            raise ValidationError(self.error_messages['username_taken'], code='username_taken')
    #    return username

    # used in DefaultAccountAdapter's and DefaultSocialAccountAdapter's save_user()
    #def populate_username(self, request, user):
    #    from allauth.account.utils import user_email, user_field, user_username

    #    first_name = user_field(user, "first_name")
    #    last_name = user_field(user, "last_name")
    #    email = user_email(user)
    #    username = email.split('@')[0]
    #    if app_settings.USER_MODEL_USERNAME_FIELD:
    #        user_username(
    #            user,
    #            username
    #            or self.generate_unique_username(
    #                [first_name, last_name, email, username, "user"]
    #            ),
    #        )

# registration
# dj_rest_auth/registration/serializer RegisterSerializer
# dj_rest_auth/registration/views RegisterView
# allauth/account/utils complete_signup
# allauth/account/utils perform_login
# allauth/account/adapter.py pre_login
# allauth/account/utils.py send_email_confirmation
# allauth/account/models.py EmailAddress
