const express = require('express');
const router = express.Router();

let profiles = {}; // In-memory storage for profiles

// Update Profile
router.post('/', (req, res) => {
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

        // Validate required fields
        if (!fullName || !address1 || !city || !state || !zipCode || !skills || !availability) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        // Create or update profile
        const profile = {
            id: userEmail,
            fullName,
            address1,
            address2,
            city,
            state,
            zipCode,
            skills,
            preferences,
            availability,
            dateCreated: profiles[userEmail]?.dateCreated || new Date(),
            lastUpdated: new Date(),
            status: 'ACTIVE'
        };

        // Save profile
        profiles[userEmail] = profile;

        // Since we're running on the same server, we don't need to make an HTTP request
        // Instead, we can just save the volunteer information directly
        if (req.app.locals.volunteers === undefined) {
            req.app.locals.volunteers = [];
        }

        // Add or update volunteer record
        const volunteerIndex = req.app.locals.volunteers.findIndex(v => v.email === userEmail);
        const volunteerData = {
            id: userEmail,
            name: fullName,
            email: userEmail,
            skills: skills
        };

        if (volunteerIndex === -1) {
            req.app.locals.volunteers.push(volunteerData);
        } else {
            req.app.locals.volunteers[volunteerIndex] = volunteerData;
        }

        res.json({ 
            message: 'Profile updated successfully.',
            profile 
        });
    } catch (error) {
        console.error('Error in profile update:', error);
        res.status(500).json({ 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
});

// Get Profile
router.get('/', (req, res) => {
    try {
        const userEmail = req.headers['user-id'];
        
        if (!userEmail) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const profile = profiles[userEmail] || null;
        
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

module.exports = router;