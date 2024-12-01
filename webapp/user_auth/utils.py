from user_profiles.models import Profile
from django.contrib.auth.models import User

def is_mfa_enabled(request):
    username = request.data.get('username')
    user_data = User.objects.get(username=username)
    profile_data = Profile.objects.get(user=user_data)

    return profile_data.mfa_email_enabled
