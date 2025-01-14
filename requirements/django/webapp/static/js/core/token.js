// file : token.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import WEB_SOCKET from './websocket_mng.js';
import ROUTER from './router.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
class TokenCs
{
	constructor()
	{
		this.token_id = null;
	}

	async getCookie(name) {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '')
		{
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++)
			{
				const cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) === (name + '='))
				{
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	async refresh_token()
	{
		const csrf_token = await this.getCookie('csrftoken');
		const response = await fetch('/api/jwt_token/token/refresh/', {
			method: 'POST',
			headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrf_token
			},
		});

		const data = await response.json();
		if (response.status === 401)
		{
			console.error('Token expired.');
			await this.token_expired_handler();
			return false;
		}
		else if (response.status !== 200)
		{
			console.error('refresh token crashed.');
			return false;
		}

		return true;
	}

	async start_refresh_token()
	{
		const second = 3;
		const ms = second * 1000;

		this.token_id = setInterval(async () => {
			await this.refresh_token();
		}, ms);

		return true;
	}

	async stop_refresh_token()
	{
		localStorage.setItem('logout-event', 'logout' + Math.random());
		localStorage.clear();
		clearInterval(this.token_id);
		this.token_id = null;
		// clear the cookies as well (todo)

		return true;
	}

	async token_expired_handler()
	{
		alert('Token expired. Please login again.');

		await this.stop_refresh_token();
		await ROUTER.navigate_to('/login');

		// // Clear all cookies
		document.cookie.split(";").forEach(cookie => {
			document.cookie = cookie.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
		});

		// Clear local storage
		localStorage.setItem('logout-event', 'logout' + Math.random());
		localStorage.clear();

		// close all websockets
		await WEB_SOCKET.close_all_websockets();
		await window.location.reload();

		return true;
	}
}

const TOKEN = new TokenCs();
export default TOKEN;
