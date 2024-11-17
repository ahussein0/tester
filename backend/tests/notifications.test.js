const request = require('supertest');
const app = require('../../app');

let server;

beforeAll(() => {
    server = app.listen(0); // Dynamic port
});

afterAll(() => {
    server.close();
});

describe('Notifications Routes', () => {
    test('GET /api/notifications - Fetch Notifications', async () => {
        const response = await request(server).get('/api/notifications');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Expecting an array
    });

    test('POST /api/notifications - Add Notification', async () => {
        const response = await request(server)
            .post('/api/notifications')
            .send({ message: 'New event assigned!' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Notification added successfully');
    });

    test('POST /api/notifications - Missing Fields', async () => {
        const response = await request(server).post('/api/notifications').send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Message is required');
    });
});
