const Event = require('../models/event');
const User = require('../models/user');

exports.matchVolunteer = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ status: 'error', message: 'User or Event not found' });
    }

    const isMatched = user.skills.some(skill => event.requiredSkills.includes(skill));

    if (isMatched) {
      res.status(200).json({ status: 'success', message: 'Volunteer matched successfully' });
    } else {
      res.status(400).json({ status: 'error', message: 'No suitable match found' });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
