// file : ModalSetItems.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import * as LUSER_FETCH from './LeftUser_fetch.js';
import * as MSI_FETCH from './ModalSetItems_fetch.js';
import * as FORM_VALI_SU from '../../core/helpers/formVali-su.js';
import FETCH_UTILS from '../../core/helpers/fetch-utils.js';
import LEFT_USER from './LeftUser.js';
import * as LOADING from '../../core/helpers/loading.js';
import LANGUAGE from '../../core/language/language.js';
import HOME_VIEW from '../../views/HomeView.js';
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
		this.ctns = {};
	}

	async is_intra_user()
	{
		const user = JSON.parse(localStorage.getItem('user'));
		const is_intra_user = user.ft_acc;
		if (is_intra_user === true)
			return true;
		return false;
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
		console.log('[BTN] englishClick');

		await this.fetch_lang('EN');
		await LANGUAGE.changeLanguage('en');
		await LANGUAGE.updateContent('home');

		return true;
	}

	async malayClick(event)
	{
		event.preventDefault();
		console.log('[BTN] malayClick');

		await this.fetch_lang('MY');
		await LANGUAGE.changeLanguage('my');
		await LANGUAGE.updateContent('home');

		return true;
	}

	async chineseClick(event)
	{
		event.preventDefault();
		console.log('[BTN] chineseClick');

		await this.fetch_lang('ZH');
		await LANGUAGE.changeLanguage('zh');
		await LANGUAGE.updateContent('home');

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	async fetch_lang(lang)
	{
		const la = lang.toUpperCase();
		if (la !== 'EN' && la !== 'MY' && la !== 'ZH')
			throw new Error('[ERR] invalid lang');

		await MSI_FETCH.LANG.init();
		MSI_FETCH.LANG.language = la;
		const re_value = await MSI_FETCH.LANG.fetchData();

		if (re_value === 'lang-successful')
		{
			alert('Language settings updated.');
		}
		else if (re_value === 'lang-failed')
		{
			alert('Language settings update failed.');
		}
		else
		{
			console.error('Language settings update failed : unknown error');
		}

		return true;
	}
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
			'@att4': 'Bahasa',
			'@att5': 'id="btn_lang_cn" data-bs-dismiss="modal"',
			'@att6': '中文',
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

	async render_update_pfp(url)
	{
		const pfp = document.getElementById('img_pfp');
		pfp.src = url;
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
			'click', async (e) => {await this.accSubmitClick(e);}
		);

		if (await this.is_intra_user())
		{
			const ctns = document.querySelectorAll('.ct-set-acc-form-field');

			for (const ctn of ctns)
			{
				ctn.classList.add('d-none');
				ctn.querySelector('input').disabled = true;
			}

			const btn = document.querySelector('#btn_acc_submit');
			btn.classList.add('d-none');
			btn.disabled = true;

			const parent_div = document.querySelector('.ct-set-acc-form');
			const p = document.createElement('p');
			p.classList.add('ct-set-warning');
			p.textContent = '(Intra user can\'t update)';
			parent_div.appendChild(p);
		}

		return true;
	}

	async accSubmitClick(event)
	{
		event.preventDefault();
		console.log('[BTN] accSubmitClick');

		await this.submit_acc_form();

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	async submit_acc_form()
	{
		if (await this.is_intra_user())
		{
			alert('Intra user detected! Account settings cannot be updated.');
			return false;
		}
		const form = FORM_VALI_SU.modalSetItems;
		if (!await form.validate())
			return false;

		await LOADING.disable_all();
		await MSI_FETCH.ACC.init();
		await MSI_FETCH.ACC.fetchData(form);
		const acc_fetch = MSI_FETCH.ACC;

		if (acc_fetch.re_value === 'acc-successful')
			alert('Account settings updated.');
		else if (acc_fetch.re_value === 'acc-failed')
		{
			alert('Account settings update failed because : ' + acc_fetch.fetch_obj.rdata.details);
		}
		else
			console.error('Account settings update failed : unknown error');

		await LOADING.restore_all();
		// if rdata is needed
		const obj = LUSER_FETCH.fetch_obj;

		return true;
	}
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
			</div>
			`;

			let max_length = 50;
			if (type === 'password')
				max_length = 16;

			let placeholder = 'Enter ' + label;

			const atts =
			{
				'%form-field': 'ct-set-acc-form-field',
				'@att-a1': `for="${id}"`,
				'@att-a2': label,
				'@att-b1': `class="ct-home-input"`,
				'@att-b2': `type="${type}" maxlength="${max_length}"`,
				'@att-b3': `id="${id}" autocomplete="off"`,
				'@att-b4': `placeholder="${placeholder}"`,
			};
			for (const key in atts)
				template = template.split(key).join(atts[key]);

			return template;
		}

		// [A] TEMPLATE
		const user = JSON.parse(localStorage.getItem('user'));
		const username = user.username;
		const email = user.email;
		let template = `
		<div class="%main-c1">
			<form class="%fm-c1">
				<div class="%dp-c1" @lang1>%dp-t1</div>
				<div class="%dp-c1" @lang2>%dp-ta1</div>
				<div class="%dp-c1 %email" @lang3 @emtt>%dp-t2</div>
				${await html_input('Current Password', 'input_acc_cur_pass', 'password')}
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
			'%email': 'ct-set-acc-dis-email truncate',
			'%dp-t1': `Username: ${username}`,
			'%dp-t2': `Email: ${email}`,
			'@emtt': `title="${email}"`,
			'%dp-ta1': 'Password: ********',
			'%btn1-f1': 'btn_acc_submit',
			'%btn1-t1': 'Update',
			'@btn1': '',
			'@att1': `class="alert d-none"`,
			'@att2': `role="alert" id="alert_set_acc"`,
			'@lang1': 'data-i18n="acc-username"',
			'@lang2': 'data-i18n="acc-password"',
			'@lang3': 'data-i18n="acc-email"',
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

		this.buttons['pfp-submit'].disabled = true;
		this.buttons['pfp-submit'].addEventListener(
			'click', async (e) => {await this.submitClick(e);}
		);

		this.buttons['pfp-remove'].addEventListener(
			'click', async (e) => {await this.removeClick(e);}
		);

		await this.render_update_pfp(LEFT_USER.home_pfp);

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
		console.log('[BTN] imgUploadClick');

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
				return false;
			}
			reader.readAsDataURL(file); // readyState becomes 2 and result contains the data

			this.file = file;
			this.buttons['pfp-submit'].disabled = false;
		});

		return true;
	}

	async submitClick(event)
	{
		event.preventDefault();
		console.log('[BTN] submitClick');

		if (this.file)
		{
			const form_data = new FormData();
			form_data.append('avatar', this.file);

			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_profiles/upload-avatar/');
			await mainFetch.setMethod('POST');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			mainFetch.object['body'] = form_data;
			await mainFetch.fetchData();
			const response = mainFetch.robject;
			const data = mainFetch.rdata;
			if (response.ok)
			{
				console.log('response : ', data.avatar_url);
				const avatar_url = data.avatar_url;
				const splitted_url = avatar_url.split('/avatars/');
				const pfp_name = splitted_url[1];
				if (pfp_name !== 'default.jpg')
					LEFT_USER.home_pfp = avatar_url;
				else
					LEFT_USER.home_pfp = '/static/assets/images/default-pfp.png';

				await this.render_update_pfp(LEFT_USER.home_pfp);
				let parent_html = document.querySelector('.ct-main-lpanel');
				LEFT_USER.container = parent_html;
				await LEFT_USER.render('replace');
				this.file = null;
			}
			else
			{
				console.error(response.details);
			}
		}
		else
		{
			alert('Upload Failed: No file selected');
		}

		return true;
	}

	async removeClick(event)
	{
		event.preventDefault();
		console.log('[BTN] removeClick');

		const confirm_remove = confirm('Are you sure you want to reset to default profile picture?');
		if (confirm_remove)
		{
			await FETCH_UTILS.init();
			const mainFetch = FETCH_UTILS;
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_profiles/remove-avatar/');
			await mainFetch.setMethod('DELETE');
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.fetchData();

			if (mainFetch.robject.status === 204)
			{
				LEFT_USER.home_pfp = '/static/assets/images/default-pfp.png';
				await this.render_update_pfp(LEFT_USER.home_pfp);
				let parent_html = document.querySelector('.ct-main-lpanel');
				LEFT_USER.container = parent_html;
				await LEFT_USER.render('replace');
				this.file = null;
			}
			else
				alert(mainFetch.rdata.details);
		}

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
		await this.update_2fa_status();

		this.buttons['tfa-on'].addEventListener(
			'click', async (e) => {await this.tfaEnableClick(e);}
		);
		this.buttons['tfa-off'].addEventListener(
			'click', async (e) => {await this.tfaDisableClick(e);}
		);

		if (await this.is_intra_user())
		{
			const btns = document.querySelectorAll('.ct-set-2fa-ctn button');

			for (const btn of btns)
			{
				btn.classList.add('d-none');
				btn.disabled = true;
			}

			const parent_div = document.querySelector('.ct-set-2fa-ctn');
			const p = document.createElement('p');
			p.classList.add('ct-set-warning');
			p.textContent = '(Intra user can\'t update)';
			parent_div.appendChild(p);
		}

		return true;
	}

	async tfaEnableClick(event)
	{
		event.preventDefault();
		console.log('[BTN] tfaEnableClick');

		if (await this.is_intra_user())
			return false;

		await this.fetch_toogle_tfa('on');

		return true;
	}

	async tfaDisableClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] tfaDisableClick');

		if (await this.is_intra_user())
			return false;

		await this.fetch_toogle_tfa('off');

		return true;
	}

	async update_2fa_status()
	{
		const btn_enable = this.buttons['tfa-on'];
		const btn_disable = this.buttons['tfa-off'];
		const icon = document.querySelector('.ct-set-2fa-icon');
		const p = document.querySelector('.ct-set-2fa-p');

		if (!await this.get_tfa_status())
		{
			btn_enable.classList.remove('d-none');
			btn_enable.classList.add('d-block');
			btn_enable.disabled = false;

			btn_disable.classList.remove('d-block');
			btn_disable.classList.add('d-none');
			btn_disable.disabled = true;

			icon.classList.remove('twofa-on');
			icon.classList.add('twofa-off');
			p.textContent = '2FA Status: Disabled';
		}
		else
		{
			btn_enable.classList.remove('d-block');
			btn_enable.classList.add('d-none');
			btn_enable.disabled = true;

			btn_disable.classList.remove('d-none');
			btn_disable.classList.add('d-block');
			btn_disable.disabled = false;

			icon.classList.remove('twofa-off');
			icon.classList.add('twofa-on');
			p.textContent = '2FA Status: Enabled';
		}
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	async get_tfa_status()
	{
		let revalue = LUSER_FETCH.FETCH_HOME_PROFILE.tfa_is_enabled;
		if (revalue === null)
			throw new Error('[ERR] tfa status not fetched');

		if (revalue === true)
			return true;
		else if (revalue === false)
			return false;

		return null;
	}

	async set_tfa_status(stat)
	{
		if (stat !== true && stat !== false && stat !== null)
			throw new Error('[ERR] invalid status');

		LUSER_FETCH.FETCH_HOME_PROFILE.tfa_is_enabled = stat;

		return true;
	}

	async fetch_toogle_tfa(type)
	{
		if (type !== 'on' && type !== 'off')
			throw new Error('[ERR] invalid type');

		await MSI_FETCH.TFA.init();
		await MSI_FETCH.TFA.fetchData(type);
		const obj = MSI_FETCH.TFA;
		if (obj.re_value === 'tfa-successful')
		{
			if (type === 'on')
			{
				await this.set_tfa_status(true);
				alert(`2FA has been turned ${type}.`);
			}
			if (type === 'off')
			{
				await this.set_tfa_status(false);
				alert(`2FA has been turned ${type}.`);
			}
		}
		else if (obj.re_value === 'tfa-failed')
		{
			throw new Error('[ERR] 2FA status update failed : failed');
			await this.set_tfa_status(null);
			return false;
		}
		else
			console.error('2FA status update failed : unknown error');

		return true;
	}
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
				<p class="%des-c1">%sta-t</p>
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
			'%des-c1': 'ct-set-2fa-p',
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
