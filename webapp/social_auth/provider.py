from allauth.socialaccount.providers.base import ProviderAccount
from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider
from .views import FortyTwoOAuth2Adapter
from allauth.socialaccount import providers

# grep -RHnw 'def to_str' .
class FortyTwoAccount(ProviderAccount):
    def get_profile_url(self):
        return self.account.extra_data.get('url')

    def to_str(self):
        dflt = super(FortyTwoProvider, self).to_str()
        return self.account.extra_data.get('displayname', dflt)

# allauth/socialaccount/providers/base/provider.py
class FortyTwoProvider(OAuth2Provider):
    id = 'fortytwo'
    name = 'FortyTwo'
    account_class = FortyTwoAccount
    oauth2_adapter_class = FortyTwoOAuth2Adapter

    def get_default_scope(self):
        return ['public']

    def extract_uid(self, data):
        return str(data['id'])

    def extract_extra_data(self, data):
        return dict(
            displayname=data.get('displayname'),
        )

    # for user population of SOCIALACCOUNT_ADAPTER
    def extract_common_fields(self, data):
        return dict(
            username=data.get('login'),
            email=data.get('email'),
        )

#provider_classes = [FortyTwoProvider]
providers.registry.register(FortyTwoProvider)
