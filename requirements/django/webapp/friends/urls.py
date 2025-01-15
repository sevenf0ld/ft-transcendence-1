from rest_framework.routers import DefaultRouter
#from .views import (
#    FriendRequestViewSet,
#    FriendRequestWriteOnlyViewSet,
#    FriendListReadOnlyViewSet,
#)
from .views import (
    FriendRequestCreateAPIView,
    #FriendRequestRetrieveAPIView,
    #FriendRequestListAPIView,
    FriendRequestDestroyAPIView,
    FriendListRetrieveAPIView,
    #FriendListListAPIView,
    FriendListUpdateAPIView,
)
from django.urls import path, include

app_name = 'friends'

router = DefaultRouter()
# basename is for reverse lookup like name in path
#router.register(r'friend-request-vs', FriendRequestViewSet, basename='fr')
#router.register(r'friend-request-write', FriendRequestWriteOnlyViewSet, basename='fw')
#router.register(r'friend-list-vs', FriendListReadOnlyViewSet, basename='fl')

urlpatterns = [
    path('', include(router.urls)),
    #=================================#
    #=========friend request==========#
    #=================================#
    path('friend-request-av/create/', FriendRequestCreateAPIView.as_view()),
    #path('friend-request-av/retrieve/<int:pk>/', FriendRequestRetrieveAPIView.as_view()),
    # for development purposes
    #path('friend-request-av/list/', FriendRequestListAPIView.as_view()),
    path('friend-request-av/cancel/', FriendRequestDestroyAPIView.as_view()),
    path('friend-request-av/decline/', FriendRequestDestroyAPIView.as_view()),
    path('friend-request-av/accept/', FriendRequestDestroyAPIView.as_view()),
    #=================================#
    #==========friend list============#
    #=================================#
    path('friend-list-av/retrieve/', FriendListRetrieveAPIView.as_view()),
    # for development purposes
    #path('friend-list-av/list/', FriendListListAPIView.as_view()),
    path('friend-list-av/unfriend/', FriendListUpdateAPIView.as_view()),
    path('friend-list-av/block/', FriendListUpdateAPIView.as_view()),
    path('friend-list-av/unblock/', FriendListUpdateAPIView.as_view()),
]
