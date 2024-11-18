const express = require('express');
const router = express.Router();
const { validateEmail, validatePassword } = require('../utils/validations');

let users = []; // Hard-coded user data

// Registration
router.post('/register', async (req, res) => {
    try {
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
        const newUser = { 
            email, 
            password, 
            profileCompleted: false,
            dateCreated: new Date()
        };
        users.push(newUser);

        // Instead of using fetch, we'll just store initial profile data in memory
        if (req.app.locals.profiles === undefined) {
            req.app.locals.profiles = {};
        }

        // Create initial profile
        req.app.locals.profiles[email] = {
            email,
            dateCreated: new Date(),
            profileCompleted: false
        };

        // Automatically log in the user after registration
        res.status(201).json({
            message: 'Registration successful',
            login: {
                message: 'Login successful',
                email: newUser.email,
                profileCompleted: newUser.profileCompleted,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration' });
    }
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