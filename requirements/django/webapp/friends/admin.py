from django.contrib import admin

# Register your models here.
from .models import FriendList, FriendRequest

class FriendRequestAdmin(admin.ModelAdmin):
    # filter on the RHS in admin
    list_filter = ['sender', 'recipient']
    # override __str__ as admin rows
    list_display = ['sender', 'recipient']
    # case-insensitive sql queries
    search_fields = ['sender__username', 'recipient__username']

    class Meta:
        model = FriendRequest

admin.site.register(FriendRequest, FriendRequestAdmin)

# will not display friends in admin until friendlist is clicked on in the db entry
class FriendListAdmin(admin.ModelAdmin):
    list_filter = ['user']
    list_display = ['user']
    search_fields = ['user']

    class Meta:
        model = FriendList

admin.site.register(FriendList, FriendListAdmin)
