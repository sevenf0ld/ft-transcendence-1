"""
ASGI config for pong project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong.settings')

application = get_asgi_application()

# async chat server
from channels.routing import (
    ProtocolTypeRouter,
    URLRouter,
)
from .middleware import TokenAuthMiddleware
import chat.routing
import friends.routing
import games.routing

websocket_urlpatterns = chat.routing.websocket_urlpatterns + friends.routing.websocket_urlpatterns + games.routing.websocket_urlpatterns
 
application = ProtocolTypeRouter({
    'http': application,
    'websocket': TokenAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    )
})
