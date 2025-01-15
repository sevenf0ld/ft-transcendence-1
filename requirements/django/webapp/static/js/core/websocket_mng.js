// file : websocket_mng.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import RIGHT_FRIEND_LIST from '../components/HomeView/RightFnList.js';
import MID_BOARD from '../components/HomeView/MidBoard.js';
import GAME_ROOM_VIEW from '../views/GameRoomView.js';
import ACTION_PANEL from '../components/GameRoomView/ActionPanel.js';
import ANNOUNCER from '../components/GameRoomView/Announcer.js';
import GAME_BOARD from '../components/GameRoomView/GameBoard.js';
import ROOM_LIST from '../components/GameRoomView/RoomList.js';
import HOME_VIEW from '../views/HomeView.js';
import EG_RENDER from '../components/GameLogic/engine_render.js';
import EG_DATA from '../components/GameLogic/engine_data.js';
import TOKEN from './token.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //

// protect all close, update and listen
class websocketManager
{
	constructor()
	{
		this.initSocket_liveChat();
		this.initSocket_friendList();
		this.initSocket_lobby();
		this.initSocket_game();
		//this.initSocket_invite_receive();
		//this.initSocket_invite_send();
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
		if (await this.ws_is_ready_to_close(this.lobby.ws))
			this.closeSocket_lobby();
		if (await this.ws_is_ready_to_close(this.gr.ws))
			this.closeSocket_game();
		//if (await this.ws_is_ready_to_close(this.receive_ipvp.ws))
		//	this.closeSocket_invite_receive();
		//if (await this.ws_is_ready_to_close(this.send_ipvp.ws))
		//	this.closeSocket_invite_send();

		console.log('[INFO] all websockets closed');

		return true;
	}

	async ws_is_open(ws)
	{
		if (!ws)
			return false;
		if (ws.readyState === WebSocket.OPEN)
			return true;

		return false;
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
			await this.initSocket_liveChat();
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
		{
			this.friend.ws.close();
			await this.initSocket_friendList();
		}

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
		this.friend.ws = await this.new_websocket(this.friend.url);

		await new Promise((resolve, reject) => {
        	this.friend.ws.addEventListener('open', (event) => {
        	    console.log('FriendList WebSocket Open:', this.friend.ws.readyState);
        	    resolve();
        	});
        	this.friend.ws.addEventListener('error', (error) => {
        	    console.error('FriendList WebSocket Error:', error);
        	    reject(error);
        	});
			this.friend.ws.addEventListener('close', (event) => {
		    	console.log('FriendList WebSocket Closed:', event);
        	    resolve();
			});
    	});

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
				console.log('[INFO] friend ws is open');
			}
			else
				console.log('[ERR] friend ws is not open');
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

	async new_websocket(url)
	{
		if (!await TOKEN.refresh_token())
		{
			console.log('[err] token expired, new websocket is not allowed');
			return false;
		}

		let re_value = new WebSocket(url);

		return re_value;
	}

	async connectSocket_lobby(lobby_type)
	{
		if (this.lobby.ws === undefined)
		{
			this.lobby.url = `wss://${window.location.host}/ws/lobby/${lobby_type}/`;
			//check if token is expired first
			this.lobby.ws = await this.new_websocket(this.lobby.url);
		}

		await new Promise((resolve, reject) => {
        	this.lobby.ws.addEventListener('open', (event) => {
        	    console.log('Lobby WebSocket Open:', this.lobby.ws.readyState);
        	    resolve();
        	});
        	this.lobby.ws.addEventListener('error', (error) => {
        	    console.error('Lobby WebSocket Error:', error);
        	    reject(error);
        	});
			this.lobby.ws.addEventListener('close', (event) => {
		    	console.log('Lobby WebSocket Closed:', event);
        	    resolve();
			});
    	});

		return true;
	}

