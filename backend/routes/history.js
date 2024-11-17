const express = require('express');
const router = express.Router();

let history = []; // Hard-coded history data

// Get Volunteer History
router.get('/', (req, res) => {
    res.json(history);
});

// Add to Volunteer History
router.post('/', (req, res) => {
    const { eventName, eventDate, status } = req.body;

    // Validation: Check if all required fields are present
    if (!eventName || !eventDate || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    history.push({ eventName, eventDate, status });
    res.status(200).json({ message: 'History updated successfully' });
});

module.exports = router;
