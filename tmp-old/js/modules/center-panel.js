// file : center-panel.js

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
	const CENTER_PANEL = document.getElementById("center-panel");

	return new Promise((resolve, reject) => {
		if ( CENTER_PANEL )
		{
			while (CENTER_PANEL.firstChild)
				CENTER_PANEL.removeChild(CENTER_PANEL.firstChild);
			resolve(true);
		}
		else
			reject("center panel not found");
	});
}

async function home()
{
	const main_div = document.createElement("div");
	const top_div = document.createElement("div");
	const game_title = document.createElement("h2");
	const game_board_div = document.createElement("div");
	const bottom_div = document.createElement("div");
	const bot_small_card = document.createElement("div");
	const bot_chat_room = document.createElement("div");

	const re_obj =
	{
		main_div: main_div,
		top_div: top_div,
		bottom_div: bottom_div,
		game_title: game_title,
		game_board_div: game_board_div,
		bot_small_card: bot_small_card,
		bot_chat_room: bot_chat_room
	};

	return re_obj;
}

async function wait_room()
{
	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export { clear, home, wait_room };
