from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# PVP
class Match(models.Model):
    host = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='match_host',
        blank=True,
        null=True
    )

    p1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='p1',
        blank=True,
        null=True
    )

    p2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='p2',
        blank=True,
        null=True
    )

    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='match_winner'
    )

    match_time = models.DateTimeField(auto_now_add=True)

    #=================================#
    #=====default model methods=======#
    #=================================#

    def __str__(self):
        return f'{self.p1.username} vs {self.p2.username}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.p1:
            gh1, created = GameHistory.objects.get_or_create(user=self.p1)
            gh1.matches.add(self)
        
        if self.p2:
            gh2, created = GameHistory.objects.get_or_create(user=self.p2)
            gh2.matches.add(self)

# multiple rounds of PVP
class Tournament(models.Model):
    host = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tnm_host',
        blank=True,
        null=True
    )

    started = models.BooleanField(default=False)

    matches = models.ManyToManyField(Match)

    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='tnm_winner'
    )

    tnm_time = models.DateTimeField(auto_now_add=True)

    #=================================#
    #=====default model methods=======#
    #=================================#

    def __str__(self):
        if self.started is False:
            status = 'open'
        else:
            status = 'ongoing'
        return f'tournament is {status}'

class GameHistory(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='game_history'
    )

    matches = models.ManyToManyField(
        Match,
        blank=True,
        related_name='pvp'
    )

    tournaments = models.ManyToManyField(
        Tournament,
        blank=True,
        related_name='tnm'
    )

class Room(models.Model):
    MAXIMUM = 5

    PVP = 'PVP'
    TOURNAMENT = 'TNM'
    ROOM_CHOICES = {
        PVP: 'pvp',
        TOURNAMENT: 'tournament'
    }

    started = models.BooleanField(default=False)

    # 6 digits max
    room_id = models.PositiveIntegerField(
        validators=[
            MaxValueValidator(999999),
        ],
        unique=True
    )

    members = models.PositiveIntegerField(
        # the host
        default=1,
        validators=[
            MaxValueValidator(5),
            # everyone has left and if consumer does not destroy, this should
            #MinValueValidator(0),
        ],
    )

    host = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='room_host',
        blank=True,
        null=True
    )

    room_type = models.CharField(
        max_length=3,
        default=PVP,
        choices=ROOM_CHOICES,
    )
