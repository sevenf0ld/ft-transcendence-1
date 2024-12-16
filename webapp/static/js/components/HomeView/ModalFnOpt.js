// file : ModalHistory.js
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
			'unfriend': '',
			'block': '',
			'cancel-request': '',
			'accept-request': '',
			'decline-request': '',
			'unblock': '',
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
		<button id="%uf-id" class="%uf-c">%uf-t</button>
		<button id="%bl-id" class="%bl-c">%bl-t</button>
		<button id="%cr-id" class="%cr-c">%cr-t</button>
		<button id="%ar-id" class="%ar-c">%ar-t</button>
		<button id="%dr-id" class="%dr-c">%dr-t</button>
		<button id="%ub-id" class="%ub-c">%ub-t</button>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%uf-id': 'btn_unfriend',
		'%uf-c': 'btn-unfriend',
		'%uf-t': 'Unfriend',
		'%bl-id': 'btn_block',
		'%bl-c': 'btn-block',
		'%bl-t': 'Block',
		'%cr-id': 'btn_cancel_request',
		'%cr-c': 'btn-cancel-request',
		'%cr-t': 'Cancel Request',
		'%ar-id': 'btn_accept_request',
		'%ar-c': 'btn-accept-request',
		'%ar-t': 'Accept Request',
		'%dr-id': 'btn_decline_request',
		'%dr-c': 'btn-decline-request',
		'%dr-t': 'Decline Request',
		'%ub-id': 'btn_unblock',
		'%ub-c': 'btn-unblock',
		'%ub-t': 'Unblock',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['unfriend'] = attributes['%uf-id'];
	btns.arr['block'] = attributes['%bl-id'];
	btns.arr['cancel-request'] = attributes['%cr-id'];
	btns.arr['accept-request'] = attributes['%ar-id'];
	btns.arr['decline-request'] = attributes['%dr-id'];
	btns.arr['unblock'] = attributes['%ub-id'];

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
export default class ModalFnOpt
{
	// --- [00] CONSTRUCTOR
	constructor(container, type, target)
	{
		this.container = container;
		this.type = type;
		this.target = target;
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
	async btnDisable(element)
	{
		element.disabled = true;
		element.classList.add('d-none');

		return true;
	}

	async btnEnable(element)
	{
		element.disabled = false;
		element.classList.remove('d-none');

		return true;
	}

	async disable_buttons()
	{
		for (const key in btns.arr)
			await this.btnDisable(btns.arr[key]);
		if (this.type === 'added')
		{
			await this.btnEnable(btns.arr['unfriend']);
			await this.btnEnable(btns.arr['block']);
		}
		if (this.type === 'request-out')
		{
			await this.btnEnable(btns.arr['cancel-request']);
		}
		if (this.type === 'request-in')
		{
			await this.btnEnable(btns.arr['accept-request']);
			await this.btnEnable(btns.arr['decline-request']);
		}
		if (this.type === 'blocked')
		{
			await this.btnEnable(btns.arr['unblock']);
		}
		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		await this.disable_buttons();

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
