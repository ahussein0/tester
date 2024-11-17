const request = require('supertest');
const app = require('../../app');

let server;

beforeAll(() => {
    server = app.listen(0); // Dynamic port
});

afterAll(() => {
    server.close();
});

describe('History Routes', () => {
    test('GET /api/history - Fetch Volunteer History', async () => {
        const response = await request(server).get('/api/history');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Expecting an array
    });

    test('POST /api/history - Add Volunteer History', async () => {
        const response = await request(server)
            .post('/api/history')
            .send({ eventName: 'Test Event', eventDate: '2024-11-20', status: 'Completed' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('History updated successfully');
    });

    test('POST /api/history - Missing Required Fields', async () => {
        const response = await request(server)
            .post('/api/history')
            .send({ eventName: 'Test Event' }); // Missing eventDate and status

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });
});
