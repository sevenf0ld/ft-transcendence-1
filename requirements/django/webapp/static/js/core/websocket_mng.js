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

		if (user_obj === null)
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

			if (data.status === 'online')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'online');

				///if (data.type == 'return')
				//	console.log('friend to me (return):', data.message);
				//if (data.type == 'notified')
				//	console.log('friend to me (on):', data.message);
				//if (data.type == 'checking')
				//	console.log('me to myself (on):', data.message);
			}
			if (data.status === 'offline')
			{
				await RIGHT_FRIEND_LIST.update_online_status(data.friend, 'offline');

				//if (data.type == 'notified')
				//	console.log('friend to me (off):', data.message);
			}
			if (data.status === 'playing')
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

		return true;
	}

	async connectSocket_lobby(lobby_type)
	{
		if (this.lobby.ws === undefined)
		{
			this.lobby.url = `wss://${window.location.host}/ws/lobby/${lobby_type}/`;
			this.lobby.ws = new WebSocket(this.lobby.url);
		}

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

		return true;
	}

	async listenSocket_lobby()
	{
		this.lobby.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

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
		if (this.lobby.ws && this.lobby.ws.readyState === WebSocket.OPEN)
		{
			this.lobby.ws.send(JSON.stringify({
			  'lobby_update': 'create_room',
			}));
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
		this.gr.url = `wss://${window.location.host}/ws/game/${room_id}/`;
		this.gr.ws = new WebSocket(this.gr.url);

		return true;
	}

	async closeSocket_game()
	{
		this.gr.ws.close();

		return true;
	}

	async listenSocket_game()
	{
		this.gr.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.type === 'joined_room')
			{
				console.log('MEMBER JOINED ROOM DETAILS: ', data);
			}
			if (data.type === 'left_room')
			{
				console.log('MEMBER LEFT ROOM DETAILS: ', data);
			}
			if (data.type === 'disbanded_room')
			{
				console.log('DISBANDED ROOM DETAILS: ', data);
			}
			if (data.type === 'full_room')
			{
				console.log('FULL ROOM DETAILS: ', data);
			}
			if (data.type === 'started_game')
			{
				console.log('GAME HAS STARTED: ', data);
			}
		});

		return true;
	}

	async updateSocket_gameStart()
	{
		if (this.gr.ws && this.gr.ws.readyState === WebSocket.OPEN)
		{
			this.gr.ws.send(JSON.stringify({
			  'game_update': 'game_started',
			}));
		}

		return true;
	}

//=================================#
// INVITE PVP
//=================================#

	async initSocket_invite()
	{
		this.ipvp =
		{
			ws: undefined,
			url: undefined,
		}

		return true;
	}

	async connectSocket_invite(invitee)
	{
		this.ipvp.url = `wss://${window.location.host}/ws/invite/${invitee}/`;
		this.ipvp.ws = new WebSocket(this.ipvp.url);

		return true;
	}

	async closeSocket_invite()
	{
		this.ipvp.ws.close();

		return true;
	}

	async listenSocket_invite()
	{
		this.ipvp.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.type === 'invitation_received')
			{
				console.log('RECEIVED PVP INVITITATION DETAILS: ', data);
			}
			if (data.type === 'invitation_sent')
			{
				console.log('SENT PVP INVITITATION DETAILS: ', data);
			}
		});

		return true;
	}

	async updateSocket_invite()
	{
		if (this.ipvp.ws && this.ipvp.ws.readyState === WebSocket.OPEN)
		{
			this.ipvp.ws.send(JSON.stringify({
			  'invite_update': 'send_invitation',
			}));
		}

		return true;
	}
}

const data = new websocketManager();
export default data;
