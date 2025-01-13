// file : GameGuide.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
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
class GameGuide
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
		return true;
	}

	async render()
	{
		await this.baseLayour_render('replace');
		this.base_ctn = document.querySelector('.ct-gr-guide-ctn .ct-gr-guide-body');

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
			<div class="%header-c1">Game Mechanics</div>
			<div class="%body-c1"></div>
			<div class="%footer-c1"></div>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-gr-guide-ctn',
			'%header-c1': 'ct-gr-guide-header',
			'%body-c1': 'ct-gr-guide-body',
			'%footer-c1': 'ct-gr-guide-footer',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async inst_list_generator(tt, str)
	{
		let template = `
		<div class="ct-gr-guide-instruction">
			<p class="instruction-header">${tt}</p>
			<p class="instruction-body">${str}</p>
		</div>
		`;;
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
		${await this.inst_list_generator('Left Player', 'W (UP), S (DOWN)')}
		${await this.inst_list_generator('Right Player', '↑ (UP), ↓ (DOWN)')}
		${await this.inst_list_generator('Game Goal', 'Hit the ball to the opponent\'s side (best of 1)')}
		${await this.inst_list_generator('Game Objective', 'Player against Player locally')}
		${await this.inst_list_generator('Game System', 'Match will not be recorded')}
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
		${await this.inst_list_generator('Left Player', 'W (UP), S (DOWN)')}
		${await this.inst_list_generator('Right Player', '↑ (UP), ↓ (DOWN)')}
		${await this.inst_list_generator('Game Rules', 'Last standing player wins')}
		${await this.inst_list_generator('Game Rules', 'Every match is best of one')}
		${await this.inst_list_generator('Game Rules', 'Matchmaking is random')}
		${await this.inst_list_generator('Game Objective', 'Player against Player locally')}
		${await this.inst_list_generator('Game System', 'Match will not be recorded')}
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
		${await this.inst_list_generator('Left Player', 'W (UP), S (DOWN)')}
		${await this.inst_list_generator('Game Goal', 'Hit the ball to the opponent\'s side (best of 1)')}
		${await this.inst_list_generator('Game Objective', 'Player against AI')}
		${await this.inst_list_generator('Game System', 'Match will not be recorded')}
		${await this.inst_list_generator('Difficulty', 'Random')}
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
		${await this.inst_list_generator('Key', 'W (UP), S (DOWN)')}
		${await this.inst_list_generator('Game Objective', 'Player against player online')}
		${await this.inst_list_generator('Game Rules', 'Hit the ball to the opponent\'s side (best of 1)')}
		${await this.inst_list_generator('Game System', 'Match will be recorded except when unexpected disconnection occurs')}
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

const item = new GameGuide();
export default item;
