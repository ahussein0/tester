const request = require('supertest');
const app = require('../../app');

describe('Events Routes', () => {
    test('POST /api/events - Create Event', async () => {
        const eventData = {
            eventName: 'Test Event',
            eventDescription: 'This is a test event.',
            eventLocation: 'Test Location',
            requiredSkills: ['Leadership', 'Teamwork'],
            urgency: 'high',
            eventDate: '2024-11-25'
        };

        const response = await request(app)
            .post('/api/events')
            .send(eventData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Event created successfully');
    });

    test('POST /api/events - Missing Required Fields', async () => {
        const response = await request(app)
            .post('/api/events')
            .send({ eventName: 'Incomplete Event' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All required fields must be filled');
    });

    test('GET /api/events - Fetch All Events', async () => {
        const response = await request(app).get('/api/events');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
