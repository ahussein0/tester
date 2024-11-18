// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const UserCredentials = require('../models/UserCredentials');
const Volunteer = require('../models/Volunteer');

// Update Profile
router.post('/', async (req, res) => {
    try {
        const userEmail = req.headers['user-id'];
        
        if (!userEmail) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { 
            fullName, 
            address1, 
            address2, 
            city, 
            state, 
            zipCode, 
            skills, 
            preferences, 
            availability 
        } = req.body;

        // Create or update profile
        const profileData = {
            email: userEmail,
            fullName,
            address1,
            address2,
            city,
            state,
            zipCode,
            skills,
            preferences,
            availability
        };

        // Update or create user profile
        const profile = await UserProfile.findOneAndUpdate(
            { email: userEmail },
            profileData,
            { new: true, upsert: true, runValidators: true }
        );

        // Update volunteer record
        const volunteerData = {
            name: fullName,
            email: userEmail,
            skills,
            availability
        };

        await Volunteer.findOneAndUpdate(
            { email: userEmail },
            volunteerData,
            { new: true, upsert: true, runValidators: true }
        );

        // Update user's profileCompleted status
        await UserCredentials.findOneAndUpdate(
            { email: userEmail },
            { profileCompleted: true }
        );

        res.json({ 
            message: 'Profile updated successfully',
            profile 
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
});

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
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            message: 'Error fetching profile', 
            error: error.message 
        });
    }
});

module.exports = router;