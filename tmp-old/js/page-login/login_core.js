// file : login-page_core.js

// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
/* card structure
 * 
 * login-card
 *  ├ title
 *  ├ form-group
 *  │         ├ input-group
 *  │         │  ├ label
 *  │         │  └ input
 *  │         ├ input-group
 *  │         │  ├ label
 *  │         │  └ input
 *  │         ├ forgot-link
 *  │         └ submit-btn
 *  ├ divider
 *  │   └ hr + p + hr
 *  ├ intra-btn
 *  │   ├ intra-btn-logo
 *  │   └ intra-btn-text
 *  └ signup-line
 *      └ span + a 
*/

// -------------------------------------------------- // 
// Importing
// -------------------------------------------------- // 
import * as STYLE from './login_style.js';
import * as EVENT from './login_event.js';

// -------------------------------------------------- // 
// /login/form/
// -------------------------------------------------- // 
async function build_email_group()
{
	const divEmailGroup = document.createElement('div');
	await STYLE.form_email(divEmailGroup);

	return divEmailGroup;
}

async function build_password_group()
{
	const divPasswordGroup = document.createElement('div');
	await STYLE.form_password(divPasswordGroup);

	return divPasswordGroup;
}

async function build_forgot_password()
{
	const divForgotPassword = document.createElement('div');
	const forgot_link = await STYLE.form_forgot(divForgotPassword);
	await EVENT.form_forgot(forgot_link);

	return divForgotPassword;
}

async function build_submit_button()
{
	const submitButton = document.createElement('button');
	await STYLE.form_submitBtn(submitButton);
	await EVENT.form_submitBtn(submitButton);

	return submitButton;
}

// -------------------------------------------------- // 
// /login/
// -------------------------------------------------- // 
async function build_title()
{
	const div_card_title = document.createElement('p');
	await STYLE.title(div_card_title);

	return div_card_title;
}

async function build_form()
{
	const form = document.createElement('form');
	await STYLE.form(form);

	const divEmailGroup = await build_email_group();
	const divPasswordGroup = await build_password_group();
	const divForgotPassword = await build_forgot_password();
	const submitButton = await build_submit_button();

	form.appendChild(divEmailGroup);
	form.appendChild(divPasswordGroup);
	form.appendChild(divForgotPassword);
	form.appendChild(submitButton);

	return form;
}

async function build_divider()
{
	const divider = document.createElement('div');
	await STYLE.divider(divider);

	return divider;
}

async function build_intra_btn()
{
	const buttonIntra = document.createElement('button');
	await STYLE.intra_btn(buttonIntra);
	await EVENT.intra_btn(buttonIntra);

	return buttonIntra;
}

// NOTE : a_link captures the a tag for back-end
async function build_signup_line()
{
	const divSignUp = document.createElement('div');
	const a_link = await STYLE.sign_up_line(divSignUp);
	await EVENT.sign_up_line(a_link);

	return divSignUp;
}

// -------------------------------------------------- // 
// MAIN-FUNCTION
// -------------------------------------------------- // 
// important-note : this is the structure of form
	// form/
	//  ├─ email-group
	//  │      ├─── email-label
	//  │      └─── email-input
	//  ├─ password-group
	//  │      ├─── password-label
	//  │      └─── password-input
	//  ├─ forgot-password
	//  └─ submit-button
async function build_login_card()
{
	const div_login_card = document.createElement('div');
	await STYLE.login_card(div_login_card);

	const title = await build_title();
	const form = await build_form();
	const divider = await build_divider();
	const intra_btn = await build_intra_btn();
	const signup_line = await build_signup_line();

	div_login_card.appendChild(title);
	div_login_card.appendChild(form);
	div_login_card.appendChild(divider);
	div_login_card.appendChild(intra_btn);
	div_login_card.appendChild(signup_line);

	return div_login_card;
}

// important-note : this is the structure of the card
	// login-card
	//  ├─ title
	//  ├─ form
	//  ├─ divider
	//  ├─ intra-btn
	//  └─ sign-up-line
async function build()
{
	const DOM_MEDIA = document.getElementById('media');
	const login_card = await build_login_card();

	DOM_MEDIA.appendChild(login_card);

	return true;
}

export { build };
