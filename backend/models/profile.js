const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

// Get Profile
router.get('/', async (req, res) => {
    try {
        const userEmail = req.headers['user-id'];
        
        if (!userEmail) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const profile = await UserProfile.findOne({ email: userEmail });
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching profile', 
            error: error.message 
        });
    }
});

// Update Profile
router.post('/', async (req, res) => {
    try {
        const userEmail = req.headers['user-id'];
        
        if (!userEmail) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const profileData = {
            email: userEmail,
            fullName: req.body.fullName,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            skills: req.body.skills,
            preferences: req.body.preferences,
            availability: req.body.availability
        };

        // Update or create profile
        const profile = await UserProfile.findOneAndUpdate(
            { email: userEmail },
            profileData,
            { new: true, upsert: true, runValidators: true }
        );

        // Update user's profileCompleted status
        const User = require('../models/User');
        await User.findOneAndUpdate(
            { email: userEmail },
            { profileCompleted: true }
        );

        res.json({ 
            message: 'Profile updated successfully',
            profile 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
});

module.exports = router;