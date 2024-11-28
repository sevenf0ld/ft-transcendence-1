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
	<div class="ct-login">
		<p class="ct-login-header">42PONG - SIGN IN</p>
		<form class="ct-login-form">
			<div class="ct-form-group">
				<label for="username">Username</label><input
					type="text"
					id="username"
					placeholder="Enter your username"
					name="username"
					required
				>
			</div>
			<div class="ct-form-group">
				<label for="password">Password</label><input
					type="password"
					id="password"
					placeholder="Enter your password"
					name="password"
					required
				>
			</div>
			<div class="ct-btn-forgot">
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
