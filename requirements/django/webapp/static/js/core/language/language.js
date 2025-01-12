// file : language.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
import * as LOADING from '../helpers/loading.js';
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class languageClass
{
	constructor()
	{
		this.resources = {};
		this.cur_lang = 'en';
		this.time_out = 0;
	}

	async insert_script()
	{
		await LOADING.disable_all();
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/';
		script.src += "i18next@21.6.0/dist/umd/i18next.min.js";
		script.async = true;
		script.onload = async () => {
			await this.loadLanguages();
		}
		document.head.appendChild(script);
		await LOADING.restore_all();
	}

	async loadLanguages()
	{
		const enFile = await fetch('/static/js/core/language/en.json');
		const zhFile = await fetch('/static/js/core/language/zh.json');
		const myFile = await fetch('/static/js/core/language/my.json');
		this.resources = {
			en: { translation: await enFile.json() },
			zh: { translation: await zhFile.json() },
			my: { translation: await myFile.json() }
		};

		await i18next.init({
			lng: 'en',
			fallbackLng: 'en',
			resources: this.resources
		});
	}

	async changeLanguage(lang)
	{
		if (lang !== 'en' && lang !== 'zh' && lang !== 'my')
			return;

		if (this.resources[lang])
		{
			this.cur_lang = lang;
			await i18next.changeLanguage(lang);
		}
	}

	async updateContent(view)
	{
		if (!i18next)
		{
			if (this.time_out === 0)
				this.time_out = performance.now();

			if (performance.now() - this.time_out > 10000)
				throw new Error('i18next took too long to load');

			await new Promise(r => setTimeout(r, 1000));
			await this.updateContent(view);
		}
		this.time_out = 0;

		let str;
		if (view === 'home')
		{
			str = '[data-i18n="played"]';
			document.querySelector(str)
				.innerHTML = i18next.t('home.sb.play');

			str = '[data-i18n="wr"]';
			document.querySelector(str)
				.innerHTML = i18next.t('home.sb.wr');

			str = '[data-i18n="wins"]';
			document.querySelector(str)
				.innerHTML = i18next.t('home.sb.wins');

			str = '[data-i18n="losses"]';
			document.querySelector(str)
				.innerHTML = i18next.t('home.sb.losses');

			str = '#btn_history';
			document.querySelector(str)
				.innerHTML = i18next.t('home.btn.history');

			str = '#btn_settings';
			document.querySelector(str)
				.innerHTML = i18next.t('home.btn.settings');

			str = '#btn_logout';
			document.querySelector(str)
				.innerHTML = i18next.t('home.btn.logout');

			str = '.ct-top-title';
			document.querySelector(str)
				.innerHTML = i18next.t('home.gb.title');

			str = '[data-i18n="online"]';
			document.querySelector(str)
				.innerHTML = i18next.t('home.gb.online');

			str = '[data-i18n="local"]';
			document.querySelector(str)
				.innerHTML = i18next.t('home.gb.local');

			str = '#btn_remote_pvp';
			document.querySelector(str)
				.innerHTML = i18next.t('home.gb.pvp');

			str = '#btn_local_pve';
			document.querySelector(str)
				.innerHTML = i18next.t('home.gb.pve');

			str = '#btn_local_tour';
			document.querySelector(str)
				.innerHTML = i18next.t('home.gb.tour');

			str = '#btn_local_pvp';
			document.querySelector(str)
				.innerHTML = i18next.t('home.gb.pvp');
		}
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
const item = new languageClass();
export default item;
