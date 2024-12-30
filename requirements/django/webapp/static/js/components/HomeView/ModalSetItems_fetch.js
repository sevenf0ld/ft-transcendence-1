// file : ModalSetItems_fetch.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import FETCH_UTILS from '../../core/helpers/fetch-utils.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main function
// -------------------------------------------------- //
class fetch_tfa
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.tfa_is_enabled = null;
	}

	async init()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.tfa_is_enabled = null;

		return true;
	}

	async fetchData(type)
	{
		if (type !== 'off' && type !== 'on')
			throw new Error('Invalid type - ModalSetItems_fetch.js');

		try
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('api/user_auth/update-user-mfa/');
			await mainFetch.setMethod('PATCH');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendBody('mfa', type);
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'tfa-successful';
			else
				this.re_value = 'tfa-failed';
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; Logout failed : ' + error;
			console.error(this.re_value);
		}

		return this.re_value;
	}
}

const TFA = new fetch_tfa();

export {
	TFA
};
