const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCredentials', required: true },
    fullName: { type: String, maxlength: 50, required: true },
    address1: { type: String, maxlength: 100, required: true },
    address2: { type: String, maxlength: 100 },
    city: { type: String, maxlength: 100, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, match: /^[0-9]{5}(-[0-9]{4})?$/, required: true },
    skills: [{ type: String, required: true }],
    preferences: { type: String },
    availability: [{ type: String }] // Store dates as strings
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
