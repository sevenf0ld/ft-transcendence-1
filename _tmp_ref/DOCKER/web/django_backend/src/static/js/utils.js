export function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

async function fetchProfile(token) {
    return fetch('/api/accounts/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}

function forceLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    showSection('login-section');
    alert('Your session has expired. Please log in again to continue.');
}

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        forceLogout();
        return;
    }

    try {
        const response = await fetch('/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('accessToken', data.access);
            return data.access;
        } else {
            console.log('Failed to refresh access token');
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

async function getProfile() {
    const token = localStorage.getItem('accessToken');

    try {
        let response = await fetchProfile(token);
        if (response.status === 401) {
            token = await refreshAccessToken();
            response = await fetchProfile(token);
        }
        const data = await response.json();

        if (response.ok) {
            document.getElementById('home-username').textContent = data.username;
            document.getElementById('home-avatar').src = data.avatar;
            document.getElementById('home-wins').textContent = data.wins;
            document.getElementById('home-losses').textContent = data.losses;
        } else {
            console.log('Failed to fetch profile data')
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

export function showSection(section) {
    const sections = ['login-section', 'reset-password-section', 'register-section', 'home-section', 'settings-section'];
    sections.forEach((id) => {
        document.getElementById(id).style.display = id === section ? 'block' : 'none';
    });
}

async function fetchFriends(token) {
    return fetch('/api/accounts/friends/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}

export async function getFriends() {
    const friendListContainer = document.getElementById('friends-list');
    const token = localStorage.getItem('accessToken');

    try {
        let response = await fetchFriends(token);
        if (response.status === 401) {
            token = await refreshAccessToken();
            response = await fetchFriends(token);
        }
        const data = await response.json();

        friendListContainer.innerHTML = '';
        data.forEach(friend => {
            const friendElement = document.createElement('li');
            friendElement.textContent = `${friend.user.username} - ${friend.online_status ? 'Online' : 'Offline'}`;
            friendListContainer.appendChild(friendElement);
        });
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

export function showHomeSection() {
    getProfile();
    getFriends();
    showSection('home-section');
}
