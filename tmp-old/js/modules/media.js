// file : utils_core.js

// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
/* media structure
 * 
 * body
 * ├ #media      // desktop
 * │
 * └ #media-small  // not desktop
*/
// -------------------------------------------------- //
// styles
// -------------------------------------------------- //
async function style_media( obj )
{
	obj.classList.add('d-none');
	obj.classList.add('d-xxl-flex');
	obj.classList.add('d-flex');
	obj.classList.add('flex-column');
	obj.classList.add('align-items-center');
	obj.classList.add('justify-content-center');
	obj.classList.add('h-100');
	obj.classList.add('w-100');
	obj.setAttribute('id', 'media');

	return true;
}

async function style_media_small( obj )
{
	obj.classList.add('d-xxl-none');
	obj.classList.add('d-flex');
	obj.classList.add('flex-column');
	obj.classList.add('align-items-center');
	obj.classList.add('justify-content-center');
	obj.classList.add('h-100');
	obj.classList.add('w-100');
	obj.setAttribute('id', 'small-media');

	const p = document.createElement('p');
	p.classList.add('text-center');
	p.classList.add('text-light');
	p.textContent = ' available on desktop only!';

	const p1 = document.createElement('p');
	p1.classList.add('text-center');
	p1.classList.add('text-light');
	p1.textContent = ' <- resize ->';

	obj.appendChild(p);
	obj.appendChild(p1);

	return true;
}

// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
async function clear()
{
	const MEDIA = document.getElementById("media");

	return new Promise((resolve, reject) => {
		if ( MEDIA )
		{
			while (MEDIA.firstChild)
				MEDIA.removeChild(MEDIA.firstChild);
			resolve(true);
		}
		else
			reject("media not found");
	});
}

async function build()
{
	const media = document.createElement('div');
	await style_media(media);

	const media_small = document.createElement('div');
	await style_media_small(media_small);

	document.body.appendChild(media);
	document.body.appendChild(media_small);

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	clear,
	build
};
