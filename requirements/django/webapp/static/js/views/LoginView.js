// file : LoginView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import LOGIN_CARD from '../components/LoginCard.js';
import PAGE_TITLE from '../core/helpers/PageTitle.js';
import INTRO_LAYOUT from '../layouts/IntroLayout.js';
import MEDIA_LAYOUT from '../layouts/MediaLayout.js';
import LOGOUT from '../core/logout.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class LoginView
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

		const media = MEDIA_LAYOUT;
		media.container = document.body;
		await media.render('replace');

		const media_div = media.main_ctn;
		const layout = INTRO_LAYOUT;
		layout.container = media_div;
		await layout.render('replace');

		LOGIN_CARD.container = layout.main_ctn;
		await LOGIN_CARD.render('replace');

		return true;
	}


}

const item = new LoginView();
export default item;
