const express = require('express');
const router = express.Router();
const { UserProfile } = require('../models');

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/:userId', async (req, res) => {
    try {
        const { fullName, address, city, state, zipcode, skills } = req.body;
        
        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.params.userId },
            {
                fullName,
                address,
                city,
                state,
                zipcode,
                skills
            },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;