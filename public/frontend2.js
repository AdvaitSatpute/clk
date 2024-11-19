// public/frontend.js
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu(); // Fetch menu items when the page is loaded
});

// Fetch menu items from the server and display them
async function fetchMenu() {
    try {
        const response = await fetch('/menu');
        const menuItems = await response.json();
        const menuContainer = document.getElementById('menu-container');
        
        // Create and display a card for each menu item
        menuItems.forEach(item => {
            const card = createCard(item);
            menuContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Create an individual card for each menu item
// Create an individual card for each menu item
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    // Define the image URL based on the Item_ID (as you already have the image mapping)
    const imageMap = {
        1: 'https://indianfoodfreak.com/wp-content/uploads/2023/05/IMG_20230521_162825.jpg', // Tea
        2: 'https://media.istockphoto.com/id/1307421122/photo/pouring-black-tea-into-transparent-cup-isolated.jpg?s=612x612&w=0&k=20&c=kVLQvbdwdMgh8mQ_N_XwVZmeLCcY_R0OOb2c-BKw6DY=',
        3: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?cs=srgb&dl=pexels-chevanon-312418.jpg&fm=jpg',
        4: 'https://media.istockphoto.com/id/157528129/photo/mug-on-plate-filled-with-coffee-surrounded-by-coffee-beans.jpg?s=612x612&w=0&k=20&c=W_za-myO9QP_dimiJeZXsR4G2GHjrdo0RTyO3yVhopQ=',
        5: 'https://media.istockphoto.com/id/1374666267/photo/masala-dosa-south-indian-breakfast.jpg?s=612x612&w=0&k=20&c=wHurZpgJCahFgRIVwaSH46l0_NAWFFLRJp3JY5-obqc=',
        6: 'https://amomscookbook.com/wp-content/uploads/2019/07/IMG_9637-1-683x1024.jpg',
        7: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMzyeeI96yDmT-iUjum2Bna_9OU0Cr_A4gBw&s',
        8: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Cappuccino_at_Sightglass_Coffee.jpg/800px-Cappuccino_at_Sightglass_Coffee.jpg',
        9: 'https://www.modernfarmhouseeats.com/wp-content/uploads/2022/01/starbucks-chai-tea-latte-12.jpg',
        10: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeMV-81qiQJkByqhkE4XSD9ZXlxo1MvQwkdw&s',
        11: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBfEt7A9OunRDoDyO3yRYIOo9MLhyDDUxZ3A&s',
        12: 'https://media.istockphoto.com/id/1488738018/photo/medu-vada-or-medu-vada-with-sambhar-and-coconut-chutney-red-chutney-green-chutney-popular.jpg?s=612x612&w=0&k=20&c=dvWgKhQuw1lfOBxDpR6YFMLSZnWdyqYGV1pvcBt7mZw=',
        13: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fluffy_Poori.JPG/640px-Fluffy_Poori.JPG',
        14: 'https://www.cookingcarnival.com/wp-content/uploads/2022/02/Uttapam.webp',
        15: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKrXYiwnExx_c3mQwDddeC30REElIWCZ5Y-A&s',
        16: 'https://www.licious.in/blog/wp-content/uploads/2023/01/Shutterstock_2047827035-1024x683.jpg',
        17: 'https://i0.wp.com/binjalsvegkitchen.com/wp-content/uploads/2017/07/Pav-Bhaji-H2.jpg?fit=600%2C900&ssl=1',
        18: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG6hWpHJzrznWwU369cWpqSOTvIDPSKgi9-w&s',
        19: 'https://www.spicebangla.com/wp-content/uploads/2024/04/chicken-tikka-masala.jpg',
        20: 'https://cdn.zeptonow.com/production///tr:w-600,ar-100-100,pr-true,f-auto,q-80/web/recipes/gulab-jamun.png',
        21: 'https://j6e2i8c9.rocketcdn.me/wp-content/uploads/2017/02/Rasmalai-recipe-01.jpg',
        22: 'https://www.sangeetasweets.com/cdn/shop/products/2_cc32d7ad-8c33-4d72-9f11-1c4f0c593c63.jpg?v=1661168169',
        23: 'https://www.nestleprofessional.in/sites/default/files/2021-08/Badaam-Kheer.jpg',
        24: 'https://img.freepik.com/premium-photo/one-cone-ice-cream-isolated-black-background_250469-8340.jpg',


               // Add more items here...
    };
    
    const itemImageUrl = imageMap[item.Item_ID] || 'https://example.com/images/default.jpg';

    // Create the front side of the card (with image, name, and price)
    const front = document.createElement('div');
    front.className = 'card-front';

    const itemImage = document.createElement('img');
    itemImage.src = itemImageUrl;  
    itemImage.alt = item.Item_Name;
    itemImage.className = 'card-image'; 

    const itemName = document.createElement('h3');
    itemName.textContent = item.Item_Name;

    const itemPrice = document.createElement('p');
    itemPrice.className = 'price';
    itemPrice.textContent = `₹ ${item.Item_Price}`;

    front.appendChild(itemImage);
    front.appendChild(itemName);
    front.appendChild(itemPrice);

    // Create the back side of the card (with detailed info)
    const back = document.createElement('div');
    back.className = 'card-back';

    const itemDescription = document.createElement('p');
    itemDescription.textContent = item.Description;

    const itemType = document.createElement('p');
    itemType.textContent = `Type: ${item.Item_Type}`;

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = 0;
    quantityInput.min = 0;
    quantityInput.id = `quantity-${item.Item_ID}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.onclick = () => addToCart(item, quantityInput);

    back.appendChild(itemDescription);
    back.appendChild(itemType);
    back.appendChild(quantityLabel);
    back.appendChild(quantityInput);
    back.appendChild(addToCartButton);

    // Append both sides of the card to the card container
    card.appendChild(front);
    card.appendChild(back);

    return card;
}



// Add an item to the cart with the selected quantity
function addToCart(item, quantityInput) {
    const quantity = parseInt(quantityInput.value, 10); // Get the quantity from the input field
    if (quantity > 0) { // Only add to the cart if quantity is greater than 0
        cart.push({ ...item, quantity: quantity });
        alert(`${item.Item_Name} (x${quantity}) has been added to your cart!`);
    } else {
        alert('Please select a quantity greater than 0.');
    }
}

// Handle the global place order button click (top-right)
async function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Save the cart data to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirect to the checkout page
    window.location.href = '/checkout';
}

// Create a global "Place Order" button and "Logout" button (top-right of the page)
function createGlobalButtons() {
    const placeOrderButton = document.createElement('button');
    placeOrderButton.textContent = 'Place Order';
    placeOrderButton.className = 'global-place-order';
    placeOrderButton.onclick = placeOrder;

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'global-logout';
    logoutButton.onclick = logout;

    const viewCartButton = document.createElement('button');
    viewCartButton.textContent = 'View Cart';
    viewCartButton.className = 'global-view-cart';
    viewCartButton.onclick = viewCart;

    const viewPreviousOrdersButton = document.createElement('button');
    viewPreviousOrdersButton.textContent = 'View Past Orders';
    viewPreviousOrdersButton.className = 'global-view-previous-orders';
    viewPreviousOrdersButton.onclick = viewPastOrders;

    document.body.appendChild(placeOrderButton);
    document.body.appendChild(logoutButton);
    document.body.appendChild(viewCartButton);
    document.body.appendChild(viewPreviousOrdersButton);
}

// Display the cart in a popup
function viewPastOrders() {
    let orderModal = document.getElementById('order-modal');
    if (!orderModal) {
        orderModal = document.createElement('div');
        orderModal.id = 'order-modal';
        orderModal.className = 'order-modal';

        orderModal.innerHTML = `
            <h2>Past Orders</h2>
            <div class="order-items"></div>
            <button class="close-orders">Close</button>
        `;
        document.body.appendChild(orderModal);

        orderModal.querySelector('.close-orders').addEventListener('click', () => {
            orderModal.style.display = 'none';
        });
    }

    updateOrderItems(orderModal);
    orderModal.style.display = 'block';
}

function updateOrderItems(orderModal) {
    const orderItemsContainer = orderModal.querySelector('.order-items');
    orderItemsContainer.innerHTML = '<p>Loading past orders...</p>';

    fetch('/orders-past')
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('You are not logged in. Please log in to view your orders.');
                }
                throw new Error('Failed to fetch past orders. Server responded with status: ' + response.status);
            }
            return response.json();
        })
        .then(orders => {
            orderItemsContainer.innerHTML = '';
            if (orders.length === 0) {
                orderItemsContainer.innerHTML = '<p>You have no past orders.</p>';
            } else {
                orders.forEach((order, index) => {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item';
                    orderItem.innerHTML = `
                        <h3>Order #${order.Order_ID}</h3>
                        <p>Customer: ${order.Username}
                        Total: ₹ ${parseFloat(order.Total_Ammount).toFixed(2)}
                        Delivery Address: ${order.Address_Name} - ${order.Address}</p>
                    `;
                    orderItemsContainer.appendChild(orderItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching past orders:', error);
            orderItemsContainer.innerHTML = `<p>Error: ${error.message}</p>
                <button onclick="retryFetchOrders()">Retry</button>`;
        });
}

function retryFetchOrders() {
    const orderModal = document.getElementById('order-modal');
    if (orderModal) {
        updateOrderItems(orderModal);
    }
}

// Add this to your existing JavaScript to handle the click event
document.addEventListener('DOMContentLoaded', () => {
    const viewPastOrdersButton = document.getElementById('view-past-orders-button');
    if (viewPastOrdersButton) {
        viewPastOrdersButton.addEventListener('click', viewPastOrders);
    }
});

function viewCart() { let cartModal = document.getElementById('cart-modal'); if (!cartModal) { cartModal = document.createElement('div'); cartModal.id = 'cart-modal'; cartModal.className = 'cart-modal';

    cartModal.innerHTML = `
        <h2>Cart Items</h2>
        <div class="cart-items"></div>
        <button class="clear-cart">Clear Cart</button>
        <button class="close-cart">Close</button>
    `;
    document.body.appendChild(cartModal);

    cartModal.querySelector('.close-cart').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    cartModal.querySelector('.clear-cart').addEventListener('click', clearCart);
}

    updateCartItems(cartModal);
    cartModal.style.display = 'block';
}

function updateCartItems(cartModal) { const cartItemsContainer = cartModal.querySelector('.cart-items'); cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
            <p>${item.Item_Name} (x${item.quantity})</p>
            <p class="price">₹ ${item.Item_Price * item.quantity}</p>
            <label for="remove-quantity-${index}">Remove Quantity:</label>
            <input type="number" id="remove-quantity-${index}" min="1" max="${item.quantity}" value="1">
            <button class="remove-quantity" data-index="${index}">Remove</button>
        `;
            cartItemsContainer.appendChild(cartItem);

            cartItem.querySelector('.remove-quantity').addEventListener('click', () => {
                const removeQuantity = parseInt(document.getElementById(`remove-quantity-${index}`).value, 10);
                removeCartItem(index, removeQuantity, cartModal);
            });
        });
    }
}


