const { validatePhoneNumber } = require('../utils/validatePhone');

const validateProfileUpdate = (data, existingData = {}) => {
  const updates = {};

  if (data.fullName) {
    const cleanFullName = data.fullName.trim().replace(/\s+/g, ' ');
    if (cleanFullName.length > 60) {
      return { valid: false, message: 'Candidate Full Name must not exceed 60 characters.' };
    }
    if (!/^[a-zA-Z\s.]+$/.test(cleanFullName)) {
      return { valid: false, message: 'Candidate Full Name must contain only alphabets and spaces.' };
    }
    const nameParts = cleanFullName.split(' ').filter(Boolean);
    if (nameParts.length < 2) {
      return { valid: false, message: 'Candidate Full Name must be in sequence (First Name and Last Name, e.g., Rahul Sharma).' };
    }
    for (let i = 0; i < nameParts.length; i++) {
      const part = nameParts[i];
      const pos = i === 0 ? 'First' : (i === nameParts.length - 1 ? 'Last' : 'Middle');
      if (!/^[A-Z]/.test(part)) {
        return {
          valid: false,
          message: `${pos} name "${part}" must start with a capital letter (e.g. Rahul Sharma).`
        };
      }
    }
    if (/([a-zA-Z])\1{2,}/i.test(cleanFullName)) {
      return { valid: false, message: 'Candidate Full Name cannot have more than 2 consecutive repeating letters (e.g. "Rrrr").' };
    }
    for (const part of nameParts) {
      const letters = part.replace(/[^a-zA-Z]/g, '');
      if (part.endsWith('.') && letters.length === 1) continue;
      if (letters.length < 2) {
        return { valid: false, message: `Name part "${part}" must have at least 2 letters.` };
      }
      if (letters.length > 25) {
        return { valid: false, message: `Name part "${part}" exceeds maximum allowed length of 25 letters.` };
      }
      if (letters.length >= 3 && !/[aeiouyAEIOUY]/.test(letters)) {
        return { valid: false, message: `Name part "${part}" must contain valid vowels.` };
      }
    }
    updates.fullName = cleanFullName;
  }

  if (data.countryCode !== undefined) {
    updates.countryCode = data.countryCode.trim();
  }

  if (data.phone !== undefined) {
    const code = (data.countryCode || existingData.countryCode || '+91').trim();
    const phoneCheck = validatePhoneNumber(code, data.phone);
    if (!phoneCheck.valid) {
      return { valid: false, message: phoneCheck.message };
    }
    updates.phone = phoneCheck.cleanNumber;
  }

  if (data.aadharNumber !== undefined) {
    const cleanAadhar = data.aadharNumber.replace(/\s+|-/g, '').trim();
    if (cleanAadhar && !/^[0-9]{12}$/.test(cleanAadhar)) {
      return { valid: false, message: 'Aadhaar Card Number must be exactly 12 digits.' };
    }
    updates.aadharNumber = cleanAadhar;
  }

  if (data.fatherName !== undefined) {
    const cleanFather = data.fatherName.trim();
    if (cleanFather && (!/^[a-zA-Z\s.]+$/.test(cleanFather) || cleanFather.replace(/[^a-zA-Z]/g, '').length < 2)) {
      return { valid: false, message: "Father's / Guardian's Name must contain only alphabets and spaces." };
    }
    updates.fatherName = cleanFather;
  }

  if (data.dob) {
    const dobDate = new Date(data.dob);
    if (isNaN(dobDate.getTime())) {
      return { valid: false, message: 'Invalid Date of Birth.' };
    }
    const birthYear = dobDate.getFullYear();
    if (birthYear < 2000 || birthYear > 2015) {
      return {
        valid: false,
        message: `Eligibility criteria not met: Candidate birth year (${birthYear}) must be between 2000 and 2015.`
      };
    }
    updates.dob = data.dob;
  }

  if (data.gender) updates.gender = data.gender;
  if (data.category) updates.category = data.category;
  if (data.address !== undefined) updates.address = data.address.trim();
  if (data.course) updates.course = data.course;

  if (data.score10th !== undefined) {
    const s10 = parseFloat(data.score10th);
    if (isNaN(s10) || s10 < 50 || s10 > 100) {
      return {
        valid: false,
        message: 'Eligibility criteria not met: Class 10th marks must be at least 50% for admission eligibility (50% to 100%).'
      };
    }
    updates.score10th = s10;
  }

  if (data.score12th !== undefined) {
    const s12 = parseFloat(data.score12th);
    if (isNaN(s12) || s12 <= 60 || s12 > 100) {
      return {
        valid: false,
        message: 'Eligibility criteria not met: Class 12th marks must be above 60% for admission eligibility (Must be greater than 60%).'
      };
    }
    updates.score12th = s12;
  }

  if (data.examType) updates.examType = data.examType;

  if (data.examRank !== undefined) {
    const cleanRank = data.examRank.trim();
    if (cleanRank.toLowerCase() === 'pending verification') {
      return {
        valid: false,
        message: 'Entrance exam rank cannot be "Pending Verification". Please provide your actual rank under 1 Lakh.'
      };
    }
    const numMatch = cleanRank.replace(/,/g, '').match(/\d+/);
    if (!numMatch) {
      return { valid: false, message: 'Entrance exam rank must contain a valid numeric rank.' };
    }
    const num = parseInt(numMatch[0], 10);
    if (num <= 0 || num > 100000) {
      return {
        valid: false,
        message: 'Entrance exam rank must be under 1 Lakh (1 to 1,00,000) for admission eligibility.'
      };
    }
    updates.examRank = cleanRank;
  }

  return { valid: true, updates };
};

module.exports = { validateProfileUpdate };

