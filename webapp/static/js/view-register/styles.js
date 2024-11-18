// file : styles.js (view-register)
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
	title.innerHTML = '42Pong | Sign Up';

	return true;
}

async function main_card()
{
	const card = document.querySelector('#media > div:nth-child(1)');

	card.classList.add(
		'custom-register-card',
		'd-flex',
		'flex-column',
		'px-5',
		'py-4',
	);

	return true;
}

async function card_header()
{
	const title = document.querySelector(
		'.custom-register-card > p:nth-child(1)'
	);

	title.classList.add(
		'custom-register-card__header',
		'text-center',
	);

	return true;
}

async function form()
{
	// form
	const form = document.querySelector(
		'.custom-register-card > form:nth-child(2)'
	);

	form.classList.add(
		'custom-register-card__form',
		'd-flex',
		'flex-column',
	);

	// form div
	const formdiv = document.querySelectorAll(
		'.custom-register-card__form > div:nth-child(-n+4)'
	);

	formdiv.forEach((group) => {
		group.classList.add(
			'custom-register-card__formdiv',
			'd-flex',
			'flex-column',
		);
	});

	// input of form
	const input = document.querySelectorAll(
		'.custom-register-card__formdiv > input'
	);

	input.forEach((input) => {
		input.classList.add(
			'p-2',
			'form-control',
			'form-control-sm',
		);
	});

	// submit button
	const submit_button = document.querySelector(
		'.custom-register-card__form > button'
	);
	
	submit_button.classList.add(
		'custom-btn-dark',
		'btn',
		'no-hover',
		'mt-4',
	);

	return true;
}

async function back_btn()
{
	const back_btn = document.getElementById('btn_back_to_login');

	back_btn.classList.add(
		'small',
		'text-center',
		'text-muted',
	);

	return true;
}

async function build()
{
	await title();
	await main_card();
	await card_header();
	await form();
	await back_btn();

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
};
