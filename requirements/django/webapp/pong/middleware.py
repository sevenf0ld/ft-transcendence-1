import json
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

JWT_AUTH_REFRESH_COOKIE = settings.REST_AUTH.get('JWT_AUTH_REFRESH_COOKIE', 'refresh_token')

class MoveJWTRefreshCookieIntoTheBody(MiddlewareMixin):
    """
    For Django Rest Framework JWT's POST "/token-refresh" endpoint. Check
    for a 'refresh' in the request.COOKIES and if there, move it to the body payload.
    """

    def __init__(self, get_response):
        #print('MOVE JWT INIT')
        self.get_response = get_response

    def __call__(self, request):
        #print('MOVE JWT CALL')
        #print(response)
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, *view_args, **view_kwargs):
        #print('MOVE JWT PROCESS VIEW')
        #print(request.path)
        #print(request.body)
        if request.path == '/dj-rest-auth/token/refresh/' and JWT_AUTH_REFRESH_COOKIE in request.COOKIES:
            if request.body != b'':
                data = json.loads(request.body)
                data['refresh'] = request.COOKIES[JWT_AUTH_REFRESH_COOKIE]
                request._body = json.dumps(data).encode('utf-8')

        return None

# async chat server
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        # doesn't have non-raw cookies like in consumers
        headers = dict(scope['headers'])
        cookies = headers.get(b'cookie', b'').decode('utf-8')
        chunk_of_cookies = cookies.split(';')

        access_token = None
        for cookie in chunk_of_cookies:
            if 'jwt-access' in cookie:
                access_token = cookie.split('=')[-1]
                jwt_object      = JWTAuthentication()
                validated_token = jwt_object.get_validated_token(access_token)
                user = await sync_to_async(jwt_object.get_user)(validated_token)
                scope['user'] = user
                break

        return await super().__call__(scope, receive, send)

import logging

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code < 400:
            logger = logging.getLogger('django.request')
            logger.info(f'{response.status_code} {request.method} {request.path}')
        return response
