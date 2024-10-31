const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');
const { UserCredentials, UserProfile, EventDetails, VolunteerHistory } = require('./public/models');

jest.setTimeout(30000);

describe('Database Connection', () => {
  test('should connect to MongoDB Atlas', async () => {
    try {
      await mongoose.connect('mongodb+srv://anastasiashark:gG8KpayxyLLv0v0z@cluster0.7dqmvqo.mongodb.net/volunteer_test_db');
      console.log('MongoDB Atlas Connected Successfully');
      expect(mongoose.connection.readyState).toBe(1);
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  });
});

describe('API Tests', () => {
  let userId;
  let eventId;

  // Connect and clean up before tests
  beforeAll(async () => {
    try {
      console.log('Connecting to MongoDB Atlas...');
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect('mongodb+srv://anastasiashark:gG8KpayxyLLv0v0z@cluster0.7dqmvqo.mongodb.net/volunteer_test_db');
      }
      console.log('Connected successfully');

      // Clear test data
      await Promise.all([
        UserCredentials.deleteMany({}),
        UserProfile.deleteMany({}),
        EventDetails.deleteMany({}),
        VolunteerHistory.deleteMany({})
      ]);
      console.log('Test database cleared');
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  // Disconnect after tests
  afterAll(async () => {
    try {
      await mongoose.connection.close();
      console.log('Test database connection closed');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  });

  // Authentication Tests
  describe('Authentication', () => {
    test('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User',
          address: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zipcode: '12345',
          skills: ['coding']
        });

      console.log('Register response:', res.body);
      expect(res.status).toBe(201);
    });

    test('should login user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      console.log('Login response:', res.body);
      expect(res.status).toBe(200);
      userId = res.body.user.id;
    });
  });

  // Events Tests
  describe('Events', () => {
    test('should create new event', async () => {
      const res = await request(app)
        .post('/events')
        .send({
          eventName: 'Test Event',
          description: 'Test Description',
          location: {
            address: '456 Event St',
            city: 'Event City',
            state: 'CA',
            zipcode: '12345'
          },
          requiredSkills: ['coding'],
          eventDate: new Date()
        });

      console.log('Create event response:', res.body);
      expect(res.status).toBe(201);
      eventId = res.body._id;
    });

    test('should get all events', async () => {
      const res = await request(app)
        .get('/events');
      console.log('Get events response:', res.body);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  // Profile Tests
  describe('Profile', () => {
    test('should get user profile', async () => {
      const res = await request(app)
        .get(`/profile/${userId}`);
      console.log('Get profile response:', res.body);
      expect(res.status).toBe(200);
    });
  });
});