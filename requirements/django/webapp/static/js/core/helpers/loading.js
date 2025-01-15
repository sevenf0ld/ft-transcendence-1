// file : loading.js
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
// Special-events
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// --- [LOCAL] EXPORTED COMPONENT
// usage : insert querySelector's value of an element
// 		   to register as export element; first one
// 		   is always default
async function disable_all()
{
	const body = document.querySelector('body');
	body.style.cursor = 'wait';

	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		button.disabled = true;
		button.style.cursor = 'wait';
	});

	const links = document.querySelectorAll('a');
	links.forEach(link => {
		link.style.pointerEvents = 'none';
		link.style.cursor = 'wait';
	});

	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.disabled = true;
		input.style.cursor = 'wait';
	});

	const modals = document.querySelectorAll('.modal');
	modals.forEach(modal => {
		modal.style.cursor = 'wait';
		modal.style.pointerEvents = 'none';
	});
}

async function restore_all()
{
	const body = document.querySelector('body');
	body.style.cursor = 'default';

	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		button.disabled = false;
		button.style.cursor = 'pointer';
	});

	const links = document.querySelectorAll('a');
	links.forEach(link => {
		link.style.pointerEvents = 'auto';
		link.style.cursor = 'pointer';
	});

	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.disabled = false;
		input.style.cursor = 'text';
	});

	const modals = document.querySelectorAll('.modal');
	modals.forEach(modal => {
		modal.style.cursor = 'pointer';
		modal.style.pointerEvents = 'auto';
	});
}

async function loading_page(type)
{
	if (type === 'show')
	{
		const body = document.querySelector('body');
		const page = `
		<div id="load_page"><p>Loading...</p></div>
		`;
		body.insertAdjacentHTML('beforeend', page);
	}
	if (type === 'hide')
	{
		const page = document.getElementById('load_page');
		page.remove();
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	disable_all,
	restore_all,
	loading_page
};
