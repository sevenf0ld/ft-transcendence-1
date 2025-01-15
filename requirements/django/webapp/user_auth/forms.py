from allauth.account.forms import SignupForm
#from .validators import alphanumeric_validator

# unnecessary since dj-rest-auth's registration relies on adapter's clean_username
class CustomSignupForm(SignupForm):
    def __init__(self, *args, **kwargs):
        self.by_passkey = kwargs.pop("by_passkey", False)
        super(SignupForm, self).__init__(*args, **kwargs)

        #self.fields['username'].validators.append(alphanumeric_validator)

        if not self.by_passkey:
            self.fields["password1"] = PasswordField(
                label=_("Password"),
                autocomplete="new-password",
                help_text=password_validation.password_validators_help_text_html(),
            )
            if app_settings.SIGNUP_PASSWORD_ENTER_TWICE:
                self.fields["password2"] = PasswordField(
                    label=_("Password (again)"), autocomplete="new-password"
                )

        if hasattr(self, "field_order"):
            set_form_field_order(self, self.field_order)

        honeypot_field_name = app_settings.SIGNUP_FORM_HONEYPOT_FIELD
        if honeypot_field_name:
            self.fields[honeypot_field_name] = forms.CharField(
                required=False,
                label="",
                widget=forms.TextInput(
                    attrs={
                        "style": "position: absolute; right: -99999px;",
                        "tabindex": "-1",
                        "autocomplete": "nope",
                    }
                ),
            )
