from rest_framework import serializers 
  
from .models import Match, Tournament, GameHistory
  
class MatchModelSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Match
        fields = '__all__'
  
class TournamentModelSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Tournament
        fields = '__all__'
  
class GameHistoryModelSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = GameHistory
        fields = '__all__'
