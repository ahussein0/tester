// public/models/States.js
const mongoose = require('mongoose');

const statesSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('States', statesSchema);
