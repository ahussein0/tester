const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Notification = require('../models/notification');
const User = require('../models/user');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

describe('Notification API', () => {
    it('should retrieve notifications for the user', async () => {
        const user = await User.create({ email: 'notifyuser@example.com', password: 'password123' });
        await Notification.create({ userId: user._id, message: 'You have a new event assignment.' });
        
        const response = await request(app)
            .get('/api/notifications')
            .set('user-id', user._id.toString());
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

afterEach(async () => {
    await Notification.deleteMany({});
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});
