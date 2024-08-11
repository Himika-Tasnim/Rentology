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
            window.location.href = './login.html';
        } else {
            alert(`Signup failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});



function showSignUp() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('logout-section').style.display = 'none';
   
}

function showLogout() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('logout-section').style.display = 'block';
}

if (localStorage.getItem('token')) {
    alert('Already Logged-in!');
    showLogout()
} else {
    showSignUp()
}

