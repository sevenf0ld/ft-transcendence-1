// file : ModalAdd.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// --- [LOCAL] EXPORTED COMPONENTS
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
			'submit': '',
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
function html_element()
{
	// [-] HELPER FUNCTION
	// [A] TEMPLATE
	let template = `
		<div class="%addf-c">
			<input type="in-t" class="%in-1c" @att1 @att2 @att3>
			<button id="%addfb-id" class="%addfb-c">%addfb-t</button>
			<div class="%addfmsg-c" role="%addfmsg-r">%addfmsg-t</div>
		</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%addf-c': 'add-friend-ctn',
		'%in-t': 'text',
		'%in-1c': 'add-friend-input ct-home-input',
		'@att1': 'placeholder="Enter username"',
		'@att2': 'required autocomplete="off"',
		'@att3': 'maxlength="16"',
		'%addfmsg-c': 'ct-alert-addFriend alert d-none',
		'%addfmsg-r': 'alert',
		'%addfmsg-t': 'User not found',
		'%addfb-id': 'btn_add_friend_submit',
		'%addfb-c': 'add-friend-btn',
		'%addfb-t': 'Add Friend',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr.submit = attributes['%addfb-id'];

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
export default class ModalAddFriend
{
	// --- [00] CONSTRUCTOR
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
		template += ele.html_element();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();
	
		return template;
	}

	// --- [04] EVENT
	async submit_click()
	{
		return true;
	}

	async field_handle()
	{
		const input = document.querySelector('.add-friend-input');

		// only allow it to write alphanumeric characters
		// and - characters
		input.addEventListener('keypress', (e) =>
		{
			const key = e.key;
			const regex = /[a-zA-Z0-9-]/;
			if (!regex.test(key))
				e.preventDefault();
		});

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['submit'].addEventListener(
			'click', async (e) => {await this.submit_click();}
		);

		await this.field_handle();

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
