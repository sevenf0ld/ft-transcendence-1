from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Friend(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='person'
    )

    friend = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='friends_with'
    )

    status = models.CharField(
        max_length=50,
        choices=[
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected'),
            ('blocked', 'Blocked'),
            ('outgoing', 'Outgoing'),
            ('incoming', 'Incoming')
        ]
    )

    #=================================#
    #=========class metadata==========#
    #=================================#

    class Meta:
        ordering = ['friend__username']

    #=================================#
    #=====default model methods=======#
    #=================================#

    def __str__(self):
        return f'{self.user.username} and {self.friend.username} has a friendship status of: {self.status}'
