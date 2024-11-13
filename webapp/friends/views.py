from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Friend
from .serializers import FriendModelSerializer

class FriendViewSet(viewsets.ModelViewSet):
    serializer_class = FriendModelSerializer
    queryset = Friend.objects.all()
