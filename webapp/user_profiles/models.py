from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    nickname = models.CharField(
        unique=True,
        max_length=30,
        blank=True,
        null=True
    )

    avatar = models.ImageField(
        default='avatars/default.jpg',
        upload_to='avatars/',
    )

    language = models.CharField(
        max_length=2,
        default='En',
        choices=[
            ('EN', 'English'),
            ('ZH', 'Mandarin'),
            ('MY', 'Malay'),
        ]
    )

    wins = models.PositiveIntegerField(default=0)

    losses = models.PositiveIntegerField(default=0)

    mfa_email_enabled = models.BooleanField(default=False)

    #=================================#
    #=====default model methods=======#
    #=================================#

    def __str__(self):
        return self.user.username
