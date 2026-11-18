const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Applicant = require('../../backend/src/models/Applicant');
const Transaction = require('../../backend/src/models/Transaction');

dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/IEM';

const initialApplicants = [
  {
    appId: 'IEM-2026-8492',
    fullName: 'Rahul Sharma',
    email: 'rahul.iem2026@gmail.com',
    phone: '9830123456',
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
    status: 'UNDER_REVIEW',
    appFeePaid: true,
    appFeeTxnId: 'TXN-APP-8492-991',
    appFeePaidAt: new Date('2026-09-28T10:25:00.000Z'),
    admissionFeeAmount: 50000,
    admissionFeePaid: false,
    adminRemarks: 'Application submitted with all mandatory marksheets. Ready for admission committee verification.',
    documents: {
      photo: { name: 'rahul_photo.jpg', fileUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', status: 'UPLOADED' },
      signature: { name: 'rahul_signature.png', fileUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200&auto=format&fit=crop&q=80', status: 'UPLOADED' },
      marksheet10: { name: 'class10_board_marksheet.pdf', fileUrl: '/uploads/sample10.pdf', status: 'UPLOADED' },
      marksheet12: { name: 'class12_cbse_marksheet.pdf', fileUrl: '/uploads/sample12.pdf', status: 'UPLOADED' },
      rankCard: { name: 'wbjee_rank_card_2026.pdf', fileUrl: '/uploads/sample_rank.pdf', status: 'UPLOADED' },
      idProof: { name: 'aadhar_card_scanned.pdf', fileUrl: '/uploads/sample_aadhar.pdf', status: 'UPLOADED' }
    }
  },
  {
    appId: 'IEM-2026-9021',
    fullName: 'Priya Banerjee',
    email: 'priya.banerjee26@gmail.com',
    phone: '9831987654',
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
    examRank: '97.4 Percentile (AIR 28400)',
    status: 'APPROVED',
    appFeePaid: true,
    appFeeTxnId: 'TXN-APP-9021-442',
    appFeePaidAt: new Date('2026-09-25T14:40:00.000Z'),
    admissionFeeAmount: 50000,
    admissionFeePaid: false,
    adminRemarks: 'Documents verified and approved. Provisional Seat Allocated in B.Tech AI & ML. Please pay admission fee to confirm enrollment.',
    documents: {
      photo: { name: 'priya_profile.jpg', fileUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', status: 'VERIFIED' },
      signature: { name: 'priya_sign.png', fileUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200&auto=format&fit=crop&q=80', status: 'VERIFIED' },
      marksheet10: { name: 'icse_10th_certificate.pdf', fileUrl: '/uploads/sample10.pdf', status: 'VERIFIED' },
      marksheet12: { name: 'isc_12th_marksheet.pdf', fileUrl: '/uploads/sample12.pdf', status: 'VERIFIED' },
      rankCard: { name: 'jee_main_scorecard.pdf', fileUrl: '/uploads/sample_rank.pdf', status: 'VERIFIED' },
      idProof: { name: 'aadhar_priya.pdf', fileUrl: '/uploads/sample_aadhar.pdf', status: 'VERIFIED' }
    }
  },
  {
    appId: 'IEM-2026-7310',
    fullName: 'Aniket Das',
    email: 'aniket.das99@gmail.com',
    phone: '9007112233',
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
    status: 'ADMITTED',
    appFeePaid: true,
    appFeeTxnId: 'TXN-APP-7310-101',
    appFeePaidAt: new Date('2026-09-20T09:10:00.000Z'),
    admissionFeeAmount: 50000,
    admissionFeePaid: true,
    admissionFeeTxnId: 'TXN-ADM-7310-502',
    admissionFeePaidAt: new Date('2026-09-22T11:15:00.000Z'),
    semesterFeePaid: false,
    semesterFeeAmount: 85000,
    adminRemarks: 'Full admission confirmed. Welcome to Institute of Engineering and Management (IEM), Kolkata.',
    documents: {
      photo: { name: 'aniket_photo.jpg', fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', status: 'VERIFIED' },
      signature: { name: 'aniket_sign.png', fileUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200&auto=format&fit=crop&q=80', status: 'VERIFIED' },
      marksheet10: { name: 'wbbse_10th_marksheet.pdf', fileUrl: '/uploads/sample10.pdf', status: 'VERIFIED' },
      marksheet12: { name: 'wbchse_12th_marksheet.pdf', fileUrl: '/uploads/sample12.pdf', status: 'VERIFIED' },
      rankCard: { name: 'wbjee_rankcard.pdf', fileUrl: '/uploads/sample_rank.pdf', status: 'VERIFIED' },
      idProof: { name: 'aadhar_aniket.pdf', fileUrl: '/uploads/sample_aadhar.pdf', status: 'VERIFIED' }
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB for seeding at: ${MONGO_URI}`);

    await Applicant.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing collections.');

    for (const appData of initialApplicants) {
      const applicant = new Applicant(appData);
      await applicant.save();
    }
    console.log(`✅ Seeded ${initialApplicants.length} applicants successfully!`);

    await mongoose.connection.close();
    console.log('Seeding complete. Connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedDB();

