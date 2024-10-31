const express = require('express');
const router = express.Router();
const { EventDetails, VolunteerHistory } = require('../models');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await EventDetails.find({});
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new event
router.post('/', async (req, res) => {
    try {
        const { eventName, description, location, requiredSkills, eventDate } = req.body;
        
        const event = new EventDetails({
            eventName,
            description,
            location,
            requiredSkills,
            eventDate,
            status: 'PENDING'
        });
        
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single event
router.get('/:eventId', async (req, res) => {
    try {
        const event = await EventDetails.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sign up for event
router.post('/:eventId/volunteer', async (req, res) => {
    try {
        const { userId } = req.body;
        
        const volunteerHistory = new VolunteerHistory({
            userId,
            eventId: req.params.eventId,
            status: 'SIGNED_UP'
        });
        
        await volunteerHistory.save();
        res.status(201).json({ message: 'Successfully signed up for event' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;