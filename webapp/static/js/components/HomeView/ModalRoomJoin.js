// file : ModalRoomJoin.js
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
	function room_display_board()
	{
		const template = `
			<div class="%rdb-c">
				<div class="%rdttl-c">
					<div class="%rdtt-status-c">%rdtt-status-t</div>
					<div class="%rdtt-roomid-c">%rdtt-roomid-t</div>
					<div class="%rdtt-slot-c">%rdtt-slot-t</div>
					<div class="%rdtt-name-c">%rdtt-name-t</div>
				</div>
				<div class="%rdbl-c">
					<div class="%list-c" data-roomid="%romid-t">
						<div class="%st-c" data-status="%st-dt"></div>
						<div class="%romid-c">%romid-t</div>
						<div class="%romslot-c">%romslot-t</div>
						<div class="%nam-c" @att1>%nam-t</div>
					</div>
				</div>
			</div>
		`;
		return template;
	}

	// [A] TEMPLATE
	let template = `
		<div class="%main-1c %main-2c">
			${room_display_board()}
			<div class="%ip-c">
				<input id="%dpi-id" type="%dpi-ty" @att1 @att2 @att3 @att4>
				<p class="%em-c">%em-t</p>
				<p class="%info-c">%info-t</p>
			</div>
			<button id="%btn-id">%btn-t</button>
		</div>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
	{
		'%main-1c': 'join-room-main h-100 w-100 d-flex',
		'%main-2c': 'flex-column justify-content-center align-items-center',
		'%rdb-c': 'room-board d-flex flex-column',
		'%rdttl-c': 'list-title-gp d-flex',
		'%rdtt-status-c': 'rdtt-status',
		'%rdtt-status-t': 'Status',
		'%rdtt-roomid-c': 'rdtt-roomid',
		'%rdtt-roomid-t': 'ID',
		'%rdtt-slot-c': 'rdtt-slot',
		'%rdtt-slot-t': 'Slot',
		'%rdtt-name-c': 'rdtt-name',
		'%rdtt-name-t': 'Host',
		'%rdbl-c': 'room-board-list-group d-flex flex-column',
		'%list-c': 'room-board-list',
		'%st-c': 'rbl-status',
		'%st-dt': 'online',
		'%romid-c': 'rbl-roomid',
		'%romid-t': '77384',
		'%romslot-c': 'rbl-slot',
		'%romslot-t': '(2/4)',
		'%nam-c': 'rbl-name truncate',
		// tooltip
		'@att1': 'data-bs-toggle="tooltip" title="killerhunter789"',
		'%nam-t': 'killerhunter789',
		'%ip-c': 'input-group d-flex flex-column',
		'%dpi-id': 'room-join-code',
		'%dpi-ty': 'text',
		'@att1': 'placeholder="Enter Room ID"',
		'@att2': 'autocomplete="off"',
		'@att3': 'maxlength="5" required',
		'@att4': 'class="ct-home-input"',
		'%em-c': 'join-room-err',
		'%em-t': '',
		'%info-c': 'join-room-info',
		'%info-t': 'Leave blank to create new room',
		'%btn-id': 'btn_join_room',
		'%btn-t': 'Enter',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['join'] = attributes['%btn-id'];

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
	async roomListClick()
	{
		const btns = document.querySelectorAll(
			'.join-room-main .room-board-list'
		);
		for (const btn of btns)
		{
			btn.addEventListener('click', async (e) =>
			{
				const roomid = e.currentTarget.getAttribute('data-roomid');
				const input = document.querySelector('#room-join-code');
				if (input)
					input.value = roomid;
			});
		}

		return true;
	}

	async joinClick(event)
	{
		event.preventDefault();

		console.log('[EVENT] button clicked : join');

		return true;
	}

	async input_number_only()
	{
		const input = document.querySelector('#room-join-code');

		input.addEventListener('keypress', (e) =>
		{
			const key = e.key;
			const regex = /[0-9]/;
			if (!regex.test(key))
				e.preventDefault();
		});

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();
		btns.arr['join'].addEventListener(
			'click', async (e) => {await this.joinClick(e);
		});
		await this.roomListClick();
		await this.input_number_only();
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
