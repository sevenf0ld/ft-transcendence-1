// file : main.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import ROUTER from './core/router.js';
import './core/toolkits/bootstrap.bundle.js';
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
	await ROUTER.navigateTo('/login');

	return true;
}

document.addEventListener('keydown', async (event) =>
{
    if ((event.ctrlKey && event.key === 'r') || event.key === 'F5')
	{
        event.preventDefault();
		console.log('Nah do\'nt refresh, this is a SPA');
	}
});

window.onpopstate = ROUTER.router;
document.addEventListener('DOMContentLoaded', main);