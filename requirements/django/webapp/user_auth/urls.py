from django.urls import path
from dj_rest_auth.views import (
    LoginView,
    LogoutView
    #UserDetailsView,
)
from dj_rest_auth.registration.views import (
    RegisterView,
    VerifyEmailView,
)
from .views import (
    CustomRegisterView,
    CustomLoginView,
    send_otp,
    verify_otp,
    #UserAccountUpdateAPIView,
    update_user_password,
    update_user_mfa,
)

app_name = 'user_auth'

urlpatterns = [
    path('login/', CustomLoginView.as_view()),
    path('login-phase-two/', send_otp),
    path('login-phase-three/', verify_otp),
    path('logout/', LogoutView.as_view()),
    #path('user/', UserDetailsView.as_view()),
    path('register/', CustomRegisterView.as_view()),
    path('registration/account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    # dj-rest-auth in root urls (api/jwt_token/)
    #/api/v1/auth/token/refresh/ dj_rest_auth.jwt_auth.RefreshViewWithCookieSupport token_refresh
    #/api/v1/auth/token/verify/ rest_framework_simplejwt.views.TokenVerifyView token_verifya
    #path('update-user-account/', UserAccountUpdateAPIView.as_view()),
    path('update-user-password/', update_user_password),
    path('update-user-mfa/', update_user_mfa),
]
