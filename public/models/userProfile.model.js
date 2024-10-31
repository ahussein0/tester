const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCredentials',
        required: true
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        ref: 'States'
    },
    zipcode: {
        type: String,
        required: [true, 'Zipcode is required'],
        match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid zipcode']
    },
    skills: [{
        type: String,
        trim: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);