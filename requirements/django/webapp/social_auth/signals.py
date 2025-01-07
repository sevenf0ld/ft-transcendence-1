# allauth/socialaccount/signals.py
# allauth/socialaccount/adapter.py
# allauth/socialaccount/internal/flows/login.py
# allauth/socialaccount/models.py
from django.dispatch import receiver
#from allauth.socialaccount.signals import pre_social_login
from allauth.socialaccount.models import (
    #SocialLogin,
    SocialAccount,
)
from django.db.models.signals import post_save
from user_profiles.models import Profile
from django.core.files import File
from urllib.request import urlopen
from tempfile import NamedTemporaryFile
from urllib.error import URLError, HTTPError
from django.core.exceptions import ObjectDoesNotExist

# profile is not created yet
#@receiver(pre_social_login, sender=SocialLogin)
#def update_fortytwo_pfp(sender: SocialLogin, instance, created, **kwargs):

#@receiver(post_save, sender=SocialAccount)
#def update_fortytwo_pfp(sender: SocialAccount, instance, created, **kwargs):
#    if created:
#        print(f'Updating profile picture for {instance.provider} user: {instance}')
#        try:
#            profile_data = Profile.objects.get(user=instance.user)
#
#            avatar_url = instance.get_avatar_url()
#            avatar_name = avatar_url.split('/')[-1]
#            try:
#                img_temp = NamedTemporaryFile(delete=True)
#                img_temp.write(urlopen(avatar_url).read())
#                img_temp.flush()
#
#                profile_data.avatar.save(avatar_name, File(img_temp))
#                profile_data.save()
#            except (URLError, HTTPError) as e:
#                print(f'Failed to download profile picture for {instance.provider} user: {instance}. Error: {str(e)}')
#            except Exception as e:
#                print(f'Failed to save profile picture for {instance.provider} user: {instance}. Error: {str(e)}')
#        except Exception as e:
#            print(f'An unexpected error occurred while updating profile picture for {instance.provider} user: {instance}. Error: {str(e)}')

from urllib.parse import urlparse
import os

@receiver(post_save, sender=SocialAccount)
def update_fortytwo_pfp(sender, instance, created, **kwargs):
    if created:
        print(f'Updating profile picture for {instance.provider} user: {instance}')
        try:
            profile = Profile.objects.get(user=instance.user)
            #avatar_url = instance.extra_data.get('image', {}).get('link')
            avatar_url = instance.extra_data.get('image', {}).get('versions', {}).get('small')
            if not avatar_url:
                print(f'No avatar URL found for user: {instance.user}')
                return
            parsed_url = urlparse(avatar_url)
            avatar_name = os.path.basename(parsed_url.path)
            try:
                with urlopen(avatar_url) as response:
                    with NamedTemporaryFile(delete=True) as img_temp:
                        img_temp.write(response.read())
                        img_temp.flush()
                        profile.avatar.save(avatar_name, File(img_temp))
            except (URLError, HTTPError) as e:
                print(f'Failed to download profile picture for {instance.provider} user: {instance}. Error: {str(e)}')
            except Exception as e:
                print(f'Failed to save profile picture for {instance.provider} user: {instance}. Error: {str(e)}')
        except Profile.DoesNotExist:
            print(f'Profile does not exist for {instance.provider} user: {instance.user}')
        except Exception as e:
            print(f'An unexpected error occurred while updating profile picture for {instance.provider} user: {instance}. Error: {str(e)}')

