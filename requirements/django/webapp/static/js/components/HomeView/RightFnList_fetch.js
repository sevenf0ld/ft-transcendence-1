// file : RightFnList_fetch.js
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
// [1A] HELPER-FETCH-LOGOUT
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1B] MAIN-FETCH-LOGOUT
// -------------------------------------------------- //
class fetch_friendList
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.re_value = '';
		this.fetch_obj = null;
	}

	async init()
	{
		this.re_value = '';
		this.fetch_obj = null;

		return true;
	}

	async fetchData()
	{
		const user = JSON.parse(localStorage.getItem('user'));
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-list-av/retrieve/');
		await mainFetch.setMethod('GET');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		//await mainFetch.appendBody('user', user.username);
		try
		{
			await mainFetch.fetchData();
			this.re_value = "fetch-success";
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; friendlist fetch failed';
			console.error(this.re_value);
			this.re_value = 'fetch-failed';
		}
		this.fetch_obj = mainFetch;

		return this.re_value;
	}
}

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
const item = new fetch_friendList();
export default item;
