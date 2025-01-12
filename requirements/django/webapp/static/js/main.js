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
import * as FETCH from './components/LoginCard_fetch.js';
import LOGOUT from './core/logout.js';
import LANG from './core/language/language.js';
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
	await ROUTER.init_url_change_listener();
	await ROUTER.check_first_tab_or_reload();
	await ROUTER.local_storage_listener('login');
	await ROUTER.local_storage_listener('logout');
	await LANG.insert_script();

	return true;
}

document.addEventListener('DOMContentLoaded', async (e) => {
	await main();
	if (!ROUTER.handled_by_hashchange)
		await ROUTER.hash_change_handler();
});
