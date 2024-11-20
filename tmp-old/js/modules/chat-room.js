// file : chat-room.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
// -------------------------------------------------- //
// modules
// -------------------------------------------------- //
async function clear()
{
	const chat_room = document.getElementById('chat_room');

	while (chat_room.firstChild)
		chat_room.removeChild(chat_room.firstChild);

	return true;
}

async function home()
{
	const placeholder_p = document.createElement('p');

	const re_obj =
	{
		placeholder_p: placeholder_p
	};
	return re_obj;
}

async function wait_room()
{
	return true;
}

async function local_pvp()
{
	const main_div = document.getElementById("chat_room");
	const header = document.createElement("div");
	const title = document.createElement("h2");
	const body = document.createElement("div");
	const msg = document.createElement("p");
	const footer = document.createElement("input");

	const re_obj =
	{
		main_div: main_div,
		header: header,
		title: title,
		body: body,
		msg: msg,
		footer: footer
	};

	return re_obj;
}

async function local_pve()
{
	const main_div = document.getElementById("chat_room");
	const header = document.createElement("div");
	const title = document.createElement("h2");
	const body = document.createElement("div");
	const msg = document.createElement("p");
	const footer = document.createElement("input");

	const re_obj =
	{
		main_div: main_div,
		header: header,
		title: title,
		body: body,
		msg: msg,
		footer: footer
	};

	return re_obj;
}


// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	clear,
	home,
	wait_room,
	local_pvp,
	local_pve
};
