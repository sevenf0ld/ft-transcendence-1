// file : ModalAdd.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as FETCH from './ModalAdd_fetch.js';
import * as LOADING from '../../core/helpers/loading.js';
import alert_utils from '../../core/helpers/alert-utils.js';
import rightPanelFriends from './RightFnList.js';

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
	'.ct-home-input',
	'.add-friend-btn',
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
		<form class="%addf-c">
			<input type="%in-t" class="%in-1c" @att1 @att2 @att3>
			<button @att4 @att5 @att6>%addfb-t</button>
			<div class="%addfmsg-c" role="%addfmsg-r">%addfmsg-t</div>
		</form>
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
		'@att4': 'id="btn_add_friend_submit"',
		'@att5': 'class="add-friend-btn"',
		'@att6': 'type="submit"',
		'%addfb-t': 'Add Friend',
		'%addfmsg-c': 'ct-alert-addFriend alert d-none',
		'%addfmsg-r': 'alert',
		'%addfmsg-t': 'User not found',
	};

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr.submit = 'btn_add_friend_submit';

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
		this.alert_div = null;
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

	async check_input()
	{
		const username = document.querySelector('.add-friend-input').value;
		if (username.length < 3 || username.length > 16)
		{
			this.alert_div.alert_clear();
			this.alert_div.alert_danger('Please enter a valid username');
			return false;
		}

		return true;
	}

	// --- [04] EVENT
	async submit_click(event)
	{
		console.log('[EVENT] button clicked : submit-add-friend');
		event.preventDefault();

		if (!await this.check_input())
			return false;

		this.alert_div.alert_clear();
		await LOADING.disable_all();

		//send data to backend
		const addFetch = new FETCH.fetch_addFriend();
		const fetch_result = await addFetch.fetchData();

		this.alert_div.alert_info('Sending request...');
		await new Promise(r => setTimeout(r, 1000));

		if (fetch_result === 'addFriend-successful')
		{
			let string = 'the user';
			this.alert_div.alert_success('Add friend successful!');

			await new Promise(r => setTimeout(r, 100));

			if (addFetch.fetch_obj.rdata['recipient'])
				string = addFetch.fetch_obj.rdata['recipient'];

			alert(`Friend request has been sent to ${string}`);

			const modal = bootstrap.Modal.getInstance(
				document.getElementById('modal-addFriend'
			));
			await modal.hide();

			const parent_div = document.querySelector('.ct-main-rpanel');
			const rightpanel = new rightPanelFriends(parent_div);
			await rightpanel.render();

			await LOADING.restore_all();
		}
		else if (fetch_result === 'addFriend-failed')
		{
			let string = 'Add friend failed! ';
			await this.alert_div.alert_danger(string);

			await new Promise(r => setTimeout(r, 100));

			if (addFetch.fetch_obj.rdata['detail'])
				alert(addFetch.fetch_obj.rdata['detail']);
			else if (addFetch.fetch_obj.rdata['recipient'])
				alert(addFetch.fetch_obj.rdata['recipient']);
			else
				alert('Unknown error');

			await LOADING.restore_all();
		}

		await LOADING.restore_all();
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

	async modals_events()
	{
		const modal = document.querySelector('.modal#modal-addFriend');

		// when modals are shown
		modal.addEventListener('shown.bs.modal', async () =>
		{
		});

		// when modals are hidden
		modal.addEventListener('hidden.bs.modal', async () =>
		{
		});

		return true;
	}

	async bind_events()
	{
		await btns.read_buttons();

		btns.arr['submit'].addEventListener(
			'click', async (e) => {await this.submit_click(e);}
		);

		await this.field_handle();
		await this.modals_events();

		return true;
	}

	// --- [05] RENDER
	async render()
	{
		const template = await this.init_template();

		this.container.innerHTML = '';
		this.container.innerHTML = template;
		this.alert_div = new alert_utils(document.querySelector('.ct-alert-addFriend'));

		await this.bind_events();
		//await this.modals_render();

		return true;
	}
}
