const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDescription: String,
  eventLocation: String,
  requiredSkills: [String],
  urgency: { type: String, enum: ['high', 'medium', 'low'], required: true },
  eventDate: { type: Date, required: true },
});

module.exports = mongoose.model('Event', eventSchema);
