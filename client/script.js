async function bookProduct(productId) {
    const token = localStorage.getItem('token'); // Ensure the token is stored and retrieved correctly

    if (!token) {
        alert('No token found, please log in');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/products/book/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const updatedProduct = await response.json();
        
        // Show booking complete message
        alert('Booking successful!');

        // Refresh the list to show updated availability
        getAll();
    } catch (error) {
        console.error('There was a problem with the booking operation:', error);
        alert('Error booking product. Please try again later.');
    }
}

async function addToWishlist(productId) {
    const token = localStorage.getItem('token'); // Ensure the token is stored and retrieved correctly

    if (!token) {
        alert('No token found, please log in');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/products/wish/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const updatedProduct = await response.json();
        
        // Show added to wishlist message
        alert('Added to wishlist successfully!');

        // Refresh the list to show updated availability
        getAll();
    } catch (error) {
        console.error('There was a problem with the adding operation:', error);
        alert('Error adding product. Please try again later.');
    }
}

async function getAll() {
    try {
        const response = await fetch(`http://localhost:5000/api/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json();

        // Filter products that have at least 1 flat available
        const availableProducts = products.filter(item => item.flat >= 1);

        // Reference to the container element
        const container = document.getElementById('post-container');
        let postMarkup = '';

        availableProducts.forEach(item => {
            // Construct the image URL assuming 'item.image' contains the filename
            const imageUrl = `/uploads/${item.image}`;

            // Format the available date
            const formattedDate = new Date(item.availableDate).toLocaleDateString();

            postMarkup += `
                <div class="data-item" style="border: 1px solid #ddd;">
                    <h4>${item.name}</h4>
                    <p>Address: ${item.address}</p>
                    <p>Price: ${item.price}</p>
                    <p>Availabile Flats: ${item.flat}</p>
                    <p>Square Feet: ${item.sqft}</p>
                    <p>Available From: ${formattedDate}</p>
                    <p>Payment Type: ${item.paymentType}</p>
                    <img src="${imageUrl}" alt="${item.name}" class="product-image">
                    <div class="button-container">
                        <button onclick="bookProduct('${item._id}')">Book</button>
                        <button onclick="addToWishlist('${item._id}')">Add To Wishlist</button>
                    </div>
                </div>
            `;
        });

        // Clear existing content and insert new product data markup
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', postMarkup);
        
    } catch (error) {
        console.error('Error fetching products:', error.message || error);
    }
}




// Fetch and display products when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', getAll);



