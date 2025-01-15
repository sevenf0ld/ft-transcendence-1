from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.utils import (
    user_email,
    user_username
)
from allauth.utils import valid_email_or_none

# allauth/socialaccount/adapter.py
class FortyTwoSocialAccountAdapter(DefaultSocialAccountAdapter):
    # saving pfp to profile model is not suitable here
    def populate_user(self, request, sociallogin, data):
        username = data.get('username')
        email = data.get('email')
        user = sociallogin.user
        user_username(user, username or '')
        user_email(user, valid_email_or_none(email) or '')
        return user

    # allauth/socialaccount/adapter.py
    #def get_requests_session(self):
    #    import requests

    #    session = requests.Session()
    #    session.request = functools.partial(
    #        session.request, timeout=app_settings.REQUESTS_TIMEOUT
    #    )
    #    return session
