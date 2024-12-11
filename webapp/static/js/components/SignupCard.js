// file : SignupCard.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import LoginView from '../views/LoginView.js';
import * as FormValiSignup from '../core/helpers/formVali-su.js';
import * as FETCH from './SignupCard_fetch.js';
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
			'signup': '',
			'back': '',
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
		'%p-c': `ct-signup-header text-center`,
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
	function insert(name, type, err_id)
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

	// [A] TEMPLATE
	let template = `
			<form class="%form-c">
				${insert('username', 'text', '1')}
				${insert('email', 'email', '2')}
				${insert('password', 'password', '3')}
				${insert('confirm', 'password', '4')}
				<button id="%bi" class="%bc" type="submit">Submit</button>
			</form>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%form-c': `ct-su-form d-flex flex-column`,
		'%formgp-c': 'ct-su-formdiv d-flex flex-column',
		'%in-c': `p-2 form-control form-control-sm`,
		'%bi': `btn_signup`,
		'%bc': `ct-btn-dark btn no-hover mt-2`,
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['signup'] = attributes['%bi'];

	// [D] HTML RETURN
	return template;
}

function html_loginLine()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
		<a id="%bid" href="#" class="%bc">%bt</a>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%bid': `btn_back_to_login`,
		'%bc': `small text-center text-muted`,
		'%bt': `Back to Login`,
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['back'] = attributes['%bid'];

	// [D] HTML RETURN
	return template;
}

// HTML elements bundle
const ele =
{
	html_header,
	html_formGroup,
	html_loginLine,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class SignupCard
{
	constructor(container)
	{
		this.container = container;
		this.components = {};
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
		template += ele.html_loginLine();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	// --- [04] EVENT
	async submitClick()
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : submit');
		if (await FormValiSignup.validate() === false)
		{
			console.log('Form is invalid!');
			return;
		}
		console.log('Form is valid!');

		const registerFetch = new FETCH.fetch_register();
		const result = await registerFetch.fetchData();
		if (result == 'register-successful')
		{
			alert('Registration successful.');
			const login = new LoginView();
			await login.render();
		}
		else
		{
			console.error('Registration failed.');
		}

		return true;
	}

	async backLoginClick(event)
	{
		console.log('[EVENT] button clicked : back to login');
		event.preventDefault();

		const login = new LoginView();
		await login.render();

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['signup'].addEventListener(
			'click', async (e) => {await this.submitClick(e);}
		);

		btns.arr['back'].addEventListener(
			'click', async (e) => {await this.backLoginClick(e);}
		);

		return true;
	}

	// --- [05] RENDER
	async render()
	{
		const template = await this.init_template();
		
		this.container.innerHTML = '';
		this.container.innerHTML = template;

		await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
