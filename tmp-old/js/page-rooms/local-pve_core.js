// file : local-pve_core.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import * as LEFT_PANEL from "../modules/left-panel.js";
import * as GAME_BOARD from "../modules/game-board.js";
import * as SMALL_CARD from "../modules/small-card.js"
import * as CHAT_ROOM from "../modules/chat-room.js"
import * as RIGHT_PANEL from "../modules/right-panel.js"
import * as PLAYERS_LIST from "../modules/players-list.js"
import * as STYLE from "./local-pve_style.js"
import * as EVENT from "./local-pve_event.js"

// -------------------------------------------------- //
// functions
// -------------------------------------------------- //
async function build()
{
	//common theme
	await LEFT_PANEL.clear();
	const left_panel = await LEFT_PANEL.wait_room();
	await STYLE.left_panel(left_panel);

	await GAME_BOARD.clear();
	const game_board = await GAME_BOARD.wait_room();
	await STYLE.game_board(game_board);
	await EVENT.game_board(game_board);

	await RIGHT_PANEL.clear();
	const right_panel = await RIGHT_PANEL.wait_room();
	await STYLE.right_panel(right_panel);
	await EVENT.leave_btn(right_panel.leave_btn);

	const r_title = document.getElementById('right_panel_title');
	r_title.textContent = "PLAYERS";

	// mode specified theme
	const title = await document.getElementById("game_title");
	title.textContent = "LOCAL-PVE";

	const left_panel_pve = await LEFT_PANEL.local_pve;
	await STYLE.left_panel_pve(left_panel_pve);

	await SMALL_CARD.clear();
	const small_card_pve = await SMALL_CARD.local_pve();
	await STYLE.small_card_pve(small_card_pve);

	await CHAT_ROOM.clear();
	const chat_room_pve = await CHAT_ROOM.local_pve();
	await STYLE.chat_room_pve(chat_room_pve);

	await PLAYERS_LIST.clear();
	const players_list_pve = await PLAYERS_LIST.local_pve();
	await STYLE.players_list_pve(players_list_pve);

	await EVENT.start_btn(right_panel.start_btn);

	return true;
}
// -------------------------------------------------- //
// Export
// -------------------------------------------------- //
export { build };
