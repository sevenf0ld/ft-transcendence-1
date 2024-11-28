// file : events.js (view-login)
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as FORGETPASS from '../view-forgetpass/template.js';
import * as REGISTER from '../view-register/template.js';
import * as HOME from '../view-home/template.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
async function form_forgot(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('forgot-password-link clicked');
	});

	return true;
}

async function form_submitBtn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('submit-button clicked');
		HOME.build();
	});

	return true;
}

async function intra_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('intra-button clicked');
	});

	return true;
}

async function signup_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('sign-up-button clicked');
		REGISTER.build();
	});

	return true;
}

async function build()
{
	const btn = document.getElementById('btn_forgot');
	const btn2 = document.getElementById('btn_login');
	const btn3 = document.getElementById('btn_intra');
	const btn4 = document.getElementById('btn_signup');

	await form_forgot(btn);
	await form_submitBtn(btn2);
	await intra_btn(btn3);
	await signup_btn(btn4);

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build
};
