// file : 404View.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PageTitle from '../core/helpers/PageTitle.js';
import MediaLayout from '../layouts/MediaLayout.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class PageNotFoundView
{
	constructor()
	{
	}
	
	async render()
	{
		const page_title = new PageTitle();
		page_title.update('404 - Page Not Found');

		const media = new MediaLayout();
		await media.render();

		const media_layout = await media.get();
		media_layout.innerHTML = `
		<p>404 - Page Not Found</p>
		`;

		return true;
	}
}
