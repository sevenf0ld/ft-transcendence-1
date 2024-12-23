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
import leftPanelUser from '../components/HomeView/LeftUser.js';
import midTopPanel from '../components/HomeView/MidBoard.js';
import rightPanelFriends from '../components/HomeView/RightFnList.js';
import TOKEN from '../core/token.js';
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
    	}, 15000);

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
				if (data.type == 'notify')
					console.log('me to friends (on):', data.message);
				if (data.type == 'check')
					console.log('friend to me:', data.message);
			}
			if (data.status == 'offline')
			{
				if (data.type == 'notify')
					console.log('me to friends (off):', data.message);
			}
			if (data.status == 'playing')
			{
				if (data.type == 'notify')
					console.log('me to friends (on):', data.message);
				if (data.type == 'check')
					console.log('friend to me:', data.message);
			}
		});

		// homeview -> gameview (id: btn_join_room)
		//const join_room_btn = document.getElementById('btn_join_room');
		//join_room_btn.addEventListener('click', (event) => {
		//	event.preventDefault();

		//	if (this.friend_socket.readyState === WebSocket.OPEN)
		//	{
		//		this.friend_socket.send(JSON.stringify({
		//			'sender': this.username,
		//			'action': 'change_view',
		//		}));
		//	}
		//});
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
		const leftpanel = new leftPanelUser(parent_html);
		await leftpanel.render();

		parent_html = await primary.get("ct-mpanel-top");
		const midtoppanel = new midTopPanel(parent_html);
		await midtoppanel.render();

		parent_html = await primary.get("ct-main-rpanel");
		const rightpanel = new rightPanelFriends(parent_html);
		await rightpanel.render();

		await this.connect_online_status_socket()

		return true;
	}
}
