from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import FriendList

@receiver(post_save, sender=User)
def create_friend_list(sender: User, instance, created, **kwargs):
    if created:
        print(f'Creating friend list for user: {instance.username}')
        FriendList.objects.create(user=instance)
