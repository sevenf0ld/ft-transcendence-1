from allauth.socialaccount.providers.base import ProviderAccount
from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider
from .views import FortyTwoOAuth2Adapter
from allauth.socialaccount import providers

class FortyTwoAccount(ProviderAccount):
    def get_profile_url(self):
        return self.account.extra_data.get('url')

class FortyTwoProvider(OAuth2Provider):
    id = 'fortytwo'
    name = 'FortyTwo'
    account_class = FortyTwoAccount
    oauth2_adapter_class = FortyTwoOAuth2Adapter

    def get_default_scope(self):
        return ['public']

    def extract_uid(self, data):
        return str(data['id'])

    def extract_common_fields(self, data):
        return dict(
            login=data.get('login'),
            displayname=data.get('displayname'),
        )

#provider_classes = [FortyTwoProvider]
providers.registry.register(FortyTwoProvider)
