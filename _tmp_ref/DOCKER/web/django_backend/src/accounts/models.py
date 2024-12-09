from datetime import timedelta
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default_avatar.jpg')
    friends = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='friends_of')
    last_seen = models.DateTimeField(default=timezone.now)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s profile"

    def add_friend(self, profile):
        if profile != self and profile not in self.friends.all():
            self.friends.add(profile)
            self.save()

    def is_online(self):
        threshold = timezone.now() - timedelta(minutes=5)
        return self.last_seen > threshold


class Match(models.Model):
    player_one = models.ForeignKey(Profile, related_name='matches_as_player_one', on_delete=models.CASCADE)
    player_two = models.CharField(max_length=255)
    match_date = models.DateTimeField(default=timezone.now)
    player_one_score = models.PositiveIntegerField(default=0)
    player_two_score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Match on {self.match_date} between {self.player_one.user.username} and {self.player_two}"
