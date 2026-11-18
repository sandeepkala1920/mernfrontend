const { validatePhoneNumber } = require('../utils/validatePhone');

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

const validateRegister = (data) => {
  const { fullName, email, phone, countryCode, password } = data;

  if (!fullName || !email || !password || !phone) {
    return { valid: false, message: 'Please provide all mandatory fields.' };
  }

  const cleanFullName = (fullName || '').trim().replace(/\s+/g, ' ');
  if (!cleanFullName) {
    return { valid: false, message: 'Candidate Full Name is required.' };
  }

  if (cleanFullName.length > 60) {
    return {
      valid: false,
      message: 'Registration rejected: Candidate Full Name must not exceed 60 characters.'
    };
  }

  if (!/^[a-zA-Z\s.]+$/.test(cleanFullName)) {
    return {
      valid: false,
      message: 'Registration rejected: Candidate Full Name must contain only alphabets and spaces.'
    };
  }

  const nameParts = cleanFullName.split(' ').filter(Boolean);
  if (nameParts.length < 2) {
    return {
      valid: false,
      message: 'Registration rejected: Full Name must be in sequence (First Name and Last Name, e.g., Rahul Sharma).'
    };
  }

  for (let i = 0; i < nameParts.length; i++) {
    const part = nameParts[i];
    const pos = i === 0 ? 'First' : (i === nameParts.length - 1 ? 'Last' : 'Middle');
    if (!/^[A-Z]/.test(part)) {
      return {
        valid: false,
        message: `Registration rejected: ${pos} name "${part}" must start with a capital letter (e.g. Rahul Sharma).`
      };
    }
  }

  // Reject 3 or more consecutive repeating identical letters (e.g. "Rrrrr")
  if (/([a-zA-Z])\1{2,}/i.test(cleanFullName)) {
    return {
      valid: false,
      message: 'Registration rejected: Name cannot have more than 2 consecutive repeating letters (e.g., "Rrrr" is invalid).'
    };
  }

  for (const part of nameParts) {
    const letters = part.replace(/[^a-zA-Z]/g, '');
    if (part.endsWith('.') && letters.length === 1) {
      continue;
    }
    if (letters.length < 2) {
      return {
        valid: false,
        message: `Registration rejected: Name part "${part}" must have at least 2 letters.`
      };
    }
    if (letters.length > 25) {
      return {
        valid: false,
        message: `Registration rejected: Name part "${part}" exceeds maximum allowed length of 25 letters.`
      };
    }
    if (letters.length >= 3 && !/[aeiouyAEIOUY]/.test(letters)) {
      return {
        valid: false,
        message: `Registration rejected: Name part "${part}" must contain valid vowels.`
      };
    }
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!GMAIL_REGEX.test(cleanEmail)) {
    return {
      valid: false,
      message: 'Registration rejected: Only valid @gmail.com email addresses are allowed.'
    };
  }

  const cleanCountryCode = (countryCode || '+91').trim();
  const phoneCheck = validatePhoneNumber(cleanCountryCode, phone);
  if (!phoneCheck.valid) {
    return { valid: false, message: phoneCheck.message };
  }

  return {
    valid: true,
    cleanData: {
      fullName: cleanFullName,
      email: cleanEmail,
      phone: phoneCheck.cleanNumber,
      countryCode: cleanCountryCode,
      course: data.course || 'B.Tech Computer Science & Engineering',
      password
    }
  };
};

const validateLogin = (data) => {
  const { email, password } = data;
  if (!email || !password) {
    return { valid: false, message: 'Please provide email and password.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!GMAIL_REGEX.test(cleanEmail)) {
    return { valid: false, message: 'Please enter a valid @gmail.com address.' };
  }

  return { valid: true, cleanEmail, password };
};

module.exports = {
  GMAIL_REGEX,
  validateRegister,
  validateLogin
};

