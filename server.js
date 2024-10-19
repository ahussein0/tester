const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Dummy data
const users = {
  'user@example.com': { password: 'password123', profile: { skills: ['JavaScript', 'Node.js'], availability: ['2024-10-15', '2024-10-16'] } }
};
let events = [
  {
    eventName: 'Community Cleanup',
    eventLocation: 'Central Park',
    requiredSkills: ['JavaScript', 'Node.js'],
    urgency: 'high',
    eventDate: '2024-10-15'
  }
];

let volunteerHistory = [];

// Helper functions
function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPasswordStrong(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
}

function isFieldValid(field, minLength = 1) {
  return field && field.length >= minLength;
}

function isValidDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
}

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration route
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ status: 'failure', message: 'Invalid email format' });
  }

  if (!isPasswordStrong(password)) {
    return res.status(400).json({ status: 'failure', message: 'Password must contain at least 6 characters, with at least 1 letter and 1 number' });
  }

  if (users[email]) {
    return res.status(400).json({ status: 'failure', message: 'User already exists' });
  }

  users[email] = { password, profile: {} };
  res.status(201).json({ status: 'success', message: 'User registered successfully' });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ status: 'failure', message: 'Invalid email format' });
  }

  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({ status: 'failure', message: 'Invalid credentials' });
  }

  res.status(200).json({ status: 'success', message: 'Logged in successfully' });
});

app.post('/profile', (req, res) => {
  const { fullName, address1, skills, availability } = req.body;

  if (!isFieldValid(fullName, 3)) {
    return res.status(400).json({ status: 'failure', message: 'Full name must be at least 3 characters long' });
  }

  if (!isFieldValid(address1, 5)) {
    return res.status(400).json({ status: 'failure', message: 'Address 1 must be at least 5 characters long' });
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ status: 'failure', message: 'Skills must be a non-empty array' });
  }

  if (!Array.isArray(availability) || availability.some(date => !isValidDate(date))) {
    return res.status(400).json({ status: 'failure', message: 'Availability must be a list of valid dates in the format YYYY-MM-DD' });
  }

  // Assuming user is fetched by email
  const email = 'user@example.com'; // Use the actual user email or ID for testing
  if (users[email]) {
    users[email].profile = { fullName, address1, skills, availability };
    res.status(200).json({ status: 'success', message: 'Profile updated successfully' });
  } else {
    res.status(404).json({ status: 'failure', message: 'User not found' });
  }
});


// Event creation route
app.post('/events', (req, res) => {
  const { eventName, eventLocation, requiredSkills, urgency, eventDate } = req.body;

  if (!isFieldValid(eventName, 3)) {
    return res.status(400).json({ status: 'failure', message: 'Event name must be at least 3 characters long' });
  }

  if (!isFieldValid(eventLocation, 5)) {
    return res.status(400).json({ status: 'failure', message: 'Event location must be at least 5 characters long' });
  }

  if (!requiredSkills || !Array.isArray(requiredSkills)) {
    return res.status(400).json({ status: 'failure', message: 'Required skills must be a non-empty array' });
  }

  if (!['high', 'medium', 'low'].includes(urgency)) {
    return res.status(400).json({ status: 'failure', message: 'Urgency must be one of high, medium, or low' });
  }

  if (!isValidDate(eventDate)) {
    return res.status(400).json({ status: 'failure', message: 'Event date must be in the format YYYY-MM-DD' });
  }

  const newEvent = { eventName, eventLocation, requiredSkills, urgency, eventDate };
  events.push(newEvent);
  res.status(201).json({ status: 'success', message: 'Event created successfully' });
});

// Volunteer matching route
app.post('/match', (req, res) => {
  const { volunteerName, eventName } = req.body;

  if (!isFieldValid(volunteerName, 3)) {
    return res.status(400).json({ status: 'failure', message: 'Volunteer name must be at least 3 characters long' });
  }

  const event = events.find(e => e.eventName === eventName);
  if (!event) {
    return res.status(404).json({ status: 'failure', message: 'Event not found' });
  }

  const user = users[volunteerName];  // Fetch the correct user (volunteer)
  if (!user) {
    return res.status(404).json({ status: 'failure', message: 'Volunteer not found' });
  }

  const { skills, availability } = user.profile;
  const hasRequiredSkills = event.requiredSkills.every(skill => skills.includes(skill));
  const isAvailable = availability.includes(event.eventDate);

  if (hasRequiredSkills && isAvailable) {
    volunteerHistory.push({ volunteerName, eventName, date: event.eventDate });
    return res.status(200).json({ status: 'success', message: `${volunteerName} has been matched to ${eventName}` });
  } else {
    return res.status(400).json({ status: 'failure', message: 'Volunteer does not meet the required skills or is unavailable' });
  }
});


// Notifications route
app.get('/notifications', (req, res) => {
  const notifications = [
    'You have been assigned to Community Cleanup on 2024-10-01',
    'Reminder: Food Drive is scheduled for 2024-09-15'
  ];
  res.status(200).json(notifications);
});

// History route (for displaying volunteer history)
app.get('/history', (req, res) => {
  res.status(200).json(volunteerHistory);
});

// Only for testing - Create a new user
app.post('/create-user', (req, res) => {
  const { email, password, skills, availability } = req.body;

  if (users[email]) {
    return res.status(400).json({ status: 'failure', message: 'User already exists' });
  }

  users[email] = { password, profile: { skills, availability } };
  res.status(201).json({ status: 'success', message: 'User created successfully' });
});


const PORT = 3001; // Change to a different port if 3000 is in use
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



// testing jest 
module.exports = app;

