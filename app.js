const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();

app.locals.volunteers = [];
app.locals.profiles = {};

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

// Serve static files from the frontend folder
app.use(express.static('frontend'));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

// Import routes - only import the routes we actually have
const authRoutes = require('./backend/routes/auth');
const profileRoutes = require('./backend/routes/profile');
const eventsRoutes = require('./backend/routes/events');
const matchingRoutes = require('./backend/routes/matching');
const notificationsRoutes = require('./backend/routes/notifications');
const historyRoutes = require('./backend/routes/history');
const reportRoutes = require('./backend/routes/reportRoutes'); // Import the reporting routes

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/reports', reportRoutes); // Add reporting module routes

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
