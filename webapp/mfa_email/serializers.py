from rest_framework import serializers

from .models import MfaEmail

class MfaEmailModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MfaEmail
        fields = ('otp', 'otp_expiry_time')
