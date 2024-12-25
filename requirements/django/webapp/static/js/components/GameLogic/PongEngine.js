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
// [section-structure]
// 1. constructor
// 2. main-execution
// 3. event-related
// 4. fetch-related
// 5. html-element-related
// 6. bootstrap-modal-related (optional)
// [export]
// 1. init the class and export it if:
// 		- utility & helper functions
// 		- object that use across entire webapp
// 		- object contain data that shouldn't be reset
// 2. else export class directly
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
export default class PongEngine
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(gameType)
	{
		this.container = document.querySelector('.ct-top-board');
		this.gameType = gameType;
		this.data = EG_DATA;
	}

	// --------------------------------------------- //
	// MAIN-EXECUTION
	// --------------------------------------------- //
	async init() {
		await this.init_html_template();

		this.container.innerHTML = await this.init_html_template();
		this.data.reset();
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

	async reset()
	{
		alert('Game has been reset!');
		await EG_UTILS.gameStateHandler('reset');

		return true;
	}

	// --------------------------------------------- //
	// EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		console.log('bind_events: ', this.gameType);
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
		console.log('lpvp_events');
		this.data.player1.name = 'Player 1';
		this.data.player2.name = 'Player 2';
		await EG_UTILS.gameStateHandler('start');

		return true;
	}

	async lpve_events()
	{
		return true;
	}

	async ltour_events()
	{
		return true;
	}

	async opvp_events()
	{
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
	// BOOSTRAP-MODAL-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
}
