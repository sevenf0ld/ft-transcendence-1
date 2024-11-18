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
async function title()
{
	const title = document.querySelector('title');
	title.innerHTML = '42Pong | Sign In';

	return true;
}

async function main_card()
{
	const card = document.querySelector('#media > div:nth-child(1)');

	card.classList.add(
		'custom-login-card',
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
		'.custom-login-card > p:nth-child(1)'
	);

	card_header.classList.add(
		'custom-login-card__header',
		'text-center',
	);

	return true;
}

async function form()
{
	// entire-form
	const form = document.querySelector(
		'.custom-login-card > form:nth-child(2)'
	);

	form.classList.add(
		'custom-login-card__form',
		'd-flex',
		'flex-column',
	);

	// input-div(s) that contain 1 label and 1 input
	// selector : select first two children of form
	const formdiv = document.querySelectorAll(
		'.custom-login-card__form > div:nth-child(-n+2)'
	);

	formdiv.forEach((group) => {
		group.classList.add(
			'custom-login-card__formdiv',
			'd-flex',
			'flex-column',
		);
	});

	// formdiv's input
	const input = document.querySelectorAll(
		'.custom-login-card__formdiv > input'
	);

	input.forEach((input) => {
		input.classList.add(
			'p-2',
			'form-control',
			'form-control-sm',
		);
	});

	// forget-password
	// selector : select third child of form
	const forget_password = document.querySelector(
		'.custom-login-card__form > div:nth-child(3)'
	);

	forget_password.classList.add(
		'custom-login-card__formforgot',
		'text-end',
	);

	const forget_password_link = document.querySelector(
		'.custom-login-card__formforgot > a'
	);

	forget_password_link.classList.add(
		'small',
		'text-muted',
		'text-decoration-none',
	);

	// submit-button
	const submit_button = document.querySelector(
		'.custom-login-card__form > button'
	);

	submit_button.classList.add(
		'custom-btn-dark',
		'btn',
		'no-hover',
	);

	return true;
}

async function divider()
{
	// divider-container
	const container = document.querySelector(
		'.custom-login-card > div:nth-child(3)'
	);

	container.classList.add(
		'd-flex',
		'align-items-center',
	);

	// divider-line
	const divider = document.querySelectorAll(
		'.custom-login-card > div:nth-child(3) > hr'
	);

	divider.forEach((divider) => {
		divider.classList.add(
			'flex-grow-1',
		);
	});

	// divider-text
	const divider_text = document.querySelector(
		'.custom-login-card > div:nth-child(3) > span:nth-child(2)'
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
		'.custom-login-card > div:last-child'
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
	await title();
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
