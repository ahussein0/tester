const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zipCode: String,
  skills: [String],
  preferences: String,
  availability: [String],
});

module.exports = mongoose.model('User', userSchema);
