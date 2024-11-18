const express = require('express');
const router = express.Router();

// In-memory storage for volunteers and events
let volunteers = [];
let events = [];
let matches = []; // Add storage for matches

// Fetch events for matching
router.get('/events', (req, res) => {
    try {
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
});

// Fetch volunteers for matching
router.get('/volunteers', (req, res) => {
    try {
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching volunteers", error: error.message });
    }
});

// Add new volunteer
router.post('/volunteers', (req, res) => {
    try {
        const { name, email, skills } = req.body;
        const id = Date.now().toString(); // Simple ID generation

        const newVolunteer = {
            id,
            name,
            email,
            skills,
            dateRegistered: new Date()
        };

        volunteers.push(newVolunteer);
        res.status(201).json(newVolunteer);
    } catch (error) {
        res.status(500).json({ message: "Error adding volunteer", error: error.message });
    }
});

// Add new event
router.post('/events', (req, res) => {
    try {
        const { eventName, eventDescription, eventLocation, requiredSkills, urgency, eventDate, createdBy } = req.body;
        const id = Date.now().toString(); // Simple ID generation

        const newEvent = {
            id,
            eventName,
            eventDescription,
            eventLocation,
            requiredSkills,
            urgency,
            eventDate,
            createdBy,
            dateCreated: new Date()
        };

        events.push(newEvent);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: "Error adding event", error: error.message });
    }
});

// Create a match between volunteer and event
router.post('/match', (req, res) => {
    try {
        const { volunteerId, eventId } = req.body;

        // Verify volunteer and event exist
        const volunteer = volunteers.find(v => v.id === volunteerId);
        const event = events.find(e => e.id === eventId);

        if (!volunteer || !event) {
            return res.status(404).json({ message: "Volunteer or event not found" });
        }

        const newMatch = {
            id: Date.now().toString(),
            volunteerId,
            eventId,
            dateMatched: new Date(),
            status: 'PENDING'
        };

        matches.push(newMatch);
        res.status(201).json(newMatch);
    } catch (error) {
        res.status(500).json({ message: "Error creating match", error: error.message });
    }
});

// Get all matches
router.get('/matches', (req, res) => {
    try {
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching matches", error: error.message });
    }
});

// Add volunteer from profile creation
router.post('/register-volunteer', (req, res) => {
    try {
        const { fullName, email, skills } = req.body;
        
        // Check if volunteer already exists
        const existingVolunteer = volunteers.find(v => v.email === email);
        if (existingVolunteer) {
            return res.status(400).json({ message: "Volunteer already registered" });
        }

        const newVolunteer = {
            id: Date.now().toString(),
            name: fullName,
            email,
            skills,
            dateRegistered: new Date()
        };

        volunteers.push(newVolunteer);
        res.status(201).json(newVolunteer);
    } catch (error) {
        res.status(500).json({ message: "Error registering volunteer", error: error.message });
    }
});

// Update volunteer profile
router.put('/volunteers/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const volunteerIndex = volunteers.findIndex(v => v.id === id);
        if (volunteerIndex === -1) {
            return res.status(404).json({ message: "Volunteer not found" });
        }

        volunteers[volunteerIndex] = {
            ...volunteers[volunteerIndex],
            ...updateData,
            dateUpdated: new Date()
        };

        res.json(volunteers[volunteerIndex]);
    } catch (error) {
        res.status(500).json({ message: "Error updating volunteer", error: error.message });
    }
});

// Delete volunteer
router.delete('/volunteers/:id', (req, res) => {
    try {
        const { id } = req.params;
        const volunteerIndex = volunteers.findIndex(v => v.id === id);
        
        if (volunteerIndex === -1) {
            return res.status(404).json({ message: "Volunteer not found" });
        }

        volunteers.splice(volunteerIndex, 1);
        res.json({ message: "Volunteer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting volunteer", error: error.message });
    }
});

module.exports = router;