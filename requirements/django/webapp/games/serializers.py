from rest_framework import serializers

from .models import Match, Tournament, GameHistory

class MatchModelSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    game_type = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()

    def get_status(self, obj):
        user = obj.user.username
        winner = obj.match_winner.user.username
        if user == winner:
            return 'WON'
        return 'LOST'

    def get_game_type(self, obj):
        return 'PVP'

    def get_opponent(self, obj):
        user = obj.user.username
        p1 = obj.p1.username
        if user == p1:
            return obj.p2.username
        return p1

    class Meta:
        model = Match
        fields = ['match_time', 'status', 'game_type', 'opponent']

class TournamentModelSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    game_type = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()

    def get_status(self, obj):
        user = obj.user.username
        winner = obj.tnm_winner.user.username
        if user == winner:
            return 'WON'
        return 'LOST'

    def get_game_type(self, obj):
        return 'TNM'

    def get_opponent(self, obj):
        user = obj.user.username
        winner = obj.tnm_winner.user.username
        if user == winner:
            return obj.tnm_host.username
        return winner

    class Meta:
        model = Tournament
        fields = ['tnm_time', 'status', 'game_type', 'opponent']

# date (time), status (lost/win), type, opponent (winner/loser)
class GameHistoryModelSerializer(serializers.ModelSerializer):
    pvp = serializers.SerializerMethodField()
    tnm = serializers.SerializerMethodField()

    def get_pvp(self, obj):
        pvp = obj.matches.all()
        return MatchModelSerializer(pvp, many=True).data

    def get_tnm(self, obj):
        tnm = obj.tournaments.all()
        return TournamentModelSerializer(tnm, many=True).data

    class Meta:
        model = GameHistory
        fields = ['pvp', 'tnm']
