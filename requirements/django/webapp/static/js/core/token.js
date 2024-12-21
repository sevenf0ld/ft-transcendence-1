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

	// supports body and cookie-based
	async refresh_token()
	{
		const csrf_token = await getCookie('csrftoken');
		//const refresh_token = await getCookie('jwt-refresh');
		const response = await fetch('/api/jwt_token/token/refresh/', {
			method: 'POST',
			headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrf_token
			},
			//body: JSON.stringify({
			//	refresh: refresh_token
			//})
		});

		const data = await response.json();
		if (response.ok)
			//access_token = data.access;
			console.log('refresh token successful.');
		else if (response.status === 401)
		{
			console.error('refresh token invalid.');
			return false;
		}
		else
		{
			console.error('refresh token crashed.');
			return false;
		}

		return true;
	}

	async verify_token()
	{
		const csrf_token = await getCookie('csrftoken');
		const access_token = await getCookie('jwt-access');
		const response = await fetch('/api/jwt_token/token/verify/', {
			method: 'POST',
			headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrf_token
			},
			body: JSON.stringify({
				token: access_token
			})
		});

		const data = await response.json();
		if (response.status === 401)
		{
			const refresh_data = await refresh_token();
			if (refresh_data === false)
				console.error('refresh failed after verify.');
		}
	}
}

const TOKEN = new TokenCs();
export default TOKEN;
