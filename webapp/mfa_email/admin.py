from django.contrib import admin

# Register your models here.
from .models import MfaEmail

admin.site.register(MfaEmail)
