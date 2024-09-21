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
function scheduleMeeting(ownerEmail) {
    // Redirect to the schedule meeting page with the owner's email as a query parameter
    window.location.href = `../view/scheduleMeeting.html?ownerEmail=${encodeURIComponent(ownerEmail)}`;
}

async function getAll(searchQuery = '') {
    try {
        const response = await fetch(`http://localhost:5000/api/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json();

        // Log the products to see what you receive
        console.log('Products received:', products);

        // Ensure products is an array
        if (!Array.isArray(products)) {
            throw new Error('Expected an array of products');
        }

        // Filter products that have at least 1 flat available
        let availableProducts = products.filter(item => item.flat >= 1);

        // Apply search filter if there's a search query
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            availableProducts = availableProducts.filter(item =>
                item.name.toLowerCase().includes(lowerCaseQuery) ||
                item.address.toLowerCase().includes(lowerCaseQuery)
            );
        }

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
                    <p>Available Flats: ${item.flat}</p>
                    <p>Square Feet: ${item.sqft}</p>
                    <p>Available From: ${formattedDate}</p>
                    <p>Payment Type: ${item.paymentType}</p>
                    <img src="${imageUrl}" alt="${item.name}" class="product-image">
                    <div class="button-container">
                        <button onclick="addToWishlist('${item._id}')">Add To Wishlist</button>
                        <button onclick="bookProduct('${item._id}')">Book</button>
                        <button onclick="scheduleMeeting('${item.owner}')">Schedule Meeting</button>
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
document.addEventListener('DOMContentLoaded', () => getAll());

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const searchQuery = document.getElementById('searchInput').value;
    getAll(searchQuery); // Fetch data with the search term
});


