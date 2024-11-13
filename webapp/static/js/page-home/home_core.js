// file : home-page_core.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
/*
 * media
 *  ├ header
 *  │  └ main-width-container
 *  │       └ logo
 *  ├ main
 *  │  └ main-width-container
 *  │       ├────────────── left-panel
 *  │       │                 ├ profile-pic
 *  │       │                 ├ profile-name
 *  │       │                 ├ separator
 *  │       │                 ├ win-lost-div
 *  │       │                 │  ├ win
 *  │       │                 │  └ lost
 *  │       │                 ├ match-history-btn
 *  │       │                 └ btn-box-btm
 *  │       │                        ├ button-settings
 *  │       │                        └ button-logout
 *  │       ├──  center-panel
 *  │       │    ├ center-panel-top
 *  │       │    │  ├ text-game-mode
 *  │       │    │  └ game-board-div
 *  │       │    │       ├ title-h3
 *  │       │    │       ├ button-div
 *  │       │    │       │  ├ button-pvp
 *  │       │    │       │  ├ button-pve
 *  │       │    │       │  └ button-tnm
 *  │       │    │       ├ title-h3
 *  │       │    │       └ button-div
 *  │       │    │          ├ button-pvp
 *  │       │    │          └ button-tnm
 *  │       │    └ center-panel-bottom
 *  │       │       ├ left-card
 *  │       │       └ right-card
 *  │       │
 *  │       └─────── right-panel
 *  │                   ├ text-friends
 *  │                   ├ friend-container
 *  │                   └ add-friend-btn
 *  └ footer
 *      └ main-width-container
 *           └ p
 */

// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import * as STYLE from './home_style.js';
import * as EVENT from './home_event.js';
import * as LEFTPANEL from '../modules/left-panel.js';
import * as GAMEBOARD from '../modules/game-board.js';
import * as SMALLCARD from '../modules/small-card.js';
import * as CHATROOM from '../modules/chat-room.js';
import * as RIGHTPANEL from '../modules/right-panel.js';
import * as CENTERPANEL from '../modules/center-panel.js';

// -------------------------------------------------- //
// /header & /footer
// -------------------------------------------------- //
async function build_header()
{
	const header = document.createElement('header');
	const logo = await STYLE.header(header);
	await EVENT.header(logo);

	return header;
}

async function build_footer()
{
	const footer = document.createElement('footer');
	await STYLE.footer(footer);

	return footer;
}

// -------------------------------------------------- //
// /body/
// -------------------------------------------------- //
async function build_left_panel()
{
	const left_panel = await LEFTPANEL.home();
	await STYLE.left_panel(left_panel);

	await EVENT.history_btn(left_panel.history_btn);
	await EVENT.settings_btn(left_panel.settings_btn);
	await EVENT.logout_btn(left_panel.logout_btn);

	return left_panel.main_div;
}

async function build_center_panel()
{
	const center_panel = await CENTERPANEL.home();
	await STYLE.center_panel(center_panel);

	return center_panel.main_div;
}

async function build_right_panel()
{
	const right_panel = await RIGHTPANEL.home();
	await STYLE.right_panel(right_panel);

	await EVENT.add_friend_btn(right_panel.add_friend_btn);

	return right_panel.main_div;
}

async function build_body()
{
	const main = document.createElement('main');
	await STYLE.main_body(main);

	const main_width_container = document.createElement('div');
	await STYLE.media_box(main_width_container);

	const left_panel = await build_left_panel();
	const center_panel = await build_center_panel();
	const right_panel = await build_right_panel();

	main.appendChild(main_width_container);

	main_width_container.appendChild(left_panel);
	main_width_container.appendChild(center_panel);
	main_width_container.appendChild(right_panel);

	return main;
}


// -------------------------------------------------- //
// spot-specific
// -------------------------------------------------- //
async function build_game_board()
{
	const game_board = await GAMEBOARD.home();
	await STYLE.game_board(game_board);

	await EVENT.local_pvp_btn(game_board.local_pvp_btn);
	await EVENT.local_pve_btn(game_board.local_pve_btn);
	await EVENT.local_tnm_btn(game_board.local_tnm_btn);
	await EVENT.remote_pvp_btn(game_board.remote_pvp_btn);
	await EVENT.remote_tnm_btn(game_board.remote_tnm_btn);

	return true;
}

async function build_small_card()
{
	const small_card = await SMALLCARD.home();
	await STYLE.small_card(small_card);

	return true;
}

async function build_chat_room()
{
	const chat_room = await CHATROOM.home();
	await STYLE.chat_room(chat_room);

	return true;
}

// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
async function build()
{
	const DOM_MEDIA = document.getElementById('media');

	const header = await build_header();
	const body = await build_body();
	const footer = await build_footer();

	DOM_MEDIA.appendChild(header);
	DOM_MEDIA.appendChild(body);
	DOM_MEDIA.appendChild(footer);

	await build_game_board();
	await build_small_card();
	await build_chat_room();

	return true
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export { build };
