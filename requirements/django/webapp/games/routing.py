from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/lobby/(?P<lobby_type>TNM|PVP)/$', consumers.LobbyConsumer.as_asgi()),
    re_path(r'ws/game/(?P<room_id>\d{6})/$', consumers.GameRoomConsumer.as_asgi()),
    re_path(r'ws/invite/(?P<invitee>[\w-]+)/$', consumers.InvitationConsumer.as_asgi()),
]
