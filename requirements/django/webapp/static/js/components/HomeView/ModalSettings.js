// file : ModalSettings.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import MODAL_SETTINGS_ITEMS from './ModalSetItems.js';
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
class ModalSettings
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(container, gameType)
	{
		// COMMON-atts
		this.container = null;
		this.main_ctn = null;
		this.buttons = {
			'language': '',
			'account': '',
			'profile': '',
			'2fa': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.modal_title = null;
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
		this.main_ctn = document.querySelector('.modal-settings-ctn');
		this.buttons['language'] = document.getElementById('btn_setLang');
		this.buttons['account'] = document.getElementById('btn_setAcc');
		this.buttons['profile'] = document.getElementById('btn_setPfp');
		this.buttons['2fa'] = document.getElementById('btn_set2FA');
		this.modal_title = document.querySelector(
			'#modal-settings .modal-title'
		);

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

		this.buttons['language'].addEventListener(
			'click', async (e) => {await this.langClick(e);}
		);
		this.buttons['account'].addEventListener(
			'click', async (e) => {await this.accountClick(e);}
		);
		this.buttons['profile'].addEventListener(
			'click', async (e) => {await this.profileClick(e);}
		);
		this.buttons['2fa'].addEventListener(
			'click', async (e) => {await this.twofaClick(e);}
		);

		return true;
	}

	async langClick(event)
	{
		console.log('[BTN] langClick');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = 'Language';

		MODAL_SETTINGS_ITEMS.container = this.container;
		await MODAL_SETTINGS_ITEMS.render_language('replace');
		await LANGUAGE.updateContent('modal-settings-lang');

		return true;
	}

	async accountClick(event)
	{
		console.log('[BTN] accountClick');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = 'Account';

		MODAL_SETTINGS_ITEMS.container = this.container;
		await MODAL_SETTINGS_ITEMS.render_account('replace');
		await LANGUAGE.updateContent('modal-settings-acc');

		return true;
	}

	async profileClick(event)
	{
		console.log('[BTN] profileClick');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = 'Profile Picture';

		MODAL_SETTINGS_ITEMS.container = this.container;
		await MODAL_SETTINGS_ITEMS.render_pfp('replace');
		await LANGUAGE.updateContent('modal-settings-pfp');

		return true;
	}

	async twofaClick(event)
	{
		console.log('[BTN] twofaClick');
		event.preventDefault();

		this.container.innerHTML = '';
		this.modal_title.innerHTML = '2FA';

		MODAL_SETTINGS_ITEMS.container = this.container;
		const result = MODAL_SETTINGS_ITEMS.get_tfa_status();
		await MODAL_SETTINGS_ITEMS.render_2fa('replace');
		await LANGUAGE.updateContent('modal-settings-tfa');

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
		<div class="%main-c1">
			<button id="%btn1-c">%btn1-t</button>
			<button id="%btn2-c">%btn2-t</button>
			<button id="%btn3-c">%btn3-t</button>
			<button id="%btn4-c">%btn4-t</button>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'modal-settings-ctn',
			'%btn1-c': 'btn_setLang',
			'%btn1-t': 'Language',
			'%btn2-c': 'btn_setAcc',
			'%btn2-t': 'Account',
			'%btn3-c': 'btn_setPfp',
			'%btn3-t': 'Profile Picture',
			'%btn4-c': 'btn_set2FA',
			'%btn4-t': '2FA',
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
		return true;
	}
}

const item = new ModalSettings();
export default item;
