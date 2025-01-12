// file : logout.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import TOKEN from '../core/token.js';
import WEB_SOCKET from '../core/websocket_mng.js';
import * as FETCH from '../components/HomeView/LeftUser_fetch.js';
import ROUTER from './router.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class logoutClass
{
	constructor()
	{
	}
	
	async run()
	{
		const user = JSON.parse(localStorage.getItem('user'));
		if (user)
		{
			const FL = FETCH.FETCH_LOGOUT;
			const fetch_result = await FL.fetchData();
			if (fetch_result === 'logout-successful')
			{
				if (TOKEN.token_id)
					await TOKEN.stop_refresh_token();

				await WEB_SOCKET.close_all_websockets();

				localStorage.setItem('logout-event', 'logout' + Math.random());
				localStorage.clear();
				await ROUTER.navigate_to('/login');
			}
			else
			{
				console.log(fetch_result);
			}
		}
		localStorage.clear();

		return true;
	}
}

const item = new logoutClass();
export default item;
