const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const applicantRoutes = require('./applicantRoutes');
const adminRoutes = require('./adminRoutes');
const paymentRoutes = require('./paymentRoutes');

// Mount Sub-Routes
router.use('/auth', authRoutes);
router.use('/applicants', applicantRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;

