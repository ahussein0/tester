const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userCredentialsSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Encrypt password before saving
userCredentialsSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('UserCredentials', userCredentialsSchema);
