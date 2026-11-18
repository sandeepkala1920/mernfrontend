const Applicant = require('../models/Applicant');
const Transaction = require('../models/Transaction');

const payApplicationFee = async (email, mode) => {
  const applicant = await Applicant.findOne({ email });

  if (!applicant) {
    const error = new Error('Applicant record not found.');
    error.statusCode = 404;
    throw error;
  }

  if (applicant.appFeePaid) {
    const error = new Error('Registration fee has already been paid. Only 1 transaction is permitted per candidate.');
    error.statusCode = 400;
    throw error;
  }

  const existingTxn = await Transaction.findOne({
    $or: [{ appId: applicant.appId }, { candidateEmail: applicant.email }],
    type: 'Application Fee'
  });

  if (existingTxn) {
    applicant.appFeePaid = true;
    applicant.appFeeTxnId = existingTxn.txnId;
    applicant.appFeePaidAt = existingTxn.timestamp;
    await applicant.save();
    const error = new Error('Registration fee transaction already logged. Only 1 transaction is permitted.');
    error.statusCode = 400;
    error.txnId = existingTxn.txnId;
    throw error;
  }

  const txnId = 'TXN-APP-' + applicant.appId.split('-').pop() + '-' + Math.floor(100 + Math.random() * 900);
  const timestamp = new Date();

  applicant.appFeePaid = true;
  applicant.appFeeTxnId = txnId;
  applicant.appFeePaidAt = timestamp;
  if (applicant.status === 'APP_FEE_PENDING') {
    applicant.status = 'UNDER_REVIEW';
  }

  await applicant.save();

  const transaction = new Transaction({
    txnId,
    appId: applicant.appId,
    candidateName: applicant.fullName,
    candidateEmail: applicant.email,
    type: 'Application Fee',
    amount: 1000,
    mode: mode || 'Online UPI / Card',
    status: 'SUCCESS',
    timestamp
  });

  await transaction.save();

  return { txnId, applicant };
};

const payAdmissionFee = async (email, mode) => {
  const applicant = await Applicant.findOne({ email });

  if (!applicant) {
    const error = new Error('Applicant record not found.');
    error.statusCode = 404;
    throw error;
  }

  if (applicant.status !== 'APPROVED' && applicant.status !== 'ADMITTED') {
    const error = new Error('Admission fee can only be paid after your documents are approved by the administrator.');
    error.statusCode = 400;
    throw error;
  }

  if (applicant.admissionFeePaid) {
    const error = new Error('Admission fee has already been paid. Only 1 transaction is permitted per candidate.');
    error.statusCode = 400;
    throw error;
  }

  const existingTxn = await Transaction.findOne({
    $or: [{ appId: applicant.appId }, { candidateEmail: applicant.email }],
    type: 'Admission Seat Fee'
  });

  if (existingTxn) {
    applicant.admissionFeePaid = true;
    applicant.admissionFeeTxnId = existingTxn.txnId;
    applicant.admissionFeePaidAt = existingTxn.timestamp;
    applicant.status = 'ADMITTED';
    await applicant.save();
    const error = new Error('Admission fee transaction already logged. Only 1 transaction is permitted.');
    error.statusCode = 400;
    error.txnId = existingTxn.txnId;
    throw error;
  }

  const txnId = 'TXN-ADM-' + applicant.appId.split('-').pop() + '-' + Math.floor(100 + Math.random() * 900);
  const timestamp = new Date();
  const amount = applicant.admissionFeeAmount || 50000;

  applicant.admissionFeePaid = true;
  applicant.admissionFeeTxnId = txnId;
  applicant.admissionFeePaidAt = timestamp;
  applicant.status = 'ADMITTED';

  await applicant.save();

  const transaction = new Transaction({
    txnId,
    appId: applicant.appId,
    candidateName: applicant.fullName,
    candidateEmail: applicant.email,
    type: 'Admission Seat Fee',
    amount: amount,
    mode: mode || 'Net Banking / UPI',
    status: 'SUCCESS',
    timestamp
  });

  await transaction.save();

  return { txnId, applicant };
};

const paySemesterFee = async (email, mode) => {
  const applicant = await Applicant.findOne({ email });

  if (!applicant) {
    const error = new Error('Applicant record not found.');
    error.statusCode = 404;
    throw error;
  }

  if (!applicant.admissionFeePaid && applicant.status !== 'ADMITTED') {
    const error = new Error('Provisional admission fee must be paid before semester tuition fee.');
    error.statusCode = 400;
    throw error;
  }

  if (applicant.semesterFeePaid) {
    const error = new Error('Semester tuition fee has already been paid. Only 1 transaction is permitted per candidate.');
    error.statusCode = 400;
    throw error;
  }

  const existingTxn = await Transaction.findOne({
    $or: [{ appId: applicant.appId }, { candidateEmail: applicant.email }],
    type: { $in: ['Semester Tuition Fee', '1st Semester Tuition Fee'] }
  });

  if (existingTxn) {
    applicant.semesterFeePaid = true;
    applicant.semesterFeeTxnId = existingTxn.txnId;
    applicant.semesterFeePaidAt = existingTxn.timestamp;
    await applicant.save();
    const error = new Error('Semester tuition fee transaction already logged. Only 1 transaction is permitted.');
    error.statusCode = 400;
    error.txnId = existingTxn.txnId;
    throw error;
  }

  const txnId = 'TXN-SEM-' + applicant.appId.split('-').pop() + '-' + Math.floor(100 + Math.random() * 900);
  const timestamp = new Date();
  const amount = applicant.semesterFeeAmount || 85000;

  applicant.semesterFeePaid = true;
  applicant.semesterFeeTxnId = txnId;
  applicant.semesterFeePaidAt = timestamp;

  await applicant.save();

  const transaction = new Transaction({
    txnId,
    appId: applicant.appId,
    candidateName: applicant.fullName,
    candidateEmail: applicant.email,
    type: 'Semester Tuition Fee',
    amount: amount,
    mode: mode || 'Net Banking / UPI',
    status: 'SUCCESS',
    timestamp
  });

  await transaction.save();

  return { txnId, applicant };
};

const getStudentTransactions = async (email) => {
  const applicant = await Applicant.findOne({ email });
  if (!applicant) {
    const error = new Error('Applicant not found.');
    error.statusCode = 404;
    throw error;
  }

  const allTransactions = await Transaction.find({
    $or: [{ appId: applicant.appId }, { candidateEmail: applicant.email }]
  }).sort({ timestamp: -1 });

  const uniqueMap = new Map();
  allTransactions.forEach(t => {
    let key = 'OTHER';
    if (t.type.includes('Application') || t.type.includes('Registration')) key = 'REGISTRATION';
    else if (t.type.includes('Admission')) key = 'ADMISSION';
    else if (t.type.includes('Semester')) key = 'SEMESTER';

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, t);
    }
  });

  return Array.from(uniqueMap.values());
};

module.exports = {
  payApplicationFee,
  payAdmissionFee,
  paySemesterFee,
  getStudentTransactions
};

