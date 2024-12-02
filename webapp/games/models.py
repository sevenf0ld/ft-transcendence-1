from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Match(models.Model):
    player = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='player'
    )

    opponent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='opponent'
    )

    player_score = models.PositiveIntegerField(default=0)

    opponent_score = models.PositiveIntegerField(default=0)

    match_time = models.DateTimeField(auto_now_add=True)

    king = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='match_king'
    )

    #def determine_king(self):
    #    self.king = None
    #    if self.player_score > self.opponent_score:
    #        self.king = self.player
    #    elif self.opponent_score> > self.player_score
    #        self.king = self.opponent
    #    self.save()

    #=================================#
    #=====default model methods=======#
    #=================================#

    def __str__(self):
        return f'{self.player.username} vs {self.opponent.username} at {self.match_time}'

class Tournament(models.Model):
    matches = models.ManyToManyField(Match)

    tournament_time = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=50,
        choices=[
            ('ongoing', 'Ongoing'),
            ('completed', 'Completed'),
            ('upcoming', 'Upcoming')
        ]
    )

    champion = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='tournament_champion'
    )

    #=================================#
    #=====default model methods=======#
    #=================================#

    def __str__(self):
        return f'tournament taking place at {self.tournament_time}'

class GameHistory(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='game_history'
    )

    matches = models.ManyToManyField(
        Match,
        blank=True,
        related_name='matches'
    )

    tournaments = models.ManyToManyField(
        Tournament,
        blank=True,
        related_name='tournaments'
    )
