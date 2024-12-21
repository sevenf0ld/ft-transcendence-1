// file : ModalSetItems.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// reference from BotFriendPfp.js
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
export default class ModalSettingsItems
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(container)
	{
		// COMMON-atts
		this.container = container;
		this.main_ctn = '';
		this.buttons = {
			'lang-en': '',
			'lang-my': '',
			'lang-cn': '',
			'acc-submit': '',
			'pfp-upload': '',
			'pfp-remove': '',
			'2fa-toggle': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
	}
	/***********************************
	 * LANGUAGE-SETTINGS
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (LANGUAGES)
	// --------------------------------------------- //
	async render_language(type)
	{
		const template = await this.init_template_lang();

		if (type.toLowerCase() === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (type.toLowerCase() === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render type');
		}

		await this.push_important_elements_lang();
		await this.bind_events_lang();
		await this.bind_modals_lang();

		return true;
	}

	async push_important_elements_lang()
	{
		this.buttons['lang-en'] = document.getElementById('btn_lang_en');
		this.buttons['lang-my'] = document.getElementById('btn_lang_my');
		this.buttons['lang-cn'] = document.getElementById('btn_lang_cn');

		if (!this.buttons['lang-en'])
			throw new Error('[ERR] lang-en button not found');
		if (!this.buttons['lang-my'])
			throw new Error('[ERR] lang-my button not found');
		if (!this.buttons['lang-cn'])
			throw new Error('[ERR] lang-cn button not found');

		return true;
	}
	// --------------------------------------------- //
	// EVENT-RELATED (LANGUAGES)
	// --------------------------------------------- //
	async bind_events_lang()
	{
		this.buttons['lang-en'].addEventListener(
			'click', async (e) => {await this.englishClick(e);}
		);

		this.buttons['lang-my'].addEventListener(
			'click', async (e) => {await this.malayClick(e);}
		);

		this.buttons['lang-cn'].addEventListener(
			'click', async (e) => {await this.chineseClick(e);}
		);

		return true;
	}

	async englishClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : language-english');

		return true;
	}

	async malayClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : language-malay');

		return true;
	}

	async chineseClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : language-chinese');

		return true;
	}

	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (LANGUAGES)
	// --------------------------------------------- //
	async bind_modals_lang()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED (LANGUAGES)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (LANGUAGES)
	// --------------------------------------------- //
	async init_template_lang()
	{
		let template = "";
		template += await this.html_main_ctn_lang();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_lang()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			<button @att1>@att2</button>
			<button @att3>@att4</button>
			<button @att5>@att6</button>
		</div>
		`
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-set-lang-ctn',
			'@att1': 'id="btn_lang_en" data-bs-dismiss="modal"',
			'@att2': 'English',
			'@att3': 'id="btn_lang_my" data-bs-dismiss="modal"',
			'@att4': 'Malay',
			'@att5': 'id="btn_lang_cn" data-bs-dismiss="modal"',
			'@att6': 'Chinese',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	/***********************************
	 * ACCOUNT-SETTINGS
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (ACCOUNT)
	// --------------------------------------------- //
	async render_account(type)
	{
		const template = await this.init_template_acc();

		if (type.toLowerCase() === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (type.toLowerCase() === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render type');
		}

		await this.push_important_elements_acc();
		await this.bind_events_acc();
		await this.bind_modals_acc();

		return true;
	}

	async push_important_elements_acc()
	{
		this.buttons['acc-submit'] = document.getElementById('btn_acc_submit');

		if (!this.buttons['acc-submit'])
			throw new Error('[ERR] acc-submit button not found');

		return true;
	}

	// --------------------------------------------- //
	// EVENT-RELATED (ACCOUNT)
	// --------------------------------------------- //
	async bind_events_acc()
	{
		this.buttons['acc-submit'].addEventListener(
			'click', async (e) => {await this.submitClick(e);}
		);

		return true;
	}

	async submitClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : account-submit');

		return true;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (ACCOUNT)
	// --------------------------------------------- //
	async bind_modals_acc()
	{
		return true;
	}

	// --------------------------------------------- //
	// FETCH-RELATED (ACCOUNT)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (ACCOUNT)
	// --------------------------------------------- //
	async init_template_acc()
	{
		let template = "";
		template += await this.html_main_ctn_acc();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_acc()
	{
		// [-] HELPER FUNCTION
		async function html_input(label, id, type)
		{
			let template = `
			<div class="%form-field">
				<label @att-a1>@att-a2</label>
				<input @att-b1 @att-b2 @att-b3 @att-b4>
				<p @att-c1 @att-c2></p>
			</div>
			`;

			let max_length = 50;
			if (type === 'password')
				max_length = 16;

			let placeholder = 'Leave blank if no change';
			if(id === 'input_acc_cur_pass')
				placeholder = 'Required';

			const atts =
			{
				'%form-field': 'ct-set-acc-form-field',
				'@att-a1': `for="${id}"`,
				'@att-a2': label,
				'@att-b1': `class="ct-home-input"`,
				'@att-b2': `type="${type}" maxlength="${max_length}"`,
				'@att-b3': `id="${id}" autocomplete="off"`,
				'@att-b4': `placeholder="${placeholder}"`,
				'@att-c1': `class="ct-set-acc-error"`,
				'@att-c2': `id="err_${id}"`,
			};
			for (const key in atts)
				template = template.split(key).join(atts[key]);

			return template;
		}

		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			<form class="%fm-c1">
				<div class="%dp-c1">%dp-t1</div>
				<div class="%dp-c1 %email">%dp-t2</div>
				${await html_input('Current Password', 'input_acc_cur_pass', 'password')}
				${await html_input('New Email', 'input_acc_new_email', 'email')}
				${await html_input('New Password', 'input_acc_new_pass', 'password')}
				${await html_input('Confirm Password', 'input_acc_conf_pass','password')}
				<button id="%btn1-f1" type="submit" @btn1>%btn1-t1</button>
				<div @att1 @att2></div>
			</form>
		</div>
		`
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-set-acc-ctn',
			'%fm-c1': 'ct-set-acc-form',
			'%dp-c1': 'ct-set-acc-display',
			'%email': 'ct-set-acc-dis-email',
			'%dp-t1': 'Username: user123',
			'%dp-t2': 'Email: user123@email.com',
			'%btn1-f1': 'btn_acc_submit',
			'%btn1-t1': 'Update',
			'@btn1': 'data-bs-dismiss="modal"',
			'@att1': `class="alert d-none"`,
			'@att2': `role="alert" id="alert_set_acc"`,
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	/***********************************
	 * PROFILE-PICTURE-SETTINGS
	 ***********************************/
	/***********************************
	 * 2FA-SETTINGS
	 * *********************************/
}
