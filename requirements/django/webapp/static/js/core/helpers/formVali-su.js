// file : formVali-su.js
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
// local-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class form_input
{
	constructor()
	{
		this.input_arr = {
			'username': '',
			'email': '',
			'password': '',
			'confirm': '',
		};

		this.msg_arr = {
			'err_signup_1': '',
			'err_signup_2': '',
			'err_signup_3': '',
			'err_signup_4': '',
		};

		this.pair = {
			'username': 'err_signup_1',
			'email': 'err_signup_2',
			'password': 'err_signup_3',
			'confirm': 'err_signup_4',
		};

		this.validate = 0;
		this.total_validate = 0;

		this.read_inputs();
	}

	async read_inputs()
	{
		for (const key in this.input_arr)
		{
			const ele = document.getElementById(`${key}`);
			if (!ele)
				throw new Error(`[ERR] input not found : ${key}`);
			this.input_arr[key] = ele;
		}

		for (const key in this.msg_arr)
		{
			const ele = document.getElementById(`${key}`);
			if (!ele)
				throw new Error(`[ERR] message not found : ${key}`);
			this.msg_arr[key] = ele;
		}

		return true;
	}

	async cant_be_empty()
	{
		this.total_validate += 1;
		const form = this;
		let re_value = true;

		for (const key in form.input_arr)
		{
			if (form.input_arr[key].value === '')
			{
				form.msg_arr[form.pair[key]].innerHTML = 'cannot be empty';
				form.msg_arr[form.pair[key]].style.display = 'block';
				re_value = false;
			}
			else
			{
				form.msg_arr[form.pair[key]].innerHTML = '';
				form.msg_arr[form.pair[key]].style.display = 'none';
			}
		}

		if (re_value === true)
			this.validate += 1;
		return re_value;
	}

	async valid_email()
	{
		this.total_validate += 1;
		const form = new form_input();

		const email = form.input_arr['email'].value;
		const msg = form.msg_arr['err_signup_2'];

		// not containing '@' in the string
		if (!email.includes('@'))
		{
			msg.innerHTML = 'invalid email';
			msg.style.display = 'block';
			return false;
		}

		// not containing '.' in the string
		if (!email.includes('.'))
		{
			msg.innerHTML = 'invalid email';
			msg.style.display = 'block';
			return false;
		}

		// contain more than one '@' in the string
		if (email.split('@').length > 2)
		{
			msg.innerHTML = 'invalid email';
			msg.style.display = 'block';
			return false;
		}

		// contain something other than one '@, dot and alphanumeric' in the string
		if (!/^[a-z0-9.@]+$/i.test(email))
		{
			msg.innerHTML = 'invalid email';
			msg.style.display = 'block';
			return false;
		}

		this.validate += 1;
		return true;
	}

	async register_confirm_password()
	{
		this.total_validate += 1;
		const input1 = document.querySelector(
			'.ct-su-form #password'
		);
		const input2 = document.querySelector(
			'.ct-su-form #confirm'
		);
		const msg = document.querySelector(
			'.ct-su-form #err_signup_4'
		);
		if (input1.value !== input2.value)
		{
			msg.innerHTML = 'passwords do not match';
			msg.style.display = 'block';
			return false;
		}

		this.validate += 1;
		return true;
	}

	async register_password()
	{
		this.total_validate += 1;
		const input1 = document.querySelector(
			'.ct-su-form #password'
		);
		const msg = document.querySelector(
			'.ct-su-form #err_signup_3'
		);

		// password is out of range
		if (input1.value.length < 8 || input1.value.length > 16)
		{
			msg.innerHTML = 'between 8 and 16 chars';
			msg.style.display = 'block';
			return false;
		}

		// password does not contain a number
		if (!/\d/.test(input1.value))
		{
			msg.innerHTML = 'must contain a number';
			msg.style.display = 'block';
			return false;
		}

		// password does not contain a small letter
		if (!/[a-z]/.test(input1.value))
		{
			msg.innerHTML = 'must contain a lowercase letter';
			msg.style.display = 'block';
			return false;
		}

		/*
		// password does not contain a capital letter
		if (!/[A-Z]/.test(input1.value))
		{
			msg.innerHTML = 'must contain a capital letter';
			msg.style.display = 'block';
			return false;
		}
		*/

		// reset the error message if ok
		msg.innerHTML = '';
		msg.style.display = 'none';

		this.validate += 1;
		return true;
	}

	async login_chars()
	{
		this.total_validate += 1;
		const input1 = document.querySelector(
			'.ct-su-form #username'
		);
		const msg = document.querySelector(
			'.ct-su-form #err_signup_1'
		);

		// username is out of range (3-10)
		if (input1.value.length < 3 || input1.value.length > 10)
		{
			msg.innerHTML = 'between 3 and 10 chars';
			msg.style.display = 'block';
			return false;
		}

		// username is not alphanumeric
		if (!/^[a-z0-9]+$/i.test(input1.value))
		{
			msg.innerHTML = 'only alphanumeric';
			msg.style.display = 'block';
			return false;
		}

		// must contain at least one letter
		// a-z or A-Z
		if (!/[a-z]/.test(input1.value) && !/[A-Z]/.test(input1.value))
		{
			msg.innerHTML = 'must contain a letter';
			msg.style.display = 'block';
			return false;
		}

		// reset the error message if ok
		msg.innerHTML = '';
		msg.style.display = 'none';

		this.validate += 1;
		return true;
	}

	async run()
	{
		let re_value = true;

		await this.cant_be_empty();
		await this.valid_email();
		await this.register_confirm_password();
		await this.register_password();
		await this.login_chars()

		if (this.validate !== this.total_validate)
			re_value = false;

		return re_value;
	}
}

