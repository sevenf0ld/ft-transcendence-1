// file : template.js (view-register)
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
// main-functions
// -------------------------------------------------- //
async function build()
{
	await MEDIA.build();
	const MEDIA_OBJ = await MEDIA.get()

	const template = `
	<div>
		<p> SIGN UP </p>
		<form id="signup_form">
			<div>
				<label for="username">Username</label><input
					type="text"
					id="username"
					placeholder="Enter your username"
					name="username"
					required
				>
				<p id="err_signup_1"></p>
			</div>
			<div>
				<label for="username">Email</label><input
					type="email"
					id="email"
					placeholder="Enter your email"
					name="email"
					required
				>
				<p id="err_signup_2"></p>
			</div>
			<div>
				<label for="username">Password</label><input
					type="password"
					id="password"
					placeholder="Enter your password"
					name="password"
					required
				>
				<p id="err_signup_3"></p>
			</div>
			<div>
				<label for="username">Confirm Password</label><input
					type="password"
					id="password_confirm"
					placeholder="Confirm your password"
					name="password_confirm"
					required
				>
				<p id="err_signup_4"></p>
			</div>
			<button id="btn_register" type="submit">Submit</button>
		</form>
		<a id="btn_back_to_login">Back to Login</a>
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
