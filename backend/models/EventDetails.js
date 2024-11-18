// backend/models/EventDetails.js
const mongoose = require('mongoose');

const eventDetailsSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    attendees: [{
        volunteerId: {
            type: String,
            required: true,
            ref: 'Volunteer'
        },
        status: {
            type: String,
            required: true,
            enum: ['CONFIRMED', 'CHECKED_IN', 'NO_SHOW', 'COMPLETED']
        },
        checkInTime: Date,
        checkOutTime: Date,
        hoursServed: Number,
        feedback: String
    }],
    notes: [{
        content: String,
        createdBy: {
            type: String,
            ref: 'UserCredentials'
        },
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }],
    resources: [{
        name: String,
        quantity: Number,
        assigned: Boolean
    }],
    status: {
        type: String,
        required: true,
        enum: ['PLANNING', 'READY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'PLANNING'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated timestamp before saving
eventDetailsSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = mongoose.model('EventDetails', eventDetailsSchema);