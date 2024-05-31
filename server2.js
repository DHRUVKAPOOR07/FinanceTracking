const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // Use your server's IP address or domain name
    user: 'root', // Replace with your MySQL username
    password: 'root123', // Replace with your MySQL password
    database: 'financetracking'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Endpoint to get all accounts
app.get('/accounts', (req, res) => {
    const sql = 'SELECT * FROM Accounts';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Endpoint to create a new user
app.post('/users', (req, res) => {
    const { username, password_hash, email } = req.body;
    const sql = 'INSERT INTO Users (username, password_hash, email) VALUES (?, ?, ?)';
    db.query(sql, [username, password_hash, email], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id: result.insertId, username, password_hash, email });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
