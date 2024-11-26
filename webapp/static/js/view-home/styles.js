// file : styles.js (view-home)
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
async function page_title()
{
	const title = document.querySelector('title');
	title.innerHTML = '42Pong | Home';

	return true;
}

async function header()
{
	const header = document.querySelector(
		'header'
	);

	header.classList.add(
		'd-flex',
		'justify-content-center',
		'align-items-center',
		'w-100',
	);

	const logo = document.querySelector(
		'header #logo'
	);

	logo.classList.add(
		'h1',
		'py-2',
	);

	return true;
}

async function main()
{
	// main
	const main = document.querySelector(
		'main'
	);

	main.classList.add(
		'd-flex',
		'justify-content-center',
		'align-items-center',
	);

	// main's main container
	const container = document.querySelector(
		'.ct-main'
	);

	container.classList.add(
		'p-4',
		'd-flex',
	);

	// all buttons
	const btns = document.querySelectorAll(
		'main button'
	);

	btns.forEach(
		(btn) => {
			btn.classList.add(
				'ct-btn-neau'
			);
		}
	);

	return true;
}

async function main_left_panel()
{
	//left panel
	const left_panel = document.querySelector(
		'.ct-main > .ct-main-lpanel'
	);

	left_panel.classList.add(
		'd-flex',
		'flex-column',
		'align-items-center',
		'w-100',
		'p-2',
	);

	// profile picture
	const pfp = document.querySelector(
		'.ct-lpanel-pfp'
	);

	pfp.setAttribute(
		'src',
		'/static/assets/images/default-pfp.png'
	);

	// username
	const username = document.querySelector(
		'.ct-lpanel-username'
	);
	username.classList.add(
		'h5',
		'truncate',
	);

	// username - hover popup as a tooltip
	const name = username.innerHTML;
	username.setAttribute(
		'title',
		`${name}`
	);

	// stats
	const stats = document.querySelector(
		'.ct-lpanel-stats'
	);

	stats.classList.add(
		'w-100',
		'd-flex',
		'flex-column',
	);

	const stats_mid = document.querySelector(
		'.ct-stats-mid'
	);

	stats_mid.classList.add(
		'd-flex',
		'justify-content-center',
		'align-items-center',
	);

	const stats_mid_container = document.querySelectorAll(
		'.ct-mid-container'
	);

	stats_mid_container.forEach(
		(container) => {
			container.classList.add(
				'h-100',
				'd-flex',
				'flex-column',
				'text-center',
			);
		}
	);

	const stats_bot = document.querySelector(
		'.ct-stats-bot'
	);

	stats_bot.classList.add(
		'd-flex',
	);

	const stats_bot_container = document.querySelectorAll(
		'.ct-bot-left, .ct-bot-right'
	);

	stats_bot_container.forEach(
		(container) => {
			container.classList.add(
				'd-flex',
				'flex-column',
				'text-center',
			);
		}
	);

	//history button
	const btn_history = document.querySelector(
		'#btn_history'
	);

	btn_history.classList.add(
		'w-100',
	);

	// bottom button group
	const btn_group = document.querySelector(
		'.ct-lpanel-btns'
	);

	btn_group.classList.add(
		'd-flex',
		'flex-column',
		'justify-content-end',
		'w-100',
	);

	return true;
}

async function main_midle_panel()
{
	// middle panel
	const main = document.querySelector(
		'.ct-main-mpanel'
	);

	main.classList.add(
		'd-flex',
		'flex-column',
	);

	// top container
	const top_container = document.querySelector(
		'.ct-mpanel-top'
	);

	top_container.classList.add(
		'w-100',
		'd-flex',
		'flex-column',
		'align-items-center',
	);

	// top title
	const top_title = document.querySelector(
		'.ct-mpanel-top > .ct-top-title'
	);

	top_title.classList.add(
		'h3',
		'py-2',
		'text-center',
	);

	// top board
	const home_board = document.querySelector(
		'.ct-mpanel-top > .ct-top-board'
	);

	home_board.classList.add(
	);

	// top board - home element
	const home = document.querySelector(
		'.ct-board-home'
	);

	home.classList.add(
		'h-100',
		'd-flex',
		'flex-column',
		'justify-content-around',
	);

	const home_section = document.querySelectorAll(
		'.ct-board-home > .ct-home-section'
	);

	home_section.forEach(
		(section) => {
			section.classList.add(
				'd-flex',
				'flex-column',
				'justify-content-center',
				'align-items-center',
			);
		}
	);

	const section_btns = document.querySelectorAll(
		'.ct-home-section > .ct-section-btns'
	);

	section_btns.forEach(
		(btns) => {
			btns.classList.add(
				'd-flex',
			);
		}
	);

	// bottom container
	const bot_container = document.querySelector(
		'.ct-mpanel-bottom'
	);

	bot_container.classList.add(
		'd-flex',
		'justify-content-center',
	);

	// bottom container - left
	const bot_left = document.querySelector(
		'.ct-mpanel-bottom > .ct-bottom-left'
	);

	bot_left.classList.add(
		'h-100',
		'd-flex',
		'justify-content-center',
		'align-items-center',
	);

	// bottom container - right
	const bot_right = document.querySelector(
		'.ct-mpanel-bottom > .ct-bottom-right'
	);

	bot_right.classList.add(
		'h-100',
		'd-flex',
		'justify-content-center',
		'align-items-center',
	);

	return true;
}

async function main_right_panel()
{
	const right_panel = document.querySelector(
		'.ct-main > .ct-main-rpanel'
	);

	right_panel.classList.add(
		'd-flex',
		'flex-column',
	);

	const title = document.querySelector(
		'.ct-main-rpanel > .ct-rpanel-title'
	);

	title.classList.add(
		'h3',
		'py-2',
		'text-center',
	);

	const body = document.querySelector(
		'.ct-main-rpanel > .ct-rpanel-list'
	);

	body.classList.add(
		'd-flex',
		'justify-content-center',
		'align-items-center',
	);

	const btn = document.querySelector(
		'#btn_add'
	);

	btn.classList.add(
		'w-100',
	);

	return true;
}

async function footer()
{
	// footer
	const f = document.querySelector(
		'footer'
	);

	f.classList.add(
		'text-center',
		'w-100',
		'd-flex',
		'justify-content-center',
		'align-items-center',
	);

	// the copyrigth text
	const copy = document.querySelector(
		'footer p'
	);

	copy.classList.add(
		'py-3',
	);

	return true;
}

async function build()
{
	await page_title();
	await header();
	await main();
	await main_left_panel();
	await main_midle_panel();
	await main_right_panel();
	await footer();

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
};
