import { getCSRFToken, showHomeSection, showSection } from './utils.js';

export function initLoginSection() {
    const loginForm = document.getElementById('login-form');
    const message = document.getElementById('login-message');
    const resetPasswordLink = document.getElementById('reset-password-link');
    const registerLink = document.getElementById('register-link');

    // loginForm's event listener
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        message.innerText = '';

        try {
            const response = await fetch('/api/accounts/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
                this.reset();
                showHomeSection();
            } else {
                if (data.error) {
                    for (const errors of Object.values(data.error)) {
                        message.innerText += `${errors.join(' ')}\n`;
                    }
                } else {
                    message.innerText = 'An error occurred during login.';
                }
            }
        } catch (error) {
            console.error('Fetch failed:', error);
            message.innerText = 'Network error. Please try again later.';
        }
    });

    // resetPasswordLink's event listener
    resetPasswordLink.addEventListener('click', function (event) {
        event.preventDefault();
        loginForm.reset();
        message.innerText = '';
        showSection('reset-password-section');
    });

    // registerLink's event listener
    registerLink.addEventListener('click', function (event) {
        event.preventDefault();
        loginForm.reset();
        message.innerText = '';
        showSection('register-section');
    });
}
