const Applicant = require('../models/Applicant');
const Transaction = require('../models/Transaction');

const getAdminStats = async () => {
  const totalApplicants = await Applicant.countDocuments();
  const pendingReviews = await Applicant.countDocuments({ status: 'UNDER_REVIEW' });
  const approvedSeats = await Applicant.countDocuments({ status: 'APPROVED' });
  const confirmedAdmissions = await Applicant.countDocuments({ status: 'ADMITTED' });

  const txns = await Transaction.find();
  const totalRevenue = txns.reduce((sum, t) => sum + (t.amount || 0), 0);

  return {
    totalApplicants,
    pendingReviews,
    approvedSeats,
    confirmedAdmissions,
    totalRevenue
  };
};

const getApplicantsList = async (filters = {}) => {
  const { search, status, course } = filters;
  let query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { appId: { $regex: search, $options: 'i' } }
    ];
  }

  if (status && status !== 'ALL') {
    query.status = status;
  }

  if (course && course !== 'ALL') {
    query.course = course;
  }

  const applicants = await Applicant.find(query).sort({ createdAt: -1 });
  return applicants;
};

const getApplicantById = async (appId) => {
  const applicant = await Applicant.findOne({ appId });
  if (!applicant) {
    const error = new Error('Applicant not found.');
    error.statusCode = 404;
    throw error;
  }
  return applicant;
};

const updateApplicantDecision = async (appId, decisionData) => {
  const { verdict, remarks, admissionFeeAmount } = decisionData;
  const applicant = await Applicant.findOne({ appId });

  if (!applicant) {
    const error = new Error('Applicant not found.');
    error.statusCode = 404;
    throw error;
  }

  applicant.status = verdict;
  applicant.adminRemarks = remarks || (verdict === 'APPROVED'
    ? `Documents thoroughly verified. Provisional seat allocated in ${applicant.course}. Please pay the admission fee to confirm enrollment.`
    : 'Application updated by admission officer.');

  if (admissionFeeAmount) {
    applicant.admissionFeeAmount = parseFloat(admissionFeeAmount);
  }

  await applicant.save();
  return applicant;
};

const verifyDocument = async (appId, docKey, status) => {
  const applicant = await Applicant.findOne({ appId });

  if (!applicant || !applicant.documents || !applicant.documents[docKey]) {
    const error = new Error('Document record not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedApplicant = await Applicant.findOneAndUpdate(
    { appId },
    {
      $set: {
        [`documents.${docKey}.status`]: status,
        [`documents.${docKey}.verifiedAt`]: new Date()
      }
    },
    { new: true }
  );

  return updatedApplicant.documents[docKey];
};

const getTransactionsLedger = async () => {
  return await Transaction.find().sort({ timestamp: -1 });
};

module.exports = {
  getAdminStats,
  getApplicantsList,
  getApplicantById,
  updateApplicantDecision,
  verifyDocument,
  getTransactionsLedger
};

