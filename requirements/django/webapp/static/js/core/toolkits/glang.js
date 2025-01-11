// file : google_translate.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
import * as LOADING from '../helpers/loading.js';
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class googleClass
{
	constructor()
	{
		this.loaded = false;
		this.html_chunk = [];
	}

	async loadScript()
	{
		this.loaded = true;
		const script = document.createElement('script');
		script.src = "https://translate.google.com/translate_a/"
		script.src += "element.js?cb=googleTranslateElementInit";
		script.async = true;
		document.head.appendChild(script);
	}

	async createElement()
	{
		const div = document.createElement('div');
		div.id = 'google_translate_element';
		document.body.appendChild(div);
	}

	async hide_google_gadget()
	{
		const style = document.createElement('style');
		let str = 'google_translate_element,.skiptranslate';
		str += '{display:none;}body{top:0!important;}';
		style.innerHTML = str;
		document.head.appendChild(style);
	}

	async configuration()
	{
		return {
			pageLanguage: 'en',
			includedLanguages: 'en,ms,zh-CN',
			autoDisplay: false,
			gaTrack: true,
		};
	}
	
	async read_lang(language)
	{
		if (language === 'malay')
			return 'ms';
		else if (language === 'chinese')
			return 'zh-CN';
		else if (language === 'english')
			return 'en';
		else
			throw new Error('Invalid language');
	}

	async change(language)
	{
		await this.google_html_chunk('restore');

		await LOADING.disable_all();
		await setTimeout(async () => {
			const select = document.querySelector('.goog-te-combo');
			select.value = await this.read_lang(language);
			select.dispatchEvent(new Event('change'));
		},300);
		await LOADING.restore_all();

		await this.google_html_chunk('read');

		return true;
	}

	async google_html_chunk(type)
	{
		if (type === 'read')
		{
			await LOADING.disable_all();
			await setTimeout(async () => {
				const ele = document.getElementById('google_translate_element');
				let current = ele;
				while (current)
				{
					this.html_chunk.push(current);
					current = current.nextElementSibling;
				}
			await LOADING.restore_all();
			},1000);
		}
		else if (type === 'restore')
		{
			for (const chunk of this.html_chunk)
			{
				if (!document.body.contains(chunk))
					document.body.appendChild(chunk);
			}
		}
	}

	async run(language)
	{
		this.loaded = false;
		this.html_chunk = [];
		await this.hide_google_gadget();
		await this.createElement();
		await this.loadScript();

		const this_class = this;
		window.googleTranslateElementInit = async () => {
			const config = await this_class.configuration();
			new google.translate.TranslateElement(
				config, 'google_translate_element'
			);
			await this.google_html_chunk('read');
		};
	}
}

const item = new googleClass();
export default item;
