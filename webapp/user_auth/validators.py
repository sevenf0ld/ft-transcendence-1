from django.core.validators import RegexValidator

alphanumeric_dash_validator = RegexValidator(r'^[0-9a-zA-Z-]*$', 'Only alphanumeric characters and hyphens are allowed.')

validator_list = [alphanumeric_dash_validator]
