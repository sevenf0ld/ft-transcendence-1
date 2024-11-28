from django.db import models

# Create your models here.
#from user_profiles.models import Profile
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
