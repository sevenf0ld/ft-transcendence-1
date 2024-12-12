# week 3
## friends
### friend system
- `mi/playground/friends`
    - refers to YT CodingWithMitch's "Friend System with Django (Send, Accept, Decline, Remove, Cancel)"
        - OneToOne: an engine will have a onetoone relationship to a car as a car can only have one engine
        - Foreign: a potential onetomany relationship so wheels on a car are tied to a specific car but onetoone is wrong bc it would indicate one car one wheel
    - deciding views
        - [FBVs vs CBVs with a todo list](https://testdriven.io/blog/django-class-based-vs-function-based-views/)
        - [APIViews vs ViewSets with books](https://medium.com/@mathur.danduprolu/apiview-vsviewset-in-django-rest-framework-aa9a77921d53)
        - [DRF APIView implementation](https://github.com/encode/django-rest-framework/blob/master/rest_framework/generics.py#L188)
        - [individual CRUD APIView intro](https://medium.com/@thenavarro97/mastering-django-rest-frameworks-class-based-api-views-187a15bb2709)
        - [concrete APIViews: generics + mixins](https://www.django-rest-framework.org/api-guide/generic-views/#createapiview)
        - [DRF Mixin implementation](https://github.com/encode/django-rest-framework/blob/master/rest_framework/mixins.py)
        - [different types of ViewSets and custom actions](https://python.plainenglish.io/django-rest-framework-how-to-use-viewsets-effectively-5e2f3b29f627)
        - [customized actions in ViewSets as per documentation](https://www.django-rest-framework.org/api-guide/viewsets/#marking-extra-actions-for-routing)
        - [futher guidance on custom actions in ViewSets](https://djangocentral.com/how-to-use-action-decorator-in-django-rest-framework/#using-action-with-drf-viewset)
        - [specific explanation and examples on every ViewSet feature](https://www.laceyhenschel.com/blog/2021/2/22/what-you-should-know-about-drf-part-1-modelviewset-attributes-and-methods)
        - [DRF ViewSet documentation](https://github.com/encode/django-rest-framework/blob/master/docs/api-guide/viewsets.md)
        - [DRF ViewSet implementation](https://github.com/encode/django-rest-framework/blob/master/rest_framework/viewsets.py#L245)
        - [customized ViewSet which does not have unnecessary CRUD methods defined](https://stackoverflow.com/a/61696302)
        - [explicit URL ViewSet binding](https://www.django-rest-framework.org/tutorial/6-viewsets-and-routers/#binding-viewsets-to-urls-explicitly)
        - the three views
            - [simple comparison](https://medium.com/@hordunlarmy/understanding-apiview-generic-views-and-viewsets-in-django-rest-framework-0d89ac6b9614)
            - [DRF class-based cheat sheet](https://github.com/smit-vekariya/cheat-sheet/blob/main/DRF.md)
    - serializers
        - [SerializerMethodField documentation](https://www.django-rest-framework.org/api-guide/fields/#serializermethodfield)
            - [counting in a serializer](https://www.reddit.com/r/django/comments/74uj5w/how_to_use_custom_variables_in_serializers/)
            - [alt to counting by using a property decoration in models](https://stackoverflow.com/a/24273265)
        - [serialize and deserialize](https://blog.devgenius.io/serialization-and-deserialization-in-django-rest-framework-21c2cfe312a2)
        - [DRF serializer fields documentation](https://www.django-rest-framework.org/api-guide/fields/)
        - [DRF serializer implementation](https://github.com/encode/django-rest-framework/blob/master/rest_framework/serializers.py)
        - [customize serialization and deserialization](https://www.django-rest-framework.org/api-guide/serializers/#baseserializer)
            - [specifically on to_internal_value()](https://stackoverflow.com/a/38606711)
                - [i](https://medium.com/@raaj.akshar/how-to-effectively-use-django-rest-framework-serializers-during-write-operations-dd73b62c26b5)
                - [ii](https://m-usmaan.medium.com/understanding-drfs-to-internal-value-d2e4723d8ad1)
        - note:
        ```
        # serialization: complex -> python -> json
            # .to_representation()

        # if the sender and recipient variables are taken from the model
            # undesired S: listing FriendRequest objects will be on a primary key (User object) basis
            # D: instantiation of FriendRequest objects will be on username (User object field) basis

        # deserialization: json -> py -> complex
            # .to_internal_value()
        # but POSTing still relies on primary key (User object basis) because it is an internal change not external

        # if the sender and recipient variables are specified to be a text representation
            # the above is reversed for both D and S
            # undesired D
        ```
    - querysets
        - [different parts to a queryset](https://archive.ph/SzkkE)
        - [difference between different get functions in APIView](https://stackoverflow.com/a/36950584)
        - [customize queries in APIView using get instead of filter queryset function as per source](https://github.com/encode/django-rest-framework/blob/master/rest_framework/generics.py#L52)
            - [more on get_queryset](https://stackoverflow.com/a/51220687)
    - `FriendRequest`
        - [DRF request attributes](https://www.django-rest-framework.org/api-guide/requests/) an [extension of Django HttpRequest](https://docs.djangoproject.com/en/5.1/ref/request-response/)
        - LIST
            - `curl -X GET -H "Content-type: application/json" -d '{"username": "maiman-m"}' 'https://localhost:8000/api/friends/friend-request-av/list/' --insecure`
            - `curl -X GET -H "Content-type: application/json" -d '{"username": "isa"}' 'https://localhost:8000/api/friends/friend-request-vs/' --insecure`
        - CREATE
            - [saving in a serializer vs in a view](https://stackoverflow.com/q/67926210)
            - [difference between create function in serializers and modelviewsets](https://stackoverflow.com/a/41094241)
            - [make use of related_name in models](https://stackoverflow.com/a/36916782)
            - [get_or_create to avoid race conditions](https://docs.djangoproject.com/en/dev/ref/models/querysets/#get-or-create) can be considered as an alt implementation to add_acc or create request
                - [further examples](https://www.queworx.com/django/django-get_or_create/)
            - [faster lookup for is_friend and is_blocked](https://stackoverflow.com/a/8538981)
            - `curl -X POST -H "Content-type: application/json" -d '{"sender": "when", "recipient": "what"}' 'https://localhost:8000/api/friends/friend-request-av/create/' --insecure`
        - DELETE (& UPDATE)
            - [REST instead of HTTP for DELETE](https://stackoverflow.com/a/46168166)
            - [supported django HTTP methods](https://docs.python.org/3/library/http.html#http.HTTPMethod)
            - [get_object examples and permission check](https://medium.com/@katheller/how-to-use-get-object-in-drf-generics-views-examples-a7b879ff2d50)
            - [specific actions in viewset](https://stackoverflow.com/a/22597553)
            - [deletion using permission mixin and delete view](https://stackoverflow.com/a/26155074)
            - [get_object_or_404](https://stackoverflow.com/a/36515906)
            - [facebook cancellation]
            - `curl -X DELETE -H "Content-type: application/json" -d '{"sender": "when", "recipient": "what"}' 'https://localhost:8000/api/friends/friend-request-av/cancel/' --insecure`
            - `curl -X DELETE -H "Content-type: application/json" -d '{"sender": "what", "recipient": "when"}' 'https://localhost:8000/api/friends/friend-request-av/decline/' --insecure`
            - `curl -X DELETE -H "Content-type: application/json" -d '{"sender": "what", "recipient": "when"}' 'https://localhost:8000/api/friends/friend-request-av/accept/' --insecure`
    - `FriendList`
        - DELETE
            - [multiple serializers](https://stackoverflow.com/a/57989085)
            - `curl -X DELETE -H "Content-type: application/json" -d '{"user": "what", "target": "who"}' 'https://localhost:8000/api/friends/friend-list-av/unfriend/' --insecure`
            - `curl -X DELETE -H "Content-type: application/json" -d '{"user": "what", "target": "how"}' 'https://localhost:8000/api/friends/friend-list-av/block/' --insecure`
        - UPDATE
            - `curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "who"}' 'https://localhost:8000/api/friends/friend-list-av/unfriend/' --insecure`
            - `curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "how"}' 'https://localhost:8000/api/friends/friend-list-av/block/' --insecure`
            - `curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "how"}' 'https://localhost:8000/api/friends/friend-list-av/unblock/' --insecure`
        - LIST
            - [custom views must call is_valid for serializer validation to work](https://www.reddit.com/r/django/comments/kdjewp/comment/gfwvupg/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
            - `curl -X GET -H "Content-type: application/json" 'https://localhost:8000/api/friends/friend-list-av/list/' --insecure`
                - serializer validation does not complain because is_valid is not called
        - RETRIEVE
            - `curl -X GET -H "Content-type: application/json" -d '{"user": "what", "display": "added"}' 'https://localhost:8000/api/friends/friend-list-av/retrieve/' --insecure`
                - all three displays (added, pending and blocked) should be returned together
            - `curl -X GET -H "Content-type: application/json" -d '{"user": "what"}' 'https://localhost:8000/api/friends/friend-list-av/retrieve/' --insecure`
