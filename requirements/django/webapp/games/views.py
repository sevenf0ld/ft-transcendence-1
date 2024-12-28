from django.shortcuts import render

# Create your views here.
#from rest_framework import viewsets
from .models import GameHistory
from .serializers import GameHistoryModelSerializer
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, generics
from typing import Dict, Any

#class MatchViewSet(viewsets.ModelViewSet):
#    serializer_class = MatchModelSerializer
#    queryset = Match.objects.all()
#
#class TournamentViewSet(viewsets.ModelViewSet):
#    serializer_class = TournamentModelSerializer
#    queryset = Tournament.objects.all()
#
#class GameHistoryViewSet(viewsets.ModelViewSet):
#    serializer_class = GameHistoryModelSerializer
#    queryset = GameHistory.objects.all()

class GameHistoryRetrieveAPIView(generics.RetrieveAPIView):
    queryset = GameHistory.objects.prefetch_related('matches', 'tournaments')
    serializer_class = GameHistoryModelSerializer
    lookup_field = 'user__username'
    lookup_url_kwarg = 'target'

    def get_serializer_context(self):
        context = super(GameHistoryRetrieveAPIView, self).get_serializer_context()
        target_username = self.kwargs.get(self.lookup_url_kwarg)
        if target_username:
            target_user = User.objects.get(username__iexact=target_username)
            context['target'] = target_user
        return context
