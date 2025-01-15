// file : engine_utils.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_RENDER from './engine_render.js';
import EG_DATA from './engine_data.js';
import TNM_LOGIC from './tnm_logic.js';
import AI_PONG from './ai_logic.js';
import WS from '../../core/websocket_mng.js';
import AN from '../GameRoomView/Announcer.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class engineUtilsClass
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		this.data = EG_DATA;
		this.opvp_data = null;
	}

	async gameStateHandler(state)
	{
		const t = await this.getCurTime();

		if (state === 'lpvp-start')
		{
			const lobby_ctn = document.querySelector('.category-list-ctn[data-type="lobby"]');
			const playing_ctn = document.querySelector('.category-list-ctn[data-type="playing"]');
			await this.move_html_children(lobby_ctn, playing_ctn);

			await this.announce();
			await this.announce(`Game has started at ${t}`);
			await this.announce('Game difficulty will INCREASE over time');
			await this.btn_manage('start');
			await EG_RENDER.start_countdown();
			await EG_RENDER.randomBallDirection();
			await this.btn_manage('game-started');
			const obj = JSON.parse(localStorage.getItem('user'));
			this.data.player1.name = obj.username;
			this.data.player2.name = 'Player 2';

			requestAnimationFrame(EG_RENDER.game_loop.bind(EG_RENDER));
		}
		else if (state === 'lpvp-end')
		{
			await this.announce(`Game has ended at ${t}`);
			await this.btn_manage('end');
			await EG_DATA.reset();

			const lobby_ctn = document.querySelector('.category-list-ctn[data-type="lobby"]');
			const playing_ctn = document.querySelector('.category-list-ctn[data-type="playing"]');
			await this.move_html_children(playing_ctn, lobby_ctn);
		}
		else if (state === 'lpvp-reset')
		{
			await this.announce(`Game has ended at ${t} (manually)`);
			await this.btn_manage('end');
			EG_DATA.match.end = true;
			await this.render_default_gameBoard();
		}
		else if (state === 'ltour-start')
		{
			await this.reset_announcer();
			await this.announce('Tournament has started!');
			await TNM_LOGIC.run_tournament();
		}
		else if (state === 'ltour-end')
		{
			const leave = document.getElementById('btn_leaveRoom');
			leave.disabled = false;

			//change the play-container title to winner
			//.category-ctn with a child ".category-title" with textContent Playing
			const play_ctn = document.querySelector('.category-ctn > .category-list-ctn[data-type="playing"]').parentElement;
			const title = play_ctn.querySelector('.category-title');
			title.textContent = 'Winner';

			const lobby_ctn = document.querySelector('.category-ctn > .category-list-ctn[data-type="lobby"]').parentElement;
			lobby_ctn.classList.add('d-none');
			const wait_ctn = document.querySelector('.category-ctn > .category-list-ctn[data-type="waiting"]').parentElement;
			wait_ctn.classList.add('d-none');

		}
		else if (state === 'lpve-start')
		{
			const lobby_ctn = document.querySelector('.category-list-ctn[data-type="lobby"]');
			const playing_ctn = document.querySelector('.category-list-ctn[data-type="playing"]');
			await this.move_html_children(lobby_ctn, playing_ctn);

			await this.announce();
			await this.announce(`Game has started at ${t}`);
			await this.announce('Game difficulty will INCREASE over time');
			await EG_RENDER.start_countdown();
			await EG_RENDER.randomBallDirection();
			const obj = JSON.parse(localStorage.getItem('user'));
			this.data.player1.name = obj.username;
			this.data.player2.name = 'PONG AI';
			
			await AI_PONG.run();
		}
		else if (state === 'lpve-end')
		{
			await this.announce(`Game has ended at ${t}`);

			const leave_btn = document.getElementById('btn_leaveRoom');
			const start_btn = document.getElementById('btn_lpve_start');
			leave_btn.disabled = false;
			start_btn.disabled = false;

			const lobby_ctn = document.querySelector('.category-list-ctn[data-type="lobby"]');
			const playing_ctn = document.querySelector('.category-list-ctn[data-type="playing"]');
			await this.move_html_children(playing_ctn, lobby_ctn);

			await EG_DATA.reset();
		}
		else if (state === 'opvp-start')
		{
			EG_DATA.match.started = true;
			await this.announce();
			await this.announce(`Game has started at ${t}`);
			await this.announce('Game difficulty will INCREASE over time');
			await EG_RENDER.start_countdown();
			await EG_RENDER.randomBallDirection();
			if (WS.gr.ws && WS.gr.ws.readyState === WebSocket.OPEN)
			{
				WS.gr.ws.send(JSON.stringify({
					'game_state': 'pre_game',
					'dy': EG_DATA.ball.dy,
					'dx': EG_DATA.ball.dx,
				}));
			}
			this.data.player1.name = this.opvp_data.members[0];
			this.data.player2.name = this.opvp_data.members[1];
		}
		else if (state === 'opvp-end')
		{
			await this.announce(`Game has ended at ${t}`);
			await this.announce(`${EG_DATA.match.winner} has won the game!`);
			const i_am_host = AN.host === JSON.parse(localStorage.getItem('user')).username;
			if (WS.gr.ws && WS.gr.ws.readyState === WebSocket.OPEN && i_am_host)
			{
				await this.sleep(1000);
				WS.gr.ws.send(JSON.stringify({
					'game_state': 'game_end',
					'winner': EG_DATA.match.winner,
					'loser': EG_DATA.match.loser,
					'rid': AN.rid,
					'host': AN.host
				}));
			}
			await EG_DATA.reset();
		}
		else if (state === 'opvp-unexpected-end')
		{
			const i_am_host = AN.host === JSON.parse(localStorage.getItem('user')).username;
			if (WS.gr.ws && WS.gr.ws.readyState === WebSocket.OPEN && i_am_host)
			{
				let loser;
				if (EG_DATA.player1.name === AN.host)
					loser = EG_DATA.player2.name;
				else
					loser = EG_DATA.player1.name;

				await this.sleep(1000);
				WS.gr.ws.send(JSON.stringify({
					'game_state': 'unexpected_end',
					'loser': loser,
					'rid': AN.rid,
				}));
			}
			await EG_DATA.reset();
		}

		return true;
	}
	
	async render_default_gameBoard()
	{
		const ctn = document.querySelector('.ct-top-board');
		ctn.innerHTML = '';
		ctn.innerHTML = `
		<div class="ct-gr-board-waiting">Waiting for host to start the game...</div>
		`;

		return true;
	}

	async getCurTime()
	{
		const cur = new Date().getTime();

		const time = new Date(cur).toLocaleTimeString(
			'en-US',
			{
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			}
		);

		return time;
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

	async reset_announcer()
	{
		const ctn = document.querySelector('.ct-gr-announcer-bd');
		ctn.innerHTML = '';

		return true;
	}

	async btn_manage(manageType)
	{
		const leave_btn = document.getElementById('btn_leaveRoom');
		const restart_btn = document.getElementById('btn_lpvp_restart');
		const start_btn = document.getElementById('btn_lpvp_start');

		if (manageType === 'start')
		{
			await restart_btn.classList.remove('d-none');
			await start_btn.classList.add('d-none');
			start_btn.disabled = true;
			leave_btn.disabled = true;
			restart_btn.disabled = true;

			return true;
		}

		if (manageType === 'game-started')
		{
			restart_btn.disabled = false;
			return true;
		}

		if (manageType === 'end')
		{
			await restart_btn.classList.add('d-none');
			await start_btn.classList.remove('d-none');
			start_btn.disabled = false;
			leave_btn.disabled = false;

			return true;
		}

		return true;
	}

	async sleep(ms)
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async set_keyEvents()
	{
		const db = this.data;

		document.addEventListener('keydown', (event) => {
			db.key_state[event.key] = true;
		});

		document.addEventListener('keyup', (event) => {
			db.key_state[event.key] = false;
		});

		return true;
	}

	async move_html_children(parent1, parent2)
	{
		const p2_children = [];
		for (const child of parent2.children)
		{
			const clone = child.cloneNode(true);
			p2_children.push(clone.outerHTML);
		}

		parent2.innerHTML = '';
		for (const child of parent1.children)
		{
			const clone = child.cloneNode(true);
			parent2.appendChild(clone);
		}
		
		parent1.innerHTML = '';
		for (const child of p2_children)
		{
			parent1.innerHTML += child;
		}
	}

}

const ENGINE_UTILS = new engineUtilsClass();
export default ENGINE_UTILS;
