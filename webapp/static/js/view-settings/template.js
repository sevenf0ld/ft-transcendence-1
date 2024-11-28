// file : template.js (view-settings)
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
import * as EVENTS from './events.js';
import * as STYLES from './styles.js';
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
async function build()
{
	const main = document.querySelector(
		'#media'
	);

	const template = `
	<div
		class="modal modal-sm"
		id="modal-settings"
		tabindex="-1"
		aria-hidden="true"
	>
	  <div class="
	  	modal-dialog
		modal-dialog-centered
		modal-dialog-scrollable
	  ">
		<div class="modal-content">
		  <div class="modal-header">
			<h1 class="modal-title text-center w-100">Settings</h1>
		  </div>
		  <div class="modal-body">
		  	<button id="btn-lang">Language</button>
			<button id="btn-acc">Account</button>
			<button id="btn-pfp">Profile Picture</button>
		  </div>
		  <div class="modal-footer"></div>
		</div>
	  </div>
	</div>
	`;

	//append to last child
	main.insertAdjacentHTML('beforeend', template);
	await STYLES.build();
	await EVENTS.build();

	return true;
}
// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export {
	build,
};
