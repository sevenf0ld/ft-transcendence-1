// file : websocket_mng.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import RIGHT_FRIEND_LIST from '../components/HomeView/RightFnList.js';
import MID_BOARD from '../components/HomeView/MidBoard.js';
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
		this.initSocket_liveChat();
		this.initSocket_friendList();
		this.initSocket_lobby();
		this.initSocket_gameRoom();
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
			this.closeSocket_liveChat();
		if (await this.ws_is_ready_to_close(this.friend.ws))
			this.closeSocket_friendList();

		return true;
	}


//=================================#
// LIVE CHAT
//=================================#

	async initSocket_liveChat()
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

	async closeSocket_liveChat()
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

	async initSocket_friendList()
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

	async closeSocket_friendList()
	{
		if (await this.ws_is_ready_to_close(this.friend.ws))
			this.friend.ws.close();

		return true;
	}
	
	async connectSocket_friendList()
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

	async listenSocket_friendList()
	{
		this.friend.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.status == 'online')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'online');

				///if (data.type == 'return')
				//	console.log('friend to me (return):', data.message);
				//if (data.type == 'notified')
				//	console.log('friend to me (on):', data.message);
				//if (data.type == 'checking')
				//	console.log('me to myself (on):', data.message);
			}
			if (data.status == 'offline')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'offline');

				//if (data.type == 'notified')
				//	console.log('friend to me (off):', data.message);
			}
			if (data.status == 'playing')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'playing');

				//if (data.type == 'notified')
				//	console.log('friend to me (playing):', data.message);
				//if (data.type == 'checking')
				//	console.log('me to myself (playing):', data.message);
			}
		});

		return true;
	}

	async updateSocket_friendList(type)
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

	async initSocket_lobby()
	{
		this.lobby =
		{
			ws: undefined,
			url: undefined,
			room_details: undefined,

		}
		console.log('reset lobby socket');

		return true;
	}

	async connectSocket_lobby(lobby_type)
	{
		if (this.lobby.ws === undefined)
		{
			this.lobby.url = `wss://${window.location.host}/ws/lobby/${lobby_type}/`;
			this.lobby.ws = new WebSocket(this.lobby.url);
		}
		console.log('connect lobby socket when ', lobby_type);

		return true;
	}

	async closeSocket_lobby()
	{
		//if (this.lobby.ws !== undefined)
		//{
		//	this.lobby.ws.close();
		//	this.lobby.ws = undefined;
		//	this.lobby.url = undefined;
		//	this.lobby.room_details = undefined;
		//}
		this.lobby.ws.close();
		this.lobby.ws = undefined;
		this.lobby.url = undefined;
		this.lobby.room_details = undefined;
		console.log('close lobby socket when leave game room or stop viewing lobbylist');

		return true;
	}

	async listenSocket_lobby()
	{
		this.lobby.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			console.log('LOBBY ROOM LIST SOCKET LISTENING... ', data);
			if (data.type == 'display')
			{
				//this.lobby.room_details = data.rooms;
				await MID_BOARD.render_room_list(data.rooms);
			}
		});

		return true;
	}

	async updateSocket_lobbyCreate()
	{
		console.log('NOTIFY CREATE OUT', this.lobby.ws.readyState);
		if (this.lobby.ws && this.lobby.ws.readyState === WebSocket.OPEN)
		{
			this.lobby.ws.send(JSON.stringify({
			  'lobby_update': 'create_room',
			}));
			console.log('NOTIFY CREATE IN');
		}

		return true;
	}

//=================================#
// GAME ROOM
//=================================#

	async initSocket_gameRoom()
	{
		this.gr =
		{
			ws: undefined,
			url: undefined,
		}

		return true;
	}

	async connectSocket_game(room_id)
	{
		console.log('initiate game connection');
		this.gr.url = `wss://${window.location.host}/ws/game/${room_id}/`;
		this.gr.ws = new WebSocket(this.gr.url);

		return true;
	}

	async closeSocket_game()
	{
		console.log('close game room socket when leave');
		this.gr.ws.close();

		return true;
	}

	async listenSocket_game()
	{
		this.gr.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.type == 'join_room')
			{
				console.log('JOIN ROOM DETAILS: ', data);
			}
			if (data.type == 'leave_room')
			{
				console.log('LEAVE ROOM DETAILS: ', data);
			}
			if (data.type == 'disband_room')
			{
				console.log('DISBAND ROOM DETAILS: ', data);
			}
		});

		return true;
	}
}

const data = new websocketManager();
export default data;
