// file : events.js (view-register)
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as MEDIA from '../utils/media.js';
import * as COOKIE from '../utils/cookie.js';
import * as FORMVALI from '../utils/form-vali.js';
import * as FORGETPASS from '../view-forgetpass/template.js';
import * as HOME from '../view-home/template.js';
import * as LIVECHAT from '../view-livechat/template.js';
import * as LOCALPVE from '../view-local-pve/template.js';
import * as LOCALPVP from '../view-local-pvp/template.js';
import * as LOCALTOUR from '../view-local-tour/template.js';
import * as LOGIN from '../view-login/template.js';
import * as PROFILE from '../view-profile/template.js';
import * as REGISTER from '../view-register/template.js';
import * as REMOPVP from '../view-remo-pvp/template.js';
import * as REMOTOUR from '../view-remo-tour/template.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
async function register_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		if (await FORMVALI.run_register() === false)
		{
			event.preventDefault();
			return false;
		}
		else
      console.log('register-button clicked');
      /*=================================================================*/
      event.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const password_confirm = document.getElementById('password_confirm').value;
      try {
        const csrfToken = await COOKIE.getCookie('csrftoken');
        const response = await fetch('/api/registration/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password1: password,
            password2: password_confirm
          })
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Registration successful.');
        } else {
          console.error('Registration failed (not 200).');
        }
      } catch (error) {
        console.error('Registration failed' + error);
      }
		/*=================================================================*/
	});

	return true;
}

async function back_to_login_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('back-to-login-button clicked');
		LOGIN.build();
	});

	return true;
}

async function build()
{
	const btn = document.getElementById('btn_register');
	const btn2 = document.getElementById('btn_back_to_login');

	await register_btn(btn);
	await back_to_login_btn(btn2);

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build
};
