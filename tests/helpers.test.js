// tests/helpers.test.js
const { validateEmail } = require('../public/helpers');

describe('Helper Functions', () => {
  it('should validate a correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should invalidate an incorrect email format', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
