// file : LoginCard_fetch.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as COOKIE from '../core/helpers/cookie.js';
import HomeView from '../views/HomeView.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1A] HELPER-FETCH-LOGIN
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1B] MAIN-FETCH-LOGIN
// -------------------------------------------------- //
async function login()
{
	event.preventDefault();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	try
	{
		const csrfToken = await COOKIE.getCookie('csrftoken');
		// block sign in submit-button from being spammed as this will trigger new OTPs to be generated, sent and prompted
		const phase_one_response = await fetch('/api/user_auth/login/', 
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			body: JSON.stringify({
				username: username,
				password: password,
				phase: 'one',
			})
		});
		const phase_one_data = await phase_one_response.json();
		if (phase_one_response.status == 200)
		{
			console.log('Login successful: logged-in as %s.', username);
			const home = new HomeView();
			await home.render();
		}
		else if (phase_one_response.status == 202)
		{
			if (phase_one_data.mfa)
			{
				console.log('First phase of login successful: Credentials are valid.');
				const phase_two_response = await fetch('/api/user_auth/login-phase-two/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': csrfToken
					},
					body: JSON.stringify({
						username: username,
						phase: 'two',
						//otp: otp_prompt,
					})
				});
				const phase_two_data = await phase_two_response.json();
				if (phase_two_response.status == 200)
				{
					console.log('Second phase of login successful: OTP sent to %s\'s email.', username);
					const otp_prompt = await prompt("Enter the OTP sent to your registered email.");
					const phase_three_response = await fetch('/api/user_auth/login-phase-three/',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': csrfToken
						},
						body: JSON.stringify({
							username: username,
							phase: 'three',
							otp: otp_prompt,
						})
					});
					const phase_three_data = await phase_three_response.json();
					if (phase_three_response.status == 200)
					{
						console.log('Third phase of login successful: OTP verification successful.');
						const phase_four_response = await fetch('/api/user_auth/login/',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'X-CSRFToken': csrfToken
							},
							body: JSON.stringify({
								username: username,
								password: password,
								phase: 'four',
							})
						});
						const phase_four_data = await phase_four_response.json();
						if (phase_four_response.status == 200)
						{
							console.log('Login successful: logged-in as %s.', username);
							const home = new HomeView();
							await home.render();
						}
						else
						{
							console.error('Login failed.');
						}
					}
					else
					{
						console.error('Third phase of login failed: OTP verification failed.');
					}
				}
				else
				{
					console.error('Second phase of login failed: Server error.');
				}
			}
			else
			{
				console.error('First phase of login failed: Invalid credentials.');
			}
		}
		else
		{
			console.error('Login failed.');
		}
	}
	catch (error)
	{
		console.error('Login failed.');
	}
	return true;
}

// -------------------------------------------------- //
// [2A] HELPER-FETCH-INTRA
// -------------------------------------------------- //
// -------------------------------------------------- //
// [2B] MAIN-FETCH-INTRA
// -------------------------------------------------- //
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
			const response = await fetch('/api/social_auth/forty-two-login/', {
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
				const home = new HomeView();
				await home.render();
			} else {
				console.error('Exchange failed.');
			}
		} catch (error) {
			console.error('Exchange failed.');
		}
	}
});
/*=================================================================*/
/*=================================================================*/
/*
	async intraClick(event, intraFetch)
	{
		console.log('[EVENT] button clicked : intra');
		intraFetch.redirect();
		/*=================================================================*/
		/*
		event.preventDefault();
		// OAuth 2.0 Authorization Grant: authorization request initiation
		const authorization_request_link = authorization_server + '?response_type=' + response_type
			+ '&client_id=' + client_id
			+ '&redirect_uri=' + redirect_uri
			+ '&scope=' + scope
			+ '&state=' + encodeURIComponent(generate_state());

		// REDIRECT to authorization server (do not encode)
		location.href = authorization_request_link;
		*/
		/*=================================================================*/
/*=================================================================*/

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
export {
	login
};
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as COOKIE from '../core/helpers/cookie.js';
import HomeView from '../views/HomeView.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1A] HELPER-FETCH-LOGIN
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1B] MAIN-FETCH-LOGIN
// -------------------------------------------------- //
