// file : LeftUser.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import * as FETCH from './LeftUser_fetch.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import TOKEN from '../../core/token.js';
import MODAL_HISTORY from './ModalHistory.js';
import MODAL_SETTINGS from './ModalSettings.js';
import MODAL_LAYOUT from '../../layouts/ModalLayout.js';
import LOGIN_VIEW from '../../views/LoginView.js';
import WEB_SOCKET from '../../core/websocket_mng.js';
import LOGOUT from '../../core/logout.js';
import ROUTER from '../../core/router.js';
import LANGUAGE from '../../core/language/language.js';
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
class LeftUser
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
			'history': '',
			'settings': '',
			'signout': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		// html_pfp()
		this.home_pfp = '/static/assets/images/default-pfp.png';
		// html_stats()
		this.played = null;
		this.win_rate = null;
		this.wins = null;
		this.losses = null;
	}
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

		this.home_pfp = '/static/assets/images/default-pfp.png';
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
		this.main_ctn = document.querySelector('.ct-left-user-ctn');
		this.buttons['history'] = document.getElementById('btn_history');
		this.buttons['settings'] = document.getElementById('btn_settings');
		this.buttons['signout'] = document.getElementById('btn_logout');

		if (!this.main_ctn)
		{
			/*
			const user = JSON.parse(localStorage.getItem('user'));
			if (!user)
			{
				// this condition is here because this main_ctn is 
				// the first selector of homeview
				// if user token has expired, errors comes to here
				await window.location.reload();
			}
			*/
			throw new Error('[ERR] main container not found');
		}
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
		this.buttons['history'].addEventListener(
			'click', async (event) => { await this.historyClick(event); }
		);

		this.buttons['settings'].addEventListener(
			'click', async (event) => { await this.settingsClick(event); }
		);

		this.buttons['signout'].addEventListener(
			'click', async (event) => { await this.logoutClick(event); }
		);

		return true;
	}

	async historyClick(event)
	{
		event.preventDefault();
		console.log('[BTN] closeClick');

		// modal management - refactor to modal class later
		let parent_div, parent_hd, parent_bd;

		parent_div = document.querySelector('#modal-history');
		parent_hd = parent_div.querySelector('.modal-title');
		parent_bd = parent_div.querySelector('.modal-body');

		parent_bd.innerHTML = '';
		const user = JSON.parse(localStorage.getItem('user')).username;
		parent_hd.innerHTML = `${user}'s Match History`;

		MODAL_HISTORY.container = parent_bd;
		MODAL_HISTORY.history_target = user;
		await MODAL_HISTORY.render('replace');
		await LANGUAGE.updateContent('modal-history');
		MODAL_HISTORY.history_target = null;

		return true;
	}

	async settingsClick(event)
	{
		event.preventDefault();
		console.log('[BTN] settingsClick');

		let parent_div, parent_hd, parent_bd;

		parent_div = document.querySelector('#modal-settings');
		parent_hd = parent_div.querySelector('.modal-title');
		parent_bd = parent_div.querySelector('.modal-body');
		parent_bd.innerHTML = '';
		parent_hd.innerHTML = 'Settings';

		MODAL_SETTINGS.container = parent_bd;
		await MODAL_SETTINGS.render('replace');

		await LANGUAGE.updateContent('modal-settings');
		
		return true;
	}

	async logoutClick(event)
	{
		event.preventDefault();
		console.log('[BTN] logoutClick');

		await LOGOUT.run();

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
		const home_profile = FETCH.FETCH_HOME_PROFILE;
		await home_profile.init();
		const fetch_result = await home_profile.fetchData();
		if (fetch_result === 'home-profile-failed' || !home_profile.fetch_obj.rdata)
			return false;
		const avatar_url = home_profile.fetch_obj.rdata.avatar_url;
		const splitted_url = avatar_url.split('/avatars/');
		const pfp_name = splitted_url[1];
		if (pfp_name !== 'default.jpg')
			this.home_pfp = avatar_url;
		this.played = home_profile.fetch_obj.rdata.played;
		this.win_rate = home_profile.fetch_obj.rdata.win_rate + '%';
		this.wins = home_profile.fetch_obj.rdata.wins;
		this.losses = home_profile.fetch_obj.rdata.losses;

		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			${await this.html_pfp()}
			${await this.html_stats()}
			${await this.html_buttons()}
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-left-user-ctn d-flex flex-column',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);
    
		// [C] HTML RETURN
		return template;
	}

	async html_pfp()
	{
		// [-] HELPER FUNCTION
		const obj = JSON.parse(localStorage.getItem('user'));
		if (!obj)
			return false;
		const name = obj.username;

		// [A] TEMPLATE
		let template = `
		<img class="%pfp-c" src="%pfp-src" alt="%pfp-alt">
		<h2 class="%name-c">%name</h2>
		`;
		// [B] SET atts
		const atts =
		{
			'%pfp-c': 'ct-lpanel-pfp',
			'%pfp-src': this.home_pfp,
			'%pfp-alt': 'profile picture',
			'%name-c': 'ct-lpanel-username h5 truncate',
			'%name': `${name}`,
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_stats()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
		<div class="%main-c">
			<div class="%ctnt-1c %ctnt-2c">
				<div class="%tl-c">
					<p class="%tlp1-c" @lang1>%tlp1-t</p>
					<p class="%tlp2-c" >%tlp2-t</p>
				</div>
				<div class="%tr-c">
					<p class="%trp1-c" @lang2>%trp1-v</p>
					<p class="%trp2-c">%trp2-v</p>
				</div>
			</div>
			<div class="%ctnb-c">
				<div class="%bl-c">
					<p class="%blp1-c" @lang3>%blp1-t</p>
					<p class="%blp2-c">%blp2-t</p>
				</div>
				<div class="%br-c">
					<p class="%brp1-c" @lang4>%brp1-v</p>
					<p class="%brp2-c">%brp2-v</p>
				</div>
			</div>
		</div>
		<button id="%his-id" class="%his-c" @att1 @att2 @att3>%his-t</button>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c': 'ct-lpanel-stats w-100 d-flex flex-column',
			'%ctnt-1c': 'ct-stats-mid d-flex',
			'%ctnt-2c': 'justify-content-center align-items-center',
			'%tl-c': 'ct-mid-container h-100 d-flex flex-column text-center',
			'%tlp1-c': 'ct-mid-title',
			'%tlp1-t': 'Played',
			'%tlp2-c': 'ct-mid-num',
			'%tlp2-t': this.played,
			'%tr-c': 'ct-mid-container h-100 d-flex flex-column text-center',
			'%trp1-c': 'ct-mid-title',
			'%trp1-v': 'Win Rate',
			'%trp2-c': 'ct-mid-num',
			'%trp2-v': this.win_rate,
			'%ctnb-c': 'ct-stats-bot d-flex',
			'%bl-c': 'ct-bot-left d-flex flex-column text-center',
			'%blp1-c': 'ct-bot-title',
			'%blp1-t': 'Wins',
			'%blp2-c': 'ct-bot-num',
			'%blp2-t': this.wins,
			'%br-c': 'ct-bot-right d-flex flex-column text-center',
			'%brp1-c': 'ct-bot-title',
			'%brp1-v': 'Losses',
			'%brp2-c': 'ct-bot-num',
			'%brp2-v': this.losses,
			'%his-id': 'btn_history',
			'%his-c': 'ct-btn-neau w-100',
			'%his-t': 'Match History',
			'@att1': `data-bs-toggle="modal"`,
			'@att2': `data-bs-target="#modal-history"`,
			'@att3': `data-toggle="modal"`,
			'@lang1': `data-i18n="played"`,
			'@lang2': `data-i18n="wr"`,
			'@lang3': `data-i18n="wins"`,
			'@lang4': `data-i18n="losses"`,
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_buttons()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%btns-1c %btns-2c">
			<button
				id="%set-id"
				class="%set-c"
				data-bs-toggle="%set-1m"
				data-bs-target="%set-2m"
				data-toggle="%set-3m"
			>%set-t</button>
			<button id="%so-id" class="%so-c">%so-t</button>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%btns-1c': 'ct-lpanel-btns d-flex',
			'%btns-2c': 'flex-column justify-content-end w-100',
			'%set-id': 'btn_settings',
			'%set-c': 'ct-btn-neau',
			'%set-1m': 'modal',
			'%set-2m': '#modal-settings',
			'%set-3m': 'modal',
			'%set-t': 'Settings',
			'%so-id': 'btn_logout',
			'%so-c': 'ct-btn-neau',
			'%so-t': 'Logout',
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

		parent_html = this.container;
		const modal1 = MODAL_LAYOUT;
		modal1.container = parent_html;
		modal1.name = 'modal-settings';
		modal1.title = 'Settings';
		await modal1.render('append');

		const modal2 = MODAL_LAYOUT;
		modal2.container = parent_html;
		modal2.name = 'modal-history';
		modal2.title = 'Match History';
		await modal2.render('append');
    
		return true;
	}
}

const item = new LeftUser();
export default item;
