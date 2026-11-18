/**
 * IEM KOLKATA - INSTITUTE OF ENGINEERING & MANAGEMENT
 * Admission Management System (2026-27)
 * MERN Architecture Frontend Controller with Dual Backend & Offline Sync Engine
 */

// ==========================================================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================================================
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? (window.location.port === '5000' ? '/api' : 'http://localhost:5000/api')
  : '/api';
const DB_STORAGE_KEY = 'collegehub_admission_db_v2';
const SESSION_STORAGE_KEY = 'collegehub_admission_session_v2';
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

// Academic Programs Catalog
const COURSES_CATALOG = [
  {
    id: 'btech_cse',
    name: 'B.Tech Computer Science & Engineering',
    category: 'Engineering (UG)',
    duration: '4 Years',
    intake: 240,
    eligibility: '10th (Min 50%) & 12th PCM (Above 60%) + WBJEE / JEE Main rank (Under 1 Lakh)',
    appFee: 1000,
    admissionFee: 50000,
    semesterTuition: 85000,
    description: 'Premier computing curriculum covering Full-Stack, AI, Cloud DevOps, and Distributed Software Engineering with record tier-1 campus placements.'
  },
  {
    id: 'btech_aiml',
    name: 'B.Tech Artificial Intelligence & Machine Learning',
    category: 'Engineering (UG)',
    duration: '4 Years',
    intake: 120,
    eligibility: '10th (Min 50%) & 12th PCM (Above 60%) + WBJEE / JEE Main / IEMJEE (Under 1 Lakh)',
    appFee: 1000,
    admissionFee: 50000,
    semesterTuition: 85000,
    description: 'Specialized deep learning, neural networks, natural language processing, and data engineering built in partnership with leading AI research labs.'
  },
  {
    id: 'btech_it',
    name: 'B.Tech Information Technology',
    category: 'Engineering (UG)',
    duration: '4 Years',
    intake: 120,
    eligibility: '10th (Min 50%) & 12th PCM (Above 60%) + WBJEE / JEE Main (Under 1 Lakh)',
    appFee: 1000,
    admissionFee: 50000,
    semesterTuition: 80000,
    description: 'Focuses on enterprise cloud architectures, cybersecurity, distributed microservices, and modern database systems.'
  },
  {
    id: 'btech_ece',
    name: 'B.Tech Electronics & Communication Engineering',
    category: 'Engineering (UG)',
    duration: '4 Years',
    intake: 120,
    eligibility: '10th (Min 50%) & 12th PCM (Above 60%) + WBJEE / JEE Main (Under 1 Lakh)',
    appFee: 1000,
    admissionFee: 45000,
    semesterTuition: 75000,
    description: 'Comprehensive curriculum spanning VLSI silicon design, Embedded IoT Systems, Robotics, and 5G/6G Wireless Communications.'
  },
  {
    id: 'bca',
    name: 'Bachelor of Computer Applications (BCA)',
    category: 'Computer Applications (UG)',
    duration: '3 Years',
    intake: 120,
    eligibility: '10+2 with Mathematics / Computer Science / Statistics (Min 50%)',
    appFee: 1000,
    admissionFee: 40000,
    semesterTuition: 60000,
    description: 'Industry-oriented software development, web applications, cloud hosting, and relational database management.'
  },
  {
    id: 'bba',
    name: 'Bachelor of Business Administration (BBA)',
    category: 'Management (UG)',
    duration: '3 Years',
    intake: 120,
    eligibility: '10+2 in any stream (Min 50%) + English proficiency',
    appFee: 1000,
    admissionFee: 40000,
    semesterTuition: 60000,
    description: 'Modern corporate management foundation in Digital Marketing, Financial Modeling, HR Analytics, and Entrepreneurship.'
  },
  {
    id: 'mca',
    name: 'Master of Computer Applications (MCA)',
    category: 'Post Graduate (PG)',
    duration: '2 Years',
    intake: 60,
    eligibility: 'Graduation in BCA/B.Sc/B.Tech with Math + JECA / Merit',
    appFee: 1000,
    admissionFee: 45000,
    semesterTuition: 70000,
    description: 'Advanced computing, Cloud Native Microservices, Big Data Systems, and enterprise software architecture.'
  },
  {
    id: 'mba',
    name: 'Master of Business Administration (MBA)',
    category: 'Management (PG)',
    duration: '2 Years',
    intake: 120,
    eligibility: 'Bachelor Degree (Min 50%) + CAT / MAT / JEMAT / IEMJEE',
    appFee: 1000,
    admissionFee: 50000,
    semesterTuition: 90000,
    description: 'Flagship MBA program offering dual specializations in Investment Banking, Business Analytics, Marketing, and Operations.'
  }
];

const REQUIRED_DOCS = [
  { key: 'photo', title: 'Passport Size Photograph', type: 'image', desc: 'Recent color photograph with clear white background' },
  { key: 'signature', title: 'Candidate Signature', type: 'image', desc: 'Black/Blue ink signature on plain white paper' },
  { key: 'marksheet10', title: 'Class 10th Marksheet / Admit', type: 'pdf', desc: 'Secondary board marksheet for DOB verification' },
  { key: 'marksheet12', title: 'Class 12th / Diploma Marksheet', type: 'pdf', desc: 'Higher secondary marksheet with Physics/Math scores' },
  { key: 'rankCard', title: 'Entrance Exam Rank Card', type: 'pdf', desc: 'WBJEE / JEE Main / IEMJEE official scorecard' },
  { key: 'idProof', title: 'Aadhaar Card / Govt Photo ID', type: 'pdf', desc: 'Front and back scanned copy of valid photo identity' }
];

// Country Code phone helpers & validation
const COUNTRY_CODES_MAP = {
  '+91': { country: 'India', digits: 10, pattern: /^[6-9]\d{9}$/, placeholder: 'Enter mobile number', error: 'Invalid Indian mobile number. Must be a 10-digit number starting with 6, 7, 8, or 9.' },
  '+1': { country: 'USA / Canada', digits: 10, pattern: /^[2-9]\d{2}[2-9]\d{6}$/, placeholder: 'Enter phone number', error: 'Invalid US/Canada phone number. Must be a valid 10-digit number.' },
  '+44': { country: 'UK', minDigits: 10, maxDigits: 11, pattern: /^(?:7\d{9}|[123589]\d{9,10})$/, placeholder: 'Enter phone number', error: 'Invalid UK phone number. Must be a valid 10 or 11-digit number.' },
  '+971': { country: 'UAE', digits: 9, pattern: /^5\d{8}$/, placeholder: 'Enter mobile number', error: 'Invalid UAE mobile number. Must be a 9-digit number starting with 5.' },
  '+880': { country: 'Bangladesh', digits: 10, pattern: /^1[3-9]\d{8}$/, placeholder: 'Enter mobile number', error: 'Invalid Bangladesh mobile number. Must be a 10-digit number starting with 1.' },
  '+977': { country: 'Nepal', digits: 10, pattern: /^9[78]\d{8}$/, placeholder: 'Enter mobile number', error: 'Invalid Nepal mobile number. Must be a 10-digit number starting with 97 or 98.' },
  '+65': { country: 'Singapore', digits: 8, pattern: /^[89]\d{7}$/, placeholder: 'Enter mobile number', error: 'Invalid Singapore mobile number. Must be an 8-digit number starting with 8 or 9.' },
  '+61': { country: 'Australia', digits: 9, pattern: /^4\d{8}$/, placeholder: 'Enter mobile number', error: 'Invalid Australia mobile number. Must be a 9-digit number starting with 4.' },
  '+49': { country: 'Germany', minDigits: 10, maxDigits: 11, pattern: /^(?:1[567]\d{8,9}|[2-9]\d{8,10})$/, placeholder: 'Enter phone number', error: 'Invalid Germany phone number. Must be a valid 10 or 11-digit number.' },
  '+966': { country: 'Saudi Arabia', digits: 9, pattern: /^5\d{8}$/, placeholder: 'Enter mobile number', error: 'Invalid Saudi Arabia mobile number. Must be a 9-digit number starting with 5.' }
};

