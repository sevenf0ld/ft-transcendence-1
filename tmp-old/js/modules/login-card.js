// file : players-list.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
// NOTE : THIS PAGE IS ON HOLD (OCT-16)
// because team-leader taken over & he will do HTML way
// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
// -------------------------------------------------- //
// modules
// -------------------------------------------------- //
async function clear()
{
	return true;
}

async function signup()
{
	return true;
}

async function login()
{
	const login_card = document.createElement('div');

	const title = document.createElement('p');

	const form = document.createElement('form');
	const email_group = document.createElement('div');
	const email_label = document.createElement('label');
	const email_input = document.createElement('input');
	const password_group = document.createElement('div');
	const password_label = document.createElement('label');
	const password_input = document.createElement('label');
	const forgot_div = document.createElement('div');
	const forgot_link = document.createElement('a');
	const submit_btn = document.createElement('button');

	const divider = document.createElement('div');
	const divider_hr1 = document.createElement('hr');
	const divider_span = document.createElement('span');
	const divider_hr2 = document.createElement('hr');
	
	const intra_btn = document.createElement('button');
	const intra_btn_logo = document.createElement('span');
	const intra_btn_text = document.createElement('p');

	const signup_line = document.createElement('div');
	const signup_p = document.createElement('p');
	const signup_span = document.createElement('span');
	const signup_link = document.createElement('a');

	const re_obj =
	{
		title : title,
		form : form,
		email_group : email_group,
		email_label : email_label,
		email_input : email_input,
		password_group : password_group,
		password_label : password_label,
		password_input : password_input,
		forgot_div : forgot_div,
		forgot_link : forgot_link,
		submit_btn : submit_btn,
		divider : divider,
		divider_hr1 : divider_hr1,
		divider_span : divider_span,
		divider_hr2 : divider_hr2,
		intra_btn : intra_btn,
		intra_btn_logo : intra_btn_logo,
		intra_btn_text : intra_btn_text,
		signup_line : signup_line,
		signup_p : signup_p,
		signup_span : signup_span,
		signup_link : signup_link
	};
	return re_obj;
}
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	clear,
	signup,
	login,
};
