from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
        except User.DoesNotExist:
            error_content = {
                'error': 'Invalid credentials',
                'email': request.data.get('email'),
            }
            return Response(error_content, status=status.HTTP_401_UNAUTHORIZED)

        if user is not None:
            login(request, user)
            success_content= {
                'message': 'Authentication successful',
                'user': user.username,
            }
            return Response(success_content, status=status.HTTP_200_OK)
        else:
            error_content = {
                'error': 'Invalid credentials',
                'email': request.data.get('email'),
            }
            return Response(error_content, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        success_content= {
            'message': 'Authentication successful',
        }
        return Response(success_content, status=status.HTTP_200_OK)
