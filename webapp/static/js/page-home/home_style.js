/* home-page_style.js

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
// -------------------------------------------------- */
// header
// -------------------------------------------------- */
async function header(obj)
{
	obj.classList.add('d-flex');
	obj.classList.add('flex-row');
	obj.classList.add('bg-dark');
	obj.classList.add('text-white');
	obj.classList.add('align-items-center');
	obj.classList.add('justify-content-center');
	obj.classList.add('w-100');

	const media_box = document.createElement('div');
	media_box.classList.add('main-width-container');
	media_box.classList.add('h-100');

	obj.appendChild(media_box);

	const logo = document.createElement('h1');
	logo.classList.add('py-2');
	logo.textContent = '42Pong';
	logo.classList.add('h1');

	media_box.appendChild(logo);

	return (logo);
}

// -------------------------------------------------- */
// main
// -------------------------------------------------- */
// overall
async function main_body(obj)
{
	obj.classList.add('flex-grow-1');
	obj.classList.add('d-flex');
	obj.classList.add('flex-column');
	obj.classList.add('justify-content-center');
	obj.classList.add('align-items-center');
	obj.classList.add('text-white');

	return true;
}

async function media_box(obj)
{
	obj.classList.add('main-width-container');
	obj.classList.add('d-flex');
	obj.classList.add('p-4');

	return true;
}

// left-panel
async function left_panel(obj)
{
	obj.main_div.classList.add('left-panel');
	obj.main_div.classList.add('p-3');
	obj.main_div.classList.add('d-flex');
	obj.main_div.classList.add('flex-column');
	obj.main_div.classList.add('align-items-center');
	obj.main_div.setAttribute('id', 'left-panel');

	const profile_pic = obj.profile_pic;
	profile_pic.classList.add('profile-pic');
	profile_pic.classList.add('d-flex');

	const name = 'jliaw123'.toLowerCase();
	const profile_name = obj.profile_name;
	profile_name.classList.add('profile-name');
	profile_name.classList.add('h5');
	profile_name.classList.add('truncate');
	profile_name.textContent = name;
	profile_name.title = name;

	const separator = obj.separator;
	separator.classList.add('separator');

	const win_lost_div = obj.win_lost_div;
	win_lost_div.classList.add('win-lost-div');
	win_lost_div.classList.add('p-3');
	win_lost_div.classList.add('w-100');
	win_lost_div.classList.add('d-flex');
	win_lost_div.classList.add('border-0');
	win_lost_div.classList.add('truncate');
	win_lost_div.classList.add('flex-column');
	win_lost_div.classList.add('align-items-center');
	win_lost_div.classList.add('justify-content-center');

	const win_stat = obj.win_stat;
	win_stat.classList.add('truncate');
	win_stat.textContent = 'WINS : 0';

	const lost_stat = obj.lost_stat;
	lost_stat.classList.add('truncate');
	lost_stat.textContent = 'LOSSES : 0';

	win_lost_div.appendChild(win_stat);
	win_lost_div.appendChild(lost_stat);

	const history_btn = obj.history_btn;
	history_btn.classList.add('my-btn-primary');
	history_btn.classList.add('truncate');
	history_btn.classList.add('w-100');
	history_btn.textContent = 'Match History';

	const btn_box_btm = obj.btn_box_btm;
	btn_box_btm.classList.add('btn-box-btm');
	btn_box_btm.classList.add('d-flex');
	btn_box_btm.classList.add('flex-column');
	btn_box_btm.classList.add('justify-content-end');
	btn_box_btm.classList.add('w-100');

	const settings_btn = obj.settings_btn;
	settings_btn.classList.add('my-btn-primary');
	settings_btn.classList.add('w-100');
	settings_btn.textContent = 'Settings';

	const logout_btn = obj.logout_btn;
	logout_btn.classList.add('my-btn-primary');
	logout_btn.classList.add('w-100');
	logout_btn.textContent = 'Logout';

	btn_box_btm.appendChild(settings_btn);
	btn_box_btm.appendChild(logout_btn);

	obj.main_div.appendChild(profile_pic);
	obj.main_div.appendChild(profile_name);
	obj.main_div.appendChild(separator);
	obj.main_div.appendChild(win_lost_div);
	obj.main_div.appendChild(history_btn);
	obj.main_div.appendChild(btn_box_btm);

	return true;
}

