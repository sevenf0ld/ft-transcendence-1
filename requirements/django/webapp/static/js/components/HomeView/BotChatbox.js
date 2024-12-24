// file : BotChatbox.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import BotFriendPfp from './BotFriendPfp.js';
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


		return true;
	}

	async sendMsgClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked: send message');

		return true;
	}

	// ================================================== //
	// [4.1] EVENT - WEB SOCKET RELATED
	// ================================================== //
	async socket_init()
	{
		this.sender = JSON.parse(localStorage.getItem('user')).username;

		const flist = document.querySelectorAll('.fnl-item-ctn[data-type="added"]');
		for (const friend of flist)
		{
			const friend_name = friend.title;
			this.room_name[friend_name] = await this.roomName_generator(this.sender, friend_name);
			this.websocket_url[friend_name] = `wss://${window.location.host}/ws/chat/${this.room_name[friend_name]}/`;
			this.chat_socket[friend_name] = await new WebSocket(this.websocket_url[friend_name]);
			this.chat_socket[friend_name].addEventListener("error", (event) => {
				console.error(`[SOCKET ERROR] ${this.room_name[friend_name]}.`);
				this.room_status[friend_name] = 'error';
			});
			this.chat_socket[friend_name].addEventListener("open", (event) => {
				console.log(`[SOCKET READY] ${this.room_name[friend_name]}.`);
				this.room_status[friend_name] = 'off';
			});
			//this.chat_socket[this.target].addEventListener("close", (event) => {
			//	console.error(`[SOCKET CLOSED] ${this.room_name[this.target]}.`);
			//	this.room_status[this.target] = 'off';
			//});
		}

	}

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

	async connect_chat_socket()
	{
		await this.socket_init();
		const send_btn = document.getElementById('btn_chatbox_send');
		const input = document.getElementById('input_chatbox');
		const chatbox_ctn = document.querySelector('.ct-chatbox-ctn .ct-chatbox-bd');
		chatbox_ctn.innerHTML = '';
		const chatbox_close = document.getElementById('btn_chatbox_close');

		this.chat_socket[this.target].addEventListener("message", async (event) => {
		  let data = JSON.parse(event.data);

		  //========================================//
    	  //================ RECEIVE ===============//
    	  //======= NOTIFICATION FROM SERVER =======//
    	  //========================================//
		  if (data.type === 'chat_available')
		  {
			  this.room_status[this.target] = 'on';
			  console.log(`[CHAT AVAILABLE] you can chat with ${this.target} as they are currently in room.`);
		  }
		  else if (data.type === 'chat_unavailable')
		  {
			  this.room_status[this.target] = 'off';
			  console.log('[CHAT UNAVAILABLE] nobody hears you.');
		  }
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

		//========================================//
    	//================== SEND ================//
    	//============= NOTIFY SERVER ============//
    	//========================================//
		chatbox_close.addEventListener('click', (event) => {
			event.preventDefault();

			if (this.chat_socket[this.target].readyState === WebSocket.OPEN)
			{
				this.chat_socket[this.target].send(JSON.stringify({
				  'message': null,
				  'sender': this.sender,
				  'room_name': this.room_name,
				  'type': 'chat_close',
				}));
				input.value = '';
			}
			this.chat_socket[this.target].close();
			this.room_status[this.target] = 'off';
		});

		//========================================//
    	//================== SEND ================//
    	//================ CHATTING ==============//
    	//========================================//
		send_btn.addEventListener('click', (event) => {
			event.preventDefault();
			let message = input.value;

			if (this.chat_socket[this.target].readyState === WebSocket.OPEN)
			{
				this.chat_socket[this.target].send(JSON.stringify({
				  'message': message,
				  'sender': this.sender,
				  'room_name': this.room_name,
				  'type': 'chat_reply',
				}));
				input.value = '';
			}
			else if (this.chat_socket[this.target].readyState === WebSocket.CONNECTING)
				console.log("message is not sent. chat socket is waiting for an open connection.");
			else if (this.chat_socket[this.target].readState >= 2)
				console.error("message will not be sent. chat socket connection closed or closing.");
		});

		return true;
	}

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
