-- 001_create_tables.sql
-- Database and Table Definitions for IEM Admission Management System

CREATE DATABASE IF NOT EXISTS iem_admission_system;
USE iem_admission_system;

-- Users table (Authentication credentials)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  full_name VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applicants table (Candidate Profile & Academic records)
CREATE TABLE IF NOT EXISTS applicants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  app_id VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  country_code VARCHAR(10) DEFAULT '+91',
  aadhar_number VARCHAR(20),
  father_name VARCHAR(255),
  dob DATE,
  gender ENUM('Male', 'Female', 'Other'),
  category ENUM('General', 'OBC', 'SC', 'ST', 'EWS') DEFAULT 'General',
  address TEXT,
  course VARCHAR(255) NOT NULL,
  score_10th DECIMAL(5,2),
  score_12th DECIMAL(5,2),
  exam_type VARCHAR(100),
  exam_rank VARCHAR(100),
  status ENUM('APP_FEE_PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ADMITTED', 'RE_UPLOAD_REQUEST') DEFAULT 'APP_FEE_PENDING',
  admin_remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  app_id VARCHAR(50) NOT NULL,
  course VARCHAR(255) NOT NULL,
  status ENUM('APP_FEE_PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ADMITTED') DEFAULT 'APP_FEE_PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Documents table (Uploaded credentials and verification status)
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicant_id INT NOT NULL,
  doc_key VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  status ENUM('PENDING', 'UPLOADED', 'VERIFIED', 'FLAGGED') DEFAULT 'UPLOADED',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Transactions table (Payment ledger)
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  txn_id VARCHAR(100) NOT NULL UNIQUE,
  app_id VARCHAR(50) NOT NULL,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  type ENUM('Application Fee', 'Admission Seat Fee', 'Semester Tuition Fee') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  mode VARCHAR(50) DEFAULT 'Online UPI / Card',
  status ENUM('SUCCESS', 'PENDING', 'FAILED') DEFAULT 'SUCCESS',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seat Allotments table
CREATE TABLE IF NOT EXISTS seat_allotments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicant_id INT NOT NULL,
  course VARCHAR(255) NOT NULL,
  allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('PROVISIONAL', 'CONFIRMED', 'CANCELLED') DEFAULT 'PROVISIONAL',
  FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

