from user_profiles.models import Profile
from django.contrib.auth.models import User

def is_current_lang(user, lang):
    profile_data = Profile.objects.get(user=user)
    if profile_data.language.lower == lang.lower:
        return True
    return False
