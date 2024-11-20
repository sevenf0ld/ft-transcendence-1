// file : main.js

// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import './toolkit/bootstrap.bundle.min.js';
import * as MEDIA from './modules/media.js';
import * as LOGINPAGE from './page-login/login_core.js';

// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
async function main()
{
	await MEDIA.build();
	await LOGINPAGE.build();
}

main();
