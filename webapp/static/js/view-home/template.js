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
async function insert_game_board_home()
{
	const str = `
	<div class="custom-board-home">
		<div class="board-home-left">
			<div class="custom-dis-group">
				<h3>Local</h3>
				<div class="custom-btn-group">
					<button id="btn_local_pve">PVE</button>
					<button id="btn_local_pvp">PVP</button>
					<button id="btn_local_tour">
						Tournament
					</button>
				</div>
			</div>
			<div class="custom-dis-group">
				<h3>Remote</h3>
				<div class="custom-btn-group">
					<button id="btn_remo_pvp">PVP</button>
					<button id="btn_remo_tour">
						Tournament
					</button>
				</div>
			</div>
		</div>
		<div class="board-home-right">
			<img/>
		</div>
	</div>
	`;

	const gameboard = document.getElementById(
		'game-board-div'
	);

	gameboard.innerHTML = str;

	return true;
}

async function build()
{
	await MEDIA.build();
	const MEDIA_OBJ = await MEDIA.get()
	const year = new Date().getFullYear();

	const template = `
	<header>
		<div class="custom-page-width">
			<h1 id="logo"> 42Pong </h1>
		</div>
	</header>
	<main>
		<div class="custom-page-width custom-body-card">
			<div id="left-panel">
				<img class="custom-pfp"></img>
				<h2 class="custom-username">JLIAW</h2>
				<div class="progress">
					<div></div>
				</div>
				<div class="custom-btn-group">
					<button id="btn_history">History</button>
					<button id="btn_settings">Settings</button>
					<button id="btn_logout">Logout</button>
				</div>
			</div>
			<div id="middle-panel">
				<div id="mid-panel-top">
					<h3 id="board-title">game-mode</h3>
					<div id="game-board-div">
					</div>
				</div>
				<div id="mid-panel-bot">
					<div class="custom-bottom-left"></div>
					<div class="custom-bottom-right"></div>
				</div>
			</div>
			<div id="right-panel"></div>
		</div>
	</main>
	<footer>
		<div class="custom-page-width">
			<p id="copy" > &copy ${year} - 42Pong </p>
		</div>
	</footer>
	`;
	MEDIA_OBJ.media.innerHTML = template;
	await insert_game_board_home();
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
