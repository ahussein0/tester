const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }]
});

module.exports = mongoose.model('Event', EventSchema);
