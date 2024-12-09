// file : template.js (view-login)
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
import * as FORMVALI from '../utils/form-vali.js';
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
	<div>
		<p> 42PONG - SIGN IN </p>
		<form>
			<div>
				<label for="username">Username</label><input
					type="text"
					id="username"
					placeholder="Enter your username"
					name="username"
					required
				>
			</div>
			<div>
				<label for="password">Password</label><input
					type="password"
					id="password"
					placeholder="Enter your password"
					name="password"
					required
				>
			</div>
			<div>
				<a id="btn_forgot" href="#">Forgot Password?</a>
			</div>
			<button id="btn_login" type="submit">Sign In</button>
		</form>
		<div>
			<hr>
			<span> or continue </span>
			<hr>
		</div>
		<button id="btn_intra">
			<span> (42) </span>
			<span> Login with intra </span>
		</button>
		<div> 
			<span> Don't have an account? </span>
			<a id="btn_signup" href="#">Sign Up</a>
		</div>
	</div>
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
