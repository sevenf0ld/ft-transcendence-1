// file : Announcer.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
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
class Announcer
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		// COMMON-atts
		this.container = null;
		this.base_ctn = null;
		this.main_ctn = null;
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.gameType = null;
		this.rid = null;
		this.host = null;
	}

	async init()
	{
		// COMMON-atts
		this.container = null;
		this.base_ctn = null;
		this.main_ctn = null;
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.gameType = null;
		this.rid = null;
		this.host = null;
		return true;
	}

	async render()
	{
		await this.baseLayour_render('replace');
		this.base_ctn = document.querySelector('.ct-gr-announcer-bd');

		switch (this.gameType)
		{
			case 'local-pvp':
				await this.localPvp_render('append');
				break;
			case 'local-tour':
				await this.localTour_render('append');
				break;
			case 'local-pve':
				await this.localPve_render('append');
				break;
			case 'online-pvp':
				await this.onlinePvp_render('append');
				break;
			default:
				break;
		}

		return true;
	}

	// ======================================================================== //
	// SHARED-LAYOUT-BASE
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async baseLayour_render(renderType)
	{
		const template = await this.init_template_base();

		if (renderType.toLowerCase() === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_base();
		await this.bind_events_base();
		await this.bind_modals_base();

		return true;
	}

	async push_important_elements_base()
	{
		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_base()
	{
		return true;
	}

	async roomIdUpdate(id)
	{
		const p = document.querySelector('.ct-gr-announcer-rid');
		let str = 'Room ID: ' + id;
		p.innerHTML = str;

		return true;
	}

	async msg_generator(msg)
	{
		let str = `
		<p class="ct-gr-announcer-msg">System: ${msg}</p>
		`;
		return str;
	}

	async announce(msg, type)
	{
		const ctn = document.querySelector('.ct-gr-announcer-bd');

		if (ctn === null)
			return false;

		let msg_str;
		if (type === 'mms')
			msg_str = "Matchmaking: " + msg;
		else
			msg_str = "System: " + msg;

		const p = document.createElement('p');
		p.classList.add('ct-gr-announcer-msg');
		p.textContent = msg_str;

		ctn.appendChild(p);

		// clear board
		if (!msg)
			ctn.innerHTML = '';

		// scroll to bottom
		ctn.scrollTop = ctn.scrollHeight;

		return true;
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED 
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_base()
	{
		let template = "";
		template += await this.html_main_ctn_base();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_base()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			<div class="%hd-c1">
				<p class="%hdt-c1">Announcement</p>
				<p class="%rid-c1">Room ID: %rid</p>
			</div>
			<div class="%bd-c1">
				${await this.msg_generator(
					"Welcome to the Game Room!"
				)}
			</div>
			<div class="%ft-c1"></div>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-gr-announcer-ctn',
			'%hd-c1': 'ct-gr-announcer-hd',
			'%hdt-c1': 'ct-gr-announcer-hd-title',
			'%rid-c1': 'ct-gr-announcer-rid',
			'%rid': '00000',
			'%bd-c1': 'ct-gr-announcer-bd',
			'%ft-c1': 'ct-gr-announcer-ft',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED 
	// --------------------------------------------- //
	async bind_modals_base()
	{
		return true;
	}

	// ======================================================================== //
	// LOCAL-PVP
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async localPvp_render(renderType)
	{
		const template = await this.init_template_lpvp();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_lpvp();
		await this.bind_events_lpvp();
		await this.bind_modals_lpvp();

		return true;
	}

	async push_important_elements_lpvp()
	{
		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_lpvp()
	{
		this.roomIdUpdate('LOCAL-PVP');
		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	async init_template_lpvp()
	{
		let template = "";
		template += await this.html_main_ctn_lpvp();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_lpvp()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
			${await this.msg_generator(
				"You are in Local PVP Room."
			)}
			${await this.msg_generator(
				`Player 2 is on the right side.`
			)}
			${await this.msg_generator(
				`You are on the left side.`
			)}
			${await this.msg_generator(
				"Click 'Start' to begin."
			)}
		`;
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_lpvp()
	{
		return true;
	}

	// ======================================================================== //
	// LOCAL-TOUR
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async localTour_render(renderType)
	{
		const template = await this.init_template_ltour();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_ltour();
		await this.bind_events_ltour();
		await this.bind_modals_ltour();

		return true;
	}

	async push_important_elements_ltour()
	{
		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_ltour()
	{
		this.roomIdUpdate('LOCAL-TOUR');
		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_ltour()
	{
		let template = "";
		template += await this.html_main_ctn_ltour();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_ltour()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
			${await this.msg_generator(
				"You are in Local Tour Room!"
			)}
			${await this.msg_generator(
				"Add at least 2 more players to begin."
			)}
		`;
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_ltour()
	{
		return true;
	}

	// ======================================================================== //
	// LOCAL-PVE
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION (LOCAL-PVE)
	// --------------------------------------------- //
	async localPve_render(renderType)
	{
		const template = await this.init_template_lpve();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_lpve();
		await this.bind_events_lpve();
		await this.bind_modals_lpve();

		return true;
	}

	async push_important_elements_lpve()
	{
		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_lpve()
	{
		this.roomIdUpdate('LOCAL-PVE');
		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_lpve()
	{
		let template = "";
		template += await this.html_main_ctn_lpve();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_lpve()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
			${await this.msg_generator(
				"You are in Local PVE Room!"
			)}
			${await this.msg_generator(
				"Click 'Start' to begin."
			)}
		`;
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_lpve()
	{
		return true;
	}

	// ======================================================================== //
	// ONLINE-PVP
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async onlinePvp_render(renderType)
	{
		const template = await this.init_template_opvp();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_opvp();
		await this.bind_events_opvp();
		await this.bind_modals_opvp();

		return true;
	}

	async push_important_elements_opvp()
	{
		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_opvp()
	{
		return true;
	}

	async opvp_live_update(data)
	{
		const room_id = document.querySelector('.ct-gr-announcer-rid');

		if (data.type === 'joined_room')
		{
			const roomId = `Room ID: ${data.details.room_id}`;
			room_id.innerHTML = roomId;
			this.host = data.details.host;
			this.rid = data.details.room_id;
			const member_name = data.person;
			await LANGUAGE.updateContent('opvp');
			await this.announce(`${member_name} has joined the room.`);
		}
		else if (data.type === 'left_room')
		{
			const member_name = data.person;
			await this.announce(`${member_name} has left the room.`);
		}
		else if (data.type === 'started_game')
		{
			await this.announce('Game has started.');
		}
	}

	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_opvp()
	{
		let template = "";
		template += await this.html_main_ctn_opvp();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_opvp()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
			${await this.msg_generator(
				"You are in Online PVP Room!"
			)}
			${await this.msg_generator(
				"Please wait for the host to begin."
			)}
		`;

		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_opvp()
	{
		return true;
	}
}

const item = new Announcer();
export default item;
