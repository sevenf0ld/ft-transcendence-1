import { getCSRFToken, showSection } from './utils.js';

export function initRegisterSection() {
    const registerForm = document.getElementById('register-form');
    const message = document.getElementById('register-message');
    const loginLink = document.getElementById('register-login-link');

    // registerForm's event listener
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        message.innerText = '';

        try {
            const response = await fetch('/api/accounts/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ username, email, password, confirmPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                // TODO: Implement Two Factor Authentication before returning back to login section
                this.reset();
                showSection('login-section');
            } else {
                if (data.error) {
                    for (const errors of Object.values(data.error)) {
                        message.innerText += `${errors.join(' ')}\n`;
                    }
                } else {
                    message.innerText = 'An error occurred during user register.';
                }
            }
        } catch (error) {
            console.error('Fetch failed:', error);
            message.innerText = 'Network error. Please try again later.';
        }
    });

    // loginLink's event listener
    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        registerForm.reset();
        message.innerText = '';
        showSection('login-section');
    });
}
