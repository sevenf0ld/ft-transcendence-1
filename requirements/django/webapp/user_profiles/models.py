from django.db import models

# Create your models here.
from django.contrib.auth.models import User
#from django.core.files import File
#from urllib.request import urlopen
#from tempfile import NamedTemporaryFile

class Profile(models.Model):
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
        upload_to='avatars/',
    )

    #avatar_url = models.URLField(blank=True)

    language = models.CharField(
        max_length=2,
        default='En',
        choices=[
            ('EN', 'English'),
            ('ZH', 'Mandarin'),
            ('MY', 'Malay'),
        ]
    )

    wins = models.PositiveIntegerField(default=0)

    losses = models.PositiveIntegerField(default=0)

    mfa_email_enabled = models.BooleanField(default=False)

    is_online = models.BooleanField(default=False)

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
