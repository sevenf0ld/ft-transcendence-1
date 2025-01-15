// file : BotFriendPfp_fetch.js
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
class fetch_friend_profile
{
	constructor()
	{
		this.re_value = null;
		this.fetch_obj = null;
		this.target = null;
	}

	async init()
	{
		this.re_value = null;
		this.fetch_obj = null;
		this.target = null;

		return true;
	}

	async fetchData()
	{
		try
		{
			const encoded_target = encodeURIComponent(this.target);

			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl(`/api/user_profiles/view-friend-profile/?target=${encoded_target}`);
			await mainFetch.setMethod('GET');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'friend-profile-successful';
			else
				this.re_value = 'friend-profile-failed';
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; Friend profile failed : ' + error;
			console.error(this.re_value);
		}

		return this.re_value;
	}
}


const item = new fetch_friend_profile();
export default item;
