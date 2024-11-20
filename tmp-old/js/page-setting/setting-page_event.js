/* home-page_event.js
 
/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */


// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import { static_avatar_modal } from './setting-page_core.js'
import { reset_avatar_modal } from './setting-page_core.js'
import { edit_info_scroll_modal } from './setting-page_core.js'
import { language_menu } from './setting-page_core.js'
import { translate_eng } from './setting-page_core.js'
import { translate_chi } from './setting-page_core.js'
import { translate_mly } from './setting-page_core.js'
import { preventInteractionOverlay } from './setting-page_core.js'
// -------------------------------------------------- */
// header
// -------------------------------------------------- */


// -------------------------------------------------- */
// main
// -------------------------------------------------- */

async function edit_avatar_btn()
{
	const editAvatarButton = document.getElementById('editAvatarButton');
	editAvatarButton.addEventListener('click', async function(e)
	{
		console.log('edit_avatar-btn clicked');
		static_avatar_modal();
		return true;
	});

	return true;
}

async function reset_avatar_btn()
{
	const resetAvatarButton = document.getElementById('resetButton');
	resetAvatarButton.addEventListener('click', async function(e)
	{
		console.log('rest_avatar-btn clicked');
		reset_avatar_modal();
		return true;
	});

	return true;
}

async function upload_avatar_inner_btn()
{
	const uploadAvatarButton = document.getElementById('uploadButton');
	uploadAvatarButton.addEventListener('click', async function(e)
	{
		console.log('upload_avatar_inner-btn clicked');
		// upload_avatar();
		return true;
	});

	return true;
}

async function edit_info_btn()
{
	const editInfoButton = document.getElementById('editInfoButton');
	editInfoButton.addEventListener('click', async function(e)
	{
		console.log('edit_info-btn clicked');
		edit_info_scroll_modal();
		return true;
	});
	return true;
}

async function save_changes_btn()
{
	const saveChangesButton = document.getElementById('saveChangesButton');
	saveChangesButton.addEventListener('click', async function(e)
	{
		console.log('save_changes-btn clicked');
		//
		return true;
	});
	return true;
}

async function language_btn()
{
	const languageButton = document.getElementById('languageButton');
	languageButton.addEventListener('click', async function(e)
	{
		console.log('language-btn clicked');
		await language_menu();
		return true;
	});
	return true;
}

async function english_btn()
{
	const englishButton = document.getElementById('englishButton');
	englishButton.addEventListener('click', async function(e)
	{
		console.log('english-btn clicked');
		preventInteractionOverlay('en')
		await translate_eng();
		return true;
	});
	return true;
}

async function chinese_btn()
{
	const chineseButton = document.getElementById('chineseButton');
	chineseButton.addEventListener('click', async function(e)
	{
		console.log('chinese-btn clicked');
		preventInteractionOverlay('zh-CN')
		await translate_chi();
		return true;
	});
	return true;
}

async function malay_btn()
{
	const malayButton = document.getElementById('malayButton');
	malayButton.addEventListener('click', async function(e)
	{
		console.log('malay-btn clicked');
		preventInteractionOverlay('ms');
		await translate_mly();
		return true;
	});
	return true;
}

async function add_friend_inner_btn()
{	
	const addFriendInnerButton = document.getElementById('addFriendInnerButton');
	addFriendInnerButton.addEventListener('click', async function(e)
	{
		console.log('add-friend-inner-btn clicked');
		//
		return true;
	});
	return true;
}

// -------------------------------------------------- */
// footer
// -------------------------------------------------- */

// -------------------------------------------------- */
// export
// -------------------------------------------------- */
export {
    edit_avatar_btn,
	reset_avatar_btn,
	upload_avatar_inner_btn,
    edit_info_btn,
	save_changes_btn,
    language_btn,
	english_btn,
	chinese_btn,
	malay_btn,
	add_friend_inner_btn
};
