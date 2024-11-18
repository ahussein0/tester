// backend/models/UserCredentials.js
const mongoose = require('mongoose');

const userCredentialsSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    profileCompleted: { 
        type: Boolean, 
        default: false 
    },
    dateCreated: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('UserCredentials', userCredentialsSchema);