// file : media.js
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
// main-functions
// -------------------------------------------------- //
async function style_media()
{
	const media = document.querySelector('#media');
	media.classList.add(
		'd-none',
		'd-xxl-flex',
		'd-flex',
		'flex-column',
		'align-items-center',
		'justify-content-center',
		'h-100',
		'w-100'
	);

	const small_media = document.querySelector('#small-media');
	small_media.classList.add(
		'd-xxl-none',
		'd-flex',
		'flex-column',
		'align-items-center',
		'justify-content-center',
		'h-100',
		'w-100'
	);

	return true;
}

async function style_image()
{
	const img = document.querySelector('#small-media img');
	img.classList.add(
		'img-fluid',
		'mb-3',
		'w-50'
	);
	img.style.maxWidth = '25rem';

	return true;
}

async function build()
{
	const template = `
	<div id="media"></div>
	<div id="small-media">
		<img src="/static/assets/images/media.svg" alt="media"/>
		<p>Ooops! media too small</p>
	</div>
	`;

	const body = document.querySelector('body');
	body.innerHTML = '';
	body.innerHTML = template;
	await style_media();
	await style_image();

	return true;
}

async function get()
{
	const media = document.querySelector('#media');
	const small_media = document.querySelector('#small-media');
	const img = document.querySelector('#small-media img');

	const re_obj = {
		media,
		small_media,
		img
	};

	return re_obj;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
	get
};
