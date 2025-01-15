const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Database connection

// Create the user table if it doesn't exist
const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Customer' CHECK (role IN ('Admin', 'Customer')) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    await db.query(query);
};

// Check if user exists by email
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
};

// User login
const loginUser = async (email, password) => {
    try {
        // Check if the user exists
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // If user not found, return error
        if (!user) return { error: 'User not found' };

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { error: 'Invalid credentials' };

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token and user data
        return { token, user };
    } catch (err) {
        console.error(err);
        throw new Error('Server error');
    }
};

// User signup
const signupUser = async (name, email, password) => { // Removed role parameter
    try {
        // Check if all fields are provided
        if (!name || !email || !password) {
            return { error: 'All fields are required' };
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return { error: 'User already exists' };
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database with default role 'Customer'
        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        // Return the created user data
        return { user: result.rows[0] };
    } catch (err) {
        console.error(err);
        throw new Error('Server error');
    }
};

module.exports = { createUserTable, loginUser, signupUser, getUserByEmail };
