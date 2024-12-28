// file : MediaLayout.js
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
class MediaLayout
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
		this.main_ctn = document.querySelector('#media');

		if (!this.main_ctn)
			throw new Error('[ERR] main container not found');

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
		<div class="%big-1c %big-2c %big-3c" id="%big-d"></div>
		<div class="%sma-1c %sma-2c %sma-3c" id="%sma-d">
			<img src="%img-src" alt="%img-alt" class="%img-c">
			<p>%text</p>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%big-1c': 'd-none d-xxl-flex d-flex flex-column',
			'%big-2c': 'align-items-center justify-content-center',
			'%big-3c': 'h-100 w-100',
			'%big-d': 'media',
			'%sma-1c': 'd-xxl-none d-flex flex-column',
			'%sma-2c': 'align-items-center justify-content-center',
			'%sma-3c': 'h-100 w-100',
			'%sma-d': 'small-media',
			'%img-src': '/static/assets/images/media.svg',
			'%img-alt': 'media',
			'%img-c': 'ct-media-img img-fluid mb-3 w-50',
			'%text': 'Ooops! media too small',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}
	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
}

const item = new MediaLayout();
export default item;
