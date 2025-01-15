// file : HomeView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PRIMARY_LAYOUT from '../layouts/PrimaryLayout.js';
import TOKEN from '../core/token.js';
import LEFT_USER from '../components/HomeView/LeftUser.js';
import MIDTOP_GAMEMODE from '../components/HomeView/MidBoard.js';
import RIGHT_FRIEND_LIST from '../components/HomeView/RightFnList.js';
import PAGE_TITLE from '../core/helpers/PageTitle.js';
import MEDIA_LAYOUT from '../layouts/MediaLayout.js';
import WEB_SOCKET from '../core/websocket_mng.js';
import ROUTER from '../core/router.js';
import LANGUAGE from '../core/language/language.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class HomeView
{
	constructor()
	{
		this.container = document.body;
	}

	async render()
	{
		if (TOKEN.token_id == null)
		{
			await TOKEN.start_refresh_token();
		}

		let parent_html;

		const page_title = PAGE_TITLE;
		await page_title.init();
		await page_title.update('Home');

		const media = MEDIA_LAYOUT;
		media.container = document.body;
		await media.render('replace');

		parent_html = media.main_ctn;
		const primary = PRIMARY_LAYOUT;
		primary.container = parent_html;
		await primary.render('replace');

		parent_html = primary.lpanel;
		LEFT_USER.container = parent_html;
		await LEFT_USER.render('replace');

		parent_html = primary.top_board;
		MIDTOP_GAMEMODE.container = parent_html;
		await MIDTOP_GAMEMODE.render('replace');

		parent_html = primary.rpanel;
		RIGHT_FRIEND_LIST.container = parent_html;
		await RIGHT_FRIEND_LIST.render('replace');

		await WEB_SOCKET.initSocket_friendList();
		await WEB_SOCKET.connectSocket_friendList();
		await WEB_SOCKET.listenSocket_friendList();

		//await WEB_SOCKET.initSocket_invite_receive();
		//await WEB_SOCKET.connectSocket_invite_receive();
		//await WEB_SOCKET.listenSocket_invite_receive();

		await LANGUAGE.updateContent('home');

		return true;
	}
}

const item = new HomeView();
export default item;
