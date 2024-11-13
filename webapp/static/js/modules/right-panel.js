// file : right-panel.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import * as PLAYERSLIST from './players-list.js';
// -------------------------------------------------- //
// modules
// -------------------------------------------------- //
async function clear()
{
	const btn = document.querySelectorAll('.right-panel button');
	btn.forEach((e) => e.remove());
	
	const title = document.getElementById('right_panel_title');
	title.textContent = '-';

	PLAYERSLIST.clear();

	return true;
}

async function home()
{
	const main_div = document.createElement('div');
	const title_h3 = document.createElement('h3');
	const player_list_div = document.createElement('div');
	const add_friend_btn = document.createElement('button');

	const re_obj =
	{
		main_div: main_div,
		title_h3: title_h3,
		player_list_div: player_list_div,
		add_friend_btn: add_friend_btn
	};

	return re_obj;
}

async function wait_room()
{
	const main_div = await document.getElementById('right_panel');
	const leave_btn = document.createElement('button');
	const start_btn = document.createElement('button');

	const re_obj =
	{
		main_div: main_div,
		leave_btn: leave_btn,
		start_btn: start_btn
	};

	return re_obj;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export { clear, home, wait_room };
