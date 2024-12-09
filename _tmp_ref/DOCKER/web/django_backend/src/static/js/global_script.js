import { initLoginSection } from './login.js';
import { initHomeSection } from './home.js';
import { initRegisterSection } from './register.js'
import { intResetPasswordSection } from './reset_password.js'
import { initSettingsSection } from './settings.js';

document.addEventListener("DOMContentLoaded", function () {
    initLoginSection();
    intResetPasswordSection();
    initRegisterSection();
    initHomeSection();
    initSettingsSection();
});
