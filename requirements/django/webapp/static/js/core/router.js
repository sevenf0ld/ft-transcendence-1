// file : router.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import LoginView from '../views/LoginView.js';
import HomeView from '../views/HomeView.js';
import SignupView from '../views/SignupView.js';
import PageNotFoundView from '../views/404View.js';
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
		if (!Router.instance) {
			this.routes = {};
			Router.instance = this;
			window.onpopstate = async () => await this.router();
        }
        return Router.instance;
	}

	async router()
	{
		this.routes = {
			'/': async () => await new LoginView().render(),
			'/login': async () => await new LoginView().render(),
			'/register': async () => await new SignupView().render(),
			'/homepage': async () => await new HomeView().render(),
		};
		const path = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash
		const page_render = this.routes[path];
		if (page_render)
			await page_render();
		else
			await new PageNotFoundView().render();

		return true;
	}

	async navigateTo(path)
	{
		this.routes = {
			'/': async () => await new LoginView().render(),
			'/login': async () => await new LoginView().render(),
			'/register': async () => await new SignupView().render(),
			'/homepage': async () => await new HomeView().render(),
		};
		if (this.routes[path])
		{
			history.pushState({}, '', path);
			await this.router();
		}
		else
			console.error(`Route "${path}" not defined.`);

		return true;
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
const ROUTER = new Router();
export default ROUTER;
