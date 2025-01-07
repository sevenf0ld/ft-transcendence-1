// file : CreateRoom_fetch.js
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
class fetch_create_game_room
{
	constructor()
	{
		this.re_value = null;
		this.fetch_obj = null;
		this.room_type = null;
	}

	async init()
	{
		this.re_value = null;
		this.fetch_obj = null;
		this.room_type = null;

		return true;
	}

	async fetchData(room_type)
	{
		if (room_type !== 'PVP' && room_type !== 'TNM')
			throw new Error('Unsupported game type.');
		this.room_type = room_type;

		try
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/games/create-room/');
			await mainFetch.setMethod('POST');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendBody('room_type', this.room_type);
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'game-room-creation-successful';
			else
				this.re_value = 'game-room-creation-failed';
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; Game room creation failed : ' + error;
			console.error(this.re_value);
		}

		return this.re_value;
	}
}

const item = new fetch_create_game_room();
export default item;
