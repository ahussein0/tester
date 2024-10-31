const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventcontroller');

router.post('/', eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById); // Get a specific event by ID

module.exports = router;
