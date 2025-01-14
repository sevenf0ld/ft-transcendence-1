// file : ModalLayout.js
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
class ModalLayout
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
		this.header = null;
		this.body = null;
		this.footer = null;
		this.name = null;
		this.title = null;
	}
	// --------------------------------------------- //
	// [1/4] MAIN-EXECUTION
	// --------------------------------------------- //
	async render(type, static_modal)
	{
		if (!type || type !== 'append' && type !== 'replace')
			throw new Error('[ERR] invalid render type');

		const template = await this.init_template(static_modal);

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
		this.main_ctn = document.querySelector(`#${this.name}`);
		this.header = document.querySelector(`#${this.name} .modal-header`);
		this.body = document.querySelector(`#${this.name} .modal-body`);
		this.footer = document.querySelector(`#${this.name} .modal-footer`);

		if (!this.main_ctn)
			throw new Error('[ERR] main container not found');
		if (!this.header)
			throw new Error('[ERR] header not found');
		if (!this.body)
			throw new Error('[ERR] body not found');
		if (!this.footer)
			throw new Error('[ERR] footer not found');

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
	async init_template(static_modal)
	{
		let template = "";
		template += await this.html_main_ctn(static_modal);

		// trim new lines, spaces, and tabs
		template = template.replace(/\s+/g, ' ');
		template = template.replace(/>\s+</g, '><');
		template = template.replace(/\s*=\s*/g, '=');
		template = template.trim();

		return template;
	}

	async html_main_ctn(static_modal)
	{
		// [-] HELPER FUNCTION
		// [A] TEMPLATE
		let template = `
		<div @1att1 @1att2 @1att3>
			<div class="%dlog-1c %dlog-2c">
				<div class="%cnt-c">
					<div class="%hdr-c">
						<h1 class="%ttl-c">%ttl-t</h1>
					</div>
					<div class="%bdy-c"></div>
					<div class="%ftr-c"></div>
				</div>
			</div>
		</div>
		`;

		let static_str = '';
		if (static_modal === 'static')
			static_str = 'data-bs-backdrop="static" data-bs-keyboard="false"';

		// [B] SET atts
		const atts =
		{
			'@1att1': `class="modal" ${static_str}`,
			'@1att2': `id="${this.name}"`,
			'@1att3': `tabindex="-1"`,
			'%dlog-1c': `modal-dialog modal-sm modal-dialog-centered`,
			'%dlog-2c': `modal-dialog-scrollable`,
			'%cnt-c': `modal-content`,
			'%hdr-c': `modal-header`,
			'%ttl-c': `modal-title text-center w-100`,
			'%ttl-t': `${this.title}`,
			'%bdy-c': `modal-body`,
			'%ftr-c': `modal-footer`,
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

const item = new ModalLayout();
export default item;
