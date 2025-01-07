from allauth.socialaccount.providers.base import ProviderAccount
from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider
from .views import FortyTwoOAuth2Adapter
from allauth.socialaccount import providers
from django.conf import settings
from allauth.socialaccount.models import SocialApp
from django.core.exceptions import ImproperlyConfigured


# grep -RHnw 'def to_str' .
class FortyTwoAccount(ProviderAccount):
    def get_profile_url(self):
        return self.account.extra_data.get('url')

    def get_avatar_url(self):
        pfp = self.account.extra_data.get('image', {})
        #return pfp.get('link')
        return pfp.get('versions', {}).get('micro')

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
            url=data.get('url'),
            image=data.get('image'),
        )

    # for user population of SOCIALACCOUNT_ADAPTER
    def extract_common_fields(self, data):
        return dict(
            username=data.get('login'),
            email=data.get('email'),
            #pfp=data.get('image').get('link'),
        )

    @property
    def app(self):
        provider_conf = settings.SOCIALACCOUNT_PROVIDERS.get('fortytwo', {}).get('APP', {})
        client_id = provider_conf.get('client_id')
        secret = provider_conf.get('secret')
        key = provider_conf.get('key', '')
        if not client_id or not secret:
            raise ImproperlyConfigured("Client ID or Secret for FortyTwoProvider is missing in settings.")
        app, created = SocialApp.objects.get_or_create(
            provider='fortytwo',
            defaults={
                'name': 'FortyTwo App',
                'client_id': client_id,
                'secret': secret,
                'key': key,
            }
        )
        if not created:
            app.client_id = client_id
            app.secret = secret
            app.key = key
            app.save()
        return app

provider_classes = [FortyTwoProvider]
providers.registry.register(FortyTwoProvider)
