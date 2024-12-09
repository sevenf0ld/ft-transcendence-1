from django.urls import re_path
from django_prometheus import exports

urlpatterns = [
    re_path(r'^metrics$', exports.ExportToDjangoView, name="metrics"),
]
