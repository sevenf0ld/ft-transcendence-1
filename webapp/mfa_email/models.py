from django.db import models

# Create your models here.
from user_profiles.models import Profile
from django.contrib.auth.models import User

class MfaEmail(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    otp = models.CharField(
        max_length=6,
        blank=True,
        null=True
    )

    otp_expiry_time = models.DateTimeField(
        blank=True,
        null=True
    )

    otp_verified = models.BooleanField(default=False)

    @staticmethod
    def is_mfa_enabled(request):
        username = request.data.get('username')
        user_data = User.objects.get(username=username)
        profile_data = Profile.objects.get(user=user_data)

        return profile_data.mfa_email_enabled

    @staticmethod
    def get_mfa_details(request):
        username = request.data.get('username')
        user_data = User.objects.get(username=username)
        mfa_data = MfaEmail.objects.filter(user=user_data).last()

        return mfa_data
