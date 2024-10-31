const Notification = require('../models/notification');


exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.headers['user-id'] });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
