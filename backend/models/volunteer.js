const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    participation: [
        {
            eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
            date: { type: Date }
        }
    ]
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