// ==========================================================================
// 2. DATA LAYER & SEEDING ENGINE
// ==========================================================================
function getInitialSeedDatabase() {
  return {
    applicants: [
      {
        appId: 'IEM-2026-8492',
        fullName: 'Rahul Sharma',
        email: 'rahul.iem2026@gmail.com',
        phone: '9830123456',
        countryCode: '+91',
        aadharNumber: '543210987654',
        password: 'student123',
        fatherName: 'Alok Sharma',
        dob: '2005-04-12',
        gender: 'Male',
        category: 'General',
        address: 'Flat 4B, Greenwood Park, New Town, Kolkata - 700156',
        course: 'B.Tech Computer Science & Engineering',
        score10th: 91.4,
        score12th: 88.6,
        examType: 'WBJEE 2026',
        examRank: 'GMR 1420',
        registeredAt: '2026-09-28T10:15:00.000Z',
        status: 'UNDER_REVIEW',
        appFeePaid: true,
        appFeeTxnId: 'TXN-APP-8492-991',
        appFeePaidAt: '2026-09-28T10:25:00.000Z',
        admissionFeeAmount: 50000,
        admissionFeePaid: false,
        admissionFeeTxnId: null,
        admissionFeePaidAt: null,
        adminRemarks: 'Application submitted with all mandatory marksheets. In verification queue for Admission Officer check.',
        documents: {
          photo: { name: 'rahul_photo.jpg', status: 'UPLOADED', uploadedAt: '2026-09-28T10:20:00Z', fileUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
          signature: { name: 'rahul_signature.png', status: 'UPLOADED', uploadedAt: '2026-09-28T10:20:00Z', fileUrl: null },
          marksheet10: { name: 'class10_board_marksheet.pdf', status: 'UPLOADED', uploadedAt: '2026-09-28T10:21:00Z', fileUrl: null },
          marksheet12: { name: 'class12_cbse_marksheet.pdf', status: 'UPLOADED', uploadedAt: '2026-09-28T10:21:00Z', fileUrl: null },
          rankCard: { name: 'wbjee_rank_card_2026.pdf', status: 'UPLOADED', uploadedAt: '2026-09-28T10:22:00Z', fileUrl: null },
          idProof: { name: 'aadhar_card_scanned.pdf', status: 'UPLOADED', uploadedAt: '2026-09-28T10:22:00Z', fileUrl: null }
        },
        notifications: [
          { id: 'notif-1', title: 'Application Submitted', message: 'Your application form and uploaded credentials have been logged under App ID IEM-2026-8492.', timestamp: '2026-09-28T10:22:00.000Z', read: true, type: 'info' },
          { id: 'notif-2', title: 'Application Fee Paid', message: 'Application Fee of ₹1,000 received (Txn: TXN-APP-8492-991). Your file is with the Admissions Committee.', timestamp: '2026-09-28T10:25:00.000Z', read: false, type: 'success' },
          { id: 'notif-3', title: 'Document Verification Underway', message: 'Academic review officers are currently validating your 10th/12th scores and WBJEE rank.', timestamp: '2026-09-29T11:00:00.000Z', read: false, type: 'info' }
        ]
      },
      {
        appId: 'IEM-2026-9021',
        fullName: 'Priya Banerjee',
        email: 'priya.banerjee26@gmail.com',
        phone: '9831987654',
        countryCode: '+91',
        aadharNumber: '987654321098',
        password: 'student123',
        fatherName: 'Dr. Debasis Banerjee',
        dob: '2005-08-19',
        gender: 'Female',
        category: 'General',
        address: '14/2 Lake Gardens, Kolkata - 700045',
        course: 'B.Tech Artificial Intelligence & Machine Learning',
        score10th: 95.2,
        score12th: 93.0,
        examType: 'JEE Main 2026',
        examRank: 'AIR 28400 (97.4%)',
        registeredAt: '2026-09-25T14:30:00.000Z',
        status: 'APPROVED',
        appFeePaid: true,
        appFeeTxnId: 'TXN-APP-9021-442',
        appFeePaidAt: '2026-09-25T14:40:00.000Z',
        admissionFeeAmount: 50000,
        admissionFeePaid: false,
        admissionFeeTxnId: null,
        admissionFeePaidAt: null,
        adminRemarks: 'Documents verified and approved by Dr. S. Mukherjee (Admissions Head). Provisional Seat Allocated in B.Tech AI & ML (Shift 1). Please pay the admission fee to lock your enrollment.',
        documents: {
          photo: { name: 'priya_profile.jpg', status: 'VERIFIED', uploadedAt: '2026-09-25T14:35:00Z', fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
          signature: { name: 'priya_sign.png', status: 'VERIFIED', uploadedAt: '2026-09-25T14:35:00Z', fileUrl: null },
          marksheet10: { name: 'icse_10th_certificate.pdf', status: 'VERIFIED', uploadedAt: '2026-09-25T14:36:00Z', fileUrl: null },
          marksheet12: { name: 'isc_12th_marksheet.pdf', status: 'VERIFIED', uploadedAt: '2026-09-25T14:36:00Z', fileUrl: null },
          rankCard: { name: 'jee_main_scorecard.pdf', status: 'VERIFIED', uploadedAt: '2026-09-25T14:37:00Z', fileUrl: null },
          idProof: { name: 'aadhar_priya.pdf', status: 'VERIFIED', uploadedAt: '2026-09-25T14:37:00Z', fileUrl: null }
        },
        notifications: [
          { id: 'notif-p1', title: 'Application Approved! 🎉', message: 'Congratulations! Your seat in B.Tech AI & ML has been approved. Please pay the admission fee to confirm your admission.', timestamp: '2026-09-26T12:00:00.000Z', read: false, type: 'success' },
          { id: 'notif-p2', title: 'Fee Order Generated', message: 'Provisional Admission Fee of ₹50,000 is ready for authorization in your Fees tab.', timestamp: '2026-09-26T12:05:00.000Z', read: false, type: 'info' }
        ]
      },
      {
        appId: 'IEM-2026-7310',
        fullName: 'Aniket Das',
        email: 'aniket.das99@gmail.com',
        phone: '9007112233',
        countryCode: '+91',
        aadharNumber: '876543210987',
        password: 'student123',
        fatherName: 'Subir Das',
        dob: '2004-11-03',
        gender: 'Male',
        category: 'OBC',
        address: '88 Salt Lake Sector 2, Kolkata - 700091',
        course: 'B.Tech Information Technology',
        score10th: 87.0,
        score12th: 86.4,
        examType: 'WBJEE 2026',
        examRank: 'GMR 3120',
        registeredAt: '2026-09-20T09:00:00.000Z',
        status: 'ADMITTED',
        appFeePaid: true,
        appFeeTxnId: 'TXN-APP-7310-101',
        appFeePaidAt: '2026-09-20T09:10:00.000Z',
        admissionFeeAmount: 50000,
        admissionFeePaid: true,
        admissionFeeTxnId: 'TXN-ADM-7310-888',
        admissionFeePaidAt: '2026-09-22T16:45:00.000Z',
        adminRemarks: 'Admission confirmed! Seat permanently registered in B.Tech Information Technology. Official allotment letter issued.',
        documents: {
          photo: { name: 'aniket_photo.jpg', status: 'VERIFIED', uploadedAt: '2026-09-20T09:05:00Z', fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
          signature: { name: 'aniket_sign.png', status: 'VERIFIED', uploadedAt: '2026-09-20T09:05:00Z', fileUrl: null },
          marksheet10: { name: 'wbbse_10th.pdf', status: 'VERIFIED', uploadedAt: '2026-09-20T09:06:00Z', fileUrl: null },
          marksheet12: { name: 'wbchse_12th.pdf', status: 'VERIFIED', uploadedAt: '2026-09-20T09:06:00Z', fileUrl: null },
          rankCard: { name: 'wbjee_rankcard.pdf', status: 'VERIFIED', uploadedAt: '2026-09-20T09:07:00Z', fileUrl: null },
          idProof: { name: 'aadhar_aniket.pdf', status: 'VERIFIED', uploadedAt: '2026-09-20T09:07:00Z', fileUrl: null }
        },
        notifications: [
          { id: 'notif-a1', title: 'Admission Confirmed!', message: 'You are permanently enrolled in B.Tech Information Technology. Your Official Provisional Admission Letter is ready to print.', timestamp: '2026-09-22T16:50:00.000Z', read: true, type: 'success' },
          { id: 'notif-a2', title: 'Orientation Schedule', message: 'Campus orientation and physical induction will commence in July 2026 at the Gurukul Engineering Campus.', timestamp: '2026-09-23T10:00:00.000Z', read: false, type: 'info' }
        ]
      },
      {
        appId: 'IEM-2026-6154',
        fullName: 'Sneha Roy',
        email: 'sneha.roy2026@gmail.com',
        phone: '9836554433',
        countryCode: '+91',
        aadharNumber: '765432109876',
        password: 'student123',
        fatherName: 'Pranab Roy',
        dob: '2005-02-14',
        gender: 'Female',
        category: 'General',
        address: '54 Garia Main Road, Kolkata - 700084',
        course: 'Bachelor of Computer Applications (BCA)',
        score10th: 84.5,
        score12th: 82.0,
        examType: 'Merit Basis',
        examRank: 'Merit 82%',
        registeredAt: '2026-10-02T11:00:00.000Z',
        status: 'APP_FEE_PENDING',
        appFeePaid: false,
        appFeeTxnId: null,
        appFeePaidAt: null,
        admissionFeeAmount: 40000,
        admissionFeePaid: false,
        admissionFeeTxnId: null,
        admissionFeePaidAt: null,
        adminRemarks: 'Awaiting application fee submission.',
        documents: {},
        notifications: [
          { id: 'notif-s1', title: 'Complete Application Fee', message: 'Please pay the ₹1,000 application fee to submit your profile to the verification queue.', timestamp: '2026-10-02T11:05:00.000Z', read: false, type: 'warning' }
        ]
      }
    ],
    transactions: [
      {
        txnId: 'TXN-APP-8492-991',
        appId: 'IEM-2026-8492',
        candidateName: 'Rahul Sharma',
        type: 'Application Fee',
        amount: 1000,
        mode: 'UPI (GPay)',
        status: 'SUCCESS',
        timestamp: '2026-09-28T10:25:00.000Z'
      },
      {
        txnId: 'TXN-APP-9021-442',
        appId: 'IEM-2026-9021',
        candidateName: 'Priya Banerjee',
        type: 'Application Fee',
        amount: 1000,
        mode: 'Credit Card',
        status: 'SUCCESS',
        timestamp: '2026-09-25T14:40:00.000Z'
      },
      {
        txnId: 'TXN-APP-7310-101',
        appId: 'IEM-2026-7310',
        candidateName: 'Aniket Das',
        type: 'Application Fee',
        amount: 1000,
        mode: 'UPI (PhonePe)',
        status: 'SUCCESS',
        timestamp: '2026-09-20T09:10:00.000Z'
      },
      {
        txnId: 'TXN-ADM-7310-888',
        appId: 'IEM-2026-7310',
        candidateName: 'Aniket Das',
        type: 'Admission Seat Fee',
        amount: 50000,
        mode: 'Net Banking (SBI)',
        status: 'SUCCESS',
        timestamp: '2026-09-22T16:45:00.000Z'
      }
    ]
  };
}

function getDB() {
  const data = localStorage.getItem(DB_STORAGE_KEY) || localStorage.getItem('iem_admission_db_v1');
  if (!data) {
    const seed = getInitialSeedDatabase();
    saveDB(seed);
    return seed;
  }
  try {
    const parsed = JSON.parse(data);
    if (parsed && Array.isArray(parsed.applicants)) {
      let modified = false;
      parsed.applicants.forEach(a => {
        if (a.examRank === 'Pending Verification') {
          a.examRank = '';
          modified = true;
        }
        if (!a.notifications) {
          a.notifications = [
            { id: 'notif-gen-' + Math.random(), title: 'Welcome to IEM Kolkata', message: 'Your admission dossier has been created.', timestamp: new Date().toISOString(), read: false, type: 'info' }
          ];
          modified = true;
        }
      });
      if (modified) saveDB(parsed);
      return parsed;
    }
    const seed = getInitialSeedDatabase();
    saveDB(seed);
    return seed;
  } catch (e) {
    const seed = getInitialSeedDatabase();
    saveDB(seed);
    return seed;
  }
}

function saveDB(db) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    localStorage.setItem('iem_admission_db_v1', JSON.stringify(db)); // legacy compatibility
  } catch (err) {
    console.warn('LocalStorage quota limit reached, optimizing storage...', err);
  }
}

function resetDatabaseToDefault() {
  const seed = getInitialSeedDatabase();
  saveDB(seed);
  showToast('Database reset successfully!', 'success');
  if (currentSession && currentSession.role === 'student') {
    loadStudentDashboard();
  } else if (currentSession && currentSession.role === 'admin') {
    loadAdminDashboard();
  }
}

// ==========================================================================
// 3. GMAIL & LIVE FORM VALIDATION SERVICE
// ==========================================================================
function isValidGmail(email) {
  if (!email) return false;
  return GMAIL_REGEX.test(email.trim());
}

function validateGmailField(inputEl) {
  if (!inputEl) return;
  const val = inputEl.value.trim();
  const feedbackEl = document.getElementById(inputEl.id + 'Feedback');
  if (!feedbackEl) return;

  if (!val) {
    feedbackEl.textContent = '';
    feedbackEl.className = 'gmail-feedback';
    return;
  }

  if (isValidGmail(val)) {
    feedbackEl.textContent = '✓ Valid Gmail address format';
    feedbackEl.className = 'gmail-feedback valid';
    inputEl.style.borderColor = 'var(--mint-green-dark)';
  } else {
    feedbackEl.textContent = '⚠ Only accounts ending in @gmail.com are accepted.';
    feedbackEl.className = 'gmail-feedback invalid';
    inputEl.style.borderColor = 'var(--coral)';
  }
}

function formatAadharInput(input) {
  if (!input) return;
  let val = input.value.replace(/\D/g, '').slice(0, 12);
  let formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = formatted;
}

function formatAadharDisplay(aadhar) {
  if (!aadhar) return 'Not Provided';
  const clean = String(aadhar).replace(/\D/g, '');
  if (clean.length === 12) {
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  return aadhar;
}

function handleCountryCodeChange(selectEl, inputId) {
  if (!selectEl) return;
  const code = selectEl.value;
  const inputEl = document.getElementById(inputId);
  const helpEl = document.getElementById(inputId + 'Help');
  const cfg = COUNTRY_CODES_MAP[code] || { digits: 10, placeholder: 'Enter mobile number' };
  
  if (inputEl) {
    inputEl.placeholder = cfg.placeholder || 'Enter mobile number';
    const max = cfg.digits || cfg.maxDigits || 15;
    inputEl.maxLength = max;
    formatPhoneInput(inputEl, selectEl.id);
  }
  if (helpEl) {
    helpEl.remove();
  }
}

function formatPhoneInput(input, countrySelectId) {
  if (!input) return;
  const codeSelect = document.getElementById(countrySelectId);
  const code = codeSelect ? codeSelect.value : '+91';
  const cfg = COUNTRY_CODES_MAP[code];
  const maxLen = cfg ? (cfg.digits || cfg.maxDigits || 15) : 15;

  let val = input.value.replace(/[^0-9]/g, '');

  // Strip leading zeros so 000000000 cannot be entered
  while (val.startsWith('0')) {
    val = val.substring(1);
  }

  // Strict first-digit rules per country
  if (code === '+91' && val.length > 0 && !/[6-9]/.test(val[0])) {
    val = '';
  } else if (code === '+1' && val.length > 0 && !/[2-9]/.test(val[0])) {
    val = '';
  } else if (code === '+971' && val.length > 0 && val[0] !== '5') {
    val = '';
  } else if (code === '+880' && val.length > 0 && val[0] !== '1') {
    val = '';
  } else if (code === '+977' && val.length > 0 && val[0] !== '9') {
    val = '';
  } else if (code === '+65' && val.length > 0 && !/[89]/.test(val[0])) {
    val = '';
  } else if (code === '+61' && val.length > 0 && val[0] !== '4') {
    val = '';
  } else if (code === '+966' && val.length > 0 && val[0] !== '5') {
    val = '';
  }

  input.value = val.slice(0, maxLen);
}

function validatePhoneNumber(countryCode, phoneNumber) {
  if (!phoneNumber) return { valid: false, message: 'Mobile number is required.' };
  const clean = phoneNumber.toString().replace(/[^0-9]/g, '');
  const code = countryCode || '+91';
  const cfg = COUNTRY_CODES_MAP[code];

  if (!clean || clean.length === 0) {
    return { valid: false, message: 'Mobile number is required.' };
  }

  // Reject repeating dummy digits (e.g. 000000000, 1111111111)
  if (clean.length >= 6 && /^(\d)\1+$/.test(clean)) {
    return { valid: false, message: `Invalid mobile number: repeating digits (${clean}) are not allowed.` };
  }

  // Reject numbers starting with 0
  if (clean.startsWith('0')) {
    return { valid: false, message: `Invalid mobile number for ${cfg ? cfg.country : code}. Number cannot start with 0.` };
  }

  if (cfg) {
    if (cfg.digits && clean.length !== cfg.digits) {
      return { valid: false, message: `Mobile number for ${cfg.country} (${code}) must be exactly ${cfg.digits} digits.` };
    }
    if (cfg.minDigits && (clean.length < cfg.minDigits || clean.length > cfg.maxDigits)) {
      return { valid: false, message: `Mobile number for ${cfg.country} (${code}) must be between ${cfg.minDigits} and ${cfg.maxDigits} digits.` };
    }
    if (cfg.pattern && !cfg.pattern.test(clean)) {
      return { valid: false, message: cfg.error || `Invalid mobile number format for ${cfg.country} (${code}).` };
    }
  } else {
    if (clean.length < 7 || clean.length > 15) {
      return { valid: false, message: 'Mobile number must be between 7 and 15 numeric digits.' };
    }
  }
  return { valid: true, cleanNumber: clean, countryCode: code, fullDisplay: `${code} ${clean}` };
}

function formatFullPhoneDisplay(countryCode, phone) {
  if (!phone) return 'Not Provided';
  const pStr = String(phone).trim();
  if (pStr.startsWith('+')) return pStr;
  const code = countryCode || '+91';
  return `${code} ${pStr}`;
}

function validate10thScoreLive(inputEl) {
  if (!inputEl) return { valid: false };
  const valStr = inputEl.value.trim();
  const feedbackEl = document.getElementById('app10thScoreFeedback');

  inputEl.classList.remove('is-valid', 'is-invalid');

  if (valStr === '') {
    if (feedbackEl) {
      feedbackEl.textContent = 'Must be at least 50% for admission eligibility (50% - 100%)';
      feedbackEl.className = 'validation-feedback';
    }
    return { valid: false, message: 'Class 10th percentage is required.' };
  }

  const val = parseFloat(valStr);
  if (isNaN(val) || val < 0) {
    if (feedbackEl) {
      feedbackEl.textContent = '⚠ Not Valid: Marks cannot be negative.';
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: 'Class 10th marks cannot be negative.' };
  }

  if (val > 100) {
    if (feedbackEl) {
      feedbackEl.textContent = '⚠ Not Valid: Percentage cannot exceed 100%.';
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: 'Class 10th marks cannot exceed 100%.' };
  }

  if (val < 50) {
    if (feedbackEl) {
      feedbackEl.textContent = `⚠ Not Valid: ${val}% is below minimum required 50% for admission.`;
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: `Eligibility criteria not met: Class 10th marks (${val}%) must be at least 50% for admission.` };
  }

  if (feedbackEl) {
    feedbackEl.textContent = `✓ Valid in Range: ${val}% (Eligibility met: ≥ 50%)`;
    feedbackEl.className = 'validation-feedback valid';
  }
  inputEl.classList.add('is-valid');
  return { valid: true, value: val };
}

function validate12thScoreLive(inputEl) {
  if (!inputEl) return { valid: false };
  const valStr = inputEl.value.trim();
  const feedbackEl = document.getElementById('app12thScoreFeedback');

  inputEl.classList.remove('is-valid', 'is-invalid');

  if (valStr === '') {
    if (feedbackEl) {
      feedbackEl.textContent = 'Must be above 60% for admission eligibility (PCM/PCB)';
      feedbackEl.className = 'validation-feedback';
    }
    return { valid: false, message: 'Class 12th percentage is required.' };
  }

  const val = parseFloat(valStr);
  if (isNaN(val) || val < 0) {
    if (feedbackEl) {
      feedbackEl.textContent = '⚠ Not Valid: Marks cannot be negative.';
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: 'Class 12th marks cannot be negative.' };
  }

  if (val > 100) {
    if (feedbackEl) {
      feedbackEl.textContent = '⚠ Not Valid: Percentage cannot exceed 100%.';
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: 'Class 12th marks cannot exceed 100%.' };
  }

  if (val <= 60) {
    if (feedbackEl) {
      feedbackEl.textContent = `⚠ Not Valid: ${val}% is not above 60% (Must be strictly > 60% for admission).`;
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: `Eligibility criteria not met: Class 12th marks (${val}%) must be above 60% for admission.` };
  }

  if (feedbackEl) {
    feedbackEl.textContent = `✓ Valid in Range: ${val}% (Eligibility met: > 60%)`;
    feedbackEl.className = 'validation-feedback valid';
  }
  inputEl.classList.add('is-valid');
  return { valid: true, value: val };
}

function validateExamRankLive(inputEl) {
  if (!inputEl) return { valid: false };
  const valStr = inputEl.value.trim();
  const feedbackEl = document.getElementById('appExamRankFeedback');

  inputEl.classList.remove('is-valid', 'is-invalid');

  if (valStr === '') {
    if (feedbackEl) {
      feedbackEl.textContent = 'Must be a valid rank under 1 Lakh (1 to 1,00,000)';
      feedbackEl.className = 'validation-feedback';
    }
    return { valid: false, message: 'Entrance exam rank is required.' };
  }

  if (valStr.toLowerCase() === 'pending verification') {
    if (feedbackEl) {
      feedbackEl.textContent = '⚠ Not Valid: "Pending Verification" is not allowed. Enter your actual rank.';
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: 'Entrance exam rank cannot be "Pending Verification". Enter your actual rank under 1 Lakh.' };
  }

  const numMatch = valStr.replace(/,/g, '').match(/\d+/);
  if (!numMatch) {
    if (feedbackEl) {
      feedbackEl.textContent = '⚠ Not Valid: Please enter a numeric rank number (e.g. 12345 or GMR 28400).';
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: 'Entrance exam rank must contain a valid numeric rank number.' };
  }

  const num = parseInt(numMatch[0], 10);
  if (num <= 0) {
    if (feedbackEl) {
      feedbackEl.textContent = '⚠ Not Valid: Entrance exam rank must be a positive number.';
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: 'Entrance exam rank must be a positive number.' };
  }

  if (num > 100000) {
    if (feedbackEl) {
      feedbackEl.textContent = `⚠ Not Valid: Rank #${num.toLocaleString()} exceeds 1 Lakh limit (Must be under 1,00,000).`;
      feedbackEl.className = 'validation-feedback invalid';
    }
    inputEl.classList.add('is-invalid');
    return { valid: false, message: `Entrance exam rank (#${num.toLocaleString()}) must be under 1 Lakh (1 to 1,00,000) for admission eligibility.` };
  }

  if (feedbackEl) {
    feedbackEl.textContent = `✓ Valid Rank in Range: #${num.toLocaleString()} (Under 1 Lakh)`;
    feedbackEl.className = 'validation-feedback valid';
  }
  inputEl.classList.add('is-valid');
  return { valid: true, rankNum: num };
}

function calculateAgeFromDob(dobStr) {
  if (!dobStr) return null;
  const dobDate = new Date(dobStr);
  if (isNaN(dobDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
}

// ==========================================================================
// 4. SESSION & AUTHENTICATION
// ==========================================================================
let currentSession = null;

function getSession() {
  const session = localStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem('iem_admission_session_v1');
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

function setSession(sessionData) {
  currentSession = sessionData;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  updateNavigationAuthUI();
}

function clearSession() {
  currentSession = null;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem('iem_admission_session_v1');
  updateNavigationAuthUI();
}

function upsertApplicantInLocalDB(applicantData) {
  if (!applicantData || !applicantData.email) return null;
  const db = getDB();
  const emailLower = applicantData.email.toLowerCase();
  const idx = db.applicants.findIndex(a => a.email && a.email.toLowerCase() === emailLower);

  const fullApplicant = {
    appId: applicantData.appId || applicantData.id || ('IEM-2026-' + Math.floor(1000 + Math.random() * 9000)),
    fullName: applicantData.fullName || 'Student Applicant',
    email: applicantData.email,
    phone: applicantData.phone || '',
    countryCode: applicantData.countryCode || '+91',
    aadharNumber: applicantData.aadharNumber || '',
    password: applicantData.password || 'student123',
    fatherName: applicantData.fatherName || '',
    dob: applicantData.dob || '',
    gender: applicantData.gender || 'Male',
    category: applicantData.category || 'General',
    address: applicantData.address || '',
    course: applicantData.course || 'B.Tech Computer Science & Engineering',
    score10th: applicantData.score10th !== undefined ? applicantData.score10th : 85,
    score12th: applicantData.score12th !== undefined ? applicantData.score12th : 85,
    examType: applicantData.examType || 'WBJEE 2026',
    examRank: (applicantData.examRank && applicantData.examRank !== 'Pending Verification') ? applicantData.examRank : '',
    registeredAt: applicantData.registeredAt || applicantData.createdAt || new Date().toISOString(),
    status: applicantData.status || 'APP_FEE_PENDING',
    appFeePaid: applicantData.appFeePaid || false,
    appFeeTxnId: applicantData.appFeeTxnId || null,
    appFeePaidAt: applicantData.appFeePaidAt || null,
    admissionFeeAmount: applicantData.admissionFeeAmount || 50000,
    admissionFeePaid: applicantData.admissionFeePaid || false,
    admissionFeeTxnId: applicantData.admissionFeeTxnId || null,
    admissionFeePaidAt: applicantData.admissionFeePaidAt || null,
    adminRemarks: applicantData.adminRemarks || 'Registration completed. Please fill application details and pay the application fee.',
    documents: {
      ...((idx >= 0 && db.applicants[idx] && db.applicants[idx].documents) || {}),
      ...(applicantData.documents || {})
    },
    notifications: applicantData.notifications || [
      { id: 'notif-' + Date.now(), title: 'Registration Complete', message: 'Welcome to IEM Kolkata! Please complete your academic profile.', timestamp: new Date().toISOString(), read: false, type: 'info' }
    ]
  };

  if (idx >= 0) {
    db.applicants[idx] = { ...db.applicants[idx], ...fullApplicant };
  } else {
    db.applicants.unshift(fullApplicant);
  }
  saveDB(db);
  return idx >= 0 ? db.applicants[idx] : db.applicants[0];
}

function validateCandidateFullName(name) {
  if (!name) {
    return { valid: false, message: 'Candidate Full Name is required.' };
  }
  const clean = name.trim().replace(/\s+/g, ' ');
  if (clean.length > 60) {
    return { valid: false, message: 'Candidate Full Name must not exceed 60 characters.' };
  }
  if (!/^[a-zA-Z\s.]+$/.test(clean)) {
    return { valid: false, message: 'Candidate Full Name must contain only alphabets and spaces.' };
  }

  const parts = clean.split(' ').filter(Boolean);
  if (parts.length < 2) {
    return { valid: false, message: 'Candidate Full Name must be in sequence (First Name and Last Name, e.g., Rahul Sharma).' };
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const pos = i === 0 ? 'First' : (i === parts.length - 1 ? 'Last' : 'Middle');
    if (!/^[A-Z]/.test(part)) {
      return {
        valid: false,
        message: `Candidate ${pos} name "${part}" must start with a capital letter (e.g., "Rahul Sharma", "Amit Kumar Roy").`
      };
    }
  }

  // Reject 3 or more consecutive repeating identical letters (e.g., "Rrrrr", "aaaa")
  if (/([a-zA-Z])\1{2,}/i.test(clean)) {
    return {
      valid: false,
      message: 'Invalid Name format: Characters cannot repeat more than twice in sequence (e.g. "Rrrr" is invalid).'
    };
  }

  for (const part of parts) {
    const letters = part.replace(/[^a-zA-Z]/g, '');
    if (part.endsWith('.') && letters.length === 1) {
      // Valid initial like S. or K.
      continue;
    }
    if (letters.length < 2) {
      return { valid: false, message: `Name part "${part}" is too short. Each word must have at least 2 letters.` };
    }
    if (letters.length > 25) {
      return { valid: false, message: `Name part "${part}" is too long (maximum 25 letters).` };
    }
    // Words of 3+ letters must contain at least one vowel
    if (letters.length >= 3 && !/[aeiouyAEIOUY]/.test(letters)) {
      return { valid: false, message: `Invalid name "${part}": Words must contain vowels.` };
    }
  }

  return { valid: true, cleanName: clean };
}

function validateNameField(input) {
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  const res = validateCandidateFullName(val);
  const helpEl = input.parentElement ? input.parentElement.querySelector('small') : null;
  if (!res.valid) {
    input.classList.add('is-invalid');
    if (helpEl) {
      helpEl.style.color = '#ef4444';
      helpEl.textContent = res.message;
    }
  } else {
    input.classList.remove('is-invalid');
    if (helpEl) {
      helpEl.style.color = '';
      helpEl.textContent = 'First, middle & last name must start with a capital letter (e.g. Rahul Sharma, max 60 chars)';
    }
  }
}

function onNameFieldInput(input) {
  if (!input) return;
  input.value = input.value.replace(/[^a-zA-Z\s.]/g, '');
  const helpEl = input.parentElement ? input.parentElement.querySelector('small') : null;
  if (input.classList.contains('is-invalid')) {
    const res = validateCandidateFullName(input.value);
    if (res.valid) {
      input.classList.remove('is-invalid');
      if (helpEl) {
        helpEl.style.color = '';
        helpEl.textContent = 'First, middle & last name must start with a capital letter (e.g. Rahul Sharma, max 60 chars)';
      }
    }
  }
}

async function handleStudentRegister(e) {
  e.preventDefault();
  const rawFullName = document.getElementById('regFullName').value;
  const nameCheck = validateCandidateFullName(rawFullName);
  if (!nameCheck.valid) {
    showToast(nameCheck.message, 'error');
    document.getElementById('regFullName').focus();
    return;
  }
  const fullName = nameCheck.cleanName;
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const countryCode = document.getElementById('regCountryCode')?.value || '+91';
  const phoneRaw = document.getElementById('regPhone').value.trim();
  const course = document.getElementById('regCourse').value;
  const password = document.getElementById('regPassword').value;

  if (!isValidGmail(email)) {
    showToast('Invalid Email! You must use a valid @gmail.com address.', 'error');
    return;
  }

  const phoneCheck = validatePhoneNumber(countryCode, phoneRaw);
  if (!phoneCheck.valid) {
    showToast(phoneCheck.message, 'error');
    document.getElementById('regPhone').focus();
    return;
  }
  const phone = phoneCheck.cleanNumber;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, countryCode, course, password })
    });
    const data = await res.json();
    if (data.success && data.applicant) {
      const savedApplicant = upsertApplicantInLocalDB({
        ...data.applicant,
        phone,
        countryCode,
        course,
        password
      });
      closeAuthModal();
      setSession({
        role: 'student',
        email: email,
        name: fullName,
        appId: savedApplicant.appId,
        token: data.token
      });
      showToast(`Welcome ${fullName}! Your Application ID is ${savedApplicant.appId}`, 'success');
      navigateTo('student');
      await loadStudentDashboard();
      return;
    } else if (data && !data.success) {
      showToast(data.message || 'Registration failed.', 'error');
      return;
    }
  } catch (err) {}

  const db = getDB();
  const existing = db.applicants.find(a => a.email.toLowerCase() === email);
  if (existing) {
    showToast('An application with this Gmail ID already exists! Please login instead.', 'error');
    switchAuthModalMode('login');
    document.getElementById('loginEmail').value = email;
    return;
  }

  const newAppId = 'IEM-2026-' + Math.floor(1000 + Math.random() * 9000);
  const newApplicant = {
    appId: newAppId,
    fullName: fullName,
    email: email,
    phone: phone,
    countryCode: countryCode,
    aadharNumber: '',
    password: password,
    fatherName: '',
    dob: '',
    gender: 'Male',
    category: 'General',
    address: '',
    course: course,
    score10th: 85,
    score12th: 85,
    examType: 'WBJEE 2026',
    examRank: '',
    registeredAt: new Date().toISOString(),
    status: 'APP_FEE_PENDING',
    appFeePaid: false,
    appFeeTxnId: null,
    appFeePaidAt: null,
    admissionFeeAmount: 50000,
    admissionFeePaid: false,
    admissionFeeTxnId: null,
    admissionFeePaidAt: null,
    adminRemarks: 'Registration completed. Please fill application details and pay the application fee.',
    documents: {},
    notifications: [
      { id: 'notif-w-' + Date.now(), title: 'Welcome to IEM Kolkata', message: 'Your application has been created. Start by filling out your academic scores in the Application Form tab.', timestamp: new Date().toISOString(), read: false, type: 'info' }
    ]
  };

  db.applicants.unshift(newApplicant);
  saveDB(db);

  closeAuthModal();
  setSession({ role: 'student', email: email, name: fullName, appId: newAppId });
  showToast(`Welcome ${fullName}! Your Application ID is ${newAppId}`, 'success');
  navigateTo('student');
  await loadStudentDashboard();
}

