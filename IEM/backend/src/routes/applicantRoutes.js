const express = require('express');
const router = express.Router();
const { applicantController } = require('../controllers');
const { verifyToken, upload } = require('../middleware');

// @route   GET /api/applicants/me
// @desc    Get current student's full profile and status
router.get('/me', verifyToken, applicantController.getProfile);

// @route   PUT /api/applicants/me
// @desc    Update personal and academic details
router.put('/me', verifyToken, applicantController.updateProfile);

// @route   POST /api/applicants/upload-file
// @desc    Direct multipart upload supporting both authenticated and quick sessions
router.post('/upload-file', upload.single('document'), applicantController.uploadFileQuick);

// @route   POST /api/applicants/me/upload-doc
// @desc    Upload individual credential (photo, marksheets, rankcard, id)
router.post(
  '/me/upload-doc',
  verifyToken,
  (req, res, next) => {
    upload.single('document')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message || 'File upload failed.' });
      }
      next();
    });
  },
  applicantController.uploadDocumentMe
);

// @route   POST /api/applicants/me/submit-for-review
// @desc    Submit uploaded documents for admin review
router.post('/me/submit-for-review', verifyToken, applicantController.submitForReview);

module.exports = router;

