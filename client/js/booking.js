async function getAllBookings() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please ensure you are logged in.');
        }

        const response = await fetch(`http://localhost:5000/api/products/user/${userId}/bookings`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass the token in headers
            }
        });

        const bookings = await response.json();
        console.log('Bookings response:', bookings); // Log the response to inspect the data

        if (!Array.isArray(bookings)) {
            throw new Error('Unexpected response format. Expected an array.');
        }

        const container = document.getElementById('post-container');
        let postMarkup = '';

        console.log('Bookings response:', bookings);
        bookings.forEach(booking => {
            console.log('Booking data:', booking);
            console.log('Product data:', booking.product);
        });

        bookings.forEach(booking => {
            const item = booking.product; 
            if (!item) {
                console.error('No product found for booking:', booking);
                return;
            }
        
            const imageUrl = `/uploads/${item.image}`;
            const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
        
            postMarkup += `
                <div class="data-item" style="border: 1px solid #ddd;">
                    <h4>${item.name}</h4>
                    <p>Address: ${item.address}</p>
                    <p>Price: ${item.price}</p>
                    <p>Square Feet: ${item.sqft} sqft</p>
                    <p>Booking Date: ${bookingDate}</p>
                    <p>Payment Type: ${item.paymentType}</p>
                    <img src="${imageUrl}" alt="${item.name}" class="product-image">
                    <div class="button-container">
                        <button onclick="cancelBooking('${booking._id}')">Cancel</button>
                        <button onclick="suggestPlaces()">Suggest Places</button>
                    </div>
                </div>
            `;
        });
        
        // Clear the container and render the bookings
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', postMarkup);

    } catch (error) {
        console.error('Error fetching booked products:', error.message);
    }
}
