// file : players-list.js

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
	const right_panel_list = document.getElementById('right_panel_list');
	
	while (right_panel_list.firstChild)
		right_panel_list.removeChild(right_panel_list.firstChild);

	return true;
}

async function home()
{
	const placeholder = document.createElement('p');

	const re_obj =
	{
		placeholder: placeholder
	};

	return re_obj;
}

async function wait_room()
{
	return true;
}

async function local_pvp()
{
	const main_div = document.getElementById('right_panel_list');
	const p1_box = document.createElement("div");
	const p1_pic = document.createElement("img");
	const p1_name = document.createElement("p");
	const p1_status = document.createElement("span");

	const p2_box = document.createElement("div");
	const p2_pic = document.createElement("img");
	const p2_name = document.createElement("p");
	const p2_status = document.createElement("span");

	const re_obj =
	{
		main_div,
		p1_box,
		p1_name,
		p1_pic,
		p1_status,
		p2_box,
		p2_name,
		p2_pic,
		p2_status
	};

	return re_obj;
}

async function local_pve()
{
	const main_div = document.getElementById('right_panel_list');
	const p1_box = document.createElement("div");
	const p1_pic = document.createElement("img");
	const p1_name = document.createElement("p");
	const p1_status = document.createElement("span");

	const p2_box = document.createElement("div");
	const p2_pic = document.createElement("img");
	const p2_name = document.createElement("p");
	const p2_status = document.createElement("span");

	const re_obj =
	{
		main_div,
		p1_box,
		p1_name,
		p1_pic,
		p1_status,
		p2_box,
		p2_name,
		p2_pic,
		p2_status
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
