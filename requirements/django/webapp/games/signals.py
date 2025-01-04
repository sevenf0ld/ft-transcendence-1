from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import GameHistory, Room

@receiver(post_save, sender=User)
def create_game_history(sender: User, instance, created, **kwargs):
    if created:
        print(f'Creating game history for user: {instance.username}')
        GameHistory.objects.create(user=instance)
