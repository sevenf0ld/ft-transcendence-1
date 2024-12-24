// file : Announcer.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
export default class Announcer
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(container, gameType)
	{
		// COMMON-atts
		this.container = container;
		this.base_ctn = '';
		this.main_ctn = '';
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.gameType = gameType;
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
			case 'online-tour':
				await this.onlineTour_render('append');
				break;
			default:
				break;
		}

		return true;
	}

	/***********************************
	 * SHARED-LAYOUT-BASE
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (SHARED-LAYOUT-BASE)
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
	// EVENT-RELATED (SHARED-LAYOUT-BASE)
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
		`
		return str;
	}

	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (SHARED-LAYOUT-BASE)
	// --------------------------------------------- //
	async bind_modals_base()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED (SHARED-LAYOUT-BASE)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (SHARED-LAYOUT-BASE)
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
		`
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

	/***********************************
	 * LOCAL-PVP
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (LOCAL-PVP)
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
	// EVENT-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	async bind_events_lpvp()
	{
		this.roomIdUpdate('LOCAL-PVP');
		return true;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	async bind_modals_lpvp()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (LOCAL-PVP)
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
				"Click 'Start' to begin."
			)}
		`
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	/***********************************
	 * LOCAL-TOUR
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (LOCAL-TOUR)
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
	// EVENT-RELATED (LOCAL-TOUR)
	// --------------------------------------------- //
	async bind_events_ltour()
	{
		this.roomIdUpdate('LOCAL-TOUR');
		return true;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (LOCAL-TOUR)
	// --------------------------------------------- //
	async bind_modals_ltour()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED (LOCAL-TOUR)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (LOCAL-TOUR)
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
			${await this.msg_generator(
				"Click 'Add Player' to add a player."
			)}
			${await this.msg_generator(
				"Click 'Start' to begin."
			)}
		`
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	/***********************************
	 * LOCAL-PVE
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (LOCAL-PVE)
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
	// EVENT-RELATED (LOCAL-PVE)
	// --------------------------------------------- //
	async bind_events_lpve()
	{
		this.roomIdUpdate('LOCAL-PVE');
		return true;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (LOCAL-PVE)
	// --------------------------------------------- //
	async bind_modals_lpve()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED (LOCAL-PVE)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (LOCAL-PVE)
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
		`
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	/***********************************
	 * ONLINE-PVP
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (ONLINE-PVP)
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
	// EVENT-RELATED (ONLINE-PVP)
	// --------------------------------------------- //
	async bind_events_opvp()
	{
		return true;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (ONLINE-PVP)
	// --------------------------------------------- //
	async bind_modals_opvp()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED (ONLINE-PVP)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (ONLINE-PVP)
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
		`

		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	/***********************************
	 * ONLINE-TOUR
	 ***********************************/
	// --------------------------------------------- //
	// MAIN-EXECUTION (ONLINE-TOUR)
	// --------------------------------------------- //
	async onlineTour_render(renderType)
	{
		const template = await this.init_template_otour();

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

		await this.push_important_elements_otour();
		await this.bind_events_otour();
		await this.bind_modals_otour();

		return true;
	}

	async push_important_elements_otour()
	{
		return true;
	}
	// --------------------------------------------- //
	// EVENT-RELATED (ONLINE-TOUR)
	// --------------------------------------------- //
	async bind_events_otour()
	{
		return true;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED (ONLINE-TOUR)
	// --------------------------------------------- //
	async bind_modals_otour()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED (ONLINE-TOUR)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED (ONLINE-TOUR)
	// --------------------------------------------- //
	async init_template_otour()
	{
		let template = "";
		template += await this.html_main_ctn_otour();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_otour()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
			${await this.msg_generator(
				"You are in Online Tour Room!"
			)}
			${await this.msg_generator(
				"Please wait for the host to begin."
			)}
			${await this.msg_generator(
				"Feel free to share the Room ID with your friends."
			)}
		`

		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
}
