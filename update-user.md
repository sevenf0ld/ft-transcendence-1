# user
## update settings/details
### password
- [django password management, hash, check, creation and validation](https://docs.djangoproject.com/en/5.1/topics/auth/passwords/)
- [check_password](https://stackoverflow.com/a/62145106)
- [dirty password_change()](https://docs.djangoproject.com/en/5.1/topics/auth/passwords/#django.contrib.auth.password_validation.password_changed)
- [manually save password 1](https://stackoverflow.com/a/1873855)
- [manually save password 2](https://stackoverflow.com/a/30466918)

### api
- `update_user_account`
    - PATCH
        - `curl -X PATCH -H "Content-type: application/json" 'https://localhost:443/api/user_auth/update-user-account/' --insecure`
        - `curl -X PATCH -H "Content-type: application/json" 'https://localhost:443/api/user_auth/update-user-mfa/' --insecure`
    - [status code 422 or 409 or 200 for existing email](https://stackoverflow.com/q/9269040)

## profile pic
### intra
1. write own implementation of get_avatar_url in provider
1. get the image from the [raw api](https://api.intra.42.fr/apidoc/2.0/users/me.html)
    - add it to common_fields in provider
        - it is not accessible from within SocialAccount model
    - use SocialAccount model method
        - ~~it is not printing the methods' return~~
        - add to extra_data in provider
1. receive signal from allauth.socialaccounts.models (SocialAccount)
    - adapter is not suitable as in populates the User model (regardless of built-in or custom)
1. set the avatar image
    - [retrieve and save the image](https://stackoverflow.com/a/16383123)
        - [override predefined save](https://docs.djangoproject.com/en/5.1/topics/db/models/#overriding-predefined-model-methods)
1. set up media directory for avatars
    - [media url and media root after static url/root](https://simpleisbetterthancomplex.com/tutorial/2016/08/01/how-to-upload-files-with-django.html)
### normal
