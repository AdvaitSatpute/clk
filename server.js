const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cloud_kitchen',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(
            'SELECT * FROM customer_details WHERE Username = ? AND Password = ?',
            [username, password]
        );
        if (rows.length > 0) {
            res.json({ success: true, message: 'Sign in successful' });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

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

app.post('/logout', (req, res) => {
    // In a real-world application, you would handle session termination here
    res.json({ success: true, message: 'Logged out successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});