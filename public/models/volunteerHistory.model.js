const mongoose = require('mongoose');

const volunteerHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCredentials',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventDetails',
        required: true
    },
    status: {
        type: String,
        enum: ['SIGNED_UP', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'SIGNED_UP'
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    }
}, { timestamps: true });

module.exports = mongoose.model('VolunteerHistory', volunteerHistorySchema);