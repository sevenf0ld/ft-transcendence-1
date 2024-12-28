// file : SignupView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PAGE_TITLE from '../core/helpers/PageTitle.js';
import SIGNUP_CARD from '../components/SignupCard.js';
import INTRO_LAYOUT from '../layouts/IntroLayout.js';
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
class SignupView
{
	constructor()
	{
		this.container = document.body;
	}
	
	async render()
	{
		const page_title = PAGE_TITLE;
		await page_title.init();
		await page_title.update('Sign Up');

		const media = MEDIA_LAYOUT;
		media.container = this.container;
		await media.render('replace');

		const media_div = media.main_ctn;
		const layout = INTRO_LAYOUT;
		layout.container = media_div;
		await layout.render('replace');

		SIGNUP_CARD.container = layout.main_ctn;
		await SIGNUP_CARD.render('replace');

		return true;
	}
}

const item = new SignupView();
export default item;
