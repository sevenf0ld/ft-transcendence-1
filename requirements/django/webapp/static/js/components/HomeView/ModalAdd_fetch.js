// file : ModalAdd_fetch.js
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
class fetch_addFriend
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
		try
		{
			const input = document.querySelector('.add-friend-input');
			const local_obj = JSON.parse(localStorage.getItem('user'));

			const userReq = local_obj.username;
			const userTarget = input.value;

			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/friends/friend-request-av/create/');
			await mainFetch.setMethod('POST');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendBody('sender', userReq);
			await mainFetch.appendBody('recipient', userTarget);
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'addFriend-successful';
			else
				this.re_value = 'addFriend-failed';
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; addFriend failed : ' + error;
			console.error(this.re_value);
		}

		return this.re_value;
	}
}

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
const item = new fetch_addFriend();
export default item;

