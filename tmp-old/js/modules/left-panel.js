// file : left-panel.js

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
	const LEFT_PANEL = document.getElementById("left-panel");

	return new Promise((resolve, reject) => {
		if ( LEFT_PANEL )
		{
			while (LEFT_PANEL.firstChild)
				LEFT_PANEL.removeChild(LEFT_PANEL.firstChild);
			resolve(true);
		}
		else
			reject("left panel not found");
	});
}

async function home()
{
	const main_div = document.createElement("div");
	const profile_pic = document.createElement("div");
	const profile_name = document.createElement("h2");
	const separator = document.createElement("div");
	const win_lost_div = document.createElement("div");
	const win_stat = document.createElement("p");
	const lost_stat = document.createElement("p");
	const history_btn = document.createElement("button");
	const btn_box_btm = document.createElement("div");
	const settings_btn = document.createElement("button");
	const logout_btn = document.createElement("button");

	const re_obj =	
	{
		main_div: main_div,
		profile_pic: profile_pic,
		profile_name: profile_name,
		separator: separator,
		win_lost_div: win_lost_div,
		win_stat: win_stat,
		lost_stat: lost_stat,
		history_btn: history_btn,
		btn_box_btm: btn_box_btm,
		settings_btn: settings_btn,
		logout_btn: logout_btn
	};

	return re_obj;
}

async function wait_room()
{
	const main_div = document.getElementById("left-panel");
	const title_h2 = document.createElement("h2");
	const divider = document.createElement("div");

	const re_obj =
	{
		main_div: main_div,
		title_h2: title_h2,
		divider: divider
	};

	return re_obj;
}

async function local_pvp()
{
	const re_obj =
	{
	};

	return re_obj;
}

async function local_pve()
{
	const re_obj =
	{
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