async function handleStudentLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  if (!isValidGmail(email)) {
    showToast('Please enter a valid @gmail.com address.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.applicant) {
      const savedApplicant = upsertApplicantInLocalDB({ ...data.applicant, password });
      closeAuthModal();
      setSession({
        role: 'student',
        email: data.applicant.email,
        name: data.applicant.fullName,
        appId: savedApplicant.appId,
        token: data.token
      });
      showToast(`Logged in successfully as ${data.applicant.fullName}`, 'success');
      navigateTo('student');
      await loadStudentDashboard();
      return;
    } else if (data && !data.success) {
      showToast(data.message || 'Login failed.', 'error');
      return;
    }
  } catch (err) {}

  const db = getDB();
  const applicant = db.applicants.find(a => a.email.toLowerCase() === email);

  if (!applicant) {
    showToast('No student profile found with this Gmail ID. Please register first!', 'error');
    return;
  }

  if (applicant.password !== password) {
    showToast('Incorrect password. Please enter the correct password.', 'error');
    return;
  }

  closeAuthModal();
  setSession({ role: 'student', email: applicant.email, name: applicant.fullName, appId: applicant.appId || applicant.id });
  showToast(`Logged in successfully as ${applicant.fullName}`, 'success');
  navigateTo('student');
  await loadStudentDashboard();
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmailInput').value.trim().toLowerCase();
  const password = document.getElementById('adminPasswordInput').value;

  if (!isValidGmail(email)) {
    showToast('Administrator must also use a valid @gmail.com ID.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.admin) {
      setSession({ role: 'admin', email: data.admin.email, name: data.admin.name, token: data.token });
      showToast('Welcome Administrator! Master Control Panel Active.', 'success');
      navigateTo('admin');
      await loadAdminDashboard();
      return;
    }
  } catch (err) {}

  if (email === 'admin@gmail.com' && password === 'admin123') {
    setSession({ role: 'admin', email: 'admin@gmail.com', name: 'Admissions Officer' });
    showToast('Welcome Administrator! Master Control Panel Active.', 'success');
    navigateTo('admin');
    await loadAdminDashboard();
  } else {
    showToast('Invalid Admin Credentials! (Use admin@gmail.com / admin123)', 'error');
  }
}

async function quickLogin(email, password) {
  if (email === 'admin@gmail.com') {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
      });
      const data = await res.json();
      if (data.success && data.admin) {
        setSession({ role: 'admin', email: data.admin.email, name: data.admin.name, token: data.token });
        showToast('Switched to Admin Panel view!', 'info');
        navigateTo('admin');
        await loadAdminDashboard();
        return;
      }
    } catch (e) {}

    setSession({ role: 'admin', email: 'admin@gmail.com', name: 'Admissions Officer' });
    showToast('Switched to Admin Panel view!', 'info');
    navigateTo('admin');
    await loadAdminDashboard();
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password || 'student123' })
    });
    const data = await res.json();
    if (data.success && data.applicant) {
      const applicant = upsertApplicantInLocalDB(data.applicant);
      setSession({
        role: 'student',
        email: applicant.email,
        name: applicant.fullName,
        appId: applicant.appId || applicant.id,
        token: data.token
      });
      showToast(`Switched to Student: ${applicant.fullName} (${applicant.status})`, 'info');
      navigateTo('student');
      await loadStudentDashboard();
      return;
    }
  } catch (e) {}

  const db = getDB();
  const applicant = db.applicants.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (applicant) {
    setSession({ role: 'student', email: applicant.email, name: applicant.fullName, appId: applicant.appId || applicant.id });
    showToast(`Switched to Student: ${applicant.fullName} (${applicant.status})`, 'info');
    navigateTo('student');
    await loadStudentDashboard();
  } else {
    showToast('Candidate account not found.', 'error');
  }
}

function logout() {
  clearSession();
  showToast('You have been logged out successfully.', 'info');
  navigateTo('home');
}

// ==========================================================================
// 5. VIEW ROUTING & GLOBAL NAVIGATION
// ==========================================================================
let currentView = 'home';

function navigateTo(viewId) {
  // Prevent cross-portal navigation for active sessions
  if (viewId === 'admin' && currentSession && currentSession.role === 'student') {
    showToast('Admin Portal is restricted to authorized administrative officers.', 'warning');
    navigateTo('student');
    return;
  }
  if (viewId === 'student' && currentSession && currentSession.role === 'admin') {
    showToast('You are currently logged in as Administrator.', 'info');
    navigateTo('admin');
    return;
  }

  currentView = viewId;

  document.querySelectorAll('.nav-link-btn').forEach(link => {
    link.classList.remove('active');
  });

  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });

  const targetMap = {
    home: 'viewHome',
    programs: 'viewPrograms',
    process: 'viewProcess',
    student: 'viewStudent',
    admin: 'viewAdmin'
  };

  const activeSectionId = targetMap[viewId] || 'viewHome';
  const targetSection = document.getElementById(activeSectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  const activeBtn = Array.from(document.querySelectorAll('.nav-link-btn')).find(btn => 
    btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(viewId)
  );
  if (activeBtn) activeBtn.classList.add('active');

  if (viewId === 'student') {
    loadStudentDashboard();
  } else if (viewId === 'admin') {
    loadAdminDashboard();
  } else if (viewId === 'programs' || viewId === 'home') {
    renderProgramsList();
  }

  updateNavVisibility();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavVisibility() {
  const navLinkAdmin = document.getElementById('navLinkAdmin');
  const navLinkStudent = document.getElementById('navLinkStudent');
  const mobileLinkAdmin = document.getElementById('mobileLinkAdmin');
  const mobileLinkStudent = document.getElementById('mobileLinkStudent');
  const heroBtnAdmin = document.getElementById('heroBtnAdmin');
  const heroBtnStudent = document.getElementById('heroBtnStudent');
  const footerLinkAdmin = document.getElementById('footerLinkAdmin');

  // Student context: logged in as student OR currently inside the Student Portal
  const isStudentContext = (currentSession && currentSession.role === 'student') || currentView === 'student';

  // Admin context: logged in as admin OR currently inside the Admin Portal
  const isAdminContext = (currentSession && currentSession.role === 'admin') || currentView === 'admin';

  if (isStudentContext) {
    // Hide all Admin Portal entry points completely
    if (navLinkAdmin) navLinkAdmin.style.display = 'none';
    if (mobileLinkAdmin) mobileLinkAdmin.style.display = 'none';
    if (heroBtnAdmin) heroBtnAdmin.style.display = 'none';
    if (footerLinkAdmin) footerLinkAdmin.style.display = 'none';

    // Show Student Portal links
    if (navLinkStudent) navLinkStudent.style.display = '';
    if (mobileLinkStudent) mobileLinkStudent.style.display = '';
    if (heroBtnStudent) heroBtnStudent.style.display = '';
  } else if (isAdminContext) {
    // Hide all Student Portal entry points completely
    if (navLinkStudent) navLinkStudent.style.display = 'none';
    if (mobileLinkStudent) mobileLinkStudent.style.display = 'none';
    if (heroBtnStudent) heroBtnStudent.style.display = 'none';

    // Show Admin Portal links
    if (navLinkAdmin) navLinkAdmin.style.display = '';
    if (mobileLinkAdmin) mobileLinkAdmin.style.display = '';
    if (heroBtnAdmin) heroBtnAdmin.style.display = '';
    if (footerLinkAdmin) footerLinkAdmin.style.display = '';
  } else {
    // Public unauthenticated state
    if (navLinkAdmin) navLinkAdmin.style.display = '';
    if (mobileLinkAdmin) mobileLinkAdmin.style.display = '';
    if (navLinkStudent) navLinkStudent.style.display = '';
    if (mobileLinkStudent) mobileLinkStudent.style.display = '';
    if (heroBtnAdmin) heroBtnAdmin.style.display = '';
    if (heroBtnStudent) heroBtnStudent.style.display = '';
    if (footerLinkAdmin) footerLinkAdmin.style.display = '';
  }
}

function updateNavigationAuthUI() {
  const container = document.getElementById('navAuthActions');
  if (!container) return;

  if (!currentSession) {
    container.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="openAuthModal('login')">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </button>
      <button class="btn btn-primary btn-sm" onclick="openAuthModal('register')">
        <i class="fa-solid fa-user-plus"></i> Register
      </button>
    `;
  } else if (currentSession.role === 'student') {
    const initials = (currentSession.name || 'S').split(' ').map(n => n[0]).join('').toUpperCase();
    container.innerHTML = `
      <div class="user-pill-profile" onclick="navigateTo('student')" title="Go to Student Dashboard" style="cursor:pointer;">
        <div class="user-pill-avatar">${initials}</div>
        <div class="user-pill-info">
          <span class="user-pill-name">${currentSession.name}</span>
          <span class="user-pill-role">${currentSession.appId || 'Student'}</span>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="logout()" title="Sign Out">
        <i class="fa-solid fa-power-off"></i> Logout
      </button>
    `;
  } else if (currentSession.role === 'admin') {
    container.innerHTML = `
      <div class="user-pill-profile" onclick="navigateTo('admin')" title="Go to Admin Dashboard" style="cursor:pointer; border-color:var(--electric-violet);">
        <div class="user-pill-avatar" style="background:linear-gradient(135deg, var(--electric-violet), #FF796C);"><i class="fa-solid fa-shield-halved"></i></div>
        <div class="user-pill-info">
          <span class="user-pill-name">Admin Officer</span>
          <span class="user-pill-role">Desk Online</span>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="logout()" title="Sign Out">
        <i class="fa-solid fa-power-off"></i> Logout
      </button>
    `;
  }

  updateNavVisibility();
}

function handleHeroApplyClick() {
  if (currentSession && currentSession.role === 'student') {
    navigateTo('student');
  } else {
    openAuthModal('register');
  }
}

// ==========================================================================
// 6. PROGRAM CATALOG RENDERING & EXTENDED RICH UI HANDLERS
// ==========================================================================
let currentProgramFilter = 'all';

function createProgramCardMarkup(c) {
  return `
    <div class="program-card">
      <div>
        <div class="program-card-header">
          <span class="program-category-badge">${c.category}</span>
          <span class="program-duration-badge"><i class="fa-regular fa-clock"></i> ${c.duration}</span>
        </div>
        <h3 class="program-title">${c.name}</h3>
        <p class="program-desc">${c.description}</p>
        
        <ul class="program-meta-list">
          <li class="program-meta-item">
            <span class="label"><i class="fa-solid fa-users"></i> Total Intake:</span>
            <span class="value">${c.intake} Seats</span>
          </li>
          <li class="program-meta-item">
            <span class="label"><i class="fa-solid fa-graduation-cap"></i> Eligibility:</span>
            <span class="value" style="font-size:0.75rem; text-align:right; max-width:60%;">${c.eligibility}</span>
          </li>
        </ul>
      </div>

      <div>
        <div class="program-fees-row">
          <div>
            <div class="fee-label">Registration Fees:</div>
            <div class="fee-amount" style="font-size:0.95rem;">₹ ${c.appFee.toLocaleString()}</div>
          </div>
          <div style="text-align:right;">
            <div class="fee-label">Provisional Fee:</div>
            <div class="fee-amount">₹ ${c.admissionFee.toLocaleString()}</div>
          </div>
        </div>

        <button class="btn btn-primary btn-block btn-sm" onclick="handleSelectProgramToApply('${c.name}')">
          <i class="fa-solid fa-paper-plane"></i> Apply for this Program
        </button>
      </div>
    </div>
  `;
}

function renderProgramsList() {
  const homeGrid = document.getElementById('homeProgramsGrid');
  const allGrid = document.getElementById('allProgramsGrid');

  if (homeGrid) {
    homeGrid.innerHTML = COURSES_CATALOG.slice(0, 3).map(c => `
      <div class="program-card">
        <div>
          <div class="program-card-header">
            <span class="program-category-badge">${c.category}</span>
            <span class="program-duration-badge"><i class="fa-regular fa-clock"></i> ${c.duration}</span>
          </div>
          <h3 class="program-title">${c.name}</h3>
          <p class="program-desc">${c.description}</p>
        </div>
        <div>
          <div class="program-fees-row">
            <span class="fee-label">Semester Fee:</span>
            <span class="fee-amount">₹ ${c.semesterTuition.toLocaleString()}</span>
          </div>
          <button class="btn btn-outline btn-block btn-sm" onclick="navigateTo('programs')">
            View Program &amp; Fees <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  if (allGrid) {
    allGrid.innerHTML = COURSES_CATALOG.map(createProgramCardMarkup).join('');
  }

  renderProgramsTable();
}

function setProgramFilter(category, btnEl) {
  currentProgramFilter = category;
  document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  handleFilterPrograms();
}

function handleFilterPrograms() {
  const query = (document.getElementById('programsSearchInput')?.value || '').toLowerCase().trim();
  const allGrid = document.getElementById('allProgramsGrid');
  if (!allGrid) return;

  const filtered = COURSES_CATALOG.filter(c => {
    const matchCat = currentProgramFilter === 'all' || 
      c.category.toLowerCase().includes(currentProgramFilter.toLowerCase()) ||
      (currentProgramFilter === 'Management' && (c.id === 'bba' || c.id === 'mba')) ||
      (currentProgramFilter === 'Computer Applications' && (c.id === 'bca' || c.id === 'mca'));

    const matchQuery = !query || 
      c.name.toLowerCase().includes(query) || 
      c.description.toLowerCase().includes(query) || 
      c.category.toLowerCase().includes(query);

    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    allGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--lavender-border);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2.2rem; color: var(--muted-text); margin-bottom: 12px;"></i>
        <h4 style="color: var(--primary-dark); font-size: 1.15rem; margin-bottom: 6px;">No Matching Programs Found</h4>
        <p style="color: var(--muted-text); font-size: 0.9rem;">Try adjusting your filter pills or search terms.</p>
        <button class="btn btn-secondary-light btn-sm" onclick="document.getElementById('programsSearchInput').value=''; setProgramFilter('all', document.querySelector('.filter-pill-btn'));">
          <i class="fa-solid fa-rotate-left"></i> Reset Filters
        </button>
      </div>
    `;
  } else {
    allGrid.innerHTML = filtered.map(createProgramCardMarkup).join('');
  }
}

function renderProgramsTable() {
  const tableBody = document.getElementById('programsTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = COURSES_CATALOG.map(c => `
    <tr>
      <td>
        <strong style="color:var(--primary-dark);">${c.name}</strong>
      </td>
      <td><span class="program-category-badge" style="font-size:0.75rem;">${c.category}</span></td>
      <td><strong>${c.duration}</strong></td>
      <td>${c.intake} Seats</td>
      <td><strong style="color:var(--electric-violet);">₹ ${c.semesterTuition.toLocaleString()}</strong></td>
      <td style="font-size:0.8rem; max-width:280px; color:var(--muted-text);">${c.eligibility}</td>
      <td>
        <button class="btn btn-secondary-light btn-sm" onclick="handleSelectProgramToApply('${c.name}')" title="Apply for ${c.name}">
          Apply <i class="fa-solid fa-arrow-right"></i>
        </button>
      </td>
    </tr>
  `).join('');
}


function toggleFaqAccordion(btn) {
  const item = btn.closest('.faq-accordion-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');

  // Close other open items
  document.querySelectorAll('.faq-accordion-item').forEach(el => {
    if (el !== item) el.classList.remove('open');
  });

  if (isOpen) {
    item.classList.remove('open');
  } else {
    item.classList.add('open');
  }
}

function updateDocReadiness() {
  const checkboxes = document.querySelectorAll('.doc-ready-chk');
  if (checkboxes.length === 0) return;

  const total = checkboxes.length;
  let checkedCount = 0;
  checkboxes.forEach(chk => {
    if (chk.checked) checkedCount++;
  });

  const percent = Math.round((checkedCount / total) * 100);
  const bar = document.getElementById('readinessProgressBar');
  const badge = document.getElementById('readinessStatusBadge');

  if (bar) {
    bar.style.width = `${percent}%`;
    if (checkedCount === total) {
      bar.classList.add('all-ready');
    } else {
      bar.classList.remove('all-ready');
    }
  }

  if (badge) {
    badge.textContent = `${checkedCount} of ${total} Ready (${percent}%)`;
    if (checkedCount === total) {
      badge.style.background = '#E8F5E9';
      badge.style.color = '#1B5E20';
      badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> 100% Prepared for Verification!`;
      if (typeof showToast === 'function') {
        showToast('All 6 Admission Documents are ready for upload!', 'success');
      }
    } else {
      badge.style.background = 'var(--lavender)';
      badge.style.color = 'var(--electric-violet)';
    }
  }
}

function handleSelectProgramToApply(courseName) {
  if (currentSession && currentSession.role === 'student') {
    navigateTo('student');
    switchStudentNav('application');
    switchAppSubtab('form');
    const courseSelect = document.getElementById('appCourse');
    if (courseSelect) {
      courseSelect.value = courseName;
      showToast(`Selected ${courseName}. Please save the form.`, 'info');
    }
  } else {
    openAuthModal('register');
    setTimeout(() => {
      const regCourse = document.getElementById('regCourse');
      if (regCourse) regCourse.value = courseName;
    }, 100);
  }
}

// ==========================================================================
// 7. STUDENT PORTAL LOGIC & TAB CONTROLLER
// ==========================================================================
let activeStudentNavTab = 'dashboard';
let activeAppSubtab = 'form';

function switchStudentNav(tabKey) {
  activeStudentNavTab = tabKey;

  const btnMap = {
    dashboard: 'btnNavStudentDashboard',
    profile: 'btnNavStudentProfile',
    application: 'btnNavStudentApplication',
    fees: 'btnNavStudentFees',
    notifications: 'btnNavStudentNotifications'
  };

  const paneMap = {
    dashboard: 'tabStudentNavDashboard',
    profile: 'tabStudentNavProfile',
    application: 'tabStudentNavApplication',
    fees: 'tabStudentNavFees',
    notifications: 'tabStudentNavNotifications'
  };

  document.querySelectorAll('#studentSidebar .sidebar-nav-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(btnMap[tabKey]);
  if (activeBtn) activeBtn.classList.add('active');

  document.querySelectorAll('#studentContentArea .tab-pane').forEach(p => p.classList.remove('active'));
  const activePane = document.getElementById(paneMap[tabKey]);
  if (activePane) activePane.classList.add('active');

  const db = getDB();
  const applicant = db.applicants.find(a => a.email && a.email.toLowerCase() === currentSession?.email?.toLowerCase());

  if (applicant) {
    if (tabKey === 'profile') renderStudentProfileTab(applicant);
    if (tabKey === 'fees') renderStudentFeeHubTab(applicant);
    if (tabKey === 'notifications') renderStudentNotificationsTab(applicant);
  }
}

// ==========================================================================
// MOTION ENGINE & ANIMATED COUNTER
// ==========================================================================
function animateValueCounter(elementIdOrElement, start, end, duration = 800, prefix = '', suffix = '') {
  const el = typeof elementIdOrElement === 'string' ? document.getElementById(elementIdOrElement) : elementIdOrElement;
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
    return;
  }

  const startTime = performance.now();
  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
    }
  };
  requestAnimationFrame(step);
}

// Mobile Drawers & Toggles
function toggleMobileNav(forceOpen) {
  const overlay = document.getElementById('mobileDrawerOverlay');
  if (!overlay) return;
  if (typeof forceOpen === 'boolean') {
    overlay.classList.toggle('active', forceOpen);
  } else {
    overlay.classList.toggle('active');
  }
}

function toggleStudentSidebar() {
  const sidebar = document.getElementById('studentSidebar');
  if (sidebar) sidebar.classList.toggle('mobile-open');
}

function toggleAdminSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.toggle('mobile-open');
}

// Interactive Credit Card Visual Synchronizer
function updateCardVisualNumber(input) {
  const el = document.getElementById('cardVisualNumber');
  if (el) el.textContent = input.value || '•••• •••• •••• ••••';
}
function updateCardVisualExpiry(input) {
  const el = document.getElementById('cardVisualExpiry');
  if (el) el.textContent = input.value || 'MM/YY';
}
function updateCardVisualName(input) {
  const el = document.getElementById('cardVisualName');
  if (el) el.textContent = (input.value || 'CANDIDATE NAME').toUpperCase();
}

// ==========================================================================
// GUIDED 4-STEP APPLICATION WIZARD CONTROLLER
// ==========================================================================
let currentAppWizardStep = 1;

