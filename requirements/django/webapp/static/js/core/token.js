//import fetch_logout from '../../components/HomeView/LeftUser_fetch.js';
//import LoginView from '../views/LoginView.js';

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
			clearInterval(this.token_id);
			this.token_id = null;

			// automatically logs the user out without calling logout api or rendering loginView
			// issue: does not close websocket properly
			localStorage.clear();
			location.href = '/';

			return false;
		}
		else if (response.status !== 200)
		{
			console.error('refresh token crashed.');
			return false;
		}

		return true;
	}
}

const TOKEN = new TokenCs();
export default TOKEN;
