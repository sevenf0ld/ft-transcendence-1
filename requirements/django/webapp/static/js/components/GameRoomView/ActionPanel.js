// file : ActionPanel.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import PONG_ENGINE from '../GameLogic/PongEngine.js';
import MODAL_LAYOUT from '../../layouts/ModalLayout.js';
import TNM_LOGIC from '../GameLogic/tnm_logic.js';
import EG_UTILS from '../GameLogic/engine_utils.js';
import WEBSOCKET from '../../core/websocket_mng.js';
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
class ActionPanel
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		// COMMON-atts
		this.container = null;
		this.base_ctn = null;
		this.main_ctn = null;
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.gameType = null;
		this.currentGame = null;
	}

	async init()
	{
		// COMMON-atts
		this.container = null;
		this.base_ctn = null;
		this.main_ctn = null;
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.gameType = null;
		this.currentGame = null;
		return true;
	}

	async render()
	{
		await this.baseLayour_render('replace');
		this.base_ctn = this.container.querySelector('.ct-gr-actpanel-ctn');

		switch (this.gameType)
		{
			case 'local-pvp':
				await this.localPvp_render('replace');
				break;
			case 'local-tour':
				await this.localTour_render('replace');
				break;
			case 'local-pve':
				await this.localPve_render('replace');
				break;
			case 'online-pvp':
				await this.onlinePvp_render('replace');
				break;
			default:
				break;
		}

		return true;
	}

	// ======================================================================== //
	// SHARED-LAYOUT-BASE
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async baseLayour_render(renderType)
	{
		const template = await this.init_template_base();

		if (renderType.toLowerCase() === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_base();
		await this.bind_events_base();
		await this.bind_modals_base();

		return true;
	}

	async push_important_elements_base()
	{
		return true;
	}

	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_base()
	{
		return true;
	}

	async btn_manage(btn, type)
	{
		if (type === 'disable')	
		{
			btn.disabled = true;
			btn.classList.add('d-none');
		}
		else if (type === 'enable')
		{
			btn.disabled = false;
			btn.classList.remove('d-none');
		}
		else
		{
			throw new Error('invalid type');
		}
		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_base()
	{
		let template = "";
		template += await this.html_main_ctn_base();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_base()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c1"></div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-gr-actpanel-ctn',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED 
	// --------------------------------------------- //
	async bind_modals_base()
	{
		return true;
	}

	// ======================================================================== //
	// LOCAL-PVP
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async localPvp_render(renderType)
	{
		const template = await this.init_template_lpvp();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_lpvp();
		await this.bind_events_lpvp();
		await this.bind_modals_lpvp();

		return true;
	}

	async push_important_elements_lpvp()
	{
		this.buttons['start'] = this.base_ctn.querySelector('#btn_lpvp_start');
		this.buttons['reset'] = this.base_ctn.querySelector('#btn_lpvp_restart');

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_lpvp()
	{
		this.buttons['start'].addEventListener(
			'click', async (event) => { await this.lpvp_start_click(event); }
		);

		this.buttons['reset'].addEventListener(
			'click', async (event) => { await this.lpvp_restart_click(event); }
		);

		return true;
	}

	async lpvp_start_click(event)
	{
		event.preventDefault();

		const pongGame = PONG_ENGINE;
		pongGame.gameType = this.gameType;
		await pongGame.init();
		this.currentGame = pongGame;

		return true;
	}

	async lpvp_restart_click(event)
	{
		event.preventDefault();
		
		if (this.currentGame)
			await this.currentGame.reset('lpvp');
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	async init_template_lpvp()
	{
		let template = "";
		template += await this.html_main_ctn_lpvp();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_lpvp()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
			<button @att1 @att2 @att3 @lang1>@text1</button>
			<button @att4 @att5 @att6 @lang2>@text2</button>
		`;
		// [B] SET atts
		const atts =
		{
			'@att1': 'id="btn_lpvp_start"',
			'@att2': 'class="btn-lpvp-start ct-btn-neau"',
			'@att3': 'type="button"',
			'@text1': 'Start',
			'@att4': 'id="btn_lpvp_restart"',
			'@att5': 'class="btn-lpvp-restart ct-btn-neau d-none"',
			'@att6': 'type="button"',
			'@text2': 'Restart Game',
			'@lang1': 'data-i18n="btn_start"',
			'@lang2': 'data-i18n="btn_restart"',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_lpvp()
	{
		return true;
	}

	// ======================================================================== //
	// LOCAL-TOUR
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async localTour_render(renderType)
	{
		const template = await this.init_template_ltour();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_ltour();
		await this.bind_events_ltour();
		await this.bind_modals_ltour();

		return true;
	}

	async push_important_elements_ltour()
	{
		this.buttons['start'] = this.base_ctn.querySelector('#btn_ltour_start');
		this.buttons['add'] = this.base_ctn.querySelector('#btn_ltour_add');

		for (const key in this.buttons)
			if (!this.buttons[key])
				throw new Error(`this.buttons[${key}] is null`);

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_ltour()
	{
		this.buttons['start'].addEventListener(
			'click', async (event) => { await this.ltour_start_click(event); }
		);

		this.buttons['add'].addEventListener(
			'click', async (event) => { await this.ltour_add_click(event); }
		);

		this.buttons['start'].disabled = true;

		return true;
	}

	async all_btns_mng(statement)
	{
		if (statement === 'disable')
		{
			for (const key in this.buttons)
				this.buttons[key].disabled = true;

			const leave_room = document.querySelector('#btn_leaveRoom');
			leave_room.disabled = true;
		}
		else if (statement === 'enable')
		{
			for (const key in this.buttons)
				this.buttons[key].disabled = false;

			const leave_room = document.querySelector('#btn_leaveRoom');
			leave_room.disabled = false;
		}

		return true;
	}

	async ltour_start_click(event)
	{
		event.preventDefault();
		console.log('[BTN] ltour_start_click');

		await this.all_btns_mng('disable');

		// game engine
		const pongGame = PONG_ENGINE;
		pongGame.gameType = this.gameType;
		await pongGame.init();
		this.currentGame = pongGame;

		return true;
	}

	async ltour_add_click(event)
	{
		event.preventDefault();
		console.log('[BTN] ltour_add_click');
		await this.render_modal_ltour_add();

		return true;
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_ltour()
	{
		let template = "";
		template += await this.html_main_ctn_ltour();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_ltour()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<button @att01 @att02 @att03 @lang1>@text01</button>
		<button @att07 @att08 @att09 @lang2>@text03</button>
		`;
		// [B] SET atts
		const atts =
		{
			'@att01': 'id="btn_ltour_start"',
			'@att02': 'class="btn-ltour-start ct-btn-neau"',
			'@att03': 'type="button"',
			'@text01': 'Start',
			'@att07': 'id="btn_ltour_add"',
			'@att08': 'class="btn-ltour-add ct-btn-neau"',
			'@att09': 'type="button" data-bs-toggle="modal" data-bs-target="#modal-ltour-add"',
			'@text03': 'Add Player',
			'@lang1': 'data-i18n="btn_start"',
			'@lang2': 'data-i18n="btn_add"',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_ltour()
	{
		let parent_html;

		parent_html = document.querySelector('.ct-gr-actpanel-ctn');
		if (!parent_html)
			throw new Error('parent_html is null');
		const modal1 = MODAL_LAYOUT;
		modal1.container = parent_html;
		modal1.name = 'modal-ltour-add';
		modal1.title = 'Add Player';
		await modal1.render('append');

		return true;
	}

	async render_modal_ltour_add()
	{
		const body = document.querySelector('#modal-ltour-add .modal-body');
		let template = `
		<form id="form_ltour_add" class="form-ltour-add">
			<h1>set player alias</h1>
			<input id="input_ltour_add" 
			type="text" class="ct-home-input"
			placeholder="player alias" 
			autocomplete="off" 
			required maxlength="10">
			<button 
			id="btn_ltour_add_submit"
			type="submit" data-bs-dismiss="modal"
			>Submit</button>
		</form>
		`;

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		body.innerHTML = template;
		await this.bind_buttons_ltour_events();

		return true;
	}

	async bind_buttons_ltour_events()
	{
		//only alnum
		const input = document.querySelector('#input_ltour_add');
		input.addEventListener(
			'input', (event) => {
				const value = event.target.value;
				event.target.value = value.replace(/[^a-zA-Z0-9-_]/g, '');
				event.target.value = event.target.value.toLowerCase();
			}
		);
		input.focus();
		
		const btn = document.querySelector('#btn_ltour_add_submit');
		btn.addEventListener(
			'click', async (event) => {
				event.preventDefault();
				console.log('[BTN] btn_ltour_add_submit');

				if (!input.value)
				{
					alert('add failed! input is empty');
					return false;
				}
				const str = input.value;
				await TNM_LOGIC.add_player(str);
				if (TNM_LOGIC.lobby.length >= TNM_LOGIC.min_players)
					this.buttons['start'].disabled = false;
				if (TNM_LOGIC.lobby.length >= TNM_LOGIC.max_players)
					this.buttons['add'].disabled = true;
			}
		);
	}

	// ======================================================================== //
	// LOCAL-PVE
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION (LOCAL-PVE)
	// --------------------------------------------- //
	async localPve_render(renderType)
	{
		const template = await this.init_template_lpve();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_lpve();
		await this.bind_events_lpve();
		await this.bind_modals_lpve();

		return true;
	}

	async push_important_elements_lpve()
	{
		this.buttons['start'] = this.base_ctn.querySelector('#btn_lpve_start');

		for (const key in this.buttons)
			if (!this.buttons[key])
				throw new Error(`this.buttons[${key}] is null`);

		return true;
	}

	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_lpve()
	{
		this.buttons['start'].addEventListener(
			'click', async (event) => { await this.lpve_start_click(event); }
		);

		return true;
	}

	async lpve_start_click(event)
	{
		event.preventDefault();
		console.log('[BTN] ltour_start_click');

		await this.all_btns_mng('disable');

		// game engine
		const pongGame = PONG_ENGINE;
		pongGame.gameType = this.gameType;
		await pongGame.init();
		this.currentGame = pongGame;

		return true;
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_lpve()
	{
		let template = "";
		template += await this.html_main_ctn_lpve();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_lpve()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<button @att1 @att2 @att3 @lang1>@text1</button>
		<button @att4 @att5 @att6 @lang2>@text2</button>
		`;
		// [B] SET atts
		const atts =
		{
			'@att1': 'id="btn_lpve_start"',
			'@att2': 'class="btn-lpve-start ct-btn-neau"',
			'@att3': 'type="button"',
			'@text1': 'Start',
			'@att4': 'id="btn_lpve_restart"',
			'@att5': 'class="btn-lpve-restart ct-btn-neau d-none"',
			'@att6': 'type="button"',
			'@text2': 'Restart Game',
			'@lang1': 'data-i18n="btn_start"',
			'@lang2': 'data-i18n="btn_restart"',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_lpve()
	{
		return true;
	}

	// ======================================================================== //
	// ONLINE-PVP
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async onlinePvp_render(renderType)
	{
		const template = await this.init_template_opvp();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_opvp();
		await this.bind_events_opvp();
		await this.bind_modals_opvp();

		return true;
	}

	async push_important_elements_opvp()
	{
		this.buttons['start'] = this.base_ctn.querySelector('#btn_opvp_start');
		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_opvp()
	{
		this.buttons['start'].addEventListener(
			'click', async (event) => { await this.opvp_start_click(event); }
		);

		return true;
	}

	async opvp_start_click(event)
	{
		event.preventDefault();

		console.log('ONLINE PVP START');
		await WEBSOCKET.updateSocket_gameStart();
		
		// refer to gameboard.js -> opvp_live_update

		return true;
	}

	async opvp_live_update(data)
	{
		const start_btn = document.querySelector('#btn_opvp_start');
		const leave_btn = document.querySelector('#btn_leaveRoom');

		if (data.type === 'joined_room')
		{
			if (!data.is_host)
				start_btn.disabled = true;
			if (data.num < 2)
				start_btn.disabled = true;
			if (data.is_host && data.num === 2)
				start_btn.disabled = false;
		}
		if (data.type === 'left_room')
		{
			if (data.is_host && data.num < 2)
				start_btn.disabled = true;
		}
		if (data.type === 'started_game')
		{
			start_btn.disabled = true;
			leave_btn.disabled = true;
		}

	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_opvp()
	{
		let template = "";
		template += await this.html_main_ctn_opvp();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_opvp()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<button @att1 @att2 @att3 @lang1>@text1</button>
		`;

		// [B] SET atts
		const atts =
		{
			'@att1': 'id="btn_opvp_start"',
			'@att2': 'class="btn-opvp-start ct-btn-neau"',
			'@att3': 'type="button"',
			'@text1': 'Start',
			'@lang1': 'data-i18n="btn_start"',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_opvp()
	{
		return true;
	}
}

const item = new ActionPanel();
export default item;
