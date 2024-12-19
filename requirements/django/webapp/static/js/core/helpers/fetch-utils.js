// file : fetch-utils.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
export default class fetch_utils
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

	// --- [00] DEEP-COPY
	async copy_object(obj)
	{
		this.csrfToken = obj.csrfToken;
		this.url = obj.url;
		this.object['method'] = obj.object['method'];
		this.object['headers'] = JSON.parse(JSON.stringify(obj.object['headers']));

		return true;
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
			throw new Error('[ERR] Body is not set.');

		if (this.object['body'] === JSON.stringify({}))
			delete this.object['body'];
		
		return true;
	}

	// --- [--] FINAL-FETCH
	async fetchData()
	{
		await this.read_check();
		const response = await fetch(this.url, this.object);
		this.robject = response;
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

		return true;
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	fetch_utils,
};
