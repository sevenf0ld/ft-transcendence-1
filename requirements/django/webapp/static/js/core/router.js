// file : router.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import HOME_VIEW from '../views/HomeView.js';
import LOGIN_VIEW from '../views/LoginView.js';
import GAMEROOM_VIEW from '../views/GameRoomView.js';
import SIGNUP_VIEW from '../views/SignupView.js';
import LOGOUT from '../core/logout.js';
import FOF_VIEW from '../views/404View.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// a router system that will handle the
// back/forward browser buttons
// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
class Router
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.routes = {
			'/home': HOME_VIEW,
			'/login': LOGIN_VIEW,
			'/signup': SIGNUP_VIEW,
			'/404': FOF_VIEW,
		};
		this.handled_by_hashchange = false;
	}

	async init_url_change_listener()
	{
		window.addEventListener('hashchange', async () => {
			this.handled_by_hashchange = true;
			await this.hash_change_handler();
		});
	}

	async hash_change_handler()
	{
		const url_with_hash = window.location.hash;
		const url_without_hash = url_with_hash.replace('#', '');
		const view_class = this.routes[url_without_hash];

		if (!view_class)
		{
			alert('Handled ERROR - 404 - Page not found');
			await LOGOUT.run();
			await this.navigate_to('/404');
		}
		else
		{
			if (await this.back_to_logout(url_without_hash))
				return true;
			if (await this.forward_to_login(url_without_hash))
				return true;
			localStorage.setItem('pong_view', url_without_hash);
			await view_class.render();
		}

		return true;
	}

	async back_to_logout(url_without_hash)
	{
		const hash = url_without_hash;
		const user = JSON.parse(localStorage.getItem('user'));
		if (hash === '/login' || hash === '/signup')
		{
			if (user)
			{
				await LOGOUT.run();
				await this.navigate_to('/login');
				await this.hash_change_handler();
				return true;
			}
		}
	}

	async forward_to_login(url_without_hash)
	{
		const hash = url_without_hash;
		const user = JSON.parse(localStorage.getItem('user'));
		if (!user)
		{
			if (hash === '/home' || hash === '/game-room')
			{
				alert('You need to login first');
				await this.navigate_to('/login');
				await this.hash_change_handler();
				return true;
			}
		}
	}

	async navigate_to(view_url)
	{
		//if after home is admin, do not append hash
		if (window.location.href.includes('admin'))
		{
			window.location.href = window.location.origin + '/admin/';
			return true;
		}

		window.location.hash = view_url;
		await new Promise(resolve => setTimeout(resolve, 100));

		return true;
	}

	async check_first_tab_or_reload()
	{
		const hash = window.location.hash;
		const state_first_visit = hash === '' ? true : false;

		const user = JSON.parse(localStorage.getItem('user'));
		const state_logged_in = user ? true : false;

		const page = localStorage.getItem('pong_view');
		const state_active_page = page ? true : false;

		//first visit
		if (state_first_visit)
		{
			if (state_logged_in)
				await this.navigate_to('/home');
			else
				await this.navigate_to('/login');
		}
		//page_reload
		else if (!state_first_visit)
		{
			//reload but other tab logged in
			if (state_logged_in)
			{
				//does it have an active page
				if (!state_active_page)
					await this.navigate_to('/home');
				else if (state_active_page)
					await this.navigate_to(page);
			}
			//reload but other tab logged out
			else if (!state_logged_in)
			{
				//does it have an active page
				if (!state_active_page)
					await this.navigate_to('/login');
				else if (state_active_page)
					await this.navigate_to(page);
			}
		}

		return true;
	}

	async local_storage_listener(type)
	{
		const ft = this.navigate_to;

		if (type === 'login')
		{
			window.addEventListener('storage', async function(event){
				if (event.key == 'login-event') {
					await ft('/home');
				}
			});
		}
		if (type === 'logout')
		{
			window.addEventListener('storage', async function(event){
				if (event.key == 'logout-event') {
					await LOGOUT.run();
					await ft('/login');
				}
			});
		}

		return true;
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
const ROUTER = new Router();
export default ROUTER;
