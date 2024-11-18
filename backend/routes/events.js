const express = require('express');
const router = express.Router();

let events = []; // In-memory storage for events

// Create Event
router.post('/', (req, res) => {
    try {
        const { 
            eventName, 
            eventDescription, 
            eventLocation, 
            requiredSkills, 
            urgency, 
            eventDate,
            createdBy // Add creator's email
        } = req.body;

        // Validate required fields
        if (!eventName || !eventDescription || !eventLocation || !requiredSkills || !urgency || !eventDate) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const event = {
            id: Date.now().toString(), // More unique ID generation
            eventName,
            eventDescription,
            eventLocation,
            requiredSkills,
            urgency,
            eventDate,
            createdBy,
            matchedVolunteers: [],
            status: 'OPEN', // Add status tracking
            dateCreated: new Date(),
            lastUpdated: new Date()
        };

        events.push(event);

        // Update matching system with new event
        res.status(201).json({ 
            message: 'Event created successfully', 
            event 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating event', 
            error: error.message 
        });
    }
});

// Get All Events
router.get('/', (req, res) => {
    try {
        res.json(events);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching events', 
            error: error.message 
        });
    }
});

// Get Single Event
router.get('/:id', (req, res) => {
    try {
        const event = events.find(e => e.id === req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching event', 
            error: error.message 
        });
    }
});

// Update Event
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const eventIndex = events.findIndex(e => e.id === id);
        if (eventIndex === -1) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update event data
        events[eventIndex] = {
            ...events[eventIndex],
            ...updateData,
            lastUpdated: new Date()
        };

        res.json({
            message: 'Event updated successfully',
            event: events[eventIndex]
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating event', 
            error: error.message 
        });
    }
});

// Delete Event
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const eventIndex = events.findIndex(e => e.id === id);

        if (eventIndex === -1) {
            return res.status(404).json({ message: 'Event not found' });
        }

        events.splice(eventIndex, 1);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting event', 
            error: error.message 
        });
    }
});

// Get Events by Creator
router.get('/user/:email', (req, res) => {
    try {
        const { email } = req.params;
        const userEvents = events.filter(event => event.createdBy === email);
        res.json(userEvents);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching user events', 
            error: error.message 
        });
    }
});

// Match Volunteer to Event
router.post('/:id/match', (req, res) => {
    try {
        const { id } = req.params;
        const { volunteerId, volunteerName, volunteerEmail } = req.body;

        const event = events.find(e => e.id === id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if volunteer is already matched
        if (event.matchedVolunteers.some(v => v.id === volunteerId)) {
            return res.status(400).json({ message: 'Volunteer already matched to this event' });
        }

        // Add volunteer to event
        event.matchedVolunteers.push({
            id: volunteerId,
            name: volunteerName,
            email: volunteerEmail,
            dateMatched: new Date(),
            status: 'MATCHED'
        });

        event.lastUpdated = new Date();

        res.json({
            message: 'Volunteer matched successfully',
            event
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error matching volunteer', 
            error: error.message 
        });
    }
});

// Get Upcoming Events
router.get('/filter/upcoming', (req, res) => {
    try {
        const now = new Date();
        const upcomingEvents = events.filter(event => {
            const eventDate = new Date(event.eventDate);
            return eventDate > now;
        });

        res.json(upcomingEvents);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching upcoming events', 
            error: error.message 
        });
    }
});

module.exports = router;