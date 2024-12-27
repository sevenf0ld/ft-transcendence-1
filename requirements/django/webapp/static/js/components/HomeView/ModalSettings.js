// file : ModalSettings.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import ModalLayout from '../../layouts//ModalLayout.js';
import ModalSettingsItems from './ModalSetItems.js';
import MODAL_SETTINGS_ITEMS from './ModalSetItems111.js';
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
	'.ct-template',
];

// --- [LOCAL] BUTTONS SECTION
// button tracker
class button
{
	constructor()
	{
		this.arr = {
			'language': '',
			'account': '',
			'profile': '',
			'2fa': '',
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

// --- [LOCAL] HTML ELEMENTS SECTION
function html_button()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
		<button id="%btn1-c">%btn1-t</button>
		<button id="%btn2-c">%btn2-t</button>
		<button id="%btn3-c">%btn3-t</button>
		<button id="%btn4-c">%btn4-t</button>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%btn1-c': 'btn_setLang',
		'%btn1-t': 'Language',
		'%btn2-c': 'btn_setAcc',
		'%btn2-t': 'Account',
		'%btn3-c': 'btn_setPfp',
		'%btn3-t': 'Profile Picture',
		'%btn4-c': 'btn_set2FA',
		'%btn4-t': '2FA',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['language'] = attributes['%btn1-c'];
	btns.arr['account'] = attributes['%btn2-c'];
	btns.arr['profile'] = attributes['%btn3-c'];
	btns.arr['2fa'] = attributes['%btn4-c'];

	// [D] HTML RETURN
	return template;
}

// HTML elements bundle
const ele =
{
	html_button,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //

export default class ModalSettings
{
	// --- [00] CONSTRUCTOR
	constructor(container)
	{
		this.container = container;
		this.components = {};
		this.modal_title = document.querySelector('#modal-settings .modal-title');
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
		template += ele.html_button();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	// --- [04] EVENT
	async langClick(event)
	{
		console.log('[EVENT] button clicked : language');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = 'Language';

		MODAL_SETTINGS_ITEMS.container = this.container;
		await MODAL_SETTINGS_ITEMS.render_language('replace');

		return true;
	}

	async accountClick(event)
	{
		console.log('[EVENT] button clicked : account');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = 'Account';

		MODAL_SETTINGS_ITEMS.container = this.container;
		await MODAL_SETTINGS_ITEMS.render_account('replace');

		return true;
	}

	async profileClick(event)
	{
		console.log('[EVENT] button clicked : profile');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = 'Profile Picture';

		MODAL_SETTINGS_ITEMS.container = this.container;
		await MODAL_SETTINGS_ITEMS.render_pfp('replace');

		return true;
	}

	async twofaClick(event)
	{
		console.log('[EVENT] button clicked : 2fa');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = '2FA';

		MODAL_SETTINGS_ITEMS.container = this.container;
		await MODAL_SETTINGS_ITEMS.render_2fa('replace');

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['language'].addEventListener(
			'click', async (e) => {await this.langClick(e);}
		);
		btns.arr['account'].addEventListener(
			'click', async (e) => {await this.accountClick(e);}
		);
		btns.arr['profile'].addEventListener(
			'click', async (e) => {await this.profileClick(e);}
		);
		btns.arr['2fa'].addEventListener(
			'click', async (e) => {await this.twofaClick(e);}
		);

		return true;
	}

	// --- [05] RENDER
	async render()
	{
		const template = await this.init_template();
		
		this.container.insertAdjacentHTML('beforeend', template);

		await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
