const { validateProfileUpdate } = require('../validators/applicantValidator');

describe('Applicant Validator Tests', () => {
  test('rejects class 10 score below 50%', () => {
    const res = validateProfileUpdate({ score10th: 42 });
    expect(res.valid).toBe(false);
  });

  test('accepts valid score and 12-digit aadhaar', () => {
    const res = validateProfileUpdate({
      score10th: 85,
      score12th: 82,
      aadharNumber: '123456789012'
    });
    expect(res.valid).toBe(true);
  });
});

