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
	});

	const links = document.querySelectorAll('a');
	links.forEach(link => {
		link.style.pointerEvents = 'none';
	});

	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.disabled = true;
	});
}

async function restore_all()
{
	const body = document.querySelector('body');
	body.style.cursor = 'default';

	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		button.disabled = false;
	});

	const links = document.querySelectorAll('a');
	links.forEach(link => {
		link.style.pointerEvents = 'auto';
	});

	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.disabled = false;
	});
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	disable_all,
	restore_all,
};
