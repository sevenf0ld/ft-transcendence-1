from rest_framework.routers import DefaultRouter
from .views import FriendViewSet
from django.urls import path, include

app_name = 'friends'

router = DefaultRouter()
router.register(r'friends', FriendViewSet, basename='friend')
urlpatterns = [
    path('api/', include(router.urls)),
]
