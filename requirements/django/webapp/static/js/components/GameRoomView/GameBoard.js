// file : GameBoard.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import EG_DATA from '../GameLogic/engine_data.js';
import EG_UTILS from '../GameLogic/engine_utils.js';
import PONG_ENGINE from '../GameLogic/PongEngine.js';
import WS from '../../core/websocket_mng.js';
import AN from '../GameRoomView/Announcer.js';
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
class GameBoard
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
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
	}

	async init()
	{
		// COMMON-atts
		this.container = null;
		this.main_ctn = null;
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		return true;
	}

	async render()
	{
		await this.baseLayour_render('replace');

		return true;
	}

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

	async opvp_live_update(data)
	{
		const room_id = document.querySelector('.ct-gr-announcer-rid');

		if (data.type === 'joined_room')
		{
			EG_DATA.reset();
		}
		if (data.type === 'disbanded_room')
		{
			if (EG_DATA.match.started)
			{
				const host = AN.host;
				const nonHost = JSON.parse(localStorage.getItem('user')).username;

				if (host === EG_DATA.player1.name)
					EG_DATA.ball.x = -2000;
				else
					EG_DATA.ball.x = EG_DATA.display.w + 2000;
				await new Promise((resolve) => setTimeout(resolve, 1000));
				alert('Host lost connection. You win! (but not recorded)');
				WS.gr.ws.send(JSON.stringify({
					'game_state': 'game_end',
					'winner': nonHost,
					'loser': host,
					'rid': AN.rid,
					'host': AN.host
				}));
			}
		}
		if (data.type === 'left_room')
		{
			if (EG_DATA.match.started)
			{
				const host = AN.host;
				const nonHost = JSON.parse(localStorage.getItem('user')).username;

				EG_DATA.match.unexpected_end = true;
				await new Promise((resolve) => setTimeout(resolve, 1000));
				alert('Opponent lost connection. You win! (but not recorded)');
			}
		}
		else if (data.type === 'started_game')
		{
			EG_UTILS.opvp_data = null;
			EG_UTILS.opvp_data = data;
			const pongGame = PONG_ENGINE;
			pongGame.gameType = 'online-pvp';
			await pongGame.init();
		}
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
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED 
	// --------------------------------------------- //
	async bind_modals_base()
	{
		return true;
	}
}

const item = new GameBoard();
export default item;
