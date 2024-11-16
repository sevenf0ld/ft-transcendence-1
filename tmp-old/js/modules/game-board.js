// file : game-board.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
// -------------------------------------------------- //
// modules
// -------------------------------------------------- //
async function clear()
{
	const GAME_BOARD = document.getElementById("game_board");

	return new Promise((resolve, reject) => {
		if ( GAME_BOARD )
		{
			while (GAME_BOARD.firstChild)
				GAME_BOARD.removeChild(GAME_BOARD.firstChild);
			resolve(true);
		}
		else
			reject("game board not found");
	});
}

async function home()
{
	const local_h3 = document.createElement('h3');
	const local_btns_div = document.createElement('div');
	const local_pvp_btn = document.createElement('button');
	const local_pve_btn = document.createElement('button');
	const local_tnm_btn = document.createElement('button');
	const remote_h3 = document.createElement('h3');
	const remote_btns_div = document.createElement('div');
	const remote_pvp_btn = document.createElement('button');
	const remote_tnm_btn = document.createElement('button');

	const re_obj =
	{
		local_h3: local_h3,
		local_btns_div: local_btns_div,
		local_pvp_btn: local_pvp_btn,
		local_pve_btn: local_pve_btn,
		local_tnm_btn: local_tnm_btn,
		remote_h3: remote_h3,
		remote_btns_div: remote_btns_div,
		remote_pvp_btn: remote_pvp_btn,
		remote_tnm_btn: remote_tnm_btn
	};

	return re_obj;
}

async function wait_room()
{
	const main_div = document.getElementById("game_board");
	const wait_msg = document.createElement("h2");

	const re_obj =
	{
		main_div: main_div,
		wait_msg: wait_msg
	};

	return re_obj;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export { clear, home, wait_room };
