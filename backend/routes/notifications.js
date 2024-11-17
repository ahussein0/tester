const express = require('express');
const router = express.Router();

let notifications = []; // Hard-coded notifications

// Get Notifications
router.get('/', (req, res) => {
    res.json(notifications);
});

// Add Notification
router.post('/', (req, res) => {
    const { message } = req.body;

    // Validation: Check if message is provided
    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    notifications.push({ id: notifications.length + 1, message });
    res.status(200).json({ message: 'Notification added successfully' });
});

module.exports = router;
