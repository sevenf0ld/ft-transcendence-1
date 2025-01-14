from django.shortcuts import render

# Create your views here.
#from rest_framework import viewsets
from .models import (
    GameHistory,
    Room
)
from .serializers import (
    GameHistoryModelSerializer,
    RoomCreateModelSerializer
)
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, generics
from typing import Dict, Any
import random

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
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]
    lookup_field = 'user__username'
    lookup_url_kwarg = 'target'

    def get_serializer_context(self):
        context = super(GameHistoryRetrieveAPIView, self).get_serializer_context()
        target_username = self.kwargs.get(self.lookup_url_kwarg)
        if target_username:
            target_user = User.objects.get(username__iexact=target_username)
            context['target'] = target_user
        return context

class RoomCreateAPIView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateModelSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTCookieAuthentication]

    def generate_unique_rid(self):
        while True:
            rid = random.randint(100000, 999999)
            if not Room.objects.filter(room_id=rid).exists():
                return rid

    def create(self, request, *args, **kwargs):
        mutable_data = request.data.copy()
        # contains the default if not provided
        room_type = request.data.get('room_type', Room.PVP)
        if room_type not in Room.ROOM_CHOICES:
            return Response({'details': 'Selected game type is not supported.'}, status=status.HTTP_400_BAD_REQUEST)
        mutable_data['room_type'] = room_type

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)

        host = request.user
        room_id = self.generate_unique_rid()

        new_room = Room.objects.create(
            room_id=room_id,
            host=host,
            **serializer.validated_data
        )

        new_room.save()
        serializer = RoomCreateModelSerializer(new_room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
