const mongoose = require('mongoose');

const eventDetailsSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        zipcode: String
    },
    requiredSkills: [{
        type: String,
        trim: true
    }],
    eventDate: {
        type: Date,
        required: [true, 'Event date is required']
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    }
}, { timestamps: true });

module.exports = mongoose.model('EventDetails', eventDetailsSchema);