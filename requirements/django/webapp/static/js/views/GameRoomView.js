// file : GameRoomView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import GameGuide from '../components/GameRoomView/GameGuide.js';
import GameBoard from '../components/GameRoomView/GameBoard.js';
import ActionPanel from '../components/GameRoomView/ActionPanel.js';
import Announcer from '../components/GameRoomView/Announcer.js';
import RoomList from '../components/GameRoomView/RoomList.js';
import HomeView from './HomeView.js';

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
export default class GameRoomView
{
	constructor(gameType)
	{
		this.type = gameType;
		this.left = document.querySelector(".ct-main-lpanel");
		this.midTop = document.querySelector(".ct-top-board");
		this.botLeft = document.querySelector(".ct-bottom-left");
		this.botRight = document.querySelector(".ct-bottom-right");
		this.right = document.querySelector(".ct-main-rpanel");
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

	async render()
	{
		await this.clear();

		const page_title = PAGE_TITLE;
		await page_title.init();
		const top_title = document.querySelector(".ct-top-title");

		top_title.innerHTML = "Game Room (" + this.type + ")";

		const game_guide = new GameGuide(this.left, this.type);
		const action_panel = new ActionPanel(this.botLeft, this.type);
		const announcer = new Announcer(this.botRight, this.type);
		const room_list = new RoomList(this.right, this.type);
		const game_board = new GameBoard(this.midTop);

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
