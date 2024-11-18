const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB using the URI from your .env file
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a simple schema for a volunteer
const volunteerSchema = new mongoose.Schema({
    name: String,
    skills: [String],
    availability: String,
});

// Create a model based on the schema
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// Create a new volunteer object
const newVolunteer = new Volunteer({
    name: 'John Doe',
    skills: ['JavaScript', 'Node.js'],
    availability: 'Weekends',
});

// Save the new volunteer to the database
newVolunteer.save()
    .then((doc) => {
        console.log('Volunteer saved:', doc);
        mongoose.connection.close(); // Close the connection after saving
    })
    .catch((err) => {
        console.error('Error saving volunteer:', err);
        mongoose.connection.close();
    });
