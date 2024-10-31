const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../models/user');
const Event = require('../models/event');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

describe('Match API', () => {
    it('should match a volunteer to an event', async () => {
        const user = await User.create({ email: 'matchuser@example.com', password: 'password123', skills: ['Teamwork'] });
        const event = await Event.create({ eventName: 'Community Cleanup', requiredSkills: ['Teamwork'], urgency: 'high', eventDate: '2023-12-10' });

        const response = await request(app)
            .post('/api/match')
            .send({ userId: user._id, eventId: event._id });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Volunteer matched successfully');
    });
});

afterEach(async () => {
    await User.deleteMany({});
    await Event.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});
