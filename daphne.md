# week 3
## asgi
### information
- [why is asgi a server](https://stackoverflow.com/questions/77634638/why-they-call-asgi-a-server-while-they-say-it-is-not-in-django)

### setup daphne-channels
1. setup [channels with daphne](https://channels.readthedocs.io/en/latest/installation.html)
1. create html and the corresponding django view
1. run daphne in webapp (not in pong) `python3 -m daphne pong.asgi:application`
1. create chat socket (websocket) in the aforementioned html
1. create consumer, the channel equivalent of django views. it receives and broadcasts to anyone who has access to this particular consumer "instance"
1. import the aforementioned consumer to set up routing
1. import into pong/asgi.py (root or project)
    - URLRouter
    - AuthMiddlewareStack // update to JWT bc we don't use Cookie and Session
    - chat/routing.py
### note
    - [need a proxy to forward websockets to daphne](https://github.com/django/channels/issues/248#issuecomment-233159915) so nginx
#### common errors
    - [import order matters](https://www.reddit.com/r/django/comments/117l8qh/the_right_way_to_dockerize_django_channels_app/)
    - [consolidated errors with guides](https://medium.com/@mansoor7tariq/demystifying-daphne-solving-common-django-websocket-errors-with-comprehensive-asgi-configuration-985266d0e856)
    - [websocket troubleshooting](https://medium.com/@tiokachiu/troubleshooting-websocket-connection-failed-a-concise-guide-b44b109e30f2)
    - [touches on all and every daphne-websocket issues](https://codemax.app/snippet/daphne-refuses-to-connect-websocket-requests/)