function goToAppWizardStep(stepNum) {
  if (stepNum > currentAppWizardStep) {
    if (currentAppWizardStep === 1 && !validateAppStep1()) return;
    if (currentAppWizardStep === 2 && !validateAppStep2()) return;
  }

  currentAppWizardStep = stepNum;

  for (let i = 1; i <= 4; i++) {
    const tab = document.getElementById(`wizardNavStep${i}`);
    const badge = document.getElementById(`wizardBadge${i}`);
    const pane = document.getElementById(`wizardPane${i}`);

    if (tab) {
      tab.classList.remove('active', 'completed');
      if (i < stepNum) {
        tab.classList.add('completed');
        if (badge) badge.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else if (i === stepNum) {
        tab.classList.add('active');
        if (badge) badge.textContent = i;
      } else {
        if (badge) badge.textContent = i;
      }
    }

    if (pane) {
      pane.classList.remove('active');
      if (i === stepNum) pane.classList.add('active');
    }
  }

  const db = getDB();
  const applicant = db.applicants.find(a => a.email && a.email.toLowerCase() === currentSession?.email?.toLowerCase());
  if (applicant) {
    if (stepNum === 3) renderAppReviewSummary(applicant);
    if (stepNum === 4) renderStep4SubmissionReadiness(applicant);
  }
}

function validateAppStep1() {
  const rawFullName = document.getElementById('appFullName')?.value;
  const nameCheck = validateCandidateFullName(rawFullName);
  if (!nameCheck.valid) {
    showToast(nameCheck.message, 'error');
    document.getElementById('appFullName')?.focus();
    return false;
  }
  const fullName = nameCheck.cleanName;
  const countryCode = document.getElementById('appCountryCode')?.value || '+91';

  const phoneCheck = validatePhoneNumber(countryCode, phoneRaw);
  if (!phoneCheck.valid) {
    showToast(phoneCheck.message, 'error');
    document.getElementById('appPhone')?.focus();
    return false;
  }

  if (aadharNumber && !/^[0-9]{12}$/.test(aadharNumber)) {
    showToast('Aadhaar Card Number must be exactly 12 numeric digits.', 'error');
    document.getElementById('appAadhar')?.focus();
    return false;
  }

  if (dob) {
    const dobDate = new Date(dob);
    const birthYear = dobDate.getFullYear();
    if (isNaN(dobDate.getTime()) || birthYear < 2000 || birthYear > 2015) {
      showToast(`Eligibility criteria not met: Candidate birth year (${birthYear || 'invalid'}) must be between 2000 and 2015.`, 'error');
      document.getElementById('appDob')?.focus();
      return false;
    }
  }

  return true;
}

function validateAppStep2() {
  const s10El = document.getElementById('app10thScore');
  const s12El = document.getElementById('app12thScore');
  const rankEl = document.getElementById('appExamRank');

  const check10 = validate10thScoreLive(s10El);
  if (!check10.valid) {
    showToast('Class 10th marks must be at least 50% for admission eligibility (50% - 100%).', 'error');
    s10El?.focus();
    return false;
  }

  const check12 = validate12thScoreLive(s12El);
  if (!check12.valid) {
    showToast('Class 12th marks must be above 60% for admission eligibility (PCM/PCB).', 'error');
    s12El?.focus();
    return false;
  }

  const rankCheck = validateExamRankLive(rankEl);
  if (!rankCheck.valid) {
    showToast('Entrance exam rank must be a valid numeric rank under 1 Lakh (1 to 1,00,000).', 'error');
    rankEl?.focus();
    return false;
  }

  saveApplicationDataSilently();
  return true;
}

async function saveApplicationDataSilently() {
  if (!currentSession) return;
  const db = getDB();
  const applicantIndex = db.applicants.findIndex(a => a.email.toLowerCase() === currentSession.email.toLowerCase());
  if (applicantIndex === -1) return;

  const fullName = document.getElementById('appFullName')?.value.trim();
  const countryCode = document.getElementById('appCountryCode')?.value || '+91';
  const phoneRaw = document.getElementById('appPhone')?.value.trim();
  const aadharRaw = (document.getElementById('appAadhar')?.value || '').trim();
  const aadharNumber = aadharRaw.replace(/\s+|-/g, '');
  const fatherName = document.getElementById('appFatherName')?.value.trim();
  const dob = document.getElementById('appDob')?.value;
  const gender = document.getElementById('appGender')?.value;
  const course = document.getElementById('appCourse')?.value;
  const examType = document.getElementById('appExamType')?.value;
  const examRank = document.getElementById('appExamRank')?.value.trim();
  const category = document.getElementById('appCategory')?.value;
  const address = document.getElementById('appAddress')?.value.trim();

  const phoneCheck = validatePhoneNumber(countryCode, phoneRaw);
  const cleanPhone = phoneCheck.valid ? phoneCheck.cleanNumber : (db.applicants[applicantIndex]?.phone || '');

  const s10 = parseFloat(document.getElementById('app10thScore')?.value) || 0;
  const s12 = parseFloat(document.getElementById('app12thScore')?.value) || 0;

  const updatedFields = {
    fullName: fullName || db.applicants[applicantIndex].fullName,
    phone: cleanPhone || db.applicants[applicantIndex].phone,
    countryCode,
    aadharNumber,
    fatherName,
    dob,
    gender,
    course,
    score10th: s10,
    score12th: s12,
    examType,
    examRank,
    category,
    address
  };

  db.applicants[applicantIndex] = { ...db.applicants[applicantIndex], ...updatedFields };
  saveDB(db);

  if (currentSession && currentSession.token) {
    try {
      await fetch(`${API_BASE_URL}/applicants/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession.token}` },
        body: JSON.stringify(updatedFields)
      });
    } catch (e) {}
  }
}

function renderAppReviewSummary(applicant) {
  const grid = document.getElementById('wizardSummaryGrid');
  if (!grid) return;

  const age = calculateAgeFromDob(applicant.dob) || '20';
  grid.innerHTML = `
    <div class="app-review-item">
      <span class="label">Full Candidate Name</span>
      <span class="val">${applicant.fullName || '-'}</span>
    </div>
    <div class="app-review-item">
      <span class="label">Registered Gmail ID</span>
      <span class="val">${applicant.email || '-'}</span>
    </div>
    <div class="app-review-item">
      <span class="label">Mobile Number</span>
      <span class="val">${applicant.countryCode || '+91'} ${applicant.phone || '-'}</span>
    </div>
    <div class="app-review-item">
      <span class="label">Aadhaar Card UID</span>
      <span class="val">${formatAadharDisplay(applicant.aadharNumber) || '-'}</span>
    </div>
    <div class="app-review-item">
      <span class="label">Father / Guardian</span>
      <span class="val">${applicant.fatherName || '-'}</span>
    </div>
    <div class="app-review-item">
      <span class="label">Date of Birth &amp; Age</span>
      <span class="val">${applicant.dob || '-'} (${age} yrs)</span>
    </div>
    <div class="app-review-item">
      <span class="label">Applying Degree Program</span>
      <span class="val" style="color:var(--deep-purple);">${applicant.course || '-'}</span>
    </div>
    <div class="app-review-item">
      <span class="label">Academic Percentages</span>
      <span class="val" style="color:var(--mint-green-dark);">10th: ${applicant.score10th || 0}% | 12th: ${applicant.score12th || 0}%</span>
    </div>
    <div class="app-review-item">
      <span class="label">Entrance Exam &amp; Rank</span>
      <span class="val">${applicant.examType || '-'} (${applicant.examRank || '-'})</span>
    </div>
  `;
}

