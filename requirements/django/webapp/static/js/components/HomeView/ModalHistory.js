// file : ModalHistory.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import FETCH from './ModalHistory_fetch.js';
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
class ModalFnOpt
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
		this.history_target = null;
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
		this.main_ctn = document.querySelector('.history-main-ctn');

		if (!this.main_ctn)
			throw new Error('[ERR] main container not found');

		return true;
	}
	// --------------------------------------------- //
	// [2/4] EVENT-RELATED
	// --------------------------------------------- //
	async bind_events()
	{
		/*
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'DemonKiller123');
		await this.gen_list('JAN-01 (01AM)', 'lost', 'pvp', 'DemonKiller123');
		await this.gen_list('JAN-01 (01AM)', 'won', 'tour', 'AlienInvasion');
		await this.gen_list('JAN-01 (01AM)', 'lost', 'tour', 'AlienInvasion');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		await this.gen_list('JAN-01 (01AM)', 'won', 'pvp', 'BirdsAreNotReal');
		*/

		await FETCH.init();
		if (!this.history_target)
			throw new Error('[ERR] history target not found');
		FETCH.target = this.history_target;
		await FETCH.fetchData();
		if (FETCH.re_value === 'match-history-successful')
		{
			const board = document.querySelector('.hst-list-group');
			board.innerHTML = '';
			const histories = FETCH.fetch_obj.rdata.pvp;
			for (const ele of histories)
			{
				let time = ele.match_date + ' (' + ele.match_time + ')';
				let result = ele.result;
				let type = ele.game_type;
				let target = ele.opponent;

				await this.gen_list(time, result, type, target);
			}
			// if no history
			if (histories.length === 0)
				await this.gen_list_empty();
		}
		else
		{
			console.log(FETCH.re_value);
		}

		return true;
	}

	async getCookie(name) {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '')
		{
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++)
			{
				const cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) === (name + '='))
				{
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
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
		<div class="%history-c">
			<div class="%hsttl-c">
			</div>
		</div>
		`;
		// [B] SET atts
		const atts =
		{
			'%history-c': 'history-main-ctn d-flex flex-column',
			'%hsttl-c': 'hst-list-group',
		};
		for (const key in atts)
			template = template.split(key).join(atts[key]);

		// [C] HTML RETURN
		return template;
	}

	async gen_list(date, result, type, target)
	{
		const container = this.main_ctn.querySelector('.hst-list-group');
		if (!container)
			throw new Error('[ERR] container not found');

		const upperResult = result.toUpperCase();
		let typeText = 'PVP';
		if (type==='tour')
			typeText = 'TOUR';

		let template = `
			<div class="%hstt-group">
				<p class="%hstt-date-c">%hstt-date-t</p>
				<p class="%hstt-result-c">%hstt-result-t</p>
				<p class="%hstt-type-c">%hstt-type-t</p>
				<p class="%hstt-des-c">%hstt-des-t</p>
				<p class="%hstt-target-c" @att1>%hstt-target-t</p>
			</div>
		`

		const attributes =
		{
			'%hstt-group': 'hst-list-group-item',
			'%hstt-date-c': 'history-date',
			'%hstt-date-t': date,
			'%hstt-result-c': `history-result ${result.toLowerCase()}`,
			'%hstt-result-t': `${upperResult}`,
			'%hstt-type-c': `history-type ${type.toLowerCase()}`,
			'%hstt-type-t': `${typeText}`,
			'%hstt-des-c': 'history-des',
			'%hstt-des-t': 'Played with ',
			'%hstt-target-c': 'history-target truncate',
			'%hstt-target-t': `${target}`,
			'@att1': `data-bs-tooltip="tooltip" title="${target}"`,
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		container.insertAdjacentHTML('beforeend', template);

		return true;
	}

	async gen_list_empty()
	{
		const container = this.main_ctn.querySelector('.hst-list-group');
		if (!container)
			throw new Error('[ERR] container not found');

		let template = `
			<div class="%hstt-group">
				<p class="%hstt-date-c">%hstt-date-t</p>
			</div>
		`

		const attributes =
		{
			'%hstt-group': 'hst-list-group-item',
			'%hstt-date-c': 'history-date',
			'%hstt-date-t': 'No history found. Play some games!',
		};

		for (const key in attributes)
			template = template.split(key).join(attributes[key]);

		container.insertAdjacentHTML('beforeend', template);

		return true;
	}

	// --------------------------------------------- //
	// [A] BOOSTRAP-MODAL-RELATED
	// --------------------------------------------- //
	async bind_modals()
	{
		return true;
	}
}

const item = new ModalFnOpt();
export default item;
