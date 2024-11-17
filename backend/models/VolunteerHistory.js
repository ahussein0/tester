const mongoose = require('mongoose');

const volunteerHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCredentials', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventDetails', required: true },
    participationStatus: { type: String, enum: ['completed', 'pending', 'cancelled'], required: true },
    feedback: { type: String }
});

module.exports = mongoose.model('VolunteerHistory', volunteerHistorySchema);
