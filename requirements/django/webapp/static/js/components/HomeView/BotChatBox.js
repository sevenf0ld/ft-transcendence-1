// file : BotChatBox.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import FETCH from './BotFriendPfp_fetch.js';
import BOT_FRIEND_PFP from './BotFriendPfp.js';
import WS_MANAGER from '../../core/websocket_mng.js';
import GAME_ROOM_VIEW from '../../views/GameRoomView.js';
import CR_FETCH from './CreateRoom_fetch.js';
import LANGUAGE from '../../core/language/language.js';
import * as LOADING from '../../core/helpers/loading.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// THIS IS A FILE WHICH REFERENCES THE TEMPLATE (TEMPLATE.JS)
// [section-structure]
// 1. constructor
// 2. main-execution
// 3. event-related
// 4. fetch-related
// 5. html-element-related
// a. bootstrap-modal-related (optional)
// # init the class and export it.
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class BotChatBox
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		// COMMON-atts
		this.container = null;
		this.main_ctn = null;
		this.buttons = {
			'close': '',
			'invite': '',
			'profile': '',
			'send-msg': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.sender = null;
		this.target = null;
	}
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

		const template = await this.init_template();

		if (type === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (type === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}

		await this.push_important_elements();
		await this.bind_events();
		await this.bind_modals();

		return true;
	}

	async push_important_elements()
	{
		this.main_ctn = document.querySelector('.ct-chatbox-ctn');
		this.buttons['profile'] = document.getElementById('btn_chatbox_profile');
		this.buttons['close'] = document.getElementById('btn_chatbox_close');
		this.buttons['invite'] = document.getElementById('btn_chatbox_invite');
		this.buttons['send-msg'] = document.getElementById('btn_chatbox_send');

		if (!this.main_ctn)
			throw new Error('[ERR] main container not found');
		for (const key in this.buttons)
		{
			if (!this.buttons[key])
				throw new Error(`[ERR] button not found : ${key}`);
		}

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		this.buttons['profile'].addEventListener(
			'click', async (e) => {await this.profileClick(e);}
		);

		this.buttons['close'].addEventListener(
			'click', async (e) => {await this.closeClick(e);}
		);

		this.buttons['invite'].addEventListener(
			'click', async (e) => {await this.inviteClick(e);}
		);

		this.buttons['send-msg'].addEventListener(
			'click', async (e) => {await this.sendMsgClick(e);}
		);

		await this.connect_chat_socket();

		return true;
	}

	async profileClick(event)
	{
		event.preventDefault();
		console.log('[BTN] profileClick');

		if (await this.check_opened_profile(this.target))
			return true;

		const friend_profile = FETCH;
		await friend_profile.init();
		friend_profile.target = this.target;
		const fetch_result = await friend_profile.fetchData();
    
		if (fetch_result === 'friend-profile-successful')
		{
			const parent_div = document.querySelector('.ct-bottom-left');
			BOT_FRIEND_PFP.container = parent_div;
			BOT_FRIEND_PFP.username = this.target;
			const stats = friend_profile.fetch_obj.rdata;
			BOT_FRIEND_PFP.wins = 'Won: ' + stats.wins;
			BOT_FRIEND_PFP.losses = 'Lost: ' + stats.losses;
			BOT_FRIEND_PFP.total = 'Total: ' + stats.played;
			BOT_FRIEND_PFP.win_rate = 'W.rate: ' + stats.win_rate + '%';
			const avatar_url = stats.avatar_url;
			const splitted_url = avatar_url.split('/avatars/');
			const pfp_name = splitted_url[1];
			if (pfp_name !== 'default.jpg')
				BOT_FRIEND_PFP.friend_pfp = avatar_url;
			else
				BOT_FRIEND_PFP.friend_pfp = 'use-default';
			await BOT_FRIEND_PFP.render('replace');
			await LANGUAGE.updateContent('fn-pfp');
		}
		else
		{
			return false;
		}

		return true;
	}

	async check_opened_profile(name)
	{
		const profilebox = document.querySelector('.ct-fn-pfp-title');

		if (profilebox === null)
			return false;

		const title = profilebox.getAttribute('title');

		if (title === name)
			return true;

		return false;
	}

	async closeClick(event)
	{
		event.preventDefault();
		console.log('[BTN] closeClick');

		const child = '<p class="ct-bottom-placeholder">(placeholder)</p>';

		const parent_div = document.querySelector('.ct-bottom-right');
		parent_div.innerHTML = child;

		const pfp_ctn = document.querySelector('.ct-bottom-left');
		pfp_ctn.innerHTML = child;

		await WS_MANAGER.closeSocket_liveChat();

		return true;
	}

	// js can only send if the person is in chat
	async inviteClick(event)
	{
		event.preventDefault();
		console.log('[BTN] inviteClick');

		const chatbox_id = document.getElementById('btn_chatbox_profile');
		const chatbox_friend = chatbox_id.getAttribute('title');

		// if button is disabled then return
		if (event.target.disabled || event.target.classList.contains('invite-disabled'))
		{
			alert('Invitation is disabled until the user joins the chat.');
			return false;
		}

		let msg = `I have invited you to join my game room.`
		await this.send_msg(msg);

		msg = `Click below button to check it out.`
		await this.send_msg(msg);

		await this.send_msg(`<button class="chat-msg-btn">check me out</button>`);

		const pvp_btn = document.getElementById('btn_remote_pvp');
		await pvp_btn.click();
		let cr_room_btn = document.getElementById('btn_create_room');
		await LOADING.loading_page('show');
		let timeout = 0;
		while (cr_room_btn === null)
		{
			timeout++;
			if (timeout > 10)
				return alert('Failed to create room.');
			await new Promise((resolve) => setTimeout(resolve, 100));
			cr_room_btn = document.getElementById('btn_create_room');
		}
		await cr_room_btn.click();
		await new Promise((resolve) => setTimeout(resolve, 500));
		await LOADING.loading_page('hide');

		let room_id = null;
		timeout = 0;
		while (room_id === null)
		{
			timeout++;
			if (timeout > 10)
				return alert('Failed to create room.');
			await new Promise((resolve) => setTimeout(resolve, 100));
			room_id = CR_FETCH.fetch_obj.rdata.room_id;
		}
		await new Promise((resolve) => setTimeout(resolve, 300));
		const me = JSON.parse(localStorage.getItem('user')).username;
		await GAME_ROOM_VIEW.announce(`${me} has invited ${chatbox_friend} to this game room.`);
		
		/*

		const room_created = await this.fetch_create_game_room();
		if (room_created)
		{
			await WS_MANAGER.updateSocket_friendList('join');
			const gameRoom = GAME_ROOM_VIEW;
			await gameRoom.init();
			gameRoom.type = 'online-pvp';
			await gameRoom.render();
			const me = JSON.parse(localStorage.getItem('user')).username;
			await gameRoom.announce(`${me} has invited ${chatbox_friend} to this game room.`);
			await WS_MANAGER.listenSocket_game();
			
			wait new Promise((resolve) => setTimeout(resolve, 500));
			let msg = `I have invited you to join the game room.`
			await this.send_msg(msg);

			const rid = CR_FETCH.fetch_obj.rdata.room_id;
			msg = `Room ID: ${rid}`;
			await this.send_msg(msg);

			msg = `Click below button to check it out.`
			await this.send_msg(msg);

			await this.send_msg(`<button class="chat-msg-btn">check me out</button>`);

			await WS_MANAGER.closeSocket_liveChat();

			//await WS_MANAGER.initSocket_invite_send();
			//await WS_MANAGER.connectSocket_invite_send(chatbox_friend);
			//await WS_MANAGER.updateSocket_invite_send(room_created);
			//await WS_MANAGER.listenSocket_invite_send();
		}
		*/

		return true;
	}

	async send_msg(message, input)
	{
		if (WS_MANAGER.liveChat.ws.readyState === WebSocket.OPEN)
		{
			WS_MANAGER.liveChat.ws.send(JSON.stringify({
			  'message': message,
			  'sender': this.sender,
			  'room_name': WS_MANAGER.liveChat.room_name,
			  'type': 'chat_reply',
			}));
			if (input)
				input.value = '';
		}
		else if (WS_MANAGER.liveChat.ws.readyState === WebSocket.CONNECTING)
			console.log("message is not sent. chat socket is waiting for an open connection.");
		else if (WS_MANAGER.liveChat.ws.readState >= 2)
			console.error("message will not be sent. chat socket connection closed or closing.");
	}

	async sendMsgClick(event)
	{
		event.preventDefault();
		console.log('[BTN] sendMsgClick');

		const input = document.getElementById('input_chatbox');
		let message = document.getElementById('input_chatbox').value;
		await this.send_msg(message, input);

		return true;
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	async msg_generator(user, msg)
	{
		let str = null;
		const chatbox_ctn = document.querySelector('.ct-chatbox-ctn .ct-chatbox-bd');

		let pure_msg = msg;
		// prevent < and > from being interpreted as HTML tags and entities
		// except only <button class="btn btn-link">check me out</button>
		if (msg.includes('<button class="chat-msg-btn">check me out</button>'))
		{
			let pure_before;
			let pure_after;
			const before = msg.split('<button class="chat-msg-btn">check me out</button>')[0];
			const after = msg.split('<button class="chat-msg-btn">check me out</button>')[1];

			if (before !== undefined)
				pure_before = before.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			else
				pure_before = '';

			if (after !== undefined)
				pure_after = after.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			else
				pure_after = '';

			pure_msg = pure_before + '<button class="chat-msg-btn">check me out</button>' + pure_after;
		}
		else
			pure_msg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		if (user === 'You' || user === 'System')
			str = `<div class="ct-chatbox-msg text-muted">${user}: ${pure_msg}</div>`;
		else
			str = `<div class="ct-chatbox-msg">${user}: ${pure_msg}</div>`;

		chatbox_ctn.insertAdjacentHTML('beforeend', str);
		await this.input_invite_manager('receive');

		return true;
	}

	async input_invite_manager(state)
	{
		const input = document.getElementById('input_chatbox');
		const btn = document.getElementById('btn_chatbox_invite');
		const ctn = document.querySelector('.ct-chatbox-bd');

		if (state === 'disable')
		{
			input.disabled = true;
			input.placeholder = 'Chat is unavailable.';
			input.value = '';

			btn.disabled = true;
			btn.classList.add('invite-disabled');
		}
		if (state === 'enable')
		{
			input.disabled = false;
			input.placeholder = 'Type your message here';
			input.value = '';

			btn.disabled = false;
			btn.classList.remove('invite-disabled');
		}
		if (state === 'receive')
		{
			ctn.scrollTop = ctn.scrollHeight;
		}

		await LANGUAGE.updateContent('chatbox-ctn');

		return true;
	}

	async roomName_generator(sender, target)
	{
		if (sender < target)
			return `${sender}_${target}`;
		return `${target}_${sender}`;
	}

	async socket_init()
	{
		this.sender = JSON.parse(localStorage.getItem('user')).username;

		await WS_MANAGER.closeSocket_liveChat();

		if (!document.querySelector(`.fnl-item-ctn[data-type="added"][title="${this.target}"]`))
			return console.log(`[SOCKET ERROR] ${this.target} is not in the added section.`);
		else
			console.log(`[SOCKET READY] ${this.target} is in the added section.`);

		WS_MANAGER.liveChat.sender = this.sender;
		WS_MANAGER.liveChat.target = this.target;
		const roomName = await this.roomName_generator(this.sender, this.target);
		WS_MANAGER.liveChat.room_name = roomName;
		WS_MANAGER.liveChat.url = `wss://${window.location.host}/ws/chat/${roomName}/`;
		WS_MANAGER.liveChat.ws = await new WebSocket(WS_MANAGER.liveChat.url);
		WS_MANAGER.liveChat.ws.addEventListener("error", (event) => {
			console.error(`[SOCKET ERROR] ${roomName}.`);
		});
		WS_MANAGER.liveChat.ws.addEventListener("open", (event) => {
			console.log(`[SOCKET READY] ${roomName}.`);
		});
		WS_MANAGER.liveChat.ws.addEventListener("close", (event) => {
			console.log(`[SOCKET CLOSED] ${roomName}.`);
		});
	}

	async connect_chat_socket()
	{
		await this.socket_init();
		const send_btn = this.buttons['send-msg'];
		const chatbox_close = this.buttons['close'];

		const chatbox_ctn = document.querySelector('.ct-chatbox-ctn .ct-chatbox-bd');
		chatbox_ctn.innerHTML = '';

		WS_MANAGER.liveChat.ws.addEventListener("message", async (event) =>
		{
			let data = JSON.parse(event.data);
		  //========================================//
    	  //================ RECEIVE ===============//
    	  //======= NOTIFICATION FROM SERVER =======//
    	  //========================================//
			if (data.type === 'chat_available')
			{
				await this.msg_generator('System', `${this.target} is in the room.`);
				await this.input_invite_manager('enable');
			}
			else if (data.type === 'chat_unavailable')
			{
				await this.msg_generator('System', `${this.target} is not in the room.`);
				await this.input_invite_manager('disable');
			}
		  //========================================//
    	  //================ RECEIVE ===============//
    	  //================ CHATTING ==============//
    	  //========================================//
		  else if (data.type === 'chat_reply')
		  {
			let sender_name = data.sender === this.sender ? 'You' : data.sender;
			await this.msg_generator(sender_name, data.message);
			const allbtns = document.querySelectorAll('.ct-chatbox-bd .chat-msg-btn');
			
			// if message contain a button, then bind the event
			const checkout_btn = `<button class="chat-msg-btn">check me out</button>`;
			const pvp_btn = document.querySelector('#btn_remote_pvp');
			if (data.message.includes(checkout_btn))
			{
				const btn = document.querySelectorAll('.ct-chatbox-bd .chat-msg-btn');
				for (const b of btn)
				{
					b.addEventListener('click', async (e) => {
						await pvp_btn.click();
					});
				}
			}
			await this.input_invite_manager('receive');
		  }
		});

		return true;
	}

	async fetch_create_game_room()
	{
		await CR_FETCH.init();
		await CR_FETCH.fetchData('PVP');
		if (CR_FETCH.re_value === 'game-room-creation-successful')
		{
			await WS_MANAGER.updateSocket_lobbyCreate();

			const room_id = CR_FETCH.fetch_obj.rdata.room_id;

			await WS_MANAGER.initSocket_game();
			await WS_MANAGER.connectSocket_game(room_id);

			return room_id;
		}
		else if (CR_FETCH.fetch_obj.re_value === 'game-room-creation-failed')
		{
			alert('Failed to create PVP game room.');

			return null;
		}

		return null;
	}

	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template()
	{
		let template = "";
		template += await this.html_main_ctn();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn()
	{
		// [-] HELPER FUNCTION
		async function insert(msg)
		{
			let template = `
				<div class="%msg-1c">${msg}</div>
			`;
			return template;
		}

		// [A] TEMPLATE
		let template = `
		<div class="%main-1c %main-2c">
			<div class="%hd-1c">
				<p class="%p1-c" id="%hd-1d" @att-t1>%p1-t</p>
				<div class="%inv-1c" id="%inv-1d" disabled>invite</div>
				<div class="%close-1c" id="%close-1d">%close-1t</div>
			</div>
			<div class="%bd-1c">
				${insert('user-1: hello')}
				${insert('user-2: hi')}
				${insert('user-1: how are you?')}
				${insert('user-2: good')}
			</div>
			<form class="%ft-1c">
				<input @att1 @att2 @att3 @att4>
				<button @att-a1 @att-a2>@att-a3</button>
			</form>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-1c': 'ct-chatbox-ctn',
			'%main-2c': '',
			'%hd-1c': 'ct-chatbox-hd',
			'%hd-1d': 'btn_chatbox_profile',
			'%p1-c': 'ct-chatbox-title truncate',
			'@att-t1': `title="${this.target}"`,
			'%p1-t': `${this.target}`,
			'%inv-1c': 'ct-chatbox-inv invite-disabled',
			'%inv-1d': 'btn_chatbox_invite',
			'%close-1c': 'ct-chatbox-close',
			'%close-1d': 'btn_chatbox_close',
			'%close-1t': 'X',
			'%bd-1c': 'ct-chatbox-bd d-flex flex-column',
			'%msg-1c': 'ct-chatbox-msg',
			'%ft-1c': 'ct-chatbox-ft',
			'@att1': 'type="text"',
			'@att2': 'placeholder="Type your message here"',
			'@att3': 'id="input_chatbox" autocomplete="off"',
			'@att4': 'class="ct-chatbox-input"',
			'@att-a1': 'id="btn_chatbox_send"',
			'@att-a2': 'class="ct-chatbox-send" type="submit"',
			'@att-a3': 'Send',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
}

const item = new BotChatBox();
export default item;
