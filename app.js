const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();

// Enable mongoose debugging
mongoose.set('debug', true);

// Middleware
app.use(bodyParser.json());

// MongoDB Connection with error handling and options
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    // Log connection details (remove in production)
    console.log('MongoDB Connection Details:');
    console.log('Database Name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Connected:', mongoose.connection.readyState === 1);
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

// Monitor MongoDB connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

// Log all MongoDB operations
mongoose.set('debug', {
    color: true,
    shell: true
});

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files from the frontend folder
app.use(express.static('frontend'));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

// Import routes
const authRoutes = require('./backend/routes/auth');
const profileRoutes = require('./backend/routes/profile');
const eventsRoutes = require('./backend/routes/events');
const matchingRoutes = require('./backend/routes/matching');
const notificationsRoutes = require('./backend/routes/notifications');
const historyRoutes = require('./backend/routes/history');
const reportRoutes = require('./backend/routes/reportRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/reports', reportRoutes);

// Add a test route to verify database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({
            status: 'Connected',
            collections: collections.map(c => c.name),
            databaseName: mongoose.connection.db.databaseName
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            error: error.message
        });
    }
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ 
        message: 'Resource not found',
        path: req.path 
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err);

    // MongoDB validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate Key Error',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@')); // Masked password
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    });
});

module.exports = app;