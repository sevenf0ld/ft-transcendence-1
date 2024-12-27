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
class ModalSetItems
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(container, gameType)
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
			'pfp-input-upload': '',
			'pfp-submit': '',
			'pfp-remove': '',
			'tfa-on': '',
			'tfa-off': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
	}
	// ======================================================================== //
	// LANGUAGE-SETTINGS
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render_language(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

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
	// [2/4] EVENT-RELATED
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
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
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
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_lang()
	{
		return true;
	}
	// ======================================================================== //
	// ACCOUNT-SETTINGS
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render_account(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

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
	// [2/4] EVENT-RELATED
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
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
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
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_acc()
	{
		return true;
	}
	// ======================================================================== //
	// PROFILE-PICTURE-SETTINGS
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render_pfp(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new error('[err] invalid render type');

		const template = await this.init_template_pfp();

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

		await this.push_important_elements_pfp();
		await this.bind_events_pfp();
		await this.bind_modals_pfp();

		return true;
	}

	async push_important_elements_pfp()
	{
		this.buttons['pfp-upload'] = document.getElementById('img_pfp');
		this.buttons['pfp-input-upload'] = document.getElementById('input_pfp');
		this.buttons['pfp-submit'] = document.getElementById('btn_pfp_submit');
		this.buttons['pfp-remove'] = document.getElementById('btn_pfp_remove');

		if (!this.buttons['pfp-upload'])
			throw new Error('[ERR] pfp-upload button not found');
		if (!this.buttons['pfp-remove'])
			throw new Error('[ERR] pfp-remove button not found');
		if (!this.buttons['pfp-input-upload'])
			throw new Error('[ERR] pfp-input-upload button not found');
		if (!this.buttons['pfp-submit'])
			throw new Error('[ERR] pfp-submit button not found');

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_pfp()
	{
		this.buttons['pfp-upload'].addEventListener(
			'click', async (e) => {await this.imgUploadClick(e);}
		);

		this.buttons['pfp-submit'].addEventListener(
			'click', async (e) => {await this.submitClick(e);}
		);

		this.buttons['pfp-remove'].addEventListener(
			'click', async (e) => {await this.removeClick(e);}
		);

		return true;
	}

	async getCookie(name) {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '')
		{
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++)
			{
				const cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) === (name + '='))
				{
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	async imgUploadClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : pfp-upload');

		const fileInput = this.buttons['pfp-input-upload'];
		fileInput.click();

		fileInput.addEventListener('change', async (e) =>
		{
			const file = e.target.files[0];
			if (!file)
				return false;
			if (!file.type.match('image.*'))
			{
				alert('error File type not supported');
				fileInput.value = '';
				return false
			}
			if (file.size > 2 * 1024 * 1024)
			{
				alert('error File size exceeds 2MB');
				return false;
			}
			console.log("Upload Image detected : size (mb) : ", file.size / 1024 / 1024);

			const reader = new FileReader();
			reader.onload = () =>
			{
				this.buttons['pfp-upload'].src = reader.result;
			}
			reader.onerror = () =>
			{
				console.error('IMAGE READING FAILED: ', reader.error);
			}
			reader.readAsDataURL(file); // readyState becomes 2 and result contains the data

			if (file)
			{
				const form_data = new FormData();
				form_data.append('avatar', file);
				const csrf_token = await this.getCookie('csrftoken');
				const response = await fetch('/api/user_profiles/upload-avatar/', {
					method: 'POST',
					headers: {
							'X-CSRFToken': csrf_token
					},
					body: form_data
				});

				const data = await response.json();
				if (response.ok)
				{
					console.log('Profile avatar uploaded.');
				}
				else
				{
					console.error(response.details);
				}
			}

		});

		return true;
	}

	async submitClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : pfp-submit');

		return true;
	}

	async removeClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : pfp-remove');

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_pfp()
	{
		let template = "";
		template += await this.html_main_ctn_pfp();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_pfp()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			<div class="%img-c1">
				<img @att1 @att2>
				<img class="%edit-c1" src="/static/assets/images/edit.svg">
			</div>
			<input @att3 @att4>
			<button @att5 @att6>@txt-1</button>
			<button @att7 @att8>@txt-2</button>
		</div>
		`
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-set-pfp-ctn',
			'%img-c1': 'ct-set-pfp-img-ctn',
			'@att1': 'id="img_pfp" alt="profile-picture"',
			'@att2': 'src="/static/assets/images/default-pfp.png"',
			'%edit-c1': 'ct-set-pfp-edit',
			'@att3': 'id="input_pfp" type="file" accept="image/*"',
			'@att4': 'autocomplete="off"',
			'@att5': 'id="btn_pfp_submit" data-bs-dismiss="modal"',
			'@att6': 'type="button"',
			'@txt-1': 'Confirm',
			'@att7': 'id="btn_pfp_remove" data-bs-dismiss="modal"',
			'@att8': 'type="button"',
			'@txt-2': 'Remove',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_pfp()
	{
		return true;
	}
	// ======================================================================== //
	// 2FA-SETTINGS
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render_2fa(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

		const template = await this.init_template_2fa();

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

		await this.push_important_elements_2fa();
		await this.bind_events_2fa();
		await this.bind_modals_2fa();

		return true;
	}

	async push_important_elements_2fa()
	{
		this.buttons['tfa-on'] = document.getElementById('btn_2fa_on');
		this.buttons['tfa-off'] = document.getElementById('btn_2fa_off');

		if (!this.buttons['tfa-on'])
			throw new Error('[ERR] tfa-on button not found');
		if (!this.buttons['tfa-off'])
			throw new Error('[ERR] tfa-off button not found');

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_2fa()
	{
		this.buttons['tfa-on'].addEventListener(
			'click', async (e) => {await this.tfaEnableClick(e);}
		);
		this.buttons['tfa-off'].addEventListener(
			'click', async (e) => {await this.tfaDisableClick(e);}
		);
		return true;
	}

	async tfaEnableClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : tfa-on');

		return true;
	}

	async tfaDisableClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : tfa-off');

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_2fa()
	{
		let template = "";
		template += await this.html_main_ctn_2fa();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_2fa()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			<div class="%sta-c">
				<div class="%icon-c1"></div>
				<p>%sta-t</p>
			</div>
			<button @att1 class="%btn1-c">@att2</button>
			<button @att3 class="%btn2-c">@att4</button>
		</div>
		`
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-set-2fa-ctn',
			'%sta-c': 'ct-set-2fa-status',
			'%icon-c1': 'ct-set-2fa-icon twofa-off',
			'%sta-t': '2FA Status: Disabled',
			'@att1': 'id="btn_2fa_on" data-bs-dismiss="modal"',
			'@att2': 'Enable 2FA',
			'%btn1-c': 'd-block',
			'@att3': 'id="btn_2fa_off" data-bs-dismiss="modal"',
			'@att4': 'Disable 2FA',

			'%btn2-c': 'd-none',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_2fa()
	{
		return true;
	}
}

const item = new ModalSetItems();
export default item;
