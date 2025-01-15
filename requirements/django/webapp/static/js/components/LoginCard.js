// file : LoginCard.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import LOGIN_OTP from './LoginOTP.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import * as FETCH from './LoginCard_fetch.js';
import * as LOADING from '../core/helpers/loading.js';
import ALERT_UTILS from '../core/helpers/alert-utils.js';
import SIGNUP_VIEW from '../views/SignupView.js';
import HOME_VIEW from '../views/HomeView.js';
import WEB_SOCKET from '../core/websocket_mng.js';
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
// Special-events
// -------------------------------------------------- //
// It's for the intra button
/*
const intraFetch = FETCH.FETCH_INTRA;
await intraFetch.init();
document.addEventListener('DOMContentLoaded', async (e) => {
	const result = await intraFetch.run();
	if (result === 'exchange-successful')
	{
		await localStorage.setItem('user', JSON.stringify(
			intraFetch.fetch_obj.rdata['user'])
		);
		await ROUTER.navigate_to('/home');
	}
});
*/
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class LoginCard
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
			'login': null,
			'intra': null,
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
		this.main_ctn = document.querySelector('.ct-login-card-ctn');
		this.buttons['login'] = document.getElementById('btn_login');
		this.buttons['intra'] = document.getElementById('btn_intra');
		this.buttons['signup'] = document.getElementById('btn_signup');

		await ALERT_UTILS.init();
		ALERT_UTILS.container = document.getElementById('alert_login');
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
		this.buttons['login'].addEventListener(
			'click', async (event) => {await this.loginClick(event);}
		);

		this.buttons['intra'].addEventListener(
			'click', async (event) => {await this.intraClick(event);}
		);

		this.buttons['signup'].addEventListener(
			'click', async (event) => {await this.signupClick(event);}
		);

		await this.intra_loading_check();
		await this.check_intra();

		return true;
	}

	async intra_loading_check()
	{
		//if local storage has intra_state, render the loading screen
		const intra_state = localStorage.getItem('intra_state');
		if (intra_state !== null)
		{
			await LOADING.disable_all();
			await LOADING.loading_page('show');
			await new Promise((r) => setTimeout(r, 5000));
			if (document.getElementById('load_page'))
				alert('Please clear your browser to access the page again.');
		}
	}

	async check_intra()
	{
		const intraFetch = FETCH.FETCH_INTRA;
		await intraFetch.init();
		const result = await intraFetch.run();
		if (result === 'exchange-successful')
		{
			await localStorage.setItem('user', JSON.stringify(
				intraFetch.fetch_obj.rdata['user'])
			);
			await ROUTER.navigate_to('/home');
			localStorage.setItem('login-event', 'login' + Math.random());
			await new Promise(r => setTimeout(r, 1000));
		}
	}

	async loginClick(event)
	{
		event.preventDefault();
		console.log('[BTN] loginClick');

		if (!await this.check_input())
			return false;

		this.alert_div.alert_clear();
		await LOADING.disable_all();

		const loginFetch = FETCH.FETCH_LOGIN;
		await loginFetch.init();
		const fetch_result = await loginFetch.fetchData();

		console.log('[FETCH] login-button : ', fetch_result);
		if (fetch_result === 'login-otp')
		{
			await LOADING.restore_all();
			LOGIN_OTP.container = document.getElementById('media');
			LOGIN_OTP.loginFetch_obj = loginFetch;
			await LOGIN_OTP.render('replace');
		}
		if (fetch_result === 'p1-failed')
		{
			await LOADING.restore_all();
			await this.alert_div.setType('alert-danger');
			let string = loginFetch.fetch_obj.rdata['non_field_errors'];
			await this.alert_div.setMsg('Login failed: ' + string);
			await this.alert_div.alert_render();
		}
		if (fetch_result === 'p2-failed-server-error')
		{
			await LOADING.restore_all();
			await this.alert_div.setTpe('alert-danger');
			await this.alert_div.setMsg('Server error');
			await this.alert_div.alert_render();
		}
		if (fetch_result === 'login-successful')
		{
			await this.alert_div.setType('alert-success');
			await this.alert_div.setMsg('Login successful! Logging in...');
			await this.alert_div.alert_render();

			localStorage.setItem('user', JSON.stringify(loginFetch.fetch_obj.rdata['user']));
			await new Promise(r => setTimeout(r, 2000));
			await ROUTER.navigate_to('/home');
			localStorage.setItem('login-event', 'login' + Math.random());
		}

		await LOADING.restore_all();

		return true;
	}

	async intraClick(event)
	{
		event.preventDefault();
		console.log('[BTN] intraClick');

		const intraFetch = FETCH.FETCH_INTRA;
		await intraFetch.init();
		const result = await intraFetch.run();
		await intraFetch.redirect(event);

		return true;
	}

	async signupClick(event)
	{
		event.preventDefault();
		console.log('[BTN] signupClick');

		await ROUTER.navigate_to('/signup');

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
			${await this.html_continueLine()}
			${await this.html_buttonIntra()}
			${await this.html_signUpLine()}
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-login-card-ctn',
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

		// [B] SET atts
		const attributes =
		{
			'%p-c': `ct-login-header text-center`,
			'%p-t': `42PONG - SIGN IN`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_formGroup()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
			<form class="%form-c">
				<div class="%formgp-c">
					<label for="%id1">Username</label>
					<input id="%id1" type="%t1" @cas placeholder="%p1" @auto>
				</div>
				<div class="%formgp-c %last">
					<label for="%id2">Password</label>
					<input id="%id2" type="%t2" @cas placeholder="%p2" @auto>
				</div>
				<button id="%lbid" class="%lbc" type="submit">Sign In</button>
				<div @att1 @att2></div>
			</form>
		`;

		// [B] SET atts
		const attributes =
		{
			'%form-c': `ct-login-form d-flex flex-column`,
			'%formgp-c': 'ct-form-group d-flex flex-column',
			'%last': 'mb-3',
			'@cas': `class="p-2 form-control form-control-sm"`,
			'@auto': `required="" autocomplete="off" spellcheck="false"`,
			'%id1': `username`,
			'%t1': `text`,
			'%p1': `Enter your username`,
			'%id2': `password`,
			'%t2': `password`,
			'%p2': `Enter your password`,
			'@att1': `class="alert d-none"`,
			'@att2': `role="alert" id="alert_login"`,
			'%lbid': `btn_login`,
			'%lbc': `ct-btn-dark btn no-hover`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	} 

	async html_continueLine()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
			<div class="%div-c">
				<hr class="%hr-c">
				<span class="%span-c">%span-t</span>
				<hr class="%hr-c">
			</div>
		`;

		// [B] SET atts
		const attributes =
		{
			'%div-c': `d-flex align-items-center`,
			'%hr-c': `flex-grow-1`,
			'%span-c': `px-2 text-muted`,
			'%span-t': `or continue`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_buttonIntra()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
		<button id="%ibid" class="%1ibc %2ibc">
			<span>%span-t1</span>
			<span>%span-t2</span>
		</button>
		`;

		// [B] SET atts
		const attributes =
		{
			'%ibid': `btn_intra`,
			'%1ibc': `btn btn-light d-flex`,
			'%2ibc': `justify-content-center align-items-center`,
			'%span-t1': `(42)`,
			'%span-t2': `Sign in with Intra`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_signUpLine()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
		<div class="%div-c">
			<span>%span-t</span>
			<a id="%aid" href="#">%a-t</a>
		</div>
		`;

		// [B] SET atts
		const attributes =
		{
			'%div-c': `small text-muted text-center`,
			'%span-t': `Don't have an account?`,
			'%aid': `btn_signup`,
			'%a-t': `Sign Up`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async check_input()
	{
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		if (username === '' || password === '')
		{
			await this.alert_div.setType('alert-danger');
			await this.alert_div.setMsg('Please enter your username and password!');
			await this.alert_div.alert_render();
			return false;
		}

		return true;
	}

	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
}

const item = new LoginCard();
export default item;
