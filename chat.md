# week 3
## live chat
### introduction
- what are channels?
    - [text to read](https://medium.com/@farad.dev/how-to-build-a-real-time-chat-app-using-django-channels-2ba2621ea972)
    - [extensive write up on all the different terms and config](https://medium.com/scalereal/understanding-django-channels-part-1-28a62730b0c1)
    - [video to watch](https://youtu.be/u7siCTdGhuw?si=A3fWW0Q0pSR20Yl5), demo with three (3) accounts as a bonus and online count
- [simple introductory websockets, consumers, broadcasts and database interaction](https://medium.com/@joloiuy/building-dynamic-real-time-apps-with-django-channels-8373fc173a1b)
    - [explains the above components further](https://archive.ph/WdJwg)
### guide
- [demo with two (2) windows without the complication of authentication or users](https://medium.com/munchy-bytes/chat-happens-building-a-real-time-chat-system-with-django-channels-and-websockets-e48e96900fbb), and includes write-ups on each part
- without complications as the item above, [IT support as demo](https://archive.ph/Qzy2V)
- [django channels tutorial as per the documentation](https://channels.readthedocs.io/en/latest/tutorial/part_1.html)
- [revolutionary guide on django and js to implement the chat](https://archive.ph/rLfYV)
- [Code With Stein]
    - [code alongside the chat website video](https://youtu.be/9e7CTR2Ya4Y?si=O0KFU8NoPEspbJeT)
    - [includes js for the chatroom](https://codewithstein.com/django-realtime-chat-app-tutorial-simple-django-tutorial-with-channels-and-redis/)
- [guide with js and includes demo with two (2) users](https://career.proxify.io/article/real-time-chat-with-Django#building-a-real-time-chat-system-with-django)
- [guide on react-django with very extensive explanations](https://justdjango.com/blog/chat-app-django-channels)
### youtube channels
- andreas jud
    - [private chat](https://youtu.be/4kJKq1bZSwo?si=cN7kwnjuhDPR5-cG)
    - [group chat](https://youtu.be/mfpzFemewDQ?si=bs-PaVAo42_fyWpm)
    - [live activity monitoring](https://youtu.be/VSmhitrZ_0w?si=vMUt_E3TFMuhnct8)
- coding with mitch
    - [shared by JJ](https://www.youtube.com/watch?v=0UKWcv0og-Y)
    - [shared by RJ](https://www.youtube.com/watch?v=hyJO4mkdwuM)
- code with stein
    - [chat website](https://youtu.be/9e7CTR2Ya4Y?si=O0KFU8NoPEspbJeT)

### playground
- scope:
    > Every consumer has a scope that contains information about its connection, including in particular any positional or keyword arguments from the URL route and the currently authenticated user if any.
    ```
    {'type': 'websocket', 'path': '/ws/chat/', 'raw_path': b'/ws/chat/', 'root_path': '', 'headers': [(b'upgrade', b'websocket'), (b'connection', b'upgrade'), (b'host', b'ftpong.com'), (b'x-real-ip', b'172.18.0.1'), (b'x-forwarded-for', b'172.18.0.1'), (b'x-forwarded-proto', b'https'), (b'pragma', b'no-cache'), (b'cache-control', b'no-cache'), (b'user-agent', b'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'), (b'origin', b'https://ftpong.com'), (b'sec-websocket-version', b'13'), (b'accept-encoding', b'gzip, deflate, br, zstd'), (b'accept-language', b'en-US,en;q=0.9'), (b'cookie', b'csrftoken=JzVMMStt5V5ZPUlVfohYtLnvWZxfzbvc; messages=W1siX19qc29uX21lc3NhZ2UiLDAsMjAsIkNvbmZpcm1hdGlvbiBlLW1haWwgc2VudCB0byBpc2FiZWxsYWFpbWFubWFrQGdtYWlsLmNvbS4iLCIiXV0:1tOYXn:iKOePqTp59_k5x_W3WXyU2wgmrN33780m-uN3bnYoz0; sessionid=qn341qmejz67k4oh58ecls3oeb2a1jwl; jwt-access=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0Njg3ODE5LCJpYXQiOjE3MzQ2ODQyMTksImp0aSI6IjMxNjhmYzc3MjBmYjQ4MDFhZTE1Njg5NWU2NWRkZDQzIiwidXNlcl9pZCI6MzV9.Onhag1z5KM0_aTkgkFlv84BpE_CYiZTrwJ_WexOyClw; jwt-refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNDc3MDYxOSwiaWF0IjoxNzM0Njg0MjE5LCJqdGkiOiIzM2RkYzQ5MGQ5YTY0YzdkYjM2M2ViNjAzNjJkYzBjMiIsInVzZXJfaWQiOjM1fQ.Co2yIAC_mBwP26spswqA7xtARR5dXsEBcc-brUwTzp8'), (b'sec-websocket-key', b'F+RQGMr4LUXH3MUTLroN4Q=='), (b'sec-websocket-extensions', b'permessage-deflate; client_max_window_bits')], 'query_string': b'', 'client': ['172.18.0.5', 48436], 'server': ['172.18.0.2', 8000], 'subprotocols': [], 'asgi': {'version': '3.0'}, 'cookies': {'csrftoken': 'JzVMMStt5V5ZPUlVfohYtLnvWZxfzbvc', 'messages': 'W1siX19qc29uX21lc3NhZ2UiLDAsMjAsIkNvbmZpcm1hdGlvbiBlLW1haWwgc2VudCB0byBpc2FiZWxsYWFpbWFubWFrQGdtYWlsLmNvbS4iLCIiXV0:1tOYXn:iKOePqTp59_k5x_W3WXyU2wgmrN33780m-uN3bnYoz0', 'sessionid': 'qn341qmejz67k4oh58ecls3oeb2a1jwl', 'jwt-access': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0Njg3ODE5LCJpYXQiOjE3MzQ2ODQyMTksImp0aSI6IjMxNjhmYzc3MjBmYjQ4MDFhZTE1Njg5NWU2NWRkZDQzIiwidXNlcl9pZCI6MzV9.Onhag1z5KM0_aTkgkFlv84BpE_CYiZTrwJ_WexOyClw', 'jwt-refresh': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNDc3MDYxOSwiaWF0IjoxNzM0Njg0MjE5LCJqdGkiOiIzM2RkYzQ5MGQ5YTY0YzdkYjM2M2ViNjAzNjJkYzBjMiIsInVzZXJfaWQiOjM1fQ.Co2yIAC_mBwP26spswqA7xtARR5dXsEBcc-brUwTzp8'}, 'session': <django.utils.functional.LazyObject object at 0x7f3222b11bd0>, 'user': <channels.auth.UserLazyObject object at 0x7f3222b11c10>, 'path_remaining': '', 'url_route': {'args': (), 'kwargs': {}}}
    ```
- [Exception inside application: No route found for path](https://stackoverflow.com/questions/54107099/django-channels-no-route-found-for-path)
- AnonymousUser if after logged-in
    - [AnonymousUser requires JWT middleware](https://www.reddit.com/r/django/comments/uzlifr/scopeuser_in_djangochannels_is_always/)
    - [AnonymousUser requires Token middleware](https://stackoverflow.com/a/65654519)
- dj-rest-auth
    - [auth-cybersec branch has implemented the set-cookie tokens](https://dj-rest-auth.readthedocs.io/en/latest/installation.html#json-web-token-jwt-support-optional)
        - [access the cookies](https://stackoverflow.com/a/29839545)
        - [forbidden in accordance with fetch standard](https://stackoverflow.com/a/73656002)
            - [filtered out](https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie)
            - disable JWT_AUTH_HTTPONLY
            - [sammy worm](https://stackoverflow.com/a/8069697)
            - [browser returns it](https://stackoverflow.com/a/6924921)
    - [how to use access token to prove authentication](https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html#basic)
    - [jwt_auth.py](https://github.com/iMerica/dj-rest-auth/blob/master/dj_rest_auth/jwt_auth.py)
    - [token refresh and verify](https://github.com/iMerica/dj-rest-auth/blob/master/dj_rest_auth/urls.py)

### js
- [websocket MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- websocket closed or closing - [check websocket readyState](https://stackoverflow.com/a/54061045)
- [reconnecting to a closed ws](https://stackoverflow.com/a/38114820)
- [sending a message to only 1 consumer instead of all in the group on error](https://stackoverflow.com/a/72764930)

### online
- [track online/offline with websockets](https://stackoverflow.com/q/51931038)
- [django presence](https://trycatchdebug.net/news/1293139/django-channels-user-online-offline)

### notif
- [notification model, consumer and signals](https://archive.ph/mpZX3)
