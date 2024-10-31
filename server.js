require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the public folder

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


// Routes setup
app.use('/api/auth', require('./public/routes/authroutes'));
app.use('/api/profile', require('./public/routes/profileroutes'));
app.use('/api/events', require('./public/routes/eventroutes'));
app.use('/api/match', require('./public/routes/matchroutes'));
app.use('/api/notifications', require('./public/routes/notificationroutes'));

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
