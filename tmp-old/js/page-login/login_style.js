// file : style-front-page.js

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
// container
// -------------------------------------------------- //
async function login_card( obj )
{
	obj.classList.add('login');
	obj.classList.add('d-flex');
	obj.classList.add('flex-column');
	obj.classList.add('px-5');
	obj.classList.add('py-4');

	return true;
}

// -------------------------------------------------- //
// container/title
// -------------------------------------------------- //
async function title( obj )
{
	obj.classList.add('login__title');
	obj.textContent = '42PONG - SIGN IN';

	return true;
}

// -------------------------------------------------- //
// container/form-group
// -------------------------------------------------- //
async function form( obj )
{
	obj.classList.add('login__form-group');
	obj.classList.add('d-flex');
	obj.classList.add('flex-column');

	return true;
}

async function form_email( obj )
{
	obj.classList.add('login__input-group');

	const label = document.createElement('label');
	label.textContent = 'Email';
	label.setAttribute('for', 'login__input-email');

	const input = document.createElement('input');
	input.classList.add('form-control');
	input.classList.add('form-control-sm');
	input.classList.add('p-2');
	input.type = 'email';
	input.id = 'login__input-email';
	input.setAttribute('placeholder', 'Enter your email');

	obj.appendChild(label);
	obj.appendChild(input);

	return true;
}

async function form_password( obj )
{
	obj.classList.add('login__input-group');

	const label = document.createElement('label');
	label.textContent = 'Password';
	label.setAttribute('for', 'login__input-password');

	const input = document.createElement('input');
	input.classList.add('form-control');
	input.classList.add('form-control-sm');
	input.classList.add('p-2');
	input.type = 'password';
	input.id = 'login__input-password';
	input.setAttribute('placeholder', 'Enter your password');

	obj.appendChild(label);
	obj.appendChild(input);

	return true;
}

async function form_forgot( obj )
{
	obj.classList.add('login__forgot-password');
	obj.classList.add('text-end');

	const a_link = document.createElement('a');
	a_link.classList.add('small');
	a_link.classList.add('text-muted');
	a_link.classList.add('text-decoration-none');
	a_link.classList.add('small');
	a_link.textContent = 'Forgot Password?';
	a_link.href = '#';

	obj.appendChild(a_link);

	return (a_link);
}

async function form_submitBtn( obj )
{
	obj.classList.add('login__submit-btn');
	obj.classList.add('btn');
	obj.classList.add('d-flex');
	obj.classList.add('align-items-center');
	obj.classList.add('justify-content-center');
	obj.textContent = 'Sign In';
	obj.type = 'submit';

	return true;
}

// -------------------------------------------------- //
// container/divider
// -------------------------------------------------- //

async function divider( obj )
{
	obj.classList.add('login__divider');
	obj.classList.add('d-flex', 'align-items-center');

	const hr1 = document.createElement('hr');
	hr1.classList.add('flex-grow-1');

	const span_or = document.createElement('span');
	span_or.classList.add('px-2', 'text-muted');
	span_or.textContent = 'or continue';

	const hr2 = document.createElement('hr');
	hr2.classList.add('flex-grow-1');

	obj.appendChild(hr1);
	obj.appendChild(span_or);
	obj.appendChild(hr2);

	return true;
}

// -------------------------------------------------- //
// container/intra-btn
// -------------------------------------------------- //

async function intra_btn( obj )
{
	obj.classList.add('login__intra-btn');
	obj.classList.add('btn');
	obj.classList.add('btn-light');
	obj.classList.add('d-flex');
	obj.classList.add('justify-content-center');
	obj.classList.add('align-items-center');

	const spanIntra = document.createElement('span');
	spanIntra.classList.add('front-page-btn-intra-logo');
	spanIntra.textContent = '[42]';

	const pIntra = document.createElement('p');
	pIntra.textContent = 'Login with Intra';

	obj.appendChild(spanIntra);
	obj.appendChild(pIntra);

	return true;
}

// -------------------------------------------------- //
// container/sign-up-line
// -------------------------------------------------- //

async function sign_up_line( obj )
{
	obj.classList.add('login__signup-line');
	obj.classList.add('text-center');

	const p_SignUp = document.createElement('p');
	p_SignUp.classList.add('small');
	p_SignUp.classList.add('text-muted');

	const span_SignUp = document.createElement('span');
	span_SignUp.textContent = 'Don\'t have an account? ';

	const a_link = document.createElement('a');
	a_link.classList.add('text-decoration-none');
	a_link.textContent = 'Sign Up';
	a_link.href = '#';

	p_SignUp.appendChild(span_SignUp);
	p_SignUp.appendChild(a_link);

	obj.appendChild(p_SignUp);

	return (a_link);
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	login_card,
	title,
	form,
	form_email,
	form_password,
	form_forgot,
	form_submitBtn,
	divider,
	intra_btn,
	sign_up_line,
};
