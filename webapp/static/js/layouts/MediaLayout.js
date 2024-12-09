// file : MediaLayout.js
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
// --- [LOCAL] EXPORTED COMPONENT
// usage : insert querySelector's value of an element
// 		   to register as export element; first one
// 		   is always default
const getEle = [
	'#media',
	'#small-media',
];

// --- [LOCAL] BUTTONS SECTION
// button tracker class<F4>
class button
{
	constructor()
	{
		this.arr = {
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
function html_card()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
		<div class="%big-1c %big-2c %big-3c" id="%big-d"></div>
		<div class="%sma-1c %sma-2c %sma-3c" id="%sma-d">
			<img src="%img-src" alt="%img-alt" class="%img-c">
			<p>%text</p>
		</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%big-1c': 'd-none d-xxl-flex d-flex flex-column',
		'%big-2c': 'align-items-center justify-content-center',
		'%big-3c': 'h-100 w-100',
		'%big-d': 'media',
		'%sma-1c': 'd-xxl-none d-flex flex-column',
		'%sma-2c': 'align-items-center justify-content-center',
		'%sma-3c': 'h-100 w-100',
		'%sma-d': 'small-media',
		'%img-src': '/static/assets/images/media.svg',
		'%img-alt': 'media',
		'%img-c': 'ct-media-img img-fluid mb-3 w-50',
		'%text': 'Ooops! media too small',
	};
	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}

// html elements bundle
const ele =
{
	html_card,
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class MediaLayout
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.container = document.querySelector('body');
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
		template += ele.html_card();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	// --- [04] EVENT
	// --- [05] RENDER
	async render()
	{
		const template = await this.init_template();

		this.container.innerHTML = '';
		this.container.innerHTML = template;

		//await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
