// file : ModalFnOpt.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import FETCH_UTILS from '../../core/helpers/fetch-utils.js';
import RIGHT_FRIENDS_LIST from './RightFnList.js';
import HOME_VIEW from '../../views/HomeView.js';
import * as LOADING from '../../core/helpers/loading.js';
import LANGUAGE from '../../core/language/language.js';
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
class ModalFnOpt
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
			'unfriend': '',
			'block': '',
			'cancel-request': '',
			'accept-request': '',
			'decline-request': '',
			'unblock': '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.type = null;
		this.target = null;
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
		this.main_ctn = document.querySelector('.ct-board-home');
		this.buttons['unfriend'] = document.getElementById('btn_unfriend');
		this.buttons['block'] = document.getElementById('btn_block');
		this.buttons['cancel-request'] = document.getElementById('btn_cancel_request');
		this.buttons['accept-request'] = document.getElementById('btn_accept_request');
		this.buttons['decline-request'] = document.getElementById('btn_decline_request');
		this.buttons['unblock'] = document.getElementById('btn_unblock');

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
		const local_obj = JSON.parse(localStorage.getItem('user'));
		this.user = local_obj.username;
		if (this.user === '')
			throw new Error(`[ERR] user not found in local storage`);

		this.buttons['unfriend'].addEventListener(
			'click', async (event) => { await this.unfriendClick(event); }
		);

		this.buttons['block'].addEventListener(
			'click', async (event) => { await this.blockClick(event); }
		);

		this.buttons['cancel-request'].addEventListener(
			'click', async (event) => { await this.cancelRequestClick(event); }
		);

		this.buttons['accept-request'].addEventListener(
			'click', async (event) => { await this.acceptRequestClick(event); }
		);

		this.buttons['decline-request'].addEventListener(
			'click', async (event) => { await this.declineRequestClick(event); }
		);

		this.buttons['unblock'].addEventListener(
			'click', async (event) => { await this.unblockClick(event); }
		);

		await LANGUAGE.updateContent('modal-fn-opt');
		await this.disable_buttons();

		return true;
	}

	async unfriendClick(event)
	{
		if (this.type !== 'added')
			return false;

		event.preventDefault();
		console.log('[BTN] unfriendClick');
		const close_btn = document.getElementById('btn_chatbox_close');
		if (close_btn !== null)
			await close_btn.click();

		if (await this.confirmation(`unfriend ${this.target}`) === false)
			return false;

		//curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "who"}' 'https://localhost:8000/api/friends/friend-list-av/unfriend/' --insecure
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-list-av/unfriend/');
		await mainFetch.setMethod('PATCH');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('user', this.user);
		await mainFetch.appendBody('target', this.target);
		await mainFetch.fetchData();

		//tomorrow change to bs-alert-display-div
		if (mainFetch.robject.ok)
			alert('Unfriend successful');
		else
			alert('Failed to unfriend');

		await this.close_modal();
		await this.refresh();

		return true;
	}

	async blockClick(event)
	{
		if (this.type !== 'added')
			return false;

		event.preventDefault();
		console.log('[BTN] blockClick');
		const close_btn = document.getElementById('btn_chatbox_close');
		if (close_btn)
			await close_btn.click();
		alert('block');

		if (await this.confirmation(`block ${this.target}`) === false)
			return false;
	
		//curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "how"}' 'https://localhost:8000/api/friends/friend-list-av/block/' --insecure
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-list-av/block/');
		await mainFetch.setMethod('PATCH');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('user', this.user);
		await mainFetch.appendBody('target', this.target);
		await mainFetch.fetchData();

		//tomorrow change to bs-alert-display-div
		if (mainFetch.robject.ok)
			alert('Block successful');
		else
			alert('Failed to block');

		await this.close_modal();
		await this.refresh();

		return true;
	}

	async cancelRequestClick(event)
	{
		if (this.type !== 'request-out')
			return false;
		event.preventDefault();
		console.log('[BTN] cancelRequestClick');

		if (await this.confirmation(`cancel sent request`) === false)
			return false;

		//curl -X DELETE -H "Content-type: application/json" -d '{"sender": "when", "recipient": "what"}' 'https://localhost:8000/api/friends/friend-request-av/cancel/' --insecur
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-request-av/cancel/');
		await mainFetch.setMethod('DELETE');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('sender', this.user);
		await mainFetch.appendBody('recipient', this.target);
		await mainFetch.fetchData();

		//tomorrow change to bs-alert-display-div
		if (mainFetch.robject.ok)
			alert('Request has been cancelled');
		else
			alert('Failed to cancel request');

		await this.close_modal();
		await this.refresh();

		return true;
	}

	async acceptRequestClick(event)
	{
		if (this.type !== 'request-in')
			return false;

		event.preventDefault();
		console.log('[BTN] acceptRequestClick');

		//curl -X DELETE -H "Content-type: application/json" -d '{"sender": "what", "recipient": "when"}' 'https://localhost:8000/api/friends/friend-request-av/accept/' --insecure
		//
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-request-av/accept/');
		await mainFetch.setMethod('DELETE');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('sender', this.user);
		await mainFetch.appendBody('recipient', this.target);
		await mainFetch.fetchData();

		//tomorrow change to bs-alert-display-div
		if (mainFetch.robject.ok)
			alert('Request has been accepted');
		else
			alert('Failed to accept request');

		await this.close_modal();
		await this.refresh();

		return true;
	}

	async declineRequestClick(event)
	{
		if (this.type !== 'request-in')
			return false;

		event.preventDefault();
		console.log('[BTN] declineRequestClick');

		//curl -X DELETE -H "Content-type: application/json" -d '{"sender": "what", "recipient": "when"}' 'https://localhost:8000/api/friends/friend-request-av/decline/' --insecure
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-request-av/decline/');
		await mainFetch.setMethod('DELETE');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('sender', this.user);
		await mainFetch.appendBody('recipient', this.target);
		await mainFetch.fetchData();

		//tomorrow change to bs-alert-display-div
		if (mainFetch.robject.ok)
			alert('Request has been declined');
		else
			alert('Failed to decline request');

		await this.close_modal();
		await this.refresh();

		return true;
	}

	async unblockClick(event)
	{
		if (this.type !== 'blocked')
			return false;

		event.preventDefault();
		console.log('[BTN] unblockClick');

		//curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "how"}' 'https://localhost:8000/api/friends/friend-list-av/unblock/' --insecure
		await FETCH_UTILS.init();
		const mainFetch = FETCH_UTILS;
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-list-av/unblock/');
		await mainFetch.setMethod('PATCH');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('user', this.user);
		await mainFetch.appendBody('target', this.target);
		await mainFetch.fetchData();

		//tomorrow change to bs-alert-display-div
		if (mainFetch.robject.ok)
			alert('Unblock successful');
		else
			alert('Failed to unblock');

		await this.close_modal();
		await this.refresh();

		return true;
	}

	async btnDisable(element)
	{
		element.disabled = true;
		element.classList.add('d-none');

		return true;
	}

	async btnEnable(element)
	{
		element.disabled = false;
		element.classList.remove('d-none');

		return true;
	}

	async disable_buttons()
	{
		for (const key in this.buttons)
			await this.btnDisable(this.buttons[key]);
		if (this.type === 'added')
		{
			await this.btnEnable(this.buttons['unfriend']);
			await this.btnEnable(this.buttons['block']);
		}
		if (this.type === 'request-out')
		{
			await this.btnEnable(this.buttons['cancel-request']);
		}
		if (this.type === 'request-in')
		{
			await this.btnEnable(this.buttons['accept-request']);
			await this.btnEnable(this.buttons['decline-request']);
		}
		if (this.type === 'blocked')
		{
			await this.btnEnable(this.buttons['unblock']);
		}
		return true;
	}

	async refresh()
	{
		await LOADING.disable_all();
		await new Promise((resolve) => setTimeout(resolve, 100));
		await HOME_VIEW.render();
		await LOADING.restore_all();

		return true;
	}

	async confirmation(str)
	{
		const confirmation = confirm(`Are you sure you want to ${str}?`);
		if (confirmation === true)
			return true;
		else
			return false;
	}

	async close_modal()
	{
		const modal = bootstrap.Modal.getInstance(
			document.getElementById('modal-fnOpt')
		);

		if (modal)
			await modal.hide();

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
		<button id="%uf-id" class="%uf-c" >%uf-t</button>
		<button id="%bl-id" class="%bl-c" >%bl-t</button>
		<button id="%cr-id" class="%cr-c" >%cr-t</button>
		<button id="%ar-id" class="%ar-c" >%ar-t</button>
		<button id="%dr-id" class="%dr-c" >%dr-t</button>
		<button id="%ub-id" class="%ub-c" >%ub-t</button>
		`;
		// [B] SET atts
		const atts =
		{
			'%uf-id': 'btn_unfriend',
			'%uf-c': 'btn-unfriend',
			'%uf-t': 'Unfriend',
			'%bl-id': 'btn_block',
			'%bl-c': 'btn-block',
			'%bl-t': 'Block',
			'%cr-id': 'btn_cancel_request',
			'%cr-c': 'btn-cancel-request',
			'%cr-t': 'Cancel Request',
			'%ar-id': 'btn_accept_request',
			'%ar-c': 'btn-accept-request',
			'%ar-t': 'Accept Request',
			'%dr-id': 'btn_decline_request',
			'%dr-c': 'btn-decline-request',
			'%dr-t': 'Decline Request',
			'%ub-id': 'btn_unblock',
			'%ub-c': 'btn-unblock',
			'%ub-t': 'Unblock',
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

const item = new ModalFnOpt();
export default item;
