-- 001_seed_data.sql
-- Seed Data for IEM Admission Management System

USE iem_admission_system;

-- Default Administrator (password: admin123)
INSERT INTO users (email, password, role, full_name, phone)
VALUES ('admin@gmail.com', '$2a$10$wT38vM4B6H1C7eL6f.r8bO3mR3z7hT4b9y6s8o.i2m4q8p1r3u7m.', 'admin', 'Admissions Officer', '9830000000')
ON DUPLICATE KEY UPDATE email=email;

-- Seed Candidate 1: Rahul Sharma (Under Review)
INSERT INTO applicants (app_id, full_name, email, phone, course, score_10th, score_12th, exam_type, exam_rank, status, admin_remarks)
VALUES ('IEM-2026-8492', 'Rahul Sharma', 'rahul.iem2026@gmail.com', '9830123456', 'B.Tech Computer Science & Engineering', 91.4, 88.6, 'WBJEE 2026', 'GMR 1420', 'UNDER_REVIEW', 'Application submitted with all mandatory marksheets. Ready for admission committee verification.')
ON DUPLICATE KEY UPDATE app_id=app_id;

-- Seed Candidate 2: Priya Banerjee (Approved / Provisional Seat Allocated)
INSERT INTO applicants (app_id, full_name, email, phone, course, score_10th, score_12th, exam_type, exam_rank, status, admin_remarks)
VALUES ('IEM-2026-9021', 'Priya Banerjee', 'priya.banerjee26@gmail.com', '9831987654', 'B.Tech Artificial Intelligence & Machine Learning', 95.2, 93.0, 'JEE Main 2026', '97.4 Percentile (AIR 28400)', 'APPROVED', 'Documents verified and approved. Provisional Seat Allocated in B.Tech AI & ML.')
ON DUPLICATE KEY UPDATE app_id=app_id;

-- Seed Candidate 3: Aniket Das (Admitted)
INSERT INTO applicants (app_id, full_name, email, phone, course, score_10th, score_12th, exam_type, exam_rank, status, admin_remarks)
VALUES ('IEM-2026-7310', 'Aniket Das', 'aniket.das99@gmail.com', '9007112233', 'B.Tech Information Technology', 87.0, 86.4, 'WBJEE 2026', 'GMR 3120', 'ADMITTED', 'Admission confirmed with full enrollment documents on file.')
ON DUPLICATE KEY UPDATE app_id=app_id;

