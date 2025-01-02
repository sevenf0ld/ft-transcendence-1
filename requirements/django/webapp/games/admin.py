from django.contrib import admin

# Register your models here.
from .models import Match

admin.site.register(Match)

from .models import Tournament

admin.site.register(Tournament)

from .models import GameHistory

admin.site.register(GameHistory)

from .models import Room

admin.site.register(Room)
