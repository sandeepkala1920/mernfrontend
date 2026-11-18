const jwt = require('jsonwebtoken');
const Applicant = require('../models/Applicant');
const config = require('../config/env');
const { validateRegister, validateLogin } = require('../validators/authValidator');

const registerStudent = async (data) => {
  const validation = validateRegister(data);
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const { fullName, email, phone, countryCode, course, password } = validation.cleanData;

  const existing = await Applicant.findOne({ email });
  if (existing) {
    const error = new Error('An application with this Gmail ID already exists. Please login instead.');
    error.statusCode = 400;
    throw error;
  }

  const appId = 'IEM-2026-' + Math.floor(1000 + Math.random() * 9000);

  const applicant = new Applicant({
    appId,
    fullName,
    email,
    phone,
    countryCode,
    course,
    password,
    status: 'APP_FEE_PENDING',
    adminRemarks: 'Registration completed. Please upload mandatory documents and proceed to application fee.'
  });

  await applicant.save();

  const token = jwt.sign(
    { id: applicant._id, appId: applicant.appId, email: applicant.email, role: 'student', name: applicant.fullName },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const applicantObj = applicant.toObject();
  delete applicantObj.password;

  return {
    appId,
    token,
    applicant: applicantObj
  };
};

const loginStudent = async (data) => {
  const validation = validateLogin(data);
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  const { cleanEmail, password } = validation;

  const applicant = await Applicant.findOne({ email: cleanEmail });
  if (!applicant) {
    const error = new Error('No student record found with this Gmail ID.');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await applicant.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid password credentials.');
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    { id: applicant._id, appId: applicant.appId, email: applicant.email, role: 'student', name: applicant.fullName },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const applicantObj = applicant.toObject();
  delete applicantObj.password;

  return {
    token,
    applicant: applicantObj
  };
};

const loginAdmin = async (data) => {
  const { email, password } = data;
  const adminEmail = config.ADMIN_EMAIL;
  const adminPassword = config.ADMIN_PASSWORD;

  if (email && email.trim().toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    const token = jwt.sign(
      { email: adminEmail, role: 'admin', name: 'Admissions Officer' },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      admin: {
        email: adminEmail,
        role: 'admin',
        name: 'Admissions Officer'
      }
    };
  }

  const error = new Error('Invalid administrator credentials.');
  error.statusCode = 401;
  throw error;
};

module.exports = {
  registerStudent,
  loginStudent,
  loginAdmin
};

