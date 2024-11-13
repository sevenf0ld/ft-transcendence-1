// file : login-page_event.js

// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
/* card structure
 * 
 * login-card
 *  ├ title
 *  ├ form-group
 *  │         ├ input-group
 *  │         │  ├ label
 *  │         │  └ input
 *  │         ├ input-group
 *  │         │  ├ label
 *  │         │  └ input
 *  │         ├ forgot-link
 *  │         └ submit-btn
 *  ├ divider
 *  │   └ hr + p + hr
 *  ├ intra-btn
 *  │   ├ intra-btn-logo
 *  │   └ intra-btn-text
 *  └ signup-line
 *      └ span + a 
*/

// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import * as MEDIA from '../modules/media.js';
import * as HOMEPAGE from '../page-home/home_core.js';

// -------------------------------------------------- //
// login/form/
// -------------------------------------------------- //
async function form_forgot(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('forgot-password-link clicked');
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

async function form_submitBtn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('submit-btn clicked');
		event.preventDefault();
        /*=================================================================*/
        const email = document.getElementById('login__input-email').value;
        const password = document.getElementById('login__input-password').value

        try {
            const csrfToken = await getCookie('csrftoken');
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json()
            if (response.ok) {
                console.log('Login successful: %s is authorized', data.user);

                await MEDIA.clear();
                await HOMEPAGE.build();
            } else {
                console.error('Login failed: %s is unauthorized', data.email);
            }
        } catch (error) {
            console.error('Login error occurred:', error);
        }
        /*=================================================================*/
	});

	return true;
}

// -------------------------------------------------- //
// login/intra-btn
// -------------------------------------------------- //
async function intra_btn(obj)
{
	obj.addEventListener('click', async (event) => {
		console.log('intra-btn clicked');
	});

	return true;
}

// -------------------------------------------------- //
// login/sign-up
// -------------------------------------------------- //
async function sign_up_line(signUpLine)
{
	signUpLine.addEventListener('click', async (event) => {
		console.log('signup-btn clicked');
	});

	return true;
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	form_forgot,
	form_submitBtn,
	intra_btn,
	sign_up_line,
};
