// tests/event.test.js
const request = require('supertest');
const app = require('../server');

describe('Event Routes', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        eventName: 'Community Cleanup',
        eventDescription: 'Help clean up the community park',
        eventLocation: 'Central Park',
        requiredSkills: ['Teamwork', 'Organization'],
        urgency: 'high',
        eventDate: '2023-11-10'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });

  it('should retrieve all events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
