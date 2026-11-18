const adminService = require('../services/adminService');

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getAdminStats();
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

const getApplicants = async (req, res, next) => {
  try {
    const applicants = await adminService.getApplicantsList(req.query);
    res.json({ success: true, count: applicants.length, applicants });
  } catch (err) {
    next(err);
  }
};

const getApplicant = async (req, res, next) => {
  try {
    const applicant = await adminService.getApplicantById(req.params.id);
    res.json({ success: true, applicant });
  } catch (err) {
    next(err);
  }
};

const updateDecision = async (req, res, next) => {
  try {
    const applicant = await adminService.updateApplicantDecision(req.params.id, req.body);
    res.json({
      success: true,
      message: `Applicant ${applicant.fullName} marked as ${applicant.status}!`,
      applicant
    });
  } catch (err) {
    next(err);
  }
};

const verifyDocument = async (req, res, next) => {
  try {
    const { docKey, status } = req.body;
    const document = await adminService.verifyDocument(req.params.id, docKey, status);
    res.json({
      success: true,
      message: `Document marked as ${status}.`,
      document
    });
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await adminService.getTransactionsLedger();
    res.json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getApplicants,
  getApplicant,
  updateDecision,
  verifyDocument,
  getTransactions
};

