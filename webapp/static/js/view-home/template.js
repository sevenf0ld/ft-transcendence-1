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
async function build()
{
	await MEDIA.build();
	const MEDIA_OBJ = await MEDIA.get()

	const template = `
	<header>
		<div class="custom-home-container">
			<h1> 42PONG </h1>
		</div>
	</header>
	<main>
		<div class="custom-home-container">
			<div id="left-panel">
				<img class="custom-pfp">image</img>
				<h2 class="custom-username">user-name</h2>
				<div class="custom-separator">---</div>
				<button id="btn_history">match-history</button>
				<div class="custom-btn-group">
					<button id="btn_settings">settings</button>
					<button id="btn_logout">logout</button>
				</div>
			</div>
			<div id="middle-panel"></div>
			<div id="right-panel"></div>
		</div>
	</main>
	<footer>
		<div class="custom-home-container">
			<p> &copy ${new Date().getFullYear()} - 42PONG </p>
		</div>
	</footer>
	`;
	MEDIA_OBJ.media.innerHTML = template;
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
