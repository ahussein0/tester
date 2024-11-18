const express = require('express');
const router = express.Router();

// In-memory storage for volunteer history
let history = [];

// Get Volunteer History by user email
router.get('/', (req, res) => {
    try {
        const userEmail = req.headers['user-id']; // Get user email from headers
        
        if (!userEmail) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Filter history for specific user
        const userHistory = history.filter(record => record.volunteerEmail === userEmail);
        res.json(userHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history', error: error.message });
    }
});

// Add to Volunteer History
router.post('/', (req, res) => {
    try {
        const { eventName, eventDate, status, volunteerEmail } = req.body;

        // Validation: Check if all required fields are present
        if (!eventName || !eventDate || !status || !volunteerEmail) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new history record with additional details
        const newRecord = {
            id: Date.now().toString(),
            eventName,
            eventDate,
            status,
            volunteerEmail,
            dateCreated: new Date(),
            lastUpdated: new Date()
        };

        history.push(newRecord);
        res.status(201).json({ 
            message: 'History updated successfully',
            record: newRecord 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding history record', error: error.message });
    }
});

// Update history record status
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const recordIndex = history.findIndex(record => record.id === id);
        if (recordIndex === -1) {
            return res.status(404).json({ message: 'History record not found' });
        }

        history[recordIndex] = {
            ...history[recordIndex],
            status,
            lastUpdated: new Date()
        };

        res.json({ 
            message: 'History record updated successfully',
            record: history[recordIndex]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating history record', error: error.message });
    }
});

// Delete history record
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const recordIndex = history.findIndex(record => record.id === id);
        
        if (recordIndex === -1) {
            return res.status(404).json({ message: 'History record not found' });
        }

        history.splice(recordIndex, 1);
        res.json({ message: 'History record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting history record', error: error.message });
    }
});

// Get history for specific event
router.get('/event/:eventId', (req, res) => {
    try {
        const { eventId } = req.params;
        const eventHistory = history.filter(record => record.eventId === eventId);
        res.json(eventHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event history', error: error.message });
    }
});

// Add automatic history creation when match is made
function createHistoryFromMatch(matchData) {
    const newRecord = {
        id: Date.now().toString(),
        eventId: matchData.eventId,
        eventName: matchData.eventName,
        eventDate: matchData.eventDate,
        volunteerEmail: matchData.volunteerEmail,
        status: 'Matched',
        dateCreated: new Date(),
        lastUpdated: new Date()
    };

    history.push(newRecord);
    return newRecord;
}

// Helper function to get history statistics
router.get('/stats', (req, res) => {
    try {
        const userEmail = req.headers['user-id'];
        
        if (!userEmail) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const userHistory = history.filter(record => record.volunteerEmail === userEmail);
        
        const stats = {
            totalEvents: userHistory.length,
            completedEvents: userHistory.filter(record => record.status === 'Completed').length,
            pendingEvents: userHistory.filter(record => record.status === 'Pending').length,
            cancelledEvents: userHistory.filter(record => record.status === 'Cancelled').length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history statistics', error: error.message });
    }
});

module.exports = router;