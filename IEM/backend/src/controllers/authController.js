const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const result = await authService.registerStudent(req.body);
    res.status(201).json({
      success: true,
      message: `Candidate registered successfully! Application ID: ${result.appId}`,
      token: result.token,
      applicant: result.applicant
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginStudent(req.body);
    res.json({
      success: true,
      message: `Welcome back, ${result.applicant.fullName}!`,
      token: result.token,
      applicant: result.applicant
    });
  } catch (err) {
    next(err);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const result = await authService.loginAdmin(req.body);
    res.json({
      success: true,
      message: 'Administrator authentication successful.',
      token: result.token,
      admin: result.admin
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  adminLogin
};

