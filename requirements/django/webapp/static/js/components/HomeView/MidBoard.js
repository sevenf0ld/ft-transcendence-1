// file : MidBoard.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import ModalLayout from '../../layouts/ModalLayout.js';
import ModalRoomJoin from './ModalRoomJoin.js';
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
	'#modal-join',
];

// --- [LOCAL] BUTTONS SECTION
// button tracker
class button
{
	constructor()
	{
		this.arr = {
			'local-pvp': '',
			'local-pve': '',
			'local-tour': '',
			'remote-pvp': '',
			'remote-tour': '',
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
/*
 <div class="ct-board-home h-100 d-flex flex-column justify-content-around">
		<div class="ct-home-section d-flex flex-column justify-content-center align-items-center">
			<h3>Local</h3>
			<div class="ct-section-btns d-flex">
				<button id="btn_local_pve" class="ct-btn-neau">PVE</button>
				<button id="btn_local_pvp" class="ct-btn-neau">PVP</button>
				<button id="btn_local_tour" class="ct-btn-neau">
					Tournament
				</button>
			</div>
		</div>
		<div class="ct-home-section d-flex flex-column justify-content-center align-items-center">
			<h3>Remote</h3>
			<div class="ct-section-btns d-flex">
				<button id="btn_remo_pvp" class="ct-btn-neau">PVP</button>
				<button id="btn_remo_tour" class="ct-btn-neau">
					Tournament
				</button>
			</div>
		</div>
</div>
*/
function html_element()
{
	// [-] HELPER FUNCTION
	async function insert(btnId, name)
	{
		let template = `
		`;
		return 
	}

	// [A] TEMPLATE
	let template = `
		<div class="%main-1c %main-2c">
			<div class="%sec-1c %sec-2c">
				<h3>Online</h3>
				<div class="%bg-c">
					<button id="%btn4-d" @att1 @att2>%btn4-t</button>
					<button id="%btn5-d" @att1 @att2>%btn5-t</button>
				</div>
			</div>
			<div class="%sec-1c %sec-2c">
				<h3>Local</h3>
				<div class="%bg-c">
					<button id="%btn1-d" @att1>%btn1-t</button>
					<button id="%btn2-d" @att1>%btn2-t</button>
					<button id="%btn3-d" @att1>%btn3-t</button>
				</div>
			</div>
		</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%main-1c': 'ct-board-home h-100 d-flex',
		'%main-2c': 'flex-column justify-content-around',
		'%sec-1c': 'ct-home-section d-flex flex-column',
		'%sec-2c': 'justify-content-center align-items-center',
		'%bg-c': 'ct-section-btns d-flex',
		'%btn1-d': 'btn_local_pve',
		'%btn2-d': 'btn_local_pvp',
		'%btn3-d': 'btn_local_tour',
		'%btn4-d': 'btn_remo_pvp',
		'%btn5-d': 'btn_remo_tour',
		'@att1': 'class="ct-btn-neau"',
		'@att2': 'data-bs-toggle="modal" data-bs-target="#modal-join"',
		'%btn1-t': 'PVE',
		'%btn2-t': 'PVP',
		'%btn3-t': 'Tournament',
		'%btn4-t': 'PVP',
		'%btn5-t': 'Tournament',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['local-pve'] = attributes['%btn1-d'];
	btns.arr['local-pvp'] = attributes['%btn2-d'];
	btns.arr['local-tour'] = attributes['%btn3-d'];
	btns.arr['remote-pvp'] = attributes['%btn4-d'];
	btns.arr['remote-tour'] = attributes['%btn5-d'];

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
			throw new Error(`[Err] this class has no export components`);
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
	async localPveClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked: local-pve');

		return true;
	}

	async localPvpClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked : local-pvp');

		return true;
	}

	async localTourClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked : local-tour');

		return true;
	}

	async remotePvpClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : remote-pvp');

		// for popup modal
		const moda = document.querySelector('#modal-join .modal-title');
		moda.innerHTML = 'Available Rooms (PVP)';
		const modata = document.querySelector('#modal-join .modal-body');
		modata.setAttribute('data-room-type', 'pvp');
		modata.innerHTML = "";
		const modaPvp = new ModalRoomJoin(modata);
		modaPvp.render();

		return true;
	}

	async remoteTourClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : remote-tour');

		// for popup modal
		const moda = document.querySelector('#modal-join .modal-title');
		moda.innerHTML = 'Available Rooms (Tournament)';
		const modata = document.querySelector('#modal-join .modal-body');
		modata.setAttribute('data-room-type', 'tour');
		modata.innerHTML = "";
		const modaTour = new ModalRoomJoin(modata);
		modaTour.render();

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['local-pve'].addEventListener(
			'click', async (e) => {await this.localPveClick(e);
		});

		btns.arr['local-pvp'].addEventListener(
			'click', async (e) => {await this.localPvpClick(e);
		});

		btns.arr['local-tour'].addEventListener(
			'click', async (e) => {await this.localTourClick(e);
		});

		btns.arr['remote-pvp'].addEventListener(
			'click', async (e) => {await this.remotePvpClick(e);
		});

		btns.arr['remote-tour'].addEventListener(
			'click', async (e) => {await this.remoteTourClick(e);
		});

		return true;
	}
	
	// --- [05] RENDER
	async modals_render(container)
	{
		let parent_html;

		parent_html = container;
		const modal1 = new ModalLayout(
			parent_html, "modal-join", "Available Rooms (PVP)"
		);
		await modal1.render();

		return true;
	}

	async render()
	{
		const template = await this.init_template();
		const title = this.container.querySelector('.ct-top-title');
		this.container = this.container.querySelector('.ct-top-board');

		title.innerHTML = 'Game Mode';
		this.container.innerHTML = '';
		this.container.innerHTML = template;

		await this.bind_events();
		await this.modals_render(this.container);

		return true;
	}
}


