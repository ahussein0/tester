// public/models/VolunteerHistory.js
const mongoose = require('mongoose');

const volunteerHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventDetails', required: true },
  status: { type: String, required: true }, // e.g., "completed", "pending"
});

module.exports = mongoose.model('VolunteerHistory', volunteerHistorySchema);
