// file : main.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import './core/toolkits/bootstrap.bundle.js';
import LoginView from './views/LoginView.js';
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
	const loginView = new LoginView();
	await loginView.render();

	return true;
}

document.addEventListener('DOMContentLoaded', main);
