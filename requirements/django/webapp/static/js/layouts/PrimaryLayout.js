// file : PrimaryLayout.js
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
	'.ct-main-lpanel',
	'.ct-mpanel-top',
	'.ct-top-title',
	'.ct-top-board',
	'.ct-bottom-right',
	'.ct-bottom-left',
	'.ct-main-rpanel',
];

// --- [LOCAL] BUTTONS SECTION
// button tracker class
class button
{
	constructor()
	{
		this.arr = {
			'logo': '',
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
function html_header()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<header class="%h-c">
		<div class="%pw-c">
			<h1 id="lg-i" class="%lg-c">%lg-t</h1>
		</div>
	</header>
	`

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%h-c': 'd-flex justify-content-center align-items-center w-100',
		'%pw-c': 'ct-page-width',
		'%lg-i': 'logo',
		'%lg-c': 'h1 py-2',
		'%lg-t': '42Pong',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['logo'] = attributes['%lg-i'];

	// [D] HTML RETURN
	return template;
}

function html_main()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<main class="%m-c">
		<div class="%pw-c">
			<div class="%lp-1c %lp-2c"></div>
			<div class="%mp-c">
				<div class="%mtp-1c %mtp-2c">
					<h3 class="%tph-c">-</h3>
					<div class="%tpd-c"></div>
				</div>
				<div class="%mbp-c">
					<div class="%bl-1c %bl-2c">
						<p class="%btp-c">%btp-t</p>
					</div>
					<div class="%br-1c %br-2c">
						<p class="%btp-c">%btp-t</p>
					</div>
				</div>
			</div>
			<div class="%rp-1c"></div
		</div>
	</main>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%m-c': 'd-flex justify-content-center align-items-center',
		'%pw-c': 'ct-page-width ct-main p-4 d-flex',
		'%lp-1c': 'ct-main-lpanel d-flex flex-column',
		'%lp-2c': 'align-items-center w-100',
		'%mp-c': 'ct-main-mpanel d-flex flex-column',
		'%mtp-1c': 'ct-mpanel-top w-100 d-flex',
		'%mtp-2c': 'flex-column align-items-center',
		'%tph-c': 'ct-top-title h3 py-2 text-center',
		'%tpd-c': 'ct-top-board',
		'%mbp-c': 'ct-mpanel-bottom d-flex justify-content-center',
		'%bl-1c': 'ct-bottom-left h-100 d-flex',
		'%bl-2c': 'justify-content-center align-items-center',
		'%btp-c': 'ct-bottom-placeholder',
		'%btp-t': '(placeholder)',
		'%br-1c': 'ct-bottom-right h-100 d-flex',
		'%br-2c': 'justify-content-center align-items-center',
		'%rp-1c': 'ct-main-rpanel d-flex flex-column',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER

	// [D] HTML RETURN
	return template;
}

function html_footer()
{
	// [-] HELPER FUNCTION

	// [A] TEMPLATE
	let template = `
	<footer class="%f-1c %f-2c">
		<div class="%pw-c">
			<p class="%p-c">%p-t</p>
		</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%f-1c': 'text-center w-100 d-flex',
		'%f-2c': 'justify-content-center align-items-center',
		'%pw-c': 'ct-page-width',
		'%p-c': 'py-3',
		'%p-t': `&copy; ${new Date().getFullYear()} - 42Pong`,
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
	html_header,
	html_main,
	html_footer,
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class PrimaryLayout
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
		template += ele.html_header();
		template += ele.html_main();
		template += ele.html_footer();

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

		this.container.innerHTML = '';
		this.container.innerHTML = template;

		//await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
