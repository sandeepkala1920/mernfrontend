const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

// @route   POST /api/auth/register
// @desc    Register new student with mandatory @gmail.com
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Student login using Gmail
router.post('/login', authController.login);

// @route   POST /api/auth/admin-login
// @desc    Admin authentication
router.post('/admin-login', authController.adminLogin);

module.exports = router;

