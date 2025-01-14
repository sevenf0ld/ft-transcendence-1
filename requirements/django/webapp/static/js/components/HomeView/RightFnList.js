// file : RightFnList.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import FETCH from './RightFnList_fetch.js';
import BOT_CHATBOX from './BotChatBox.js';
import MODAL_ADD_FRIEND from './ModalAdd.js';
import MODAL_FRIEND_OPT from './ModalFnOpt.js';
import MODAL_LAYOUT from '../../layouts/ModalLayout.js';
import LANGUAGE from '../../core/language/language.js';
import HOME from '../../views/HomeView.js';
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
class RightFnList
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
			'add-friend': null,
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
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
		this.buttons['add-friend'] = document.getElementById('btn_add_friend');

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
		await this.expandFriendList();

		this.buttons['add-friend'].addEventListener(
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
		console.log('[BTN] addFriendClick');

		//for popup modal
		const moda = document.querySelector('#modal-addFriend .modal-title');
		moda.innerHTML = 'Add Friend';
		const modata = document.querySelector('#modal-addFriend .modal-body');
		modata.innerHTML = "";

		MODAL_ADD_FRIEND.container = modata;
		await MODAL_ADD_FRIEND.render('replace');
		await LANGUAGE.updateContent('modal-add-fn');

		return true;
	}
	
	async friendOptionsClick(event)
	{
		event.preventDefault();
		console.log('[BTN] friendOptionsClick');

		//temporary
		// get name and type
		const name = event.target.parentElement.querySelector('.fnl-item-name').innerHTML;
		const type = event.target.parentElement.getAttribute('data-type');

		// set modal title
		const moda_title = document.querySelector('#modal-fnOpt .modal-title');
		moda_title.innerHTML = `${name}`;

		// set modal body
		const moda_body = document.querySelector('#modal-fnOpt .modal-body');
		MODAL_FRIEND_OPT.container = moda_body;
		MODAL_FRIEND_OPT.target = name;
		MODAL_FRIEND_OPT.type = type;
		await MODAL_FRIEND_OPT.render('replace');

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
		console.log('[BTN] friendPopupClick');

		//temporary
		// get name and type
		const name_div = event.target.closest('.fnl-item-ctn');
		const name = name_div.querySelector('.fnl-item-name').innerHTML;
		const type = name_div.getAttribute('data-type');
		const parent_div = document.querySelector('.ct-bottom-right');

		if (await this.check_opened_chat(name))
			return false;

		if (type === 'added')
		{
			await this.reset_midBotPanel(1);
			BOT_CHATBOX.container = parent_div;
			BOT_CHATBOX.target = name;
			await BOT_CHATBOX.render('replace');
			await LANGUAGE.updateContent('chatbox-ctn');
		}

		return true;
	}

	async check_opened_chat(name)
	{
		if (document.querySelector('.ct-chatbox-ctn') !== null)
			return true;

		const chatbox = document.querySelector('.ct-chatbox-title');

		if (chatbox === null)
			return false;

		const chatbox_name = chatbox.getAttribute('title');

		if (chatbox_name === name)
			return true;

		return false;
	}

	async update_online_status(username, online_status)
	{
		const selector_str = `.fnl-item-ctn[data-type="added"][title="${username}"] .fnl-item-status`;
		const selector_str1 = `.fnl-item-ctn[data-type="added"][title="${username}"] .fnl-item-name`;
		const friend_item = document.querySelector(selector_str);
		const friend_item1 = document.querySelector(selector_str1);


		if (friend_item === null || friend_item1 === null)
			return false;

		friend_item.classList.remove('online');
		friend_item.classList.remove('offline');
		friend_item.classList.remove('playing');
		friend_item1.classList.remove('online');
		friend_item1.classList.remove('offline');
		friend_item1.classList.remove('playing');

		if (online_status === 'online')
		{
			friend_item.classList.add('online');
			friend_item1.classList.add('online');
		}
		else if (online_status === 'offline')
		{
			friend_item.classList.add('offline');
			friend_item1.classList.add('offline');
		}
		else if (online_status === 'playing')
		{
			friend_item.classList.add('playing');
			friend_item1.classList.add('playing');
		}
		else
			throw new Error(`[ERR] invalid status : ${online_status}`);

		return true;
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
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
		// [A] TEMPLATE
		const str1 = await this.html_title();
		const str2 = await this.html_friendList();
		const str3 = await this.html_addbtn();

		let template = `
		<div class="%main-c1">
			${str1}
			${str2}
			${str3}
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'friend-list-main',
			'%footer-c': 'ct-fn-pfp-footer',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_title()
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

	async  html_friendList()
	{
		// [-] HELPER FUNCTION
		function friend_generate(name, stat, type, imgsrc)
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
			if (imgsrc === undefined)
				throw new Error('[ERR] img-src is undefined');
			//check if a string contains default.
			else if (imgsrc.includes('default'))
				imgsrc = '/static/assets/images/default-pfp.png';

			const attributes =
			{
				'%friend-c': 'fnl-item-ctn',
				'%name-t': name,
				'%type': type,
				'%pfpctn-c': 'fnl-item-pfp-ctn',
				'%pfp-c': `fnl-item-pfp`,
				'%status-c': `fnl-item-status ${stat}`,
				'%pfp-src': imgsrc,
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
		// return value: {
		// "user":"what","friends":["when"],"num_of_friends":1,"blocked":[],
		// "num_of_blocked":0,"outgoing":["temp"],"num_of_outgoing":1,
		// "incoming":["fake"],"num_of_incoming":1}
		/*=================================================================*/

		const flistFetch = FETCH;
		await flistFetch.init();
		const fresult = await flistFetch.fetchData();
		async function fetch_friend_list(type)
		{
			let template = '';
			if (fresult === 'fetch-success')
			{
				const data = flistFetch.fetch_obj.rdata;
				const friends = data['friends'];
				const friends_avatar = data['friends_avatars'];
				const blocked = data['blocked'];
				const blocked_avatar = data['blocked_avatars'];
				const outgoing = data['outgoing'];
				const outgoing_avatar = data['outgoing_avatars'];
				const incoming = data['incoming'];
				const incoming_avatar = data['incoming_avatars'];
				if (type === 'added')
				{
					if (friends.length === 0)
						template += '<p class="%empty-c">%empty-t</p>';
					for (let i = 0; i < friends.length; i++)
					{
						template += friend_generate(
							friends[i], 'offline', 'added', friends_avatar[i]
						);
					}
				}
				else if (type === 'pending')
				{
					if (outgoing.length === 0 && incoming.length === 0)
						template += '<p class="%empty-c">%empty-t</p>';
					for (let i = 0; i < outgoing.length; i++)
					{
						template += friend_generate(
							outgoing[i], 'pending', 'request-out', outgoing_avatar[i]
						);
					}
					for (let i = 0; i < incoming.length; i++)
					{
						template += friend_generate(
							incoming[i], 'pending', 'request-in', incoming_avatar[i]
						);
					}
				}
				else if (type === 'blocked')
				{
					if (blocked.length === 0)
						template += '<p class="%empty-c">%empty-t</p>';
					for (let i = 0; i < blocked.length; i++)
					{
						template += friend_generate(
							blocked[i], 'offline', 'blocked', blocked_avatar[i]
						);
					}
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
					<h3 class="%flist-title-c" @lang1>Added</h3>
					<div class="%flist-title-sym-c">-</div>
				</div>
				<div class="%flAdd-c">
					${friend_list}
				</div>
			</div>
			<div class="%flist-c">
				<div class="%flist-title-ctn" data-title="pending">
					<h3 class="%flist-title-c" @lang2>Pending</h3>
					<div class="%flist-title-sym-c">-</div>
				</div>
				<div class="%flPending-c">
					${friend_pending}
				</div>
			</div>
			<div class="%flist-c">
				<div class="%flist-title-ctn" data-title="blocked">
					<h3 class="%flist-title-c" @lang3>Blocked</h3>
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
			'@lang1': 'data-i18n="fn-added"',
			'@lang2': 'data-i18n="fn-pending"',
			'@lang3': 'data-i18n="fn-blocked"',
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_addbtn()
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

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		let parent_html;

		parent_html = this.container;
		const modal1 = MODAL_LAYOUT;
		modal1.container = parent_html;
		modal1.name = 'modal-addFriend';
		modal1.title = 'Add Friend';
		await modal1.render('append');

		parent_html = this.container;
		const modal2 = MODAL_LAYOUT;
		modal2.container = parent_html;
		modal2.name = 'modal-fnOpt';
		modal2.title = 'Friend Options';
		await modal2.render('append');

		return true;
	}
}

const item = new RightFnList();
export default item;
