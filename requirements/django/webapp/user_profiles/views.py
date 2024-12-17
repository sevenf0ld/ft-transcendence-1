from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Profile
from .serializers import ProfileModelSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileModelSerializer
    queryset = Profile.objects.all()
