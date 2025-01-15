// file : PongEngine.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_UTILS from './engine_utils.js';
import EG_RENDER from './engine_render.js';
import EG_DATA from './engine_data.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// THIS IS A FILE WHICH REFERENCES THE TEMPLATE (TEMPLATE.JS)
// [section-structure]
// -. constructor
// 2. main-execution
// 3. event-related
// 4. fetch-related
// 5. html-element-related
// a. bootstrap-modal-related (optional)
// # init the class and export it.
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class PongEngine
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		this.container = null;
		this.gameType = null;
		this.data = EG_DATA;
	}

	// --------------------------------------------- //
	// MAIN-EXECUTION
	// --------------------------------------------- //
	async init()
	{
		this.container = document.querySelector('.ct-top-board');
		this.container.innerHTML = await this.init_html_template();
		await this.set_important_elements();
		await this.bind_events();
		await this.bind_modals();

		return this;
	}

	async set_important_elements()
	{
		this.data.reset();
		const DATA = this.data;
		const C = document.getElementById('game_canvas');
		DATA.gameType = this.gameType;
		DATA.init_canvas(C);

		return true;
	}

	async reset(type)
	{
		alert('Game has been reset!');
		if (type === 'lpvp')
			await EG_UTILS.gameStateHandler('lpvp-reset');
		else if (type === 'ltour')
			await EG_UTILS.gameStateHandler('ltour-reset');

		return true;
	}

	// --------------------------------------------- //
	// EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		switch (this.gameType)
		{
			case 'local-pvp':
				await this.lpvp_events();
				break;
			case 'local-pve':
				await this.lpve_events();
				break;
			case 'local-tour':
				await this.ltour_events();
				break;
			case 'online-pvp':
				await this.opvp_events();
				break;
			case 'online-tour':
				await this.otour_events();
				break;
			default:
				throw new Error('Invalid game type');
				break;
		}

		return true;
	}

	async lpvp_events()
	{
		await EG_UTILS.gameStateHandler('lpvp-start');

		return true;
	}

	async ltour_events()
	{
		await EG_UTILS.gameStateHandler('ltour-start');

		return true;
	}

	async lpve_events()
	{
		await EG_UTILS.gameStateHandler('lpve-start');

		return true;
	}

	async opvp_events()
	{
		await EG_UTILS.gameStateHandler('opvp-start');
		return true;
	}

	async otour_events()
	{
		return true;
	}

	// --------------------------------------------- //
	// FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_html_template()
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
		<canvas id="%main-d1" class="%main-c1">test</canvas>
		`
		// [B] SET atts
		const atts =
		{
			'%main-d1': 'game_canvas',
			'%main-c1': 'game-canvas',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
}

const item = new PongEngine();
export default item;
