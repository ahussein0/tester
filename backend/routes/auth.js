const express = require('express');
const router = express.Router();
const { validateEmail, validatePassword } = require('../utils/validations');
const UserCredentials = require('../models/UserCredentials'); // Changed from User to UserCredentials

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

        // Check if user exists
        const existingUser = await UserCredentials.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new UserCredentials({
            email,
            password, // In a real application, you should hash the password
            profileCompleted: false
        });

        await user.save();

        // Automatically log in the user after registration
        res.status(201).json({
            message: 'Registration successful',
            login: {
                message: 'Login successful',
                email: user.email,
                profileCompleted: user.profileCompleted,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user credentials
        const user = await UserCredentials.findOne({ email, password }); // In real app, compare hashed passwords
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({ 
            message: 'Login successful',
            profileCompleted: user.profileCompleted 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

module.exports = router;