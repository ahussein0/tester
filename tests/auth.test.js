// tests/auth.test.js
const request = require('supertest');
const app = require('../server');
const UserCredentials = require('../public/models/userCredentials');

describe('Authentication Routes', () => {
  beforeEach(async () => {
    await UserCredentials.deleteMany({});
  });

  it('should return an error if email is missing during registration', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ password: 'password123' }); // Missing email
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email is required');
  });

  it('should return an error if password is missing during registration', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'missingpassword@example.com' }); // Missing password
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password is required');
  });

  it('should return an error if email is missing during login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ password: 'password123' }); // Missing email
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email is required');
  });

  it('should return an error if password is missing during login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com' }); // Missing password
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password is required');
  });
});
