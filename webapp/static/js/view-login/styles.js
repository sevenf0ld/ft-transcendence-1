// file : styles.js (view-login)
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
async function page_title()
{
	const title = document.querySelector('title');
	title.innerHTML = '42Pong | Sign In';

	return true;
}

async function main_card()
{
	const card = document.querySelector(
		'.ct-login'
	);

	card.classList.add(
		'd-flex',
		'flex-column',
		'px-5',
		'py-4',
	);

	return true;
}

async function card_header()
{
	const card_header = document.querySelector(
		'.ct-login-header'
	);

	card_header.classList.add(
		'text-center',
	);

	return true;
}

async function form()
{
	// entire-form
	const form = document.querySelector(
		'.ct-login-form'
	);

	form.classList.add(
		'd-flex',
		'flex-column',
	);

	// form-group that contain 1 label and 1 input
	const formdiv = document.querySelectorAll(
		'.ct-login-form > .ct-form-group'
	);

	formdiv.forEach((group) => {
		group.classList.add(
			'd-flex',
			'flex-column',
		);
	});

	// formdiv's input
	const input = document.querySelectorAll(
		'.ct-form-group > input'
	);

	input.forEach((input) => {
		input.classList.add(
			'p-2',
			'form-control',
			'form-control-sm',
		);
	});

	// forget-password
	const forget_password = document.querySelector(
		'.ct-login-form > .ct-btn-forgot'
	);

	forget_password.classList.add(
		'text-end',
	);

	const forget_password_link = document.querySelector(
		'.ct-btn-forgot > a'
	);

	forget_password_link.classList.add(
		'small',
		'text-muted',
		'text-decoration-none',
	);

	// submit-button
	const submit_button = document.querySelector(
		'.ct-login-form > button'
	);

	submit_button.classList.add(
		'ct-btn-dark',
		'btn',
		'no-hover',
	);

	return true;
}

async function divider()
{
	// divider-container
	const container = document.querySelector(
		'.ct-login > div:nth-child(3)'
	);

	container.classList.add(
		'd-flex',
		'align-items-center',
	);

	// divider-line
	const divider = document.querySelectorAll(
		'.ct-login > div:nth-child(3) > hr'
	);

	divider.forEach((divider) => {
		divider.classList.add(
			'flex-grow-1',
		);
	});

	// divider-text
	const divider_text = document.querySelector(
		'.ct-login > div:nth-child(3) > span:nth-child(2)'
	);

	divider_text.classList.add(
		'px-2',
		'text-muted',
	);

	return true;
}

async function intra_btn()
{
	const intra_btn = document.querySelector(
		'#btn_intra'
	);

	intra_btn.classList.add(
		'btn',
		'btn-light',
		'd-flex',
		'justify-content-center',
		'align-items-center',
	);

	return true;
}

async function signup()
{
	const sign_up_div = document.querySelector(
		'.ct-login > div:last-child'
	);

	sign_up_div.classList.add(
		'small',
		'text-muted',
		'text-center',
	);

	return true;
}

async function build()
{
	await page_title();
	await main_card();
	await card_header();
	await form();
	await divider();
	await intra_btn();
	await signup();

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
};
