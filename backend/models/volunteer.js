const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    skills: { 
        type: [String],
        required: true
    },
    availability: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    dateRegistered: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);