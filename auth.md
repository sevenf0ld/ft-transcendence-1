# week 1
## authentication, 42 oauth 2.0, jwt, 2fa
### authentication
- options
    - django auth (django.contrib.auth)
        - uses session cookies
        - not token-based for APIs
    - drf token auth
        - token does not expire unless manually revoked or reissued
        - a string in the database (Django's Token model)
    - drf jwt
        - stateless and token-based
        - suitable for SPAs as it maintains authentication across requests without sessions
        - paired with 2FA (issue JWT after 2FA)
        - better control over token expiration and rotation
        - not stored in databases so there is no server-side session storage
        - issues and signed with a secret key with a set expiry date
- [drf auth 3rd part part 1](https://www.django-rest-framework.org/api-guide/authentication/#third-party-packages)
    - [django-rest-knox](https://jazzband.github.io/django-rest-knox/)
        - mentions SPA but there is only login and logout views, none for registration or password reset
    - [djoser](https://github.com/sunscrapers/djoser)
        - has login, logout, registraion, password reset and acc activation but for custom user model use
    - [dj-rest-auth](https://github.com/iMerica/dj-rest-auth?tab=readme-ov-file)
        - specifically mentions SPA
        - has login, logout, jwt support, registration and password reset
        - [example by testdriven](https://testdriven.io/blog/django-rest-auth/)
        - [example with postman and jwt](https://medium.com/@michal.drozdze/django-rest-apis-with-jwt-authentication-using-dj-rest-auth-781a536dfb49)
    - [django-reset-authemail](https://github.com/celiao/django-rest-authemail)
        - has signup, email verification, update, login, logout, password reset and user detail but for abstract user model
- [drf auth 3rd party part 2](https://testdriven.io/blog/django-rest-auth/)
- [drf token auth](https://medium.com/django-unleashed/token-based-authentication-and-authorization-in-django-rest-framework-user-and-permissions-347c7cc472e9)
    - ISSUE: says tokens are stateless and need not query db
- [drf token auth vs drf jwt](https://stackoverflow.com/a/40495728)
#### dj-rest-auth implementation
- refer to [apps structure](https://dj-rest-auth.readthedocs.io/en/latest/introduction.html) to import views
- refer to [serializers in configurations](https://dj-rest-auth.readthedocs.io/en/latest/configuration.html) to get an idea of view names
- login tests:
    - `curl -X POST -H "Content-type: application/json" -d '{ "username": "abc", "password": "ABC!@#123"}' "http://localhost:8000/api/login/"` returns a key
    - `curl -X POST -H "Content-type: application/json" -d '{ "email": "abc@example.com", "password": "ABC!@#123"}' "http://localhost:8000/api/login/"` demands for a username
    - `curl -X POST -H "Content-type: application/json" -d '{ "username": "abc", "password": "wrong"}' "http://localhost:8000/api/login/"` rejects due to invalid credentials
    - `curl -X GET -H "Authorization: Token 6f809fe3ab803a5c5b23380458449b7892fdc479" -H "Content-type: application/json" "http://localhost:8000/api/user/"` for user details
        ```
        >>> from rest_framework.authtoken.models import Token
        >>> token = Token.objects.get(key="6f809fe3ab803a5c5b23380458449b7892fdc479")
        >>> print(token.user)
            abc
        ```

- logout tests:
    - `curl -X POST -H "Authorization: Token 6f809fe3ab803a5c5b23380458449b7892fdc479" -H "Content-type: application/json" "http://localhost:8000/api/logout/"` is successful
- registration tests:
- note:
    - frontend must change email to username (issue #12)
    - testing via curl shows login is successful
- findings:
    - providing a first param for path in urls does not override existing dj-rest-auth api paths (/api/login/ == /dj-rest-auth/login/)

### 42 oauth 2.0https://dj-rest-auth.readthedocs.io/en/latest/index.html)u
- third party package as per drf api guide: [django oauth toolkit](https://django-oauth-toolkit.readthedocs.io/en/latest/)
