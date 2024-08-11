async function getAllBookings() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please ensure you are logged in.');
        }

        const response = await fetch(`http://localhost:5000/api/products/user/${userId}/bookings`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const bookings = await response.json();
        console.log('Bookings response:', bookings); // Inspect the response

        if (!Array.isArray(bookings)) {
            throw new Error('Unexpected response format. Expected an array.');
        }

        const container = document.getElementById('post-container');
        let postMarkup = '';

        bookings.forEach(booking => {
            const item = booking.product;
            const imageUrl = `/uploads/${item.image}`;
            const bookingDate = new Date(booking.bookingDate).toLocaleDateString();

            postMarkup += `
                <div class="data-item">
                    <h4>${item.name}</h4>
                    <p>Address: ${item.address}</p>
                    <p>Price: ${item.price}</p>
                    <p>Square Feet: ${item.sqft} sqft</p>
                    <p>Booking Date: ${bookingDate}</p>
                    <img src="${imageUrl}" alt="${item.name}">
                    <div class="button-container">
                        <button onclick="cancelBooking('${booking._id}')">Cancel</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = postMarkup;

    } catch (error) {
        console.error('Error fetching booked products:', error.message);
    }
}

async function cancelBooking(bookingId) {
    try {
        const confirmCancel = confirm('Are you sure you want to cancel this booking?');
        if (!confirmCancel) {
            return; // Exit if the user cancels the confirmation dialog
        }

        const response = await fetch(`http://localhost:5000/api/products/cancel/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            alert('Booking canceled successfully.');
            getAllBookings(); // Refresh the list of bookings
        } else {
            throw new Error(result.message || 'Failed to cancel booking.');
        }
    } catch (error) {
        console.error('Error canceling booking:', error.message);
        alert('An error occurred while canceling the booking. Please try again.');
    }
}

// Fetch and display bookings when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', getAllBookings);
