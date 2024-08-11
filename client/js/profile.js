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

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Check if the token is correctly retrieved

    if (token) {
        showProfile();
    } else {
        alert('Please Login first');
        window.location.href = '../view/login.html'; // Ensure this path is correct
    }
});

function showProfile() {
    document.getElementById('profile-section').style.display = 'block';
}

