// file : home-page_core.js

/* -------------------------------------------------- */
/* developer notes
/* -------------------------------------------------- */


// -------------------------------------------------- //
// Importing
// -------------------------------------------------- //
// import * as STYLE from '../page-home/home-page_style.js';
// import * as EVENT from '../page-home/home-page_event.js';
import * as EVENT from './setting-page_event.js';

// -------------------------------------------------- //
// /header & /footer
// -------------------------------------------------- //
async function static_setting_modal() {
    // Create modal HTML structure dynamically
    const modalHtml = `
		<div class="modal fade" id="staticSettingBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticSettingBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-sm modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title text-black text-center w-100" id="staticSettingBackdropLabel">Settings</h5>
						<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body d-flex flex-column align-items-center">
						<button type="button" class="btn btn-primary mb-2 w-50" id="editAvatarButton">EDIT_AVATAR</button>
						<button type="button" class="btn btn-primary mb-2 w-50" id="editInfoButton">EDIT_INFO</button>
						<button type="button" class="btn btn-primary w-50" id="languageButton">LANGUAGE</button>
					</div>
				</div>
			</div>
		</div>
    `;

    // Append the modal to the body
    // const body = document.querySelector('body');

    // Append the modal to the media
	const media = document.getElementById('media');
    media.insertAdjacentHTML('beforeend', modalHtml);

    // Show the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('staticSettingBackdrop');
    const modal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
    modal.show();

    // Cleanup the modal from the DOM when it's hidden
    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove(); // Remove modal from the DOM after it's closed
    });

    // Close modal only using the close button
    const closeButton = modalElement.querySelector('.btn-close');
    closeButton.addEventListener('click', function () {
        modal.hide();
    });

	// Attach event listeners for the buttons
	await EVENT.edit_avatar_btn();
	await EVENT.edit_info_btn();
	await EVENT.language_btn();
}

async function static_avatar_modal() {
    // Create modal HTML structure dynamically
    const modalHtml = `
		<div class="modal" id="staticAvatarBackdrop" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticAvatarBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-sm modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title text-black text-center w-100" id="staticAvatarBackdropLabel">Edit Avatar</h5>
						<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
							<label for="formFileSm" class="form-label text-black">File Name</label>
							<input class="form-control form-control-sm" id="formFileSm" type="file">
                            <p style="color: black; text-align: center; margin-top: 20px;font-size: 15px;"> * image should be less than 10MB! </p>
                            <p style="color: black; text-align: center; margin-top: 10px;font-size: 15px;"> * no image found! </p>
                            <p style="color: black; text-align: center; margin-top: 10px;font-size: 15px;"> * oops! erros happend. Retry again! </p>
						</div>
					<div class="modal-body d-flex flex-column align-items-center">
						<button type="button" class="btn btn-primary mb-2 w-50" id="resetButton">RESET</button>
						<button type="button" class="btn btn-primary mb-2 w-50" id="uploadButton">UPLOAD</button>
					</div>
				</div>
			</div>
		</div>
    `;

    // Append the modal to the body
    // const body = document.querySelector('body');

    // Append the modal to the media
	const media = document.getElementById('media');
    media.insertAdjacentHTML('beforeend', modalHtml);

    // Show the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('staticAvatarBackdrop');
    const modal = new bootstrap.Modal(modalElement, { backdrop: false, keyboard: false });
    modal.show();

    // Cleanup the modal from the DOM when it's hidden
    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove(); // Remove modal from the DOM after it's closed
    });

    // Close modal only using the close button
    const closeButton = modalElement.querySelector('.btn-close');
    closeButton.addEventListener('click', function () {
        modal.hide();
    });
	
	// Attach event listeners for the buttons
	await EVENT.reset_avatar_btn();
	await EVENT.upload_avatar_inner_btn();

}

async function reset_avatar_modal() {
	// Find the modal element and the Bootstrap modal instance
	const modalElement = document.getElementById('staticAvatarBackdrop');
	const modal = bootstrap.Modal.getInstance(modalElement); // Get existing modal instance

	// Hide the modal
	modal.hide();

	// Remove the modal from the DOM
	modalElement.remove();

	// Recreate and show the modal again
	static_avatar_modal(); // Call this function to re-create and re-show the modal

}

async function upload_avatar() {
	//logic here
	/* target formFileSm & uploadButton?*/

}

