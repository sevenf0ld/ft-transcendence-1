// file : LeftUser_fetch.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import FETCH_UTILS from '../../core/helpers/fetch-utils.js';
import LOGOUT from '../../core/logout.js';
import ROUTE from '../../core/router.js';
import LANGUAGE from '../../core/language/language.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1A] HELPER-FETCH-LOGOUT
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1B] MAIN-FETCH-LOGOUT
// -------------------------------------------------- //
class fetch_logout
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.tfa_is_enabled = null;
		this.language = null;
	}

	async init()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.tfa_is_enabled = null;
		this.language = null;

		return true;
	}

	async fetchData()
	{
		try
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_auth/logout/');
			await mainFetch.setMethod('POST');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendBody('signned_in', 'false');
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'logout-successful';
			else
				this.re_value = 'logout-failed';
		}
		catch (error)
		{
			this.re_value = '[SAFELY-HANDLED] logout-failed';
			console.log(this.re_value);
		}

		return this.re_value;
	}
}

class fetch_home_profile
{
	constructor()
	{
		this.re_value = '';
		this.fetch_obj = null;
	}

	async init()
	{
		this.re_value = '';
		this.fetch_obj = null;
	}

	async fetchData()
	{
		try
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_profiles/view-home-profile/');
			await mainFetch.setMethod('GET');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
			{
				this.tfa_is_enabled = mainFetch.rdata.mfa_email_enabled;
				this.language = mainFetch.rdata.language.toLowerCase();
				LANGUAGE.cur_lang = this.language;

				this.re_value = 'home-profile-successful';
			}
			else
				this.re_value = 'home-profile-failed';
		}
		catch (error)
		{
			await LOGOUT.run();
			await ROUTE.navigate_to('/login');
			this.re_value = '[SAFELY-HANDLED] home-profile-failed';
			console.log(this.re_value);
		}

		return this.re_value;
	}
}

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
const FETCH_LOGOUT = new fetch_logout();
const FETCH_HOME_PROFILE = new fetch_home_profile();

export {
	FETCH_LOGOUT,
	FETCH_HOME_PROFILE
};
