const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  txnId: {
    type: String,
    required: true,
    unique: true
  },
  appId: {
    type: String,
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  candidateEmail: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Application Fee', 'Admission Seat Fee', 'Semester Tuition Fee', '1st Semester Tuition Fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    default: 'Online UPI / Card'
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'PENDING', 'FAILED'],
    default: 'SUCCESS'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
