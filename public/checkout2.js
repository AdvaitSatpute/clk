document.addEventListener('DOMContentLoaded', () => {
    const cartSummary = document.getElementById('cart-summary');
    const checkoutForm = document.getElementById('checkout-form');
    const addressSelect = document.getElementById('address');

    // Fetch addresses from the server
    async function fetchAddresses() {
        try {
            const response = await fetch('/user-addresses');
            if (!response.ok) {
                throw new Error('Failed to fetch addresses');
            }
            const addresses = await response.json();
            addressSelect.innerHTML = '<option value="" disabled selected>Select your address</option>';
            addresses.forEach(address => {
                const option = document.createElement('option');
                option.value = address.Address_Name;
                option.textContent = `${address.Address_Name}: ${address.Address}`;
                addressSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching addresses:', error);
            addressSelect.innerHTML = '<option value="" disabled selected>Error loading addresses</option>';
        }
    }

    fetchAddresses();

    // Retrieve the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartSummary.innerHTML = '<p>Your cart is empty.</p>';
        checkoutForm.style.display = 'none';
        return;
    }

    // Display cart summary
    let totalAmount = 0;
    cart.forEach(item => {
        const itemRow = document.createElement('p');
        itemRow.textContent = `${item.Item_Name} (x${item.quantity}) - ₹${item.Item_Price * item.quantity}`;
        cartSummary.appendChild(itemRow);
        totalAmount += item.Item_Price * item.quantity;
    });

    const totalRow = document.createElement('p');
    totalRow.textContent = `Total Amount: ₹${totalAmount}`;
    cartSummary.appendChild(totalRow);

    // Handle form submission
    checkoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const address = addressSelect.value;

        if (!address) {
            alert('Please select a delivery address.');
            return;
        }

        try {
            const response = await fetch('/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart, address }),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const result = await response.json();
            alert('Order placed successfully!');
            localStorage.removeItem('cart'); // Clear the cart
            window.location.href = '/menu.html'; // Redirect to the main page
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place the order. Please try again later.');
        }
    });
});