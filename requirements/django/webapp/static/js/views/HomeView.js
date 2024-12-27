// file : HomeView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PageTitle from '../core/helpers/PageTitle.js';
import MediaLayout from '../layouts/MediaLayout.js';
import PrimaryLayout from '../layouts/PrimaryLayout.js';
//components
import rightPanelFriends from '../components/HomeView/RightFnList.js';
import TOKEN from '../core/token.js';

import LEFT_USER from '../components/HomeView/LeftUser.js';
import MIDTOP_GAMEMODE from '../components/HomeView/MidBoard.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class HomeView
{
	constructor()
	{
		this.container = document.body;

		TOKEN.token_id = setInterval(async () => {
    		await TOKEN.refresh_token();
    	}, 20 * 60 * 1000);

		const user_obj = JSON.parse(localStorage.getItem('user'));
		this.user_id = user_obj.pk;
		this.username = user_obj.username;
		this.websocket_url = `wss://${window.location.host}/ws/online/${this.user_id}/`;
		this.friend_socket = new WebSocket(this.websocket_url);
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
		let parent_html;

		const page_title = new PageTitle();
		page_title.update('Home');

		const media = new MediaLayout();
		await media.render();

		parent_html = await media.get();
		const primary = new PrimaryLayout(parent_html);
		await primary.render();

		parent_html = await primary.get("ct-main-lpanel");
		LEFT_USER.container = parent_html;
		await LEFT_USER.render('replace');

		parent_html = await primary.get("ct-top-board");
		MIDTOP_GAMEMODE.container = parent_html;
		await MIDTOP_GAMEMODE.render('replace');

		parent_html = await primary.get("ct-main-rpanel");
		const rightpanel = new rightPanelFriends(parent_html);
		await rightpanel.render();

		await this.connect_online_status_socket()

		return true;
	}
}
