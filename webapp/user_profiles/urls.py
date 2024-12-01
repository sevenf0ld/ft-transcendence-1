from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet
from django.urls import path, include

app_name = 'user_profiles'

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
urlpatterns = [
    path('api/', include(router.urls)),
]
