const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../../server');
const User = require('../models/user');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'testuser@example.com', password: 'password123' });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should log in an existing user', async () => {
        // Check if the user exists, if not, create with hashed password
        const existingUser = await User.findOne({ email: 'testuser@example.com' });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({ email: 'testuser@example.com', password: hashedPassword });
        }

        // Attempt to log in the existing user
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
    });
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});
