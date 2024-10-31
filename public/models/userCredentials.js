// public/models/UserCredentials.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userCredentialsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Encrypt password before saving
userCredentialsSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('UserCredentials', userCredentialsSchema);
