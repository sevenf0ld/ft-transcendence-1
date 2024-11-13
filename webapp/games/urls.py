from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, TournamentViewSet, GameHistoryViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'matches', MatchViewSet, basename='match')
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'game_histories', GameHistoryViewSet, basename='game_history')
urlpatterns = [
    path('api/', include(router.urls)),
]
