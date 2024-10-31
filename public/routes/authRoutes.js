const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { UserCredentials, UserProfile } = require('../models');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, address, city, state, zipcode, skills } = req.body;

        // Check if user exists
        const existingUser = await UserCredentials.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user credentials
        const userCredentials = new UserCredentials({
            email,
            password
        });
        const savedCredentials = await userCredentials.save();

        // Create user profile
        const userProfile = new UserProfile({
            userId: savedCredentials._id,
            fullName,
            address,
            city,
            state,
            zipcode,
            skills: skills || []
        });
        await userProfile.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await UserCredentials.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Get user profile
        const profile = await UserProfile.findOne({ userId: user._id });
        
        res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                profile
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;