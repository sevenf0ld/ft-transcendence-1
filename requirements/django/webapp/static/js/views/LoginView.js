// file : LoginView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PageTitle from '../core/helpers/PageTitle.js';
import MediaLayout from '../layouts/MediaLayout.js';
import IntroLayout from '../layouts/IntroLayout.js';
import LOGIN_CARD from '../components/LoginCard.js';
import PAGE_TITLE from '../core/helpers/PageTitle.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class LoginView
{
	constructor()
	{
		this.container = document.body;
	}
	
	async render()
	{
		const page_title = PAGE_TITLE;
		await page_title.init();
		await page_title.update('Sign In');

		const media = new MediaLayout();
		await media.render();

		const layout = new IntroLayout(await media.get());
		await layout.render();

		const parent_div = document.querySelector('.ct-intro');
		LOGIN_CARD.container = parent_div;
		await LOGIN_CARD.render('replace');

		return true;
	}
}
