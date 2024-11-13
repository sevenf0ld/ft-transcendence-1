from django.urls import path
from .import views

app_name = 'frontend'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/login/', views.LoginAPIView.as_view()),
    path('api/logout/', views.LogoutAPIView.as_view()),
]
