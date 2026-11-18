const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Strict Gmail Validator Regex
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'UPLOADED', 'VERIFIED', 'FLAGGED'], 
    default: 'UPLOADED' 
  },
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date }
});

const ApplicantSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true,
    maxlength: [60, 'Candidate Full Name cannot exceed 60 characters'],
    validate: {
      validator: function(v) {
        if (!v) return false;
        const clean = v.trim().replace(/\s+/g, ' ');
        if (clean.length > 60) return false;
        if (!/^[a-zA-Z\s.]+$/.test(clean)) return false;
        const parts = clean.split(' ').filter(Boolean);
        return parts.length >= 2 && clean.replace(/[^a-zA-Z]/g, '').length >= 3;
      },
      message: 'Candidate Full Name must be in sequence (First Name and Last Name) and not more than 60 characters.'
    }
  },
  email: {
    type: String,
    required: [true, 'Gmail ID is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return GMAIL_REGEX.test(v);
      },
      message: props => `${props.value} is not a valid Gmail address! Only @gmail.com IDs are accepted.`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phone: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return false;
        const clean = v.replace(/[\s\-()]/g, '');
        if (clean.length >= 6 && /^(\d)\1+$/.test(clean)) return false;
        if (clean.startsWith('0')) return false;
        return /^\+?[0-9]{7,15}$/.test(clean);
      },
      message: 'Mobile number must be a valid non-repeating number between 7 and 15 digits.'
    }
  },
  countryCode: {
    type: String,
    default: '+91',
    trim: true
  },
  aadharNumber: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true;
        const clean = v.replace(/\s+|-/g, '');
        return /^[0-9]{12}$/.test(clean);
      },
      message: 'Aadhaar Number must be exactly 12 digits.'
    }
  },
  fatherName: { 
    type: String, 
    default: '',
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[a-zA-Z\s.]+$/.test(v) && v.replace(/[^a-zA-Z]/g, '').length >= 2;
      },
      message: "Father's / Guardian's Name must contain only alphabets and spaces."
    }
  },
  dob: { 
    type: String, 
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true;
        const dobDate = new Date(v);
        if (isNaN(dobDate.getTime())) return false;
        const birthYear = dobDate.getFullYear();
        return birthYear >= 2000 && birthYear <= 2015;
      },
      message: 'Candidate birth year must be between 2000 and 2015.'
    }
  },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS'], default: 'General' },
  address: { type: String, default: '' },
  course: {
    type: String,
    required: true,
    default: 'B.Tech Computer Science & Engineering'
  },
  score10th: { 
    type: Number, 
    max: [100, 'Percentage cannot exceed 100%'], 
    validate: {
      validator: function(v) {
        if (v === 0 || v === null || v === undefined) return true;
        return v >= 50 && v <= 100;
      },
      message: 'Class 10th marks must be at least 50% for admission eligibility (50% - 100%).'
    },
    default: 0 
  },
  score12th: { 
    type: Number, 
    max: [100, 'Percentage cannot exceed 100%'], 
    validate: {
      validator: function(v) {
        if (v === 0 || v === null || v === undefined) return true;
        return v > 60 && v <= 100;
      },
      message: 'Class 12th marks must be above 60% for admission eligibility (Must be greater than 60%).'
    },
    default: 0 
  },
  examType: { type: String, default: 'WBJEE 2026' },
  examRank: { 
    type: String, 
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true;
        if (v.trim().toLowerCase() === 'pending verification') return false;
        const numMatch = v.replace(/,/g, '').match(/\d+/);
        if (!numMatch) return false;
        const num = parseInt(numMatch[0], 10);
        return num > 0 && num <= 100000;
      },
      message: 'Entrance Exam Rank must be a valid numeric rank under 1 Lakh (1 to 1,00,000) and cannot be "Pending Verification".'
    }
  },
  
  // Admission Lifecycle Status
  status: {
    type: String,
    enum: ['APP_FEE_PENDING', 'UNDER_REVIEW', 'RE_UPLOAD_REQUEST', 'APPROVED', 'ADMITTED', 'REJECTED'],
    default: 'APP_FEE_PENDING'
  },
  
  // Application Fee
  appFeePaid: { type: Boolean, default: false },
  appFeeTxnId: { type: String, default: null },
  appFeePaidAt: { type: Date, default: null },
  
  // Final Admission Fee (Unlocked after Admin Approval)
  admissionFeeAmount: { type: Number, default: 50000 },
  admissionFeePaid: { type: Boolean, default: false },
  admissionFeeTxnId: { type: String, default: null },
  admissionFeePaidAt: { type: Date, default: null },

  // 1st Semester Tuition Fee (Only 1 transaction permitted)
  semesterFeeAmount: { type: Number, default: 85000 },
  semesterFeePaid: { type: Boolean, default: false },
  semesterFeeTxnId: { type: String, default: null },
  semesterFeePaidAt: { type: Date, default: null },

  adminRemarks: {
    type: String,
    default: 'Application registered. Awaiting application fee and document submission.'
  },

  documents: {
    photo: DocumentSchema,
    signature: DocumentSchema,
    marksheet10: DocumentSchema,
    marksheet12: DocumentSchema,
    rankCard: DocumentSchema,
    idProof: DocumentSchema
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
ApplicantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Helper to compare password
ApplicantSchema.methods.comparePassword = async function(candidatePassword) {
  // If plain text (for initial seeding flexibility)
  if (this.password === candidatePassword) return true;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Applicant', ApplicantSchema);