function renderStep4SubmissionReadiness(applicant) {
  const checklist = document.getElementById('appSubmissionChecklist');
  const feedbackArea = document.getElementById('appStep4FeedbackArea');
  const submitBtn = document.getElementById('btnSubmitForReviewWizard');
  const letterContainer = document.getElementById('admissionLetterContainer');

  const docCount = Object.keys(applicant.documents || {}).length;
  const isFeePaid = !!applicant.appFeePaid;
  const isDocsReady = docCount >= 2;

  if (checklist) {
    checklist.innerHTML = `
      <div class="checklist-item ${isFeePaid ? 'ready' : 'missing'}">
        <i class="fa-solid ${isFeePaid ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <div style="flex:1;">
          <strong>Application Processing Fee (₹1,000)</strong>: 
          <span>${isFeePaid ? `Paid on ${new Date(applicant.appFeePaidAt).toLocaleDateString()} (Txn: ${applicant.appFeeTxnId})` : 'Mandatory before official submission'}</span>
        </div>
        ${!isFeePaid ? `<button type="button" class="btn btn-primary btn-sm" onclick="switchStudentNav('fees'); openPaymentModal('APPLICATION_FEE', 1000);">Pay ₹1,000</button>` : '<span class="badge badge-success">PAID</span>'}
      </div>

      <div class="checklist-item ${isDocsReady ? 'ready' : 'missing'}">
        <i class="fa-solid ${isDocsReady ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
        <div style="flex:1;">
          <strong>Document Verification Studio</strong>: 
          <span>${docCount} of 6 credentials uploaded (Minimum: Photo + Marksheets)</span>
        </div>
        ${!isDocsReady ? `<button type="button" class="btn btn-secondary-light btn-sm" onclick="goToAppWizardStep(3);">Upload Credentials</button>` : '<span class="badge badge-success">READY</span>'}
      </div>
    `;
  }

  if (feedbackArea) {
    if (applicant.status === 'APPROVED') {
      feedbackArea.innerHTML = `
        <div class="status-dossier-card approved mb-4">
          <div style="width:52px; height:52px; border-radius:50%; background:#d1fae5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0;">
            <i class="fa-solid fa-award"></i>
          </div>
          <div style="flex:1;">
            <h4 style="font-size:1.15rem; font-weight:800; margin-bottom:4px; color:#065f46;">Provisional Seat Approved in ${applicant.course}!</h4>
            <p style="margin:0; font-size:0.86rem; color:#047857; line-height:1.45;">${applicant.adminRemarks || 'Your submitted marksheets and exam rank have been approved by the Admission Committee.'}</p>
          </div>
          ${!applicant.admissionFeePaid ? `
            <button type="button" class="btn btn-success btn-lg" onclick="switchStudentNav('fees'); openPaymentModal('ADMISSION_FEE', ${applicant.admissionFeeAmount || 50000})">
              Pay Admission Fee (₹${(applicant.admissionFeeAmount || 50000).toLocaleString()})
            </button>
          ` : '<span class="badge badge-success" style="font-size:0.85rem;">ADMISSION CONFIRMED</span>'}
        </div>
      `;
    } else if (applicant.status === 'RE_UPLOAD_REQUEST') {
      feedbackArea.innerHTML = `
        <div class="status-dossier-card rejected mb-4" style="background:#fffbeb; border-color:#fcd34d; color:#92400e;">
          <div style="width:52px; height:52px; border-radius:50%; background:#fef3c7; color:#d97706; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0;">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div style="flex:1;">
            <h4 style="font-size:1.15rem; font-weight:800; margin-bottom:4px; color:#92400e;">Document Correction Notice</h4>
            <p style="margin:0; font-size:0.86rem; color:#b45309; line-height:1.45;"><strong>Officer Feedback:</strong> ${applicant.adminRemarks}</p>
          </div>
          <button type="button" class="btn btn-warning btn-lg" onclick="goToAppWizardStep(3)">
            <i class="fa-solid fa-cloud-arrow-up"></i> Re-Upload Documents
          </button>
        </div>
      `;
    } else if (applicant.status === 'REJECTED') {
      feedbackArea.innerHTML = `
        <div class="status-dossier-card rejected mb-4">
          <div style="width:52px; height:52px; border-radius:50%; background:#fee2e2; color:#dc2626; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0;">
            <i class="fa-solid fa-circle-xmark"></i>
          </div>
          <div style="flex:1;">
            <h4 style="font-size:1.15rem; font-weight:800; margin-bottom:4px; color:#991b1b;">Application Rejected</h4>
            <p style="margin:0; font-size:0.86rem; color:#b91c1c; line-height:1.45;"><strong>Decision Rationale:</strong> ${applicant.adminRemarks}</p>
          </div>
        </div>
      `;
    } else if (applicant.status === 'ADMITTED') {
      feedbackArea.innerHTML = `
        <div class="status-dossier-card approved mb-4">
          <div style="width:52px; height:52px; border-radius:50%; background:#d1fae5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0;">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div style="flex:1;">
            <h4 style="font-size:1.15rem; font-weight:800; margin-bottom:4px; color:#065f46;">Admission Permanently Confirmed!</h4>
            <p style="margin:0; font-size:0.86rem; color:#047857; line-height:1.45;">You are officially enrolled in ${applicant.course}. Your Official Provisional Admission Letter is unlocked below.</p>
          </div>
        </div>
      `;
      if (letterContainer) {
        letterContainer.classList.remove('d-none');
        renderProvisionalAdmissionLetter(applicant);
      }
    } else {
      feedbackArea.innerHTML = `
        <div class="status-dossier-card reviewing mb-4">
          <div style="width:52px; height:52px; border-radius:50%; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0;">
            <i class="fa-solid fa-user-clock"></i>
          </div>
          <div style="flex:1;">
            <h4 style="font-size:1.15rem; font-weight:800; margin-bottom:4px; color:#0369a1;">Application Lifecycle Status: ${applicant.status.replace(/_/g, ' ')}</h4>
            <p style="margin:0; font-size:0.86rem; color:#0284c7; line-height:1.45;">${applicant.adminRemarks || 'Your application is progressing through our automated credential review workflow.'}</p>
          </div>
        </div>
      `;
    }
  }

  if (submitBtn) {
    if (applicant.status === 'UNDER_REVIEW') {
      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Dossier Under Review (Submitted)`;
      submitBtn.disabled = true;
      submitBtn.className = 'btn btn-secondary-light btn-lg';
    } else if (applicant.status === 'APPROVED' || applicant.status === 'ADMITTED') {
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Application Approved`;
      submitBtn.disabled = true;
      submitBtn.className = 'btn btn-success btn-lg';
    } else {
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Application for Officer Review`;
      submitBtn.disabled = !(isFeePaid && isDocsReady);
      submitBtn.className = isFeePaid && isDocsReady ? 'btn btn-primary btn-lg' : 'btn btn-secondary-light btn-lg';
    }
  }
}

function switchAppSubtab(subKey) {
  if (subKey === 'form') goToAppWizardStep(1);
  else if (subKey === 'docs') goToAppWizardStep(3);
  else if (subKey === 'letter') goToAppWizardStep(4);
}

async function loadStudentDashboard() {
  const loggedOutCard = document.getElementById('studentLoggedOutState');
  const loggedInPortal = document.getElementById('studentLoggedInState');

  if (!currentSession || currentSession.role !== 'student') {
    if (loggedOutCard) loggedOutCard.classList.remove('d-none');
    if (loggedInPortal) loggedInPortal.classList.add('d-none');
    return;
  }

  if (loggedOutCard) loggedOutCard.classList.add('d-none');
  if (loggedInPortal) loggedInPortal.classList.remove('d-none');

  let db = getDB();
  let applicant = db.applicants.find(a => a.email && a.email.toLowerCase() === currentSession.email.toLowerCase());

  if (currentSession.token) {
    try {
      const [resApp, resTxns] = await Promise.all([
        fetch(`${API_BASE_URL}/applicants/me`, { headers: { 'Authorization': `Bearer ${currentSession.token}` } }),
        fetch(`${API_BASE_URL}/payments/my-transactions`, { headers: { 'Authorization': `Bearer ${currentSession.token}` } })
      ]);
      const dataApp = await resApp.json();
      const dataTxns = await resTxns.json();

      if (dataApp.success && dataApp.applicant) {
        applicant = upsertApplicantInLocalDB(dataApp.applicant);
        db = getDB();
      }

      if (dataTxns.success && Array.isArray(dataTxns.transactions) && dataTxns.transactions.length > 0) {
        if (!db.transactions) db.transactions = [];
        dataTxns.transactions.forEach(backendTxn => {
          const idx = db.transactions.findIndex(t => t.txnId === backendTxn.txnId);
          if (idx !== -1) {
            db.transactions[idx] = { ...db.transactions[idx], ...backendTxn };
          } else {
            db.transactions.unshift(backendTxn);
          }
        });
        saveDB(db);
      }
    } catch (apiErr) {}
  }

  // Deduplicate and ensure applicant's confirmed paid fees have exactly 1 ledger entry per category (Registration, Admission, Semester)
  if (applicant) {
    if (!db.transactions) db.transactions = [];

    const isThisCandidate = t => (
      (applicant.appId && t.appId === applicant.appId) ||
      (applicant.email && t.candidateEmail && t.candidateEmail.toLowerCase() === applicant.email.toLowerCase()) ||
      (applicant.appFeeTxnId && t.txnId === applicant.appFeeTxnId) ||
      (applicant.admissionFeeTxnId && t.txnId === applicant.admissionFeeTxnId) ||
      (applicant.semesterFeeTxnId && t.txnId === applicant.semesterFeeTxnId)
    );

    const otherTxns = db.transactions.filter(t => !isThisCandidate(t));
    const candidateTxns = db.transactions.filter(isThisCandidate);

    const dedupedCandidateMap = new Map();
    candidateTxns.forEach(t => {
      let key = 'OTHER';
      const typeLower = (t.type || '').toLowerCase();
      if (typeLower.includes('application') || typeLower.includes('registration')) key = 'REGISTRATION';
      else if (typeLower.includes('admission') || typeLower.includes('seat')) key = 'ADMISSION';
      else if (typeLower.includes('semester')) key = 'SEMESTER';
      if (!dedupedCandidateMap.has(key)) {
        dedupedCandidateMap.set(key, t);
      }
    });

    if (applicant.appFeePaid && applicant.appFeeTxnId && !dedupedCandidateMap.has('REGISTRATION')) {
      dedupedCandidateMap.set('REGISTRATION', {
        txnId: applicant.appFeeTxnId,
        appId: applicant.appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Application Fee',
        amount: 1000,
        mode: 'Online UPI / Card',
        status: 'SUCCESS',
        timestamp: applicant.appFeePaidAt || new Date().toISOString()
      });
    }

    if (applicant.admissionFeePaid && applicant.admissionFeeTxnId && !dedupedCandidateMap.has('ADMISSION')) {
      dedupedCandidateMap.set('ADMISSION', {
        txnId: applicant.admissionFeeTxnId,
        appId: applicant.appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Admission Seat Fee',
        amount: applicant.admissionFeeAmount || 50000,
        mode: 'Net Banking / UPI',
        status: 'SUCCESS',
        timestamp: applicant.admissionFeePaidAt || new Date().toISOString()
      });
    }

    if (applicant.semesterFeePaid && applicant.semesterFeeTxnId && !dedupedCandidateMap.has('SEMESTER')) {
      dedupedCandidateMap.set('SEMESTER', {
        txnId: applicant.semesterFeeTxnId,
        appId: applicant.appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Semester Tuition Fee',
        amount: applicant.semesterFeeAmount || 85000,
        mode: 'Net Banking / UPI',
        status: 'SUCCESS',
        timestamp: applicant.semesterFeePaidAt || new Date().toISOString()
      });
    }

    db.transactions = [...Array.from(dedupedCandidateMap.values()), ...otherTxns];
    saveDB(db);
  }

  if (!applicant && currentSession.email) {
    applicant = upsertApplicantInLocalDB({
      appId: currentSession.appId,
      fullName: currentSession.name || 'Student',
      email: currentSession.email
    });
    db = getDB();
  }

  if (!applicant) {
    showToast('Applicant data could not be found.', 'error');
    clearSession();
    return;
  }

  const appId = applicant.appId || applicant.id;
  const initials = (applicant.fullName || 'S').split(' ').map(n => n[0]).join('').toUpperCase();

  // Update Sidebar & Welcome Header
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('studentSidebarName', applicant.fullName);
  setEl('studentSidebarAppId', appId);
  setEl('studentSidebarAvatar', initials);

  const hour = new Date().getHours();
  let timeGreeting = 'Good evening';
  if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
  else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
  setEl('studentWelcomeName', `${timeGreeting}, ${applicant.fullName}!`);
  setEl('studentWelcomeAppId', appId);
  setEl('studentWelcomeCourse', applicant.course);
  setEl('studentWelcomeEmail', applicant.email);

  // Status indicator
  renderStudentStatusBadge(applicant);
  renderStudentKPICards(applicant);
  renderAdmissionStepper(applicant);
  renderStudentActionRecommendations(applicant);
  renderStudentDashboardNotificationsSnapshot(applicant);
  populateStudentApplicationForm(applicant);
  renderStudentDocStudio(applicant);
  renderStudentFeeHubTab(applicant);
  renderStudentProfileTab(applicant);
  renderStudentNotificationsTab(applicant);
  renderProvisionalAdmissionLetter(applicant);
}

function renderStudentStatusBadge(applicant) {
  const pill = document.getElementById('studentStatusPill');
  const text = document.getElementById('studentStatusText');
  if (!pill || !text) return;

  const statusConfig = {
    APP_FEE_PENDING: { text: 'Application Fee Due (₹1,000)', bg: 'rgba(255, 121, 108, 0.15)', border: 'var(--coral)', color: 'var(--coral)' },
    UNDER_REVIEW: { text: 'Under Officer Review', bg: 'rgba(53, 217, 245, 0.15)', border: 'var(--bright-cyan)', color: 'var(--bright-cyan)' },
    RE_UPLOAD_REQUEST: { text: 'Document Correction Needed', bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', color: '#f59e0b' },
    APPROVED: { text: 'Seat Approved • Pay Admission Fee', bg: 'rgba(140, 230, 192, 0.2)', border: 'var(--mint-green)', color: 'var(--mint-green)' },
    ADMITTED: { text: 'Confirmed Admitted (Letter Ready)', bg: 'rgba(140, 230, 192, 0.25)', border: 'var(--mint-green-dark)', color: 'var(--mint-green)' },
    REJECTED: { text: 'Application Rejected', bg: 'rgba(255, 121, 108, 0.2)', border: 'var(--coral)', color: 'var(--coral)' }
  };

  const cfg = statusConfig[applicant.status] || statusConfig.UNDER_REVIEW;
  text.textContent = cfg.text;
  pill.style.background = cfg.bg;
  pill.style.borderColor = cfg.border;
  pill.style.color = cfg.color;
}

function renderStudentKPICards(applicant) {
  const docCount = Object.keys(applicant.documents || {}).length;
  const statusLabels = {
    APP_FEE_PENDING: 'Fee Pending',
    UNDER_REVIEW: 'Under Review',
    RE_UPLOAD_REQUEST: 'Docs Flagged',
    APPROVED: 'Seat Approved',
    ADMITTED: 'Enrolled',
    REJECTED: 'Rejected'
  };

  let totalPaid = 0;
  if (applicant.appFeePaid) totalPaid += 1000;
  if (applicant.admissionFeePaid) totalPaid += (applicant.admissionFeeAmount || 50000);
  if (applicant.semesterFeePaid) totalPaid += (applicant.semesterFeeAmount || 85000);

  let outstanding = 0;
  if (!applicant.appFeePaid) outstanding += 1000;
  if (!applicant.admissionFeePaid) outstanding += (applicant.admissionFeeAmount || 50000);
  if (!applicant.semesterFeePaid && (applicant.admissionFeePaid || applicant.status === 'ADMITTED')) {
    outstanding += (applicant.semesterFeeAmount || 85000);
  }

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('kpiStudentAppStatus', statusLabels[applicant.status] || applicant.status);
  animateValueCounter('kpiStudentTotalPaid', 0, totalPaid, 600, '₹ ');
  animateValueCounter('kpiStudentOutstanding', 0, outstanding, 600, '₹ ');
  setEl('kpiStudentDocCount', `${docCount} / 6`);
}

function renderAdmissionStepper(applicant) {
  const stepper = document.getElementById('admissionStepper');
  if (!stepper) return;

  const docCount = Object.keys(applicant.documents || {}).length;
  const steps = [
    { key: 'register', label: '1. Form Details' },
    { key: 'docs', label: '2. Upload Docs' },
    { key: 'appFee', label: '3. Registration Fees' },
    { key: 'review', label: '4. Admin Review' },
    { key: 'admissionFee', label: '5. Admission Fee' },
    { key: 'admitted', label: '6. Allotment Letter' }
  ];

  const stepStates = {
    register: true,
    docs: docCount >= 2,
    appFee: applicant.appFeePaid,
    review: applicant.status === 'APPROVED' || applicant.status === 'ADMITTED',
    admissionFee: applicant.admissionFeePaid,
    admitted: applicant.status === 'ADMITTED'
  };

  let html = '';
  steps.forEach((step, idx) => {
    const isCompleted = stepStates[step.key];
    const isActive = !isCompleted && (idx === 0 || stepStates[steps[idx - 1].key]);
    
    html += `
      <div class="step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
        <div class="step-circle">
          ${isCompleted ? '<i class="fa-solid fa-check"></i>' : (idx + 1)}
        </div>
        <span class="step-label">${step.label}</span>
      </div>
    `;

    if (idx < steps.length - 1) {
      const nextCompleted = stepStates[steps[idx + 1].key];
      html += `<div class="step-connector ${isCompleted && nextCompleted ? 'completed' : ''}"></div>`;
    }
  });

  stepper.innerHTML = html;
}

function renderStudentActionRecommendations(applicant) {
  const container = document.getElementById('studentActionRecommendations');
  if (!container) return;

  const docCount = Object.keys(applicant.documents || {}).length;
  let actions = [];

  if (applicant.status === 'APPROVED' && !applicant.admissionFeePaid) {
    actions.push(`
      <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:#166534; font-size:0.92rem;"><i class="fa-solid fa-circle-check"></i> Seat Approved in ${applicant.course}</strong>
          <p style="margin:2px 0 0; font-size:0.8rem; color:#15803d;">Pay the admission fee to confirm your enrollment.</p>
        </div>
        <button class="btn btn-success btn-sm" onclick="switchStudentNav('fees'); openPaymentModal('ADMISSION_FEE', ${applicant.admissionFeeAmount || 50000})">
          Pay ₹${(applicant.admissionFeeAmount || 50000).toLocaleString()}
        </button>
      </div>
    `);
  }

  if (!applicant.appFeePaid) {
    actions.push(`
      <div style="background:#fff7ed; border:1px solid #fdba74; border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:#9a3412; font-size:0.92rem;"><i class="fa-solid fa-receipt"></i> Application Fee Due (₹1,000)</strong>
          <p style="margin:2px 0 0; font-size:0.8rem; color:#c2410c;">Authorize payment to submit credentials for review.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="switchStudentNav('fees'); openPaymentModal('APPLICATION_FEE', 1000)">
          Pay ₹1,000
        </button>
      </div>
    `);
  }

  if (docCount < 6) {
    actions.push(`
      <div style="background:var(--lavender); border:1px solid var(--lavender-border); border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:var(--deep-purple); font-size:0.92rem;"><i class="fa-solid fa-cloud-arrow-up"></i> Document Studio (${docCount}/6 Uploaded)</strong>
          <p style="margin:2px 0 0; font-size:0.8rem; color:var(--muted-text);">Ensure photograph, signature, marksheets, rank card & Aadhaar are uploaded.</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="switchStudentNav('application'); switchAppSubtab('docs');">
          Upload Files
        </button>
      </div>
    `);
  }

  if (applicant.status === 'ADMITTED') {
    actions.push(`
      <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:#166534; font-size:0.92rem;"><i class="fa-solid fa-award"></i> Admission Confirmed!</strong>
          <p style="margin:2px 0 0; font-size:0.8rem; color:#15803d;">Your Official Provisional Allotment Letter is generated and signed.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="switchStudentNav('application'); switchAppSubtab('letter');">
          <i class="fa-solid fa-file-arrow-down"></i> View Letter
        </button>
      </div>
    `);
  }

  container.innerHTML = actions.join('');
}

function renderStudentDashboardNotificationsSnapshot(applicant) {
  const container = document.getElementById('studentDashboardNotifications');
  if (!container) return;

  const notifs = applicant.notifications || [];
  if (notifs.length === 0) {
    container.innerHTML = `<p style="font-size:0.84rem; color:var(--muted-text);">No notifications yet.</p>`;
    return;
  }

  container.innerHTML = notifs.slice(0, 3).map(n => `
    <div style="background:var(--warm-off-white); border:1px solid var(--lavender-border); border-radius:var(--radius-md); padding:10px 14px; font-size:0.84rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <strong style="color:var(--primary-dark); font-size:0.86rem;">${n.title}</strong>
        <span style="font-size:0.72rem; color:var(--muted-text);">${new Date(n.timestamp).toLocaleDateString()}</span>
      </div>
      <p style="margin:0; color:var(--muted-text); font-size:0.8rem;">${n.message}</p>
    </div>
  `).join('');
}

function renderStudentProfileTab(applicant) {
  const container = document.getElementById('studentProfileDetailsGrid');
  if (!container) return;

  const appId = applicant.appId || applicant.id;
  container.innerHTML = `
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Full Name</span>
      <strong style="font-size:1.05rem; color:var(--primary-dark);">${applicant.fullName}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Application ID</span>
      <strong style="font-size:1.05rem; color:var(--electric-violet);">${appId}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Gmail Address</span>
      <strong style="font-size:0.95rem; color:var(--primary-dark);">${applicant.email}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Contact Mobile</span>
      <strong style="font-size:1.05rem; color:var(--primary-dark);">${formatFullPhoneDisplay(applicant.countryCode, applicant.phone)}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Aadhaar UIDAI</span>
      <strong style="font-size:1.05rem; color:var(--primary-dark);">${formatAadharDisplay(applicant.aadharNumber)}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Father / Guardian</span>
      <strong style="font-size:1.05rem; color:var(--primary-dark);">${applicant.fatherName || 'Not Provided'}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Date of Birth / Age</span>
      <strong style="font-size:1.05rem; color:var(--primary-dark);">${applicant.dob || 'Not Set'} (${calculateAgeFromDob(applicant.dob) || '20'} yrs)</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Selected Program</span>
      <strong style="font-size:0.95rem; color:var(--deep-purple);">${applicant.course}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">10th / 12th Scores</span>
      <strong style="font-size:1.05rem; color:var(--mint-green-dark);">10th: ${applicant.score10th}% | 12th: ${applicant.score12th}%</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Entrance Exam &amp; Rank</span>
      <strong style="font-size:1.05rem; color:var(--primary-dark);">${applicant.examType} (${applicant.examRank})</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Category / Gender</span>
      <strong style="font-size:1.05rem; color:var(--primary-dark);">${applicant.category} / ${applicant.gender}</strong>
    </div>
    <div class="stat-card" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <span class="stat-title">Application Status</span>
      <strong style="font-size:1.05rem; color:var(--electric-violet);">${applicant.status}</strong>
    </div>
  `;
}

function renderStudentFeeHubTab(applicant) {
  const appBtnContainer = document.getElementById('appFeeButtonContainer');
  const admBtnContainer = document.getElementById('admissionFeeButtonContainer');
  const semBtnContainer = document.getElementById('semesterFeeButtonContainer');
  const admDisplayAmt = document.getElementById('admissionFeeDisplayAmt');
  const semDisplayAmt = document.getElementById('semesterFeeDisplayAmt');
  const txnTable = document.getElementById('studentTransactionsTableBody');

  const admFee = applicant.admissionFeeAmount || 50000;
  const semFee = applicant.semesterFeeAmount || 85000;
  if (admDisplayAmt) admDisplayAmt.textContent = `₹ ${admFee.toLocaleString()}.00`;
  if (semDisplayAmt) semDisplayAmt.textContent = `₹ ${semFee.toLocaleString()}.00`;

  // --- CARD 1: REGISTRATION / APPLICATION FEE (Limit: 1 Transaction) ---
  if (appBtnContainer) {
    if (applicant.appFeePaid) {
      appBtnContainer.innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:var(--radius-md); padding:10px 14px; color:#166534; font-size:0.84rem;">
          <i class="fa-solid fa-circle-check"></i> Paid on ${new Date(applicant.appFeePaidAt || Date.now()).toLocaleDateString()}
          <div style="font-size:0.75rem; color:#15803d; margin-top:2px;">Txn: <strong>${applicant.appFeeTxnId}</strong></div>
        </div>
      `;
    } else {
      appBtnContainer.innerHTML = `
        <button class="btn btn-primary btn-block" onclick="openPaymentModal('APPLICATION_FEE', 1000)">
          <i class="fa-solid fa-lock"></i> Pay Registration Fee (₹ 1,000)
        </button>
      `;
    }
  }

  // --- CARD 2: PROVISIONAL ADMISSION FEE (Limit: 1 Transaction) ---
  if (admBtnContainer) {
    if (applicant.admissionFeePaid) {
      admBtnContainer.innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:var(--radius-md); padding:10px 14px; color:#166534; font-size:0.84rem;">
          <i class="fa-solid fa-circle-check"></i> Seat Confirmed &amp; Paid
          <div style="font-size:0.75rem; color:#15803d; margin-top:2px;">Txn: <strong>${applicant.admissionFeeTxnId}</strong></div>
        </div>
      `;
    } else if (applicant.status === 'APPROVED' || applicant.status === 'ADMITTED') {
      admBtnContainer.innerHTML = `
        <button class="btn btn-success btn-block" onclick="openPaymentModal('ADMISSION_FEE', ${admFee})">
          <i class="fa-solid fa-circle-check"></i> Pay Admission Fee (₹ ${admFee.toLocaleString()})
        </button>
      `;
    } else {
      admBtnContainer.innerHTML = `
        <button class="btn btn-secondary-light btn-block" disabled title="Requires Admission Committee Approval">
          <i class="fa-solid fa-lock"></i> Locked (Pending Approval)
        </button>
      `;
    }
  }

  // --- CARD 3: 1ST SEMESTER ACADEMIC FEE (Limit: 1 Transaction) ---
  if (semBtnContainer) {
    if (applicant.semesterFeePaid) {
      semBtnContainer.innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:var(--radius-md); padding:10px 14px; color:#166534; font-size:0.84rem;">
          <i class="fa-solid fa-circle-check"></i> 1st Semester Enrolled &amp; Paid
          <div style="font-size:0.75rem; color:#15803d; margin-top:2px;">Txn: <strong>${applicant.semesterFeeTxnId}</strong></div>
        </div>
      `;
    } else if (applicant.admissionFeePaid || applicant.status === 'ADMITTED') {
      semBtnContainer.innerHTML = `
        <button class="btn btn-primary btn-block" onclick="openPaymentModal('SEMESTER_FEE', ${semFee})">
          <i class="fa-solid fa-graduation-cap"></i> Pay 1st Semester Fee (₹ ${semFee.toLocaleString()})
        </button>
      `;
    } else {
      semBtnContainer.innerHTML = `
        <button class="btn btn-secondary-light btn-block" disabled title="Payable after Admission Confirmation">
          <i class="fa-solid fa-lock"></i> Locked (Requires Admission Confirmation)
        </button>
      `;
    }
  }

  // --- DEDUPLICATED TRANSACTION LEDGER (Exactly 1 per category) ---
  if (txnTable) {
    const db = getDB();
    const allTxns = db.transactions || [];

    const myTxns = allTxns.filter(t => 
      (applicant.appId && t.appId === applicant.appId) ||
      (applicant.email && t.candidateEmail && t.candidateEmail.toLowerCase() === applicant.email.toLowerCase()) ||
      (applicant.fullName && t.candidateName && t.candidateName.toLowerCase() === applicant.fullName.toLowerCase()) ||
      (applicant.appFeeTxnId && t.txnId === applicant.appFeeTxnId) ||
      (applicant.admissionFeeTxnId && t.txnId === applicant.admissionFeeTxnId) ||
      (applicant.semesterFeeTxnId && t.txnId === applicant.semesterFeeTxnId)
    );

    // Strict deduplication: Preserve at most 1 transaction per fee category (Registration, Admission, Semester)
    const dedupedMap = new Map();
    myTxns.forEach(t => {
      let cat = 'OTHER';
      const typeLower = (t.type || '').toLowerCase();
      if (typeLower.includes('application') || typeLower.includes('registration')) cat = 'REGISTRATION';
      else if (typeLower.includes('admission') || typeLower.includes('seat')) cat = 'ADMISSION';
      else if (typeLower.includes('semester')) cat = 'SEMESTER';

      if (!dedupedMap.has(cat)) {
        dedupedMap.set(cat, t);
      }
    });

    const displayTxns = Array.from(dedupedMap.values());

    if (displayTxns.length === 0) {
      txnTable.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px; color:var(--muted-text);">No payment transactions recorded yet.</td></tr>`;
      return;
    }

    txnTable.innerHTML = displayTxns.map(t => `
      <tr>
        <td><code>${t.txnId}</code></td>
        <td><strong>${t.type}</strong></td>
        <td><strong style="color:var(--electric-violet);">₹ ${t.amount.toLocaleString()}</strong></td>
        <td>${t.mode || 'Online UPI / Card'}</td>
        <td><span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> ${t.status || 'SUCCESS'}</span></td>
        <td>${new Date(t.timestamp).toLocaleString()}</td>
        <td class="text-right">
          <button class="btn btn-primary btn-sm" onclick="openPaymentReceiptModal('${t.txnId}')" title="View & Print Official Slip">
            <i class="fa-solid fa-print"></i> Slip
          </button>
        </td>
      </tr>
    `).join('');
  }
}

function renderStudentNotificationsTab(applicant) {
  const container = document.getElementById('studentNotificationsFullList');
  const badge = document.getElementById('studentUnreadBadge');
  if (!container) return;

  const notifs = applicant.notifications || [];
  const unreadCount = notifs.filter(n => !n.read).length;

  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }

  if (notifs.length === 0) {
    container.innerHTML = `<p style="padding:20px; text-align:center; color:var(--muted-text);">No campus notifications logged.</p>`;
    return;
  }

  container.innerHTML = notifs.map(n => `
    <div style="background:${n.read ? 'var(--warm-off-white)' : 'var(--lavender)'}; border:1px solid ${n.read ? 'var(--lavender-border)' : 'var(--electric-violet)'}; border-radius:var(--radius-lg); padding:16px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
      <div style="display:flex; align-items:flex-start; gap:12px;">
        <div style="width:36px; height:36px; border-radius:50%; background:${n.type === 'success' ? 'var(--mint-green-soft)' : (n.type === 'warning' ? 'var(--coral-soft)' : 'var(--electric-violet-soft)')}; color:${n.type === 'success' ? 'var(--mint-green-dark)' : (n.type === 'warning' ? 'var(--coral)' : 'var(--electric-violet)')}; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
          <i class="fa-solid ${n.type === 'success' ? 'fa-circle-check' : (n.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-bell')}"></i>
        </div>
        <div>
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--primary-dark); margin-bottom:2px;">${n.title} ${!n.read ? '<span style="font-size:0.68rem; background:var(--coral); color:white; padding:2px 6px; border-radius:10px; margin-left:6px;">NEW</span>' : ''}</h4>
          <p style="margin:0; font-size:0.86rem; color:var(--muted-text); line-height:1.4;">${n.message}</p>
          <small style="font-size:0.74rem; color:var(--light-muted); margin-top:4px; display:block;">${new Date(n.timestamp).toLocaleString()}</small>
        </div>
      </div>

      <div>
        ${!n.read ? `
          <button class="btn btn-secondary-light btn-sm" onclick="markNotificationRead('${n.id}')">
            <i class="fa-solid fa-check"></i> Read
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function markNotificationRead(notifId) {
  const db = getDB();
  const applicantIndex = db.applicants.findIndex(a => a.email.toLowerCase() === currentSession?.email?.toLowerCase());
  if (applicantIndex === -1) return;

  const notifs = db.applicants[applicantIndex].notifications || [];
  const target = notifs.find(n => n.id === notifId);
  if (target) {
    target.read = true;
    saveDB(db);
    renderStudentNotificationsTab(db.applicants[applicantIndex]);
  }
}

function markAllNotificationsAsRead() {
  const db = getDB();
  const applicantIndex = db.applicants.findIndex(a => a.email.toLowerCase() === currentSession?.email?.toLowerCase());
  if (applicantIndex === -1) return;

  (db.applicants[applicantIndex].notifications || []).forEach(n => n.read = true);
  saveDB(db);
  showToast('All notifications marked as read!', 'success');
  renderStudentNotificationsTab(db.applicants[applicantIndex]);
}

// ==========================================================================
// 8. APPLICATION LOCK & FORM EDIT CONTROLLER
// ==========================================================================
function setFormValuesOnly(applicant) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
  };

  const dobEl = document.getElementById('appDob');
  if (dobEl) {
    dobEl.min = '2000-01-01';
    dobEl.max = '2015-12-31';
  }

  const countrySelect = document.getElementById('appCountryCode');
  if (countrySelect) {
    countrySelect.value = applicant.countryCode || '+91';
    handleCountryCodeChange(countrySelect, 'appPhone');
  }

  setVal('appFullName', applicant.fullName);
  setVal('appGmail', applicant.email);
  setVal('appPhone', applicant.phone);
  setVal('appAadhar', formatAadharDisplay(applicant.aadharNumber || ''));
  setVal('appFatherName', applicant.fatherName);
  setVal('appDob', applicant.dob);
  setVal('appGender', applicant.gender || 'Male');
  setVal('appCourse', applicant.course || 'B.Tech Computer Science & Engineering');
  setVal('app10thScore', applicant.score10th);
  setVal('app12thScore', applicant.score12th);
  setVal('appExamType', applicant.examType || 'WBJEE 2026');
  setVal('appExamRank', (applicant.examRank && applicant.examRank !== 'Pending Verification') ? applicant.examRank : '');
  setVal('appCategory', applicant.category || 'General');
  setVal('appAddress', applicant.address);

  // Trigger live feedback badges
  const el10 = document.getElementById('app10thScore');
  const el12 = document.getElementById('app12thScore');
  const elRank = document.getElementById('appExamRank');
  if (el10) validate10thScoreLive(el10);
  if (el12) validate12thScoreLive(el12);
  if (elRank) validateExamRankLive(elRank);
}

