const applicantService = require('../services/applicantService');
const Applicant = require('../models/Applicant');
const mongoose = require('mongoose');

const getProfile = async (req, res, next) => {
  try {
    const applicant = await applicantService.getProfileByEmail(req.user.email);
    res.json({ success: true, applicant });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const applicant = await applicantService.updateProfile(req.user.email, req.body);
    res.json({ success: true, message: 'Application details updated successfully.', applicant });
  } catch (err) {
    next(err);
  }
};

const uploadFileQuick = async (req, res, next) => {
  try {
    const { docKey, email } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    if (email && mongoose.connection.readyState === 1) {
      try {
        const applicant = await Applicant.findOne({ email: email.toLowerCase() });
        if (applicant) {
          if (!applicant.documents) applicant.documents = {};
          applicant.documents[docKey || 'doc'] = {
            name: req.file.originalname,
            fileUrl: fileUrl,
            status: 'UPLOADED',
            uploadedAt: new Date()
          };
          await applicant.save();
        }
      } catch (dbErr) {
        console.warn('DB record sync deferred:', dbErr.message);
      }
    }

    res.json({
      success: true,
      message: `${req.file.originalname} saved to uploads successfully!`,
      fileUrl: fileUrl,
      filename: req.file.originalname
    });
  } catch (err) {
    next(err);
  }
};

const uploadDocumentMe = async (req, res, next) => {
  try {
    const { docKey } = req.body;
    if (!docKey) {
      return res.status(400).json({ success: false, message: 'docKey parameter is required.' });
    }

    const result = await applicantService.uploadDocument(req.user.email, docKey, req.file);
    res.json({
      success: true,
      message: `${req.file.originalname} uploaded successfully!`,
      document: result.document,
      applicant: result.applicant
    });
  } catch (err) {
    next(err);
  }
};

const submitForReview = async (req, res, next) => {
  try {
    const applicant = await applicantService.submitForReview(req.user.email);
    res.json({
      success: true,
      message: 'Application successfully queued for Admission Officer verification!',
      applicant
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadFileQuick,
  uploadDocumentMe,
  submitForReview
};

