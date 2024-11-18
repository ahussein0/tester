// backend/models/index.js
const Event = require('./Event');
const UserProfile = require('./UserProfile');
const UserCredentials = require('./UserCredentials');
const Volunteer = require('./Volunteer');
const Match = require('./Match');
const VolunteerHistory = require('./VolunteerHistory');

module.exports = {
    Event,
    UserProfile,
    UserCredentials,
    Volunteer,
    Match,
    VolunteerHistory
};