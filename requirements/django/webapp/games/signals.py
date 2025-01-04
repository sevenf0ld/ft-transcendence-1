from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import GameHistory, Room
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

@receiver(post_save, sender=User)
def create_game_history(sender: User, instance, created, **kwargs):
    if created:
        print(f'Creating game history for user: {instance.username}')
        GameHistory.objects.create(user=instance)

@receiver(post_delete, sender=Room)
def room_deleted_handler(sender: Room, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'lobby_{instance.room_type}',
        {
            'type': 'disband.room',
        },
    )
