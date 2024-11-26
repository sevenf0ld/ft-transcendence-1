from allauth.socialaccount.providers.oauth2.urls import default_urlpatterns
from .provider import FortyTwoProvider
from django.urls import path
from .views import FortyTwoLogin

urlpatterns = default_urlpatterns(FortyTwoProvider)
urlpatterns += [
    path('api/forty-two-login/', FortyTwoLogin.as_view()),
]
