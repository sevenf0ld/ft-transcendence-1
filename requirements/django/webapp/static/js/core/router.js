// file : router.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import HomeView from '../views/HomeView.js';
import LoginView from '../views/LoginView.js';
import GameRoomView from '../views/GameRoomView.js';
import SignupView from '../views/SignupView.js';
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
		this.routes = {};
		this.defaultRoute = null;
		this.currentView = null;
	}

	async init(defaultRoute)
	{
		this.defaultRoute = defaultRoute;
		if (!this.defaultRoute)
			throw new Error('default route not set');

		window.addEventListener('hashchange', async () => {
			await this.loadPage(window.location.hash);
		});

		if (!await this.user_session_checker(this.defaultRoute))
			return false;

		this.loadPage(window.location.hash || this.defaultRoute);

		return true;
	}

	async addRoute(route, page)
	{
		this.routes[route] = page;

		return true;
	}

	async update_url_bar(route)
	{
		window.location.hash = route;

		return true;
	}

	async loadPage(route)
	{
		const page = route.replace(/^#/, '') || this.defaultRoute.replace(/^#/, '');
		const viewClass = this.routes[page];

		console.log('pagexx:', page);
		if (!await this.user_session_checker(page))
			return false;

		if (viewClass)
		{
			this.currentView = viewClass;
			await this.currentView.render();
			await this.update_url_bar(page);
		}
		else
		{
			alert('Page not found! Redicrecting to login/home page');
			await this.update_url_bar(this.defaultRoute);
			this.currentView = this.routes[this.defaultRoute];
			await this.currentView.render();
			console.error('[THIS IS A HANDLED ERROR] Page not found:', page);
		}

		return true;
	}

	async default_route_detector()
	{
		const existing_user = JSON.parse(localStorage.getItem('user'));
		return existing_user ? '/home' : '/login';
	}

	async is_user_logged_in()
	{
		const existing_user = JSON.parse(localStorage.getItem('user'));
		return existing_user ? true : false;
	}

	async user_session_checker(page)
	{
		if(!await this.is_user_logged_in() && page !== '/login' && page !== '/signup')
		{
			alert('You need to be logged in to access this page. Redirecting to login page');
			await this.update_url_bar('/login');
			this.currentView = this.routes['/login'];
			await this.currentView.render();

			return false;
		}

		return true;
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
const ROUTER = new Router();
ROUTER.addRoute('/home', HomeView);
ROUTER.addRoute('/login', LoginView);
ROUTER.addRoute('/game-room', GameRoomView);
ROUTER.addRoute('/signup', SignupView);
export default ROUTER;
