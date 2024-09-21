// Schedule Meeting button click event
document.getElementById('scheduleMeetingButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const userId = localStorage.getItem('userId');

        if (response.ok) {
            document.getElementById('host-name').value = data.name;
            document.getElementById('host-email').value = data.email;

            document.getElementById('profile-section').style.display = 'none';
            document.getElementById('meeting-section').style.display = 'block';
        } else {
            alert(`Failed to fetch user data: ${data.message}`);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

document.getElementById('cancelMeeting').addEventListener('click', () => {
    document.getElementById('meeting-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
});

document.getElementById('meetingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('meeting-date').value;
    const time = document.getElementById('meeting-time').value;
    const meetLink = document.getElementById('meeting-link').value;
    const hostName = document.getElementById('host-name').value;
    const hostEmail = document.getElementById('host-email').value;
    const inviteeEmail = document.getElementById('invitee-email').value;

    try {
        const response = await fetch('/api/meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ date, time, meetLink, hostName, hostEmail, email: inviteeEmail }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Meeting invitation sent successfully.');
            document.getElementById('meeting-section').style.display = 'none';
            document.getElementById('profile-section').style.display = 'block';
        } else {
            alert(`Failed to send meeting invitation: ${data.message}`);
        }
    } catch (error) {
        console.error('Error sending meeting invitation:', error);
    }
});