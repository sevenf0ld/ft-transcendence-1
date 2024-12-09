import { getCSRFToken, showSection } from './utils.js';

export function intResetPasswordSection() {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const loginLink = document.getElementById('reset-password-login-link');

    // resetPasswordForm's event listener
    resetPasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('reset-password-username').value;
        const password = document.getElementById('reset-password-password').value;
        const confirmPassword = document.getElementById('reset-password-confirm-password').value;
        const message = document.getElementById('reset-password-message');

        message.innerText = '';

        try {
            const response = await fetch('/api/accounts/reset-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ username, password, confirmPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                // TODO: Two Factor Authentication if needed
                this.reset();
                showSection('login-section');
            } else {
                if (data.error) {
                    for (const errors of Object.values(data.error)) {
                        message.innerText += `${errors.join(' ')}\n`;
                    }
                } else {
                    message.innerText = 'An error occurred during password reset.';
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
        resetPasswordForm.reset();
        message.innerText = '';
        showSection('login-section');
    });
}
