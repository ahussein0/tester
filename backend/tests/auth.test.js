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
        expect(response.body).toHaveProperty('message', 'Registration successful');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    test('POST /api/auth/register - Duplicate Email', async () => {
        // First registration
        await request(server).post('/api/auth/register').send({ email: 'test@example.com', password: 'password123' });

        // Attempt duplicate registration
        const response = await request(server)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'User already exists');
        expect(response.body).not.toHaveProperty('user');
    });

    test('POST /api/auth/register - Missing Password', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({ email: 'missingpassword@example.com' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Password is required');
    });

    test('POST /api/auth/register - Invalid Email Format', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({ email: 'invalidemail', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid email format');
    });

    test('POST /api/auth/login - Successful Login', async () => {
        // Register first
        await request(server).post('/api/auth/register').send({ email: 'testlogin@example.com', password: 'password123' });

        // Login
        const response = await request(server)
            .post('/api/auth/login')
            .send({ email: 'testlogin@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');
    });

    test('POST /api/auth/login - Invalid Login', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({ email: 'invalid@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid email or password');
        expect(response.body).not.toHaveProperty('token');
    });

    test('POST /api/auth/login - Missing Fields', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({ email: 'missingfields@example.com' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Email and password are required');
    });
});
