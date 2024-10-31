const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profilecontroller');

// PUT route for updating profile
router.put('/', profileController.updateProfile);

// GET route for retrieving profile
router.get('/', profileController.getProfile);

module.exports = router;
