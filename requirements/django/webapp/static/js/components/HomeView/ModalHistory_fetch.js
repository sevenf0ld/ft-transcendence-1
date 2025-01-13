// file : ModalHistory_fetch.js
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
class fetch_history
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.target = null;
	}

	async init()
	{
		this.re_value = '';
		this.fetch_obj = null;
		this.target = null;

		return true;
	}

	async fetchData()
	{
		try
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			console.log(`url = /api/games/history/${this.target}`);
			await mainFetch.setUrl(`/api/games/history/${this.target}`);
			await mainFetch.setMethod('GET');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'match-history-successful';
			else
				this.re_value = 'match-history-failed';
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; match-history failed : ' + error;
			console.error(this.re_value);
		}

		return this.re_value;
	}
}

const item = new fetch_history();
export default item;
