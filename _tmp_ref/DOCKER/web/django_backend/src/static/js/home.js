import { getCSRFToken, getFriends, showSection, refreshAccessToken } from './utils.js';

async function fetchMatchHistory(token) {
    return fetch('api/accounts/matches/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}

function showDiv(div) {
    const divs = ['game-mode', 'match-history'];
    divs.forEach((id) => {
        document.getElementById(id).style.display = id === div ? 'block' : 'none';
    })
}

async function addFriend(token, username) {
    return fetch(`/api/accounts/friends/add/${username}/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ username: username }),
    });
}

export function initHomeSection() {
    const matchHistoryButton = document.getElementById('match-history-button');
    const settingsButton = document.getElementById('settings-button');
    const logoutButton = document.getElementById('logout-button');
    const matchContainer = document.getElementById('match-container');
    const closeButton = document.getElementById('close-button');
    const addFriendForm = document.getElementById('add-friend-form');
    const refreshButton = document.getElementById('refresh-button');

    // matchHistoryButton's event listener
    matchHistoryButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const token = localStorage.getItem('accessToken');

        try {
            let response = await fetchMatchHistory(token);
            if (response.status === 401) {
                token = await refreshAccessToken();
                response = await fetchMatchHistory(token);
            }
            const data = await response.json();

            if (response.ok) {
                matchContainer.innerHTML = '';
                data.forEach(match => {
                    const matchDiv = document.createElement('div');
                    matchDiv.classList.add('match');
                    matchDiv.innerHTML = `
                        <p>Match on ${new Date(match.match_date).toLocaleString()} between ${match.player_one} and ${match.player_two}</p>
                        <p>Score: ${match.player_one_score} - ${match.player_two_score}</p>
                    `;
                    matchContainer.appendChild(matchDiv);
                });
            }
        } catch (error) {
            console.error('Error fetching: ', error);
        }

        showDiv('match-history');
    });

    // settingsButton's event listener
    settingsButton.addEventListener('click', function (event) {
        event.preventDefault();
        addFriendForm.reset();
        showSection('settings-section');
    });

    // logoutButton's event listener
    logoutButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const refreshToken = localStorage.getItem('refreshToken');

        try {
            const response = await fetch('/api/accounts/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ refreshToken: refreshToken }),
            });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            addFriendForm.reset();
            showSection('login-section');
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    });

    // closeButton's event listener
    closeButton.addEventListener('click', function (event) {
        event.preventDefault();
        showDiv('game-mode');
    });

    // addFriendForm's event listener
    addFriendForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('add-friend-username').value;
        const message = document.getElementById('add-friend-message');

        message.innerText = '';

        const token = localStorage.getItem('accessToken');

        try {
            let response = await addFriend(token, username);
            if (response.status === 401) {
                token = await refreshAccessToken();
                response = await addFriend(token, username);
            }
            const data = await response.json();

            if (response.ok) {
                message.innerText = data.message;
                getFriends();
                this.reset();
                setTimeout(() => { message.innerText = ''; }, 3000);
            } else {
                if (data.error) {
                    for (const errors of Object.values(data.error)) {
                        message.innerText += `${errors.join(' ')}\n`;
                    }
                } else {
                    console.log('An error occurred during add friend');
                    message.innerText = 'An error occurred during add friend.';
                }
            }
        } catch (error) {
            console.error('Fetch failed:', error);
            message.innerText = 'Network error. Please try again later.';
        }
    });

    refreshButton.addEventListener('click', function (event) {
        event.preventDefault();
        getFriends();
    });
}
