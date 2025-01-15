from django.db import models

# Create your models here.
from django.contrib.auth.models import User
#from django.core.files import File
#from urllib.request import urlopen
#from tempfile import NamedTemporaryFile
#from django.core.validators import FileExtensionValidator
import os
#from allauth.socialaccount.models import SocialAccount
from django.core.validators import validate_image_file_extension

def rename_avatar(instance, filename):
    #if SocialAccount.objects.filter(user=instance.user).exists():
    #    return instance.avatar

    ext = os.path.splitext(filename)[1]
    avatar_name = instance.user.username + ext
    avatar_path = f'avatars/{avatar_name}'
    full_path = os.path.join('media', avatar_path)
    if os.path.exists(full_path):
        os.remove(full_path)

    return avatar_path

class Profile(models.Model):
    ENGLISH = 'EN'
    MANDARIN = 'ZH'
    MALAY = 'MY'
    LANGUAGE_CHOICES = {
        ENGLISH: 'English',
        MANDARIN: 'Mandarin',
        MALAY: 'Malay',
    }

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    nickname = models.CharField(
        unique=True,
        max_length=30,
        blank=True,
        null=True
    )

    avatar = models.ImageField(
        default='avatars/default.jpg',
        #upload_to='avatars/',
        upload_to=rename_avatar,
        #validators=[
        #    FileExtensionValidator(
        #        allowed_extensions=['jpg']
        #    ),
        #]
        validators=[validate_image_file_extension]
    )

    #avatar_url = models.URLField(blank=True)

    language = models.CharField(
        max_length=2,
        default=ENGLISH,
        choices=LANGUAGE_CHOICES,
    )

    wins = models.PositiveIntegerField(default=0)

    losses = models.PositiveIntegerField(default=0)

    mfa_email_enabled = models.BooleanField(default=False)

    #def get_remote_avatar(self):
    #    if self.avatar_url and not self.avatar:
    #        img_temp = NamedTemporaryFile(delete=True)
    #        img_temp.write(urlopen(self.avatar_url).read())
    #        img_temp.flush()
    #        self.avatar.save(f"image_{self.pk}", File(img_temp))

    #=================================#
    #=====default model methods=======#
    #=================================#

    def __str__(self):
        return self.user.username

    #def save(self, **kwargs):
    #    self.get_remote_avatar()
    #    super().save(**kwargs)

    #def save(self, *args, **kwargs):
    #    self.get_remote_avatar()
    #    super(Profile, self).save(*args, **kwargs)

    def save(self, *args, **kwargs):
        try:
            current_avatar = Profile.objects.get(user=self.user)
            if current_avatar.avatar != self.avatar:
                current_avatar.avatar.delete(save=False)
        except:
            pass
        super().save(*args, **kwargs)

