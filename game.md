## game

### match history
- RETRIEVE
    - use [lookup](https://medium.com/@thenavarro97/mastering-django-rest-frameworks-class-based-api-views-187a15bb2709)s
    - send [request context](https://micropyramid.com/blog/django-rest-framework-send-extra-context-data-to-serializers) serializers along with different types of views as examples
        - ~~change `target` to `viewee`, it conflicts with FriendList~~
            - should access `.winner` instead of `.winner.user`, this was a wrong reference instead of context conflict
    - ~~serializer [field-level](https://www.django-rest-framework.org/api-guide/serializers/#field-level-validation) validation~~ kwargs used instead of body
    - `curl -X GET 'https://localhost:443/api/games/history/upt' --insecure`
        -  `{"pvp":[{"match_time":"2024-12-28T18:13:48.460482+08:00","status":"WON","game_type":"PVP","opponent":"isa"}],"tnm":[]}`
    - `curl -X GET 'https://localhost:443/api/games/history/maiman-m' --insecure`
        -  `{"pvp":[{"match_time":"2024-12-28T15:10:47.317312+08:00","status":"LOST","game_type":"PVP","opponent":"isa"}],"tnm":[]}`
    - `curl -X GET 'https://localhost:443/api/games/history/isa' --insecure`
        -  `{"pvp":[{"match_time":"2024-12-28T15:10:47.317312+08:00","status":"WON","game_type":"PVP","opponent":"maiman-m"},{"match_time":"2024-12-28T18:13:48.460482+08:00","status":"LOST","game_type":"PVP","opponent":"upt"}],"tnm":[]}`
    ```
    >>> from django.contrib.auth.models import User
    >>> maiman = User.objects.get(username='maiman-m')
    >>> from games.models import Match, Tournament, GameHistory
    >>> isa = User.objects.get(username='isa')
    >>> match = Match.objects.get(host=isa)
    >>> print(match)
    isa vs maiman-m
    >>> print(match.p1)
    - `curl -X GET 'https://localhost:443/api/games/history/isa' --insecure`
        -  `{"pvp":[{"match_time":"2024-12-28T15:10:47.317312+08:00","status":"WON","game_type":"PVP","opponent":"maiman-m"},{"match_time":"2024-12-28T18:13:48.460482+08:00","status":"LOST","game_type":"PVP","opponent":"upt"}],"tnm":[]}`
    isa
    >>> print(match.p2)
    maiman-m
    >>> print(match.s1)
    3
    >>> print(match.s2)
    1
    >>> print(match.winner)
    isa
    >>> print(match.winner is isa)
    False
    >>> print(match.winner == isa)
    True
    >>> print(match.host)
    isa
    >>> print(match.host.username)
    isa
    >>> print(match.pvp.all())
    <QuerySet [<GameHistory: GameHistory object (2)>]>
    ```
- [format datetime](https://strftime.org/)
    - `{"pvp":[{"match_date":"Dec 28","match_time":"03:10 PM","status":"LOST","game_type":"PVP","opponent":"isa"}],"tnm":[]}`
- [sort objects in descending order](https://docs.djangoproject.com/en/5.1/ref/models/querysets/#order-by)
    - `{"pvp":[{"match_date":"Dec 28","match_time":"06:13 PM","status":"LOST","game_type":"PVP","opponent":"upt"},{"match_date":"Dec 28","match_time":"03:10 PM","status":"WON","game_type":"PVP","opponent":"maiman-m"}],"tnm":[]}`

### tournament history
