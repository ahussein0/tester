const request = require('supertest');
const app = require('./server');  // Import the app

describe('Comprehensive Application Tests', () => {

  // Test User Registration
  test('It should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'newuser@example.com', password: 'Password123' });
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
  });

  // Test User Registration with invalid email
  test('It should fail to register a user with invalid email', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'invalidEmail', password: 'Password123' });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('failure');
  });

  // Test User Login
  test('It should log in a registered user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'newuser@example.com', password: 'Password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });

  // Test User Login with wrong credentials
  test('It should fail to log in with wrong password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'newuser@example.com', password: 'WrongPassword' });
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('failure');
  });

  // Test Profile Update
test('It should successfully update the user profile', async () => {
    const response = await request(app)
      .post('/profile')
      .send({
        fullName: 'John Doe',  // Full name must be at least 3 characters long
        address1: '123 Main St',  // Address 1 must be at least 5 characters long
        address2: '',  // Optional field, so this is okay
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        skills: ['JavaScript'],  // Skills must be a non-empty array
        preferences: 'No preference',
        availability: ['2024-10-15', '2024-10-16']  // Availability must be an array of valid dates
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });
  
  // Test Event Creation
  test('It should create a new event', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        eventName: 'Tree Planting',
        eventDescription: 'Planting trees in the park',
        eventLocation: 'Central Park',
        requiredSkills: ['Gardening'],
        urgency: 'medium',
        eventDate: '2024-11-10'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
  });

  // Test Event Creation with missing fields
  test('It should fail to create an event with missing fields', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        eventName: '',
        eventDescription: 'Description is present',
        eventLocation: 'Some Location',
        requiredSkills: [],
        urgency: 'high',
        eventDate: '2024-11-10'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('failure');
  });

  // Test Volunteer Matching when skills match
  test('It should match a volunteer with matching skills to an event', async () => {
    // Create a user with matching skills
    await request(app)
      .post('/create-user')
      .send({
        email: 'volunteer1@example.com',
        password: 'password123',
        skills: ['Gardening'],
        availability: ['2024-11-10']
      });

    // Match the user to the event
    const response = await request(app)
      .post('/match')
      .send({
        volunteerName: 'volunteer1@example.com',
        eventName: 'Tree Planting'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });

  // Test Volunteer Matching when skills do not match
  test('It should fail to match a volunteer when skills do not match', async () => {
    // Create a user with non-matching skills
    await request(app)
      .post('/create-user')
      .send({
        email: 'volunteer2@example.com',
        password: 'password123',
        skills: ['Cooking'],
        availability: ['2024-11-10']
      });

    // Try to match the user to the event
    const response = await request(app)
      .post('/match')
      .send({
        volunteerName: 'volunteer2@example.com',
        eventName: 'Tree Planting'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('failure');
  });

  // Test Notifications
  test('It should retrieve notifications', async () => {
    const response = await request(app).get('/notifications');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test Volunteer History
  test('It should retrieve volunteer history', async () => {
    const response = await request(app).get('/history');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
