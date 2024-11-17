const express = require('express');
const router = express.Router();

let events = []; // Hard-coded events data

// Create Event
router.post('/', (req, res) => {
    const { eventName, eventDescription, eventLocation, requiredSkills, urgency, eventDate } = req.body;

    if (!eventName || !eventDescription || !eventLocation || !requiredSkills || !urgency || !eventDate) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const event = {
        id: events.length + 1,
        eventName,
        eventDescription,
        eventLocation,
        requiredSkills,
        urgency,
        eventDate,
        matchedVolunteers: [],
    };

    events.push(event);

    res.json({ message: 'Event created successfully', event });
});

// Get Events
router.get('/', (req, res) => {
    res.json(events);
});

module.exports = router;
