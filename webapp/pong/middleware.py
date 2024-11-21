import json
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings


class MoveJWTRefreshCookieIntoTheBody(MiddlewareMixin):
    """
    For Django Rest Framework JWT's POST "/token-refresh" endpoint. Check
    for a 'refresh' in the request.COOKIES and if there, move it to the body payload.
    """
    JWT_AUTH_REFRESH_COOKIE = settings.REST_AUTH.get('JWT_AUTH_REFRESH_COOKIE', 'refresh_token')

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, *view_args, **view_kwargs):
        if request.path == 'dj-rest-auth/token/refresh/' and JWT_AUTH_REFRESH_COOKIE in request.COOKIES:
            if request.body != b'':
                data = json.loads(request.body)
                data['refresh'] = request.COOKIES[JWT_AUTH_REFRESH_COOKIE]
                print("1) Request body before modification:", data)
                request._body = json.dumps(data).encode('utf-8')
                print("2) Request body after modification:", data)
            else:
                print("The incoming request body must be set to an empty object.")

        return None
