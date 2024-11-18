const express = require('express');
const router = express.Router();
const { Match, Event, Volunteer, VolunteerHistory } = require('../models');

// Fetch events for matching
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({ status: 'ACTIVE' });
        console.log('Found events:', events); // Debug log
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
});

// Fetch volunteers for matching
router.get('/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({ status: 'ACTIVE' });
        console.log('Found volunteers:', volunteers); // Debug log
        res.json(volunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: "Error fetching volunteers", error: error.message });
    }
});

// Create match
router.post('/match', async (req, res) => {
    try {
        console.log('Received match request:', req.body); // Debug log

        const { volunteerId, eventId } = req.body;

        if (!volunteerId || !eventId) {
            return res.status(400).json({ message: "Volunteer ID and Event ID are required" });
        }

        // Check for existing match
        const existingMatch = await Match.findOne({ volunteerId, eventId });
        if (existingMatch) {
            return res.status(400).json({ message: "Match already exists" });
        }

        // Get volunteer and event details
        const volunteer = await Volunteer.findById(volunteerId);
        const event = await Event.findById(eventId);

        if (!volunteer || !event) {
            return res.status(404).json({ message: "Volunteer or event not found" });
        }

        // Create new match
        const match = new Match({
            volunteerId: volunteerId,
            eventId: eventId,
            status: 'PENDING'
        });

        await match.save();

        // Create history record
        const history = new VolunteerHistory({
            userId: volunteer.email,
            eventName: event.eventName,
            eventDate: event.eventDate,
            status: 'MATCHED'
        });

        await history.save();

        console.log('Match created successfully:', match); // Debug log

        res.status(201).json({
            message: "Match created successfully",
            match,
            history
        });

    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: "Error creating match", error: error.message });
    }
});

// Register volunteer from profile
router.post('/register-volunteer', async (req, res) => {
    try {
        console.log('Received volunteer registration data:', req.body); // Debug log

        const { fullName, email, skills, availability } = req.body;
        
        if (!fullName || !email || !skills) {
            return res.status(400).json({ 
                message: 'Name, email, and skills are required' 
            });
        }

        // Check if volunteer already exists
        let volunteer = await Volunteer.findOne({ email });
        
        if (volunteer) {
            // Update existing volunteer
            volunteer.name = fullName;
            volunteer.skills = skills;
            volunteer.availability = availability || [];
            volunteer.status = 'ACTIVE';
            await volunteer.save();
            console.log('Updated existing volunteer:', volunteer); // Debug log
        } else {
            // Create new volunteer
            volunteer = new Volunteer({
                name: fullName,
                email,
                skills,
                availability: availability || [],
                status: 'ACTIVE',
                dateRegistered: new Date()
            });
            await volunteer.save();
            console.log('Created new volunteer:', volunteer); // Debug log
        }

        res.status(201).json({
            message: volunteer ? 'Volunteer updated successfully' : 'Volunteer registered successfully',
            volunteer
        });
    } catch (error) {
        console.error('Error registering volunteer:', error);
        res.status(500).json({ 
            message: "Error registering volunteer", 
            error: error.message 
        });
    }
});

// Get all matches
router.get('/matches', async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('volunteerId')
            .populate('eventId');
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching matches", error: error.message });
    }
});

// Update match status
router.put('/match/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const match = await Match.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ message: "Error updating match status", error: error.message });
    }
});

module.exports = router;