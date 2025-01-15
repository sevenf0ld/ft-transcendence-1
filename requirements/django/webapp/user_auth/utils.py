from user_profiles.models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

def is_mfa_enabled(request):
    username = request.data.get('username')
    user_data = User.objects.get(username__iexact=username)
    profile_data = Profile.objects.get(user=user_data)

    return profile_data.mfa_email_enabled

def is_current_email(user, email):
    user_data = User.objects.get(username__iexact=user.username)
    if user_data.email.lower() == email:
        return True
    return False

def is_existing_email(email):
    if User.objects.filter(email__iexact=email).exists():
        return True
    return False

def is_current_password(user, password):
    if check_password(password, user.password):
        return True
    return False

def is_valid_password(user, password):
    try:
        if validate_password(password, user) is None:
            return None
    except ValidationError as e:
        return e.messages

def enable_mfa(user):
    profile_data = Profile.objects.get(user=user)
    profile_data.mfa_email_enabled = True
    profile_data.save()

def disable_mfa(user):
    profile_data = Profile.objects.get(user=user)
    profile_data.mfa_email_enabled = False
    profile_data.save()

def get_mfa_status(request):
    username = request.user.username
    user_data = User.objects.get(username__iexact=username)
    profile_data = Profile.objects.get(user=user_data)

    return profile_data.mfa_email_enabled

