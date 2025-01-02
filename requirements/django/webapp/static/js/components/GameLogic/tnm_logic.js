// file : tnm_logic.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_RENDER from './engine_render.js';
import EG_DATA from './engine_data.js';
import EG_UTILS from './engine_utils.js';
import ROOM_LIST from '../GameRoomView/RoomList.js';
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
		this.tour_over = false;
		this.tour_winner = null;
		this.min_players = 3;
		this.max_players = 5;
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

	async reset()
	{
		this.init_players_data();
		this.init_html_divs();

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

	async move_player(name, from, to)
	{
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
			ROOM_LIST.playerListGenerate(
				this.wait_ctn, name, 'Waiting', str, style
			);
		}
		for (const name of this.eliminated)
		{
			const str = await this.host_or_guest(name);
			const style = str === 'host' ? 'playing' : 'offline';
			ROOM_LIST.playerListGenerate(
				this.elim_ctn, name, 'Eliminated', str, style
			);
		}
		for (const name of this.playing)
		{
			const str = await this.host_or_guest(name);
			const style = str === 'host' ? 'playing' : 'offline';
			ROOM_LIST.playerListGenerate(
				this.play_ctn, name, 'Playing', str, style
			);
		}
		return true;
	}

}

const item = new tnmLogicClass();
export default item;
