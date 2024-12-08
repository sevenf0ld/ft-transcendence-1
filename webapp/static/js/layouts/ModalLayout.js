// file : ModalLayout.js
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
	'.modal-body',
	'.modal-header',
	'.modal-footer',
];

// --- [LOCAL] BUTTONS SECTION
// button tracker class
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

// HTML ELEMENTS
function html_modalCard(modal_name, title)
{
	// [-] HELPER FUNCTION
	// div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"

	// [A] TEMPLATE
	let template = `
	<div @1att1 @1att2 @1att3 @1att4 @1att5>
		<div class="%dlog-1c %dlog-2c">
			<div class="%cnt-c">
				<div class="%hdr-c">
					<h1 class="%ttl-c">%ttl-t</h1>
				</div>
				<div class="%bdy-c"></div>
				<div class="%ftr-c"></div>
			</div>
		</div>
	</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'@1att1': `class="modal"`,
		'@1att2': `id="${modal_name}"`,
		'@1att3': `tabindex="-1"`,
		'@1att4': `aria-labelledby="${modal_name}"`,
		'@1att5': `aria-hidden="true"`,
		'%dlog-1c': `modal-dialog modal-sm modal-dialog-centered`,
		'%dlog-2c': `modal-dialog-scrollable`,
		'%cnt-c': `modal-content`,
		'%hdr-c': `modal-header`,
		'%ttl-c': `modal-title text-center w-100`,
		'%ttl-t': `${title}`,
		'%bdy-c': `modal-body`,
		'%ftr-c': `modal-footer`,
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}

const ele =
{
	html_modalCard,
};

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class ModalLayout
{
	// --- [00] CONSTRUCTOR
	constructor(container, modal_name, title)
	{
		this.container = container;
		this.components = {};
		this.modal_name = modal_name;
		this.modal_title = title;
	}

	// --- [01] GETTER
	async get(element = 'default')
	{
		getEle[0] = `#${this.modal_name} .modal-body`;

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
		template += ele.html_modalCard(this.modal_name,this.modal_title);

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
		let template = await this.init_template();
		this.container.insertAdjacentHTML('beforeend', template);

		//await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
