from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Match, Tournament, GameHistory
from .serializers import MatchModelSerializer, TournamentModelSerializer, GameHistoryModelSerializer

class MatchViewSet(viewsets.ModelViewSet):
    serializer_class = MatchModelSerializer
    queryset = Match.objects.all()

class TournamentViewSet(viewsets.ModelViewSet):
    serializer_class = TournamentModelSerializer
    queryset = Tournament.objects.all()

class GameHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = GameHistoryModelSerializer
    queryset = GameHistory.objects.all()
