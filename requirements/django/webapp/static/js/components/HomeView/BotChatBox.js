// file : BotChatBox.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import FETCH from './BotChatBox_fetch.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import BOT_FRIEND_PFP from './BotFriendPfp.js';
import WS_MANAGER from '../../core/websocket_mng.js';
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
		console.log('[EVENT] button clicked : chatbox-profile');

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
			await BOT_FRIEND_PFP.render('replace');
		}
		else
		{
			alert(`Failed to get ${this.target}'s profile info.`);
			return false;
		}

		return true;
	}

	async closeClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : chatbox-close');

		const child = '<p class="ct-bottom-placeholder">(placeholder)</p>';

		const parent_div = document.querySelector('.ct-bottom-right');
		parent_div.innerHTML = child;

		const pfp_ctn = document.querySelector('.ct-bottom-left');
		pfp_ctn.innerHTML = child;

		//websocket close
		await WS_MANAGER.close_curent_liveChat();
		await WS_MANAGER.init_liveChat();

		return true;
	}

	async inviteClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : chatbox-invite');

		return true;
	}

	async sendMsgClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : chatbox-send');

		const input = document.getElementById('input_chatbox');
		let message = document.getElementById('input_chatbox').value;

		if (WS_MANAGER.liveChat.ws.readyState === WebSocket.OPEN)
		{
			WS_MANAGER.liveChat.ws.send(JSON.stringify({
			  'message': message,
			  'sender': this.sender,
			  'room_name': WS_MANAGER.liveChat.room_name,
			  'type': 'chat_reply',
			}));
			input.value = '';
		}
		else if (WS_MANAGER.liveChat.ws.readyState === WebSocket.CONNECTING)
			console.log("message is not sent. chat socket is waiting for an open connection.");
		else if (WS_MANAGER.liveChat.ws.readState >= 2)
			console.error("message will not be sent. chat socket connection closed or closing.");

		return true;
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	async msg_generator(user, msg)
	{
		if (user === 'You')
			return `<div class="ct-chatbox-msg text-muted">${user}: ${msg}</div>`;
		return `<div class="ct-chatbox-msg">${user}: ${msg}</div>`;
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

		await WS_MANAGER.close_curent_liveChat();
		await WS_MANAGER.init_liveChat();

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
			  console.log(`[CHAT AVAILABLE] ${this.target} - in room.`);
		  else if (data.type === 'chat_unavailable')
			  console.log(`[CHAT UNAVAILABLE] ${this.target} - not in room.`);
		  //========================================//
    	  //================ RECEIVE ===============//
    	  //================ CHATTING ==============//
    	  //========================================//
		  else if (data.type === 'chat_reply')
		  {
			let sender_name = data.sender === this.sender ? 'You' : data.sender;
			let msg = await this.msg_generator(sender_name, data.message);
			chatbox_ctn.insertAdjacentHTML(
				'beforeend', msg
			);
		  }
		});

		return true;
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
				<p class="%p1-c" title-"%p1-t" id="%hd-1d" @att-t1>%p1-t</p>
				<div class="%inv-1c" id="%inv-1d">invite</div>
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
			'%inv-1c': 'ct-chatbox-inv',
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
