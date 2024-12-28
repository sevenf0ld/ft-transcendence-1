// file : PageTitle.js
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
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
class PageTitle
{
	constructor()
	{
		this.title = null;
	}

	async init()
	{
		this.title = null;

		return true;
	}

	async update(title)
	{
		if (!title)
			return false;

		const new_title = "42Pong | " + title;
		document.title = new_title;

		return true;
	}
}

const item = new PageTitle();
export default item;
