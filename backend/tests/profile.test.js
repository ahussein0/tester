const request = require('supertest');
const app = require('../../app');

describe('Profile Routes', () => {
    test('POST /api/profile - Update Profile', async () => {
        const userId = 'test-user-id';
        const profileData = {
            fullName: 'Test User',
            address1: '123 Test Street',
            city: 'Test City',
            state: 'TX',
            zipCode: '12345',
            skills: ['Communication', 'Leadership'],
            preferences: 'Flexible hours',
            availability: ['2024-11-20', '2024-11-21']
        };

        const response = await request(app)
            .post('/api/profile')
            .set('user-id', userId)
            .send(profileData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Profile updated successfully.');

    });

    test('POST /api/profile - Missing Required Fields', async () => {
        const response = await request(app)
            .post('/api/profile')
            .set('user-id', 'test-user-id')
            .send({ fullName: 'Incomplete Data' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All required fields must be provided');

    });
});
