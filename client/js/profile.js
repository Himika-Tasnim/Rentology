document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Signup successful!');
            showLogin();
        } else {
            alert(`Signup failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            showProfile();
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const description = document.getElementById('profile-description').value;
    const password = document.getElementById('profile-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ name, email, description, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            alert(`Profile update failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during profile update:', error);
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    showLogin();
});

async function showProfile() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('profile-name').value = data.name;
            document.getElementById('profile-email').value = data.email;
            document.getElementById('profile-description').value = data.description;
            document.getElementById('auth-forms').style.display = 'none';
            document.getElementById('profile-section').style.display = 'block';
        } else {
            alert(`Failed to fetch profile: ${data.message}`);
            showLogin();
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        showLogin();
    }
}

function showLogin() {
    document.getElementById('auth-forms').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
}

if (localStorage.getItem('token')) {
    showProfile();
} else {
    showLogin();
}
