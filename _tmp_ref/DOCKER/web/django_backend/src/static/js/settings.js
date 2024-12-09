import { showHomeSection } from './utils.js';

async function updateProfile(token, formData) {
    return fetch('/api/accounts/profile/', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
}

export function initSettingsSection() {
    const settingsForm = document.getElementById('settings-form');
    const message = document.getElementById('settings-message');
    const homeLink = document.getElementById('settings-home-link');

    // settingsForm's event listener
    settingsForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('settings-username').value;
        const email = document.getElementById('settings-email').value;
        const password = document.getElementById('settings-password').value;
        const confirmPassword = document.getElementById('settings-confirm-password').value;
        const avatar = document.getElementById('settings-avatar').files[0];

        message.innerText = '';

        const token = localStorage.getItem('accessToken')
        const formData = new FormData();

        if (username) formData.append('username', username);
        if (email) formData.append('email', email);
        if (password) formData.append('password', password);
        if (confirmPassword) formData.append('confirmPassword', confirmPassword);
        if (avatar) formData.append('avatar', avatar);

        if ([...formData.entries()].length) {
            try {
                let response = await updateProfile(token, formData);
                if (response.status === 401) {
                    token = await refreshAccessToken();
                    response = await updateProfile(token, formData);
                }
                const data = await response.json();

                if (response.ok) {
                    message.innerText = data.message;
                    this.reset();
                    setTimeout(() => { message.innerText = ''; }, 3000);
                } else {
                    if (data.error) {
                        for (const errors of Object.values(data.error)) {
                            message.innerText += `${errors.join(' ')}\n`;
                        }
                    } else {
                        message.innerText = 'An error occurred during profile update.';
                    }
                }
            } catch (error) {
                console.error('Fetch failed:', error);
                message.innerText = 'Network error. Please try again later.';
            }
        }
    });

    // homeLink's event listener
    homeLink.addEventListener('click', function (event) {
        event.preventDefault();
        settingsForm.reset();
        message.innerText = '';
        showHomeSection();
    });
}
