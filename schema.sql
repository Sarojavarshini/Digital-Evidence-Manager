-- Digital Evidence Manager Database Schema (MySQL 8.0+)
CREATE DATABASE IF NOT EXISTS digital_evidence_db;
USE digital_evidence_db;

-- Drop tables in reverse dependency order if resetting
DROP TABLE IF EXISTS custody_records;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS investigators;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'INVESTIGATOR', -- 'ADMIN' or 'INVESTIGATOR'
    department VARCHAR(100) DEFAULT 'Digital Forensics Unit',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Investigators Table (Admin Management)
CREATE TABLE investigators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    investigator_code VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    department VARCHAR(100) DEFAULT 'Cyber Crime Division',
    role VARCHAR(50) DEFAULT 'Senior Investigator',
    assigned_cases_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Cases Table
CREATE TABLE cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- Cybercrime, Fraud, Unauthorized Access, Data Theft, Harassment, Other
    priority VARCHAR(20) DEFAULT 'HIGH', -- Critical, High, Medium, Low
    status VARCHAR(30) DEFAULT 'ACTIVE', -- Active, Under Investigation, Closed
    investigator_name VARCHAR(150) NOT NULL,
    evidence_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Evidence Table
CREATE TABLE evidence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evidence_code VARCHAR(50) NOT NULL UNIQUE,
    case_id BIGINT NOT NULL,
    case_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- Image, Video, Audio, Document, Email, Log File, Archive, Other
    file_size BIGINT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    original_sha256_hash VARCHAR(64) NOT NULL,
    uploaded_by VARCHAR(150) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    source_device VARCHAR(200) NOT NULL,
    collection_location VARCHAR(200) NOT NULL,
    current_custodian VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'VERIFIED', -- VERIFIED, UNVERIFIED, COMPROMISED, TRANSFERRED
    file_path VARCHAR(500),
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- 5. Custody Records Table
CREATE TABLE custody_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evidence_id BIGINT NOT NULL,
    evidence_code VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL, -- Collected, Uploaded, Transferred, Reviewed, Verified, Archived
    previous_custodian VARCHAR(150),
    new_custodian VARCHAR(150),
    remarks TEXT,
    sha256_stamp VARCHAR(64) NOT NULL,
    FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE
);

-- 6. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL, -- LOGIN, LOGOUT, UPLOAD, VIEW, DOWNLOAD, VERIFY, TRANSFER, UPDATE, DELETE, INTEGRITY_ALERT
    evidence_code VARCHAR(50),
    case_code VARCHAR(50),
    ip_address VARCHAR(50) DEFAULT '192.168.1.104',
    description TEXT NOT NULL
);
