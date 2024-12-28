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
// [1A] HELPER-FETCH-REGISTER
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1B] MAIN-FETCH-REGISTER
// -------------------------------------------------- //
class fetch_register
{
	constructor()
	{
		this.val_username = null;
		this.val_email = null;
		this.val_password = null;
		this.val_password_confirm = null;
		this.re_value = '';
		this.fetch_obj = null;
	}

	async init()
	{
		this.val_username = document.getElementById('username').value;
		this.val_email = document.getElementById('email').value;
		this.val_password = document.getElementById('password').value;
		this.val_password_confirm = document.getElementById('confirm').value;
		this.re_value = '';
		this.fetch_obj = null;
	}

	async fetchData()
	{
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/user_auth/register/');
		await mainFetch.setMethod('POST');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('username', this.val_username);
		await mainFetch.appendBody('email', this.val_email);
		await mainFetch.appendBody('password1', this.val_password);
		await mainFetch.appendBody('password2', this.val_password_confirm);
		try 
		{
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'registeration-successful';
			else
				this.re_value = 'registeration-failed';
		}
		catch (error)
		{
			console.error('[ERR] try-catch; registeration failed : ' + error.message);
			this.re_value = '[ERR] try-catch; registeration failed : ' + error.message;
		}

		return this.re_value;
	}
}

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
const item = new fetch_register();
export default item;
