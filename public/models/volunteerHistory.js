const mongoose = require('mongoose');

const volunteerHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['confirmed', 'pending', 'completed'], required: true },
  participationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VolunteerHistory', volunteerHistorySchema);
