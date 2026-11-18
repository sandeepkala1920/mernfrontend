function validatePhoneNumber(countryCode, phoneNumber) {
  if (!phoneNumber) {
    return { valid: false, message: 'Phone number is required.' };
  }

  const cleanNumber = phoneNumber.toString().replace(/[\s\-\(\)]/g, '').trim();

  if (countryCode === '+91' || !countryCode) {
    const indianRegex = /^[6-9]\d{9}$/;
    if (!indianRegex.test(cleanNumber)) {
      return {
        valid: false,
        message: 'Invalid Indian phone number. Must be exactly 10 digits starting with 6, 7, 8, or 9.'
      };
    }
  } else {
    const intlRegex = /^\d{7,15}$/;
    if (!intlRegex.test(cleanNumber)) {
      return {
        valid: false,
        message: 'Invalid international phone number. Must contain 7 to 15 digits.'
      };
    }
  }

  return { valid: true, cleanNumber };
}

module.exports = { validatePhoneNumber };

