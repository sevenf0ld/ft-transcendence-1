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
		'.custom-body-card'
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
				'custom-btn-neau'
			);
		}
	);

	return true;
}

async function main_left_panel()
{
	//left panel
	const left_panel = document.querySelector(
		'main #left-panel'
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
		'.custom-pfp'
	);

	pfp.setAttribute(
		'src',
		'/static/assets/images/default-pfp.png'
	);

	// username
	const username = document.querySelector(
		'.custom-username'
	);
	username.classList.add(
		'h5',
		'truncate',
	);
	//hover popup as a tooltip
	const name = username.innerHTML;
	username.setAttribute(
		'title',
		`${name}`
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
		'#left-panel .custom-btn-group'
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
		'main #middle-panel'
	);

	main.classList.add(
		'd-flex',
		'flex-column',
	);

	// top container
	const top_container = document.querySelector(
		'#middle-panel #mid-panel-top'
	);

	top_container.classList.add(
		'w-100',
		'd-flex',
		'flex-column',
		'align-items-center',
	);

	const top_title = document.querySelector(
		'#mid-panel-top #board-title'
	);

	top_title.classList.add(
		'h3',
		'py-2',
		'text-center',
	);

	// top container > custom-board-home
	const home_board = document.querySelector(
		'#mid-panel-top .custom-board-home'
	);

	home_board.classList.add(
		'w-100',
		'h-100',
		'd-flex',
	);

	const home_board_left = document.querySelector(
		'#mid-panel-top .board-home-left'
	);

	home_board_left.classList.add(
		'd-flex',
		'flex-column',
		'justify-content-center',
	);

	const dis_group = document.querySelectorAll(
		'.custom-dis-group'
	);

	dis_group.forEach(
		(group) => {
			group.classList.add(
				'd-flex',
				'flex-column',
			);
		}
	);

	const home_board_right = document.querySelector(
		'#mid-panel-top .board-home-right'
	);

	home_board_right.classList.add(
		'd-flex',
		'flex-column',
		'justify-content-center',
		'align-items-center',
	);

	const home_board_right_img = document.querySelector(
		'#mid-panel-top .board-home-right img'
	);

	home_board_right_img.setAttribute(
		'src',
		'/static/assets/images/home-board.gif'
	);

	// bottom container
	const bot_container = document.querySelector(
		'#middle-panel #mid-panel-bot'
	);

	bot_container.classList.add(
		'd-flex',
		'justify-content-center',
	);

	const bot_left = document.querySelector(
		'#mid-panel-bot .custom-bottom-left'
	);

	bot_left.classList.add(
		'h-100',
	);

	const bot_right = document.querySelector(
		'#mid-panel-bot .custom-bottom-right'
	);

	bot_right.classList.add(
		'h-100',
	);

}

async function footer()
{
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

	const copy = document.querySelector(
		'footer #copy'
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
	await footer();

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
};
