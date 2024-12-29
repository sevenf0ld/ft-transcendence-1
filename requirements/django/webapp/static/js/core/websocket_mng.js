// file : websocket_mng.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import RIGHT_FRIEND_LIST from '../components/HomeView/RightFnList.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class websocketManager
{
	constructor()
	{
		this.init_liveChat();
		this.init_friendSocket();
	}

	async init_liveChat()
	{
		this.liveChat =
		{
			ws: undefined,
			url: undefined,
			sender: undefined,
			target: undefined,
			room_name: undefined,
		};
	}

	async close_curent_liveChat()
	{
		if (this.liveChat.ws && this.liveChat.ws.readyState === WebSocket.OPEN)
		{
			this.liveChat.ws.send(JSON.stringify({
			  'message': null,
			  'sender': this.liveChat.sender,
			  'room_name': this.liveChat.target,
			  'type': 'chat_close',
			}));
			this.liveChat.ws.close();
		}
	}

	async init_friendSocket()
	{
		this.friend =
		{
			user_id: null,
			ws: undefined,
			url: undefined,
			sender: undefined,
		};
	}
	
	async read_friendSocket()
	{
		const user_obj = JSON.parse(localStorage.getItem('user'));

		if (user_obj == null)
		{
			throw new Error('user not found');
			return false;
		}

		this.friend.user_id = user_obj.pk;
		this.friend.sender = user_obj.username;
		this.friend.url = `wss://${window.location.host}/ws/online/${this.friend.user_id}/`;
		this.friend.ws = new WebSocket(this.friend.url);

		return true;
	}

	async connect_online_status_socket()
	{
		this.friend.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.status == 'online')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'online');

				if (data.type == 'notified')
					console.log('friend to me (on):', data.message);
				if (data.type == 'checking')
					console.log('me to myself (on):', data.message);
			}
			if (data.status == 'offline')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'offline');

				if (data.type == 'notified')
					console.log('friend to me (off):', data.message);
			}
			if (data.status == 'playing')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'playing');

				if (data.type == 'notified')
					console.log('friend to me (playing):', data.message);
				if (data.type == 'checking')
					console.log('me to myself (playing):', data.message);
			}
		});
	}

	async update_join_game_status()
	{
		console.log('update_join_game_status');
		if (this.friend.ws && this.friend.ws.readyState === WebSocket.OPEN)
		{
			this.friend.ws.send(JSON.stringify({
			  'user': this.friend.sender,
			  'action': 'change_view',
			}));
		}
	}
}

const data = new websocketManager();
export default data;
