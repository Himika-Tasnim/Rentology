async function getWishlist() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('User ID not found. Please ensure you are logged in.');
        }

        const response = await fetch(`http://localhost:5000/api/products/user/${userId}/wishlist`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const wishlist = await response.json();
        console.log('Wishlist:', wishlist); // Inspect the response

        if (!Array.isArray(wishlist)) {
            throw new Error('Unexpected response format. Expected an array.');
        }

        const container = document.getElementById('post-container');
        let postMarkup = '';

        wishlist.forEach(wish => {
            const item = wish.product;
            const imageUrl = `/uploads/${item.image}`;
            

            postMarkup += `
                <div class="data-item">
                    <h4>${item.name}</h4>
                    <p>Address: ${item.address}</p>
                    <p>Price: ${item.price}</p>
                    <p>Availabile Flats: ${item.flat}</p>
                    <p>Square Feet: ${item.sqft} sqft</p>
                    <p>Available From: ${item.availableDate}</p>
                    <p>Payment Type: ${item.paymentType}</p>
                    <img src="${imageUrl}" alt="${item.name}">
                </div>
            `;
        });

        container.innerHTML = postMarkup;

    } catch (error) {
        console.error('Error fetching booked products:', error.message);
    }
}

// Fetch and display wishlist when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', getWishlist);
