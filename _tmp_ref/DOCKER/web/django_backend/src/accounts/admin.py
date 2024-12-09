from django.contrib import admin
from django.utils.html import format_html
from .models import Match, Profile

class MatchAdmin(admin.ModelAdmin):
    list_display = ('player_one', 'player_two', 'match_date', 'player_one_score', 'player_two_score')
    search_fields = ('player_one__user__username', 'player_two')
    list_filter = ('match_date',)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'avatar_display', 'friends_list', 'last_seen', 'wins', 'losses')
    search_fields = ('user__username', 'user__email')
    list_filter = ('last_seen',)
    readonly_fields = ('avatar_display', )
    filter_horizontal = ('friends',)

    def email(self, obj):
        return obj.user.email
    email.short_description = 'Email'

    def avatar_display(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" style="width: 50px; height: 50px; border-radius: 50%;" />', obj.avatar.url)
        return "-"
    avatar_display.short_description = 'Avatar'

    def friends_list(self, obj):
        return ", ".join([friend.user.username for friend in obj.friends.all()])
    friends_list.short_description = 'Friends'


admin.site.register(Match, MatchAdmin)
admin.site.register(Profile, ProfileAdmin)
