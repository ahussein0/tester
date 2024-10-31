// public/models/EventDetails.js
const mongoose = require('mongoose');

const eventDetailsSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventLocation: { type: String, required: true },
  requiredSkills: [{ type: String }],
  urgency: { type: String, enum: ['high', 'medium', 'low'], required: true },
  eventDate: { type: Date, required: true },
});

module.exports = mongoose.model('EventDetails', eventDetailsSchema);