function removeCartItem(index, quantityToRemove, cartModal) {
    const item = cart[index];

    if (quantityToRemove >= item.quantity) {
        cart.splice(index, 1);
        alert(`Removed all of ${item.Item_Name} from your cart.`);
    } else {
        item.quantity -= quantityToRemove;
        alert(`Removed ${quantityToRemove} of ${item.Item_Name}. Remaining: ${item.quantity}`);
    }

    updateCartItems(cartModal);
}

function clearCart() {
    if (cart.length === 0) {
        alert('Your cart is already empty.');
        return;
    }

    cart = [];
    alert('Your cart has been cleared.');
    document.getElementById('cart-modal').querySelector('.cart-items').innerHTML = '<p>Your cart is empty.</p>';
}

function logout() {
    cart = [];
    alert("You have been logged out.");
    window.location.href = 'auth.html'; // Redirect to auth.html
}

createGlobalButtons();

function viewAddresses() {
    let addressModal = document.getElementById('address-modal');
    if (!addressModal) {
        addressModal = document.createElement('div');
        addressModal.id = 'address-modal';
        addressModal.className = 'address-modal';

        addressModal.innerHTML = `
            <h2>Your Addresses</h2>
            <div class="address-items"></div>
            <button class="add-address">Add New Address</button>
            <button class="close-addresses">Close</button>
        `;
        document.body.appendChild(addressModal);

        addressModal.querySelector('.close-addresses').addEventListener('click', () => {
            addressModal.style.display = 'none';
        });

        addressModal.querySelector('.add-address').addEventListener('click', () => {
            showAddAddressForm();
        });
    }

    updateAddressItems(addressModal);
    addressModal.style.display = 'block';
}

