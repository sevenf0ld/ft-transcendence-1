// file : events.js (view-home)
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as LOGIN from '../view-login/template.js';
import * as SETTINGS from '../view-settings/template.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
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
		await LOGIN.build();
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
