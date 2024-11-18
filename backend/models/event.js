const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: { 
        type: String, 
        required: true 
    },
    eventDescription: { 
        type: String, 
        required: true 
    },
    eventLocation: { 
        type: String, 
        required: true 
    },
    requiredSkills: { 
        type: [String],
        required: true
    },
    urgency: { 
        type: String, 
        required: true,
        enum: ['high', 'medium', 'low']
    },
    eventDate: { 
        type: Date, 
        required: true 
    },
    createdBy: { 
        type: String, 
        required: true,
        ref: 'UserCredentials'
    },
    status: {
        type: String,
        default: 'ACTIVE',
        enum: ['ACTIVE', 'COMPLETED', 'CANCELLED']
    },
    dateCreated: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Event', eventSchema);