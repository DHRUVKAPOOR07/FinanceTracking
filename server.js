const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'financetracking'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO Users (username, password_hash, email) VALUES (?, ?, ?)';
        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) throw err;
            res.send('User registered...');
        });
    } catch (error) {
        res.status(500).send('Error registering user...');
    }
});

// Create a new account for a user
app.post('/add-account', (req, res) => {
    const { user_id, account_name, account_type, balance } = req.body;
    // Check if the user exists
    const checkUserSql = 'SELECT * FROM Users WHERE user_id = ?';
    db.query(checkUserSql, [user_id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(400).send('User does not exist.');
        } else {
            const sql = 'INSERT INTO Accounts (user_id, account_name, account_type, balance) VALUES (?, ?, ?, ?)';
            db.query(sql, [user_id, account_name, account_type, balance], (err, result) => {
                if (err) throw err;
                res.send('Account added...');
            });
        }
    });
});

// Create a new category for a user
app.post('/add-category', (req, res) => {
    const { user_id, category_name, category_type } = req.body;
    const sql = 'INSERT INTO Categories (user_id, category_name, category_type) VALUES (?, ?, ?)';
    db.query(sql, [user_id, category_name, category_type], (err, result) => {
        if (err) throw err;
        res.send('Category added...');
    });
});

// Create a new transaction for a user
app.post('/add-transaction', (req, res) => {
    const { user_id, account_id, category_id, amount, transaction_date, description } = req.body;
    const sql = 'INSERT INTO Transactions (user_id, account_id, category_id, amount, transaction_date, description) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [user_id, account_id, category_id, amount, transaction_date, description], (err, result) => {
        if (err) throw err;
        res.send('Transaction added...');
    });
});

// Create a new budget for a user
app.post('/add-budget', (req, res) => {
    const { user_id, category_id, amount, start_date, end_date } = req.body;
    const sql = 'INSERT INTO Budgets (user_id, category_id, amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [user_id, category_id, amount, start_date, end_date], (err, result) => {
        if (err) throw err;
        res.send('Budget added...');
    });
});

// Create a new goal for a user
app.post('/add-goal', (req, res) => {
    const { user_id, goal_name, target_amount, current_amount, due_date } = req.body;
    const sql = 'INSERT INTO Goals (user_id, goal_name, target_amount, current_amount, due_date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [user_id, goal_name, target_amount, current_amount, due_date], (err, result) => {
        if (err) throw err;
        res.send('Goal added...');
    });
});

// Create a new notification for a user
app.post('/add-notification', (req, res) => {
    const { user_id, message, is_read } = req.body;
    const sql = 'INSERT INTO Notifications (user_id, message, is_read) VALUES (?, ?, ?)';
    db.query(sql, [user_id, message, is_read], (err, result) => {
        if (err) throw err;
        res.send('Notification added...');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join('C:', 'Users', 'DHRUV KAPOOR', 'Desktop', 'financetracking', 'finance-tracking', 'financeTracking.html'));
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Route handler for the root URL