function toggleApplicationEditMode(enableEdit) {
  const currentAppId = currentSession?.appId || (document.getElementById('studentSidebarAppId')?.textContent || 'IEM-2026');

  const inputIds = [
    'appFullName', 'appCountryCode', 'appPhone', 'appAadhar',
    'appFatherName', 'appDob', 'appGender', 'appCourse',
    'app10thScore', 'app12thScore', 'appExamType', 'appExamRank',
    'appCategory', 'appAddress'
  ];

  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (enableEdit) {
        el.removeAttribute('disabled');
        el.removeAttribute('readonly');
      } else {
        el.setAttribute('disabled', 'true');
      }
    }
  });

  const banner = document.getElementById('appLockBanner');
  const bannerIcon = document.getElementById('lockBannerIcon');
  const bannerTitle = document.getElementById('lockBannerTitle');
  const bannerDesc = document.getElementById('lockBannerDesc');
  const btnTop = document.getElementById('btnTopEditAction');

  const btnEdit = document.getElementById('btnEditAppData');
  const btnSave = document.getElementById('btnSaveApp');
  const btnCancel = document.getElementById('btnCancelEditApp');
  const lockedBadge = document.getElementById('appLockedStatusBadge');
  const lockedIdLabel = document.getElementById('appLockedIdLabel');

  if (lockedIdLabel) lockedIdLabel.textContent = currentAppId;

  if (enableEdit) {
    if (banner) banner.className = 'application-lock-banner edit-mode';
    if (bannerIcon) bannerIcon.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    if (bannerTitle) bannerTitle.textContent = `Data Modification Mode Active (App ID: ${currentAppId})`;
    if (bannerDesc) bannerDesc.textContent = 'You are modifying personal and academic records stored in your generated Application ID. Update your details and click "Save & Commit Updated Data" below to lock changes.';
    if (btnTop) {
      btnTop.innerHTML = '<i class="fa-solid fa-xmark"></i> Cancel Edits';
      btnTop.className = 'btn btn-secondary';
      btnTop.onclick = () => toggleApplicationEditMode(false);
    }

    if (btnEdit) btnEdit.classList.add('d-none');
    if (btnSave) btnSave.classList.remove('d-none');
    if (btnCancel) btnCancel.classList.remove('d-none');
    if (lockedBadge) lockedBadge.classList.add('d-none');

    const el10 = document.getElementById('app10thScore');
    const el12 = document.getElementById('app12thScore');
    const elRank = document.getElementById('appExamRank');
    if (el10) validate10thScoreLive(el10);
    if (el12) validate12thScoreLive(el12);
    if (elRank) validateExamRankLive(elRank);

    showToast('Modification mode enabled: You can now update personal and academic data.', 'info');
  } else {
    if (banner) banner.className = 'application-lock-banner';
    if (bannerIcon) bannerIcon.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
    if (bannerTitle) bannerTitle.textContent = `Application Records Secured & Locked (ID: ${currentAppId})`;
    if (bannerDesc) bannerDesc.textContent = 'Personal & academic details are protected under your generated Application ID. Direct typing is blocked. Click "Modify / Edit Data" to make changes.';
    if (btnTop) {
      btnTop.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Modify / Edit Data';
      btnTop.className = 'btn btn-warning';
      btnTop.onclick = () => toggleApplicationEditMode(true);
    }

    if (btnEdit) btnEdit.classList.remove('d-none');
    if (btnSave) btnSave.classList.add('d-none');
    if (btnCancel) btnCancel.classList.add('d-none');
    if (lockedBadge) lockedBadge.classList.remove('d-none');

    if (currentSession && currentSession.email) {
      const db = getDB();
      const applicant = db.applicants.find(a => a.email && a.email.toLowerCase() === currentSession.email.toLowerCase());
      if (applicant) {
        setFormValuesOnly(applicant);
      }
    }
  }
}

function populateStudentApplicationForm(applicant) {
  setFormValuesOnly(applicant);
  const hasSavedData = !!(applicant.fatherName || applicant.dob || (applicant.score10th && applicant.score10th > 0) || applicant.examRank);
  toggleApplicationEditMode(!hasSavedData);
}

async function handleSaveApplication(e) {
  e.preventDefault();
  const db = getDB();
  const applicantIndex = db.applicants.findIndex(a => a.email.toLowerCase() === currentSession.email.toLowerCase());

  if (applicantIndex === -1) return;

  const rawFullName = document.getElementById('appFullName').value;
  const nameCheck = validateCandidateFullName(rawFullName);
  if (!nameCheck.valid) {
    showToast(nameCheck.message, 'error');
    document.getElementById('appFullName').focus();
    return;
  }
  const fullName = nameCheck.cleanName;
  const countryCode = document.getElementById('appCountryCode')?.value || '+91';
  const phoneRaw = document.getElementById('appPhone').value.trim();
  const aadharRaw = (document.getElementById('appAadhar')?.value || '').trim();
  const aadharNumber = aadharRaw.replace(/\s+|-/g, '');
  const fatherName = document.getElementById('appFatherName').value.trim();
  const dob = document.getElementById('appDob').value;
  const gender = document.getElementById('appGender').value;
  const course = document.getElementById('appCourse').value;
  const examType = document.getElementById('appExamType').value;
  const category = document.getElementById('appCategory').value;
  const address = document.getElementById('appAddress').value.trim();


  if (fatherName && (!/^[a-zA-Z\s.]+$/.test(fatherName) || fatherName.replace(/[^a-zA-Z]/g, '').length < 2)) {
    showToast("Father's / Guardian's Name must contain only alphabets and spaces.", 'error');
    document.getElementById('appFatherName').focus();
    return;
  }

  const phoneCheck = validatePhoneNumber(countryCode, phoneRaw);
  if (!phoneCheck.valid) {
    showToast(phoneCheck.message, 'error');
    document.getElementById('appPhone').focus();
    return;
  }
  const phone = phoneCheck.cleanNumber;

  if (!/^[0-9]{12}$/.test(aadharNumber)) {
    showToast('Aadhaar Card Number must be exactly 12 numeric digits.', 'error');
    document.getElementById('appAadhar').focus();
    return;
  }

  if (dob) {
    const dobDate = new Date(dob);
    const birthYear = dobDate.getFullYear();
    if (isNaN(dobDate.getTime()) || birthYear < 2000 || birthYear > 2015) {
      showToast(`Eligibility Error: Applicant birth year (${birthYear || 'invalid'}) must be between 2000 and 2015.`, 'error');
      document.getElementById('appDob').focus();
      return;
    }
  } else {
    showToast('Please select your Date of Birth.', 'error');
    document.getElementById('appDob').focus();
    return;
  }

  const check10 = validate10thScoreLive(document.getElementById('app10thScore'));
  if (!check10.valid) {
    showToast(check10.message || 'Eligibility criteria not met: Class 10th marks must be at least 50% for admission (50% - 100%).', 'error');
    document.getElementById('app10thScore').focus();
    return;
  }
  const score10th = check10.value;

  const check12 = validate12thScoreLive(document.getElementById('app12thScore'));
  if (!check12.valid) {
    showToast(check12.message || 'Eligibility criteria not met: Class 12th marks must be above 60% for admission (Must be greater than 60%).', 'error');
    document.getElementById('app12thScore').focus();
    return;
  }
  const score12th = check12.value;

  const rankCheck = validateExamRankLive(document.getElementById('appExamRank'));
  if (!rankCheck.valid) {
    showToast(rankCheck.message || 'Entrance exam rank must be a valid rank under 1 Lakh (1 to 1,00,000).', 'error');
    document.getElementById('appExamRank').focus();
    return;
  }
  const examRank = document.getElementById('appExamRank').value.trim();

  const updatedFields = {
    fullName,
    phone,
    countryCode,
    aadharNumber,
    fatherName,
    dob,
    gender,
    course,
    score10th,
    score12th,
    examType,
    examRank,
    category,
    address
  };

  Object.assign(db.applicants[applicantIndex], updatedFields);
  saveDB(db);

  if (currentSession && currentSession.token) {
    try {
      await fetch(`${API_BASE_URL}/applicants/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`
        },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {}
  }

  const appId = db.applicants[applicantIndex].appId;
  showToast(`Application data successfully saved & locked under Application ID: ${appId}`, 'success');
  toggleApplicationEditMode(false);
  await loadStudentDashboard();
}

// ==========================================================================
// 9. DOCUMENT UPLOAD STUDIO
// ==========================================================================
function renderStudentDocStudio(applicant) {
  const grid = document.getElementById('studentDocGrid');
  if (!grid) return;

  const docs = applicant.documents || {};

  grid.innerHTML = REQUIRED_DOCS.map(docDef => {
    const uploaded = docs[docDef.key];
    const isUploaded = !!uploaded;
    const status = uploaded ? uploaded.status : 'PENDING';

    let badgeClass = 'pending';
    let badgeText = 'Not Uploaded';

    if (status === 'UPLOADED') { badgeClass = 'uploaded'; badgeText = 'Uploaded'; }
    if (status === 'VERIFIED') { badgeClass = 'verified'; badgeText = 'Verified by Admin'; }
    if (status === 'FLAGGED') { badgeClass = 'pending'; badgeText = 'Re-upload Needed'; }

    return `
      <div class="doc-upload-card ${isUploaded ? 'uploaded' : ''}" id="docCard_${docDef.key}">
        <div class="doc-card-top">
          <div class="doc-card-icon">
            <i class="fa-solid ${docDef.type === 'image' ? 'fa-file-image' : 'fa-file-pdf'}"></i>
          </div>
          <div class="doc-card-info">
            <h4>${docDef.title}</h4>
            <p>${docDef.desc}</p>
          </div>
        </div>

        <div>
          <span class="doc-status-badge ${badgeClass}">${badgeText}</span>
          ${isUploaded ? `<div style="font-size:0.75rem; color:var(--muted-text); margin-top:4px; word-break:break-all;"><i class="fa-solid fa-paperclip"></i> ${uploaded.name}</div>` : ''}
        </div>

        <div style="display:flex; gap:8px; margin-top:8px;">
          <input type="file" id="fileInput_${docDef.key}" class="d-none" accept="image/*,application/pdf" onchange="handleFileUpload(event, '${docDef.key}')" />
          <button class="btn btn-outline btn-sm flex-1" onclick="document.getElementById('fileInput_${docDef.key}').click()">
            <i class="fa-solid fa-upload"></i> ${isUploaded ? 'Replace' : 'Upload'}
          </button>
          ${isUploaded ? `
            <button class="btn btn-secondary-light btn-sm" onclick="previewDocument('${applicant.appId || applicant.id}', '${docDef.key}')">
              <i class="fa-solid fa-eye"></i> View
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

async function handleFileUpload(e, docKey) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (file.size > 15 * 1024 * 1024) {
    showToast('File size exceeds 15MB limit.', 'error');
    if (e.target) e.target.value = '';
    return;
  }

  const session = currentSession;
  if (!session || !session.email) {
    showToast('Please sign in to upload documents.', 'warning');
    if (e.target) e.target.value = '';
    return;
  }

  // Visual loading feedback on upload card
  const docCard = document.getElementById(`docCard_${docKey}`);
  const uploadBtn = docCard ? docCard.querySelector('button') : null;
  let originalBtnHtml = '';
  if (uploadBtn) {
    originalBtnHtml = uploadBtn.innerHTML;
    uploadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
    uploadBtn.disabled = true;
  }

  try {
    if (session.token) {
      // Live server upload via FormData
      const formData = new FormData();
      formData.append('document', file);
      formData.append('docKey', docKey);

      const res = await fetch(`${API_BASE_URL}/applicants/me/upload-doc`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.document) {
        const db = getDB();
        const idx = db.applicants.findIndex(a => a.email && a.email.toLowerCase() === session.email.toLowerCase());
        if (idx !== -1) {
          if (!db.applicants[idx].documents) db.applicants[idx].documents = {};
          db.applicants[idx].documents[docKey] = data.document;
          saveDB(db);
        }
        showToast(`✓ ${file.name} uploaded & secured successfully!`, 'success');
        await loadStudentDashboard();
        return;
      } else {
        throw new Error(data.message || 'Server upload failed.');
      }
    } else {
      // Offline fallback: persistent Base64 DataURL
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(evt) {
          const db = getDB();
          const idx = db.applicants.findIndex(a => a.email && a.email.toLowerCase() === session.email.toLowerCase());
          if (idx !== -1) {
            if (!db.applicants[idx].documents) db.applicants[idx].documents = {};
            db.applicants[idx].documents[docKey] = {
              name: file.name,
              status: 'UPLOADED',
              uploadedAt: new Date().toISOString(),
              fileUrl: evt.target.result,
              size: file.size
            };
            saveDB(db);
          }
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      showToast(`✓ ${file.name} uploaded successfully!`, 'success');
      await loadStudentDashboard();
    }
  } catch (err) {
    console.warn('Backend upload encountered an issue, saving locally:', err.message);
    try {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(evt) {
          const db = getDB();
          const idx = db.applicants.findIndex(a => a.email && a.email.toLowerCase() === session.email.toLowerCase());
          if (idx !== -1) {
            if (!db.applicants[idx].documents) db.applicants[idx].documents = {};
            db.applicants[idx].documents[docKey] = {
              name: file.name,
              status: 'UPLOADED',
              uploadedAt: new Date().toISOString(),
              fileUrl: evt.target.result,
              size: file.size
            };
            saveDB(db);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
      showToast(`✓ ${file.name} saved successfully (${err.message})`, 'info');
      const db = getDB();
      const applicant = db.applicants.find(a => a.email && a.email.toLowerCase() === session.email.toLowerCase());
      if (applicant) renderStudentDocStudio(applicant);
    } catch (fallbackErr) {
      showToast(`Upload failed: ${err.message}`, 'error');
    }
  } finally {
    if (e.target) e.target.value = '';
    if (uploadBtn && originalBtnHtml) {
      uploadBtn.innerHTML = originalBtnHtml;
      uploadBtn.disabled = false;
    }
  }
}

async function submitDocumentsForAdminReview() {
  const db = getDB();
  const applicantIndex = db.applicants.findIndex(a => a.email.toLowerCase() === currentSession.email.toLowerCase());
  if (applicantIndex === -1) return;

  const applicant = db.applicants[applicantIndex];
  const docCount = Object.keys(applicant.documents || {}).length;

  if (docCount < 2) {
    showToast('Please upload at least your Photograph and Marksheets before submitting.', 'error');
    return;
  }

  if (!applicant.appFeePaid) {
    showToast('Application Fee (₹1,000) must be paid before submitting for Admin Review.', 'warning');
    goToAppWizardStep(4);
    openPaymentModal('APPLICATION_FEE', 1000);
    return;
  }

  if (currentSession && currentSession.token) {
    try {
      const res = await fetch(`${API_BASE_URL}/applicants/me/submit-for-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`
        }
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Failed to submit application to review queue.', 'error');
        return;
      }
    } catch (apiErr) {
      console.warn('Submit for review API error:', apiErr);
    }
  }

  db.applicants[applicantIndex].status = 'UNDER_REVIEW';
  db.applicants[applicantIndex].adminRemarks = 'Application dossier verified and submitted by candidate. In queue for Admission Officer verification.';
  saveDB(db);

  showToast('🎉 Application successfully submitted to Admission Committee review queue!', 'success');
  await loadStudentDashboard();
  goToAppWizardStep(4);
}

// ==========================================================================
// 10. PROVISIONAL ALLOTMENT LETTER & PRINTING
// ==========================================================================
function renderProvisionalAdmissionLetter(applicant) {
  const container = document.getElementById('admissionLetterContainer');
  if (!container) return;

  if (applicant.status !== 'ADMITTED') {
    container.innerHTML = `
      <div class="auth-box card-elevated" style="text-align:center; padding:40px 20px; background:var(--white); border-radius:var(--radius-xl); border:1px solid var(--lavender-border);">
        <div style="width:60px; height:60px; border-radius:50%; background:var(--lavender); color:var(--electric-violet); font-size:1.8rem; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <i class="fa-solid fa-file-circle-question"></i>
        </div>
        <h3 style="font-size:1.3rem; color:var(--primary-dark);">Provisional Letter Locked</h3>
        <p style="color:var(--muted-text); font-size:0.9rem; max-width:480px; margin:0 auto;">
          The Official Provisional Admission Letter is automatically generated once the 
          <strong>Admission Fee (₹${(applicant.admissionFeeAmount || 50000).toLocaleString()})</strong> is paid and verified.
        </p>
      </div>
    `;
    return;
  }

  const feeAmt = applicant.admissionFeeAmount || 50000;
  const appId = applicant.appId || applicant.id;
  container.innerHTML = `
    <div style="background:var(--white); border:2px solid var(--lavender-border); border-radius:var(--radius-xl); padding:40px; box-shadow:var(--shadow-lg); max-width:820px; margin:0 auto; position:relative;">
      
      <!-- Letter Header -->
      <div style="text-align:center; border-bottom:2px solid var(--lavender-border); padding-bottom:20px; margin-bottom:24px;">
        <div class="brand-logo-crest" style="margin:0 auto 10px; width:48px; height:48px;"><span class="crest-letter" style="font-size:0.95rem;">IEM</span></div>
        <h2 style="font-size:1.6rem; color:var(--primary-dark); font-weight:900; letter-spacing:-0.02em;">INSTITUTE OF ENGINEERING &amp; MANAGEMENT (IEM)</h2>
        <p style="font-size:0.8rem; color:var(--muted-text); margin:2px 0;">Autonomous Campus | AICTE Approved | NAAC 'A' Grade Accredited</p>
        <p style="font-size:0.8rem; color:var(--muted-text);">Sector-V, Salt Lake Electronics Complex, Kolkata - 700091</p>
        <div style="margin-top:14px; display:inline-block; background:var(--lavender); color:var(--deep-purple); font-weight:800; font-size:0.85rem; padding:6px 18px; border-radius:var(--radius-full); letter-spacing:0.04em;">
          PROVISIONAL ADMISSION &amp; SEAT ALLOTMENT LETTER
        </div>
      </div>

      <!-- Letter Meta -->
      <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:0.85rem; color:var(--muted-text);">
        <span><strong>Ref No:</strong> IEM/ADM/2026/${appId.split('-').pop()}</span>
        <span><strong>Allotment Date:</strong> ${new Date(applicant.admissionFeePaidAt || Date.now()).toLocaleDateString('en-GB')}</span>
      </div>

      <p style="font-size:0.92rem; color:var(--main-text); margin-bottom:12px;">Dear <strong>${applicant.fullName}</strong>,</p>
      <p style="font-size:0.88rem; color:var(--muted-text); line-height:1.6; margin-bottom:20px;">
        We are pleased to inform you that based on your academic eligibility, entrance examination rank, and successful verification of uploaded credentials, you have been provisionally admitted to the degree program below for Session <strong>2026-2027</strong>:
      </p>

      <!-- Table Dossier -->
      <table class="custom-table" style="margin-bottom:24px;">
        <tbody>
          <tr><td style="width:35%; font-weight:700;">Application ID</td><td><strong>${appId}</strong></td></tr>
          <tr><td style="font-weight:700;">Candidate Name</td><td>${applicant.fullName}</td></tr>
          <tr><td style="font-weight:700;">Father's Name</td><td>${applicant.fatherName || 'Guardian'}</td></tr>
          <tr><td style="font-weight:700;">Gmail ID</td><td>${applicant.email}</td></tr>
          <tr><td style="font-weight:700;">Aadhaar Number</td><td><span style="font-family:monospace;">${formatAadharDisplay(applicant.aadharNumber)}</span></td></tr>
          <tr><td style="font-weight:700;">Allotted Program</td><td><strong style="color:var(--deep-purple); font-size:1rem;">${applicant.course}</strong></td></tr>
          <tr><td style="font-weight:700;">Entrance Exam &amp; Rank</td><td>${applicant.examType} (${applicant.examRank})</td></tr>
          <tr><td style="font-weight:700;">App Fee Status</td><td><span style="color:var(--mint-green-dark); font-weight:700;">PAID (₹1,000)</span> [${applicant.appFeeTxnId || 'TXN-OK'}]</td></tr>
          <tr><td style="font-weight:700;">Admission Fee Status</td><td><span style="color:var(--mint-green-dark); font-weight:700;">PAID (₹${feeAmt.toLocaleString()})</span> [${applicant.admissionFeeTxnId || 'TXN-OK'}]</td></tr>
        </tbody>
      </table>

      <!-- Signature Row -->
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:40px; padding-top:20px; border-top:1px solid var(--lavender-border);">
        <div style="text-align:center;">
          <div style="width:160px; border-bottom:1px solid var(--muted-text); margin-bottom:6px;"></div>
          <span style="font-size:0.75rem; color:var(--muted-text);">Candidate Signature</span>
        </div>

        <div style="text-align:center;">
          <div style="border:2px dashed var(--electric-violet); padding:6px 14px; border-radius:4px; font-weight:800; font-size:0.8rem; color:var(--deep-purple); font-family:monospace;">
            [DIGITALLY VERIFIED]
          </div>
          <span style="font-size:0.72rem; color:var(--muted-text); margin-top:4px; display:block;">IEM Registrar</span>
        </div>

        <div style="text-align:center;">
          <div style="font-family:'Brush Script MT', cursive; font-size:1.4rem; color:var(--deep-purple); line-height:1;">Dr. S. Mukherjee</div>
          <div style="width:160px; border-bottom:1px solid var(--muted-text); margin-top:4px; margin-bottom:6px;"></div>
          <span style="font-size:0.75rem; color:var(--muted-text);">Dean of Admissions</span>
        </div>
      </div>

      <div class="text-center mt-6">
        <button class="btn btn-primary btn-lg" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print / Download Official Admission Letter (PDF)
        </button>
      </div>
    </div>
  `;
}

// ==========================================================================
// 11. PAYMENT GATEWAY SIMULATION (STRICT 1-TRANSACTION LIMITS)
// ==========================================================================
let activePaymentSession = null;

function openPaymentModal(feeType, amount) {
  const db = getDB();
  const applicant = (currentSession && currentSession.email)
    ? db.applicants.find(a => a.email && a.email.toLowerCase() === currentSession.email.toLowerCase())
    : null;

  if (applicant) {
    if (feeType === 'APPLICATION_FEE') {
      if (applicant.appFeePaid) {
        showToast('Registration fee has already been paid (Only 1 transaction permitted per student).', 'info');
        return;
      }
    } else if (feeType === 'ADMISSION_FEE') {
      if (applicant.admissionFeePaid) {
        showToast('Admission fee has already been paid (Only 1 transaction permitted per student).', 'info');
        return;
      }
      if (applicant.status !== 'APPROVED' && applicant.status !== 'ADMITTED') {
        showToast('Admission fee requires Admission Committee approval first.', 'warning');
        return;
      }
    } else if (feeType === 'SEMESTER_FEE') {
      if (!applicant.admissionFeePaid && applicant.status !== 'ADMITTED') {
        showToast('Please pay admission confirmation fee before paying semester tuition.', 'warning');
        return;
      }
      if (applicant.semesterFeePaid) {
        showToast('1st Semester fee has already been paid (Only 1 transaction permitted per student).', 'info');
        return;
      }
    }
  }

  activePaymentSession = { feeType, amount };

  const modal = document.getElementById('paymentModal');
  const amountEl = document.getElementById('payModalAmount');
  const purposeEl = document.getElementById('payModalPurpose');
  const btnText = document.getElementById('payBtnAmountText');
  const cardHolder = document.getElementById('payCardHolderName');

  if (amountEl) amountEl.textContent = `₹ ${amount.toLocaleString()}.00`;
  if (btnText) btnText.textContent = `₹ ${amount.toLocaleString()}`;
  if (cardHolder && currentSession) cardHolder.value = currentSession.name || (applicant ? applicant.fullName : 'Student');

  if (purposeEl) {
    if (feeType === 'APPLICATION_FEE') {
      purposeEl.textContent = 'IEM Kolkata Application & Registration Processing Fee';
    } else if (feeType === 'ADMISSION_FEE') {
      purposeEl.textContent = 'IEM Kolkata Provisional Admission & Seat Allotment Fee';
    } else if (feeType === 'SEMESTER_FEE') {
      purposeEl.textContent = 'IEM Kolkata 1st Semester Academic Tuition & Laboratory Fee';
    }
  }

  const checkmarkBox = document.getElementById('paySuccessCheckmarkBox');
  const defaultFooter = document.getElementById('payModalDefaultFooter');
  if (checkmarkBox) checkmarkBox.classList.add('d-none');
  if (defaultFooter) defaultFooter.classList.remove('d-none');

  if (modal) modal.classList.remove('d-none');
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.add('d-none');
  const checkmarkBox = document.getElementById('paySuccessCheckmarkBox');
  const defaultFooter = document.getElementById('payModalDefaultFooter');
  if (checkmarkBox) checkmarkBox.classList.add('d-none');
  if (defaultFooter) defaultFooter.classList.remove('d-none');
  activePaymentSession = null;
}

function switchPayMethod(methodKey) {
  document.querySelectorAll('.pay-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.pay-pane').forEach(p => p.classList.add('d-none'));

  const btnMap = { upi: 0, card: 1, netbanking: 2 };
  const paneMap = { upi: 'payTabUpi', card: 'payTabCard', netbanking: 'payTabNetbanking' };

  const navBtns = document.querySelectorAll('.pay-nav-btn');
  if (navBtns[btnMap[methodKey]]) navBtns[btnMap[methodKey]].classList.add('active');

  const targetPane = document.getElementById(paneMap[methodKey]);
  if (targetPane) targetPane.classList.remove('d-none');
}

function executeSimulatedPayment() {
  if (!activePaymentSession || !currentSession) return;

  const btn = document.getElementById('btnExecutePayment');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Secure Gateway...`;
    btn.disabled = true;
  }

  setTimeout(async () => {
    const db = getDB();
    const applicantIndex = db.applicants.findIndex(a => a.email.toLowerCase() === currentSession.email.toLowerCase());

    if (applicantIndex === -1) {
      showToast('Error processing payment for session.', 'error');
      btn.innerHTML = originalHtml;
      btn.disabled = false;
      return;
    }

    const timestamp = new Date().toISOString();
    const applicant = db.applicants[applicantIndex];
    const appId = applicant.appId || applicant.id;

    const checkmarkBox = document.getElementById('paySuccessCheckmarkBox');
    const defaultFooter = document.getElementById('payModalDefaultFooter');
    const txnLabel = document.getElementById('paySuccessTxnLabel');

    if (!db.transactions) db.transactions = [];

    if (activePaymentSession.feeType === 'APPLICATION_FEE') {
      if (applicant.appFeePaid) {
        showToast('Registration fee has already been paid (Only 1 transaction permitted).', 'warning');
        closePaymentModal();
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        return;
      }

      const txnId = 'TXN-APP-' + appId.split('-').pop() + '-' + Math.floor(100 + Math.random() * 900);
      db.applicants[applicantIndex].appFeePaid = true;
      db.applicants[applicantIndex].appFeeTxnId = txnId;
      db.applicants[applicantIndex].appFeePaidAt = timestamp;
      if (db.applicants[applicantIndex].status === 'APP_FEE_PENDING') {
        db.applicants[applicantIndex].status = 'UNDER_REVIEW';
      }

      // Filter out any older duplicate application transactions
      db.transactions = db.transactions.filter(t => 
        !((t.appId === appId || (t.candidateEmail && t.candidateEmail.toLowerCase() === applicant.email.toLowerCase())) && (t.type || '').includes('Application'))
      );

      db.transactions.unshift({
        txnId: txnId,
        appId: appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Application Fee',
        amount: activePaymentSession.amount,
        mode: 'Online UPI / Card',
        status: 'SUCCESS',
        timestamp: timestamp
      });

      if (!db.applicants[applicantIndex].notifications) db.applicants[applicantIndex].notifications = [];
      db.applicants[applicantIndex].notifications.unshift({
        id: 'notif-' + Date.now(),
        title: 'Registration Fee Paid',
        message: `Your payment of ₹1,000 (Txn ID: ${txnId}) has been confirmed. Official fee slip ready!`,
        timestamp: timestamp,
        read: false,
        type: 'success'
      });

      saveDB(db);

      if (currentSession && currentSession.token) {
        try {
          await fetch(`${API_BASE_URL}/payments/pay-app-fee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession.token}` },
            body: JSON.stringify({ mode: 'Online UPI / Card' })
          });
        } catch (e) {}
      }

      if (txnLabel) txnLabel.textContent = `Txn ID: ${txnId} verified. Official slip ready to print!`;
      if (defaultFooter) defaultFooter.classList.add('d-none');
      if (checkmarkBox) checkmarkBox.classList.remove('d-none');

      setTimeout(async () => {
        closePaymentModal();
        showToast('🎉 Registration Fee (₹1,000) Paid! Official receipt slip is ready.', 'success');
        await loadStudentDashboard();
        switchStudentNav('fees');
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        openPaymentReceiptModal(txnId);
      }, 1200);

    } else if (activePaymentSession.feeType === 'ADMISSION_FEE') {
      if (applicant.admissionFeePaid) {
        showToast('Admission fee has already been paid (Only 1 transaction permitted).', 'warning');
        closePaymentModal();
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        return;
      }

      const txnId = 'TXN-ADM-' + appId.split('-').pop() + '-' + Math.floor(100 + Math.random() * 900);
      db.applicants[applicantIndex].admissionFeePaid = true;
      db.applicants[applicantIndex].admissionFeeTxnId = txnId;
      db.applicants[applicantIndex].admissionFeePaidAt = timestamp;
      db.applicants[applicantIndex].status = 'ADMITTED';

      // Filter out any older duplicate admission transactions
      db.transactions = db.transactions.filter(t => 
        !((t.appId === appId || (t.candidateEmail && t.candidateEmail.toLowerCase() === applicant.email.toLowerCase())) && (t.type || '').includes('Admission'))
      );

      db.transactions.unshift({
        txnId: txnId,
        appId: appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Admission Seat Fee',
        amount: activePaymentSession.amount,
        mode: 'Net Banking / UPI',
        status: 'SUCCESS',
        timestamp: timestamp
      });

      if (!db.applicants[applicantIndex].notifications) db.applicants[applicantIndex].notifications = [];
      db.applicants[applicantIndex].notifications.unshift({
        id: 'notif-' + Date.now(),
        title: 'Admission Confirmed!',
        message: `Your seat in ${applicant.course} has been permanently enrolled. Official fee slip ready!`,
        timestamp: timestamp,
        read: false,
        type: 'success'
      });

      saveDB(db);

      if (currentSession && currentSession.token) {
        try {
          await fetch(`${API_BASE_URL}/payments/pay-admission-fee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession.token}` },
            body: JSON.stringify({ mode: 'Net Banking / UPI' })
          });
        } catch (e) {}
      }

      if (txnLabel) txnLabel.textContent = `Txn ID: ${txnId} verified. Seat confirmed & slip ready to print!`;
      if (defaultFooter) defaultFooter.classList.add('d-none');
      if (checkmarkBox) checkmarkBox.classList.remove('d-none');

      setTimeout(async () => {
        closePaymentModal();
        showToast('🎉 Provisional Admission Fee Paid! Official receipt slip ready.', 'success');
        await loadStudentDashboard();
        switchStudentNav('fees');
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        openPaymentReceiptModal(txnId);
      }, 1200);

    } else if (activePaymentSession.feeType === 'SEMESTER_FEE') {
      if (applicant.semesterFeePaid) {
        showToast('Semester fee has already been paid (Only 1 transaction permitted).', 'warning');
        closePaymentModal();
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        return;
      }

      const txnId = 'TXN-SEM-' + appId.split('-').pop() + '-' + Math.floor(100 + Math.random() * 900);
      db.applicants[applicantIndex].semesterFeePaid = true;
      db.applicants[applicantIndex].semesterFeeTxnId = txnId;
      db.applicants[applicantIndex].semesterFeePaidAt = timestamp;

      // Filter out any older duplicate semester transactions
      db.transactions = db.transactions.filter(t => 
        !((t.appId === appId || (t.candidateEmail && t.candidateEmail.toLowerCase() === applicant.email.toLowerCase())) && (t.type || '').includes('Semester'))
      );

      db.transactions.unshift({
        txnId: txnId,
        appId: appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Semester Tuition Fee',
        amount: activePaymentSession.amount,
        mode: 'Net Banking / UPI',
        status: 'SUCCESS',
        timestamp: timestamp
      });

      if (!db.applicants[applicantIndex].notifications) db.applicants[applicantIndex].notifications = [];
      db.applicants[applicantIndex].notifications.unshift({
        id: 'notif-' + Date.now(),
        title: '1st Semester Tuition Paid!',
        message: `Your payment of ₹${activePaymentSession.amount.toLocaleString()} (Txn ID: ${txnId}) has been confirmed. Official fee slip ready!`,
        timestamp: timestamp,
        read: false,
        type: 'success'
      });

      saveDB(db);

      if (currentSession && currentSession.token) {
        try {
          await fetch(`${API_BASE_URL}/payments/pay-semester-fee`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession.token}` },
            body: JSON.stringify({ mode: 'Net Banking / UPI' })
          });
        } catch (e) {}
      }

      if (txnLabel) txnLabel.textContent = `Txn ID: ${txnId} verified. Semester enrollment slip ready to print!`;
      if (defaultFooter) defaultFooter.classList.add('d-none');
      if (checkmarkBox) checkmarkBox.classList.remove('d-none');

      setTimeout(async () => {
        closePaymentModal();
        showToast('🎓 1st Semester Tuition Fee Paid! Official slip ready.', 'success');
        await loadStudentDashboard();
        switchStudentNav('fees');
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        openPaymentReceiptModal(txnId);
      }, 1200);
    }
  }, 750);
}

