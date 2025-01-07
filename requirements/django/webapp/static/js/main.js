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
	const def_route = await ROUTER.default_route_detector();
	ROUTER.init(def_route);

	return true;
}

document.addEventListener('DOMContentLoaded', main);
