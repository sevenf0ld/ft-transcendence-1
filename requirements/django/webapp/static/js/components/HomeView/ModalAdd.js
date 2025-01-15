// file : MidBoard.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import * as LOADING from '../../core/helpers/loading.js';
import ALERT_UTILS from '../../core/helpers/alert-utils.js';
import RIGHT_FRIEND_LIST from './RightFnList.js';
import FETCH from './ModalAdd_fetch.js';
import HOME_VIEW from '../../views/HomeView.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// THIS IS A FILE WHICH REFERENCES THE TEMPLATE (TEMPLATE.JS)
// [section-structure]
// 1. constructor
// 2. main-execution
// 3. event-related
// 4. fetch-related
// 5. html-element-related
// a. bootstrap-modal-related (optional)
// # init the class and export it.
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class ModalAdd
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		// COMMON-atts
		this.container = null;
		this.main_ctn = null;
		this.buttons = {
			'submit': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.alert_div = null;
	}
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

		const template = await this.init_template();

		if (type === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (type === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}

		await this.push_important_elements();
		await this.bind_events();
		await this.bind_modals();

		return true;
	}

	async push_important_elements()
	{
		this.main_ctn = document.querySelector('.add-friend-ctn');
		this.buttons['submit'] = document.getElementById('btn_add_friend_submit');

		await ALERT_UTILS.init();
		ALERT_UTILS.container = document.querySelector('.ct-alert-addFriend');
		this.alert_div = ALERT_UTILS;

		if (!this.alert_div)
			throw new Error('[ERR] alert-div not found');
		if (!this.main_ctn)
			throw new Error('[ERR] main container not found');
		for (const key in this.buttons)
		{
			if (!this.buttons[key])
				throw new Error(`[ERR] button not found : ${key}`);
		}

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		this.buttons['submit'].addEventListener(
			'click', async (event) => { await this.submitClick(event); }
		);

		await this.field_handle();

		return true;
	}

	async submitClick(event)
	{
		console.log('[BTN] submitClick');
		event.preventDefault();

		if (!await this.check_input())
			return false;

		this.alert_div.alert_clear();
		await LOADING.disable_all();

		//send data to backend
		const addFetch = FETCH;
		await addFetch.init();
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

			await new Promise((resolve) => setTimeout(resolve, 100));
			await HOME_VIEW.render();

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
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template()
	{
		let template = "";
		template += await this.html_main_ctn();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn()
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
		// [B] SET atts
		const atts =
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
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
}

const item = new ModalAdd();
export default item;
