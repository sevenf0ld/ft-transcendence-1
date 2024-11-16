// file : login-page_event.js

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
import * as MEDIA from '../modules/media.js';
import * as HOMEPAGE from '../page-home/home_core.js';

// -------------------------------------------------- //
// login/form/
// -------------------------------------------------- //
async function form_forgot(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('forgot-password-link clicked');
	});

	return true;
}

async function form_submitBtn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('submit-btn clicked');
		event.preventDefault();
		await MEDIA.clear();
		await HOMEPAGE.build();
	});

	return true;
}

// -------------------------------------------------- //
// login/intra-btn
// -------------------------------------------------- //
async function intra_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('intra-btn clicked');
	});

	return true;
}

// -------------------------------------------------- //
// login/sign-up
// -------------------------------------------------- //
async function sign_up_line(signUpLine)
{
	signUpLine.addEventListener('click', async (event) => {
		console.log('signup-btn clicked');
	});

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	form_forgot,
	form_submitBtn,
	intra_btn,
	sign_up_line,
};
