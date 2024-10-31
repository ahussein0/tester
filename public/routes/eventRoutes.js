// public/routes/eventRoutes.js
const express = require('express');
const EventDetails = require('../models/eventDetails');

const router = express.Router();

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { eventName, eventDescription, eventLocation, requiredSkills, urgency, eventDate } = req.body;

    const event = new EventDetails({ eventName, eventDescription, eventLocation, requiredSkills, urgency, eventDate });
    await event.save();
    res.status(201).json({ status: 'success', message: 'Event created successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Event creation failed' });
  }
});

// Retrieve all events
router.get('/', async (req, res) => {
  try {
    const events = await EventDetails.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve events' });
  }
});

module.exports = router;
