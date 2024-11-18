// backend/models/VolunteerHistory.js

const mongoose = require('mongoose');

const volunteerHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'UserCredentials'
    },
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['MATCHED', 'COMPLETED', 'CANCELLED']
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VolunteerHistory', volunteerHistorySchema);