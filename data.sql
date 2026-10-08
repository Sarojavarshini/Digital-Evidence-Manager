-- Digital Evidence Manager Demo Seed Data

USE digital_evidence_db;

-- Clear previous demo data
DELETE FROM custody_records;
DELETE FROM audit_logs;
DELETE FROM evidence;
DELETE FROM cases;
DELETE FROM investigators;
DELETE FROM users;

-- 1. Insert Demo Users (Passwords hashed via BCrypt for 'admin123' and 'investigator123')
INSERT INTO users (id, username, email, password, full_name, role, department, status, created_at) VALUES
(1, 'admin', 'admin@dem.gov', '$2a$10$e80f08e0a29f8f4a38b.7.4b9b940e791e846c4f34d1b827e8a94', 'Chief Inspector Cyber Warfare', 'ADMIN', 'Executive Cyber Command', 'ACTIVE', '2026-09-01 08:00:00'),
(2, 'sjenkins', 'sarah.jenkins@dem.gov', '$2a$10$e80f08e0a29f8f4a38b.7.4b9b940e791e846c4f34d1b827e8a94', 'Det. Sarah Jenkins', 'INVESTIGATOR', 'Digital Forensics Unit', 'ACTIVE', '2026-09-02 09:30:00'),
(3, 'mvance', 'marcus.vance@dem.gov', '$2a$10$e80f08e0a29f8f4a38b.7.4b9b940e791e846c4f34d1b827e8a94', 'Det. Marcus Vance', 'INVESTIGATOR', 'Incident Response Team', 'ACTIVE', '2026-09-05 11:15:00');

-- 2. Insert Investigators
INSERT INTO investigators (id, investigator_code, user_id, name, email, department, role, assigned_cases_count, status, created_at) VALUES
(1, 'INV-8041', 2, 'Det. Sarah Jenkins', 'sarah.jenkins@dem.gov', 'Digital Forensics Unit', 'Lead Cyber Investigator', 2, 'ACTIVE', '2026-09-02 09:30:00'),
(2, 'INV-8092', 3, 'Det. Marcus Vance', 'marcus.vance@dem.gov', 'Incident Response Team', 'Senior Analyst', 1, 'ACTIVE', '2026-09-05 11:15:00'),
(3, 'INV-7712', NULL, 'Det. Elena Rostova', 'elena.rostova@dem.gov', 'Financial Crimes Task Force', 'Forensic Auditor', 0, 'ACTIVE', '2026-09-10 14:20:00');

-- 3. Insert Demo Cases
INSERT INTO cases (id, case_code, name, description, type, priority, status, investigator_name, evidence_count, created_at) VALUES
(1, 'CASE-2026-001', 'Unauthorized Access Investigation', 'Forensic analysis of rogue SSH sessions and unauthorized root privilege escalation on corporate database cluster DB-ALPHA.', 'Unauthorized Access', 'CRITICAL', 'Under Investigation', 'Det. Sarah Jenkins', 2, '2026-09-12 10:00:00'),
(2, 'CASE-2026-002', 'Digital Payment Fraud', 'Investigation of intercepted wire transfers and tampered API tokens in e-commerce payment gateway system.', 'Fraud', 'HIGH', 'Active', 'Det. Sarah Jenkins', 1, '2026-09-18 14:45:00'),
(3, 'CASE-2026-003', 'Data Theft & Exfiltration', 'Suspicious exfiltration of 45GB encrypted archive to offshore IP block via covert DNS tunneling protocol.', 'Data Theft', 'CRITICAL', 'Active', 'Det. Marcus Vance', 1, '2026-09-25 16:30:00');

