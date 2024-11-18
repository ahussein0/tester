// backend/models/States.js
const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        minlength: 2,
        maxlength: 2
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('State', stateSchema);