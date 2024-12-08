// file : LeftUser.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import LoginView from '../../views/LoginView.js';
import ModalLayout from '../../layouts/ModalLayout.js';
import ModalSettings from './ModalSettings.js';
import ModalHistory from './ModalHistory.js';
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
			'history': '',
			'settings': '',
			'signout': '',
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
function html_pfp()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<img class="%pfp-c" src="%pfp-src" alt="%pfp-alt">
	<h2 class="%name-c">%name</h2>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%pfp-c': 'ct-lpanel-pfp',
		'%pfp-src': '/static/assets/images/default-pfp.png',
		'%pfp-alt': 'profile picture',
		'%name-c': 'ct-lpanel-username h5 truncate',
		'%name': 'JLIAW'
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}

function html_stats()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<div class="%main-c">
		<div class="%ctnt-1c %ctnt-2c">
			<div class="%tl-c">
				<p class="%tlp1-c">%tlp1-t</p>
				<p class="%tlp2-c">%tlp2-t</p>
			</div>
			<div class="%tr-c">
				<p class="%trp1-c">%trp1-v</p>
				<p class="%trp2-c">%trp2-v</p>
			</div>
		</div>
		<div class="%ctnb-c">
			<div class="%bl-c">
				<p class="%blp1-c">%blp1-t</p>
				<p class="%blp2-c">%blp2-t</p>
			</div>
			<div class="%br-c">
				<p class="%brp1-c">%brp1-v</p>
				<p class="%brp2-c">%brp2-v</p>
			</div>
		</div>
	</div>
	<button id="%his-id" class="%his-c" @att1 @att2 @att3>%his-t</button>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%main-c': 'ct-lpanel-stats w-100 d-flex flex-column',
		'%ctnt-1c': 'ct-stats-mid d-flex',
		'%ctnt-2c': 'justify-content-center align-items-center',
		'%tl-c': 'ct-mid-container h-100 d-flex flex-column text-center',
		'%tlp1-c': 'ct-mid-title',
		'%tlp1-t': 'Played',
		'%tlp2-c': 'ct-mid-num',
		'%tlp2-t': '0',
		'%tr-c': 'ct-mid-container h-100 d-flex flex-column text-center',
		'%trp1-c': 'ct-mid-title',
		'%trp1-v': 'Win Rate',
		'%trp2-c': 'ct-mid-num',
		'%trp2-v': '0%',
		'%ctnb-c': 'ct-stats-bot d-flex',
		'%bl-c': 'ct-bot-left d-flex flex-column text-center',
		'%blp1-c': 'ct-bot-title',
		'%blp1-t': 'Wins',
		'%blp2-c': 'ct-bot-num',
		'%blp2-t': '0',
		'%br-c': 'ct-bot-right d-flex flex-column text-center',
		'%brp1-c': 'ct-bot-title',
		'%brp1-v': 'Losses',
		'%brp2-c': 'ct-bot-num',
		'%brp2-v': '0',
		'%his-id': 'btn_history',
		'%his-c': 'ct-btn-neau w-100',
		'%his-t': 'Match History',
		'@att1': `data-bs-toggle="modal"`,
		'@att2': `data-bs-target="#modal-history"`,
		'@att3': `data-toggle="modal"`,
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['history'] = attributes['%his-id'];

	// [D] HTML RETURN
	return template;
}

function html_buttons()
{
	// [-] HELPER FUNCTION

	//<button id="btn_settings" data-bs-toggle="modal" data-bs-target="#modal-settings" class="ct-btn-neau" data-toggle="modal">
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

	// [B] SET ATTRIBUTES
	const attributes =
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

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['settings'] = attributes['%set-id'];
	btns.arr['signout'] = attributes['%so-id'];

	// [D] HTML RETURN
	return template;
}

const ele =
{
	html_pfp,
	html_stats,
	html_buttons,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class leftPanelUser
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
		template += ele.html_pfp();
		template += ele.html_stats();
		template += ele.html_buttons();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	// --- [04] EVENT
	async historyClick(event)
	{
		console.log('[EVENT] button clicked : history');
		event.preventDefault();

		return true;
	}

	async settingsClick(event)
	{
		console.log('[EVENT] button clicked : settings');
		event.preventDefault();
		
		return true;
	}

	async logoutClick(event)
	{
		console.log('[EVENT] button clicked : logout');
		event.preventDefault();

		const loginView = new LoginView();
		await loginView.render();

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['history'].addEventListener(
			'click', async (e) => {await this.historyClick(e);}
		);

		btns.arr['settings'].addEventListener(
			'click', async (e) => {await this.settingsClick(e);}
		);

		btns.arr['signout'].addEventListener(
			'click', async (e) => {await this.logoutClick(e);}
		);

		return true;
	}

	// --- [05] RENDER
	async modals_render()
	{
		let parent_html;

		parent_html = this.container;
		const modal1 = new ModalLayout(
			parent_html, "modal-settings", "Settings"
		);
		await modal1.render();

		parent_html = await modal1.get();
		const modalSettings = new ModalSettings(parent_html);
		await modalSettings.render();

		parent_html = this.container;
		const modal2 = new ModalLayout(
			parent_html, "modal-history", "JLIAW's Match History"
		);
		await modal2.render();

		parent_html = await modal2.get();
		const modalHistory = new ModalHistory(parent_html);
		await modalHistory.render();

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
