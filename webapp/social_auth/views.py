from django.shortcuts import render

# Create your views here.
from allauth.socialaccount import app_settings
from allauth.socialaccount.adapter import get_adapter
from allauth.socialaccount.providers.oauth2.views import (
    OAuth2Adapter,
    OAuth2CallbackView,
    OAuth2LoginView,
)
#from .provider import FortyTwoProvider
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class FortyTwoOAuth2Adapter(OAuth2Adapter):
    #provider_id = FortyTwoProvider.id
    provider_id = 'fortytwo'
    settings = app_settings.PROVIDERS.get(provider_id, {})

    provider_base_url = settings.get('FORTYTWO_URL', 'https://api.intra.42.fr/')
    api_url = '{0}/apidoc'.format(provider_base_url)
    access_token_url = '{0}/oauth/token'.format(provider_base_url)
    authorize_url = '{0}/oauth/authorize'.format(provider_base_url)
    profile_url = '{0}/v2/me'.format(provider_base_url)

    def complete_login(self, request, app, token, **kwargs):
        headers = {
            "Authorization": "Bearer {}".format(token.token),
        }
        extra_data = (
            get_adapter().get_requests_session().get(self.profile_url, headers=headers)
        )
        extra_data.raise_for_status()

        return self.get_provider().sociallogin_from_response(request, extra_data.json())

oauth2_login = OAuth2LoginView.adapter_view(FortyTwoOAuth2Adapter)
oauth2_callback = OAuth2CallbackView.adapter_view(FortyTwoOAuth2Adapter)

class FortyTwoLogin(SocialLoginView):
    adapter_class = FortyTwoOAuth2Adapter
    callback_url = 'https://ftpong.com:8000'
    client_class = OAuth2Client
