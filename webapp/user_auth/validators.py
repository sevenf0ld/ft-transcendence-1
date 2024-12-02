from django.contrib.auth.validators import ASCIIUsernameValidator
from django.core.validators import RegexValidator

custom_username_validators = [ASCIIUsernameValidator()]
alphanumeric_validator = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')

#validator_list = [ alphanumeric_validator, ASCIIUsernameValidator() ]
validator_list = [alphanumeric_validator]
