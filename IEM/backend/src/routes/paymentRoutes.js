const express = require('express');
const router = express.Router();
const { paymentController } = require('../controllers');
const { verifyToken } = require('../middleware');

// @route   POST /api/payments/pay-app-fee
// @desc    Process Application / Registration Fee (₹1,000) - Exactly 1 transaction per student
router.post('/pay-app-fee', verifyToken, paymentController.payAppFee);

// @route   POST /api/payments/pay-admission-fee
// @desc    Process Admission Fee (e.g. ₹50,000) - Exactly 1 transaction per student
router.post('/pay-admission-fee', verifyToken, paymentController.payAdmissionFee);

// @route   POST /api/payments/pay-semester-fee
// @desc    Process 1st Semester Academic Tuition Fee (₹85,000) - Exactly 1 transaction per student
router.post('/pay-semester-fee', verifyToken, paymentController.paySemesterFee);

// @route   GET /api/payments/my-transactions
// @desc    Get current student's payment history (deduplicated)
router.get('/my-transactions', verifyToken, paymentController.getMyTransactions);

module.exports = router;

