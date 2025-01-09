#from rest_framework.routers import DefaultRouter
#from .views import ProfileViewSet
from django.urls import path, include
from .views import (
    upload_avatar,
    FriendProfileRetrieveAPIView,
    HomeProfileRetrieveAPIView,
    update_user_language,
    remove_avatar
)

app_name = 'user_profiles'

#router = DefaultRouter()
#router.register(r'profiles', ProfileViewSet, basename='profile')
#urlpatterns = [
#    path('api/', include(router.urls)),
#
#]

urlpatterns = [
    path('upload-avatar/', upload_avatar),
    path('view-friend-profile/', FriendProfileRetrieveAPIView.as_view()),
    path('view-home-profile/', HomeProfileRetrieveAPIView.as_view()),
    path('update-user-language/', update_user_language),
    path('remove-avatar/', remove_avatar),
]
