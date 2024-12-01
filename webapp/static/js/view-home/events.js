// file : events.js (view-home)
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
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
async function history_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('history_btn');
	});

	return true;
}

async function settings_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('settings_btn');
	});

	return true;
}

async function logout_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('logout_btn');
		/*=================================================================*/
		event.preventDefault();
		try {
			const csrfToken = await COOKIE.getCookie('csrftoken');
			const response = await fetch('/api/logout/', {
				method: 'POST',
				headers: {
					'X-CSRFToken': csrfToken
				}
			});
			const data = await response.json();
			if (response.ok) {
				console.log('Logout successful.');
				await LOGIN.build();
			}
			else {
				console.error('Logout failed.');
			}
		}
		catch (error) {
			console.error('Logout failed.');
		}
		/*=================================================================*/
	});

	return true;
}

async function build()
{
	const btn = document.getElementById('btn_history');
	const btn2 = document.getElementById('btn_settings');
	const btn3 = document.getElementById('btn_logout');

	await history_btn(btn);
	await settings_btn(btn2);
	await logout_btn(btn3);

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build
};
