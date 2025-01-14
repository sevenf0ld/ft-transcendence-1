// file : fetch-utils.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
import TOKEN from '../token.js';
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
class fetch_utils
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.csrfToken = '';
		this.url = '';
		this.object = 
		{
			'method': '',
			'headers': {},
			'body': JSON.stringify({}),
		};
		this.response = {};
		this.rdata = {};
		this.robject = {};
	}

	async init()
	{
		this.csrfToken = '';
		this.url = '';
		this.object = 
		{
			'method': '',
			'headers': {},
			'body': JSON.stringify({}),
		};
		this.response = {};
		this.rdata = {};
		this.robject = {};
	}

	// --- [00] SETTERS
	async setUrl(url)
	{
		this.url = url;
		
		return true;
	}

	async setMethod(method)
	{
		this.object['method'] = method;
		
		return true;
	}
	
	async appendHeaders(key, value)
	{
		this.object['headers'][key] = value;
		
		return true;
	}

	async appendBody(key, value)
	{
		this.object['body'] = JSON.parse(this.object['body']);
		this.object['body'][key] = value;
		this.object['body'] = JSON.stringify(this.object['body']);

		return true;
	}

	// --- [--] read csrfToken
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
					cookieValue = decodeURIComponent(
						cookie.substring(name.length + 1)
					);
					break;
				}
			}
		}

		this.csrfToken = cookieValue;
		return true;
	}

	// --- [--] CHECKER
	async read_check()
	{
		if (this.csrfToken === '')
			throw new Error('[ERR] CSRFToken is not set.');
		if (this.url === '')
			throw new Error('[ERR] URL is not set.');
		if (this.object['method'] === '')
			throw new Error('[ERR] Method is not set.');
		if (this.object['headers']['Content-Type'] === '')
			throw new Error('ERR] Content-Type is not set.');
		if (this.object['headers']['X-CSRFToken'] === '')
			throw new Error('[ERR] CSRFToken is not set.');
		if (this.object['body'] === '{}' && this.object['method'] !== 'GET')
			if (this.object['method'] !== 'DELETE')
				throw new Error('[ERR] Body is not set.');

		if (this.object['body'] === JSON.stringify({}))
			delete this.object['body'];
		
		return true;
	}

	// --- [--] FINAL-FETCH
	// SAFE_API_FETCH UPDATE (2025/JAN)
	// liaw : new version of fetchData() - 2025/JAN
	// This function wraps the fetch API to make it safer and handle token-related errors. 
	// If a request fails with a 401 (Unauthorized), it tries to refresh the access token using the refresh token. 
	// If refreshing succeeds, it retries the original request. 
	// If refreshing fails (e.g., the refresh token is expired), it logs the user out gracefully. 
	// This ensures a smoother user experience and avoids unhandled errors.
	async fetchData()
	{
		await this.read_check();
		try {
			const response = await fetch(this.url, this.object);
			this.robject = response;
			if (response.status === 401)
			{
				await TOKEN.token_expired_handler();
				return false;
			}
			if (response.status !== 204)
			{
				this.response = response;
				const data = await response.json();

				this.rdata = data;
			}
			else
			{
				this.response = null;
				this.rdata = null;
			}
		}
		catch (error)
		{
			console.error('[ERR] fetch-utils.js - ', error);
			throw error;
		}
		return true;
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
const item = new fetch_utils();
export default item;
