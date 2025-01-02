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

class fetch_accountSettings
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

	async fetchData(form_data)
	{
		console.log('fetching data');
		if (form_data === null)
			throw new Error('Invalid form_data - ModalSetItems_fetch.js');

		try
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_auth/update-user-password/');
			await mainFetch.setMethod('PATCH');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendBody('current_pw', form_data.cur_pass);
			await mainFetch.appendBody('new_email', form_data.new_email);
			await mainFetch.appendBody('new_pw', form_data.new_pass);
			await mainFetch.appendBody('confirm_pw', form_data.conf_pass);
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'acc-successful';
			else
				this.re_value = 'acc-failed';
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; Logout failed : ' + error;
			console.error(this.re_value);
		}

		return this.re_value;
	}
}

class fetch_langSettings
{
	constructor()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.language = null;
		this.opts = [
			'EN',
			'ZH',
			'MY'
		];
	}

	async init()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.language = null;
		this.opts = [
			'EN',
			'ZH',
			'MY'
		];

		return true;
	}

	async fetchData()
	{
		if (this.language === null)
			throw new Error('Invalid language - ModalSetItems_fetch.js');

		let is_valid = false;
		for (const i in this.opts)
		{
			if (this.language === this.opts[i])
			{
				is_valid = true;
				break;
			}
		}
		if (!is_valid)
			throw new Error('Invalid language - ModalSetItems_fetch.js');

		try
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_profiles/update-user-language/');
			await mainFetch.setMethod('PATCH');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendBody('lang', this.language);
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'lang-successful';
			else
				this.re_value = 'lang-failed';
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
const ACC = new fetch_accountSettings();
const LANG = new fetch_langSettings();

export {
	TFA,
	ACC,
	LANG
};
