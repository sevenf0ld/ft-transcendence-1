// file : template.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
export default class Template
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor(container,username)
	{
		// COMMON-atts
		this.container = container;
		this.main_ctn = '';
		this.buttons = {
			close: '',
			history: '',
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.username = username;
	}
	// --------------------------------------------- //
	// MAIN-EXECUTION
	// --------------------------------------------- //
	async render(type)
	{
		const template = await this.init_template();

		if (type.toLowerCase() === 'append')
		{
			this.container.insertAdjacentHTML(
				'beforeend', template
			);
		}
		else if (type.toLowerCase() === 'replace')
		{
			this.container.innerHTML = '';
			this.container.innerHTML = template;
		}
		else
		{
			throw new Error('[ERR] invalid render type');
		}

		await this.push_important_elements();
		await this.bind_events();
		await this.bind_modals();

		return true;
	}

	async push_important_elements()
	{
		this.main_ctn = document.querySelector('.ct-fn-pfp-ctn');
		this.buttons.close = document.querySelector('.ct-fn-pfp-close');
		this.buttons.history = document.querySelector('.ct-fn-pfp-hist');

		if (!this.main_ctn)
			throw new Error('[ERR] main container not found');
		if (!this.buttons.close)
			throw new Error('[ERR] close button not found');
		if (!this.buttons.history)
			throw new Error('[ERR] history button not found');

		return true;
	}
	// --------------------------------------------- //
	// EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		this.buttons['close'].addEventListener(
			'click', async (e) => {await this.closeClick(e);}
		);

		this.buttons['history'].addEventListener(
			'click', async (e) => {await this.historyClick(e);}
		);

		return true;
	}

	async closeClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : fn-pfp-close');

		return true;
	}

	async historyClick(event)
	{
		event.preventDefault();
		console.log('[EVENT] button clicked : fn-pfp-hist');

		return true;
	}
	// --------------------------------------------- //
	// BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
	// --------------------------------------------- //
	// FETCH-RELATED
	// --------------------------------------------- //
	// --------------------------------------------- //
	// HTML-ELEMENT-RELATED
	// --------------------------------------------- //
	async init_template()
	{
		let template = "";
		template += this.html_main_ctn();

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
			${await this.html_stats()}
			${await this.html_buttons()}
		</div>
		`
		// [B] SET atts
		const atts =
		{
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
			<h2 class="%title-c" data-user="%title">%title</h2>
			<div class="%close-c" id="%close-id">%close-t</div>
		</div>
		`
		// [B] SET atts
		const atts =
		{
			'%header-c': 'ct-fn-pfp-hd',
			'%title-c': 'ct-fn-pfp-title',
			'%title': this.username,
			'%close-c': 'ct-fn-pfp-close',
			'%close-id': 'btn_fn_pfp_close',
			'%close-t': 'X',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		return template;
	}

	async html_pfp()
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div class="%pfp-c">
			<img class="%pfp" src="%pfp-src" alt="%pfp-alt">
			<p class="%status">%status</p>
		</div>
		`
		// [B] SET atts
		const atts =
		{
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
		`
		// [B] SET atts
		const atts =
		{
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
		`
		// [B] SET atts
		const atts =
		{
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);
		// [C] HTML RETURN
		return template;
	}
}
