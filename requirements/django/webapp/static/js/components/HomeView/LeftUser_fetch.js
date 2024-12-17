// file : LeftUser_fetch.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import { fetch_utils as FETCH_UTILS } from '../../core/helpers/fetch-utils.js';
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
	}

	async fetchData()
	{
		try
		{
			const mainFetch = new FETCH_UTILS();
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_auth/logout/');
			await mainFetch.setMethod('POST');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
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
			this.re_value = '[ERR] try-catch; Logout failed : ' + error;
			console.error(this.re_value);
		}

		return this.re_value;
	}
}

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
export {
	fetch_logout,
};
