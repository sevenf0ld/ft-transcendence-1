from django.urls import path
from .views import send_otp

app_name = 'mfa_email'

urlpatterns = [
    path('api/send-otp/', send_otp),
]
