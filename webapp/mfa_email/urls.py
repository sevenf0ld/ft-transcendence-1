from django.urls import path
from .views import send_otp, verify_otp

app_name = 'mfa_email'

urlpatterns = [
    path('api/login-phase-two/', send_otp),
    path('api/login-phase-three/', verify_otp),
]
