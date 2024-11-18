const express = require('express');
const router = express.Router();
const { Event } = require('../models');

// Create Event
router.post('/', async (req, res) => {
    try {
        const { 
            eventName, 
            eventDescription, 
            eventLocation, 
            requiredSkills, 
            urgency, 
            eventDate,
            createdBy 
        } = req.body;

        // Validate required fields
        if (!eventName || !eventDescription || !eventLocation || !requiredSkills || !urgency || !eventDate) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        // Create new event with status
        const event = new Event({
            eventName,
            eventDescription,
            eventLocation,
            requiredSkills,
            urgency,
            eventDate,
            createdBy,
            status: 'ACTIVE'
        });

        // Save the event
        await event.save();

        // Log successful creation
        console.log('Event created:', event);

        res.status(201).json({ 
            message: 'Event created successfully', 
            event 
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ 
            message: 'Failed to create event',
            error: error.message 
        });
    }
});

// Get Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

module.exports = router;