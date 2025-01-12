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
		this.cur_lang = null;
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
		if (this.resources[this.cur_lang] === undefined)
		{
			if (this.time_out === 0)
				this.time_out = performance.now();

			if (performance.now() - this.time_out > 10000)
				throw new Error('i18next took too long to load');

			await new Promise(r => setTimeout(r, 1000));
			await this.updateContent(view);
		}
		this.time_out = 0;
		await this.changeLanguage(this.cur_lang);

		let selector_str;
		if (view === 'home')
		{
			selector_str = '[data-i18n="played"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.sb.play');

			selector_str = '[data-i18n="wr"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.sb.wr');

			selector_str = '[data-i18n="wins"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.sb.wins');

			selector_str = '[data-i18n="losses"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.sb.losses');

			selector_str = '#btn_history';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.btn.history');

			selector_str = '#btn_settings';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.btn.settings');

			selector_str = '#btn_logout';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.btn.logout');

			selector_str = '.ct-top-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.gb.title');

			selector_str = '[data-i18n="online"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.gb.online');

			selector_str = '[data-i18n="local"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.gb.local');

			selector_str = '#btn_remote_pvp';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.gb.pvp');

			selector_str = '#btn_local_pve';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.gb.pve');

			selector_str = '#btn_local_tour';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.gb.tour');

			selector_str = '#btn_local_pvp';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.gb.pvp');

			selector_str = '.friend-top-title';
			if (document.querySelector(selector_str))
			{
				document.querySelector(selector_str)
					.innerHTML = i18next.t('home.fn.title');
			}

			selector_str = '[data-i18n="fn-added"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.fn.added');

			selector_str = '[data-i18n="fn-pending"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.fn.pending');

			selector_str = '[data-i18n="fn-blocked"]';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.fn.blocked');

			selector_str = '#btn_add_friend';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.fn.add');

			selector_str = '.empty-list';
			document.querySelectorAll(selector_str).forEach((el) =>
			{
				el.innerHTML = i18next.t('home.fn.empty');
			});

			selector_str = `.ct-bottom-placeholder`;
			document.querySelectorAll(selector_str).forEach((el) =>
			{
				el.innerHTML = i18next.t('home.fn.botph');
			});

			if (document.querySelector('.ct-chatbox-ctn'))
			{
				await this.updateContent('chatbox-ctn');
				await this.updateContent('chatbox-msg');
			}
			if (document.querySelector('.ct-fn-pfp-ctn'))
			{
				document.getElementById('btn_fn_pfp_close').click();
				document.getElementById('btn_chatbox_profile').click();
			}
		}
		else if (view === "modal-settings")
		{
			selector_str = '#modal-settings .modal-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.title');

			selector_str = '#modal-settings #btn_setLang';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.lang');

			selector_str = '#modal-settings #btn_setAcc';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.acc');

			selector_str = '#modal-settings #btn_setPfp';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.pfp');

			selector_str = '#modal-settings #btn_set2FA';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.tfa');
		}
		else if (view === "modal-settings-lang")
		{
			selector_str = '#modal-settings .modal-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.lang');
		}
		else if (view === "modal-settings-acc")
		{
			selector_str = '#modal-settings .modal-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.acc');

			selector_str = '[data-i18n="acc-username"]';
			await this.word_processor(
				selector_str, "username", 'home.mdset.acc-usern'
			);

			selector_str = '[data-i18n="acc-password"]';
			await this.word_processor(
				selector_str, "password", 'home.mdset.acc-pass'
			);

			selector_str = '[data-i18n="acc-email"]';
			await this.word_processor(
				selector_str, "email", 'home.mdset.acc-email'
			);

			selector_str = '.ct-set-warning';
			if (document.querySelector(selector_str))
			{
				document.querySelector(selector_str)
					.innerHTML = i18next.t('home.mdset.warn');
			}
		}
		else if (view === "modal-settings-pfp")
		{
			selector_str = '#modal-settings .modal-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.pfp');

			selector_str = '#btn_pfp_submit';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.pfp-submit');

			selector_str = '#btn_pfp_remove';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.pfp-remove');
		}
		else if (view === "modal-settings-tfa")
		{
			selector_str = '#modal-settings .modal-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.tfa');

			selector_str = '.ct-set-2fa-p';
			await this.word_processor(
				selector_str, "2fa", 'home.mdset.tfa'
			);
			await this.word_processor(
				selector_str, "status", 'home.mdset.tfa-status'
			);
			await this.word_processor(
				selector_str, "enabled", 'home.mdset.tfa-en'
			);
			await this.word_processor(
				selector_str, "disabled", 'home.mdset.tfa-dis'
			);

			selector_str = '.ct-set-warning';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdset.warn');
		}
		else if (view === "modal-history")
		{
			selector_str = '#modal-history .modal-title';
			await this.word_processor(
				selector_str, "match history", 'home.mdhis.title'
			);

			selector_str = '.history-result.won';
			await this.word_processor_all(
				selector_str, "won", 'home.mdhis.won'
			);

			selector_str = '.history-result.lost';
			await this.word_processor_all(
				selector_str, "lost", 'home.mdhis.lost'
			);

			selector_str = '.history-des';
			await this.word_processor_all(
				selector_str, "played with", 'home.mdhis.played'
			);

			selector_str = '.history-type.pvp';
			await this.word_processor_all(
				selector_str, "pvp", 'home.mdhis.pvp'
			);
		}
		else if (view === "chatbox-ctn")
		{
			selector_str = '#btn_chatbox_invite';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.chat.inv');

			selector_str = '#input_chatbox:disabled';
			if (document.querySelector(selector_str))
				document.querySelector(selector_str)
					.placeholder = i18next.t('home.chat.dis');

			selector_str = '#input_chatbox:not(:disabled)';
			if (document.querySelector(selector_str))
				document.querySelector(selector_str)
					.placeholder = i18next.t('home.chat.ph');
		}
		else if (view === "fn-pfp")
		{
			selector_str = '[data-i18n="fn-pfp-win"]';
			await this.word_processor(
				selector_str, "won", 'home.fnpfp.win'
			);
	
			selector_str = '[data-i18n="fn-pfp-loss"]';
			await this.word_processor(
				selector_str, "lost", 'home.fnpfp.lose'
			);

			selector_str = '[data-i18n="fn-pfp-total"]';
			await this.word_processor(
				selector_str, "total", 'home.fnpfp.total'
			);

			selector_str = '[data-i18n="fn-pfp-winrate"]';
			await this.word_processor(
				selector_str, "w.rate", 'home.fnpfp.wr'
			);

			selector_str = '#btn_fn_pfp_hist';
			await this.word_processor(
				selector_str, "match history", 'home.fnpfp.hist'
			);
		}
		else if (view === "modal-add-fn")
		{
			selector_str = '#modal-addFriend .modal-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdadd.addfn');

			selector_str = '.add-friend-input';
			document.querySelector(selector_str)
				.setAttribute('placeholder', i18next.t('home.mdadd.ph'));

			selector_str = '#btn_add_friend_submit';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdadd.addfn');
		}
		else if (view === "game-room")
		{
			selector_str = '.ct-top-title';
			await this.word_processor(
				selector_str, "game room", 'home.gr.gr'
			);
			await this.word_processor(
				selector_str, "local-pve", 'home.gr.pve'
			);
			await this.word_processor(
				selector_str, "local-pvp", 'home.gr.pvp'
			);
			await this.word_processor(
				selector_str, "local-tour", 'home.gr.tour'
			);
			await this.word_processor(
				selector_str, "online-pvp", 'home.gr.opvp'
			);

			selector_str = '.ct-gr-guide-header';
			await this.word_processor(
				selector_str, "game mechanics", 'home.gr.gm'
			);

			selector_str = '.ct-gr-guide-instruction .instruction-header';
			await this.word_gr_guide_header(selector_str);

			selector_str = '.ct-gr-guide-instruction .instruction-body';
			await this.word_gr_guide_des(selector_str);

			selector_str = '.ct-gr-rl-title';
			await this.word_processor(
				selector_str, "room list", 'home.gr.rl'
			);

			selector_str = '[data-i18n="btn_start"]';
			await this.word_processor(
				selector_str, "start", 'home.gr.start'
			);

			selector_str = '[data-i18n="btn_restart"]';
			await this.word_processor(
				selector_str, "restart game", 'home.gr.restart'
			);

			selector_str = '[data-i18n="btn_add"]';
			await this.word_processor(
				selector_str, "add player", 'home.gr.add'
			);

			selector_str = '.ct-gr-announcer-hd-title';
			await this.word_processor(
				selector_str, "announcement", 'home.gr.ann'
			);

			selector_str = '.ct-gr-announcer-rid';
			await this.word_processor(
				selector_str, "room id", 'home.gr.rid'
			);
			await this.word_processor(
				selector_str, "local-pve", 'home.gr.pve'
			);
			await this.word_processor(
				selector_str, "local-pvp", 'home.gr.pvp'
			);
			await this.word_processor(
				selector_str, "local-tour", 'home.gr.tour'
			);

			selector_str = '.category-title';
			await this.word_processor_all(
				selector_str, "lobby", 'home.gr.lobby'
			);
			await this.word_processor_all(
				selector_str, "playing", 'home.gr.playing'
			);
			await this.word_processor_all(
				selector_str, "waiting", 'home.gr.waiting'
			);
			await this.word_processor_all(
				selector_str, "Eliminated", 'home.gr.elim'
			);

			selector_str = '.empty-list';
			await this.word_processor_all(
				selector_str, "(empty)", 'home.gr.empty'
			);

			selector_str = '#btn_leaveRoom';
			await this.word_processor(
				selector_str, "leave room", 'home.gr.leave'
			);
		}
		else if (view === "opvp")
		{
			selector_str = '.ct-gr-announcer-rid';
			await this.word_processor(
				selector_str, "room id", 'home.gr.rid'
			);

			selector_str = '.ct-gr-rl-title';
			await this.word_processor(
				selector_str, "room list", 'home.gr.rl'
			);
		}
		else if (view === "modal-roomjoin")
		{
			selector_str = '#modal-join .modal-title';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdrj.title');

			selector_str = '.join-room-des';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdrj.des');

			selector_str = '#btn_create_room';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdrj.create');

			selector_str = '#btn_close_join_room_modal';
			document.querySelector(selector_str)
				.innerHTML = i18next.t('home.mdrj.back');
		}
	}

	async word_processor(selector, words, source)
	{
		const ctn = document.querySelector(selector);
		if (!ctn)
			return false;
		const line = ctn.innerHTML.toLowerCase();
		const target_words = words.toLowerCase();
		if (!line.includes(target_words))
			return false;
		const replace_words = i18next.t(source);
		const translated = line.replace(target_words, replace_words);

		ctn.innerHTML = translated;

		return true;
	}

	async word_processor_all(selector, words, source)
	{
		const all_ctn = document.querySelectorAll(selector);
		if (!all_ctn)
			return false;
		//const ctn = document.querySelector(selector);
		//const line = ctn.innerHTML.toLowerCase();
		const target_words = words.toLowerCase();
		//if (!line.includes(target_words))
		//	return false;
		const replace_words = i18next.t(source);
		//const translated = line.replace(target_words, replace_words);

		for (const el of all_ctn)
		{
			const line = el.innerHTML.toLowerCase();
			if (!line.includes(target_words))
				continue;
			const translated = line.replace(target_words, replace_words);
			el.innerHTML = translated;
			console.log(el.innerHTML);
		}
	}

	async word_gr_guide_header(selector)
	{
		const ctns = document.querySelectorAll(selector);
		if (!ctns)
			return false;
		const target_words = {
			'left player' : 'home.gr.gm-left',
			'right player' : 'home.gr.gm-right',
			'game goal' : 'home.gr.gm-goal',
			'game objective' : 'home.gr.gm-obj',
			'game system' : 'home.gr.gm-sys',
			'difficulty' : 'home.gr.gm-diff',
			'game rules' : 'home.gr.gm-rules',
		};

		for (const ctn of ctns)
		{
			const line = ctn.innerHTML.toLowerCase();
			for (const key in target_words)
			{
				if (!line.includes(key.toLowerCase()))
					continue;
				const replace_words = i18next.t(target_words[key]);
				const translated = line.replace(key, replace_words);
				ctn.innerHTML = translated;
			}
		}

		return true;
	}

	async word_gr_guide_des(selector)
	{
		const ctns = document.querySelectorAll(selector);
		if (!ctns)
			return false;
		const target_words = {
			'(up)' : 'home.gr.gm-up',
			'(down)' : 'home.gr.gm-down',
			'best of 1' : 'home.gr.gm-bo1',
			'best of one' : 'home.gr.gm-bo1',
			'player' : 'home.gr.gm-player',
			'against' : 'home.gr.gm-against',
			'locally' : 'home.gr.gm-local',
			'match' : 'home.gr.gm-match',
			'will be' : 'home.gr.gm-will',
			'will not be' : 'home.gr.gm-willnot',
			'recorded' : 'home.gr.gm-recorded',
			'random' : 'home.gr.gm-random',
			'hit the ball to the opponent\'s side' : 'home.gr.gm-hit',
			'last standing' : 'home.gr.gm-last',
			'wins' : 'home.gr.gm-wins',
			'every' : 'home.gr.gm-every',
		};

		for (const ctn of ctns)
		{
			const line = ctn.innerHTML.toLowerCase();
			let translated = line;
			for (const key in target_words)
			{
				if (!translated.includes(key.toLowerCase()))
					continue;
				const replace_words = i18next.t(target_words[key]);
				translated = translated.replace(key, replace_words);
			}
			ctn.innerHTML = translated;
		}

		return true;
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
const item = new languageClass();
export default item;