// center-panel
// center-panel-main
async function center_panel(obj)
{
	obj.main_div.classList.add('center-panel');
	obj.main_div.classList.add('p-3');
	obj.main_div.classList.add('d-flex');
	obj.main_div.classList.add('flex-column');

	const obj_top = obj.top_div;
	obj_top.classList.add('center-panel-top');
	obj_top.classList.add('d-flex');
	obj_top.classList.add('flex-column');

	const title = obj.game_title;
	title.textContent = 'Game Mode';
	title.classList.add('h2');
	title.classList.add('text-center');
	title.setAttribute('id', 'game_title');

	const game_board = obj.game_board_div;
	game_board.classList.add('game-board');
	game_board.classList.add('d-flex');
	game_board.classList.add('flex-column');
	game_board.classList.add('align-items-center');
	game_board.classList.add('justify-content-center');
	game_board.classList.add('p-4');
	game_board.setAttribute('id', 'game_board');

	obj_top.appendChild(title);
	obj_top.appendChild(game_board);

	const obj_bot = obj.bottom_div;
	obj_bot.classList.add('center-panel-bottom');
	obj_bot.classList.add('d-flex');
	obj_bot.classList.add('flex-row');

	const small_card = obj.bot_small_card;
	small_card.classList.add('small-card');
	small_card.classList.add('d-flex');
	small_card.classList.add('flex-column');
	small_card.classList.add('text-center');
	small_card.setAttribute('id', 'small_card');

	const chat_room = obj.bot_chat_room;
	chat_room.classList.add('chat-room');
	chat_room.classList.add('d-flex');
	chat_room.classList.add('flex-column');
	chat_room.classList.add('text-center');
	chat_room.setAttribute('id', 'chat_room');

	obj_bot.appendChild(small_card);
	obj_bot.appendChild(chat_room);

	obj.main_div.appendChild(obj_top);
	obj.main_div.appendChild(obj_bot);

	return true;
}

async function game_board(obj)
{
	const game_board = document.getElementById('game_board');

	const local_h3 = obj.local_h3;
	local_h3.textContent = 'Local';
	local_h3.classList.add('h3');
	local_h3.classList.add('text-center');

	const local_btns_div = obj.local_btns_div;
	local_btns_div.classList.add('div-local-btn');
	local_btns_div.classList.add('d-flex');
	local_btns_div.classList.add('flex-row');
	local_btns_div.classList.add('justify-content-center');
	local_btns_div.classList.add('align-items-center');
	local_btns_div.classList.add('py-3');
	
	const local_pvp_btn = obj.local_pvp_btn;
	local_pvp_btn.classList.add('my-btn-primary');
	local_pvp_btn.textContent = 'PvP';

	const local_pve_btn = obj.local_pve_btn;
	local_pve_btn.classList.add('my-btn-primary');
	local_pve_btn.textContent = 'PvE';

	const local_tnm_btn = obj.local_tnm_btn;
	local_tnm_btn.classList.add('my-btn-primary');
	local_tnm_btn.textContent = 'Tournament';

	local_btns_div.appendChild(local_pvp_btn);
	local_btns_div.appendChild(local_pve_btn);
	local_btns_div.appendChild(local_tnm_btn);

	const remote_h3 = obj.remote_h3;
	remote_h3.textContent = 'Remote';
	remote_h3.classList.add('h3');
	remote_h3.classList.add('text-center');
	remote_h3.classList.add('remote-title');

	const remote_btns_div = obj.remote_btns_div;
	remote_btns_div.classList.add('div-remote-btn');
	remote_btns_div.classList.add('d-flex');
	remote_btns_div.classList.add('flex-row');
	remote_btns_div.classList.add('justify-content-center');
	remote_btns_div.classList.add('align-items-center');
	remote_btns_div.classList.add('py-3');

	const remote_pvp_btn = obj.remote_pvp_btn;
	remote_pvp_btn.classList.add('my-btn-primary');
	remote_pvp_btn.textContent = 'PvP';

	const remote_tnm_btn = document.createElement('button');
	remote_tnm_btn.classList.add('my-btn-primary');
	remote_tnm_btn.textContent = 'Tournament';

	remote_btns_div.appendChild(remote_pvp_btn);
	remote_btns_div.appendChild(remote_tnm_btn);

	game_board.appendChild(local_h3);
	game_board.appendChild(local_btns_div);
	game_board.appendChild(remote_h3);
	game_board.appendChild(remote_btns_div);

	return true;
}

