// file : template.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import HtmlTrimmer from '../core/helpers/HtmlTrimmer.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// this is a template file for creating new project
// elements such as layouts, views, and components
// it should not be linked or used in any other file
// only referrance purposes
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// --- [LOCAL] EXPORTED COMPONENTS
// usage : insert querySelector's value of an element
// 		   to register as export element; first one
// 		   is always default
const getEle = [
	'.example',
];

// --- [LOCAL] BUTTONS SECTION
// button tracker
class button
{
	constructor()
	{
		this.arr = {
			'example-1': '',
			'example-2': '',
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
	function insert(example)
	{
		return "etc-" + example;
	}

	// [A] TEMPLATE
	let template = `
		<div class="%ele-c">
			<button id="%tp-1">${insert('example')}</button>
			<button id="%tp-2">${insert('example')}</button>
		</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%ele-c': 'example d-flex flex-column px-5 py-4',
		'%tp-1': 'example-1',
		'%tp-2': 'example-2',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['example-1'] = attributes['%tp-1'];
	btns.arr['example-2'] = attributes['%tp-2'];

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
export default class IntroLayout
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
	async test1Click(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked : example-1');

		return true;
	}

	async test2Click(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked : example-2');

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();
		btns.arr['example-1'].addEventListener(
			'click', async (e) => {await this.test1Click(e);
		});
		btns.arr['example-2'].addEventListener(
			'click', async (e) => {await this.test2Click(e);
		});

		return true;
	}
	
	// --- [05] RENDER
	async modals_render()
	{
		let parent_html;

		parent_html = this.container;
		const modal1 = new ModalLayout(
			parent_html, "modal-settings", "Settings"
		);
		await modal1.render();

		parent_html = await modal1.get();
		const modalSettings = new ModalSettings(parent_html);
		await modalSettings.render();

		return true;
	}

	async render()
	{
		const template = await this.init_template();

		this.container.innerHTML = '';
		this.container.innerHTML = template;

		await this.bind_events();
		await this.modals_render();

		return true;
	}
}
