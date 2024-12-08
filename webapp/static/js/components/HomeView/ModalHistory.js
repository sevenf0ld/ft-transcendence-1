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
function html_element()
{
	// [-] HELPER FUNCTION
	function gen_list(date, result, type, target)
	{
		const upperResult = result.toUpperCase();
		let typeText = 'PVP';
		if (type==='tour')
			typeText = 'TOUR';

		let template = `
			<div class="%hstt-group">
				<p class="%hstt-date-c">%hstt-date-t</p>
				<p class="%hstt-result-c">%hstt-result-t</p>
				<p class="%hstt-type-c">%hstt-type-t</p>
				<p class="%hstt-des-c">%hstt-des-t</p>
				<p class="%hstt-target-c" @att1>%hstt-target-t</p>
			</div>
		`

		const attributes =
		{
			'%hstt-group': 'hst-list-group-item',
			'%hstt-date-c': 'history-date',
			'%hstt-date-t': date,
			'%hstt-result-c': `history-result ${result.toLowerCase()}`,
			'%hstt-result-t': `${upperResult}`,
			'%hstt-type-c': `history-type ${type.toLowerCase()}`,
			'%hstt-type-t': `${typeText}`,
			'%hstt-des-c': 'history-des',
			'%hstt-des-t': 'Played with ',
			'%hstt-target-c': 'history-target truncate',
			'%hstt-target-t': `${target}`,
			'@att1': `data-bs-tooltip="tooltip" title="${target}"`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		return template;
	}

	// [A] TEMPLATE
	let template = `
		<div class="%history-c">
			<div class="%hsttl-c">
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'DemonKiller123')}
				${gen_list('JAN-01 (01AM)', 'lost', 'pvp', 'DemonKiller123')}
				${gen_list('JAN-01 (01AM)', 'won', 'tour', 'AlienInvasion')}
				${gen_list('JAN-01 (01AM)', 'lost', 'tour', 'AlienInvasion')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
				${gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal')}
			</div>
		</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%history-c': 'history-main d-flex flex-column',
		'%hsttl-c': 'hst-list-group',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

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
export default class ModalRoomJoin
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
