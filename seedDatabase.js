const mongoose = require('mongoose');
const Volunteer = require('./backend/models/volunteer');
const Event = require('./backend/models/event');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await Volunteer.deleteMany({});
    await Event.deleteMany({});

    // Add sample volunteers
    const volunteers = await Volunteer.insertMany([
        {
            name: 'John Doe',
            email: 'john.doe@example.com',
            participation: []
        },
        {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            participation: []
        }
    ]);

    // Add sample events
    const events = await Event.insertMany([
        {
            name: 'Community Cleanup',
            date: new Date('2024-01-15'),
            volunteers: []
        },
        {
            name: 'Food Drive',
            date: new Date('2024-02-20'),
            volunteers: []
        }
    ]);

    console.log('Sample data added successfully');
    process.exit();
}).catch(err => {
    console.error('Error adding sample data:', err);
    process.exit(1);
});