// ==========================================================================
// OFFICIAL PRINTABLE PAYMENT RECEIPT VOUCHER CONTROLLER
// ==========================================================================
function openPaymentReceiptModal(txnId) {
  const db = getDB();
  const applicant = (currentSession && currentSession.email)
    ? db.applicants.find(a => a.email && a.email.toLowerCase() === currentSession.email.toLowerCase())
    : null;

  let txn = (db.transactions || []).find(t => t.txnId === txnId);
  if (!txn && applicant) {
    if (applicant.appFeeTxnId === txnId) {
      txn = {
        txnId: applicant.appFeeTxnId,
        appId: applicant.appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Application Fee',
        amount: 1000,
        mode: 'Online UPI / Card',
        status: 'SUCCESS',
        timestamp: applicant.appFeePaidAt || new Date().toISOString()
      };
    } else if (applicant.admissionFeeTxnId === txnId) {
      txn = {
        txnId: applicant.admissionFeeTxnId,
        appId: applicant.appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Admission Seat Fee',
        amount: applicant.admissionFeeAmount || 50000,
        mode: 'Net Banking / UPI',
        status: 'SUCCESS',
        timestamp: applicant.admissionFeePaidAt || new Date().toISOString()
      };
    } else if (applicant.semesterFeeTxnId === txnId) {
      txn = {
        txnId: applicant.semesterFeeTxnId,
        appId: applicant.appId,
        candidateName: applicant.fullName,
        candidateEmail: applicant.email,
        type: 'Semester Tuition Fee',
        amount: applicant.semesterFeeAmount || 85000,
        mode: 'Net Banking / UPI',
        status: 'SUCCESS',
        timestamp: applicant.semesterFeePaidAt || new Date().toISOString()
      };
    }
  }

  if (!txn) {
    showToast('Payment receipt record could not be loaded.', 'error');
    return;
  }

  const modal = document.getElementById('paymentReceiptModal');
  if (!modal) return;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const appId = txn.appId || (applicant ? applicant.appId : 'IEM-2026');
  const candidateName = txn.candidateName || (applicant ? applicant.fullName : 'Student');
  const candidateEmail = txn.candidateEmail || (applicant ? applicant.email : '');
  const candidateCourse = applicant ? applicant.course : 'B.Tech Computer Science & Engineering';

  setEl('rcptTxnId', txn.txnId);
  setEl('rcptDate', new Date(txn.timestamp).toLocaleString());
  setEl('rcptAppId', appId);
  setEl('rcptCandidateName', candidateName);
  setEl('rcptCourse', candidateCourse);
  setEl('rcptEmail', candidateEmail);
  setEl('rcptMode', txn.mode || 'Online UPI / Card');
  setEl('rcptBarcodeCode', `IEM-FIN-2026-${txn.txnId}`);

  const typeLower = (txn.type || '').toLowerCase();
  let partTitle = 'Application & Registration Processing Fee';
  let partDesc = 'Mandatory non-refundable institutional admission processing fee';
  let words = 'Rupees One Thousand Only';

  if (typeLower.includes('admission') || typeLower.includes('seat')) {
    partTitle = 'Provisional Admission & Seat Allotment Confirmation Fee';
    partDesc = `Provisional seat reservation and institutional enrollment fee for ${candidateCourse}`;
    words = txn.amount === 50000 ? 'Rupees Fifty Thousand Only' : `Rupees ${txn.amount.toLocaleString()} Only`;
  } else if (typeLower.includes('semester')) {
    partTitle = '1st Semester Academic Tuition & Laboratory Fee';
    partDesc = `First Semester comprehensive academic, lab, faculty & library fee for ${candidateCourse}`;
    words = txn.amount === 85000 ? 'Rupees Eighty Five Thousand Only' : `Rupees ${txn.amount.toLocaleString()} Only`;
  }

  setEl('rcptParticularsTitle', partTitle);
  setEl('rcptParticularsDesc', partDesc);
  setEl('rcptTableAmount', `₹ ${txn.amount.toLocaleString()}.00`);
  setEl('rcptTotalAmount', `₹ ${txn.amount.toLocaleString()}.00`);
  setEl('rcptAmountWords', words);

  modal.classList.remove('d-none');
}

function closePaymentReceiptModal() {
  const modal = document.getElementById('paymentReceiptModal');
  if (modal) modal.classList.add('d-none');
}

function printReceiptSlip() {
  window.print();
}

// ==========================================================================
// 12. ADMINISTRATOR DASHBOARD & QUEUE INSPECTION
// ==========================================================================
let activeAdminNavTab = 'dashboard';
let activeAdminReviewAppId = null;

