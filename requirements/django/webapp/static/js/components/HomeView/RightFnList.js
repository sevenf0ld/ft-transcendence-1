// file : LeftUser.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//import ModalFnOpt from './ModalFnOpt.js';
//import ModalAdd from './ModalAdd.js';
	//	// --- [05] RENDER
import ModalLayout from '../../layouts/ModalLayout.js';
import * as FETCH from './RightFnList_fetch.js';
import ModalFnOpt from './ModalFnOpt.js';
import BOT_CHATBOX from './BotChatBox.js';
import MODAL_ADD_FRIEND from './ModalAdd.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// --- [LOCAL] EXPORTED COMPO
// usage : insert querySelector's value of an element
// 		   to register as export element; first one
// 		   is always default
const getEle = [
];

// --- [LOCAL] BUTTONS SECTION
// button tracker class
class button
{
	constructor()
	{
		this.arr = {
			'add-friend': '',
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

// HTML ELEMENTS
function html_title()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<h1 class="%title-c">%title-t</h1>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%title-c': 'friend-top-title',
		'%title-t': 'Friends',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}

async function html_friendList()
{
	// [-] HELPER FUNCTION
	function friend_generate(name, stat, type)
	{
		let template = `
		<div class="%friend-c" title="%name-t" data-type="%type">
			<div class="%pfpctn-c">
				<img class="%pfp-c" src="%pfp-src" alt="%pfp-alt"></img>
				<div class="%status-c"></div>
			</div>
			<h2 class="%name-c">%name-t</h2>
			<img @att1 @att2 @att3 @att4 @att5></img>
		</div>
		`

		const attributes =
		{
			'%friend-c': 'fnl-item-ctn',
			'%name-t': name,
			'%type': type,
			'%pfpctn-c': 'fnl-item-pfp-ctn',
			'%pfp-c': `fnl-item-pfp`,
			'%status-c': `fnl-item-status ${stat}`,
			'%pfp-src': '/static/assets/images/default-pfp.png',
			'%pfp-alt': 'profile picture',
			'%name-c': `fnl-item-name ${stat} truncate`,
			'%set-c': 'fnl-item-settings',
			'%set-src': '/static/assets/images/settings.svg',
			'%set-alt': 'settings',
			'@att1': 'class="fnl-item-settings"',
			'@att2': 'src="/static/assets/images/settings.svg"',
			'@att3': 'alt="settings"',
			'@att4': 'data-bs-toggle="modal"',
			'@att5': 'data-bs-target="#modal-fnOpt"',
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		return template;
	};

	// [A] TEMPLATE
	/*=================================================================*/
	// api (url to fetch): /api/friends/friend-list-av/retrieve/
	// required body: `user: <username>`
	// return value: {"user":"what","friends":["when"],"num_of_friends":1,"blocked":[],"num_of_blocked":0,"outgoing":["temp"],"num_of_outgoing":1,"incoming":["fake"],"num_of_incoming":1}
	/*=================================================================*/
	const flistFetch = new FETCH.fetch_friendList();
	const fresult = await flistFetch.fetchData();
	async function fetch_friend_list(type)
	{
		let template = '';
		if (fresult === 'fetch-success')
		{
			const data = flistFetch.fetch_obj.rdata;
			const friends = data['friends'];
			const blocked = data['blocked'];
			const outgoing = data['outgoing'];
			const incoming = data['incoming'];
			if (type === 'added')
			{
				if (friends.length === 0)
					template += '<p class="%empty-c">%empty-t</p>';
				for (const friend of friends)
					template += friend_generate(friend, 'online', 'added');
			}
			else if (type === 'pending')
			{
				if (outgoing.length === 0 && incoming.length === 0)
					template += '<p class="%empty-c">%empty-t</p>';
				for (const friend of outgoing)
					template += friend_generate(friend, 'pending', 'request-out');
				for (const friend of incoming)
					template += friend_generate(friend, 'pending', 'request-in');
			}
			else if (type === 'blocked')
			{
				if (blocked.length === 0)
					template += '<p class="%empty-c">%empty-t</p>';
				for (const friend of blocked)
					template += friend_generate(friend, 'blocked', 'blocked');
			}
			return template;
		}
		template = '<p>Failed to fetch friend list</p>';
		return template;
	}

	const friend_list = await fetch_friend_list('added');
	const friend_pending = await fetch_friend_list('pending');
	const friend_blocked = await fetch_friend_list('blocked');

	let template = `
	<div class="%friend-list-c">
		<div class="%flist-c">
			<div class="%flist-title-ctn" data-title="added">
				<h3 class="%flist-title-c">Added</h3>
				<div class="%flist-title-sym-c">-</div>
			</div>
			<div class="%flAdd-c">
				${friend_list}
			</div>
		</div>
		<div class="%flist-c">
			<div class="%flist-title-ctn" data-title="pending">
				<h3 class="%flist-title-c">Pending</h3>
				<div class="%flist-title-sym-c">-</div>
			</div>
			<div class="%flPending-c">
				${friend_pending}
			</div>
		</div>
		<div class="%flist-c">
			<div class="%flist-title-ctn" data-title="blocked">
				<h3 class="%flist-title-c">Blocked</h3>
				<div class="%flist-title-sym-c">-</div>
			</div>
			<div class="%flBlocked-c">
				${friend_blocked}
			</div>
		</div>
	</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%friend-list-c': 'list-ctn d-flex flex-column',
		'%flist-c': 'category-ctn',
		'%flist-title-ctn': 'category-title-ctn',
		'%flist-title-sym-c': 'category-title-sym',
		'%flist-title-c': 'category-title',
		'%flAdd-c': 'category-list-ctn',
		'%flPending-c': 'category-list-ctn',
		'%flBlocked-c': 'category-list-ctn',
		'%empty-c': 'empty-list',
		'%empty-t': '(Empty)',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}

function html_addbtn()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<button @att1 @att2 @att3 @att4>@att5</button>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'@att1': 'id="btn_add_friend"',
		'@att2': 'class="ct-btn-neau"',
		'@att3': 'data-bs-toggle="modal"',
		'@att4': 'data-bs-target="#modal-addFriend"',
		'@att5': 'Add Friend',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['add-friend'] = 'btn_add_friend';

	// [D] HTML RETURN
	return template;
}

const ele =
{
	html_title,
	html_friendList,
	html_addbtn,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class rightPanelFriends
{
	// --- [00] CONSTRUCTOR
	constructor(container)
	{
		this.container = container;
		this.components = {};
	}

	// --- [01] GETTER
	async get(element = 'default')
	{
		if (this.read_components() === false)
		{
			throw new Error(`[ERR] this class has no export components`);
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
		template = "<div class='friend-list-main'>";
		template += ele.html_title();
		template += await ele.html_friendList();
		template += ele.html_addbtn();
		template += "</div>";

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	// --- [04] EVENT
	async expandFriendList(event)
	{
		const title_bar = document.querySelectorAll(
			'.category-title-ctn'
		);

		for (const title of title_bar)
		{
			const window = title.nextElementSibling;
			const symbol = title.querySelector('.category-title-sym');
			title.addEventListener(
				'click', () =>
				{
					if (window.style.display === 'none')
					{
						window.style.display = 'block';
						symbol.innerHTML = '-';
					}
					else
					{
						window.style.display = 'none';
						symbol.innerHTML = '+';
					}
				}
			);
		}

		return true;
	}

	async addFriendClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : add friend');

		//for popup modal
		const moda = document.querySelector('#modal-addFriend .modal-title');
		moda.innerHTML = 'Add Friend';
		const modata = document.querySelector('#modal-addFriend .modal-body');
		modata.innerHTML = "";

		MODAL_ADD_FRIEND.container = modata;
		await MODAL_ADD_FRIEND.render('replace');

		return true;
	}
	
	async friendOptionsClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : friend options');

		//temporary
		// get name and type
		const name = event.target.parentElement.querySelector('.fnl-item-name').innerHTML;
		const type = event.target.parentElement.getAttribute('data-type');

		// set modal title
		const moda_title = document.querySelector('#modal-fnOpt .modal-title');
		moda_title.innerHTML = `${name}`;

		// set modal body
		const moda_body = document.querySelector('#modal-fnOpt .modal-body');
		const modaFriendOpt = new ModalFnOpt(moda_body, type, name);
		await modaFriendOpt.render();

		return true;
	}

	async reset_midBotPanel(type)
	{
		const default_div = `<p class="ct-bottom-placeholder">(placeholder)</p>`;
		const bot_right_panel = document.querySelector('.ct-bottom-right');
		const bot_left_panel = document.querySelector('.ct-bottom-left');
		
		if (type === 1)
		{
			bot_right_panel.innerHTML = default_div;
			bot_left_panel.innerHTML = default_div;
		}
		else if (type === 2)
			bot_right_panel.innerHTML = default_div;
		else if (type === 3)
			bot_left_panel.innerHTML = default_div;

		return true;
	}

	async friendPopupClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] friend-list clicked : friend popup');

		//temporary
		// get name and type
		const name_div = event.target.closest('.fnl-item-ctn');
		const name = name_div.querySelector('.fnl-item-name').innerHTML;
		const type = name_div.getAttribute('data-type');
		const parent_div = document.querySelector('.ct-bottom-right');

		if (type === 'added')
		{
			await this.reset_midBotPanel(1);
			BOT_CHATBOX.container = parent_div;
			BOT_CHATBOX.target = name;
			await BOT_CHATBOX.render('replace');
		}

		return true;
	}


	async bind_events()
	{
		await btns.read_buttons();

		await this.expandFriendList();

		btns.arr['add-friend'].addEventListener(
			'click', async (e) => {await this.addFriendClick(e);}
		);

		const friend_items_settings = document.querySelectorAll('.fnl-item-settings');
		for (const item of friend_items_settings)
		{
			item.addEventListener(
				'click', async (e) => {await this.friendOptionsClick(e);}
			);
		}

		const friend_list = document.querySelectorAll('.fnl-item-name');
		for (const item of friend_list)
		{
			item.addEventListener(
				'click', async (e) => {await this.friendPopupClick(e);}
			);
		}

		return true;
	}

	// --- [01] RENDER
	async modals_render()
	{
		let parent_html;

		parent_html = this.container;

		const modal1 = new ModalLayout(
			parent_html, "modal-addFriend", "Add Friend"
		);
		await modal1.render()

		const modal2 = new ModalLayout(
			parent_html, "modal-fnOpt", "Friend Options"
		);
		await modal2.render()

		return true;
	}

	async render()
	{
		const template = await this.init_template();

		this.container.innerHTML = '';
		this.container.innerHTML = template;

		await this.bind_events();
		await this.modals_render();

		return true;
	}
}