	async closeSocket_lobby()
	{
		if (await this.ws_is_ready_to_close(this.lobby.ws))
		{
			this.lobby.ws.close();
			this.lobby.ws = undefined;
			this.lobby.url = undefined;
			this.lobby.room_details = undefined;
			await this.initSocket_lobby();
		}

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

	async initSocket_game()
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
		this.gr.ws = await this.new_websocket(this.gr.url);

		await new Promise((resolve, reject) => {
        	this.gr.ws.addEventListener('open', (event) => {
        	    console.log('Game Room WebSocket Open:', this.gr.ws.readyState);
        	    resolve();
        	});
        	this.gr.ws.addEventListener('error', (error) => {
        	    console.error('Game Room WebSocket Error:', error);
        	    reject(error);
        	});
			this.gr.ws.addEventListener('close', (event) => {
		    	console.log('Game Room WebSocket Closed:', event);
        	    resolve();
			});
    	});

		return true;
	}

	async closeSocket_game()
	{
		if (await this.ws_is_ready_to_close(this.gr.ws))
		{
			this.gr.ws.close();
			await this.initSocket_game();
		}

		return true;
	}

	async listenSocket_game()
	{
		this.gr.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.type === 'joined_room')
			{
				console.log('JOINED ROOM DETAILS: ', data);
				this.is_end = false;
				await ACTION_PANEL.opvp_live_update(data);
				await ANNOUNCER.opvp_live_update(data);
				await ROOM_LIST.opvp_live_update(data);
				await GAME_BOARD.opvp_live_update(data);
			}
			if (data.type === 'left_room')
			{
				console.log('LEFT ROOM DETAILS: ', data);
				await ACTION_PANEL.opvp_live_update(data);
				await ANNOUNCER.opvp_live_update(data);
				await ROOM_LIST.opvp_live_update(data);
				await GAME_BOARD.opvp_live_update(data);
			}
			if (data.type === 'disbanded_room')
			{
				await GAME_BOARD.opvp_live_update(data);

				if (EG_DATA.match.started === false)
				{
					alert('it seems the host has left the room');
					alert(data.message);
					await this.updateSocket_friendList('leave');
					await this.closeSocket_lobby();
					const HOME = HOME_VIEW;
					await HOME.render();
				}
			}
			if (data.type === 'full_room')
			{
				console.log('FULL ROOM DETAILS: ', data);
			}
			if (data.type === 'started_game')
			{
				console.log('STARTED GAME DETAILS: ', data);
				await ACTION_PANEL.opvp_live_update(data);
				await ANNOUNCER.opvp_live_update(data);
				await ROOM_LIST.opvp_live_update(data);
				await GAME_BOARD.opvp_live_update(data);
			}
			if (data.type === 'pre_game')
			{
				EG_DATA.ball.dy = data.dy;
				EG_DATA.ball.dx = data.dx;
				EG_DATA.match.started = true;
				requestAnimationFrame(EG_RENDER.game_loop.bind(EG_RENDER));
			}
			if (data.type === 'paddle_p1')
			{
				EG_DATA.player1.x = data.p1_x;
				EG_DATA.player1.y = data.p1_y;
			}
			if (data.type === 'paddle_p2')
			{
				EG_DATA.player2.x = data.p2_x;
				EG_DATA.player2.y = data.p2_y;
			}
			if (data.type === 'random_difficulty')
			{
				EG_DATA.ball.dy *= data.angle;
			}
			if (data.type === `game_end`)
			{
				if (this.lobby.ws !== undefined)
				{
					alert(data.message);
					// wait 3 seconds and render home
					await new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve();
						}, 500);
					});
					await this.updateSocket_friendList('leave');
					await this.closeSocket_lobby();
					const HOME = HOME_VIEW;
					await HOME.render();
				}
			}
			if (data.type === `unexpected_end`)
			{
				if (this.lobby.ws !== undefined)
				{
					alert(data.message);
					// wait 3 seconds and render home
					await new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve();
						}, 500);
					});
					await this.updateSocket_friendList('leave');
					await this.closeSocket_lobby();
					const HOME = HOME_VIEW;
					await HOME.render();
				}
			}
		});

		return true;
	}

	async updateSocket_gameStart()
	{
		if (this.gr.ws && this.gr.ws.readyState === WebSocket.OPEN)
		{
			this.gr.ws.send(JSON.stringify({
				'game_state': 'game_started',
			}));
		}

		return true;
	}

