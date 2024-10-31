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

describe('Profile API', () => {
    let user;

    beforeEach(async () => {
        // Create a test user with hashed password
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = await User.create({
            email: 'testuser@example.com',
            password: hashedPassword,
            fullName: 'John Doe',
            address1: '123 Main St',
            city: 'Houston',
            state: 'TX',
            zipCode: '77001',
            skills: ['Teamwork'],
            preferences: 'Flexible',
            availability: ['2023-12-10'],
        });
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should update the user profile', async () => {
        const response = await request(app)
            .put('/api/profile') // Ensure this matches the route in server.js
            .set('user-id', user._id.toString())
            .send({
                fullName: 'John Smith',
                address1: '456 Another St',
                city: 'Austin',
                state: 'TX',
                zipCode: '73301',
                skills: ['Leadership', 'Communication'],
                preferences: 'Weekends',
                availability: ['2023-12-10', '2023-12-11'],
            });
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Profile updated successfully');
    });

    it('should retrieve the user profile', async () => {
        const response = await request(app)
            .get('/api/profile')
            .set('user-id', user._id.toString());

        expect(response.status).toBe(200);
        expect(response.body.fullName).toBe('John Doe');
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
