const Applicant = require('../models/Applicant');
const { validateProfileUpdate } = require('../validators/applicantValidator');

const getProfileByEmail = async (email) => {
  const applicant = await Applicant.findOne({ email });
  if (!applicant) {
    const error = new Error('Applicant profile not found.');
    error.statusCode = 404;
    throw error;
  }
  return applicant;
};

const updateProfile = async (email, data) => {
  const applicant = await Applicant.findOne({ email });
  if (!applicant) {
    const error = new Error('Applicant profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const validation = validateProfileUpdate(data, applicant);
  if (!validation.valid) {
    const error = new Error(validation.message);
    error.statusCode = 400;
    throw error;
  }

  Object.assign(applicant, validation.updates);
  await applicant.save();
  return applicant;
};

const uploadDocument = async (email, docKey, file) => {
  if (!file) {
    const error = new Error('No file uploaded.');
    error.statusCode = 400;
    throw error;
  }

  const fileUrl = `/uploads/${file.filename}`;
  const docData = {
    name: file.originalname,
    fileUrl: fileUrl,
    status: 'UPLOADED',
    uploadedAt: new Date()
  };

  const updatedApplicant = await Applicant.findOneAndUpdate(
    { email },
    { $set: { [`documents.${docKey}`]: docData } },
    { new: true }
  );

  if (!updatedApplicant) {
    const error = new Error('Applicant profile not found.');
    error.statusCode = 404;
    throw error;
  }

  return {
    fileUrl,
    document: updatedApplicant.documents ? updatedApplicant.documents[docKey] : docData,
    applicant: updatedApplicant
  };
};

const submitForReview = async (email) => {
  const applicant = await Applicant.findOne({ email });
  if (!applicant) {
    const error = new Error('Applicant profile not found.');
    error.statusCode = 404;
    throw error;
  }

  if (!applicant.appFeePaid) {
    const error = new Error('Please pay the Application Fee (₹1,000) before submitting for review.');
    error.statusCode = 400;
    throw error;
  }

  const docCount = Object.keys(applicant.documents || {}).length;
  if (docCount < 2) {
    const error = new Error('Please upload at least your photograph and academic marksheets before submitting.');
    error.statusCode = 400;
    throw error;
  }

  const updatedApplicant = await Applicant.findOneAndUpdate(
    { email },
    {
      $set: {
        status: 'UNDER_REVIEW',
        adminRemarks: 'Documents submitted by candidate. In verification queue for Admission Officer review.'
      }
    },
    { new: true }
  );

  return updatedApplicant;
};

module.exports = {
  getProfileByEmail,
  updateProfile,
  uploadDocument,
  submitForReview
};