async function small_card(obj)
{
	const div = document.getElementById('small_card');
	const p = obj.placeholder_p;
	p.textContent = '- Placeholder - ';

	div.appendChild(p);

	return true;
}

async function chat_room(obj)
{
	const div = document.getElementById('chat_room');
	const p = obj.placeholder_p;
	p.textContent = '- Placeholder - ';

	div.appendChild(p);

	return true;
}

// right-panel
async function display_friends(obj)
{
	//BACKEND FETCH
	const BACKEND = 'NOT_IMPLEMENTED_YET';

	if ( BACKEND != 'NOT_IMPLEMENTED_YET' )
	{
		//fetch friends
	}
	else
	{
		const placeholder = document.createElement('p');

		placeholder.textContent = '- No Friends -';
		placeholder.classList.add('place-holder');
		placeholder.classList.add('text-center');
		placeholder.setAttribute('id', 'right_panel_placeholder');

		obj.appendChild(placeholder);
	}
}

async function right_panel(obj)
{
	obj.main_div.classList.add('right-panel');
	obj.main_div.classList.add('p-3');
	obj.main_div.classList.add('d-flex');
	obj.main_div.classList.add('flex-column');
	obj.main_div.setAttribute('id', 'right_panel');

	const title = obj.title_h3;
	title.classList.add('h3');
	title.textContent = 'Friends';
	title.classList.add('truncate');
	title.setAttribute('id', 'right_panel_title');

	const friends_list = obj.player_list_div;
	friends_list.classList.add('players-list');
	friends_list.classList.add('d-flex');
	friends_list.classList.add('flex-column');
	friends_list.classList.add('p-3');
	friends_list.setAttribute('id', 'right_panel_list');

	display_friends(friends_list);

	const add_friend_btn = obj.add_friend_btn;
	add_friend_btn.classList.add('my-btn-primary');
	add_friend_btn.textContent = 'Add Friend';
	add_friend_btn.setAttribute('id', 'right_panel_add_friend_btn');

	obj.main_div.appendChild(title);
	obj.main_div.appendChild(friends_list);
	obj.main_div.appendChild(add_friend_btn);

	return true;
}

// -------------------------------------------------- */
// footer
// -------------------------------------------------- */
async function footer(obj)
{
	obj.classList.add('d-flex');
	obj.classList.add('flex-row');
	obj.classList.add('bg-dark');
	obj.classList.add('text-white');
	obj.classList.add('align-items-center');
	obj.classList.add('justify-content-center');
	obj.classList.add('w-100');

	const media_box = document.createElement('div');
	media_box.classList.add('main-width-container');
	media_box.classList.add('h-100');
	media_box.classList.add('d-flex');
	media_box.classList.add('flex-column');
	media_box.classList.add('align-items-center');
	media_box.classList.add('justify-content-center');

	const copyWrite = document.createElement('p');
	copyWrite.classList.add('py-2');

	const thisYear = new Date().getFullYear();
	copyWrite.classList.add('h6');
	copyWrite.textContent = `© ${thisYear} - 42Pong`;

	media_box.appendChild(copyWrite);

	obj.appendChild(media_box);

	return true;
}

// -------------------------------------------------- */
// export
// -------------------------------------------------- */
export {
	header,
	footer,
	main_body,
	left_panel,
	center_panel,
	game_board,
	small_card,
	chat_room,
	right_panel,
	media_box
};
