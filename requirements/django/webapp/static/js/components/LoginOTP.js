// file : LoginOTP.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import * as LOADING from '../core/helpers/loading.js';
import * as FETCH from './LoginCard_fetch.js';
import ALERT_UTILS from '../core/helpers/alert-utils.js';
import LOGIN_VIEW from '../views/LoginView.js';
import HOME_VIEW from '../views/HomeView.js';
import ROUTER from '../core/router.js';
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
class LoginOTP
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
			'submitOtp': null,
			'goback': null,
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.alert_div = null;
		this.loginFetch_obj = null;
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
		this.main_ctn = document.querySelector('.ct-login-otp-ctn');
		this.buttons['submitOtp'] = document.getElementById('btn_otp_submit');
		this.buttons['goback'] = document.getElementById('btn_otp_goback');

		await ALERT_UTILS.init();
		ALERT_UTILS.container = document.querySelector('.ct-alert-otp');
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
		const inputForm = document.querySelector('.ct-login-otp-input');

		inputForm.addEventListener(
			'input', async (e) => await this.submitOtpInput(e)
		);

		this.buttons['submitOtp'].addEventListener(
			'click', async (event) => {await this.submitOtpClick(event);}
		);


		this.buttons['goback'].addEventListener(
			'click', async (e) => await this.gobackClick(e)
		);

		return true;
	}

	async submitOtpClick(event)
	{
		console.log('[BTN] submitOtpClick');
		event.preventDefault();

		await LOADING.disable_all();

		const loginFetch = this.loginFetch_obj;
		await loginFetch.set_phase(3);
		
		const otp = document.querySelector('.ct-login-otp-input').value;
		const otp_verify = await loginFetch.verify_otp(otp);
		if (otp_verify === false)
		{
			this.alert_div.alert_clear();
			this.alert_div.setType('alert-danger');
			this.alert_div.setMsg('Invalid OTP: 6 digits required');
			this.alert_div.alert_render();
		}
		else
		{
			loginFetch.set_otp(otp);
			this.alert_div.alert_clear();
			this.alert_div.setType('alert-info');
			this.alert_div.setMsg('Verifying OTP...');
			this.alert_div.alert_render();
			const fetch_result = await loginFetch.fetchData();
			await new Promise(r => setTimeout(r, 1000));

			if (fetch_result === 'login-successful')
			{
				this.alert_div.alert_clear();
				this.alert_div.setType('alert-success');
				this.alert_div.setMsg('Login successful!');
				this.alert_div.alert_render();

				localStorage.setItem(
					'user', JSON.stringify(loginFetch.fetch_obj.rdata['user'])
				);

				await new Promise(r => setTimeout(r, 1500));
				//const HOME = HOME_VIEW;
				//await HOME.render();
				await ROUTER.navigate_to('/home');
			}
			else
			{
				this.alert_div.alert_clear();
				this.alert_div.setType('alert-danger');
				let string = loginFetch.fetch_obj.rdata['detail'];
				this.alert_div.setMsg('Verification failed: ' + string);
				this.alert_div.alert_render();
			}
		}

		await LOADING.restore_all();

		return true;
	}

	async gobackClick(event)
	{
		event.preventDefault();
		console.log('[BTN] gobackClick');

		//const LOGIN = LOGIN_VIEW;
		//await LOGIN.render();
		await ROUTER.navigate_to('/login');

		return true;
	}

	async submitOtpInput(event)
	{
		const value = event.target.value.replace(/\D/g, '');
		event.target.value = value;
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
		<div class="%otp-c">
			<div class="%oth-c">%oth-t</div>
			<img class="%img-c" src="%img-src" alt="%img-alt" />
			<div class="%bsm-c" @att0>%bsm-t</div>
			<input type="%oti-ty" class="%oti-1c" @att1 placeholder="%oti-p" />
			<button id="%ots-id" class="%ots-c">%ots-t</button>
			<button id="%otg-id" class="%otg-c">%otg-t</button>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%otp-c': `ct-login-otp-ctn`,
			'%oth-c': `ct-login-otp-header`,
			'%oth-t': `OTP Verification`,
			'%img-c': `ct-login-otp-img`,
			'%img-src': `/static/assets/images/mail.svg`,
			'%img-alt': `otp`,
			'%bsm-c': `alert alert-info ct-alert-otp`,
			'@att0': `role="alert"`,
			'%bsm-t': `OTP has been sent to your email!`,
			'%oti-ty': `text`,
			'%oti-1c': `ct-login-otp-input form-control form-control-sm`,
			'@att1': `maxlength="6" required`,
			'%oti-p': `Enter 6-digit OTP`,
			'%ots-id': `btn_otp_submit`,
			'%ots-c': `ct-btn-login-otp`,
			'%ots-t': `Verify OTP`,
			'%otg-id': `btn_otp_goback`,
			'%otg-c': `ct-btn-login-goback text-decoration-none text-muted`,
			'%otg-t': `Go Back`,
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

const item = new LoginOTP();
export default item;
