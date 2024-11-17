const request = require('supertest');
const app = require('../../app');

let server; // Server instance to dynamically assign a port

beforeAll(() => {
    // Start the server on a dynamic port
    server = app.listen(0); // 0 means the OS will assign a random available port
});

afterAll(async () => {
    // Close the server after all tests are finished
    server.close();
});

describe('Auth Routes', () => {
    test('POST /api/auth/register - Successful Registration', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Registration successful');
    });

    test('POST /api/auth/register - Duplicate Email', async () => {
        // First registration
        await request(server).post('/api/auth/register').send({ email: 'test@example.com', password: 'password123' });

        // Attempt duplicate registration
        const response = await request(server)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User already exists');
    });

    test('POST /api/auth/login - Successful Login', async () => {
        // Register first
        await request(server).post('/api/auth/register').send({ email: 'testlogin@example.com', password: 'password123' });

        // Login
        const response = await request(server)
            .post('/api/auth/login')
            .send({ email: 'testlogin@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
    });

    test('POST /api/auth/login - Invalid Login', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({ email: 'invalid@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });
});
