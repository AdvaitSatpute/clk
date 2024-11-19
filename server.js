const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const {router} = require("express/lib/application");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root', // Update as needed
    database: 'ckm', // Update as needed
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const db = mysql.createPool(dbConfig);

// Route for the default page (auth.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Route for signing in
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(
            'SELECT * FROM customer_details WHERE Username = ? AND Password = ?',
            [username, password]
        );
        if (rows.length > 0) {
            req.session.userId = rows[0].Customer_ID; // Store user ID in session
            req.session.user_type = rows[0].Acc_Type;
            res.json({ success: true, message: 'Sign in successful' });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route for signing up
app.post('/signup', async (req, res) => {
    const { username, password, mobile, email } = req.body;
    try {
        await db.query(
            'INSERT INTO customer_details (Username, Password, Mobile_NO, Email_ID) VALUES (?, ?, ?, ?)',
            [username, password, mobile, email]
        );
        res.json({ success: true, message: 'Sign up successful' });
    } catch (error) {
        console.error('Error during sign up:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'Username already exists' });
        } else {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
});

// Route for logging out
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Route to fetch menu items
app.get('/menu', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menu');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

app.get('/inventory', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventory');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching inventory:', err);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

app.post('/menu', async (req, res) => {
    const { Item_Name, Item_Type, Description, Item_Price } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO menu (Item_Name, Item_Type, Description, Item_Price) VALUES (?, ?, ?, ?)',
            [Item_Name, Item_Type, Description, Item_Price]
        );
        res.status(201).json({ id: result.insertId, message: 'Menu item added successfully' });
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).json({ error: 'Failed to add menu item' });
    }
});

app.put('/menu/:id', async (req, res) => {
    const { Item_Name, Item_Type, Description, Item_Price } = req.body;
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE menu SET Item_Name = ?, Item_Type = ?, Description = ?, Item_Price = ? WHERE Item_ID = ?',
            [Item_Name, Item_Type, Description, Item_Price, id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json({ message: 'Menu item updated successfully' });
        }
    } catch (err) {
        console.error('Error updating menu item:', err);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

app.delete('/menu/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM menu WHERE Item_ID = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json({ message: 'Menu item deleted successfully' });
        }
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

// New POST, PUT, and DELETE methods for inventory

app.post('/inventory', async (req, res) => {
    const { Ingredient_Name, Quantity, Ingredient_Cost } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO inventory (Ingredient_Name, Quantity, Ingredient_Cost) VALUES (?, ?, ?)',
            [Ingredient_Name, Quantity, Ingredient_Cost]
        );
        res.status(201).json({ id: result.insertId, message: 'Inventory item added successfully' });
    } catch (err) {
        console.error('Error adding inventory item:', err);
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
});

app.put('/inventory/:id', async (req, res) => {
    const { Quantity } = req.body;
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'UPDATE inventory SET Quantity = ? WHERE Ingredient_ID = ?',
            [Quantity, id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Inventory item not found' });
        } else {
            res.json({ message: 'Inventory item updated successfully' });
        }
    } catch (err) {
        console.error('Error updating inventory item:', err);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});

app.delete('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM inventory WHERE Ingredient_ID = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Inventory item not found' });
        } else {
            res.json({ message: 'Inventory item deleted successfully' });
        }
    } catch (err) {
        console.error('Error deleting inventory item:', err);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.get('/orders-view', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT o.Order_ID, o.Customer_ID, c.Username, o.Total_Ammount, a.Address_Name, a.Address FROM orders o JOIN customer_details c ON o.Customer_ID = c.Customer_ID JOIN cust_address a ON o.Customer_ID = a.Customer_ID AND a.Address_Name = o.Address');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});


app.get('/orders-past', async (req, res) => {
    try {
        // Assuming you have user authentication and the user's ID is stored in the session
        const customerId = req.session.userId;

        if (!customerId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const [rows] = await db.query(
            'SELECT o.Order_ID, o.Customer_ID, c.Username, o.Total_Ammount, a.Address_Name, a.Address ' +
            'FROM orders o ' +
            'JOIN customer_details c ON o.Customer_ID = c.Customer_ID ' +
            'JOIN cust_address a ON o.Customer_ID = a.Customer_ID AND a.Address_Name = o.Address ' +
            'WHERE o.Customer_ID = ?',
            [customerId]
        );

        res.json(rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Route to handle placing an order
app.post('/place-order', async (req, res) => {
    const { cart, address } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'No items in the cart' });
    }

    try {
        // Calculate the total amount for the order
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += item.Item_Price * item.quantity;
        });

        // Insert a new order into the 'orders' table
        const [orderResult] = await db.query(
            'INSERT INTO orders (Customer_ID, Total_Ammount, Address) VALUES (?, ?, ?)',
            [req.session.userId, totalAmount, address]
        );
        const orderId = orderResult.insertId;

        // Insert items into the 'ordered_items' table, including their quantity
        for (let item of cart) {
            await db.query(
                'INSERT INTO ordered_items (Order_ID, Item_ID, Quantity) VALUES (?, ?, ?)',
                [orderId, item.Item_ID, item.quantity]
            );
        }

        res.status(200).json({ message: 'Order placed successfully' });

    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ error: 'Failed to place the order' });
    }
});

