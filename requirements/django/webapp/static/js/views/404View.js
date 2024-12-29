// file : 404View.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PAGE_TITLE from '../core/helpers/PageTitle.js';
import MEDIA_LAYOUT from '../layouts/MediaLayout.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class PageNotFoundView
{
	constructor()
	{
	}
	
	async render()
	{
		const page_title = PAGE_TITLE;
		await page_title.init();
		await page_title.update('404 - Page Not Found');

		const media = MEDIA_LAYOUT;
		media.container = document.body;
		await media.render('replace');

		const media_layout = media.main_ctn;
		media_layout.innerHTML = `
		<p>404 - Page Not Found</p>
		`;

		return true;
	}
}

const item = new PageNotFoundView();
export default item;
