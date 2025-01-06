// file : engine_utils.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_RENDER from './engine_render.js';
import EG_DATA from './engine_data.js';
import TNM_LOGIC from './tnm_logic.js';
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
	}

	async gameStateHandler(state)
	{
		const t = await this.getCurTime();

		if (state === 'lpvp-start')
		{
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

}

const ENGINE_UTILS = new engineUtilsClass();
export default ENGINE_UTILS;
