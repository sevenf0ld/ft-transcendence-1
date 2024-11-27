// file : template.js (view-home)
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
import * as EVENTS from './events.js';
import * as STYLES from './styles.js';
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as MEDIA from '../utils/media.js';
import * as COOKIE from '../utils/cookie.js';
import * as FORGETPASS from '../view-forgetpass/template.js';
import * as HOME from '../view-home/template.js';
import * as LIVECHAT from '../view-livechat/template.js';
import * as LOCALPVE from '../view-local-pve/template.js';
import * as LOCALPVP from '../view-local-pvp/template.js';
import * as LOCALTOUR from '../view-local-tour/template.js';
import * as LOGIN from '../view-login/template.js';
import * as PROFILE from '../view-profile/template.js';
import * as REGISTER from '../view-register/template.js';
import * as REMOPVP from '../view-remo-pvp/template.js';
import * as REMOTOUR from '../view-remo-tour/template.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
async function insert_board_home()
{
	const str = `
	<div class="ct-board-home">
		<div class="ct-home-section">
			<h3>Local</h3>
			<div class="ct-section-btns">
				<button id="btn_local_pve">PVE</button>
				<button id="btn_local_pvp">PVP</button>
				<button id="btn_local_tour">
					Tournament
				</button>
			</div>
		</div>
		<div class="ct-home-section">
			<h3>Remote</h3>
			<div class="ct-section-btns">
				<button id="btn_remo_pvp">PVP</button>
				<button id="btn_remo_tour">
					Tournament
				</button>
			</div>
		</div>
	</div>
	`;

	const gameboard = document.querySelector(
		'.ct-top-board'
	);

	gameboard.innerHTML = str;

	return true;
}

async function insert_stats_dashboard()
{
	const str = `
	<div class="ct-stats-mid">
		<div class="ct-mid-container">
			<p class="ct-mid-title">Played</p>
			<p class="ct-mid-num">0</p>
		</div>
		<div class="ct-mid-container">
			<p class="ct-mid-title">Win Rate</p>
			<p class="ct-mid-num">0%</p>
		</div>
	</div>
	<div class="ct-stats-bot">
		<div class="ct-bot-left">
			<p class="ct-bot-title">Wins</p>
			<p class="ct-bot-num">0</p>
		</div>
		<div class="ct-bot-right">
			<p class="ct-bot-title">Losses</p>
			<p class="ct-bot-num">0</p>
		</div>
	`;

	const stats = document.querySelector(
		'.ct-lpanel-stats'
	);

	stats.innerHTML = str;

	return true;
}

async function build()
{
	await MEDIA.build();
	const MEDIA_OBJ = await MEDIA.get()
	const year = new Date().getFullYear();

	const template = `
	<header>
		<div class="ct-page-width">
			<h1 id="logo"> 42Pong </h1>
		</div>
	</header>
	<main>
		<div class="ct-page-width ct-main">
			<div class="ct-main-lpanel">
				<img class="ct-lpanel-pfp"></img>
				<h2 class="ct-lpanel-username">JLIAW</h2>
				<div class="ct-lpanel-stats"></div>
				<button id="btn_history">Match History</button>
				<div class="ct-lpanel-btns">
					<button id="btn_settings">Settings</button>
					<button id="btn_logout">Logout</button>
				</div>
			</div>
			<div class="ct-main-mpanel">
				<div class="ct-mpanel-top">
					<h3 class="ct-top-title">Game Mode</h3>
					<div class="ct-top-board"></div>
				</div>
				<div class="ct-mpanel-bottom">
					<div class="ct-bottom-left">
						<p class="ct-bottom-placeholder">(placeholder)</p>
					</div>
					<div class="ct-bottom-right">
						<p class="ct-bottom-placeholder">(placeholder)</p>
					</div>
				</div>
			</div>
			<div class="ct-main-rpanel">
				<h3 class="ct-rpanel-title">Friends</h3>
				<div class="ct-rpanel-list">
					<p class="ct-rpanel-placeholder">(placeholder)</p>
				</div>
				<button id="btn_add">Add Friend</button>
			</div>
		</div>
	</main>
	<footer>
		<div class="ct-page-width">
			<p>&copy ${year} - 42Pong</p>
		</div>
	</footer>
	`;
	MEDIA_OBJ.media.innerHTML = template;
	await insert_stats_dashboard();
	await insert_board_home();
	await STYLES.build();
	await EVENTS.build();

	return true;
}
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
};
