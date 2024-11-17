const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    code: { type: String, maxlength: 2, required: true, unique: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('States', stateSchema);
