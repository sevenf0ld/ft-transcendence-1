// file : MidBoard.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import MODAL_ROOM_JOIN from './ModalRoomJoin.js';
import MODAL_LAYOUT from '../../layouts/ModalLayout.js';
import GAME_ROOM_VIEW from '../../views/GameRoomView.js';
import WEB_SOCKET from '../../core/websocket_mng.js';
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
class MidBoard
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
			'local-pvp': '',
			'local-pve': '',
			'local-tour': '',
			'remote-pvp': '',
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
		this.main_ctn = document.querySelector('.ct-board-home');
		this.buttons['local-pvp'] = document.getElementById('btn_local_pvp');
		this.buttons['local-pve'] = document.getElementById('btn_local_pve');
		this.buttons['local-tour'] = document.getElementById('btn_local_tour');
		this.buttons['remote-pvp'] = document.getElementById('btn_remote_pvp');

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
		this.buttons['local-pvp'].addEventListener(
			'click', async (event) => { await this.localPvpClick(event); }
		);

		this.buttons['local-pve'].addEventListener(
			'click', async (event) => { await this.localPveClick(event); }
		);

		this.buttons['local-tour'].addEventListener(
			'click', async (event) => { await this.localTourClick(event); }
		);

		this.buttons['remote-pvp'].addEventListener(
			'click', async (event) => { await this.remotePvpClick(event); }
		);

		await this.set_titles();

		return true;
	}

	async localPveClick(event)
	{
		event.preventDefault();
		console.log('[BTN] localPveClick');

		await WEB_SOCKET.closeSocket_liveChat();
		await WEB_SOCKET.updateSocket_friendList('join');

		await LOADING.loading_page('show');
		const gameRoom = GAME_ROOM_VIEW;
		await gameRoom.init();
		gameRoom.type = 'local-pve';
		await gameRoom.render();
		await LANGUAGE.updateContent("game-room");
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await LOADING.loading_page('hide');

		return true;
	}

	async localPvpClick(event)
	{
		event.preventDefault();
		console.log('[BTN] localPvpClick');

		await WEB_SOCKET.closeSocket_liveChat();
		await WEB_SOCKET.updateSocket_friendList('join');

		await LOADING.loading_page('show');
		const gameRoom = GAME_ROOM_VIEW;
		await gameRoom.init();
		gameRoom.type = 'local-pvp';
		await gameRoom.render();
		await LANGUAGE.updateContent("game-room");
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await LOADING.loading_page('hide');

		return true;
	}

	async localTourClick(event)
	{
		event.preventDefault();
		console.log('[BTN] localTourClick');

		await WEB_SOCKET.closeSocket_liveChat();
		await WEB_SOCKET.updateSocket_friendList('join');

		await LOADING.loading_page('show');
		const gameRoom = GAME_ROOM_VIEW;
		await gameRoom.init();
		gameRoom.type = 'local-tour';
		await gameRoom.render();
		await LANGUAGE.updateContent("game-room");
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await LOADING.loading_page('hide');

		return true;
	}

	async remotePvpClick(event)
	{
		event.preventDefault();
		console.log('[BTN] remotePvpClick');

		// for popup modal
		const moda = document.querySelector('#modal-join .modal-title');
		moda.innerHTML = 'Available Rooms (PVP)';
		const modata = document.querySelector('#modal-join .modal-body');
		modata.setAttribute('data-room-type', 'pvp');
		modata.innerHTML = "";

		MODAL_ROOM_JOIN.container = modata;
		MODAL_ROOM_JOIN.gameType = 'online-pvp';
		await MODAL_ROOM_JOIN.render('replace');
		await LANGUAGE.updateContent("modal-roomjoin");

		// list room list
		await WEB_SOCKET.initSocket_lobby();
		await WEB_SOCKET.connectSocket_lobby('PVP');
		await this.display_lobby_socket_list();

		return true;
	}

	async set_titles()
	{
		const title = document.querySelector('.ct-top-title');
		title.innerHTML = 'Game Mode';

		return true;
	}

	async display_lobby_socket_list()
	{
		const dis_div = document.getElementById('room_list_board');
		dis_div.innerHTML = "";

		await WEB_SOCKET.listenSocket_lobby();

		return true;
	}

	async render_room_list(rooms_data)
	{
		const dis_div = document.getElementById('room_list_board');
		if (!dis_div)
			return false;
		dis_div.innerHTML = "";

		if (typeof rooms_data !== 'object')
			return false;
		else
		{
			for (const room of rooms_data)
				await this.room_list_item_generator(dis_div, room);
		}

		await MODAL_ROOM_JOIN.roomListClick();
    
		return true;
	}

	async room_list_item_generator(display, room)
	{
		const started = room.started ? 'playing' : 'online';
		const cur_mem = `(${room.members}/`;
		let slot = room.room_type === 'PVP' ? `2)` : `-1)`;
		slot = room.room_type === 'TNM' ? slot = `5)` : slot;
		slot = cur_mem + slot;

		let template = `
		<div class="%list-c" data-roomid="%romid-t">
			<div class="%st-c" data-status="%st-dt"></div>
			<div class="%romid-c">%romid-t</div>
			<div class="%romslot-c">%romslot-t</div>
			<div class="%nam-c" @att1>%nam-t</div>
		</div>
		`;

		const atts =
		{
			'%list-c': 'room-board-list',
			'%st-c': 'rbl-status',
			'%st-dt': `${started}`,
			'%romid-c': 'rbl-roomid',
			'%romid-t': `${room.room_id}`,
			//'@bs-dt1': '',
			'%romslot-c': 'rbl-slot',
			'%romslot-t': `${slot}`,
			'%nam-c': 'rbl-name truncate',
			'@att1': `data-bs-toggle="tooltip" title="${room.host}"`,
			'%nam-t': `${room.host}`,
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		display.insertAdjacentHTML('beforeend', template);

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
		let template = `
		<div class="%main-1c %main-2c">
			<div class="%sec-1c %sec-2c">
				<h3 @lang1>Online</h3>
				<div class="%bg-c">
					<button id="%btn4-d" @att1 @att2>%btn4-t</button>
				</div>
			</div>
			<div class="%sec-1c %sec-2c">
				<h3 @lang2>Local</h3>
				<div class="%bg-c">
					<button id="%btn1-d" @att1>%btn1-t</button>
					<button id="%btn2-d" @att1>%btn2-t</button>
					<button id="%btn3-d" @att1>%btn3-t</button>
				</div>
			</div>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-1c': 'ct-board-home h-100 d-flex',
			'%main-2c': 'flex-column justify-content-around',
			'%sec-1c': 'ct-home-section d-flex flex-column',
			'%sec-2c': 'justify-content-center align-items-center',
			'%bg-c': 'ct-section-btns d-flex',
			'%btn1-d': 'btn_local_pve',
			'%btn2-d': 'btn_local_pvp',
			'%btn3-d': 'btn_local_tour',
			'%btn4-d': 'btn_remote_pvp',
			'@att1': 'class="ct-btn-neau"',
			'@att2': 'data-bs-toggle="modal" data-bs-target="#modal-join"',
			'%btn1-t': 'PVE',
			'%btn2-t': 'PVP',
			'%btn3-t': 'Tournament',
			'%btn4-t': 'PVP',
			'@lang1': 'data-i18n="online"',
			'@lang2': 'data-i18n="local"',
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
		let parent_html;

		parent_html = document.querySelector('.ct-mpanel-top');
		const modal1 = MODAL_LAYOUT;
		modal1.container = parent_html;
		modal1.name = 'modal-join';
		modal1.title = 'Available Rooms (PVP)';
		await modal1.render('append', 'static');

		return true;
	}
}

const item = new MidBoard();
export default item;
