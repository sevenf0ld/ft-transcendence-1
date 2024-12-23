// file : GameBoard.js
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
export default class GameBoard
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(container)
	{
		// COMMON-atts
		this.container = container;
		this.main_ctn = '';
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
	}

	async render()
	{
		await this.baseLayour_render('replace');

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
			<div class="%main-c1">%main-t1</div>
		`
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-gr-board-waiting',
			'%main-t1': 'Waiting for host to start the game...',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
}
