// backend/models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED'],
        default: 'PENDING'
    },
    dateMatched: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Match', matchSchema);