// tests/profile.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const UserCredentials = require('../public/models/userCredentials');
const UserProfile = require('../public/models/userProfile');

describe('Profile Routes', () => {
  let userId;

  beforeEach(async () => {
    await UserCredentials.deleteMany({});
    await UserProfile.deleteMany({});
    
    const user = new UserCredentials({ email: `testuser${Date.now()}@example.com`, password: 'password123' });
    await user.save();
    userId = user._id;
  });

  it('should return an error if required profile fields are missing', async () => {
    const res = await request(app)
      .post('/profile')
      .send({
        userId: userId.toString(),
        fullName: 'Test User',
        // Missing address1, city, and other required fields
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Required fields are missing');
  });
});
