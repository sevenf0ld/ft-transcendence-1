from django.db.models.signals import post_save
from django.dispatch import receiver
from user_profiles.models import Profile
from .models import MfaEmail
from django.contrib.auth.models import User

@receiver(post_save, sender=Profile)
def create_mfa_email(sender: Profile, instance, created, **kwargs):
    if created:
        print(f"Creating mfa email for profile: {instance.user.username}")
        user = User.objects.get(username=instance.user.username)
        MfaEmail.objects.create(user=user)
