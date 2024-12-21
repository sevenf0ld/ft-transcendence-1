// file : main.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import ROUTER from './core/router.js';
import './core/toolkits/bootstrap.bundle.js';
import TOKEN from './core/token.js';
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
	//TOKEN.token_id = await setInterval(TOKEN.refresh_token, 210000);

	await ROUTER.navigateTo('/login');

	return true;
}

document.addEventListener('keydown', async (event) =>
{
    if ((event.ctrlKey && event.key === 'r') || event.key === 'F5')
	{
        event.preventDefault();
    
		console.log('Nah do\'nt refresh, this is a SPA.');
	}
})

window.onpopstate = ROUTER.router;
document.addEventListener('DOMContentLoaded', main);
