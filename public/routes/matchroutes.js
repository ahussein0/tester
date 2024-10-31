const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchcontroller');

router.post('/', matchController.matchVolunteer);

module.exports = router;
