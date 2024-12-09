// file : form-vali.js
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
async function register_confirm_password()
{
	const input1 = document.querySelector(
		'#signup_form #password'
	);
	const input2 = document.querySelector(
		'#signup_form #password_confirm'
	);
	const msg = document.querySelector(
		'#signup_form #err_signup_4'
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
		'#signup_form #password'
	);
	const msg = document.querySelector(
		'#signup_form #err_signup_3'
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

async function run_register()
{
	if (await register_password() === false)
		return false;
	if (await register_confirm_password() === false)
		return false;
	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	run_register
};
