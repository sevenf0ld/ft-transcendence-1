// file : engine_utils.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_RENDER from './engine_render.js';
import EG_DATA from './engine_data.js';
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

	// --------------------------------------------- //
	// FUNCTIONS
	// --------------------------------------------- //
	async getCurTime()
	{
		const cur = new Date().getTime();
		const time = new Date(cur).toLocaleTimeString(
			'en-US',
			{
				hour: '2-digit',
				minute: '2-digit'
			}
		);

		return time;
	}

	async announce(msg)
	{
		const ctn = document.querySelector('.ct-gr-announcer-bd');

		if (ctn === null)
			return false;

		const msg_str = "System: " + msg;

		const p = document.createElement('p');
		p.classList.add('ct-gr-announcer-msg');
		p.textContent = msg_str;

		ctn.appendChild(p);

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

	async gameStateHandler(state)
	{
		const t = await this.getCurTime();

		if (state === 'start')
		{
			await this.announce(`Game has started at ${t}`);
			await this.btn_manage('start');
			await EG_RENDER.start_countdown();
			await EG_RENDER.randomBallDirection();
			requestAnimationFrame(EG_RENDER.game_loop.bind(EG_RENDER));
		}
		else if (state === 'end')
		{
			await this.announce(`Game has ended at ${t}`);
			await this.btn_manage('end');
		}

		return true;
	}

	async set_keyEvents()
	{
		const db = this.data;

		document.addEventListener('keydown', (event) => {
			db.keyState[event.key] = true;

		});

		document.addEventListener('keyup', (event) => {
			db.keyState[event.key] = false;
		});

		return true;
	}

}

const ENGINE_UTILS = new engineUtilsClass();
export default ENGINE_UTILS;
