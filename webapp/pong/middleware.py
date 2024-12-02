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
