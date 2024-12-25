# allauth/socialaccount/signals.py
# allauth/socialaccount/adapter.py
# allauth/socialaccount/internal/flows/login.py
# allauth/socialaccount/models.py
from django.db.models.signals import post_save
from allauth.socialaccount.signals import pre_social_login
from allauth.socialaccount.models import SocialLogin, SocialAccount
from django.dispatch import receiver
from user_profiles.models import Profile

# profile is not created yet
#@receiver(pre_social_login, sender=SocialLogin)
#def update_fortytwo_pfp(sender: SocialLogin, instance, created, **kwargs):

@receiver(post_save, sender=SocialAccount)
def update_fortytwo_pfp(sender: SocialAccount, instance, created, **kwargs):
    if created:
        print(f'Updating profile picture for user: {instance}')
        profile_data = Profile.objects.get(user=instance.user)