function updateAddressItems(addressModal) {
    const addressItemsContainer = addressModal.querySelector('.address-items');
    addressItemsContainer.innerHTML = '<p>Loading addresses...</p>';

    fetch('/user-addresses')
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('You are not logged in. Please log in to view your addresses.');
                }
                throw new Error('Failed to fetch addresses. Server responded with status: ' + response.status);
            }
            return response.json();
        })
        .then(addresses => {
            addressItemsContainer.innerHTML = '';
            if (addresses.length === 0) {
                addressItemsContainer.innerHTML = '<p>You have no saved addresses.</p>';
            } else {
                addresses.forEach(address => {
                    const addressItem = document.createElement('div');
                    addressItem.className = 'address-item';
                    addressItem.innerHTML = `
                        <p><strong>${address.Address_Name}:</strong> ${address.Address}</p>
                        <button class="edit-address" data-id="${address.Address_Name}">Edit</button>
                        <button class="delete-address" data-id="${address.Address_Name}">Delete</button>
                    `;
                    addressItemsContainer.appendChild(addressItem);
                });

                // Add event listeners for edit and delete buttons
                addressItemsContainer.querySelectorAll('.edit-address').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const addressName = e.target.getAttribute('data-id');
                        showEditAddressForm(addressName);
                    });
                });

                addressItemsContainer.querySelectorAll('.delete-address').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const addressName = e.target.getAttribute('data-id');
                        deleteAddress(addressName);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching addresses:', error);
            addressItemsContainer.innerHTML = `<p>Error: ${error.message}</p>
                <button onclick="updateAddressItems(document.getElementById('address-modal'))">Retry</button>`;
        });
}