async function edit_info_scroll_modal() {
    // Create modal HTML structure dynamically
    const modalHtml = `
        <div class="modal" id="editUserInfoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editUserInfoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-black text-center w-100" id="editUserInfoModalLabel">Edit User Info</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        <!-- Username Group -->
                        <div class="border p-3 mb-3">
                            <h6 class="text-black">Username</h6>
                            <div class="mb-3 text-black">
                                <label for="currentUsername" class="form-label">Current Username</label>
                                <input type="text" class="form-control" id="currentUsername" placeholder="Enter or leave it blank">
                            </div>
                            <div class="mb-3 text-black">
                                <label for="newUsername" class="form-label">New Username</label>
                                <input type="text" class="form-control" id="newUsername" placeholder="Enter or leave it blank">
                            </div>
                        </div>

                        <!-- Password Group -->
                        <div class="border p-3 mb-3">
                            <h6 class="text-black">Password</h6>
                            <div class="mb-3 text-black">
                                <label for="oldPassword" class="form-label">Old Password</label>
                                <input type="password" class="form-control" id="oldPassword" placeholder="Enter or leave it blank">
                            </div>
                            <div class="mb-3 text-black">
                                <label for="newPassword" class="form-label">New Password</label>
                                <input type="password" class="form-control" id="newPassword" placeholder="Enter or leave it blank">
                            </div>
                            <div class="mb-3 text-black">
                                <label for="confirmPassword" class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" id="confirmPassword" placeholder="Enter or leave it blank">
                            </div>
                        </div>

                        <!-- Email Group -->
                        <div class="border p-3">
                            <h6 class="text-black">Email</h6>
                            <div class="mb-3 text-black">
                                <label for="currentEmail" class="form-label">Current Email</label>
                                <input type="email" class="form-control" id="currentEmail" placeholder="Enter or leave it blank">
                            </div>
                            <div class="mb-3 text-black">
                                <label for="newEmail" class="form-label">New Email</label>
                                <input type="email" class="form-control" id="newEmail" placeholder="Enter or leave it blank">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveChangesButton">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append the modal to the body (or a specific container)
    const media = document.getElementById('media');
    media.insertAdjacentHTML('beforeend', modalHtml);

    // Show the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('editUserInfoModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Cleanup the modal from the DOM when it's hidden
    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove(); // Remove modal from the DOM after it's closed
    });

    // Attach event listeners for the buttons
    await EVENT.save_changes_btn();
}

async function language_menu() {

	// Create modal HTML structure dynamically
    const modalHtml = `
		<div class="modal" id="staticLanguageBackdrop" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticLanguageBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-sm modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title text-black text-center w-100" id="staticLanguageBackdropLabel">Language</h5>
						<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body d-flex flex-column align-items-center">
						<button type="button" class="btn btn-primary mb-2 w-50" id="englishButton">English</button>
						<button type="button" class="btn btn-primary mb-2 w-50" id="chineseButton">Chinese</button>
						<button type="button" class="btn btn-primary w-50" id="malayButton">Malay</button>
					</div>
				</div>
			</div>
			</div>
			`;


    // Append the modal to the media
	const media = document.getElementById('media');
    media.insertAdjacentHTML('beforeend', modalHtml);

    // Show the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('staticLanguageBackdrop');
    const modal = new bootstrap.Modal(modalElement, { backdrop: false, keyboard: false });
    modal.show();

    // Cleanup the modal from the DOM when it's hidden
    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove(); // Remove modal from the DOM after it's closed
    });

    // Close modal only using the close button
    const closeButton = modalElement.querySelector('.btn-close');
    closeButton.addEventListener('click', function () {
        modal.hide();
    });

	//hide the ugly bar
	const translateIframe = document.querySelector('iframe[id=":1.container"]');
    if (translateIframe) {
        translateIframe.style.visibility = 'hidden'; // Hide the iframe if it appears
    }

	// Attach event listeners for the buttons
	await EVENT.english_btn();
	await EVENT.chinese_btn();
	await EVENT.malay_btn();	
}

async function translate_eng() {

    if (document.documentElement.lang === 'en')
        return;
    
    while (document.documentElement.lang !== 'en') 
        {
            // Get the Google Translate dropdown (it is hidden in the page)
            const selectField = document.querySelector('select.goog-te-combo');
            
            if (selectField) {
            // Set the dropdown value to the desired language code
            selectField.value = 'en';
            
            // Manually trigger the 'change' event on the dropdown
            const event = new Event('change');
            selectField.dispatchEvent(event);
            
            console.log(`Language changed to: ${'en'}`);
        } else {
            console.log("Google Translate select field not found.");
        }
        
        //hide the ugly bar
        const translateIframe = document.querySelector('iframe[id=":1.container"]');
        if (translateIframe) {
            translateIframe.style.visibility = 'hidden'; // Hide the iframe if it appears
        }
        
        // Wait for a brief moment before checking again
        await delay(500); // Adjust the delay as necessary
    }

}

async function translate_chi() {
    
    if (document.documentElement.lang === 'zh-CN')
        return;
    
    while (document.documentElement.lang !== 'zh-CN') 
    {
        // Get the Google Translate dropdown (it is hidden in the page)
        const selectField = document.querySelector('select.goog-te-combo');
        
        if (selectField) {
            // Set the dropdown value to the desired language code
            selectField.value = 'zh-CN';
            
            // Manually trigger the 'change' event on the dropdown
            const event = new Event('change');
            selectField.dispatchEvent(event);
            
            console.log(`Language changed to: ${'zh-CN'}`);
        } else {
            console.log("Google Translate select field not found.");
        }
        
        //hide the ugly bar
        const translateIframe = document.querySelector('iframe[id=":1.container"]');
        if (translateIframe) {
            translateIframe.style.visibility = 'hidden'; // Hide the iframe if it appears
        }

        // Wait for a brief moment before checking again
        await delay(500); // Adjust the delay as necessary
    }
}

async function translate_mly() {
    
    if (document.documentElement.lang === 'ms')
        return;
    
    while (document.documentElement.lang !== 'ms') 
        {
        // Get the Google Translate dropdown (it is hidden in the page)
        const selectField = document.querySelector('select.goog-te-combo');
        
        if (selectField) {
            // Set the dropdown value to the desired language code
            selectField.value = 'ms';
            
            // Manually trigger the 'change' event on the dropdown
            const event = new Event('change');
            selectField.dispatchEvent(event);
            
            console.log(`Language changed to: ${'ms'}`);
        } else {
            console.log("Google Translate select field not found.");
        }

        //hide the ugly bar
        const translateIframe = document.querySelector('iframe[id=":1.container"]');
        if (translateIframe) {
            translateIframe.style.visibility = 'hidden'; // Hide the iframe if it appears
        }
        
        // Wait for a brief moment before checking again
        await delay(500); // Adjust the delay as necessary
    } 
}

async function static_add_friend_modal() {
    // Create modal HTML structure dynamically
    const modalHtml = `
		<div class="modal fade" id="staticAddFriendBackdrop" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticAddFriendBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-sm modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title text-black text-center w-100" id="staticAddFriendBackdropLabel">ADD-FRIEND</h5>
						<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
					</div>
                        <div class="modal-body">
                            <label for="friendNameInput" class="form-label text-black">USERNAME</label>
                            <input class="form-control form-control-sm" id="friendNameInput" type="text" placeholder="Enter friend's username">
                            <p style="color: black; text-align: center; margin-top: 20px;font-size: 15px;"> * Hi, username is case-sensitive! </p>
                            <p style="color: black; text-align: center; margin-top: 10px;font-size: 15px;"> * username not found; retry! </p>
                            <p style="color: black; text-align: center; margin-top: 10px;font-size: 15px;"> * you've added them! check! </p>
                        </div>
					<div class="modal-body d-flex flex-column align-items-center">
						<button type="button" class="btn btn-primary mb-2 w-50" id="addFriendInnerButton">ADD</button>
					</div>
				</div>
			</div>
		</div>
    `;

    // Append the modal to the body
    // const body = document.querySelector('body');

    // Append the modal to the media
	const media = document.getElementById('media');
    media.insertAdjacentHTML('beforeend', modalHtml);

    // Show the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('staticAddFriendBackdrop');
    const modal = new bootstrap.Modal(modalElement, { backdrop: false, keyboard: false });
    modal.show();

    // Cleanup the modal from the DOM when it's hidden
    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove(); // Remove modal from the DOM after it's closed
    });

    // Close modal only using the close button
    const closeButton = modalElement.querySelector('.btn-close');
    closeButton.addEventListener('click', function () {
        modal.hide();
    });
	
	// Attach event listeners for the buttons
	await EVENT.add_friend_inner_btn();
    
}
// -------------------------------------------------- //
// others
// -------------------------------------------------- //

//delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//prevent body style top from changing
const observer = new MutationObserver((mutations) => {
    // Loop through all mutations that occurred
    mutations.forEach((mutation) => {
        // Check if the mutation is an attribute change
        if (mutation.type === 'attributes') {
            document.body.style.top= '0px'; // Call the function to maintain top at 0px
        }
    });
});

// Set the observer to watch for attribute changes on the body element
observer.observe(document.body, {
    attributes: true, // Watch for changes to attributes
    childList: false, // Don't watch for changes to child elements
    subtree: false // Don't watch for changes in descendants
});

// Function to prevent interaction when a button is clicked until lang=en
function preventInteractionOverlay(lang) {
    if (document.documentElement.lang === lang) {
        return;
    }
    // Create an overlay to block user interaction
    const overlay = document.createElement('div');
    overlay.id = 'interaction-blocker';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)'; // 0.5 Semi-transparent
    overlay.style.zIndex = '9001'; // High z-index to cover all elements
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.cursor = 'not-allowed';
    document.body.appendChild(overlay);
    
    //------------
    //loading gif
    const loadingGif = document.createElement('img');
    // loadingGif.src = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnQzMGV6cXM5b2g2ZGhxZ3JkNHptNTlpeDM5cnFkampiYnV5cTY3OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7bu3XilJ5BOiSGic/giphy.webp'; // Replace with the path to your loading GIF
    // loadingGif.src = 'https://media3.giphy.com/media/4EFt4UAegpqTy3nVce/giphy.webp?cid=790b7611zmkmla97ec0omh3wme4myr7uepx8iwy34auhigu3&ep=v1_gifs_search&rid=giphy.webp&ct=g';
    loadingGif.src = 'https://media1.giphy.com/media/Ws6T5PN7wHv3cY8xy8/200.webp?cid=790b7611knraenp9ztr8n7y7x4ezc8dqazv3zqxkb3qxj1qu&ep=v1_gifs_search&rid=200.webp&ct=g';
    loadingGif.alt = 'Loading...';
    loadingGif.style.width = '80%'; // Adjust size as needed
    loadingGif.style.height = '80%'; // Adjust size as needed
    
    // Append the loading GIF to the overlay
    overlay.appendChild(loadingGif);
    
    // Append the overlay to the body
    document.body.appendChild(overlay);
    //------------

    // Set a fixed interval to remove the overlay
    setTimeout(function() {
        document.body.removeChild(overlay);
        console.log('Interaction re-enabled after fixed interval.');
    }, 1500); // 1000ms = 1 seconds
    
    // // Start checking periodically for the language change
    // const langChecker = setInterval(function() {
    //     if (document.documentElement.lang === lang) {
    //         // Remove the overlay and stop checking once lang is 'en'
    //         document.body.removeChild(overlay);
    //         clearInterval(langChecker);
    //         console.log("Language is set. Interaction re-enabled.");
    //     }
    // }, 100); // Check every 100ms
}

function executeGoogleTranslate(){
    
	// Check if Google Translate has already been initialized
    if (document.getElementById('google_translate_element')) {
        return; // Exit if it already exists
    }
    
	// Step 1: Create and insert the Google Translate div dynamically
    const googleTranslateDiv = document.createElement('div');
    googleTranslateDiv.id = 'google_translate_element'; // Assign the required ID to the div
    
    // Append the div to the top of the body
    const body = document.querySelector('body');
    body.insertBefore(googleTranslateDiv, body.firstChild);

    // Step 2: Create and insert the Google Translate script dynamically
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    
    // Append the script to the top of the body
    body.insertBefore(script, body.firstChild);

}


// Function to initialize Google Translate without showing the widget
window.googleTranslateElementInit = function () {
	
    
    new google.translate.TranslateElement(
        { pageLanguage: 'en'},
        'google_translate_element'
    );
	
	const translateWidget = document.getElementById('google_translate_element');
	if (translateWidget) {
        translateWidget.style.display = 'none'; // Hide the widget
	}
    
    // Use setInterval to periodically check for the iframe and hide it
    const iframeChecker = setInterval(function() {
        const translateIframe = document.querySelector('iframe[id=":1.container"]');
        if (translateIframe) {
            translateIframe.style.visibility = 'hidden'; // Hide the iframe when it appears
            clearInterval(iframeChecker); // Stop checking once the iframe is hidden
        }
    }, 100); // Check every 100ms (0.1 seconds)

}

executeGoogleTranslate();

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
export { 
	static_setting_modal,
	static_avatar_modal,
	reset_avatar_modal,
	upload_avatar,
    edit_info_scroll_modal,
	language_menu,
	translate_eng,
	translate_chi,
	translate_mly,
	preventInteractionOverlay,
    static_add_friend_modal
};
