-- 002_constraints_indexes.sql
-- Performance Indexes and Constraints

USE iem_admission_system;

-- Indexes for fast lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

CREATE INDEX idx_applicants_user_id ON applicants(user_id);
CREATE INDEX idx_applicants_app_id ON applicants(app_id);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_app_id ON applications(app_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_course ON applications(course);
CREATE INDEX idx_applications_created_at ON applications(created_at);

CREATE INDEX idx_seat_allotments_applicant_id ON seat_allotments(applicant_id);

