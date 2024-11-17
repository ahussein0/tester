const express = require('express');
const router = express.Router();

let volunteers = []; // Hard-coded volunteers data
let events = []; // Import or access shared event data

// Fetch events for matching
router.get('/events', (req, res) => {
    res.json(events);
});

// Fetch volunteers for matching
router.get('/volunteers', (req, res) => {
    res.json(volunteers);
});

module.exports = router;
