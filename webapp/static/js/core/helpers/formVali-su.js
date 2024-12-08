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
}

async function cant_be_empty()
{
	const form = new form_input();
	let re_value = true;

	for (const key in form.input_arr)
	{
		if (form.input_arr[key].value === '')
		{
			form.msg_arr[form.pair[key]].innerHTML = '* cannot be empty';
			re_value = false;
		}
		else
			form.msg_arr[form.pair[key]].innerHTML = '';
	}

	return re_value;
}

async function valid_email()
{
	const form = new form_input();
	let re_value = true;

	const email = form.input_arr['email'].value;
	const msg = form.msg_arr['err_signup_2'];

	// not containing '@' in the string
	if (!email.includes('@'))
	{
		msg.innerHTML = '* invalid email';
		return false;
	}
}

async function register_confirm_password()
{
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
		msg.innerHTML = '* Passwords do not match';
		return false;
	}
    return true;
}

async function register_password()
{
	const input1 = document.querySelector(
		'.ct-su-form #password'
	);
	const msg = document.querySelector(
		'.ct-su-form #err_signup_3'
	);

	// password is out of range
	if (input1.value.length < 8 || input1.value.length > 16)
	{
		msg.innerHTML = '* between 8 and 16 chars';
		return false;
	}

	// password does not contain a number
	if (!/\d/.test(input1.value))
	{
		msg.innerHTML = '* must contain a number';
		return false;
	}

	// password does not contain a letter (case-insensitive)
	if (!/[a-z]/.test(input1.value))
	{
		msg.innerHTML = '* must contain a letter';
		return false;
	}

	// reset the error message if ok
	msg.innerHTML = '';

    return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
async function validate()
{
	let re_value = true;

	re_value = await cant_be_empty();
	re_value = await valid_email();
	re_value = await register_confirm_password();
	re_value = await register_password();

	return re_value;
}

export
{ 
	validate,
};
