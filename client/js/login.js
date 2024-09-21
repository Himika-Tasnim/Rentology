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
            localStorage.setItem('userId', data.user._id); // Correctly reference user ID from the response
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
            localStorage.setItem('userId', data.user._id); // Correctly reference user ID from the response
            setTimeout(() => {
                window.location.href = './index.html'; // Redirect to home page
            }, 2000); 
            alert('Login successful!');
            showLogout(); // Update the UI immediately
            window.location.href = './index.html'; // Redirect to home page
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

            alert('Login successful!');
            showLogout(); // Update the UI immediately
            window.location.href = './index.html'; // Redirect to home page
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});


document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    showLogin();
});

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('logout-section').style.display = 'none';
}

function showLogout() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('logout-section').style.display = 'block';
}

if (localStorage.getItem('token')) {
    alert('Already Logged-in!');
    showLogout();
} else {
    showLogin();
}
