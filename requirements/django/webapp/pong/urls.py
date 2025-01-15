"""
URL configuration for pong project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]

# maiman-m: add frontend url
from django.urls import include, re_path
from allauth.account.views import confirm_email

urlpatterns += [
    path('', include('frontend.urls')),
    path('api/user_auth/', include('user_auth.urls')),
    # dj-rest-auth
    path('api/jwt_token/', include('dj_rest_auth.urls')),
    # django-allauth (registration & confirmation)
    re_path(
        r'registration/account-confirm-email/(?P<key>[-:\w]+)/',
        confirm_email,
        name='account_confirm_email',
    ),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # drf-social-oauth2
    #re_path(r'^auth/', include('drf_social_oauth2.urls', namespace='drf')),
    # django-allauth (forty two social account)
    path('accounts/', include('allauth.urls')),
    path('api/social_auth/', include('social_auth.urls')),
    path('api/friends/', include('friends.urls')),
    path('api/user_profiles/', include('user_profiles.urls')),
    path('api/games/', include('games.urls')),
]

from django.conf import settings
from django.conf.urls.static import static

# if settings.DEBUG:
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.conf.urls import handler404, handler500, handler403, handler400

handler404 = 'frontend.views.custom_invalid_api'
#handler500 =
#handler403 =
#handler400 =