function showAddAddressForm() {
    const formHtml = `
        <h3>Add New Address</h3>
        <form id="add-address-form">
            <div>
                <label for="address-name">Address Name:</label>
                <input type="text" id="address-name" name="address-name" required>
            </div>
            <div>
                <label for="address">Address:</label>
                <textarea id="address" name="address" required></textarea>
            </div>
            <button type="submit">Save Address</button>
        </form>
    `;

    const addressModal = document.getElementById('address-modal');
    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHtml;
    addressModal.appendChild(formContainer);

    document.getElementById('add-address-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addAddress();
    });
}

function addAddress() {
    const addressName = document.getElementById('address-name').value;
    const address = document.getElementById('address').value;

    fetch('/add-address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Address_Name: addressName, Address: address })
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add address');
            return response.json();
        })
        .then(data => {
            alert('Address added successfully');
            updateAddressItems(document.getElementById('address-modal'));
            // Close the add address form
            const formContainer = document.querySelector('#address-modal > div:last-child');
            if (formContainer) {
                formContainer.remove();
            }
        })
        .catch(error => {
            console.error('Error adding address:', error);
            alert('Failed to add address. Please try again.');
        });
}

function updateAddress() {
    const originalAddressName = document.getElementById('original-address-name').value;
    const newAddressName = document.getElementById('edit-address-name').value;
    const newAddress = document.getElementById('edit-address').value;

    fetch(`/update-address/${originalAddressName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Address_Name: newAddressName, Address: newAddress })
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update address');
            return response.json();
        })
        .then(data => {
            alert('Address updated successfully');
            updateAddressItems(document.getElementById('address-modal'));
            // Close the edit address form
            const formContainer = document.querySelector('#address-modal > div:last-child');
            if (formContainer) {
                formContainer.remove();
            }
        })
        .catch(error => {
            console.error('Error updating address:', error);
            alert('Failed to update address. Please try again.');
        });
}

function showEditAddressForm(addressName) {
    fetch(`/get-address/${addressName}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch address details');
            return response.json();
        })
        .then(address => {
            const formHtml = `
                <h3>Edit Address</h3>
                <form id="edit-address-form">
                    <input type="hidden" id="original-address-name" name="original-address-name" value="${addressName}">
                    <div>
                        <label for="edit-address-name">Address Name:</label>
                        <input type="text" id="edit-address-name" name="edit-address-name" value="${address.Address_Name}" required>
                    </div>
                    <div>
                        <label for="edit-address">Address:</label>
                        <textarea id="edit-address" name="edit-address" required>${address.Address}</textarea>
                    </div>
                    <button type="submit">Update Address</button>
                </form>
            `;

            const addressModal = document.getElementById('address-modal');
            const formContainer = document.createElement('div');
            formContainer.innerHTML = formHtml;
            addressModal.appendChild(formContainer);

            document.getElementById('edit-address-form').addEventListener('submit', (e) => {
                e.preventDefault();
                updateAddress();
            });
        })
        .catch(error => {
            console.error('Error fetching address details:', error);
            alert('Failed to load address details. Please try again.');
        });
}


function deleteAddress(addressName) {
    if (confirm(`Are you sure you want to delete the address "${addressName}"?`)) {
        fetch(`/delete-address/${addressName}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete address');
                return response.json();
            })
            .then(data => {
                alert('Address deleted successfully');
                updateAddressItems(document.getElementById('address-modal'));
            })
            .catch(error => {
                console.error('Error deleting address:', error);
                alert('Failed to delete address. Please try again.');
            });
    }
}

// Add this function to create the "View Addresses" button
function createViewAddressesButton() {
    const viewAddressesButton = document.createElement('button');
    viewAddressesButton.textContent = 'Addresses';
    viewAddressesButton.className = 'global-view-addresses';
    viewAddressesButton.onclick = viewAddresses;
    document.body.appendChild(viewAddressesButton);
}

// Call this function after creating other global buttons
createViewAddressesButton();