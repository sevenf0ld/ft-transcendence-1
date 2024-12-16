// file : LoginCard.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import SignupView from '../views/SignupView.js';
import * as FETCH from './LoginCard_fetch.js';
import HomeView from '../views/HomeView.js';
import * as LOADING from '../core/helpers/loading.js';
import LoginOTP from './LoginOTP.js';
import alert_utils from '../core/helpers/alert-utils.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// Special-events
// -------------------------------------------------- //
// It's for the intra button
const intraFetch = new FETCH.fetch_intra();
document.addEventListener('DOMContentLoaded', async (e) => {
	const result = await intraFetch.run();
	if (result === 'exchange-successful')
	{
		const HOME = new HomeView();
		HOME.render();
	}
});
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
			'login': '',
			'intra': '',
			'signup': '',
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
function html_header()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
		<p class="%p-c">%p-t</p>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%p-c': `ct-login-header text-center`,
		'%p-t': `42PONG - SIGN IN`,
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}


function html_formGroup()
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

	// [B] SET ATTRIBUTES
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

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['login'] = attributes['%lbid'];

	// [D] HTML RETURN
	return template;
} 

function html_continueLine()
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

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%div-c': `d-flex align-items-center`,
		'%hr-c': `flex-grow-1`,
		'%span-c': `px-2 text-muted`,
		'%span-t': `or continue`,
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}

function html_buttonIntra()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<button id="%ibid" class="%1ibc %2ibc">
		<span>%span-t1</span>
		<span>%span-t2</span>
	</button>
	`;

	// [B] SET ATTRIBUTES
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

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['intra'] = attributes['%ibid'];

	// [D] HTML RETURN
	return template;
}

function html_signUpLine()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<div class="%div-c">
		<span>%span-t</span>
		<a id="%aid" href="#">%a-t</a>
	</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%div-c': `small text-muted text-center`,
		'%span-t': `Don't have an account?`,
		'%aid': `btn_signup`,
		'%a-t': `Sign Up`,
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['signup'] = attributes['%aid'];

	// [D] HTML RETURN
	return template;
}

// HTML elements bundle
const ele =
{
	html_header,
	html_formGroup,
	html_continueLine,
	html_buttonIntra,
	html_signUpLine,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class LoginCard
{
	// --- [00] CONSTRUCTOR
	constructor(container)
	{
		this.container = container;
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
		template += ele.html_header();
		template += ele.html_formGroup();
		template += ele.html_continueLine();
		template += ele.html_buttonIntra();
		template += ele.html_signUpLine();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

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

	// --- [04] EVENT
	async loginClick(event)
	{
		console.log('[EVENT] button clicked : login');
		event.preventDefault();

		if (!await this.check_input())
			return false;

		this.alert_div.alert_clear();
		await LOADING.disable_all();

		const loginFetch = new FETCH.fetch_login();
		const fetch_result = await loginFetch.fetchData();

		console.log(fetch_result);
		if (fetch_result === 'login-otp')
		{
			await LOADING.restore_all();
			const OTP = new LoginOTP(loginFetch);
			await OTP.render();
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

			await new Promise(r => setTimeout(r, 2000));
			await LOADING.restore_all();

			const HOME = new HomeView();
			await HOME.render();
		}

		await LOADING.restore_all();

		return true;
	}

	async intraClick(event)
	{
		console.log('[EVENT] button clicked : intra');
		event.preventDefault();

		await intraFetch.redirect(event);

		return true;
	}

	async signupClick(event)
	{
		console.log('[EVENT] button clicked : signup');
		event.preventDefault();

		const signup = new SignupView();
		await signup.render();

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['login'].addEventListener(
			'click', async (e) => {await this.loginClick(e);}
		);
		btns.arr['intra'].addEventListener(
			'click', async (e) => {await this.intraClick(e);}
		);
		btns.arr['signup'].addEventListener(
			'click', async (e) => {await this.signupClick(e);}
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
		this.alert_div = new alert_utils(document.getElementById('alert_login'));

		await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
