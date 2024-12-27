// file : RoomList.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
import HomeView from '../../views/HomeView.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
export default class RoomList
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(container, gameType)
	{
		// COMMON-atts
		this.container = container;
		this.base_ctn = null;
		this.lobby_ctn = null;
		this.playing_ctn = null;
		this.waiting_ctn = null;
		this.eliminated_ctn = null;
		this.roomTitle = null;
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.gameType = gameType;
	}

	async render()
	{
		await this.baseLayour_render('replace');

		switch (this.gameType)
		{
			case 'local-pvp':
				await this.localPvp_render('replace');
				break;
			case 'local-tour':
				await this.localTour_render('replace');
				break;
			case 'local-pve':
				await this.localPve_render('replace');
				break;
			case 'online-pvp':
				await this.onlinePvp_render('replace');
				break;
			case 'online-tour':
				await this.onlineTour_render('replace');
				break;
			default:
				break;
		}

		return true;
	}

	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// SHARED-LAYOUT-BASE
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async baseLayour_render(renderType)
	{
		const template = await this.init_template_base();

		if (renderType.toLowerCase() === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_base();
		await this.bind_events_base();
		await this.bind_modals_base();

		return true;
	}

	async push_important_elements_base()
	{
		this.base_ctn = document.querySelector('.ct-gr-rl-body');
		this.roomTitle = document.querySelector('.ct-gr-rl-title');

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_base()
	{
		const btn_home = document.querySelector("#btn_leaveRoom");
		btn_home.addEventListener('click', async () =>
		{
			const home_view = new HomeView();
			await home_view.render();
		});

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED 
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_base()
	{
		let template = "";
		template += await this.html_main_ctn_base();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_base()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			<h1 class="%rlt-c1">Room List</h1>
			<div class="%group-c1"></div>
			<button class="%btn-c1" id="%btn-i1" @att-1>Leave Room</button>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-gr-roomList-ctn p-2',
			'%rlt-c1': 'ct-gr-rl-title',
			'%group-c1': 'ct-gr-rl-body',
			'%btn-c1': 'ct-gr-rl-btn ct-btn-neau',
			'@att-1': 'type="button"',
			'%btn-i1': 'btn_leaveRoom',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async roomGroupGenerator(groupType)
	{
		// [A] TEMPLATE
		let template = `
			<div class="%main-c1">
				<div class="%hd-c1">
					<h3 class="%hdt-c1">%hdt-t1</h3>
					<h3 class="%hdsym-c1">%hdsym-t1</h3>
				</div>
				<div class="%bd-c1" data-type="%bd-ty1"></div>
			</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'category-ctn ',
			'%hd-c1': 'category-title-ctn',
			'%hdt-c1': 'category-title',
			'%hdt-t1': groupType,
			'%hdsym-c1': 'category-title-sym',
			'%hdsym-t1': '',
			'%bd-c1': 'category-list-ctn',
			'%bd-ty1': groupType.toLowerCase(),
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		return template;
	}

	async playerListGenerator(container, username, groupType, playerType)
	{
		// [-] HELPER FUNCTION
		let icon = '';
		if (playerType === 'host')
			icon = '/static/assets/images/host.svg';
		else
			icon = '/static/assets/images/guest.svg';

		// [A] TEMPLATE
		let template = `
			<div class="%main-c1" title="%main-t1" data-type="%main-ty1">
				<div class="%pfp-c1">
					<img class="%img-c1" src="%img-src1" alt="%img-alt1">
					<div class="%status-c1 %status-t1"></div>
				</div>
				<h2 class="%name-c1 truncate">%name-t1</h2>
				<img class="%ptype-c1" src="%ptype-src1" alt="%ptype-alt1" data-host="%ptype-d1">
			</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'fnl-item-ctn',
			'%main-t1': username,
			'%main-ty1': groupType,
			'%pfp-c1': 'fnl-item-pfp-ctn',
			'%img-c1': 'fnl-item-pfp',
			'%img-src1': '/static/assets/images/default-pfp.png',
			'%img-alt1': 'profile picture',
			'%status-c1': 'fnl-item-status',
			'%status-t1': 'online',
			'%name-c1': 'fnl-item-name online',
			'%name-t1': username,
			'%ptype-c1': 'fnl-item-icon',
			'%ptype-src1': icon,
			'%ptype-alt1': 'player icon',
			'%ptype-d1': playerType.toLowerCase(),
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		await container.insertAdjacentHTML(
			'beforeend', template
		);

		return template;
	}

	async playerListCheckEmpty(containers)
	{
		for (const container of containers)
		{
			if (container.children.length === 0)
			{
				const template = `
				<p class="empty-list">(empty)</p>
				`;
				container.insertAdjacentHTML(
					'beforeend', template
				);
			}
		}
	}

	async updateRoomPlayerCount(count)
	{
		const count_ctn = this.roomTitle;

		if (count_ctn && count_ctn.dataset.roomType === 'pvp')
			count_ctn.innerHTML = `Room List (${count}/2)`;
		else if (count_ctn && count_ctn.dataset.roomType === 'tour')
			count_ctn.innerHTML = `Room List (${count}/5)`;

		return true;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED 
	// --------------------------------------------- //
	async bind_modals_base()
	{
		return true;
	}

	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// LOCAL-PVP
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async localPvp_render(renderType)
	{
		const template = await this.init_template_lpvp();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_lpvp();
		await this.bind_events_lpvp();
		await this.bind_modals_lpvp();

		return true;
	}

	async push_important_elements_lpvp()
	{
		this.lobby_ctn = document.querySelector(".category-list-ctn[data-type='lobby']");
		this.playing_ctn = document.querySelector(".category-list-ctn[data-type='playing']");

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_lpvp()
	{
		this.roomTitle.setAttribute('data-room-type', 'pvp');

		await this.playerListGenerator(this.lobby_ctn, 'You', 'Lobby', 'host');
		await this.playerListGenerator(this.lobby_ctn, 'Player 2', 'Lobby', 'guest');

		await this.playerListCheckEmpty([this.lobby_ctn, this.playing_ctn]);
		await this.updateRoomPlayerCount(2);

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED (LOCAL-PVP)
	// --------------------------------------------- //
	async init_template_lpvp()
	{
		let template = "";
		template += await this.html_main_ctn_lpvp();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_lpvp()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		${await this.roomGroupGenerator('Lobby', 'ct-gr-rl-lobby')}
		${await this.roomGroupGenerator('Playing', 'ct-gr-rl-playing')}
		`;
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_lpvp()
	{
		return true;
	}

	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// LOCAL-TOUR
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async localTour_render(renderType)
	{
		const template = await this.init_template_ltour();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_ltour();
		await this.bind_events_ltour();
		await this.bind_modals_ltour();

		return true;
	}

	async push_important_elements_ltour()
	{
		this.lobby_ctn = document.querySelector(".category-list-ctn[data-type='lobby']");
		this.playing_ctn = document.querySelector(".category-list-ctn[data-type='playing']");
		this.waiting_ctn = document.querySelector(".category-list-ctn[data-type='waiting']");
		this.eliminated_ctn = document.querySelector(".category-list-ctn[data-type='eliminated']");

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_ltour()
	{
		this.roomTitle.setAttribute('data-room-type', 'tour');

		await this.playerListGenerator(this.lobby_ctn, 'You', 'Lobby', 'host');

		await this.playerListCheckEmpty([
			this.lobby_ctn,
			this.playing_ctn,
			this.waiting_ctn,
			this.eliminated_ctn
		]);

		await this.updateRoomPlayerCount(1);

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_ltour()
	{
		let template = "";
		template += await this.html_main_ctn_ltour();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_ltour()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		${await this.roomGroupGenerator('Lobby', 'ct-gr-rl-lobby')}
		${await this.roomGroupGenerator('Playing', 'ct-gr-rl-playing')}
		${await this.roomGroupGenerator('Waiting', 'ct-gr-rl-waiting')}
		${await this.roomGroupGenerator('Eliminated', 'ct-gr-rl-eliminated')}
		`;
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_ltour()
	{
		return true;
	}

	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// LOCAL-PVE
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION (LOCAL-PVE)
	// --------------------------------------------- //
	async localPve_render(renderType)
	{
		const template = await this.init_template_lpve();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_lpve();
		await this.bind_events_lpve();
		await this.bind_modals_lpve();

		return true;
	}

	async push_important_elements_lpve()
	{
		this.lobby_ctn = document.querySelector(".category-list-ctn[data-type='lobby']");
		this.playing_ctn = document.querySelector(".category-list-ctn[data-type='playing']");

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_lpve()
	{
		this.roomTitle.setAttribute('data-room-type', 'pvp');

		await this.playerListGenerator(this.lobby_ctn, 'you', 'lobby', 'host');
		await this.playerListGenerator(this.lobby_ctn, 'PONG-AI', 'Lobby', 'guest');
		await this.playerListCheckEmpty([this.lobby_ctn, this.playing_ctn]);

		await this.updateRoomPlayerCount(2);

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_lpve()
	{
		let template = "";
		template += await this.html_main_ctn_lpve();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_lpve()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		${await this.roomGroupGenerator('Lobby', 'ct-gr-rl-lobby')}
		${await this.roomGroupGenerator('Playing', 'ct-gr-rl-playing')}
		`;
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_lpve()
	{
		return true;
	}

	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// ONLINE-PVP
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async onlinePvp_render(renderType)
	{
		const template = await this.init_template_opvp();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_opvp();
		await this.bind_events_opvp();
		await this.bind_modals_opvp();

		return true;
	}

	async push_important_elements_opvp()
	{
		this.lobby_ctn = document.querySelector(".category-list-ctn[data-type='lobby']");
		this.playing_ctn = document.querySelector(".category-list-ctn[data-type='playing']");

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_opvp()
	{
		this.roomTitle.setAttribute('data-room-type', 'pvp');

		await this.playerListGenerator(this.lobby_ctn, 'You', 'lobby', 'host');

		await this.playerListCheckEmpty([this.lobby_ctn, this.playing_ctn]);

		await this.updateRoomPlayerCount(1);

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_opvp()
	{
		let template = "";
		template += await this.html_main_ctn_opvp();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn_opvp()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		${await this.roomGroupGenerator('Lobby', 'ct-gr-rl-lobby')}
		${await this.roomGroupGenerator('Playing', 'ct-gr-rl-playing')}
		`;

		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_opvp()
	{
		return true;
	}

	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// ONLINE-TOUR
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async onlineTour_render(renderType)
	{
		const template = await this.init_template_otour();

		if (renderType.toLowerCase() === 'append')
		{
			this.base_ctn.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (renderType.toLowerCase() === 'replace')
		{
			this.base_ctn.innerHTML = '';
			this.base_ctn.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render renderType');
		}

		await this.push_important_elements_otour();
		await this.bind_events_otour();
		await this.bind_modals_otour();

		return true;
	}

	async push_important_elements_otour()
	{
		this.lobby_ctn = document.querySelector(".category-list-ctn[data-type='lobby']");
		this.playing_ctn = document.querySelector(".category-list-ctn[data-type='playing']");
		this.waiting_ctn = document.querySelector(".category-list-ctn[data-type='waiting']");
		this.eliminated_ctn = document.querySelector(".category-list-ctn[data-type='eliminated']");

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events_otour()
	{
		this.roomTitle.setAttribute('data-room-type', 'tour');

		await this.playerListGenerator(this.lobby_ctn, 'You', 'Lobby', 'host');

		await this.playerListCheckEmpty([
			this.lobby_ctn,
			this.playing_ctn,
			this.waiting_ctn,
			this.eliminated_ctn
		]);

		await this.updateRoomPlayerCount(1);

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template_otour()
	{
		let template = "";
		template += await this.html_main_ctn_otour();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}
	async html_main_ctn_otour()
	{	
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		${await this.roomGroupGenerator('Lobby', 'ct-gr-rl-lobby')}
		${await this.roomGroupGenerator('Playing', 'ct-gr-rl-playing')}
		${await this.roomGroupGenerator('Waiting', 'ct-gr-rl-waiting')}
		${await this.roomGroupGenerator('Eliminated', 'ct-gr-rl-eliminated')}
		`;

		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals_otour()
	{
		return true;
	}
}


