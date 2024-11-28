// file : styles.js (view-settings)
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
// main-functions
// -------------------------------------------------- //
async function page_title()
{
	const title = document.querySelector('title');
	title.innerHTML = '42Pong | Settings';

	return true;
}

async function main_card()
{
	return true;
}

async function build()
{
	await page_title();
	await main_card();

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
};
