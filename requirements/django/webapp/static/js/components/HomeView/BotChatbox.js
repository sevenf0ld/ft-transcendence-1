// file : BotChatbox.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import BotFriendPfp from './BotFriendPfp.js';
import WS_MANAGER from '../../core/websocket_mng.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// --- [LOCAL] EXPORTED COMPONENTS
// usage : insert querySelector's value of an element
// 		   to register as export element; first one
// 		   is always default
const getEle = [
	'#modal-join',
];

// --- [LOCAL] BUTTONS SECTION
// button tracker
class button
{
	constructor()
	{
		this.arr = {
			'close': '',
			'invite': '',
			'profile': '',
			'send-msg': '',
		};
	}

	async read_buttons()
	{
		for (const key in this.arr)
		{
			const ele = document.getElementById(`${this.arr[key]}`);
			if (!ele)
				throw new Error(`[ERR] button not found : ${this.arr[key]}`);
			this.arr[key] = ele;
		}
		return true;
	}
}
const btns = new button();

function html_element()
{
	// [-] HELPER FUNCTION
	function insert(msg)
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

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%main-1c': 'ct-chatbox-ctn',
		'%main-2c': '',
		'%hd-1c': 'ct-chatbox-hd',
		'%hd-1d': 'btn_chatbox_profile',
		'%p1-c': 'ct-chatbox-title truncate',
		'@att-t1': 'title="User-1"',
		'%p1-t': 'User-1',
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

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['profile'] = 'btn_chatbox_profile';
	btns.arr['invite'] = attributes['%inv-1d'];
	btns.arr['close'] = attributes['%close-1d'];
	btns.arr['send-msg'] = 'btn_chatbox_send';

	// [D] HTML RETURN
	return template;
}

// HTML elements bundle
const ele =
{
	html_element,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class BotChatbox
{
	// --- [00] CONSTRUCTOR
	constructor(container, name)
	{
		this.container = container;
		this.components = {};
		this.sender = '';
		this.target = name;
		this.room_name = {};
		this.websocket_url = {};
		this.chat_socket = {};
		this.room_status = {}; // on (both in room), off (only one or zero in room), error (no connection)
	}

	// --- [01] getter
	async get(element = 'default')
	{
		if (this.read_components() === false)
		{
			throw new error(`[err] this class has no export components`);
			return false;
		}
		return this.compo_get(element);
	}

	// --- [02] COMPONENTS REGISTRY
	async compo_register(name, element)
	{
		this.components[name] = element;

		return true;
	}

	async compo_get(name)
	{
		return this.components[name];
	}

	async compo_remove(name)
	{
		delete this.components[name];

		return true;
	}

	async read_components()
	{
		if (getEle.length === 0)
			return false;
		this.compo_register('default', document.querySelector(getEle[0]));
		for (const key in getEle)
		{
			const ele = document.querySelector(getEle[key]);
			if (!ele)
				throw new Error(`[ERR] component not found : ${getEle[key]}`);
			const str = getEle[key].substring(1);
			this.compo_register(str, ele);
		}

		return true;
	}

	// --- [03] HTM-LELEMENTS
	async init_template()
	{
		let template = "";
		template += ele.html_element();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();
	
		return template;
	}

	// --- [04] EVENT
	async profileClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] chatbox mssage\'s header clicked');

		const parent_div = document.querySelector('.ct-bottom-left');
		const pfp = new BotFriendPfp(parent_div, this.target);
		await pfp.render('replace');

		return true;
	}

	async inviteClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked: invite to remote pvp');

		return true;
	}

	async closeClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked: close chatbox');
		
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

	async sendMsgClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked: send message');

		const input = document.getElementById('input_chatbox');
		let message = document.getElementById('input_chatbox').value;

		if (WS_MANAGER.liveChat.ws.readyState === WebSocket.OPEN)
		{
			WS_MANAGER.liveChat.ws.send(JSON.stringify({
			  'message': message,
			  'sender': this.sender,
			  'room_name': this.room_name,
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

	// ================================================== //
	// [4.1] EVENT - WEB SOCKET RELATED
	// ================================================== //
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
		//if target is in the added section
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
		console.log('TEST--------------------- ', WS_MANAGER.liveChat);
		WS_MANAGER.liveChat.ws.addEventListener("error", (event) => {
			console.error(`[SOCKET ERROR] ${roomName}.`);
			//WS_MANAGER.liveChat.ws = undefined;
		});
		WS_MANAGER.liveChat.ws.addEventListener("open", (event) => {
			console.log(`[SOCKET READY] ${roomName}.`);
		});
		WS_MANAGER.liveChat.ws.addEventListener("close", (event) => {
			console.log(`[SOCKET CLOSED] ${roomName}.`);
			//WS_MANAGER.liveChat.ws = undefined;
		});
	}

	async connect_chat_socket()
	{
		await this.socket_init();
		const send_btn = document.getElementById('btn_chatbox_send');
		const chatbox_ctn = document.querySelector('.ct-chatbox-ctn .ct-chatbox-bd');
		const chatbox_close = document.getElementById('btn_chatbox_close');

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

	// bind events
	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['profile'].addEventListener(
			'click', async (e) => {await this.profileClick(e);}
		);

		btns.arr['invite'].addEventListener(
			'click', async (e) => {await this.inviteClick(e);}
		);

		btns.arr['close'].addEventListener(
			'click', async (e) => {await this.closeClick(e);}
		);

		btns.arr['send-msg'].addEventListener(
			'click', async (e) => {await this.sendMsgClick(e);}
		);

		await this.connect_chat_socket();

		while (true)
		{
			//check websocket every 1 second
			await new Promise(r => setTimeout(r, 1000));
			console.log(`[SOCKET CHECK-RECUR]`, WS_MANAGER.liveChat.ws);
		}

		return true;
	}
	
	// --- [05] RENDER
	async render()
	{
		const template = await this.init_template();
		this.container.innerHTML = '';
		this.container.innerHTML = template;

		const title = document.querySelector('.ct-chatbox-title');
		title.innerHTML = this.target;
		title.title = this.target;

		await this.bind_events();
		//await this.modals_render(this.container);

		return true;
	}
}
