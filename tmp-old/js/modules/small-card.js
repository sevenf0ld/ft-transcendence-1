// file : small-card.js

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
	const small_card = document.getElementById('small_card');

	while (small_card.firstChild)
		small_card.removeChild(small_card.firstChild);

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
	const main_div = document.getElementById("small_card");
	const name_p1_h2 = document.createElement("h2");
	const name_vs_h2 = document.createElement("h2");
	const name_p2_h2 = document.createElement("h2");

	const re_obj =
	{
		main_div : main_div,
		name_p1_h2 : name_p1_h2,
		name_vs_h2 : name_vs_h2,
		name_p2_h2 : name_p2_h2,
	};

	return re_obj;
}

async function local_pve()
{
	const main_div = document.getElementById("small_card");
	const name_p1_h2 = document.createElement("h2");
	const name_vs_h2 = document.createElement("h2");
	const name_p2_h2 = document.createElement("h2");

	const re_obj =
	{
		main_div : main_div,
		name_p1_h2 : name_p1_h2,
		name_vs_h2 : name_vs_h2,
		name_p2_h2 : name_p2_h2,
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
