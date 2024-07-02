// const productForm = document.getElementById("productForm")
// productForm.addEventListener('submit', async function(event) {
//   event.preventDefault(); 
  
//   const form = event.target;
//   const formData = new FormData(form);
//   const productData = {
//     name: formData.get('name'),
//     price: formData.get('price'),
//     flat: formData.get('flat'),
//     sqft: formData.get('sqft')
//   };
  
//   try {
//     const response = await fetch('http://localhost:5000/api/products', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(productData)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const responseElement = document.getElementById('response');
//     responseElement.textContent = 'Product created successfully! Redirecting...';

//     setTimeout(() => {
//       window.location.href = '../index.html'
//     }, 1500); 

//   } catch (error) {
//     document.getElementById('response').textContent = 'Error: ' + error.message;
//   }
// });



function getAll() {
    fetch('http://localhost:5000/api/products')
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Unable to fetch products');
            }
            return res.json();
        })
        .then(parsedRes => {
            // Filter products with flat >= 1
            const availableProducts = parsedRes.filter(item => item.flat >= 1);

            const container = document.getElementById('post-container');
            let postMarkup = '';

            availableProducts.forEach(item => {
                // Construct the image URL assuming 'item.image' contains the filename
                const imageUrl = `/uploads/${item.image}`
                postMarkup += `
                    <div class="data-item" style="border: 1px solid #ddd;">
                        <h4>Name: ${item.name}</h4>
                        <p>Address: ${item.address}</p>
                        <p>Price: ${item.price}</p>
                        <p>Availability: ${item.flat}</p>
                        <p>Square Feet: ${item.sqft}</p>
                        <p>Description: ${item.description}</p>
                        <img src="${imageUrl}" alt="${item.name}" class="product-image">
                        <button onclick="bookProduct('${item._id}')" 
                        style="background-color: #4CAF50; /* Green */
                        width: 20%;
                        padding: 10px;
                        border: none;
                        border-radius: 5px;
                        background-color: #007bff;
                        color: #fff;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: 10px;
                        margin-left: 40% ;
                        cursor: pointer;">Book</button>
                    </div>
                `;
            });

            // CLEANING EXISTING PRODUCT HTML NODE/ELEMENT
            container.innerHTML = '';

            // Adding new product data markup
            container.insertAdjacentHTML('beforeend', postMarkup);
        })
        .catch(err => {
            console.error('Error fetching products:', err);
            alert('Error fetching products. Please try again later.');
        });
}

async function bookProduct(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
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

  