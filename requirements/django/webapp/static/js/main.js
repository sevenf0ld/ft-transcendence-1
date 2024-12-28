// file : main.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import ROUTER from './core/router.js';
import './core/toolkits/bootstrap.bundle.js';
import LOGIN_VIEW from './views/LoginView.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// local-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
async function main()
{
	await LOGIN_VIEW.render();
	return true;
}

document.addEventListener('DOMContentLoaded', main);
