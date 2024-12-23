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
