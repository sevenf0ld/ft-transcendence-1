from django.urls import path
from .views import FriendView, LoginView, LogoutView, MatchView, ProfileView, RegisterView, ResetPasswordView


urlpatterns = [
    path('friends/', FriendView.as_view(), name='friends'),
    path('friends/add/<str:username>/', FriendView.as_view(), name='add_friend'),
    path('login/', LoginView.as_view(), name='custom_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('matches/', MatchView.as_view(), name='matches'),
    path('register/', RegisterView.as_view(), name='register'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]
