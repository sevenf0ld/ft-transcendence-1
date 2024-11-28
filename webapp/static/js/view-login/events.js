// file : events.js (view-login)
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
async function form_forgot(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('forgot-password-link clicked');
	});

	return true;
}

async function form_submitBtn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('submit-button clicked');
		/*=================================================================*/
		event.preventDefault();
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		try {
			const csrfToken = await COOKIE.getCookie('csrftoken');
			const response = await fetch('/api/send-otp/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken
				},
				body: JSON.stringify({
					username: username,
					password: password,
				})
			});
			const data = await response.json();
			if (response.ok) {
				console.log('Login successful: logged-in as %s.', username);
				await HOME.build();
			} else {
				console.error('Login failed: %s is unauthorized.', username);
			}
		} catch (error) {
			console.error('Login failed.' + error.message);
		}
		/*=================================================================*/
	});

	return true;
}

/*=================================================================*/
// protect against csrf and prevent malicious parties from redirecting to the callback
function generate_state() {
	const length = 52;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
	localStorage.setItem('intra_state', result);
    return result;
}
/*=================================================================*/

/*=================================================================*/
// 42 Intra API
const authorization_server = 'https://api.intra.42.fr/oauth/authorize';
const token_endpoint = 'https://api.intra.42.fr/oauth/token';

// OAuth 2.0
const client_id = encodeURIComponent('u-s4t2ud-ebe5aa4d1068dc430477ebc2acfd2e267c8b3446ac0a5744cf8febc47aec5b8b');
const redirect_uri = encodeURIComponent('https://ftpong.com:8000');
const response_type = 'code';
const scope = 'public';
const grant_type = 'authorization_code';
const client_secret = encodeURIComponent('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');
/*=================================================================*/

/*=================================================================*/
document.addEventListener('DOMContentLoaded', async function (event) {
	// parse GET query string upon authorization and redirection
	const url_params = new Proxy(new URLSearchParams(window.location.search), {
		get: (keys, value) => keys.get(value)
	});
	const url_code = decodeURIComponent(url_params.code);
	const url_state= decodeURIComponent(url_params.state);
	const state = localStorage.getItem('intra_state');

	// protect against csrf and prevent malicious parties from redirecting to the callback
	if (url_state === state)
	{
		try {
			const csrfToken = await COOKIE.getCookie('csrftoken');
			// OAuth 2.0 Authorization Grant: authorization code and access token exchange
			const response = await fetch('/api/forty-two-login/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken
				},
				body: JSON.stringify({
					code: url_code
				})
			});
			const data = await response.json();
			if (response.ok) {
				console.log('Exchange successful.');
				await HOME.build();
			} else {
				console.error('Exchange failed.');
			}
		} catch (error) {
			console.error('Exchange failed.');
		}
	}
});
/*=================================================================*/

async function intra_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('intra-button clicked');
		/*=================================================================*/
		event.preventDefault();
		// OAuth 2.0 Authorization Grant: authorization request initiation
		const authorization_request_link = authorization_server + '?response_type=' + response_type
			+ '&client_id=' + client_id
			+ '&redirect_uri=' + redirect_uri
			+ '&scope=' + scope
			+ '&state=' + encodeURIComponent(generate_state());

		// REDIRECT to authorization server (do not encode)
		location.href = authorization_request_link;
		/*=================================================================*/
	});

	return true;
}

async function signup_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('sign-up-button clicked');
		REGISTER.build();
	});

	return true;
}

async function build()
{
	const btn = document.getElementById('btn_forgot');
	const btn2 = document.getElementById('btn_login');
	const btn3 = document.getElementById('btn_intra');
	const btn4 = document.getElementById('btn_signup');

	await form_forgot(btn);
	await form_submitBtn(btn2);
	await intra_btn(btn3);
	await signup_btn(btn4);

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build
};
