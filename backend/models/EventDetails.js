const mongoose = require('mongoose');

const eventDetailsSchema = new mongoose.Schema({
    eventName: { type: String, maxlength: 100, required: true },
    eventDescription: { type: String, required: true },
    eventLocation: { type: String, required: true },
    requiredSkills: [{ type: String, required: true }],
    urgency: { type: String, enum: ['high', 'medium', 'low'], required: true },
    eventDate: { type: Date, required: true }
});

module.exports = mongoose.model('EventDetails', eventDetailsSchema);
