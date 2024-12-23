// file : PongEngine.js
import * as LOADING from '../../core/helpers/loading.js';
export default class PongEngine {
	constructor(gameType)
	{
		this.container = document.querySelector('.ct-top-board');
		this.gameType = gameType;
		this.canvas = null;
		this.ctx = null;
		this.canvas_height = 270;
		this.canvas_width = 750;
		this.bg_color = '#212529';
	}

	// --------------------------------------------- //
	// MAIN-EXECUTION (SHARED-LAYOUT-BASE)
	// --------------------------------------------- //
	async init() {
		await this.init_html_template();

		this.container.innerHTML = await this.init_html_template();
		await this.push_important_elements();
		await this.bind_events();
		await this.bind_modals();

		return this;
	}

	async push_important_elements()
	{
		this.canvas = document.getElementById('game_canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.canvas_width;
		this.canvas.height = this.canvas_height;

		return true;
	}
	// --------------------------------------------- //
	// EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		await this.btn_manage('start');
		await this.announce('Game has started at ' + await this.timeNow());
		await this.start_countdown();
		await this.ended_game();

		return true;
	}

	async timeNow()
	{
		const timeNow = new Date().getTime();
		const time = new Date(timeNow).toLocaleTimeString(
			'en-US', { hour: '2-digit', minute: '2-digit'
		});

		return time;
	}

	async announce(msg)
	{
		const ctn = document.querySelector('.ct-gr-announcer-bd');
		const p = document.createElement('p');
		const str = "System: " + msg;

		p.textContent = str;
		p.classList.add('ct-gr-announcer-msg');

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

	async render_countdown(num)
	{
		const width = this.canvas.width / 2;
		const height = this.canvas.height / 2;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = '#3b434a';
		this.ctx.font = '30px Arial';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(num, width, height);

		return true;
	}

	async start_countdown()
	{
		await this.render_countdown(3);
		await this.sleep(1000);
		await this.render_countdown(2);
		await this.sleep(1000);
		await this.render_countdown(1);
		await this.sleep(1000);
		await this.render_countdown('GO!');
		await this.sleep(1000);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return true;
	}

	async ended_game()
	{
		await this.announce('Game has ended at ' + await this.timeNow());
		await this.btn_manage('end');

		return true;
	}

	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
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

}
