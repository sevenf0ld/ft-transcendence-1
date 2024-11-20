// file : main.js

// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
import './toolkit/bootstrap.bundle.min.js';
import * as MEDIA from './utils/media.js';
import * as COOKIE from './utils/cookie.js';
import * as FORMVALI from './utils/form-vali.js';
import * as FORGETPASS from './view-forgetpass/template.js';
import * as HOME from './view-home/template.js';
import * as LIVECHAT from './view-livechat/template.js';
import * as LOCALPVE from './view-local-pve/template.js';
import * as LOCALPVP from './view-local-pvp/template.js';
import * as LOCALTOUR from './view-local-tour/template.js';
import * as LOGIN from './view-login/template.js';
import * as PROFILE from './view-profile/template.js';
import * as REGISTER from './view-register/template.js';
import * as REMOPVP from './view-remo-pvp/template.js';
import * as REMOTOUR from './view-remo-tour/template.js';

// -------------------------------------------------- //
// main-function
// -------------------------------------------------- //
async function main()
{
	LOGIN.build();
}

main();
