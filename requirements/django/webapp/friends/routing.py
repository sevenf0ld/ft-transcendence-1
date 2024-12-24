from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/online/(?P<user_id>\d+)/$', consumers.OnlineConsumer.as_asgi()),
]

