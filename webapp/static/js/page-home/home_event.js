/* home-page_event.js
 
/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */
/*
 * media
 *  ├ header
 *  │  └ main-width-container
 *  │       └ logo
 *  ├ main
 *  │  └ main-width-container
 *  │       ├────────────── left-panel
 *  │       │                 ├ profile-pic
 *  │       │                 ├ profile-name
 *  │       │                 ├ separator
 *  │       │                 ├ win-lost-div
 *  │       │                 │  ├ win
 *  │       │                 │  └ lost
 *  │       │                 ├ match-history-btn
 *  │       │                 └ btn-box-btm
 *  │       │                        ├ button-settings
 *  │       │                        └ button-logout
 *  │       ├──  center-panel
 *  │       │    ├ center-panel-top
 *  │       │    │  ├ text-game-mode
 *  │       │    │  └ game-board-div
 *  │       │    │       ├ title-h3
 *  │       │    │       ├ button-div
 *  │       │    │       │  ├ button-pvp
 *  │       │    │       │  ├ button-pve
 *  │       │    │       │  └ button-tnm
 *  │       │    │       ├ title-h3
 *  │       │    │       └ button-div
 *  │       │    │          ├ button-pvp
 *  │       │    │          └ button-tnm
 *  │       │    └ center-panel-bottom
 *  │       │       ├ left-card
 *  │       │       └ right-card
 *  │       │
 *  │       └─────── right-panel
 *  │                   ├ text-friends
 *  │                   ├ friend-container
 *  │                   └ add-friend-btn
 *  └ footer
 *      └ main-width-container
 *           └ p
 */

// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import * as MEDIA from '../modules/media.js';
import * as LOGINPAGE from '../page-login/login_core.js';
import * as GAMEBOARD from '../modules/game-board.js';
import * as LOCAL_PVP from '../page-rooms/local-pvp_core.js';
import * as LOCAL_PVE from '../page-rooms/local-pve_core.js';
import * as LOCAL_TNM from '../page-rooms/local-tnm_core.js';
import * as REMOTE_PVP from '../page-rooms/remote-pvp_core.js';
import * as REMOTE_TNM from '../page-rooms/remote-tnm_core.js';
import { static_setting_modal } from '../page-setting/setting-page_core.js';
import { static_add_friend_modal } from '../page-setting/setting-page_core.js';

// -------------------------------------------------- */
// header
// -------------------------------------------------- */
async function header(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('header clicked');
		return true;
	});
	return true;
}

// -------------------------------------------------- */
// main
// -------------------------------------------------- */
async function history_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('match-history-btn clicked');
		await GAMEBOARD.clear();
		return true;
	});
	return true;
}

async function settings_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('settings-btn clicked');
		static_setting_modal();
		return true;
	});
	return true;
}

/*=================================================================*/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
/*=================================================================*/

async function logout_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('logout-btn clicked');
        /*=================================================================*/
        const csrfToken = await getCookie('csrftoken');
        const response = await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        });

        if (response.ok) {
            console.log('Logout successful')

            await MEDIA.clear();
            await LOGINPAGE.build();
        } else {
            console.error('Logout failed')
        }
        /*=================================================================*/
		return true;
	});
	return true;
}

async function local_pvp_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('local-btn-pvp clicked');
		LOCAL_PVP.build();
		return true;
	});
	return true;
}

async function local_pve_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('local-btn-pve clicked');
		LOCAL_PVE.build();
		return true;
	});
	return true;
}

async function local_tnm_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('local-btn-tnm clicked');
		LOCAL_TNM.build();
		return true;
	});
	return true;
}

async function remote_pvp_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('remote-btn-pvp clicked');
		REMOTE_PVP.build();
		return true;
	});
	return true;
}

async function remote_tnm_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('remote-btn-tnm clicked');
		REMOTE_TNM.build();
		return true;
	});
	return true;
}

async function add_friend_btn(obj)
{
	obj.addEventListener('click', async function(e)
	{
		console.log('add-friend-btn clicked');
		static_add_friend_modal();
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
	header,
	history_btn,
	settings_btn,
	logout_btn,
	local_pvp_btn,
	local_pve_btn,
	local_tnm_btn,
	remote_pvp_btn,
	remote_tnm_btn,
	add_friend_btn
};
