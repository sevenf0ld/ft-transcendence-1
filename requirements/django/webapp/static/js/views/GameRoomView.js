// file : GameRoomView.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
//layout
import PageTitle from '../core/helpers/PageTitle.js';
//components
import GameGuide from '../components/GameRoomView/GameGuide.js';
import GameBoard from '../components/GameRoomView/GameBoard.js';
import ActionPanel from '../components/GameRoomView/ActionPanel.js';
import Announcer from '../components/GameRoomView/Announcer.js';
import RoomList from '../components/GameRoomView/RoomList.js';
// temporary
import HomeView from './HomeView.js';
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

		const page_title = new PageTitle();
		const top_title = document.querySelector(".ct-top-title");

		top_title.innerHTML = "Game Room (" + this.type + ")";

		const game_guide = new GameGuide(this.left, this.type);
		const game_board = new GameBoard();
		const action_panel = new ActionPanel();
		const announcer = new Announcer();
		const room_list = new RoomList();

		switch (this.type)
		{
			case 'local-pvp':
				page_title.update('Local PVP Room');
				break;
			case 'local-tour':
				page_title.update('Local Tour Room');
				break;
			case 'local-pve':
				page_title.update('Local PVE Room');
				break;
			case 'online-pvp':
				page_title.update('Online PVP Room');
				break;
			case 'online-tour':
				page_title.update('Online Tour Room');
				break;
			default:
				throw new Error("Invalid room type");
				break;
		}

		await game_guide.render();
		//await game_board.render();
		//await action_panel.render();
		//await announcer.render();
		//await room_list.render();
		//
		// TEMPORARY FOR DEBUG
		this.right.insertAdjacentHTML('beforeend',
			'<button id="tmp-btn-home">go back</button>'
		);
		const btn_home = document.querySelector("#tmp-btn-home");
		btn_home.addEventListener('click', async () =>
		{
			const home_view = new HomeView();
			await home_view.render();
		});

		return true;
	}

}
