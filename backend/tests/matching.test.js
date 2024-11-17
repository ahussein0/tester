const request = require('supertest');
const app = require('../../app');

let server;

beforeAll(() => {
    server = app.listen(0); // Dynamic port
});

afterAll(() => {
    server.close();
});

describe('Matching Routes', () => {
    test('POST /api/matching - Successful Match', async () => {
        const response = await request(server)
            .post('/api/matching')
            .send({ volunteerId: 1, eventId: 1 });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Matched successfully');
    });

    test('POST /api/matching - Missing Fields', async () => {
        const response = await request(server)
            .post('/api/matching')
            .send({ volunteerId: 1 }); // Missing eventId

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });
});
