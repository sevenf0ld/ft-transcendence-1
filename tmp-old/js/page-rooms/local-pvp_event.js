// file : local-pvp_event.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import * as HOMEPAGE from '../page-home/home_core.js';
import * as MEDIA from '../modules/media.js';

// -------------------------------------------------- //
// functions
// -------------------------------------------------- //
async function game_board(obj)
{
	return true;
}

async function start_btn(obj)
{
	obj.addEventListener('click', async function()
	{
		console.log('start-btn clicked');
	});
	return true;
}

async function leave_btn(obj)
{
	obj.addEventListener('click', async function()
	{
		console.log('leave-btn clicked');
		await MEDIA.clear();
		await HOMEPAGE.build();
	});
	return true;
}

// -------------------------------------------------- //
// Export
// -------------------------------------------------- //
export {
	game_board,
	start_btn,
	leave_btn
};
