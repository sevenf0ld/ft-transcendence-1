// file : Template.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// THIS IS A FILE WHICH REFERENCES THE TEMPLATE (TEMPLATE.JS)
// [section-structure]
// 1. constructor
// 2. main-execution
// 3. event-related
// 4. fetch-related
// 5. html-element-related
// a. bootstrap-modal-related (optional)
// # init the class and export it.
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class BotFriendPfp
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		// COMMON-atts
		this.container = null;
		this.main_ctn = null;
		this.buttons = {
			'close': null,
			'history': null,
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.username = null;
	}
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render(type)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

		const template = await this.init_template();

		if (type === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (type === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}

		await this.push_important_elements();
		await this.bind_events();
		await this.bind_modals();

		return true;
	}

	async push_important_elements()
	{
		this.main_ctn = document.querySelector('.ct-fn-pfp-ctn');
		this.buttons['close'] = document.getElementById('btn_fn_pfp_close');
		this.buttons['history'] = document.getElementById('btn_fn_pfp_hist');

		if (!this.main_ctn)
			throw new Error('[ERR] main container not found');
		for (const key in this.buttons)
		{
			if (!this.buttons[key])
				throw new Error(`[ERR] button not found : ${key}`);
		}

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		this.buttons['close'].addEventListener(
			'click', async (event) => {await this.closeClick(event);}
		);

		this.buttons['history'].addEventListener(
			'click', async (event) => {await this.historyClick(event);}
		);

		return true;
	}

	async closeClick(event)
	{
		event.preventDefault();
		console.log('[BTN] closeClick');

		const template = `
		<p class="ct-bottom-placeholder">(placeholder)</p>
		`;;

		this.container.innerHTML = '';
		this.container.innerHTML = template;

		return true;
	}

	async historyClick(event)
	{
		event.preventDefault();
		console.log('[BTN] historyClick');

		return true;
	}
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template()
	{
		let template = "";
		template += await this.html_main_ctn();

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c1">
			${await this.html_header()}
			${await this.html_pfp()}
			${await this.html_buttons()}
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c1': 'ct-fn-pfp-ctn d-flex flex-column',
			'%footer-c': 'ct-fn-pfp-footer',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_header()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%header-c">
			<h2 class="%title-c" data-user="%title" @att1>%title</h2>
			<div class="%close-c" id="%close-id">%close-t</div>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%header-c': 'ct-fn-pfp-hd',
			'%title-c': 'ct-fn-pfp-title truncate',
			'%title': this.username,
			'@att1': `title="${this.username}"`,
			'%close-c': 'ct-fn-pfp-close',
			'%close-id': 'btn_fn_pfp_close',
			'%close-t': 'X',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_pfp()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%pfp-1c">
			<img class="%pfp-2c" src="%pfp-src" alt="%pfp-alt">
			${await this.html_stats()}
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%pfp-1c': 'ct-fn-pfp-pic-ctn',
			'%pfp-2c': 'ct-fn-pfp-pic-img',
			'%pfp-src': `/static/assets/images/default-pfp.png`,
			'%pfp-alt': this.username,
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_stats()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%main-c">
			<div class="%lst-c">%win-t</div>
			<div class="%lst-c">%lose-t</div>
			<div class="%lst-c">%total-t</div>
			<div class="%lst-c">%winrate-t</div>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%main-c': 'ct-fn-pfp-stats-ctn',
			'%lst-c': 'ct-fn-pfp-stats-list truncate',
			'%win-t': 'Win: 100',
			'%lose-t': 'Lose: 100',
			'%total-t': 'Total: 100',
			'%winrate-t': 'W.rate: 100%',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_buttons()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%btn-ctn">
			<button @att1 @att2 @att3 @att4 @att5 @att6>@att7</button>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%btn-ctn': 'ct-fn-btn-ctn',
			'@att1': 'id="btn_fn_pfp_hist"',
			'@att2': 'class="ct-btn-neau"',
			'@att3': `data-bs-toggle="modal"`,
			'@att4': `data-bs-target="#modal-history"`,
			'@att5': `data-toggle="modal"`,
			'@att6': ``,
			'@att7': 'Match History',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
}

const item = new BotFriendPfp();
export default item;


// COPY AND PASTE
/
// file : MidBoard.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// THIS IS A FILE WHICH REFERENCES THE TEMPLATE (TEMPLATE.JS)
// [section-structure]
// 1. constructor
// 2. main-execution
// 3. event-related
// 4. fetch-related
// 5. html-element-related
// a. bootstrap-modal-related (optional)
// # init the class and export it.
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class MidBoard
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		// COMMON-atts
		this.container = null;
		this.main_ctn = null;
		this.buttons = {
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
	}
	// ======================================================================== //
	// SHARED-LAYOUT-BASE
	// ======================================================================== //
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [3/4] FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [4/4] HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
}

const item = new MidBoard();
export default item;
