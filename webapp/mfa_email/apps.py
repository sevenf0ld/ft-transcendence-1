from django.apps import AppConfig


class MfaEmailConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mfa_email'

    def ready(self):
        import mfa_email.signals
