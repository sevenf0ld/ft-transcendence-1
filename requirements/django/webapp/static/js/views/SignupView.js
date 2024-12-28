// file : SignupView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PAGE_TITLE from '../core/helpers/PageTitle.js';
import MediaLayout from '../layouts/MediaLayout.js';
import IntroLayout from '../layouts/IntroLayout.js';
//components
import SIGNUP_CARD from '../components/SignupCard.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class SignupView
{
	constructor(container)
	{
		this.container = container;
	}
	
	async render()
	{
		const page_title = PAGE_TITLE;
		await page_title.init();
		await page_title.update('Sign Up');

		const media = new MediaLayout();
		await media.render();

		const layout = new IntroLayout(await media.get());

		await layout.render();

		SIGNUP_CARD.container = await layout.get();
		await SIGNUP_CARD.render('replace');

		return true;
	}
}
