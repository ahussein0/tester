const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationcontroller');

router.get('/', notificationController.getNotifications);

module.exports = router;
