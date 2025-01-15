// file : tnm_logic.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_RENDER from './engine_render.js';
import EG_DATA from './engine_data.js';
import EG_UTILS from './engine_utils.js';
import ROOM_LIST from '../GameRoomView/RoomList.js';
import ACTION_PANEL from '../GameRoomView/ActionPanel.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class tnmLogicClass
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		this.gameType = 'local-tour';
		this.init_players_data();
		this.init_html_divs();
	}

	async init_players_data()
	{
		this.lobby = [];
		this.eliminated = [];
		this.waiting = [];
		this.playing = [];
		this.next = null;
		this.match_winner = null;
		this.match_loser = null;
		this.tour_over = false;
		this.tour_winner = null;
		this.min_players = 3;
		this.max_players = 5;
		this.round = 1;
	}

	async init_html_divs()
	{
		this.play_ctn = null;
		this.wait_ctn = null;
		this.elim_ctn = null;
		this.lobby_ctn = null;
	}

	async read_html_divs()
	{
		this.play_ctn = document.querySelector(
			'.category-list-ctn[data-type="playing"]'
		);
		this.wait_ctn = document.querySelector(
			'.category-list-ctn[data-type="waiting"]'
		);
		this.elim_ctn = document.querySelector(
			'.category-list-ctn[data-type="eliminated"]'
		);
		this.lobby_ctn = document.querySelector(
			'.category-list-ctn[data-type="lobby"]'
		);

		if (!this.play_ctn)
			throw new Error('play_ctn is null');
		if (!this.wait_ctn)
			throw new Error('wait_ctn is null');
		if (!this.elim_ctn)
			throw new Error('elim_ctn is null');
		if (!this.lobby_ctn)
			throw new Error('lobby_ctn is null');

		return true;
	}

	async reset(type)
	{
		this.init_players_data();
		this.init_html_divs();
		await this.read_html_divs();

		if (type === 'end')
			return true;

		const name = JSON.parse(localStorage.getItem('user')).username;
		await this.add_player(name);
		await this.render_list();

		return true;
	}

	// core logic
	async pre_tour_start(type)
	{
		let str;

		await EG_UTILS.announce('---- ---- ----', 'mms');

		str = `Round #${this.round} : (${this.playing[0]}) vs (${this.playing[1]})!`;

		await EG_UTILS.announce(str, 'mms');
		await EG_UTILS.sleep(2000);

		str += `\n\n (${this.playing[0]}) is on the left side`;
		str += `\n (${this.playing[1]}) is on the right side`;
		const str1 = str + `\n\nClick on 'ok' to start the round!`;

		if (this.next)
			str = `Winner of this round will play against (${this.next}) next!`;
		else
			str = `This is the final round!`;

		await EG_UTILS.announce(str, 'mms');
		await EG_UTILS.sleep(2000);

		await alert(str1);

		return true;
	}

	async run_tournament()
	{
		await EG_RENDER.render_txt('Local Tournament is starting...');
		await EG_UTILS.sleep(2000);

		let str = `Players will always be paired randomly!`;
		await EG_UTILS.announce(str, 'mms');

		await EG_UTILS.sleep(4000);

		//right-side list
		await this.move_all_to_waiting();
		await this.render_list();
		await this.random_pairing();

		await (this.tour_loop());

		return true;
	}

	// ============================================= //
	// ==================================================  *******IMPORTANT******** //
	// ============================================= //
	// IMPORTANT CORE LOGIC (TOURNAMENT LOOP)
	// ============================================= //
	// ==================================================  *******IMPORTANT******** //
	// ============================================= //
	async tour_loop()
	{
		while (this.tour_over !== true)
		{
			if (EG_DATA.match.started === true)
			{
				console.log('detected match started');
				continue;
			}
			await this.random_pairing();
			if (this.playing.length === 1)
			{
				this.tour_over = true;
				alert('Tournament is over, winner = ' + this.playing[0]);
				await EG_UTILS.announce(
					'Tournament is over, winner = ' + this.playing[0]
				);
				await EG_UTILS.gameStateHandler('ltour-end');
				await this.reset_tournament('end');
				break;
			}
			await this.pre_tour_start();
			await EG_UTILS.sleep(1000);
			await this.tour_game_logic();
		}

		return true;
	}

	async wait()
	{
		return new Promise((resolve) =>
		{
			requestAnimationFrame(
				EG_RENDER.game_loop.bind(EG_RENDER, resolve)
			);
		});
	}

	async tour_game_logic()
	{
		EG_DATA.player1.name = this.playing[0];
		EG_DATA.player2.name = this.playing[1];
		EG_DATA.match.started = true;
		EG_DATA.gameType = 'local-tour';
		EG_DATA.canvas.elem = document.getElementById('game_canvas');
		EG_DATA.canvas.ctx = EG_DATA.canvas.elem.getContext('2d');
		await EG_RENDER.start_countdown();
		await EG_RENDER.randomBallDirection();
		await this.wait();

		return true;
	}
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //
	// =================================== END OF IMPPORTANT CORE LOGIC ********* //
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ //
	async move_player(name, from, to)
	{
		if (!name || !from || !to)
			return false;

		let source = {arr: null, ctn: null, type: null};
		await this.move_player_utils(source, from);

		let target = {arr: null, ctn: null, type: null};
		await this.move_player_utils(target, to);

		let name_html_div = source.ctn.querySelector(`[title="${name}"]`);
		if (!name_html_div)
			throw new Error('Name not found in source container');

		//remove from source container and array
		source.ctn.removeChild(name_html_div);
		const index = source.arr.indexOf(name);
		source.arr.splice(index, 1);

		name_html_div.dataset.type = target.type;
		target.arr.push(name);
		if (target.ctn.children.length === 1 && target.ctn.children[0].classList.contains('empty-list'))
			target.ctn.removeChild(target.ctn.children[0]);
		target.ctn.appendChild(name_html_div);

		await this.fill_empty_ctn();

		return true;
	}

	async fill_empty_ctn()
	{
		const ctns = [this.play_ctn, this.wait_ctn, this.elim_ctn, this.lobby_ctn];
		if (ctns.includes(null))
			throw new Error('Important constructor variables are null');

		for (const ctn of ctns)
		{
			if (ctn.children.length === 0)
			{
				const p = document.createElement('p');
				p.classList.add('empty-list');
				p.textContent = '(empty)';
				ctn.appendChild(p);
			}
		}

		return true;
	}

	async move_player_utils(obj, type)
	{
		if (type === 'play')
		{
			if (!this.playing || !this.play_ctn)
				throw new Error('Important constructor variables are null');
			obj.arr = this.playing;
			obj.ctn = this.play_ctn;
			obj.type = 'playing';
		}
		else if (type === 'wait')
		{
			if (!this.waiting || !this.wait_ctn)
				throw new Error('Important constructor variables are null');
			obj.arr = this.waiting;
			obj.ctn = this.wait_ctn;
			obj.type = 'waiting';
		}
		else if (type === 'elim')
		{
			if (!this.eliminated || !this.elim_ctn)
				throw new Error('Important constructor variables are null');
			obj.arr = this.eliminated;
			obj.ctn = this.elim_ctn;
			obj.type = 'eliminated';
		}
		else if (type === 'lobby')
		{
			if (!this.lobby || !this.lobby_ctn)
				throw new Error('Important constructor variables are null');
			obj.arr = this.lobby;
			obj.ctn = this.lobby_ctn;
			obj.type = 'lobby';
		}
		else
		{
			throw new Error('Invalid type');
		}

		return true;
	}


	async btn_manage(btn, type)
	{
		if (type === 'disable')	
		{
			btn.disabled = true;
			btn.classList.add('d-none');
		}
		else if (type === 'enable')
		{
			btn.disabled = false;
			btn.classList.remove('d-none');
		}
		else
		{
			throw new Error('invalid type');
		}
		return true;
	}

	async reset_tournament(type)
	{
		await this.reset(type);
		await EG_DATA.reset();
	}

	// player management
	async random_pairing(type)
	{
		if (this.lobby.length === 0 && this.waiting.length === 0)
		{
			this.next = null;
			return false;
		}

		if (this.round === 1)
		{
			while (this.playing.length < 2 && this.waiting.length > 0)
			{
				const  random_num = Math.floor(Math.random() * this.waiting.length);
				await this.move_player(this.waiting[random_num], 'wait', 'play');
			}
		}
		const random_num = Math.floor(Math.random() * this.waiting.length);
		this.next = this.waiting[random_num];

		return true;
	}

	async move_all_to_waiting()
	{
		this.waiting = this.waiting.concat(this.lobby);
		this.lobby = [];

		return true;
	}

	async add_player(name)
	{
		if (!name)
			throw new Error('name is null');

		const sm_name = name.toLowerCase();
		if (this.lobby.length >= this.max_players)
		{
			alert('Max players reached');
			return false;
		}
		else if (this.lobby.includes(sm_name))
		{
			alert('Name already exists');
			return false;
		}
		this.lobby.push(sm_name);

		let str = `${name} has joined the lobby `;
		str += `(${this.lobby.length}/${this.max_players})`;
		await EG_UTILS.announce(str);

		if (this.lobby.length >= this.max_players)
			await EG_UTILS.announce('Max players reached');

		await this.render_list();

		return true;
	}

	async host_or_guest(name)
	{
		const host = JSON.parse(localStorage.getItem('user')).username;
		if (name === host)
			return 'host';
		else
			return 'guest';
	}

	async render_list()
	{
		this.play_ctn.innerHTML = '';
		this.wait_ctn.innerHTML = '';
		this.elim_ctn.innerHTML = '';
		this.lobby_ctn.innerHTML = '';

		for (const name of this.lobby)
		{
			const str = await this.host_or_guest(name);
			const style = str === 'host' ? 'playing' : 'offline';
			ROOM_LIST.playerListGenerator(
				this.lobby_ctn, name, 'Lobby', str, style
			);
		}
		for (const name of this.waiting)
		{
			const str = await this.host_or_guest(name);
			const style = str === 'host' ? 'playing' : 'offline';
			ROOM_LIST.playerListGenerator(
				this.wait_ctn, name, 'Waiting', str, style
			);
		}
		for (const name of this.eliminated)
		{
			const str = await this.host_or_guest(name);
			const style = str === 'host' ? 'playing' : 'offline';
			ROOM_LIST.playerListGenerator(
				this.elim_ctn, name, 'Eliminated', str, style
			);
		}
		for (const name of this.playing)
		{
			const str = await this.host_or_guest(name);
			const style = str === 'host' ? 'playing' : 'offline';
			ROOM_LIST.playerListGenerator(
				this.play_ctn, name, 'Playing', str, style
			);
		}
		await this.fill_empty_ctn();
		return true;
	}
}

const item = new tnmLogicClass();
export default item;
