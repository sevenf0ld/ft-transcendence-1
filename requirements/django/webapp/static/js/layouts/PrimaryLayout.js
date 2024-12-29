// file : PrimaryLayout.js
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
class PrimaryLayout
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
			'logo': null,
		};
		// ELEMENT-SPECIFIC-ATTRIBUTES
		this.lpanel = null;
		this.rpanel = null;
		this.mpanel = null;
		this.mpanel_top = null;
		this.top_title = null;
		this.top_board = null;
		this.bottom_right = null;
		this.bottom_left = null;
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

		return true;
	}

	async push_important_elements()
	{
		this.lpanel = document.querySelector('.ct-main-lpanel');
		this.rpanel = document.querySelector('.ct-main-rpanel');
		this.mpanel = document.querySelector('.ct-main-mpanel');
		this.mpanel_top = document.querySelector('.ct-mpanel-top');
		this.top_title = document.querySelector('.ct-top-title');
		this.top_board = document.querySelector('.ct-top-board');
		this.bottom_right = document.querySelector('.ct-bottom-right');
		this.bottom_left = document.querySelector('.ct-bottom-left');

		if (!this.lpanel || !this.rpanel || !this.mpanel 
			|| !this.mpanel_top || !this.top_title || !this.top_board 
			|| !this.bottom_right || !this.bottom_left)
			throw new Error('[ERR] important element not found');

		this.buttons['logo'] = document.getElementById('logo');
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
			${await this.html_header()}
			${await this.html_main()}
			${await this.html_footer()}
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

	async html_header()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
		<header class="%h-c">
			<div class="%pw-c">
				<h1 id="%lg-i" class="%lg-c">%lg-t</h1>
			</div>
		</header>
		`

		// [B] SET ATTRIBUTES
		const attributes =
		{
			'%h-c': 'd-flex justify-content-center align-items-center w-100',
			'%pw-c': 'ct-page-width',
			'%lg-i': 'logo',
			'%lg-c': 'h1 py-2',
			'%lg-t': '42Pong',
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_main()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
		<main class="%m-c">
			<div class="%pw-c">
				<div class="%lp-1c %lp-2c"></div>
				<div class="%mp-c">
					<div class="%mtp-1c %mtp-2c">
						<h3 class="%tph-c">-</h3>
						<div class="%tpd-c"></div>
					</div>
					<div class="%mbp-c">
						<div class="%bl-1c %bl-2c">
							<p class="%btp-c">%btp-t</p>
						</div>
						<div class="%br-1c %br-2c">
							<p class="%btp-c">%btp-t</p>
						</div>
					</div>
				</div>
				<div class="%rp-1c"></div
			</div>
		</main>
		`;

		// [B] SET ATTRIBUTES
		const attributes =
		{
			'%m-c': 'd-flex justify-content-center align-items-center',
			'%pw-c': 'ct-page-width ct-main p-4 d-flex',
			'%lp-1c': 'ct-main-lpanel d-flex flex-column',
			'%lp-2c': 'align-items-center w-100',
			'%mp-c': 'ct-main-mpanel d-flex flex-column',
			'%mtp-1c': 'ct-mpanel-top w-100 d-flex',
			'%mtp-2c': 'flex-column align-items-center',
			'%tph-c': 'ct-top-title h3 py-2 text-center',
			'%tpd-c': 'ct-top-board',
			'%mbp-c': 'ct-mpanel-bottom d-flex justify-content-center',
			'%bl-1c': 'ct-bottom-left h-100 d-flex',
			'%bl-2c': 'justify-content-center align-items-center',
			'%btp-c': 'ct-bottom-placeholder',
			'%btp-t': '(placeholder)',
			'%br-1c': 'ct-bottom-right h-100 d-flex',
			'%br-2c': 'justify-content-center align-items-center',
			'%rp-1c': 'ct-main-rpanel d-flex flex-column',
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}

	async html_footer()
	{
		// [-] HELPER FUNCTION

		// [A] TEMPLATE
		let template = `
		<footer class="%f-1c %f-2c">
			<div class="%pw-c">
				<p class="%p-c">%p-t</p>
			</div>
		`;

		// [B] SET ATTRIBUTES
		const attributes =
		{
			'%f-1c': 'text-center w-100 d-flex',
			'%f-2c': 'justify-content-center align-items-center',
			'%pw-c': 'ct-page-width',
			'%p-c': 'py-3',
			'%p-t': `&copy; ${new Date().getFullYear()} - 42Pong`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
}

const item = new PrimaryLayout();
export default item;
