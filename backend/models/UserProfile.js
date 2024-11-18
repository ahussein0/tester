// backend/models/UserProfile.js

const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    fullName: { 
        type: String, 
        required: true 
    },
    address1: { 
        type: String, 
        required: true 
    },
    address2: { 
        type: String 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    zipCode: { 
        type: String, 
        required: true 
    },
    skills: { 
        type: [String], 
        required: true 
    },
    preferences: { 
        type: String 
    },
    availability: { 
        type: [Date], 
        required: true 
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

// Update the lastUpdated timestamp before saving
userProfileSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = mongoose.model('UserProfile', userProfileSchema);