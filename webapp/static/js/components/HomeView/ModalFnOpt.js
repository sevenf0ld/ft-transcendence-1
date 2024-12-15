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
			'join': '',
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
function html_modal_added
{
	// [-] HELPER FUNCTION
	// [A] TEMPLATE
	let template = `
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [D] HTML RETURN
	return template;
}

function html_modal_request_in()
{
	// [-] HELPER FUNCTION
	// [A] TEMPLATE
	let template = `
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [D] HTML RETURN
	return template;
}

function html_modal_request_out()
{
	// [-] HELPER FUNCTION
	// [A] TEMPLATE
	let template = `
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [D] HTML RETURN
	return template;
}

function html_modal_blocked()
{
	// [-] HELPER FUNCTION
	// [A] TEMPLATE
	let template = `
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [D] HTML RETURN
	return template;
}

// HTML elements bundle
const ele =
{
	html_modal_added,
	html_modal_request_in,
	html_modal_request_out,
	html_modal_blocked,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class ModalFnOpt
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
		template += ele.html_modal_added();
		template += ele.html_modal_request_in();
		template += ele.html_modal_request_out();
		template += ele.html_modal_blocked();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();
	
		return template;
	}

	// --- [04] EVENT
	async bind_events()
	{
		await btns.read_buttons();

		return true;
	}

	// --- [05] RENDER
	async render()
	{
		const template = await this.init_template();

		this.container.insertAdjacentHTML('beforeend', template);

		await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
