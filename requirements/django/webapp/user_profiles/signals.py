from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_user_profile(sender: User, instance, created, **kwargs):
    if created:
        print(f'Creating profile for user: {instance.username}')
        Profile.objects.create(user=instance)