function switchAdminNav(tabKey) {
  activeAdminNavTab = tabKey;

  const btnMap = {
    dashboard: 'btnNavAdminDashboard',
    applications: 'btnNavAdminApplications',
    students: 'btnNavAdminStudents',
    payments: 'btnNavAdminPayments',
    notifications: 'btnNavAdminNotifications'
  };

  const paneMap = {
    dashboard: 'tabAdminNavDashboard',
    applications: 'tabAdminNavApplications',
    students: 'tabAdminNavStudents',
    payments: 'tabAdminNavPayments',
    notifications: 'tabAdminNavNotifications'
  };

  document.querySelectorAll('#adminSidebar .sidebar-nav-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(btnMap[tabKey]);
  if (activeBtn) activeBtn.classList.add('active');

  document.querySelectorAll('#adminContentArea .tab-pane').forEach(p => p.classList.remove('active'));
  const activePane = document.getElementById(paneMap[tabKey]);
  if (activePane) activePane.classList.add('active');

  if (tabKey === 'applications') renderAdminApplicantsTable();
  if (tabKey === 'students') renderAdminAdmittedStudentsTable();
  if (tabKey === 'payments') renderAdminTransactionsTable();
}

async function loadAdminDashboard() {
  const loggedOutCard = document.getElementById('adminLoggedOutState');
  const loggedInPortal = document.getElementById('adminLoggedInState');

  if (!currentSession || currentSession.role !== 'admin') {
    if (loggedOutCard) loggedOutCard.classList.remove('d-none');
    if (loggedInPortal) loggedInPortal.classList.add('d-none');
    return;
  }

  if (loggedOutCard) loggedOutCard.classList.add('d-none');
  if (loggedInPortal) loggedInPortal.classList.remove('d-none');

  // Synchronize with backend API if available
  if (currentSession && currentSession.token) {
    try {
      const [resApps, resTxns] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/applicants`, { headers: { 'Authorization': `Bearer ${currentSession.token}` } }),
        fetch(`${API_BASE_URL}/admin/transactions`, { headers: { 'Authorization': `Bearer ${currentSession.token}` } })
      ]);
      const dataApps = await resApps.json();
      const dataTxns = await resTxns.json();
      
      const db = getDB();
      if (dataApps.success && Array.isArray(dataApps.applicants) && dataApps.applicants.length > 0) {
        // Merge backend applicants into local DB
        dataApps.applicants.forEach(apiApp => {
          const idx = db.applicants.findIndex(a => (a.appId || a.id) === (apiApp.appId || apiApp.id) || (a.email && a.email.toLowerCase() === apiApp.email.toLowerCase()));
          if (idx !== -1) {
            db.applicants[idx] = { ...db.applicants[idx], ...apiApp };
          } else {
            db.applicants.push(apiApp);
          }
        });
      }
      if (dataTxns.success && Array.isArray(dataTxns.transactions) && dataTxns.transactions.length > 0) {
        db.transactions = dataTxns.transactions;
      }
      saveDB(db);
    } catch (e) {
      console.warn('Backend admin fetch fallback to local DB:', e);
    }
  }

  renderAdminKPIs();
  renderAdminStatusDistribution();
  renderAdminRecentPendingQueue();
  renderAdminApplicantsTable();
  renderAdminAdmittedStudentsTable();
  renderAdminTransactionsTable();
}

function renderAdminKPIs() {
  const db = getDB();
  const applicants = db.applicants || [];
  const transactions = db.transactions || [];

  const total = applicants.length;
  const pending = applicants.filter(a => a.status === 'UNDER_REVIEW').length;
  const approved = applicants.filter(a => a.status === 'APPROVED').length;
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  animateValueCounter('kpiTotalApplicants', 0, total, 600);
  animateValueCounter('kpiPendingReviews', 0, pending, 600);
  animateValueCounter('kpiApprovedSeats', 0, approved, 600);
  animateValueCounter('kpiTotalRevenue', 0, totalRevenue, 700, '₹ ');

  const pendingBadge = document.getElementById('adminPendingCountBadge');
  if (pendingBadge) {
    pendingBadge.textContent = pending;
    pendingBadge.style.display = pending > 0 ? 'inline-block' : 'none';
  }
}

function renderAdminStatusDistribution() {
  const container = document.getElementById('adminStatusDistributionGraph');
  if (!container) return;

  const db = getDB();
  const list = db.applicants || [];
  const total = list.length || 1;

  const counts = {
    ADMITTED: list.filter(a => a.status === 'ADMITTED').length,
    APPROVED: list.filter(a => a.status === 'APPROVED').length,
    UNDER_REVIEW: list.filter(a => a.status === 'UNDER_REVIEW').length,
    APP_FEE_PENDING: list.filter(a => a.status === 'APP_FEE_PENDING').length
  };

  const getPct = count => Math.round((count / total) * 100);

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:4px;">
        <span style="color:var(--mint-green-dark); font-weight:700;"><i class="fa-solid fa-graduation-cap"></i> Confirmed Admitted (${counts.ADMITTED})</span>
        <span>${getPct(counts.ADMITTED)}%</span>
      </div>
      <div style="height:8px; background:var(--warm-off-white); border-radius:4px; overflow:hidden;">
        <div style="width:${getPct(counts.ADMITTED)}%; height:100%; background:var(--mint-green-dark); border-radius:4px;"></div>
      </div>
    </div>

    <div>
      <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:4px;">
        <span style="color:var(--electric-violet); font-weight:700;"><i class="fa-solid fa-user-check"></i> Approved - Awaiting Fee (${counts.APPROVED})</span>
        <span>${getPct(counts.APPROVED)}%</span>
      </div>
      <div style="height:8px; background:var(--warm-off-white); border-radius:4px; overflow:hidden;">
        <div style="width:${getPct(counts.APPROVED)}%; height:100%; background:var(--electric-violet); border-radius:4px;"></div>
      </div>
    </div>

    <div>
      <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:4px;">
        <span style="color:var(--coral); font-weight:700;"><i class="fa-solid fa-clock"></i> Pending Review Queue (${counts.UNDER_REVIEW})</span>
        <span>${getPct(counts.UNDER_REVIEW)}%</span>
      </div>
      <div style="height:8px; background:var(--warm-off-white); border-radius:4px; overflow:hidden;">
        <div style="width:${getPct(counts.UNDER_REVIEW)}%; height:100%; background:var(--coral); border-radius:4px;"></div>
      </div>
    </div>
  `;
}

function renderAdminRecentPendingQueue() {
  const container = document.getElementById('adminRecentPendingList');
  if (!container) return;

  const db = getDB();
  const pendings = (db.applicants || []).filter(a => a.status === 'UNDER_REVIEW').slice(0, 3);

  if (pendings.length === 0) {
    container.innerHTML = `<p style="font-size:0.85rem; color:var(--muted-text); padding:10px 0;">No pending applications requiring officer review right now.</p>`;
    return;
  }

  container.innerHTML = pendings.map(a => `
    <div style="background:var(--warm-off-white); border:1px solid var(--lavender-border); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong style="font-size:0.88rem; color:var(--primary-dark);">${a.fullName}</strong>
        <div style="font-size:0.75rem; color:var(--muted-text);">${a.course} • ${a.examRank}</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openAdminReviewModal('${a.appId || a.id}')">
        Inspect
      </button>
    </div>
  `).join('');
}

function renderAdminApplicantsTable() {
  const tbody = document.getElementById('adminApplicantsTableBody');
  if (!tbody) return;

  const db = getDB();
  const search = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('adminStatusFilter')?.value || 'ALL';
  const courseFilter = document.getElementById('adminCourseFilter')?.value || 'ALL';

  let list = db.applicants || [];

  if (search) {
    list = list.filter(a => 
      a.fullName.toLowerCase().includes(search) ||
      a.email.toLowerCase().includes(search) ||
      (a.appId || a.id).toLowerCase().includes(search)
    );
  }

  if (statusFilter !== 'ALL') list = list.filter(a => a.status === statusFilter);
  if (courseFilter !== 'ALL') list = list.filter(a => a.course === courseFilter);

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:30px; color:var(--muted-text);">No matching applicant dossiers found.</td></tr>`;
    return;
  }

  const statusBadges = {
    UNDER_REVIEW: '<span class="badge badge-warning">Pending Review</span>',
    APPROVED: '<span class="badge badge-info">Approved (Fee Due)</span>',
    ADMITTED: '<span class="badge badge-success">Admitted</span>',
    REJECTED: '<span class="badge badge-danger">Rejected</span>',
    RE_UPLOAD_REQUEST: '<span class="badge badge-warning">Flagged Docs</span>',
    APP_FEE_PENDING: '<span class="badge badge-danger">App Fee Due</span>'
  };

  tbody.innerHTML = list.map(a => {
    const docCount = Object.keys(a.documents || {}).length;
    const appId = a.appId || a.id;

    return `
      <tr>
        <td><strong>${appId}</strong></td>
        <td>
          <strong>${a.fullName}</strong>
          <div style="font-size:0.75rem; color:var(--muted-text);">${a.email}</div>
        </td>
        <td>
          <div style="font-weight:700; color:var(--deep-purple); font-size:0.84rem;">${a.course}</div>
          <small style="color:var(--muted-text);">${a.examType}: ${a.examRank}</small>
        </td>
        <td>
          ${a.appFeePaid ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Paid ₹1k</span>' : '<span class="badge badge-danger">Unpaid</span>'}
        </td>
        <td>
          <span class="badge ${docCount >= 4 ? 'badge-info' : 'badge-warning'}">${docCount} / 6 Uploaded</span>
        </td>
        <td>${statusBadges[a.status] || a.status}</td>
        <td>
          ${a.admissionFeePaid ? '<span class="badge badge-success">Paid</span>' : '<span style="font-size:0.8rem; color:var(--muted-text);">₹ ' + (a.admissionFeeAmount || 50000).toLocaleString() + '</span>'}
        </td>
        <td class="text-right">
          <button class="btn btn-primary btn-sm" onclick="openAdminReviewModal('${appId}')">
            <i class="fa-solid fa-user-check"></i> Verify
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminAdmittedStudentsTable() {
  const tbody = document.getElementById('adminAdmittedStudentsTableBody');
  if (!tbody) return;

  const db = getDB();
  const admitted = (db.applicants || []).filter(a => a.status === 'ADMITTED');

  if (admitted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:20px; color:var(--muted-text);">No candidates confirmed enrolled yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = admitted.map(a => `
    <tr>
      <td><strong>${a.appId || a.id}</strong></td>
      <td><strong>${a.fullName}</strong></td>
      <td>${a.email}<br><small>${formatFullPhoneDisplay(a.countryCode, a.phone)}</small></td>
      <td><strong style="color:var(--deep-purple);">${a.course}</strong></td>
      <td><code>${a.admissionFeeTxnId || 'TXN-CONFIRMED'}</code></td>
      <td>${new Date(a.admissionFeePaidAt || Date.now()).toLocaleDateString()}</td>
      <td class="text-right">
        <button class="btn btn-outline btn-sm" onclick="openAdminReviewModal('${a.appId || a.id}')">
          <i class="fa-solid fa-file-lines"></i> Letter
        </button>
      </td>
    </tr>
  `).join('');
}

function renderAdminTransactionsTable() {
  const tbody = document.getElementById('adminTransactionsTableBody');
  if (!tbody) return;

  const db = getDB();
  const txns = db.transactions || [];

  if (txns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:20px; color:var(--muted-text);">No central ledger transactions logged.</td></tr>`;
    return;
  }

  tbody.innerHTML = txns.map(t => `
    <tr>
      <td><code>${t.txnId}</code></td>
      <td>${new Date(t.timestamp).toLocaleString()}</td>
      <td><strong>${t.candidateName}</strong> <small>(${t.appId})</small></td>
      <td>${t.type}</td>
      <td><strong style="color:var(--electric-violet);">₹ ${t.amount.toLocaleString()}</strong></td>
      <td>${t.mode || 'Online UPI / Card'}</td>
      <td><span class="badge badge-success">${t.status || 'SUCCESS'}</span></td>
      <td class="text-right">
        <button class="btn btn-outline btn-sm" onclick="openPaymentReceiptModal('${t.txnId}')" title="View & Print Official Slip">
          <i class="fa-solid fa-print"></i> Slip
        </button>
      </td>
    </tr>
  `).join('');
}

function openAdminReviewModal(appId) {
  activeAdminReviewAppId = appId;
  const db = getDB();
  const applicant = db.applicants.find(a => (a.appId || a.id) === appId);
  if (!applicant) return;

  document.getElementById('reviewModalHeader').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <h3 style="font-size:1.3rem; color:var(--primary-dark);"><i class="fa-solid fa-id-card-clip" style="color:var(--electric-violet);"></i> Application Review: ${applicant.fullName}</h3>
        <span style="font-size:0.82rem; color:var(--muted-text);">App ID: <strong>${appId}</strong> | Gmail: <strong>${applicant.email}</strong></span>
      </div>
      <div>
        <span class="badge badge-info">${applicant.status}</span>
      </div>
    </div>
  `;

  document.getElementById('reviewDetailsCol').innerHTML = `
    <h4 style="margin-bottom:12px; font-size:0.95rem; color:var(--deep-purple); font-weight:800;"><i class="fa-solid fa-user-graduate"></i> Academic &amp; Personal Dossier</h4>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.84rem;">
      <div><strong>Full Name:</strong> ${applicant.fullName}</div>
      <div><strong>Gender / DOB:</strong> ${applicant.gender} / ${applicant.dob || '2005-04-12'}</div>
      <div><strong>Aadhaar:</strong> <span style="font-family:monospace;">${formatAadharDisplay(applicant.aadharNumber)}</span></div>
      <div><strong>Mobile:</strong> ${formatFullPhoneDisplay(applicant.countryCode, applicant.phone)}</div>
      <div><strong>Entrance Exam:</strong> ${applicant.examType}</div>
      <div><strong>Score / Rank:</strong> <strong style="color:var(--electric-violet);">${applicant.examRank}</strong></div>
      <div><strong>Class 10th:</strong> ${applicant.score10th}% ${applicant.score10th >= 50 ? '<span class="badge badge-success">✓ ≥ 50%</span>' : '<span class="badge badge-danger">⚠</span>'}</div>
      <div><strong>Class 12th:</strong> ${applicant.score12th}% ${applicant.score12th > 60 ? '<span class="badge badge-success">✓ > 60%</span>' : '<span class="badge badge-danger">⚠</span>'}</div>
      <div style="grid-column:span 2;"><strong>Desired Program:</strong> <strong style="color:var(--deep-purple);">${applicant.course}</strong></div>
      <div style="grid-column:span 2;"><strong>Address:</strong> ${applicant.address || 'Kolkata, West Bengal'}</div>
    </div>
  `;

  const docs = applicant.documents || {};
  document.getElementById('adminReviewDocList').innerHTML = REQUIRED_DOCS.map(docDef => {
    const uploaded = docs[docDef.key];
    const isUploaded = !!uploaded;
    const status = uploaded ? uploaded.status : 'PENDING';

    return `
      <div style="background:var(--warm-off-white); border:1px solid var(--lavender-border); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <i class="fa-solid ${docDef.type === 'image' ? 'fa-file-image' : 'fa-file-pdf'}" style="color:var(--electric-violet);"></i>
          <div>
            <strong style="font-size:0.84rem;">${docDef.title}</strong>
            <div style="font-size:0.72rem; color:var(--muted-text);">${isUploaded ? uploaded.name : 'Missing'}</div>
          </div>
        </div>

        <div style="display:flex; gap:6px;">
          ${isUploaded ? `
            <button class="btn btn-secondary-light btn-sm" onclick="previewDocument('${appId}', '${docDef.key}')">View</button>
            <button class="btn btn-outline btn-sm" style="color:var(--mint-green-dark);" onclick="toggleDocVerification('${appId}', '${docDef.key}', 'VERIFIED')">Verify</button>
            <button class="btn btn-outline btn-sm" style="color:var(--coral);" onclick="toggleDocVerification('${appId}', '${docDef.key}', 'FLAGGED')">Flag</button>
          ` : '<span style="font-size:0.75rem; color:var(--coral);">Not Uploaded</span>'}
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('adminDecisionRemarks').value = applicant.adminRemarks || '';
  document.getElementById('adminSetAdmissionFee').value = applicant.admissionFeeAmount || 50000;

  document.getElementById('adminReviewModal').classList.remove('d-none');
}

function closeAdminReviewModal() {
  document.getElementById('adminReviewModal').classList.add('d-none');
  activeAdminReviewAppId = null;
}

async function toggleDocVerification(appId, docKey, newStatus) {
  const db = getDB();
  const idx = db.applicants.findIndex(a => (a.appId || a.id) === appId);
  if (idx === -1) return;

  if (db.applicants[idx].documents && db.applicants[idx].documents[docKey]) {
    db.applicants[idx].documents[docKey].status = newStatus;
    saveDB(db);
  }

  if (currentSession && currentSession.token) {
    try {
      await fetch(`${API_BASE_URL}/admin/applicants/${appId}/verify-doc`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`
        },
        body: JSON.stringify({ docKey, status: newStatus })
      });
    } catch (e) {
      console.warn('Verify doc API call failed:', e);
    }
  }

  showToast(`Document marked as ${newStatus}`, 'info');
  openAdminReviewModal(appId);
  renderAdminApplicantsTable();
}

async function submitAdminDecision(verdict) {
  if (!activeAdminReviewAppId) return;

  const db = getDB();
  const idx = db.applicants.findIndex(a => (a.appId || a.id) === activeAdminReviewAppId);
  if (idx === -1) return;

  const remarks = document.getElementById('adminDecisionRemarks').value.trim();
  const admFee = parseFloat(document.getElementById('adminSetAdmissionFee').value) || 50000;

  db.applicants[idx].status = verdict;
  db.applicants[idx].adminRemarks = remarks || (verdict === 'APPROVED' ? `Documents verified and seat allocated in ${db.applicants[idx].course}.` : 'Application reviewed.');
  db.applicants[idx].admissionFeeAmount = admFee;

  if (!db.applicants[idx].notifications) db.applicants[idx].notifications = [];
  db.applicants[idx].notifications.unshift({
    id: 'notif-' + Date.now(),
    title: verdict === 'APPROVED' ? 'Application Approved! 🎉' : (verdict === 'REJECTED' ? 'Application Status Update' : 'Document Attention Needed'),
    message: db.applicants[idx].adminRemarks,
    timestamp: new Date().toISOString(),
    read: false,
    type: verdict === 'APPROVED' ? 'success' : (verdict === 'REJECTED' ? 'warning' : 'info')
  });

  saveDB(db);

  if (currentSession && currentSession.token) {
    try {
      await fetch(`${API_BASE_URL}/admin/applicants/${activeAdminReviewAppId}/decision`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentSession.token}` },
        body: JSON.stringify({ verdict, remarks: db.applicants[idx].adminRemarks, admissionFeeAmount: admFee })
      });
    } catch (e) {}
  }

  closeAdminReviewModal();
  showToast(`Applicant ${db.applicants[idx].fullName} marked as ${verdict}!`, 'success');
  await loadAdminDashboard();
}

function handleSendBroadcastNotification(e) {
  e.preventDefault();
  const title = document.getElementById('broadcastTitleInput').value.trim();
  const message = document.getElementById('broadcastMessageInput').value.trim();
  const audience = document.getElementById('broadcastTargetAudience').value;

  const db = getDB();
  let count = 0;

  (db.applicants || []).forEach(a => {
    if (audience === 'ALL' || a.status === audience) {
      if (!a.notifications) a.notifications = [];
      a.notifications.unshift({
        id: 'broadcast-' + Date.now() + '-' + Math.random(),
        title: title,
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'info'
      });
      count++;
    }
  });

  saveDB(db);
  showToast(`Broadcast notification published to ${count} candidate(s)!`, 'success');
  document.getElementById('broadcastTitleInput').value = '';
  document.getElementById('broadcastMessageInput').value = '';
}

// ==========================================================================
// 13. DOCUMENT LIGHTBOX PREVIEW
// ==========================================================================
function previewDocument(appId, docKey) {
  const db = getDB();
  const applicant = db.applicants.find(a => (a.appId || a.id) === appId);
  if (!applicant || !applicant.documents || !applicant.documents[docKey]) {
    showToast('Document file not found.', 'error');
    return;
  }

  const doc = applicant.documents[docKey];
  const docDef = REQUIRED_DOCS.find(d => d.key === docKey);
  const title = docDef ? docDef.title : docKey;

  const modal = document.getElementById('docPreviewModal');
  const titleEl = document.getElementById('docPreviewTitle');
  const bodyEl = document.getElementById('docPreviewBody');

  titleEl.innerHTML = `<i class="fa-solid fa-file"></i> ${title} - ${doc.name}`;

  const docUrl = doc.fileUrl || doc.previewUrl;
  const isImage = docUrl && (
    docUrl.startsWith('data:image') ||
    /\.(jpg|jpeg|png|webp|gif|svg|jfif|bmp)($|\?)/i.test(docUrl) ||
    (docDef && docDef.type === 'image')
  );
  const isPdf = docUrl && (
    docUrl.startsWith('data:application/pdf') ||
    docUrl.startsWith('blob:') ||
    /\.pdf($|\?)/i.test(docUrl) ||
    (docDef && docDef.type === 'pdf')
  );

  let previewBodyHtml = '';
  if (isImage) {
    previewBodyHtml = `
      <div style="text-align:center; padding:10px;">
        <img src="${docUrl}" style="max-height:500px; max-width:100%; border-radius:8px; box-shadow:var(--shadow-md); object-fit:contain;" alt="${doc.name}" />
      </div>
    `;
  } else if (isPdf) {
    previewBodyHtml = `
      <div style="text-align:center;">
        <iframe src="${docUrl}" style="width:100%; height:480px; border:1px solid var(--lavender-border); border-radius:8px;"></iframe>
      </div>
    `;
  } else {
    previewBodyHtml = `
      <div style="background:var(--warm-off-white); border:2px dashed var(--lavender-border); border-radius:8px; padding:40px 20px; text-align:center;">
        <i class="fa-solid fa-file-shield" style="font-size:3.5rem; color:var(--electric-violet); margin-bottom:12px;"></i>
        <h3>${doc.name}</h3>
        <p style="color:var(--muted-text); font-size:0.9rem; margin-top:6px;">
          Scanned Official Document | IEM Verification System
        </p>
        <div style="margin-top:16px; display:inline-block; background:var(--white); padding:8px 16px; border-radius:4px; border:1px solid var(--lavender-border); font-size:0.8rem; font-family:monospace;">
          Digital Stamp: SHA256-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}
        </div>
      </div>
    `;
  }

  bodyEl.innerHTML = `
    ${previewBodyHtml}
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid var(--lavender-border); flex-wrap:wrap; gap:8px;">
      <span style="font-size:0.82rem; color:var(--muted-text);"><i class="fa-solid fa-clock"></i> Uploaded: ${doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : 'N/A'}</span>
      ${docUrl ? `<a href="${docUrl}" target="_blank" download="${doc.name}" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open / Download Full File</a>` : ''}
    </div>
  `;

  modal.classList.remove('d-none');
}

function closeDocPreviewModal() {
  document.getElementById('docPreviewModal').classList.add('d-none');
}

// ==========================================================================
// 14. EXPORT JSON / CSV & TOAST SYSTEM
// ==========================================================================
function exportDatabaseAsJSON() {
  const db = getDB();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `iem_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('Database exported as JSON backup!', 'success');
}

function exportApplicantsCSV() {
  const db = getDB();
  const applicants = db.applicants || [];
  const headers = ['Application ID', 'Full Name', 'Gmail ID', 'Aadhaar', 'Mobile', 'Course', '10th %', '12th %', 'Exam Rank', 'Status', 'App Fee Paid', 'Admission Fee Paid'];
  const rows = applicants.map(a => [
    a.appId || a.id,
    `"${a.fullName}"`,
    a.email,
    `"${a.aadharNumber || ''}"`,
    `"${formatFullPhoneDisplay(a.countryCode, a.phone)}"`,
    `"${a.course}"`,
    a.score10th,
    a.score12th,
    `"${a.examRank}"`,
    a.status,
    a.appFeePaid ? 'YES' : 'NO',
    a.admissionFeePaid ? 'YES' : 'NO'
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const a = document.createElement('a');
  a.href = encodeURI(csvContent);
  a.download = `iem_applicants_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('Applicants roster exported as CSV!', 'success');
}

function openAuthModal(mode) {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('d-none');
  switchAuthModalMode(mode);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('d-none');
}

function switchAuthModalMode(mode) {
  const regView = document.getElementById('authRegisterView');
  const loginView = document.getElementById('authLoginView');
  if (mode === 'login') {
    if (regView) regView.classList.add('d-none');
    if (loginView) loginView.classList.remove('d-none');
  } else {
    if (regView) regView.classList.remove('d-none');
    if (loginView) loginView.classList.add('d-none');
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: '<i class="fa-solid fa-circle-check" style="color:var(--mint-green); font-size:1.2rem;"></i>',
    error: '<i class="fa-solid fa-circle-xmark" style="color:var(--coral); font-size:1.2rem;"></i>',
    info: '<i class="fa-solid fa-circle-info" style="color:var(--bright-cyan); font-size:1.2rem;"></i>'
  };

  toast.innerHTML = `
    ${icons[type] || icons.info}
    <div style="flex:1;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global App Initialization
function initApp() {
  currentSession = getSession();
  updateNavigationAuthUI();
  renderProgramsList();

  if (currentSession && currentSession.role === 'admin') {
    navigateTo('admin');
  } else if (currentSession && currentSession.role === 'student') {
    navigateTo('student');
  } else {
    navigateTo('home');
    // Animate homepage stats
    setTimeout(() => {
      animateValueCounter('homeStatStudents', 0, 12400, 1000, '', '+');
    }, 300);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
