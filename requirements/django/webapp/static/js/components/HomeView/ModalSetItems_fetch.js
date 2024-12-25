import { fetch_utils as FETCH_UTILS } from '../../core/helpers/fetch-utils.js';

export default class fetch_pfp
{
	constructor()
	{
		this.form_data = null;
		this.re_value = '';
		this.fetch_obj = null;
	}

	async fetchData()
	{
		const mainFetch = new FETCH_UTILS();
		await mainFetch.getCookie('csrftoken');
		await mainFetch.setUrl('/api/user_profiles/upload-pfp/');
		await mainFetch.setMethod('POST');
		await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
		await mainFetch.appendHeaders('Content-Type', 'multipart/form-data');
		await mainFetch.appendBody('form_data', this.form_data);
		try
		{
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'image-upload-successful';
			else
				this.re_value = 'image-upload-failed';
		}
		catch (error)
		{
			this.re_value = '[ERR] try-catch; image upload failed : ' + error.message;
		}

		return this.re_value;
	}
}
