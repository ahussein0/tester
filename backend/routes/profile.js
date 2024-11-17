const express = require('express');
const router = express.Router();

let profiles = {}; // Hard-coded profile data

// Update Profile
router.post('/', (req, res) => {
    const { fullName, address1, address2, city, state, zipCode, skills, preferences, availability } = req.body;

    if (!fullName || !address1 || !city || !state || !zipCode || !skills || !availability) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Simulate saving profile to database
    console.log('User Profile:', { fullName, address1, address2, city, state, zipCode, skills, preferences, availability });

    res.status(200).json({ message: 'Profile updated successfully.' });
});

module.exports = router;
