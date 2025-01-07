// file : LoginView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import LOGIN_CARD from '../components/LoginCard.js';
import PAGE_TITLE from '../core/helpers/PageTitle.js';
import INTRO_LAYOUT from '../layouts/IntroLayout.js';
import MEDIA_LAYOUT from '../layouts/MediaLayout.js';
import * as FETCH from '../components/HomeView/LeftUser_fetch.js';
import TOKEN from '../core/token.js';
import WEB_SOCKET from '../core/websocket_mng.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class LoginView
{
	constructor()
	{
		this.container = document.body;
	}
	
	async render()
	{
		const page_title = PAGE_TITLE;
		await page_title.init();
		await page_title.update('Sign In');

		const media = MEDIA_LAYOUT;
		media.container = document.body;
		await media.render('replace');

		const media_div = media.main_ctn;
		const layout = INTRO_LAYOUT;
		layout.container = media_div;
		await layout.render('replace');

		LOGIN_CARD.container = layout.main_ctn;
		await LOGIN_CARD.render('replace');

		await this.logoutAction();

		return true;
	}

	async logoutAction()
	{
		const user = JSON.parse(localStorage.getItem('user'));
		if (user)
		{
			alert('Logging out...');
			const FL = FETCH.FETCH_LOGOUT;
			const fetch_result = await FL.fetchData();
			if (fetch_result === 'logout-successful')
			{
				if (TOKEN.token_id)
					await TOKEN.stop_refresh_token();

				await WEB_SOCKET.closeSocket_liveChat();
				await WEB_SOCKET.closeSocket_friendList();

				localStorage.clear();
			}
			else
			{
				console.log(fetch_result);
			}
		}

		return true;
	}
}

const item = new LoginView();
export default item;
