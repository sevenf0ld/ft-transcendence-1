// file : GameRoomView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PAGE_TITLE from '../core/helpers/PageTitle.js';
import ACTION_PANEL from '../components/GameRoomView/ActionPanel.js';
import ANNOUNCER from '../components/GameRoomView/Announcer.js';
import GAME_BOARD from '../components/GameRoomView/GameBoard.js';
import GAME_GUIDE from '../components/GameRoomView/GameGuide.js';
import ROOM_LIST from '../components/GameRoomView/RoomList.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class GameRoomView
{
	constructor()
	{
		this.type = null;
		this.left = null;
		this.midTop = null;
		this.botLeft = null;
		this.botRight = null;
		this.right = null;
	}

	async init()
	{
		this.type = null;
		this.left = document.querySelector(".ct-main-lpanel");
		this.midTop = document.querySelector(".ct-top-board");
		this.botLeft = document.querySelector(".ct-bottom-left");
		this.botRight = document.querySelector(".ct-bottom-right");
		this.right = document.querySelector(".ct-main-rpanel");

		return true;
	}

	async clear()
	{
		this.left.innerHTML = "";
		this.midTop.innerHTML = "";
		this.botLeft.innerHTML = "";
		this.botRight.innerHTML = "";
		this.right.innerHTML = "";

		return true;
	}

	async announce(msg)
	{
		const announcer = ANNOUNCER;
		await announcer.announce(msg);
	}

	async render()
	{
		await this.clear();

		const page_title = PAGE_TITLE;
		await page_title.init();
		const top_title = document.querySelector(".ct-top-title");

		top_title.innerHTML = "Game Room (" + this.type + ")";

		const game_guide = GAME_GUIDE;
		await game_guide.init();
		game_guide.container = this.left;
		game_guide.gameType = this.type;

		const action_panel = ACTION_PANEL;
		await action_panel.init();
		action_panel.container = this.botLeft;
		action_panel.gameType = this.type;

		const announcer = ANNOUNCER;
		await announcer.init();
		announcer.container = this.botRight;
		announcer.gameType = this.type;

		const room_list = ROOM_LIST;
		await room_list.init();
		room_list.container = this.right;
		room_list.gameType = this.type;

		const game_board = GAME_BOARD;
		await game_board.init();
		game_board.container = this.midTop;

		switch (this.type)
		{
			case 'local-pvp':
				await page_title.update('Local PVP Room');
				break;
			case 'local-tour':
				await page_title.update('Local Tour Room');
				break;
			case 'local-pve':
				await page_title.update('Local PVE Room');
				break;
			case 'online-pvp':
				await page_title.update('Online PVP Room');
				break;
			case 'online-tour':
				await page_title.update('Online Tour Room');
				break;
			default:
				throw new Error("Invalid room type");
				break;
		}

		await game_guide.render();
		await game_board.render();
		await action_panel.render();
		await announcer.render();
		await room_list.render();

		return true;
	}
}

const item = new GameRoomView();
export default item;
