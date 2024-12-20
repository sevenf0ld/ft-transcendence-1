// file : ModalHistory.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import { fetch_utils as FETCH_UTILS } from '../../core/helpers/fetch-utils.js';
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
];

// --- [LOCAL] BUTTONS SECTION
// button tracker
class button
{
	constructor()
	{
		this.arr = {
			'unfriend': '',
			'block': '',
			'cancel-request': '',
			'accept-request': '',
			'decline-request': '',
			'unblock': '',
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
		<button id="%uf-id" class="%uf-c" >%uf-t</button>
		<button id="%bl-id" class="%bl-c" >%bl-t</button>
		<button id="%cr-id" class="%cr-c" >%cr-t</button>
		<button id="%ar-id" class="%ar-c" >%ar-t</button>
		<button id="%dr-id" class="%dr-c" >%dr-t</button>
		<button id="%ub-id" class="%ub-c" >%ub-t</button>
	`;

	// [B] SET ATTRIBUTES
	const attributes =
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

	for (const key in attributes)
		template = template.split(key).join(attributes[key]);

	// [C] PUSH TO BUTTONS TRACKER
	btns.arr['unfriend'] = attributes['%uf-id'];
	btns.arr['block'] = attributes['%bl-id'];
	btns.arr['cancel-request'] = attributes['%cr-id'];
	btns.arr['accept-request'] = attributes['%ar-id'];
	btns.arr['decline-request'] = attributes['%dr-id'];
	btns.arr['unblock'] = attributes['%ub-id'];

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
export default class ModalFnOpt
{
	// --- [00] CONSTRUCTOR
	constructor(container, type, target)
	{
		this.container = container;
		this.type = type;
		this.target = target;
		this.components = {};
		this.user = '';
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
		for (const key in btns.arr)
			await this.btnDisable(btns.arr[key]);
		if (this.type === 'added')
		{
			await this.btnEnable(btns.arr['unfriend']);
			await this.btnEnable(btns.arr['block']);
		}
		if (this.type === 'request-out')
		{
			await this.btnEnable(btns.arr['cancel-request']);
		}
		if (this.type === 'request-in')
		{
			await this.btnEnable(btns.arr['accept-request']);
			await this.btnEnable(btns.arr['decline-request']);
		}
		if (this.type === 'blocked')
		{
			await this.btnEnable(btns.arr['unblock']);
		}
		return true;
	}

	async refresh()
	{
		const parentHtml = document.querySelector('.ct-main-rpanel');
		const rightPanel = new rightPanelFriends(parentHtml);
		await rightPanel.render();

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
		await modal.hide();

		return true;
	}

	async unfriendClick(event)
	{
		if (this.type !== 'added')
			return false;

		event.preventDefault();
		console.log('unfriend');

		if (await this.confirmation(`unfriend ${this.target}`) === false)
			return false;

		//curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "who"}' 'https://localhost:8000/api/friends/friend-list-av/unfriend/' --insecure
		const mainFetch = new FETCH_UTILS();
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
		console.log('block');

		if (await this.confirmation(`block ${this.target}`) === false)
			return false;
	
		//curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "how"}' 'https://localhost:8000/api/friends/friend-list-av/block/' --insecure
		const mainFetch = new FETCH_UTILS();
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
		console.log('cancel request');

		if (await this.confirmation(`cancel sent request`) === false)
			return false;

		//curl -X DELETE -H "Content-type: application/json" -d '{"sender": "when", "recipient": "what"}' 'https://localhost:8000/api/friends/friend-request-av/cancel/' --insecur
		const mainFetch = new FETCH_UTILS();
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
		console.log('accept request');

		//curl -X DELETE -H "Content-type: application/json" -d '{"sender": "what", "recipient": "when"}' 'https://localhost:8000/api/friends/friend-request-av/accept/' --insecure
		//
		const mainFetch = new FETCH_UTILS();
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
		if (this.type !== 'request-out')
			return false;

		event.preventDefault();
		console.log('decline request');

		//curl -X DELETE -H "Content-type: application/json" -d '{"sender": "what", "recipient": "when"}' 'https://localhost:8000/api/friends/friend-request-av/decline/' --insecure
		const mainFetch = new FETCH_UTILS();
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/friends/friend-request-av/decline/');
		await mainFetch.setMethod('DELETE');
		await mainFetch.appendHeaders('Content-Type', 'application/json');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendBody('sender', this.target);
		await mainFetch.appendBody('recipient', this.user);
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
		console.log('unblock');

		//curl -X PATCH -H "Content-type: application/json" -d '{"user": "what", "target": "how"}' 'https://localhost:8000/api/friends/friend-list-av/unblock/' --insecure
		const mainFetch = new FETCH_UTILS();
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

	async bind_events()
	{
		const local_obj = JSON.parse(localStorage.getItem('user'));
		this.user = local_obj.username;
		if (this.user === '')
			throw new Error(`[ERR] user not found in local storage`);

		await btns.read_buttons();

		await this.disable_buttons();

		btns.arr['unfriend'].addEventListener(
			'click', (e) => this.unfriendClick(e)
		);

		btns.arr['block'].addEventListener(
			'click', (e) => this.blockClick(e)
		);

		btns.arr['cancel-request'].addEventListener(
			'click', (e) => this.cancelRequestClick(e)
		);

		btns.arr['accept-request'].addEventListener(
			'click', (e) => this.acceptRequestClick(e)
		);

		btns.arr['decline-request'].addEventListener(
			'click', (e) => this.declineRequestClick(e)
		);

		btns.arr['unblock'].addEventListener(
			'click', (e) => this.unblockClick(e)
		);

		return true;
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
