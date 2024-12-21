// file : HomeView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PageTitle from '../core/helpers/PageTitle.js';
import MediaLayout from '../layouts/MediaLayout.js';
import PrimaryLayout from '../layouts/PrimaryLayout.js';
//components
import leftPanelUser from '../components/HomeView/LeftUser.js';
import midTopPanel from '../components/HomeView/MidBoard.js';
import rightPanelFriends from '../components/HomeView/RightFnList.js';
import TOKEN from '../core/token.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export default class HomeView
{
	constructor()
	{
		this.container = document.body;

		TOKEN.token_id = setInterval(async () => {
    		await TOKEN.refresh_token();
    	}, 15000);
	}

	async render()
	{
		let parent_html;

		const page_title = new PageTitle();
		page_title.update('Home');

		const media = new MediaLayout();
		await media.render();

		parent_html = await media.get();
		const primary = new PrimaryLayout(parent_html);
		await primary.render();

		parent_html = await primary.get("ct-main-lpanel");
		const leftpanel = new leftPanelUser(parent_html);
		await leftpanel.render();

		parent_html = await primary.get("ct-mpanel-top");
		const midtoppanel = new midTopPanel(parent_html);
		await midtoppanel.render();

		parent_html = await primary.get("ct-main-rpanel");
		const rightpanel = new rightPanelFriends(parent_html);
		await rightpanel.render();

		return true;
	}
}
