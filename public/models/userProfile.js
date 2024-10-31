// public/models/UserProfile.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCredentials', required: true },
  fullName: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  skills: [{ type: String }],
  preferences: { type: String },
  availability: [{ type: String }], // Array of date strings
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
