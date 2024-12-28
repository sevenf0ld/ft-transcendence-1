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
		this.user_id = null;
		this.username = null;
		this.websocket_url = null;
		this.friend_socket = null;
	}

	async socket_init()
	{
		const user_obj = JSON.parse(localStorage.getItem('user'));

		if (user_obj == null)
		{
			throw new Error('user not found');
			return false;
		}

		this.user_id = user_obj.pk;
		this.username = user_obj.username;
		this.websocket_url = `wss://${window.location.host}/ws/online/${this.user_id}/`;
		this.friend_socket = new WebSocket(this.websocket_url);

		return true;
	}

	async connect_online_status_socket()
	{
		this.friend_socket.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.status == 'online')
			{
				if (data.type == 'notified')
					console.log('friend to me (on):', data.message);
				if (data.type == 'checking')
					console.log('me to myself (on):', data.message);
			}
			if (data.status == 'offline')
			{
				if (data.type == 'notified')
					console.log('friend to me (off):', data.message);
			}
			if (data.status == 'playing')
			{
				if (data.type == 'notified')
					console.log('friend to me (playing):', data.message);
				if (data.type == 'checking')
					console.log('me to myself (playing):', data.message);
			}
		});
	}

	async render()
	{
		if (TOKEN.token_id == null)
		{
			await TOKEN.start_refresh_token();
			await this.socket_init();
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

		await this.connect_online_status_socket()

		return true;
	}
}

const item = new HomeView();
export default item;