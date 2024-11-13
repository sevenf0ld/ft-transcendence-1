// file : local-pvp_style.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
// -------------------------------------------------- //
// functions
// -------------------------------------------------- //
async function left_panel(obj)
{
	const main = obj.main_div;
	main.classList.add("d-flex");

	const title = obj.title_h2;
	title.classList.add("h4");
	title.textContent = "INSTRUCTIONS";

	const divider = obj.divider;
	divider.classList.add("separator");

	main.appendChild(title);
	main.appendChild(divider);

	return true;
}

async function game_board(obj)
{
	const main = obj.main_div;

	const msg = obj.wait_msg;
	msg.textContent = "Welcome ! Waiting host to start game..."

	main.appendChild(msg);

	return true;
}

async function right_panel(obj)
{
	const main = obj.main_div;

	const leave_btn = obj.leave_btn;
	leave_btn.classList.add("btn");
	leave_btn.classList.add("w-100");
	leave_btn.classList.add("my-btn-primary");
	leave_btn.textContent = "Leave Game";

	const start_btn = obj.start_btn;
	start_btn.classList.add("btn");
	start_btn.classList.add("w-100");
	start_btn.classList.add("my-btn-primary");
	start_btn.textContent = "Start Game";

	main.appendChild(start_btn);
	main.appendChild(leave_btn);

	return true;
}

async function left_panel_pvp(obj)
{
	return true;
}

async function small_card_pvp(obj)
{
	const main = obj.main_div;

	const n1 = obj.name_p1_h2;
	n1.textContent = "PLAYER-1";

	const vs = obj.name_vs_h2;
	vs.textContent = "VS";

	const n2 = obj.name_p2_h2;
	n2.textContent = "PLAYER-2";

	main.appendChild(n1);
	main.appendChild(vs);
	main.appendChild(n2);

	return true;
}

async function chat_room_pvp(obj)
{
	const main = obj.main_div;
	main.classList.add("d-flex");
	main.classList.add("flex-column");
	main.classList.add("justify-content-start");

	const header = obj.header;
	header.classList.add("chat_room_header");
	header.classList.add("w-100");
	header.classList.add("d-flex");
	header.classList.add("justify-content-start");
	header.classList.add("align-items-start");
	header.classList.add("px-3");

	const title = obj.title;
	title.classList.add("h6");
	title.textContent = "ROOM#LOCAL-PVP";

	header.appendChild(title);

	const body = obj.body;
	body.classList.add("chat_room_body");
	body.classList.add("w-100");
	body.classList.add("d-flex");
	body.classList.add("flex-column");
	body.classList.add("justify-content-start");
	body.classList.add("align-items-start");
	body.classList.add("p-3");

	const default_msg = obj.msg;
	default_msg.textContent = "Announcement : welcome.";

	body.appendChild(default_msg);

	const footer = obj.footer;
	footer.classList.add("chat_room_footer");
	footer.classList.add("border-0");
	footer.classList.add("px-3");
	footer.classList.add("py-2");
	footer.disabled = true;

	main.appendChild(header);
	main.appendChild(body);
	main.appendChild(footer);

	return true;
}

async function players_list_pvp(obj)
{
	const main = obj.main_div;

	const p1_div = obj.p1_box;
	p1_div.classList.add("player-list-div");
	p1_div.classList.add("d-flex");
	p1_div.classList.add("flex-row");
	p1_div.classList.add("p-2");
	p1_div.classList.add("w-100");
	p1_div.classList.add("justify-content-center");
	p1_div.classList.add("align-items-center");
	p1_div.classList.add("truncate");

	const p1_pic = obj.p1_pic;
	p1_pic.classList.add("player-list-pic");
	//import picture
	p1_pic.src = "../../assets/images/default.png";

	const p1_name = obj.p1_name;
	p1_name.classList.add("player-list-name");
	p1_name.textContent = "PLAYER-1";

	const p1_status = obj.p1_status;
	p1_status.classList.add("player-list-status");
	p1_status.classList.add("status-online");

	p1_div.appendChild(p1_pic);
	p1_div.appendChild(p1_name);
	p1_div.appendChild(p1_status);


	const p2_div = obj.p2_box;
	p2_div.classList.add("player-list-div");
	p2_div.classList.add("d-flex");
	p2_div.classList.add("flex-row");
	p2_div.classList.add("d-flex");
	p2_div.classList.add("p-2");
	p2_div.classList.add("w-100");
	p2_div.classList.add("justify-content-center");
	p2_div.classList.add("align-items-center");
	p2_div.classList.add("truncate");

	const p2_pic = obj.p2_pic;
	p2_pic.classList.add("player-list-pic");
	p2_pic.src = "../../assets/images/default.png";

	const p2_name = obj.p2_name;
	p2_name.classList.add("player-list-name");
	p2_name.textContent = "PLAYER-2";

	const p2_status = obj.p2_status;
	p2_status.classList.add("player-list-status");
	p2_status.classList.add("status-online");

	p2_div.appendChild(p2_pic);
	p2_div.appendChild(p2_name);
	p2_div.appendChild(p2_status);

	main.appendChild(p1_div);
	main.appendChild(p2_div);

	return true;
}

// -------------------------------------------------- //
// Export
// -------------------------------------------------- //
export {
	left_panel,
	game_board,
	right_panel,
	left_panel_pvp,
	small_card_pvp,
	chat_room_pvp,
	players_list_pvp,
};

