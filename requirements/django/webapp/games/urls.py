#from rest_framework.routers import DefaultRouter
#from .views import MatchViewSet, TournamentViewSet, GameHistoryViewSet
from django.urls import path, include
from .views import (
    GameHistoryRetrieveAPIView,
    RoomCreateAPIView,
)

app_name = 'games'

#router = DefaultRouter()
#router.register(r'matches', MatchViewSet, basename='match')
#router.register(r'tournaments', TournamentViewSet, basename='tournament')
#router.register(r'game_histories', GameHistoryViewSet, basename='game_history')
#urlpatterns = [
#    path('api/', include(router.urls)),
#]

urlpatterns = [
    path('history/<str:target>', GameHistoryRetrieveAPIView.as_view()),
    path('create-room/', RoomCreateAPIView.as_view()),
]
