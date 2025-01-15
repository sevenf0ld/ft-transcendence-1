// file : LoginCard_fetch.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import FETCH_UTILS from '../core/helpers/fetch-utils.js';
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
		this.val_username = null;
		this.val_password = null;
		this.current_phase = 1;
		this.fetch_utils_holder = null;
		this.otp = '';
		this.re_value = '';
		this.fetch_obj = null;
	}

	async init()
	{
		this.val_username = document.getElementById('username').value;
		this.val_password = document.getElementById('password').value;
		this.current_phase = 1;
		this.fetch_utils_holder = null;
		this.otp = '';
		this.re_value = '';
		this.fetch_obj = null;

		return true;
	}

	async set_phase(phase)
	{
		this.current_phase = phase;

		return true;
	}

	async set_otp(otp)
	{
		this.otp = otp;

		return true;
	}

	async setup_fetch_settings(mainFetch, url)
	{
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl(url);
		await mainFetch.setMethod('POST');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);

		return true;
	}

	// --- [] PHASE ONE
	async phase_one(url)
	{
		if (this.current_phase !== 1)
			return false;

		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await this.setup_fetch_settings(mainFetch, url);
		await mainFetch.appendBody('username', this.val_username);
		await mainFetch.appendBody('password', this.val_password);
		await mainFetch.appendBody('phase', 'one');
		await mainFetch.fetchData();
		this.fetch_utils_holder = mainFetch;
		this.fetch_obj = mainFetch;

		switch (mainFetch.response.status)
		{
			case 200:
				this.re_value = 'login-successful';
				break;
			case 202:
				this.current_phase = 2;
				break;
			default:
				this.re_value = 'p1-failed';
				break;
		}

		if (this.current_phase === 202)
		{
			if (this.fetch_utils_holder.rdata.mfa)
				this.current_phase = 2;
			else
			{
				this.re_value = 'p1-failed-invalid-credentials';
				return false;
			}
		}

		return true;
	}
	
	// --- [] PHASE TWO
	async phase_two(url)
	{
		if (this.current_phase !== 2)
			return false;

		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await this.setup_fetch_settings(mainFetch, url);
		await mainFetch.appendBody('phase', 'two');
		await mainFetch.appendBody('username', this.val_username);
		await mainFetch.fetchData();
		this.fetch_utils_holder = mainFetch;
		this.fetch_obj = mainFetch;

		switch (mainFetch.response.status)
		{
			case 200:
				this.re_value = 'login-otp';
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

		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		this.setup_fetch_settings(mainFetch, url);
		await mainFetch.appendBody('username', this.val_username);
		await mainFetch.appendBody('phase', 'three');
		await mainFetch.appendBody('otp', this.otp);
		await mainFetch.fetchData();
		this.fetch_utils_holder = mainFetch;
		this.fetch_obj = mainFetch;

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

	// --- [] PHASE-THREE-EXTRA (OTP-VERIFY)
	async verify_otp(otp)
	{
		let re_value = true;

		// if otp contain non-digit
		if (otp.match(/\D/))
			re_value = false;

		// if otp contain 6 digits
		if (otp.length !== 6)
			re_value = false;

		return re_value;
	}
	
	// --- [] PHASE FOUR
	async phase_four(url)
	{
		if (this.current_phase !== 4)
			return false;

		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		this.setup_fetch_settings(mainFetch, url);
		await mainFetch.appendBody('phase', 'four');
		await mainFetch.appendBody('username', this.val_username);
		await mainFetch.appendBody('password', this.val_password);
		await mainFetch.fetchData();
		this.fetch_obj = mainFetch;

		switch (mainFetch.response.status)
		{
			case 200:
				this.re_value = 'login-successful';
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
			console.error('[ERR] try-syntax; Login failed : %s', error);
		}
		return this.re_value;
	}
}

// -------------------------------------------------- //
// [2A] HELPER-FETCH-INTRA
// -------------------------------------------------- //
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
			'https://localhost:1100'
		);

		this.re_value = '';
		this.fetch_obj = null;
	}

	async init()
	{
		this.re_value = '';
		this.fetch_obj = null;

		return true;
	}

	async generate_state()
	{
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
		const url_params = await new Proxy(new URLSearchParams(window.location.search), {
			get: (keys, value) => keys.get(value)
		});
		const url_code = await decodeURIComponent(url_params.code);
		const url_state = await decodeURIComponent(url_params.state);
		const state = localStorage.getItem('intra_state');
		if (url_state === state)
		{
			try 
			{
				await FETCH_UTILS.init();
				const mainFetch = FETCH_UTILS;
				await mainFetch.getCookie('csrftoken');
				await mainFetch.setUrl('/api/social_auth/forty-two-login/');
				await mainFetch.setMethod('POST');
				await mainFetch.appendHeaders('Content-Type', 'application/json');
				await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
				await mainFetch.appendBody('code', url_code);
				await mainFetch.fetchData();
				this.fetch_obj = mainFetch;

				if (mainFetch.response.ok)
					this.re_value = 'exchange-successful';
				else
					this.re_value = 'exchange-failed.';
			} 
			catch (error)
			{
				this.re_value = '[ERR] try-catch; exchange failed : ' + error;
				console.error(this.re_value);
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
const FETCH_LOGIN = new fetch_login();
const FETCH_INTRA = new fetch_intra();

export {
	FETCH_LOGIN,
	FETCH_INTRA,
};
