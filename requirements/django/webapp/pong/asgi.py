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
# update to JWT
from channels.auth import AuthMiddlewareStack
import chat.routing

application = ProtocolTypeRouter({
    'http': application,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    )
})
