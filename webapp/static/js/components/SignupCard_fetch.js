// file : LoginCard_fetch.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import { fetch_utils as FETCH_UTILS } from '../core/helpers/fetch-utils.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1A] HELPER-FETCH-REGISTER
// -------------------------------------------------- //
// -------------------------------------------------- //
// [1B] MAIN-FETCH-REGISTER
// -------------------------------------------------- //
 /*=================================================================*/
/*
	  event.preventDefault();
	  const username = document.getElementById('username').value;
	  const email = document.getElementById('email').value;
	  const password = document.getElementById('password').value;
	  const password_confirm = document.getElementById('confirm').value;
	  try {
		const csrfToken = await COOKIE.getCookie('csrftoken');
		const response = await fetch('/api/user_auth/register/', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		  },
		  body: JSON.stringify({
			username: username,
			email: email,
			password1: password,
			password2: password_confirm
		  })
		});
		const data = await response.json();
		if (response.ok) {
		  console.log('Registration successful.');
		} else {
		  console.error('Registration failed (not 200).');
		}
	  } catch (error) {
		console.error('Registration failed.' + error.message);
	  }
	  */
/*=================================================================*/

class fetch_register
{
	constructor()
	{
		this.val_username = document.getElementById('username').value;
		this.val_email = document.getElementById('email').value;
		this.val_password = document.getElementById('password').value;
		this.val_password_confirm = document.getElementById('confirm').value;
		this.re_value = '';
		this.fetch_obj = null;
	}

	async fetchData()
	{
		try 
		{
			const mainFetch = new FETCH_UTILS();
			await mainFetch.getCookie('csrftoken');
			await mainFetch.setUrl('/api/user_auth/register/');
			await mainFetch.setMethod('POST');
			await mainFetch.appendHeaders('Content-Type', 'application/json');
			await mainFetch.appendHeaders('X-CSRFToken', mainFetch.csrfToken);
			await mainFetch.appendBody('username', this.val_username);
			await mainFetch.appendBody('email', this.val_email);
			await mainFetch.appendBody('password1', this.val_password);
			await mainFetch.appendBody('password2', this.val_password_confirm);
			await mainFetch.fetchData();
			this.fetch_obj = mainFetch;

			if (mainFetch.response.ok)
				this.re_value = 'register-successful';
			else
				this.re_value = 'register-failed';
		}
		catch (error)
		{
			console.error('[ERR] try-catch; registeration failed : ' + error.message);
			this.re_value = '[ERR] try-catch; registeration failed : ' + error.message;
		}

		return this.re_value;
	}
}

// -------------------------------------------------- //
// [-] EXPORTS
// -------------------------------------------------- //
export {
	fetch_register
};
