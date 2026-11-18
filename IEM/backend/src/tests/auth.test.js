const { validateRegister, validateLogin } = require('../validators/authValidator');

describe('Auth Validation Unit Tests', () => {
  test('rejects non-gmail addresses', () => {
    const res = validateRegister({
      fullName: 'Rahul Sharma',
      email: 'rahul@yahoo.com',
      phone: '9830123456',
      password: 'secretPassword123'
    });
    expect(res.valid).toBe(false);
  });

  test('accepts valid gmail address', () => {
    const res = validateRegister({
      fullName: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      phone: '9830123456',
      password: 'secretPassword123'
    });
    expect(res.valid).toBe(true);
  });
});

