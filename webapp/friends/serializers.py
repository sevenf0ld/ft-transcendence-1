from rest_framework import serializers 
  
from .models import Friend
  
class FriendModelSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Friend
        fields = '__all__'
