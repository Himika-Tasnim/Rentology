document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Check if the token is correctly retrieved

    if (token) {
        // Show profile section if the user is logged in
        document.getElementById('profile-section').style.display = 'block';
        await fetchProfileData(token);
    } else {
        // Redirect to login page if not authenticated
        alert('Please Login first');
        window.location.href = '../view/login.html'; // Ensure this path is correct
    }
});

// Function to fetch and display profile data
async function fetchProfileData(token) {
    try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const profileData = await response.json();

            // Populate the form fields with the retrieved profile data
            document.getElementById('profile-name').value = profileData.name || '';
            document.getElementById('profile-email').value = profileData.email || '';
            document.getElementById('profile-description').value = profileData.description || '';
        } else {
            const errorData = await response.json();
            console.error('Error fetching profile data:', errorData.message);
            alert(`Error fetching profile: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error fetching profile data:', error);
        alert('Failed to fetch profile data. Please try again later.');
    }
}

// Handle form submission to update the profile
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
        alert('Error updating profile. Please try again later.');
    }
});
