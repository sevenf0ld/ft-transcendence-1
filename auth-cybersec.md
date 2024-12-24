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
- [drf auth 3rd party packages](https://www.django-rest-framework.org/api-guide/authentication/#third-party-packages)
    - [django-rest-knox](https://jazzband.github.io/django-rest-knox/)
        - mentions SPA but there is only login and logout views, none for registration or password reset
    - [djoser](https://github.com/sunscrapers/djoser)
        - has login, logout, registraion, password reset and acc activation but for custom user model use
    - [dj-rest-auth](https://github.com/iMerica/dj-rest-auth?tab=readme-ov-file)
        - specifically mentions SPA
        - has login, logout, jwt support, registration and password reset
        - [example by testdriven](https://testdriven.io/blog/django-rest-auth/)
        - [example with postman and jwt](https://medium.com/@michal.drozdze/django-rest-apis-with-jwt-authentication-using-dj-rest-auth-781a536dfb49)
        - [example with django api](https://medium.com/@alashimuyiwa/authentication-with-dj-rest-auth-79a7c92b8365)
    - [django-reset-authemail](https://github.com/celiao/django-rest-authemail)
        - has signup, email verification, update, login, logout, password reset and user detail but for abstract user model
- [drf token auth](https://medium.com/django-unleashed/token-based-authentication-and-authorization-in-django-rest-framework-user-and-permissions-347c7cc472e9)
    - ISSUE: says tokens are stateless and need not query db
- [drf token auth vs drf jwt](https://stackoverflow.com/a/40495728)

### dj-rest-auth implementation
- refer to [apps structure](https://dj-rest-auth.readthedocs.io/en/latest/introduction.html) to import views
- refer to [serializers in configurations](https://dj-rest-auth.readthedocs.io/en/latest/configuration.html) to get an idea of view names
    - [the serializer guide i wish i had](https://sourcery.blog/comprehensive-guide-to-serializers-in-django-rest-framework/)
- refer to [endpoints](https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html) to get api paths, expected params and outputs
- for registration using django-allauth, must configure [SITE ID](https://stackoverflow.com/a/48124662) and SMTP
- login tests (token authentication):
    - `curl -X POST -H "Content-type: application/json" -d '{ "username": "someone", "password": "SOME!@#123"}' "https://localhost:8000/api/login/"` returns a key
    - `curl -X POST -H "Content-type: application/json" -d '{ "email": "email@domain.com", "password": "SOME!@#123"}' "https://localhost:8000/api/login/"` demands for a username
    - `curl -X POST -H "Content-type: application/json" -d '{ "username": "SOME", "password": "password"}' "https://localhost:8000/api/login/"` rejects due to invalid credentials
    - `curl -X GET -H "Authorization: Token 63df6770194a550498e986dffcb81fe97fa7c802" -H "Content-type: application/json" "https://localhost:8000/api/user/"` for user details
        ```
        >>> from rest_framework.authtoken.models import Token
        >>> token = Token.objects.get(key="63df6770194a550498e986dffcb81fe97fa7c802")
        >>> print(token.user)
            someone
        ```
- logout tests:
    - `curl -X POST -H "Authorization: Token 63df6770194a550498e986dffcb81fe97fa7c802" -H "Content-type: application/json" "https://localhost:8000/api/logout/"` is successful
- registration tests:
    - `curl -X POST -H "Content-type: application/json" -d '{
      "username": "someone",
      "email": "email@domain.com",
      "password1": "SOME!@#123",
      "password2": "SOME!@#123"
      }' 'http://localhost:8000/api/registration/'`
- note:
    - frontend must change email to username (issue #12)
    - testing via curl shows login is successful
- findings:
    - providing a first param for path in urls does not override existing dj-rest-auth api paths (/api/login/ == /dj-rest-auth/login/) because root registers /dj-rest-auth/ whereas app registers /api/

### dj-allauth implementation
- refer to [configuration](https://docs.allauth.org/en/latest/account/configuration.html) for information on default account-related settings
- refer to [email](https://docs.allauth.org/en/latest/common/email.html) for subject and content modifications
- note:
    - enable email verfication to disable automatic login upon successful registration as per [documentation](https://docs.allauth.org/en/latest/account/signals.html) or [source code](https://github.com/pennersr/django-allauth/blob/main/allauth/account/signals.py#L10)
    - modify site
        ```
        >>> from django.contrib.sites.models import Site
        >>> site = Site.objects.get(id=1)
        >>> site.name = "FT_PONG"
        >>> site.domain = "ftpong.co"
        >>> site.save()
        ```
    - `send_mail` not found in [DefaultAdapter](https://docs.allauth.org/en/latest/account/adapter.html#allauth.account.adapter.DefaultAccountAdapter)
    - [email verification using dj-rest-auth which in turn uses django-allauth](https://medium.com/@michal.drozdze/django-rest-framework-jwt-authentication-sign-up-api-with-email-confirmation-0cfc6054ce8e)
        - email verification as per [registration/verify-email](https://dj-rest-auth.readthedocs.io/en/latest/api_endpoints.html#registration)
        - import [function](https://stackoverflow.com/a/48090640) instead of view in project root urls

### jwt
- [what is jwt](https://supertokens.com/blog/what-is-jwt#)
- jwt is [not controversial](https://medium.com/geekculture/jwt-authentication-in-django-part-1-implementing-the-backend-b7c58ab9431b)
    - store jwt tokens in a [httpOnly](https://stackoverflow.com/a/44869686) cookie instead of LocalStorage or regular cookies
    - the [how](https://stackoverflow.com/q/63493909) and subsequent discussions on both django and js side
    - discussion on where [should](https://archive.ph/o3G2Y) jwt be stored for SPA and preventing CSRF attacks using the double tokens policy
        - httpOnly doesn't prevent [CSRF](https://security.stackexchange.com/a/218954), only reduces XSS risks
    - set [httpOnly](https://stackoverflow.com/q/3529695) in django
    - cookies [not stored](https://stackoverflow.com/q/42188260)
    - refer to [block access to cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#block_access_to_your_cookies)
    - [separates backend from frontend](https://fractalideas.com/blog/making-react-and-django-play-well-together-single-page-app-model/) and mentions CORS
    - note:
        - solution: either temporarily downgrade to 3.11 or fix [AttributeError: module 'ssl' has no attribute 'wrap_socket'](https://github.com/eventlet/eventlet/issues/795#issuecomment-1806126264) `find ~/.local/lib/python3.12/site-packages -name "runsslserver.py"`
        - edit:
            ```
            class SecureHTTPServer(ThreadedWSGIServer):
                #def __init__(self, address, handler_cls, certificate, key, ipv6=False):
                #    super(SecureHTTPServer, self).__init__(address, handler_cls, ipv6=ipv6)
                #    self.socket = ssl.wrap_socket(self.socket, certfile=certificate,
                #                                  keyfile=key, server_side=True,
                #                                  ssl_version=_ssl_version,
                #                                  cert_reqs=ssl.CERT_NONE)
                def __init__(self, address, handler_cls, certificate, key, ipv6=False):
                    super(SecureHTTPServer, self).__init__(address, handler_cls, ipv6=ipv6)
                    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
                    context.load_cert_chain(certfile=certificate, keyfile=key)
                    self.socket = context.wrap_socket(self.socket, server_side=True)
            ```
- jwt using [dj-rest-auth and authorization header](https://medium.com/@michal.drozdze/django-rest-apis-with-jwt-authentication-using-dj-rest-auth-781a536dfb49) instead of session cookies
- [discussion](https://www.reddit.com/r/django/comments/i72pyf/why_should_i_prefer_jwt_authentication_over_token/) on statelessness, database queries and jwt antipatterns
- [jwt vs cookies, xss vs csrf](https://stackoverflow.com/q/37582444)
- refer to [settings](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html) for simplejwt config
- refer to [configuration](https://dj-rest-auth.readthedocs.io/en/latest/configuration.html#configuration) for dj-rest-auth jwt config
- tests:
    1. log in
        - `curl -X POST -H "Content-type: application/json" -d '{ "username": "someone", "password": "SOME!@#123"}' "https://localhost:8000/api/login/" --insecure`
        - `{"access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMTczOTY3LCJpYXQiOjE3MzIxNzAzNjcsImp0aSI6IjVhZmJjY2Q5ZDJiNDQ2YWM5YzMyZTQyZTZhMzU4YmE3IiwidXNlcl9pZCI6NzJ9.HlolAfk0dQjjN0Wt0y2qL562XmW10a7efiaI5RIB1tY","refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMjI1Njc2NywiaWF0IjoxNzMyMTcwMzY3LCJqdGkiOiIyYjlmOTM0YjM4ZWQ0NTAyOWYyYTExNjRiMDFhZTk0ZSIsInVzZXJfaWQiOjcyfQ.1KR3cDeQZZS-E6EFstfbBQib9u3u3zV2tkv1tG_2AQQ","user":{"pk":72,"username":"someone","email":"email@domain.com","first_name":"","last_name":""}}`
    2. refresh token
        - `curl -X POST https://localhost:8000/dj-rest-auth/token/refresh/ --insecure`
        - `{"detail":"No valid refresh token found.","code":"token_not_valid"}`
        - `curl -X POST -d "refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMjI1NjY4MywiaWF0IjoxNzMyMTcwMjgzLCJqdGkiOiJkZmI4N2Q3NDhhMDQ0ZWJiODk2YTYxMTM4YzdjZWFiZSIsInVzZXJfaWQiOjcyfQ.gmeO7NMHKXnaZdWsUhypAy0FEZ4eOXO10a64iZ4539w" https://localhost:8000/dj-rest-auth/token/refresh/ --insecure`
        - `{"access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMTczOTg1LCJpYXQiOjE3MzIxNzAyODMsImp0aSI6IjE5ZTMxZDE0N2NlNjRmMzBiZTVjYWY2ODc3YzQ0ODNlIiwidXNlcl9pZCI6NzJ9.JgUwfJ3s81PL55yqsqE48_DyxtaaKYveHBrl0jaQAcU","access_expiration":"2024-11-21T07:26:25.385883Z"}`

### 42 oauth 2.0
- [all on 2.0](https://www.oauth.com/)
- [42 webapp flow](https://api.intra.42.fr/apidoc/guides/web_application_flow)
    - [extension of the authorization grant in SPAs](https://www.oauth.com/oauth2-servers/single-page-apps/)
    - [how does client secrets come into play](https://stackoverflow.com/a/39295543)
- oauth and [authorization flow](https://stackoverflow.com/a/27051810)
- the different [grants](https://stackoverflow.com/a/27575242) in oauth2
- 3rd party options
    - as per [drf auth 3rd party](https://www.django-rest-framework.org/api-guide/authentication/#third-party-packages)
        - [django-oauth-toolkit](https://django-oauth-toolkit.readthedocs.io/en/latest/)
            - recommended by drf for 2.0
            - [explanation and guide](https://princeigwe.medium.com/a-guide-to-oauth2-0-authorization-with-django-rest-framework-521c36c8cb18)
        - [drf-oauth](https://jpadilla.github.io/django-rest-framework-oauth/authentication/#oauth2authentication)
            - was part of drf but is now 3rd party
        - [drf-social-oauth2](https://drf-social-oauth2.readthedocs.io/en/latest/integration.html)
            - tokens are JWTed
            - [set up new app](https://drf-social-oauth2.readthedocs.io/en/latest/application.html#setting-up-a-new-application)
            - too difficult via admin panel
    - others
        - [django-allauth](https://docs.allauth.org/en/latest/socialaccount/index.html)
            - manually register [access token](https://medium.com/codex/google-sign-in-rest-api-with-python-social-auth-and-django-rest-framework-4d087cd6d47f)
            - [social authentication example](https://www.webforefront.com/django/setupdjangosocialauthentication.html)
            - [custom gitea provider](https://github.com/pennersr/django-allauth/tree/main/allauth/socialaccount/providers/gitea)
            - refer to [default adapter](https://github.com/pennersr/django-allauth/blob/main/allauth/socialaccount/adapter.py) which probably is not necessary because there is an adapter in views for other socials
            - refer to [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/installation.html#social-authentication-optional) for SocialLoginView
            - [allow social account to be pong account](https://stackoverflow.com/questions/19354009/django-allauth-social-login-automatically-linking-social-site-profiles-using-th)
            - [link social account to django account](https://stackoverflow.com/q/28897220)
            - look into [dj-rest-auth](https://github.com/Tivix/django-rest-auth/issues/409) SocialConnectView
        - [django-oauth2-provider](https://django-oauth2-provider.readthedocs.io/en/latest/getting_started.html#configuration)
- note (js):
    - [redirect](https://stackoverflow.com/a/11690095)
    - [generate random long string](https://stackoverflow.com/a/1349426)
    - [encode uri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
        - encode components but not the link or it will result in invalid uri
    - [detect if a page has been fully loaded after a redirection](https://stackoverflow.com/a/1033448)
        - [DOMContentLoaded vs load events](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
    - [parse query strings](https://stackoverflow.com/a/901144)
    - [map vs object](https://stackoverflow.com/a/18541990)
    - [create dictionaries](https://stackoverflow.com/q/7196212)
    - [store in webstorage](https://stackoverflow.com/a/19211793)

### 2fa (email)
- [using pytop and has verified fields](https://dev.to/rupesh_mishra/implementing-email-and-mobile-otp-verification-in-django-a-comprehensive-guide-4oo0)
- [refer to allauth.mfa](https://django-allauth.readthedocs.io/en/latest/mfa/introduction.html)
    - [allauth mfa adapter](https://github.com/pennersr/django-allauth/blob/main/allauth/mfa/app_settings.py)
    - [setup by gaetan gond](https://gaetangrond.me/posts/django/how-to-add-mfa-to-django-allauth-in-under-5mn/)
    - [understand the implementation](https://github.com/pennersr/django-allauth/discussions/3465)
- a very simple [guide](https://studygyaan.com/django/login-with-otp-via-email-phone-in-django-rest-framework?amp=1) on the basics
- a very complex [guide](https://awstip.com/implementing-mobile-number-verification-and-otp-based-authentication-in-django-django-rest-48c54382e989)
- utilizes [cron job](https://blog.stackademic.com/implementing-two-factor-authentication-in-django-rest-api-with-temporary-code-verification-48582987e63c) for expiration reset
- utilizes [cache](https://medium.com/@sammyasopa/building-a-secure-otp-based-user-authentication-system-f06102afef8d) instead of a new mfa-related model
    - [django cache framework](https://docs.djangoproject.com/en/5.1/topics/cache/)
    - [all on caching in django](https://hackernoon.com/caching-in-django-everything-you-need-to-know)_

## middleware
- middleware [types and explanations](https://www.webforefront.com/django/middlewaredjango.html)

# week 2
## form and database validation
### registration
- refer to [allauth account config](https://django-allauth.readthedocs.io/en/latest/account/configuration.html) for registration restrictions
    - [username validator to be a list](https://github.com/pennersr/django-allauth/pull/1648)
- [django User model case-sensitivity and field uniqueness](https://simpleisbetterthancomplex.com/article/2021/07/08/what-you-should-know-about-the-django-user-model.html#user-model-limitations)
    - [django built-in validators](https://docs.djangoproject.com/en/5.1/ref/validators/#built-in-validators)
    - [django auth built-in validators](https://docs.djangoproject.com/en/5.1/ref/contrib/auth/#validators)
    - [alnum username validator](https://stackoverflow.com/a/17165415)
    - [append validator in __init__](https://stackoverflow.com/q/12062258), [alternatives](https://stackoverflow.com/a/48558058)
    - [get User meta field](https://stackoverflow.com/a/29423946)
    - [change the default `username_validator` property](https://stackoverflow.com/a/48030767)
- [django lookups](https://archive.ph/rrdfG)

# security
## XSS
- [protection as per django](https://docs.djangoproject.com/en/5.1/topics/security/#cross-site-scripting-xss-protection)
- [examples and preventon](https://www.stackhawk.com/blog/django-xss-examples-prevention/)
- [jwt vs cookies, xss vs csrf](https://stackoverflow.com/q/37582444)
## SQL injection
- [protection as per django](https://docs.djangoproject.com/en/5.1/topics/security/#sql-injection-protection)
## password hashing
## JWT
- authentication vs authorization
    - former: username + password
    - latter: verify requests is by the logged-in user
- [jwt vs cookies, xss vs csrf](https://stackoverflow.com/q/37582444)
## CSRF
- CORS
- [protection as per django](https://docs.djangoproject.com/en/5.1/topics/security/#cross-site-request-forgery-csrf-protection)
- [validate host header to prevent csrf](https://docs.djangoproject.com/en/5.1/topics/security/#host-header-validation)
- [jwt vs cookies, xss vs csrf](https://stackoverflow.com/q/37582444)
## HTTPS
- [ssl and https as per django](https://docs.djangoproject.com/en/5.1/topics/security/#ssl-https)
