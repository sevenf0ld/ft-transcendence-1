from django import forms
from .models import Profile

# for templates
class UploadAvatarForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['avatar']