-- 4. Insert Demo Evidence Files with SHA-256 Hashes
INSERT INTO evidence (id, evidence_code, case_id, case_code, name, file_type, file_size, sha256_hash, original_sha256_hash, uploaded_by, upload_date, source_device, collection_location, current_custodian, status, file_path) VALUES
(1, 'EVD-2026-001', 1, 'CASE-2026-001', 'server_auth_logs.zip', 'Archive', 14582912, '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Det. Sarah Jenkins', '2026-09-12 11:20:00', 'Server Host DB-ALPHA-01', 'Data Center Rack 4B, Room 302', 'Det. Sarah Jenkins', 'VERIFIED', '/uploads/CASE-2026-001/server_auth_logs.zip'),
(2, 'EVD-2026-002', 1, 'CASE-2026-001', 'cctv_server_room.mp4', 'Video', 214748364, 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', 'Det. Sarah Jenkins', '2026-09-12 15:40:00', 'Axis Q35 CCTV Cam #04', 'HQ Hallway East Entrance', 'Det. Sarah Jenkins', 'VERIFIED', '/uploads/CASE-2026-001/cctv_server_room.mp4'),
(3, 'EVD-2026-003', 2, 'CASE-2026-002', 'transaction_record.pdf', 'Document', 3891040, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'Det. Sarah Jenkins', '2026-09-18 16:10:00', 'FinTech Gateway Workstation #09', 'Finance Department Desk 14', 'Det. Sarah Jenkins', 'VERIFIED', '/uploads/CASE-2026-002/transaction_record.pdf'),
(4, 'EVD-2026-004', 3, 'CASE-2026-003', 'exfiltration_pcap.log', 'Log File', 84920194, '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', 'Det. Marcus Vance', '2026-09-25 17:05:00', 'Core Firewall PaloAlto 5200', 'SOC Security Monitoring Node', 'Det. Marcus Vance', 'VERIFIED', '/uploads/CASE-2026-003/exfiltration_pcap.log');

-- 5. Insert Custody Records
INSERT INTO custody_records (id, evidence_id, evidence_code, timestamp, user_name, action, previous_custodian, new_custodian, remarks, sha256_stamp) VALUES
(1, 1, 'EVD-2026-001', '2026-09-12 10:30:00', 'Det. Sarah Jenkins', 'Evidence Collected', 'N/A', 'Det. Sarah Jenkins', 'Initial seizure of DB-ALPHA server auth logs under warrant W-2026-88', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'),
(2, 1, 'EVD-2026-001', '2026-09-12 11:20:00', 'Det. Sarah Jenkins', 'Uploaded & Registered', 'Det. Sarah Jenkins', 'Det. Sarah Jenkins', 'Evidence registered to DEM Vault with SHA-256 verification stamp.', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'),
(3, 1, 'EVD-2026-001', '2026-09-15 09:15:00', 'Det. Sarah Jenkins', 'Verified Integrity', 'Det. Sarah Jenkins', 'Det. Sarah Jenkins', 'Automated SHA-256 integrity verification passed. Checksum matches original.', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'),
(4, 3, 'EVD-2026-003', '2026-09-18 16:10:00', 'Det. Sarah Jenkins', 'Uploaded & Registered', 'Det. Sarah Jenkins', 'Det. Sarah Jenkins', 'Payment transaction records extracted from bank server.', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
(5, 4, 'EVD-2026-004', '2026-09-25 17:05:00', 'Det. Marcus Vance', 'Uploaded & Registered', 'Det. Marcus Vance', 'Det. Marcus Vance', 'Network packet capture containing DNS exfiltration payload.', '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');

-- 6. Insert Audit Logs
INSERT INTO audit_logs (id, timestamp, username, role, action, evidence_code, case_code, ip_address, description) VALUES
(1, '2026-10-08 08:30:12', 'admin@dem.gov', 'ADMIN', 'LOGIN', NULL, NULL, '192.168.1.100', 'Administrator login successful.'),
(2, '2026-10-08 09:14:22', 'sarah.jenkins@dem.gov', 'INVESTIGATOR', 'LOGIN', NULL, NULL, '192.168.1.104', 'Investigator Det. Sarah Jenkins authenticated.'),
(3, '2026-10-08 10:02:45', 'sarah.jenkins@dem.gov', 'INVESTIGATOR', 'VERIFY', 'EVD-2026-001', 'CASE-2026-001', '192.168.1.104', 'SHA-256 verification passed for server_auth_logs.zip. Match 100%.'),
(4, '2026-10-08 11:20:10', 'marcus.vance@dem.gov', 'INVESTIGATOR', 'VIEW', 'EVD-2026-004', 'CASE-2026-003', '192.168.1.108', 'Accessed evidence metadata and chain of custody.'),
(5, '2026-10-08 12:45:00', 'admin@dem.gov', 'ADMIN', 'VIEW', NULL, NULL, '192.168.1.100', 'Exported system audit logs summary report.');
