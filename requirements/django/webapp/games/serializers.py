from rest_framework import serializers

from .models import Match, Tournament, GameHistory, Room
from django.utils.timezone import localtime

class MatchModelSerializer(serializers.ModelSerializer):
    #match_date = serializers.DateField()
    #match_time = serializers.TimeField()
    match_date = serializers.SerializerMethodField()
    match_time = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()
    game_type = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()

    def get_match_date(self, obj):
        return localtime(obj.match_time).strftime('%b %d')

    def get_match_time(self, obj):
        return localtime(obj.match_time).strftime('%I:%M %p')

    def get_result(self, obj):
        target = self.context.get('target')
        winner = obj.winner
        if target == winner:
            return 'WON'
        return 'LOST'

    def get_game_type(self, obj):
        return 'PVP'

    def get_opponent(self, obj):
        target = self.context.get('target')
        if target == obj.p1:
            return obj.p2.username
        return obj.p1.username

    class Meta:
        model = Match
        fields = ['match_date', 'match_time', 'result', 'game_type', 'opponent']

class TournamentModelSerializer(serializers.ModelSerializer):
    tnm_date = serializers.SerializerMethodField()
    tnm_time = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    game_type = serializers.SerializerMethodField()
    host = serializers.SerializerMethodField()

    def get_match_date(self, obj):
        return localtime(obj.tnm_time).strftime('%b %d')

    def get_tnm_time(self, obj):
        return localtime(obj.tnm_time).strftime('%I:%M %p')

    def get_status(self, obj):
        target = self.context.get('target')
        winner = obj.winner.user
        if target == winner:
            return 'WON'
        return 'LOST'

    def get_game_type(self, obj):
        return 'TNM'

    def get_host(self, obj):
        return obj.host.username

    class Meta:
        model = Tournament
        fields = ['tnm_date', 'tnm_time', 'status', 'game_type', 'host']

# date (time), status (lost/win), type, opponent (winner/loser)
class GameHistoryModelSerializer(serializers.ModelSerializer):
    #target = serializers.CharField()
    pvp = serializers.SerializerMethodField()
    tnm = serializers.SerializerMethodField()

    #def validate_target(self, value):
    #    if value is None:
    #        raise serializers.ValidationError('Match history target is required.')
    #    return value

    def get_pvp(self, obj):
        pvp = obj.matches.all().order_by('-match_time')
        return MatchModelSerializer(pvp, many=True, context=self.context).data

    def get_tnm(self, obj):
        tnm = obj.tournaments.all().order_by('-tnm_time')
        return TournamentModelSerializer(tnm, many=True, context=self.context).data

    class Meta:
        model = GameHistory
        fields = ['pvp', 'tnm']

class RoomCreateModelSerializer(serializers.ModelSerializer):
    host = serializers.SerializerMethodField()

    def get_host(self, obj):
       return obj.host.username

    class Meta:
        model = Room
        extra_kwargs = {
            'room_id': {'required': False},
        }
        exclude = ['id']

class RoomModelSerializer(serializers.ModelSerializer):
    host = serializers.SerializerMethodField()

    def get_host(self, obj):
       return obj.host.username

    class Meta:
        model = Room
        fields = '__all__'
