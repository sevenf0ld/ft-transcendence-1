// file : LoginCard_fetch.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import { fetch_utils as FETCH_UTILS } from '../core/helpers/fetch-utils.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1A] HELPER-FETCH-LOGIN
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1B] MAIN-FETCH-LOGIN
// -------------------------------------------------- //
class fetch_login
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.val_username = document.getElementById('username').value;
		this.val_password = document.getElementById('password').value;
		this.current_phase = 1;
		this.fetch_utils_holder = null;
		this.re_value = '';
		this.opt = '';
	}

	// --- [] PHASE ONE
	async phase_one(url)
	{
		console.log('[DEBUG] try-syntax Login started.');
		const mainFetch = new FETCH_UTILS();
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl(url);
		await mainFetch.setMethod('POST');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('username', this.val_username);
		await mainFetch.appendBody('password', this.val_password);
		await mainFetch.appendBody('phase', 'one');
		await mainFetch.fetchData();
		this.fetch_utils_holder = mainFetch;

		switch (mainFetch.response.status)
		{
			case 200:
				this.re_value = 'p1-success';
				break;
			case 202:
				this.current_phase = 2;
				break;
			default:
				this.re_value = 'p1-failed';
				break;
		}
		return true;
	}
	
	// --- [] PHASE TWO
	async phase_two(url)
	{
		if (this.current_phase !== 2)
			return false;

		const mainFetch = new FETCH_UTILS();
		if (this.fetch_utils_holder.rdata.mfa)
		{
			await mainFetch.copy_object(this.fetch_utils_holder);
			await mainFetch.setUrl(url);
			await mainFetch.appendBody('phase', 'two');
			await mainFetch.fetchData();
			this.fetch_utils_holder = mainFetch;
		}
		else
		{
			this.re_value = 'p2-failed-invalid-credentials';
			return false;
		}

		switch (mainFetch.response.status)
		{
			case 200:
				this.current_phase = 3;
				break;
			default:
				this.re_value = 'p2-failed-server-error';
				break;
		}

		return true;
	}
	
	// --- [] PHASE THREE
	async phase_three(url)
	{
		if (this.current_phase !== 3)
			return false;

		this.opt = await prompt('Enter OTP:');
		const mainFetch = new FETCH_UTILS();
		await mainFetch.copy_object(this.fetch_utils_holder);
		await mainFetch.setUrl(url);
		await mainFetch.appendBody('phase', 'three');
		await mainFetch.appendBody('otp', this.opt);
		await mainFetch.fetchData();
		this.fetch_utils_holder = mainFetch;

		switch (mainFetch.response.status)
		{
			case 200:
				this.current_phase = 4;
				break;
			default:
				this.re_value = 'p3-failed-otp-verification-failed';
				break;
		}
	}
	
	// --- [] PHASE FOUR
	async phase_four(url)
	{
		if (this.current_phase !== 4)
			return false;

		const mainFetch = new FETCH_UTILS();
		await mainFetch.copy_object(this.fetch_utils_holder);
		await mainFetch.setUrl(url);
		await mainFetch.appendBody('phase', 'four');
		await mainFetch.fetchData();

		switch (mainFetch.response.status)
		{
			case 200:
				this.re_value = 'p4-success-logged-in';
				break;
			default:
				this.re_value = 'p4-failed';
				break;
		}
	}

	// --- [] FETCH
	async fetchData()
	{
		try
		{
			await this.phase_one('/api/user_auth/login/');
			await this.phase_two('/api/user_auth/login-phase-two/');
			await this.phase_three('/api/user_auth/login-phase-three/');
			await this.phase_four('/api/user_auth/login/');
		}
		catch (error)
		{
			console.error('[ERR] try-syntax Login failed : %s', error);
		}
		return this.re_value;
	}
}

// -------------------------------------------------- //
// [2A] HELPER-FETCH-INTRA
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
			const fetchUtils = new FETCH_UTILS();
			const csrfToken = await fetchUtils.getCookie('csrftoken');
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
// -------------------------------------------------- //
// [2B] MAIN-FETCH-INTRA
// -------------------------------------------------- //

class fetch_intra
{
	constructor()
	{
		// 42 Intra API
		this.authorization_server = 'https://api.intra.42.fr/oauth/authorize';
		this.token_endpoint = 'https://api.intra.42.fr/oauth/token';

		// OAuth 2.0
		this.scope = 'public';
		this.response_type = 'code';
		this.grant_type = 'authorization_code';
		this.client_id = encodeURIComponent(
			'u-s4t2ud-ebe5aa4d1068dc430477ebc2acfd2e267c8b3446ac0a5744cf8febc47aec5b8b'
		);
		this.redirect_uri = encodeURIComponent(
			'https://ftpong.com:8000'
		);
		this.client_secret = encodeURIComponent(
			'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'
		);

		this.re_value = '';
	}
	
	async generate_state()
	{
		// protect against csrf and prevent malicious parties from redirecting to the callback
		let counter = 0;
		let result = '';
		const length = 52;
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;

		while (counter < length)
		{
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
		  counter += 1;
		}

		localStorage.setItem('intra_state', result);

		return result;
	}

	async event_ContentLoaded(event)
	{
		// parse GET query string upon authorization and redirection
		const url_params = await new Proxy(new URLSearchParams(window.location.search), {
			get: (keys, value) => keys.get(value)
		});

		console.log('url_params =', decodeURIComponent(url_params.code));
		// check if url_params.state is a string
		console.log('url_params =', url_params.state);

		const url_code = await decodeURIComponent(url_params.code);
		const url_state = await decodeURIComponent(url_params.state);
		const state = localStorage.getItem('intra_state');
		console.log('local_state =', state);
		console.log('url_state =', url_state);
		// protect against csrf and prevent malicious parties from redirecting to the callback
		if (url_state === state)
		{
			try 
			{
				// OAuth 2.0 Authorization Grant: authorization code and access token exchange
				const mainFetch = new FETCH_UTILS();
				mainFetch.getCookie('csrftoken');
				mainFetch.setUrl('/api/social_auth/forty-two-login/');
				mainFetch.setMethod('POST');
				mainFetch.appendHeaders('Content-Type', 'application/json');
				mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
				mainFetch.appendBody('code', url_code);
				mainFetch.fetchData();

				if (mainFetch.response.ok)
					this.re_value = 'exchange-successful.';
				else
					this.re_value = 'exchange-failed.';
			} 
			catch (error)
			{
				this.re_value = 'exchange-failed.';
			}
		}
		else
		{
			this.re_value = 'sate is not queal to url_state.';
		}

		return true;
	}

	async redirect(event)
	{

		// OAuth 2.0 Authorization Grant: authorization request initiation
		const authorization_request_link = this.authorization_server 
			+ '?response_type=' + this.response_type
			+ '&client_id=' + this.client_id
			+ '&redirect_uri=' + this.redirect_uri
			+ '&scope=' + this.scope
			+ '&state=' + encodeURIComponent(await this.generate_state());

		// REDIRECT to authorization server (do not encode)
		location.href = authorization_request_link;

		return true;
	}

	async run()
	{
		await this.event_ContentLoaded();

		return (this.re_value);
	}
}

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
export {
	fetch_login,
	fetch_intra
};
