// file : ActionPanel.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import pongEngine from '../GameLogic/PongEngine.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
export default class ActionPanel
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
		this.base_ctn = this.container.querySelector('.ct-gr-actpanel-ctn');

		switch (this.gameType)
		{
			case 'local-pvp':
				await this.localPvp_render('replace');
				break;
			case 'local-tour':
				await this.localTour_render('replace');
				break;
			case 'local-pve':
				await this.localPve_render('replace');
				break;
			case 'online-pvp':
				await this.onlinePvp_render('replace');
				break;
			case 'online-tour':
				await this.onlineTour_render('replace');
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
		<div class="%main-c1"></div>
		`
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-gr-actpanel-ctn',
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
		this.buttons['start'] = this.base_ctn.querySelector('#btn_lpvp_start');
		this.buttons['restart'] = this.base_ctn.querySelector('#btn_lpvp_restart');

		return true;
	}
	// --------------------------------------------- //
	// EVENT-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	async bind_events_lpvp()
	{
		this.buttons['start'].addEventListener(
			'click', async (event) => { await this.lpvp_start_click(event); }
		);

		return true;
	}

	async lpvp_start_click(event)
	{
		event.preventDefault();

		const pongGame = new pongEngine(this.gameType);
		await pongGame.init();

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
			<button @att1 @att2 @att3>@text1</button>
			<button @att4 @att5 @att6>@text2</button>
		`
		// [B] SET atts
		const atts =
		{
			'@att1': 'id="btn_lpvp_start"',
			'@att2': 'class="btn-lpvp-start ct-btn-neau"',
			'@att3': 'type="button"',
			'@text1': 'Start',
			'@att4': 'id="btn_lpvp_restart"',
			'@att5': 'class="btn-lpvp-restart ct-btn-neau d-none"',
			'@att6': 'type="button"',
			'@text2': 'Restart Game',
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
		<button @att01 @att02 @att03>@text01</button>
		<button @att04 @att05 @att06>@text02</button>
		<button @att07 @att08 @att09>@text03</button>
		`
		// [B] SET atts
		const atts =
		{
			'@att01': 'id="btn_ltour_start"',
			'@att02': 'class="btn-ltour-start ct-btn-neau"',
			'@att03': 'type="button"',
			'@text01': 'Start',
			'@att04': 'id="btn_ltour_restart"',
			'@att05': 'class="btn-ltour-restart ct-btn-neau d-none"',
			'@att06': 'type="button"',
			'@text02': 'Restart Game',
			'@att07': 'id="btn_ltour_add"',
			'@att08': 'class="btn-ltour-add ct-btn-neau"',
			'@att09': 'type="button"',
			'@text03': 'Add Player',
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
		<button @att1 @att2 @att3>@text1</button>
		<button @att4 @att5 @att6>@text2</button>
		`
		// [B] SET atts
		const atts =
		{
			'@att1': 'id="btn_lpve_start"',
			'@att2': 'class="btn-lpve-start ct-btn-neau"',
			'@att3': 'type="button"',
			'@text1': 'Start',
			'@att4': 'id="btn_lpve_restart"',
			'@att5': 'class="btn-lpve-restart ct-btn-neau d-none"',
			'@att6': 'type="button"',
			'@text2': 'Restart Game',
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
		<button @att1 @att2 @att3>@text1</button>
		<button @att4 @att5 @att6>@text2</button>
		`

		// [B] SET atts
		const atts =
		{
			'@att1': 'id="btn_opvp_start"',
			'@att2': 'class="btn-opvp-start ct-btn-neau"',
			'@att3': 'type="button"',
			'@text1': 'Start',
			'@att4': 'id="btn_opvp_invite"',
			'@att5': 'class="btn-opvp-invite ct-btn-neau"',
			'@att6': 'type="button"',
			'@text2': 'Invite Friend',
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
			<button @att1 @att2 @att3>@text1</button>
			<button @att4 @att5 @att6>@text2</button>
		`

		// [B] SET atts
		const atts =
		{
			'@att1': 'id="btn_otour_start"',
			'@att2': 'class="btn-otour-start ct-btn-neau"',
			'@att3': 'type="button"',
			'@text1': 'Start',
			'@att4': 'id="btn_otour_invite"',
			'@att5': 'class="btn-otour-invite ct-btn-neau"',
			'@att6': 'type="button"',
			'@text2': 'Invite Friend',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
}
