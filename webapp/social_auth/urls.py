from allauth.socialaccount.providers.oauth2.urls import default_urlpatterns
from .provider import FortyTwoProvider
from django.urls import path
from .views import  (
    FortyTwoLogin,
    FortyTwoConnect
)

app_name = 'social_auth'

urlpatterns = default_urlpatterns(FortyTwoProvider)
urlpatterns += [
    path('api/forty-two-login/', FortyTwoLogin.as_view()),
    path('api/forty-two-connect/', FortyTwoConnect.as_view()),
]