class modalSetItemsClass
{
	constructor()
	{
		this.cur_pass = null;
		this.new_pass = null;
		this.conf_pass = null;
	}

	async init()
	{
		this.cur_pass = document.getElementById(
			'input_acc_cur_pass'
		).value;
		this.new_pass = document.getElementById(
			'input_acc_new_pass'
		).value;
		this.conf_pass = document.getElementById(
			'input_acc_conf_pass'
		).value;
	}

	async validate()
	{
		await this.init();
		const cur_pass = this.cur_pass;
		const new_pass = this.new_pass;
		const conf_pass = this.conf_pass;

		const user = JSON.parse(localStorage.getItem('user'));
		const username = user.username;
		const email = user.email;

		if (cur_pass.length < 1)
		{
			alert('Error! Current password is required to change any account settings.');
			return false;
		}
		else if (new_pass.length < 1 || conf_pass.length < 1)
		{
			alert('Error! New password and confirm password are required to change any account settings.');
			return false;
		}
		else if (cur_pass.length < 8)
		{
			alert('Error! Current password is invalid.');
			return false;
		}
		else if (cur_pass.length > 16)
		{
			alert('Error! Current password is invalid.');
			return false;
		}

		if (new_pass.length > 0)
		{
			if (new_pass.length < 8)
			{
				alert('Error! New password must be at least 8 characters.');
				return false;
			}
			else if (new_pass.length > 16)
			{
				alert('Error! New password must be at most 16 characters.');
				return false;
			}
			else if (new_pass === cur_pass)
			{
				alert('Error! New password is the same as the current password.');
				return false;
			}
			else if (new_pass !== conf_pass)
			{
				alert('Error! New password and confirm password do not match.');
				return false;
			}
			else if (!/\d/.test(new_pass))
			{
				alert('Error! New password must contain a number.');
				return false;
			}
			else if (!/[a-z]/.test(new_pass))
			{
				alert('Error! New password must contain a lowercase letter.');
				return false;
			}
		}

		console.log('Account setting form validation passed.');

		return true;
	}

}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
async function validate()
{
	let form = new form_input();
	const re_value = await form.run();

	form = null;

	return re_value;
}

const modalSetItems = new modalSetItemsClass();

export
{ 
	validate,
	modalSetItems,
};
