// public/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserCredentials = require('../models/userCredentials');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password is required' });
    }

    // Check if email already exists
    const existingUser = await UserCredentials.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    const user = new UserCredentials({ email, password });
    await user.save();
    res.status(201).json({ status: 'success', message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ status: 'error', message: 'Registration failed', error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password is required' });
    }

    const user = await UserCredentials.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
    }

    res.status(200).json({ status: 'success', message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ status: 'error', message: 'Login failed', error: error.message });
  }
});

module.exports = router;
