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
		this.init_lobbySocket();
		this.init_gameRoomSocket();
	}

//=================================#
// LIVE CHAT
//=================================#

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

		return true;
	}

	async ws_is_ready_to_close(ws)
	{
		if (!ws)
			return false;
		if (ws.readyState !== WebSocket.OPEN &&
			ws.readyState !== WebSocket.CONNECTING)
			return false;

		return true;
	}

	async close_all_websockets()
	{
		if (await this.ws_is_ready_to_close(this.liveChat.ws))
			this.close_curent_liveChat();
		if (await this.ws_is_ready_to_close(this.friend.ws))
			this.close_friendSocket();

		return true;
	}

	async close_curent_liveChat()
	{
		if (await this.ws_is_ready_to_close(this.liveChat.ws))
		{
			this.liveChat.ws.send(JSON.stringify({
			  'message': null,
			  'sender': this.liveChat.sender,
			  'room_name': this.liveChat.target,
			  'type': 'chat_close',
			}));
			this.liveChat.ws.close();
		}
		
		return true;
	}

//=================================#
// FRIEND LIST
//=================================#

	async init_friendSocket()
	{
		this.friend =
		{
			user_id: null,
			ws: undefined,
			url: undefined,
			sender: undefined,
		};

		return true;
	}

	async close_friendSocket()
	{
		if (await this.ws_is_ready_to_close(this.friend.ws))
			this.friend.ws.close();

		return true;
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

	async friendSocket_connect_home_status()
	{
		this.friend.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.status == 'online')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'online');

				if (data.type == 'return')
					console.log('friend to me (return):', data.message);
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

		return true;
	}

	async friendSocket_gameroom_status(type)
	{
		if (type === 'join')
		{
			if (this.friend.ws
				&& this.friend.ws.readyState === WebSocket.OPEN)
			{
				this.friend.ws.send(JSON.stringify({
				  'user': this.friend.sender,
				  'action': 'change_game_view',
				}));
			}
		}
		else if (type === 'leave')
		{
			if (this.friend.ws
				&& this.friend.ws.readyState === WebSocket.OPEN)
			{
				this.friend.ws.send(JSON.stringify({
				  'user': this.friend.sender,
				  'action': 'change_home_view',
				}));
			}
		}
		else
			throw new Error('[ERR] unknown type');

		return true;
	}

//=================================#
// LOBBY LIST (ROOMS)
//=================================#

	async init_lobbySocket()
	{
		this.lobby =
		{
			ws: undefined,
			url: undefined,
		}

		console.log('lobby socket initialized');

		return true;
	}

	async connect_lobbySocket(lobby_type)
	{
		this.lobby.url = `wss://${window.location.host}/ws/lobby/${lobby_type}/`;
		this.lobby.ws = new WebSocket(this.lobby.url);

		console.log('lobby socket connected');

		return true;
	}

	async close_lobbySocket()
	{
		if (this.lobby.ws !== undefined)
		{
			this.lobby.ws.close();
			this.lobby.ws = undefined;
			this.lobby.url = undefined;
		}

		return true;
	}

	async lobbySocket_run(lobby_type)
	{
		await this.connect_lobbySocket(lobby_type);

		console.log('lobby socket ran');

		return true;
	}

//=================================#
// GAME ROOM
//=================================#

	async init_gameRoomSocket()
	{
		this.gr =
		{
			ws: undefined,
			url: undefined,
		}

		return true;
	}

	async connect_gameRoomSocket(room_id)
	{
		this.gr.url = `wss://${window.location.host}/ws/game/${room_id}/`;
		this.gr.ws = new WebSocket(this.gr.url);

		return true;
	}

	async close_gameRoomSocket()
	{
		this.gr.ws.close();

		return true;
	}

	async run_gameRoomSocket(room_id)
	{
		await this.connect_gameRoomSocket(room_id);

		return true;
	}

	async listen_gameRoomSocket()
	{
		this.gr.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.type == 'room_details')
			{
				console.log('GAME ROOM DETAILS: ', data);
			}
		});

		return true;
	}
}

const data = new websocketManager();
export default data;
