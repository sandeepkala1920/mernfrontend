const paymentService = require('../services/paymentService');

const payAppFee = async (req, res, next) => {
  try {
    const { mode } = req.body;
    const result = await paymentService.payApplicationFee(req.user.email, mode);
    res.json({
      success: true,
      message: 'Registration Fee (₹1,000) processed successfully! Receipt is ready to print.',
      txnId: result.txnId,
      applicant: result.applicant
    });
  } catch (err) {
    if (err.txnId) {
      return res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
        txnId: err.txnId
      });
    }
    next(err);
  }
};

const payAdmissionFee = async (req, res, next) => {
  try {
    const { mode } = req.body;
    const result = await paymentService.payAdmissionFee(req.user.email, mode);
    res.json({
      success: true,
      message: '🎉 Provisional Admission Fee paid! Your seat allotment is permanently confirmed. Receipt is ready to print.',
      txnId: result.txnId,
      applicant: result.applicant
    });
  } catch (err) {
    if (err.txnId) {
      return res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
        txnId: err.txnId
      });
    }
    next(err);
  }
};

const paySemesterFee = async (req, res, next) => {
  try {
    const { mode } = req.body;
    const result = await paymentService.paySemesterFee(req.user.email, mode);
    res.json({
      success: true,
      message: '🎓 1st Semester Tuition Fee paid successfully! Receipt is ready to print.',
      txnId: result.txnId,
      applicant: result.applicant
    });
  } catch (err) {
    if (err.txnId) {
      return res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
        txnId: err.txnId
      });
    }
    next(err);
  }
};

const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await paymentService.getStudentTransactions(req.user.email);
    res.json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  payAppFee,
  payAdmissionFee,
  paySemesterFee,
  getMyTransactions
};

