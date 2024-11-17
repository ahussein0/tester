const express = require('express');
const router = express.Router();
const { validateEmail, validatePassword } = require('../utils/validations');

let users = []; // Hard-coded user data

// Registration
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Register the user
    const newUser = { email, password, profileCompleted: false };
    users.push(newUser);

    // Automatically log in the user after registration
    res.status(201).json({
        message: 'Registration successful',
        login: {
            message: 'Login successful',
            email: newUser.email,
            profileCompleted: newUser.profileCompleted,
        },
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check user credentials
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', profileCompleted: user.profileCompleted });
});

module.exports = router;
