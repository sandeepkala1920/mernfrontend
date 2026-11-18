const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers');
const { verifyToken, requireAdmin } = require('../middleware');

// Protect all admin routes
router.use(verifyToken, requireAdmin);

// @route   GET /api/admin/stats
// @desc    Get real-time admission metrics
router.get('/stats', adminController.getStats);

// @route   GET /api/admin/applicants
// @desc    Get all applicants with search and filter
router.get('/applicants', adminController.getApplicants);

// @route   GET /api/admin/applicants/:id
// @desc    Get single applicant details
router.get('/applicants/:id', adminController.getApplicant);

// @route   PUT /api/admin/applicants/:id/decision
// @desc    Submit admission verdict (APPROVED, REJECTED, RE_UPLOAD_REQUEST)
router.put('/applicants/:id/decision', adminController.updateDecision);

// @route   PUT /api/admin/applicants/:id/verify-doc
// @desc    Toggle individual document status (VERIFIED / FLAGGED)
router.put('/applicants/:id/verify-doc', adminController.verifyDocument);

// @route   GET /api/admin/transactions
// @desc    Get financial payment logs
router.get('/transactions', adminController.getTransactions);

module.exports = router;

