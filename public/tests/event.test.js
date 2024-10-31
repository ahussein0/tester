const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Event = require('../models/event');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

describe('Event API', () => {
    it('should create a new event', async () => {
        const response = await request(app)
            .post('/api/events')
            .send({
                eventName: 'Community Cleanup',
                eventDescription: 'A volunteer event to clean up the local park.',
                eventLocation: 'Central Park',
                requiredSkills: ['Teamwork', 'Organization'],
                urgency: 'high',
                eventDate: '2023-12-10',
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Event created successfully');
    });

    it('should retrieve events', async () => {
        await Event.create({ eventName: 'Community Cleanup', eventDescription: 'A cleanup event.', urgency: 'high', eventDate: '2023-12-10' });
        const response = await request(app).get('/api/events');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

afterEach(async () => {
    await Event.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});
