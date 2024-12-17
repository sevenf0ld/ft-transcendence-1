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
//components
import LoginCard from '../components/LoginCard.js';
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
		const page_title = new PageTitle();
		page_title.update('Sign In');

		const media = new MediaLayout();
		await media.render();

		const layout = new IntroLayout(await media.get());
		await layout.render();

		const login = new LoginCard(await layout.get());
		await login.render();

		return true;
	}
}
