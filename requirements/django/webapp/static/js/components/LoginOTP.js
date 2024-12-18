// file : LoginCard.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import LoginView from '../views/LoginView.js';
import HomeView from '../views/HomeView.js';
import * as LOADING from '../core/helpers/loading.js';
import * as FETCH from './LoginCard_fetch.js';
import alert_utils from '../core/helpers/alert-utils.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// --- [LOCAL] EXPORTED COMPONENT
// usage : insert querySelector's value of an element
// 		   to register as export element; first one
// 		   is always default
const getEle = [
];

// --- [LOCAL] BUTTONS SECTION
// button tracker
class button
{
	constructor()
	{
		this.arr = {
			'submitOtp': '',
			'goback': '',
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
function html_element()
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

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%otp-c': `ct-login-otp`,
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

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['submitOtp'] = 'btn_otp_submit';
	btns.arr['goback'] = 'btn_otp_goback';

	// [D] HTML RETURN
	return template;
}

// HTML elements bundle
const ele =
{
	html_element,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class LoginOTP
{
	// --- [00] CONSTRUCTOR
	constructor(loginFetch_obj)
	{
		this.loginFetch_obj = loginFetch_obj;
		this.container = document.getElementById("media");
		this.components = {};
		this.alert_div = null;
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
		template += ele.html_element();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	// --- [04] EVENT
	async submitOtpClick(event)
	{
		console.log('[EVENT] button clicked : submitOtp');
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

				localStorage.setItem('user', JSON.stringify(loginFetch.fetch_obj.rdata['user']));
				await new Promise(r => setTimeout(r, 1500));
				const HOME = new HomeView();
				await HOME.render();
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
		console.log('[EVENT] button clicked : goback');
		event.preventDefault();

		const LOGIN = new LoginView();
		await LOGIN.render();

		return true;
	}

	async submitOtpInput(event)
	{
		const value = event.target.value.replace(/\D/g, '');
		event.target.value = value;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['submitOtp'].addEventListener(
			'click', async (e) => await this.submitOtpClick(e)
		);
		const inputForm = document.querySelector('.ct-login-otp-input');
		inputForm.addEventListener(
			'input', async (e) => await this.submitOtpInput(e)
		);
		btns.arr['goback'].addEventListener(
			'click', async (e) => await this.gobackClick(e)
		);

		return true;
	}

	// --- [05] RENDER
	async render()
	{
		const template = await this.init_template();
		
		// [ for modals ]
		// this.container.insertAdjacentHTML('beforeend', template);
		
		this.container.innerHTML = '';
		this.container.innerHTML = template;
		this.alert_div = new alert_utils(document.querySelector('.ct-alert-otp'));

		await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
