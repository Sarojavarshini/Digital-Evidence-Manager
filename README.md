# Digital Evidence Manager (DEM) 🛡️

**Digital Evidence Manager** is a secure, professional digital-forensics evidence management system built for college final-year project demonstration. It provides authorized investigators and administrators with tools to upload, store, verify, track, and manage digital evidence with authoritative Java SHA-256 cryptographic hashing and a complete chain-of-custody audit log.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Cybersecurity Dark Navy Theme), Lucide Icons, Recharts
- **Backend**: Java 17, Spring Boot 3.2.x, Spring Data JPA, Spring Security 6
- **Database**: MySQL 8.0+ (with automatic schema initialization & seed data)
- **Cryptography**:
  - **Authoritative SHA-256 Checksums**: Java `java.security.MessageDigest` on Spring Boot Backend
  - **Client Preview Hashing**: Web Crypto API `crypto.subtle.digest`
  - **AES Encryption**: AES-256-CBC helper for sensitive stored fields
- **Build System**: Maven (Java) + NPM (React)

---

## ⚡ Quick Start & Demonstration

### 1. Database Setup (MySQL)
Create the MySQL database or let Spring Boot automatically create it:
```sql
CREATE DATABASE digital_evidence_db;
```
*Note: MySQL connection settings can be adjusted in `src/main/resources/application.yml`.*

### 2. Run Java Spring Boot Backend
Run the backend server on port `8080`:
```bash
# Using Maven:
mvn spring-boot:run
```

### 3. Run React Frontend
Run the Vite development server on port `5173`:
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Account Credentials

| Role | Email / Username | Password | Key Privileges |
|---|---|---|---|
| **Administrator** | `admin@dem.gov` / `admin` | `admin123` | Investigator Roster, Delete Evidence, Audit Telemetry, Reports |
| **Investigator** | `sarah.jenkins@dem.gov` / `sjenkins` | `investigator123` | Case Creation, Evidence Upload, SHA-256 Verification, Custody Transfer |

*Tip: Click **"Login Admin"** or **"Login Investigator"** on the login screen or top navbar for 1-click demonstration without typing.*

---

## 🔍 Core Modules & Demonstration Features

1. **Dashboard**: Live stats grid, Recharts visualizations (Evidence by Type, Cases by Lifecycle Status, Upload Velocity), and recent audit log feed.
2. **Case Management**: Register new cases with types (Cybercrime, Fraud, Unauthorized Access, Data Theft, Harassment), priority levels, and evidence count.
3. **Evidence Upload & Vault**: Upload evidence files. Client Web Crypto provides an instant UI hash preview, while the Spring Boot Java backend computes the official, authoritative 64-character SHA-256 hash.
4. **SHA-256 Verification Workbench**:
   - Recalculate Java `MessageDigest` SHA-256 hash in real time.
   - **GREEN STATUS**: "Evidence Verified - File integrity is intact."
   - **RED STATUS**: "Integrity Compromised - Hash mismatch detected!"
   - **Simulate Tampering Toggle**: Toggle live tampering on any file to demonstrate RED alert handling during project presentation!
5. **Chain of Custody**: Interactive timeline detailing evidence collection, registration, transfer between investigators, and cryptographic stamps.
6. **Investigator Management (Admin Only)**: Register new investigators, edit roles, and toggle Active/Disabled status.
7. **Reports & Exports**: Generate PDF reports and export CSV evidence data.
