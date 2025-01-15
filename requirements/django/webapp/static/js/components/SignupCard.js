// file : SIgnupCard.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import * as FormValiSignup from '../core/helpers/formVali-su.js';
import * as LOADING from '../core/helpers/loading.js';
import ALERT_UTILS from '../core/helpers/alert-utils.js';
import FETCH from './SignupCard_fetch.js';
import LOGIN_VIEW from '../views/LoginView.js';
import ROUTER from '../core/router.js';
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
class SignupCard
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
			'back': null,
			'signup': null,
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.alert_div = null;
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
		this.main_ctn = document.querySelector('.ct-signup-ctn');
		this.buttons['signup'] = document.getElementById('btn_signup_submit');
		this.buttons['back'] = document.getElementById('btn_back_to_login');
		await ALERT_UTILS.init();
		ALERT_UTILS.container = document.getElementById('alert_register');
		this.alert_div = ALERT_UTILS;

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
		await this.form_limit_addon();

		this.buttons['back'].addEventListener(
			'click', async (e) => {await this.backLoginClick(e);}
		);

		this.buttons['signup'].addEventListener(
			'click', async (e) => {await this.submitClick(e);}
		);

		return true;
	}

	async submitClick()
	{
		console.log('[BTN] submitClick');
		event.preventDefault();

		await this.alert_div.alert_clear();
		await LOADING.disable_all();

		if (await FormValiSignup.validate() === false)
		{
			console.log('Form is invalid!');
			LOADING.restore_all();
			return false;
		}

		const string_div = 'Registering...';
		await this.alert_div.setType('alert-info');
		await this.alert_div.setMsg(string_div);
		await this.alert_div.alert_render();

		const registerFetch = FETCH;
		await registerFetch.init();
		const result = await registerFetch.fetchData();
		await new Promise(r => setTimeout(r, 1000));

		if (result == 'registeration-successful')
		{
			await this.alert_div.alert_clear();
			const string_div = 'Registration successful!';
			await this.alert_div.setType('alert-success');
			await this.alert_div.setMsg(string_div);
			await this.alert_div.alert_render();
			await new Promise(r => setTimeout(r, 1000));

			//let string_alert = '\nAn activation link has been';
			//string_alert += ' sent to your email. Only confirmed';
			//string_alert += ' emails will be able to login.';
			//await alert(string_alert);

			await this.alert_div.alert_clear();
			await this.alert_div.setType('alert-warning');
			await this.alert_div.setMsg('Redirecting to login...');
			await this.alert_div.alert_render();
			await new Promise(r => setTimeout(r, 2500));

			await ROUTER.navigate_to('/login');
		}
		else
		{
			await this.alert_div.alert_clear();
			await this.alert_div.setType('alert-danger');
			let string_div = '';
			if (registerFetch.fetch_obj.rdata['username'])
			{
				string_div += 'Username: ';
				string_div += registerFetch.fetch_obj.rdata['username'];
			}
			else if (registerFetch.fetch_obj.rdata['email'])
			{
				string_div += 'Email: ';
				string_div += registerFetch.fetch_obj.rdata['email'];
			}
			else if (registerFetch.fetch_obj.rdata['password1'])
			{
				string_div += 'Password: ';
				string_div += registerFetch.fetch_obj.rdata['password1'];
			}
			else
			{
				string_div += 'Something went wrong. Please try again.';
			}
			await this.alert_div.setMsg(string_div);
			await this.alert_div.alert_render();
			console.error('Registration failed.');
		}

		await LOADING.restore_all();

		return true;
	}

	async backLoginClick(event)
	{
		console.log('[BTN] backLoginClick');
		event.preventDefault();

		await ROUTER.navigate_to('/login');

		return true;
	}

	async form_limit_addon()
	{
		// limit username input length
		const inputs = document.querySelector('#username');
		inputs.setAttribute('maxlength', '10');

		// limit password input length
		const password = document.querySelector('#password');
		password.setAttribute('maxlength', '16');
		const msg = document.getElementById('err_signup_3');
		//if maxed during input, show error
		password.addEventListener('input', function()
		{
			if (this.value.length >= 16)
			{
				msg.innerText = 'maximum reached (16 characters)';
				msg.style.display = 'block';
			}
		});

		// limit username input char type (alphanumeric)
		inputs.addEventListener('input', function()
		{
			this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
		});

		// limit email input char type (alphanumeric + @ + .)
		const email = document.querySelector('#email');
		email.addEventListener('input', function()
		{
			this.value = this.value.replace(/[^a-zA-Z0-9@.]/g, '');
		});

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
			${await this.html_header()}
			${await this.html_formGroup()}
			${await this.html_loginLine()}
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-signup-ctn d-flex flex-column',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_header()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
			<p class="%p-c">%p-t</p>
		`;

		// [B] SET ATTRIBUTES
		const attributes =
		{
			'%p-c': `ct-signup-header text-center`,
			'%p-t': `42PONG - SIGN UP`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async fg_insert(name, type, err_id)
	{
		let name_str = name;
		if (name === 'confirm')
			name_str = 'password again';

		let name_firstCap = name.charAt(0).toUpperCase() + name.slice(1);
		if (name === 'confirm')
			name_firstCap = 'Confirm Password';

		let in_template = `
			<div class="%formgp-c" @auto>
				<label for="${name}">${name_firstCap}</label>
				<input @at1 @at2 @at3 @at4 @auto>
				<p id="err_signup_${err_id}" class="truncate"></p>
			</div>
		`;

		let attributes =
		{
			'@at1': `id="${name}"`,
			'@at2': `type="${type}"`,
			'@at3': `class="%in-c"`,
			'@at4': `placeholder="Enter ${name_str}"`,
			'@auto': `required="" autocomplete="off" spellcheck="false"`,
		};

		for (const key in attributes)
			in_template = in_template.split(key).join(attributes[key]);

		return in_template;
	}

	async html_formGroup()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
				<form class="%form-c">
					${await this.fg_insert('username', 'text', '1')}
					${await this.fg_insert('email', 'email', '2')}
					${await this.fg_insert('password', 'password', '3')}
					${await this.fg_insert('confirm', 'password', '4')}
					<div @att1 @att2></div>
					<button id="%bi" class="%bc" type="submit">Submit</button>
				</form>
		`;

		// [B] SET atts
		const attributes =
		{
			'%form-c': `ct-su-form d-flex flex-column`,
			'%formgp-c': 'ct-su-formdiv d-flex flex-column',
			'%in-c': `p-2 form-control form-control-sm`,
			'%bi': `btn_signup_submit`,
			'%bc': `ct-btn-dark btn no-hover mt-2`,
			'@att1': `class="alert d-none"`,
			'@att2': `role="alert" id="alert_register"`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_loginLine()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
			<a id="%bid" href="#" class="%bc">%bt</a>
		`;

		// [B] SET atts
		const attributes =
		{
			'%bid': `btn_back_to_login`,
			'%bc': `small text-center text-muted`,
			'%bt': `Back to Login`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

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

const item = new SignupCard();
export default item;
