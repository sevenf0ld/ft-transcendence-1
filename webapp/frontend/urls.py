from django.urls import path
from .import views
from dj_rest_auth.views import (
    LoginView,
    LogoutView,
    UserDetailsView,
)
from dj_rest_auth.registration.views import (
    RegisterView,
)

app_name = 'frontend'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/login/', LoginView.as_view()),
    path('api/logout/', LogoutView.as_view()),
    path('api/user/', UserDetailsView.as_view()),
    path('api/registration/', RegisterView.as_view()),
]
