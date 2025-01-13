const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginUser, signupUser, getUserByEmail} =require("../models/userModel")

// User signup
const signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if user already exists using the model function
        const userCheck = await getUserByEmail(email);
        if (userCheck) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Insert user into the database using the model function
        const newUser = await signupUser(username, email, password, role);

        if (newUser.error) {
            return res.status(400).json({ message: newUser.error });
        }

        res.status(201).json({ message: 'User registered successfully', user: newUser.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists using the model function
        const { error, token, user } = await loginUser(email, password);

        if (error) {
            return res.status(400).json({ message: error });
        }

        // Generate JWT and respond with token
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { signup, login };
