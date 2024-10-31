// public/routes/profileRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const UserProfile = require('../models/userProfile');
const UserCredentials = require('../models/userCredentials');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, fullName, address1, city, state, zipCode, skills, availability } = req.body;

    // Check if required fields are present
    if (!userId || !fullName || !address1 || !city || !state || !zipCode || !skills || !availability) {
      return res.status(400).json({ status: 'error', message: 'Required fields are missing' });
    }

    // Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid user ID format' });
    }

    // Verify that the user exists in UserCredentials
    const userExists = await UserCredentials.findById(userId);
    if (!userExists) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Find or create user profile
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = new UserProfile({ userId, fullName, address1, city, state, zipCode, skills, availability });
    } else {
      profile.set({ fullName, address1, city, state, zipCode, skills, availability });
    }

    await profile.save();
    res.status(200).json({ status: 'success', message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error in profile update route:', error);
    res.status(500).json({ status: 'error', message: 'Profile update failed', error: error.message });
  }
});

module.exports = router;