// Fetch addresses for the logged-in user
app.get('/user-addresses', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const [rows] = await db.query(
            'SELECT Address_Name, Address FROM cust_address WHERE Customer_ID = ?',
            [req.session.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching addresses:', err);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
});

// Add a new address for the logged-in user
app.post('/add-address', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { Address_Name, Address } = req.body;

    try {
        await db.query(
            'INSERT INTO cust_address (Customer_ID, Address_Name, Address) VALUES (?, ?, ?)',
            [req.session.userId, Address_Name, Address]
        );
        res.status(201).json({ message: 'Address added successfully' });
    } catch (err) {
        console.error('Error adding address:', err);
        res.status(500).json({ error: 'Failed to add address' });
    }
});

// Get a specific address for the logged-in user
app.get('/get-address/:addressName', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { addressName } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT Address_Name, Address FROM cust_address WHERE Customer_ID = ? AND Address_Name = ?',
            [req.session.userId, addressName]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching address:', err);
        res.status(500).json({ error: 'Failed to fetch address' });
    }
});

// Update an address for the logged-in user
app.put('/update-address/:addressName', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { addressName } = req.params;
    const { Address_Name, Address } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE cust_address SET Address_Name = ?, Address = ? WHERE Customer_ID = ? AND Address_Name = ?',
            [Address_Name, Address, req.session.userId, addressName]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json({ message: 'Address updated successfully' });
    } catch (err) {
        console.error('Error updating address:', err);
        res.status(500).json({ error: 'Failed to update address' });
    }
});

// Delete an address for the logged-in user
app.delete('/delete-address/:addressName', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { addressName } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM cust_address WHERE Customer_ID = ? AND Address_Name = ?',
            [req.session.userId, addressName]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        console.error('Error deleting address:', err);
        res.status(500).json({ error: 'Failed to delete address' });
    }
});

// Fetch user addresses
app.get('/user-addresses', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT Address_Name, Address FROM cust_address WHERE Customer_ID = ?',
            [req.session.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching addresses:', err);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
});

// Place an order
app.post('/place-order', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { cart, address } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (Customer_ID, Total_Ammount, Address) VALUES (?, ?, ?)',
            [req.session.userId, calculateTotalAmount(cart), address]
        );
        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of cart) {
            await connection.query(
                'INSERT INTO ordered_items (Order_ID, Item_ID, Quantity) VALUES (?, ?, ?)',
                [orderId, item.Item_ID, item.quantity]
            );
        }

        await connection.commit();
        res.json({ message: 'Order placed successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Error placing order:', err);
        res.status(500).json({ error: 'Failed to place order' });
    } finally {
        connection.release();
    }
});

function calculateTotalAmount(cart) {
    return cart.reduce((total, item) => total + item.Item_Price * item.quantity, 0);
}

// Route to serve the checkout page
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/get-session', (req, res) => {
    if (req.session.userId) {
        res.json({
            userId: req.session.userId,
            user_type: req.session.user_type
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});