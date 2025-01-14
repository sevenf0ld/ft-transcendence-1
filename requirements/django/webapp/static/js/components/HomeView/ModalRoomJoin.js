// file : ModalRoomJoin.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import GAME_ROOM_VIEW from '../../views/GameRoomView.js';
import WEB_SOCKET from '../../core/websocket_mng.js';
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
class ModalRoomJoin
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
			'create': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.gameType = null;
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
		this.main_ctn = document.querySelector('.join-room-main');
		this.buttons['create'] = document.getElementById('btn_create_room');
		this.buttons['close'] = document.getElementById('btn_close_join_room_modal');

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

		this.buttons['create'].addEventListener(
			'click', async (event) => {await this.createClick(event);}
		);

		await this.roomListClick();

		this.buttons['close'].addEventListener(
			'click', async (event) => {await this.closeClick(event);}
		);

		return true;
	}

	async createClick(event)
	{
		event.preventDefault();
    
		console.log('[EVENT] button clicked : create');

		if (this.gameType === 'online-pvp')
		{
			await WEB_SOCKET.closeSocket_liveChat();
			await WEB_SOCKET.updateSocket_friendList('join');

			const room_created = await this.fetch_create_game_room('PVP');
			if (room_created)
			{
				await LOADING.loading_page('show');
				const gameRoom = GAME_ROOM_VIEW;
				await gameRoom.init();
				gameRoom.type = 'online-pvp';
				await gameRoom.render();
				await WEB_SOCKET.listenSocket_game();
				await LANGUAGE.updateContent("game-room");
				await new Promise((resolve) => setTimeout(resolve, 1000));
				await LOADING.loading_page('hide');
			}
		}
		else if (this.gameType === 'online-tour')
		{
			await WEB_SOCKET.closeSocket_liveChat();
			await WEB_SOCKET.updateSocket_friendList('join');

			const room_created = await this.fetch_create_game_room('TNM');
			if (room_created)
			{
				const gameRoom = GAME_ROOM_VIEW;
				await gameRoom.init();
				gameRoom.type = 'online-tour';
				await gameRoom.render();
				await WEB_SOCKET.listenSocket_game();
				await LANGUAGE.updateContent("game-room");
			}
		}

		return true;
	}

	async closeClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked : go back');

		await WEB_SOCKET.closeSocket_lobby();

		return true;
	}

	async roomListClick()
	{
		const btns = document.querySelectorAll(
			'.join-room-main .room-board-list'
		);
		for (const btn of btns)
		{
			btn.addEventListener('click', async (e) =>
			{
				// when changed to event, roomid has an error
				e.preventDefault();

				const roomid = e.currentTarget.getAttribute('data-roomid');
				const host = e.currentTarget.querySelector('.rbl-name').textContent;
				let slot = e.currentTarget.querySelector('.rbl-slot').textContent;
				//remove (2/2) to [2,2]
				slot = slot.replace('(', '');
				slot = slot.replace(')', '');
				let slot_arr = slot.split('/');
				slot_arr = slot_arr.map(Number);
				if (slot_arr[0] === slot_arr[1])
				{
					alert('Room is full! Cannot join.');
					return;
				}

				const rj_confirm = confirm(`Join room created by ${host}? (ID : ${roomid})`);
				if (!rj_confirm)
					return;

				//close modal
				const modal = document.getElementById('modal-join');
				const modal_bs = bootstrap.Modal.getInstance(modal);
				if (modal_bs)
					modal_bs.hide();

				await WEB_SOCKET.closeSocket_liveChat();
				await WEB_SOCKET.updateSocket_friendList('join');
				await WEB_SOCKET.connectSocket_game(roomid);

				const data_room_type = document.querySelector('.join-room-main').parentNode.dataset.roomType;

				const gameRoom = GAME_ROOM_VIEW;
				await gameRoom.init();
				gameRoom.type = `online-${data_room_type}`;
				await gameRoom.render();
				await LANGUAGE.updateContent("game-room");
				await WEB_SOCKET.listenSocket_game();
			});
		}

		return true;
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	async fetch_create_game_room(room_type)
	{
		await CR_FETCH.init();
		await CR_FETCH.fetchData(room_type);
		if (CR_FETCH.re_value === 'game-room-creation-successful')
		{
			await WEB_SOCKET.updateSocket_lobbyCreate();

			const room_id = CR_FETCH.fetch_obj.rdata.room_id;

			await WEB_SOCKET.initSocket_game();
			await WEB_SOCKET.connectSocket_game(room_id);

			return room_id;
		}
		else if (CR_FETCH.fetch_obj.re_value === 'game-room-creation-failed')
		{
			alert(`Failed to create ${room_type} game room.`);

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
		// [A] TEMPLATE
		const display_board = await this.room_display_board();
		let template = `
		<div class="%main-1c %main-2c">
			${display_board}
			<p class="%des-1c">%des-1t</p>
			<button id="%btn-id" @att1>%btn-t</button>
			<button @att2>Go Back</button>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-1c': 'join-room-main h-100 w-100 d-flex',
			'%main-2c': 'flex-column justify-content-center align-items-center',
			'%rdb-c': 'room-board d-flex flex-column',
			'%rdttl-c': 'list-title-gp d-flex',
			'%rdtt-status-c': 'rdtt-status',
			'%rdtt-status-t': 'Status',
			'%rdtt-roomid-c': 'rdtt-roomid',
			'%rdtt-roomid-t': 'ID',
			'%rdtt-slot-c': 'rdtt-slot',
			'%rdtt-slot-t': 'Slot',
			'%rdtt-name-c': 'rdtt-name',
			'%rdtt-name-t': 'Host',
			'%rdbl-c': 'room-board-list-group d-flex flex-column',
			'%rdbl-id': 'room_list_board',
			'%list-c': 'room-board-list',
			'%st-c': 'rbl-status',
			'%st-dt': 'online',
			'%romid-c': 'rbl-roomid',
			'%romid-t': '77384',
			'%romslot-c': 'rbl-slot',
			'%romslot-t': '(2/4)',
			'%nam-c': 'rbl-name truncate',
			'@att1': 'data-bs-toggle="tooltip" title="killerhunter789"',
			'%nam-t': 'killerhunter789',
			'%des-1c': 'join-room-des',
			'%des-1t': 'Click to join room, or',
			'%btn-id': 'btn_create_room',
			'@att1': 'data-bs-dismiss="modal"',
			'%btn-t': 'Create Room',
			'@att2': 'id="btn_close_join_room_modal" class="btn-close" data-bs-dismiss="modal"',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async room_display_board()
	{
		/*
		const template = `
			<div class="%rdb-c">
				<div class="%rdttl-c">
					<div class="%rdtt-status-c">%rdtt-status-t</div>
					<div class="%rdtt-roomid-c">%rdtt-roomid-t</div>
					<div class="%rdtt-slot-c">%rdtt-slot-t</div>
					<div class="%rdtt-name-c">%rdtt-name-t</div>
				</div>
				<div class="%rdbl-c" id="%rdbl-id">
					<div class="%list-c" data-roomid="%romid-t">
						<div class="%st-c" data-status="%st-dt"></div>
						<div class="%romid-c">%romid-t</div>
						<div class="%romslot-c">%romslot-t</div>
						<div class="%nam-c" @att1>%nam-t</div>
					</div>
				</div>
			</div>
		`;
		*/
		const template = `
			<div class="%rdb-c">
				<div class="%rdttl-c">
					<div class="%rdtt-status-c">%rdtt-status-t</div>
					<div class="%rdtt-roomid-c">%rdtt-roomid-t</div>
					<div class="%rdtt-slot-c">%rdtt-slot-t</div>
					<div class="%rdtt-name-c">%rdtt-name-t</div>
				</div>
				<div class="%rdbl-c" id="%rdbl-id"></div>
			</div>
		`;
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

const item = new ModalRoomJoin();
export default item;