//=================================#
// INVITE PVP
//=================================#

	async initSocket_invite_send()
	{
		this.send_ipvp =
		{
			ws: undefined,
			url: undefined,
		}

		return true;
	}

	async initSocket_invite_receive()
	{
		this.receive_ipvp =
		{
			ws: undefined,
			url: undefined,
		}

		return true;
	}

	async connectSocket_invite_send(invitee)
	{
		this.send_ipvp.url = `wss://${window.location.host}/ws/invite/${invitee}/`;
		//this.send_ipvp.url = `wss://${window.location.host}/ws/invite/haha/`;
		this.send_ipvp.ws = await this.new_websocket(this.send_ipvp.url);

		await new Promise((resolve, reject) => {
        	this.send_ipvp.ws.addEventListener('open', (event) => {
        	    console.log('Send Invite WebSocket Open:', this.send_ipvp.ws.readyState);
        	    resolve();
        	});
        	this.send_ipvp.ws.addEventListener('error', (error) => {
        	    console.error('Send Invite WebSocket Error:', error);
        	    reject(error);
        	});
			this.send_ipvp.ws.addEventListener('close', (event) => {
		    	console.log('Send Invite WebSocket Closed:', event);
				if (event.code === 3003)
				{
					alert('Invitee does not exist.');
				}
        	    resolve();
			});
    	});

		return true;
	}

	async connectSocket_invite_receive()
	{
		const my_username = JSON.parse(localStorage.getItem('user')).username;
		this.receive_ipvp.url = `wss://${window.location.host}/ws/invite/${my_username}/`;
		this.receive_ipvp.ws = await this.new_websocket(this.receive_ipvp.url);

		await new Promise((resolve, reject) => {
        	this.receive_ipvp.ws.addEventListener('open', (event) => {
        	    console.log('Receive Invite WebSocket Open:', this.receive_ipvp.ws.readyState);
        	    resolve();
        	});
        	this.receive_ipvp.ws.addEventListener('error', (error) => {
        	    console.error('Receive Invite WebSocket Error:', error);
        	    reject(error);
        	});
			this.receive_ipvp.ws.addEventListener('close', (event) => {
		    	console.log('Receive Invite WebSocket Closed:', event);
        	    resolve();
			});
    	});

		return true;
	}

	async closeSocket_invite_send()
	{
		if (await this.ws_is_ready_to_close(this.send_ipvp.ws))
		{
			this.send_ipvp.ws.close();
			await this.initSocket_invite_send();
		}

		return true;
	}

	async closeSocket_invite_receive()
	{
		if (await this.ws_is_ready_to_close(this.receive_ipvp.ws))
		{
			this.receive_ipvp.ws.close();
			await this.initSocket_invite_receive();
		}

		return true;
	}

	async listenSocket_invite_send()
	{
		await new Promise((resolve, reject) => {
			this.send_ipvp.ws.addEventListener('message', async (event) => {
				let data = JSON.parse(event.data);

				if (data.type === 'invitation_sent')
				{
					console.log('SENT PVP INVITITATION DETAILS: ', data);
					alert(data.message);
					resolve();
					await this.closeSocket_invite_send();
				}
				//if (data.type === 'invallid_invitee')
				//{
				//	console.log('INVALID PVP INVITITATION DETAILS: ', data);
				//	alert(data.message);
				//	resolve();
				//	await this.closeSocket_invite_send();
				//}
			});
    	});

		return true;
	}

	async listenSocket_invite_receive()
	{
		this.receive_ipvp.ws.addEventListener('message', async (event) => {
			let data = JSON.parse(event.data);

			if (data.type === 'invitation_received')
			{
				console.log('RECEIVED PVP INVITITATION DETAILS: ', data);
				alert(data.message);

				await this.connectSocket_game(data.room_id);
				await this.updateSocket_friendList('join');
				await this.closeSocket_liveChat();

				const gameRoom = GAME_ROOM_VIEW;
				await gameRoom.init();
				gameRoom.type = `online-pvp`;
				await gameRoom.render();
				await this.listenSocket_game();
			}
		});

		return true;
	}

	async updateSocket_invite_send(room_id)
	{
		if (this.send_ipvp.ws && this.send_ipvp.ws.readyState === WebSocket.OPEN)
		{
			this.send_ipvp.ws.send(JSON.stringify({
			  'invite_update': 'send_invitation',
			  'room_id': room_id,
			}));
		}

		return true;
	}
}

const data = new websocketManager();
export default data;
