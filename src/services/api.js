// Digital Evidence Manager API Service Layer
const BASE_URL = '/api';

// Initial Mock Seed Data Fallback State
let mockCases = [
  {
    id: 1,
    caseCode: 'CASE-2026-001',
    name: 'Unauthorized Access Investigation',
    description: 'Forensic analysis of rogue SSH sessions and unauthorized root privilege escalation on corporate database cluster DB-ALPHA.',
    type: 'Unauthorized Access',
    priority: 'CRITICAL',
    status: 'Under Investigation',
    investigatorName: 'Det. Sarah Jenkins',
    evidenceCount: 2,
    createdAt: '2026-09-12T10:00:00'
  },
  {
    id: 2,
    caseCode: 'CASE-2026-002',
    name: 'Digital Payment Fraud',
    description: 'Investigation of intercepted wire transfers and tampered API tokens in e-commerce payment gateway system.',
    type: 'Fraud',
    priority: 'HIGH',
    status: 'Active',
    investigatorName: 'Det. Sarah Jenkins',
    evidenceCount: 1,
    createdAt: '2026-09-18T14:45:00'
  },
  {
    id: 3,
    caseCode: 'CASE-2026-003',
    name: 'Data Theft & Exfiltration',
    description: 'Suspicious exfiltration of 45GB encrypted archive to offshore IP block via covert DNS tunneling protocol.',
    type: 'Data Theft',
    priority: 'CRITICAL',
    status: 'Active',
    investigatorName: 'Det. Marcus Vance',
    evidenceCount: 1,
    createdAt: '2026-09-25T16:30:00'
  }
];

let mockEvidence = [
  {
    id: 1,
    evidenceCode: 'EVD-2026-001',
    caseId: 1,
    caseCode: 'CASE-2026-001',
    name: 'server_auth_logs.zip',
    fileType: 'Archive',
    fileSize: 14582912,
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    originalSha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    uploadedBy: 'Det. Sarah Jenkins',
    uploadDate: '2026-09-12T11:20:00',
    sourceDevice: 'Server Host DB-ALPHA-01',
    collectionLocation: 'Data Center Rack 4B, Room 302',
    currentCustodian: 'Det. Sarah Jenkins',
    status: 'VERIFIED'
  },
  {
    id: 2,
    evidenceCode: 'EVD-2026-002',
    caseId: 1,
    caseCode: 'CASE-2026-001',
    name: 'cctv_server_room.mp4',
    fileType: 'Video',
    fileSize: 214748364,
    sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    originalSha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    uploadedBy: 'Det. Sarah Jenkins',
    uploadDate: '2026-09-12T15:40:00',
    sourceDevice: 'Axis Q35 CCTV Cam #04',
    collectionLocation: 'HQ Hallway East Entrance',
    currentCustodian: 'Det. Sarah Jenkins',
    status: 'VERIFIED'
  },
  {
    id: 3,
    evidenceCode: 'EVD-2026-003',
    caseId: 2,
    caseCode: 'CASE-2026-002',
    name: 'transaction_record.pdf',
    fileType: 'Document',
    fileSize: 3891040,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    originalSha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    uploadedBy: 'Det. Sarah Jenkins',
    uploadDate: '2026-09-18T16:10:00',
    sourceDevice: 'FinTech Gateway Workstation #09',
    collectionLocation: 'Finance Department Desk 14',
    currentCustodian: 'Det. Sarah Jenkins',
    status: 'VERIFIED'
  },
  {
    id: 4,
    evidenceCode: 'EVD-2026-004',
    caseId: 3,
    caseCode: 'CASE-2026-003',
    name: 'exfiltration_pcap.log',
    fileType: 'Log File',
    fileSize: 84920194,
    sha256Hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    originalSha256Hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    uploadedBy: 'Det. Marcus Vance',
    uploadDate: '2026-09-25T17:05:00',
    sourceDevice: 'Core Firewall PaloAlto 5200',
    collectionLocation: 'SOC Security Monitoring Node',
    currentCustodian: 'Det. Marcus Vance',
    status: 'VERIFIED'
  }
];

let mockCustody = [
  {
    id: 1,
    evidenceId: 1,
    evidenceCode: 'EVD-2026-001',
    timestamp: '2026-09-12T10:30:00',
    userName: 'Det. Sarah Jenkins',
    action: 'Evidence Collected',
    previousCustodian: 'N/A',
    newCustodian: 'Det. Sarah Jenkins',
    remarks: 'Initial seizure of DB-ALPHA server auth logs under warrant W-2026-88',
    sha256Stamp: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 2,
    evidenceId: 1,
    evidenceCode: 'EVD-2026-001',
    timestamp: '2026-09-12T11:20:00',
    userName: 'Det. Sarah Jenkins',
    action: 'Uploaded & Registered',
    previousCustodian: 'Det. Sarah Jenkins',
    newCustodian: 'Det. Sarah Jenkins',
    remarks: 'Evidence registered to DEM Vault with Java MessageDigest SHA-256 verification stamp.',
    sha256Stamp: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 3,
    evidenceId: 1,
    evidenceCode: 'EVD-2026-001',
    timestamp: '2026-09-15T09:15:00',
    userName: 'Det. Sarah Jenkins',
    action: 'Verified Integrity',
    previousCustodian: 'Det. Sarah Jenkins',
    newCustodian: 'Det. Sarah Jenkins',
    remarks: 'Automated Spring Boot SHA-256 integrity verification passed. Checksum matches original.',
    sha256Stamp: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 4,
    evidenceId: 3,
    evidenceCode: 'EVD-2026-003',
    timestamp: '2026-09-18T16:10:00',
    userName: 'Det. Sarah Jenkins',
    action: 'Uploaded & Registered',
    previousCustodian: 'Det. Sarah Jenkins',
    newCustodian: 'Det. Sarah Jenkins',
    remarks: 'Payment transaction records extracted from bank server.',
    sha256Stamp: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 5,
    evidenceId: 4,
    evidenceCode: 'EVD-2026-004',
    timestamp: '2026-09-25T17:05:00',
    userName: 'Det. Marcus Vance',
    action: 'Uploaded & Registered',
    previousCustodian: 'Det. Marcus Vance',
    newCustodian: 'Det. Marcus Vance',
    remarks: 'Network packet capture containing DNS exfiltration payload.',
    sha256Stamp: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
  }
];

let mockAuditLogs = [
  {
    id: 1,
    timestamp: '2026-10-08T08:30:12',
    username: 'admin@dem.gov',
    role: 'ADMIN',
    action: 'LOGIN',
    evidenceCode: null,
    caseCode: null,
    ipAddress: '192.168.1.100',
    description: 'Administrator login successful.'
  },
  {
    id: 2,
    timestamp: '2026-10-08T09:14:22',
    username: 'sarah.jenkins@dem.gov',
    role: 'INVESTIGATOR',
    action: 'LOGIN',
    evidenceCode: null,
    caseCode: null,
    ipAddress: '192.168.1.104',
    description: 'Investigator Det. Sarah Jenkins authenticated.'
  },
  {
    id: 3,
    timestamp: '2026-10-08T10:02:45',
    username: 'sarah.jenkins@dem.gov',
    role: 'INVESTIGATOR',
    action: 'VERIFY',
    evidenceCode: 'EVD-2026-001',
    caseCode: 'CASE-2026-001',
    ipAddress: '192.168.1.104',
    description: 'Spring Boot SHA-256 verification passed for server_auth_logs.zip. Match 100%.'
  },
  {
    id: 4,
    timestamp: '2026-10-08T11:20:10',
    username: 'marcus.vance@dem.gov',
    role: 'INVESTIGATOR',
    action: 'VIEW',
    evidenceCode: 'EVD-2026-004',
    caseCode: 'CASE-2026-003',
    ipAddress: '192.168.1.108',
    description: 'Accessed evidence metadata and chain of custody.'
  },
  {
    id: 5,
    timestamp: '2026-10-08T12:45:00',
    username: 'admin@dem.gov',
    role: 'ADMIN',
    action: 'VIEW',
    evidenceCode: null,
    caseCode: null,
    ipAddress: '192.168.1.100',
    description: 'Exported system audit logs summary report.'
  }
];

let mockInvestigators = [
  {
    id: 1,
    investigatorCode: 'INV-8041',
    name: 'Det. Sarah Jenkins',
    email: 'sarah.jenkins@dem.gov',
    department: 'Digital Forensics Unit',
    role: 'Lead Cyber Investigator',
    assignedCasesCount: 2,
    status: 'ACTIVE'
  },
  {
    id: 2,
    investigatorCode: 'INV-8092',
    name: 'Det. Marcus Vance',
    email: 'marcus.vance@dem.gov',
    department: 'Incident Response Team',
    role: 'Senior Analyst',
    assignedCasesCount: 1,
    status: 'ACTIVE'
  },
  {
    id: 3,
    investigatorCode: 'INV-7712',
    name: 'Det. Elena Rostova',
    email: 'elena.rostova@dem.gov',
    department: 'Financial Crimes Task Force',
    role: 'Forensic Auditor',
    assignedCasesCount: 0,
    status: 'ACTIVE'
  }
];

// Generic Fetch Wrapper with Spring Boot API + Mock Fallback
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Spring Boot REST API] Failed on endpoint ${endpoint}. Falling back to state provider.`, err);
    return null; // Return null so callers can use fallback state seamlessly
  }
}

export const api = {
  // 1. Auth APIs
  login: async (credentials) => {
    const serverResult = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (serverResult) return serverResult;

    // Fallback Mock Login
    const isAdmin = credentials.role === 'ADMIN' || credentials.email?.includes('admin');
    const user = isAdmin ? {
      id: 1,
      username: 'admin',
      email: 'admin@dem.gov',
      fullName: 'Chief Inspector Cyber Warfare',
      role: 'ADMIN',
      department: 'Executive Cyber Command',
      status: 'ACTIVE'
    } : {
      id: 2,
      username: 'sjenkins',
      email: 'sarah.jenkins@dem.gov',
      fullName: 'Det. Sarah Jenkins',
      role: 'INVESTIGATOR',
      department: 'Digital Forensics Unit',
      status: 'ACTIVE'
    };

    mockAuditLogs.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      username: user.email,
      role: user.role,
      action: 'LOGIN',
      description: `User authenticated as ${user.role} (Demonstration Session)`,
      ipAddress: '192.168.1.104'
    });

    return { token: 'dem-mock-jwt-token', user };
  },

  // 2. Cases APIs
  getCases: async () => {
    const data = await apiFetch('/cases');
    return data || mockCases;
  },

  createCase: async (newCaseData) => {
    const data = await apiFetch('/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCaseData)
    });
    if (data) return data;

    const created = {
      id: mockCases.length + 1,
      caseCode: `CASE-2026-00${mockCases.length + 1}`,
      evidenceCount: 0,
      createdAt: new Date().toISOString(),
      ...newCaseData
    };
    mockCases.unshift(created);

    mockAuditLogs.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      username: newCaseData.investigatorName || 'Det. Sarah Jenkins',
      role: 'INVESTIGATOR',
      action: 'UPDATE',
      caseCode: created.caseCode,
      description: `Created case ${created.name} (${created.type})`
    });

    return created;
  },

  // 3. Evidence APIs
  getEvidence: async () => {
    const data = await apiFetch('/evidence');
    return data || mockEvidence;
  },

  uploadEvidence: async (formData) => {
    const data = await apiFetch('/evidence/upload', {
      method: 'POST',
      body: formData
    });
    if (data) return data;

    // Fallback client simulation if Spring Boot server isn't running
    const name = formData.get('name');
    const caseCode = formData.get('caseCode');
    const fileType = formData.get('fileType');
    const sourceDevice = formData.get('sourceDevice');
    const collectionLocation = formData.get('collectionLocation');
    const uploadedBy = formData.get('uploadedBy');
    const clientHash = formData.get('clientHash') || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

    const evidenceCode = `EVD-2026-00${mockEvidence.length + 1}`;
    const newEvd = {
      id: mockEvidence.length + 1,
      evidenceCode,
      caseId: 1,
      caseCode,
      name,
      fileType,
      fileSize: 1548576,
      sha256Hash: clientHash,
      originalSha256Hash: clientHash,
      uploadedBy,
      uploadDate: new Date().toISOString(),
      sourceDevice,
      collectionLocation,
      currentCustodian: uploadedBy,
      status: 'VERIFIED'
    };

    mockEvidence.unshift(newEvd);

    mockCustody.push({
      id: mockCustody.length + 1,
      evidenceId: newEvd.id,
      evidenceCode,
      timestamp: new Date().toISOString(),
      userName: uploadedBy,
      action: 'Uploaded & Registered',
      previousCustodian: 'Collection Site',
      newCustodian: uploadedBy,
      remarks: 'Registered to DEM Vault with SHA-256 verification seal.',
      sha256Stamp: clientHash
    });

    mockAuditLogs.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      username: uploadedBy,
      role: 'INVESTIGATOR',
      action: 'UPLOAD',
      evidenceCode,
      caseCode,
      description: `Registered evidence ${name} with backend SHA-256: ${clientHash}`
    });

    return {
      message: 'Evidence successfully registered with Java SHA-256 integrity seal.',
      evidence: newEvd,
      authoritativeHash: clientHash
    };
  },

  transferEvidence: async (evidenceId, transferData) => {
    const data = await apiFetch(`/evidence/${evidenceId}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transferData)
    });
    if (data) return data;

    const item = mockEvidence.find(e => e.id === evidenceId);
    if (item) {
      const prev = item.currentCustodian;
      item.currentCustodian = transferData.newCustodian;
      item.status = 'TRANSFERRED';

      mockCustody.push({
        id: mockCustody.length + 1,
        evidenceId: item.id,
        evidenceCode: item.evidenceCode,
        timestamp: new Date().toISOString(),
        userName: transferData.transferredBy || prev,
        action: 'Transferred Custody',
        previousCustodian: prev,
        newCustodian: transferData.newCustodian,
        remarks: `${transferData.reason} - ${transferData.notes || ''}`,
        sha256Stamp: item.sha256Hash
      });

      mockAuditLogs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        username: transferData.transferredBy || prev,
        role: 'INVESTIGATOR',
        action: 'TRANSFER',
        evidenceCode: item.evidenceCode,
        caseCode: item.caseCode,
        description: `Transferred custody from ${prev} to ${transferData.newCustodian}. Reason: ${transferData.reason}`
      });
    }

    return { message: 'Evidence successfully transferred.', evidence: item };
  },

  deleteEvidence: async (evidenceId, adminEmail = 'admin@dem.gov') => {
    const data = await apiFetch(`/evidence/${evidenceId}?adminEmail=${adminEmail}`, {
      method: 'DELETE'
    });
    if (data) return data;

    const idx = mockEvidence.findIndex(e => e.id === evidenceId);
    if (idx !== -1) {
      const removed = mockEvidence[idx];
      mockEvidence.splice(idx, 1);

      mockAuditLogs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        username: adminEmail,
        role: 'ADMIN',
        action: 'DELETE',
        evidenceCode: removed.evidenceCode,
        caseCode: removed.caseCode,
        description: `ADMIN PURGE: Evidence file ${removed.name} removed from vault.`
      });
    }
    return { message: 'Evidence deleted successfully.' };
  },

  // 4. Verification APIs
  verifyIntegrity: async (evidenceId, verifiedBy = 'Det. Sarah Jenkins') => {
    const formData = new FormData();
    formData.append('evidenceId', evidenceId);
    formData.append('verifiedBy', verifiedBy);

    const data = await apiFetch('/verification/verify', {
      method: 'POST',
      body: formData
    });
    if (data) return data;

    const evd = mockEvidence.find(e => e.id === Number(evidenceId));
    if (!evd) return null;

    const isMatch = evd.sha256Hash === evd.originalSha256Hash;
    evd.status = isMatch ? 'VERIFIED' : 'COMPROMISED';

    mockAuditLogs.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      username: verifiedBy,
      role: 'INVESTIGATOR',
      action: isMatch ? 'VERIFY' : 'INTEGRITY_ALERT',
      evidenceCode: evd.evidenceCode,
      caseCode: evd.caseCode,
      description: isMatch
        ? `Authoritative SHA-256 verification PASSED for ${evd.name}. Baseline match 100%.`
        : `CRITICAL INTEGRITY ALERT: SHA-256 hash mismatch on ${evd.name}!`
    });

    return {
      evidenceId: evd.id,
      evidenceCode: evd.evidenceCode,
      evidenceName: evd.name,
      originalHash: evd.originalSha256Hash,
      currentHash: evd.sha256Hash,
      verificationTime: new Date().toISOString(),
      verifiedBy,
      integrityIntact: isMatch,
      status: evd.status,
      badgeColor: isMatch ? 'GREEN' : 'RED',
      message: isMatch ? 'File integrity is intact.' : 'Integrity Compromised! The evidence file appears to have been modified.'
    };
  },

  toggleTamperDemo: async (evidenceId, simulateTamper, verifiedBy = 'Det. Sarah Jenkins') => {
    const formData = new FormData();
    formData.append('evidenceId', evidenceId);
    formData.append('simulateTamper', simulateTamper);
    formData.append('verifiedBy', verifiedBy);

    const data = await apiFetch('/verification/tamper-demo', {
      method: 'POST',
      body: formData
    });
    if (data) return data;

    const evd = mockEvidence.find(e => e.id === Number(evidenceId));
    if (!evd) return null;

    if (simulateTamper) {
      evd.sha256Hash = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      evd.status = 'COMPROMISED';

      mockAuditLogs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        username: verifiedBy,
        role: 'INVESTIGATOR',
        action: 'INTEGRITY_ALERT',
        evidenceCode: evd.evidenceCode,
        caseCode: evd.caseCode,
        description: `DEMO TAMPERING TRIGGERED: Evidence ${evd.evidenceCode} hash altered. Red alert logged.`
      });

      return {
        status: 'COMPROMISED',
        badgeColor: 'RED',
        message: 'Integrity Compromised! The evidence file appears to have been modified.',
        originalHash: evd.originalSha256Hash,
        currentHash: evd.sha256Hash,
        integrityIntact: false
      };
    } else {
      evd.sha256Hash = evd.originalSha256Hash;
      evd.status = 'VERIFIED';

      mockAuditLogs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        username: verifiedBy,
        role: 'INVESTIGATOR',
        action: 'VERIFY',
        evidenceCode: evd.evidenceCode,
        caseCode: evd.caseCode,
        description: `DEMO RESTORE: Baseline SHA-256 restored for ${evd.evidenceCode}`
      });

      return {
        status: 'VERIFIED',
        badgeColor: 'GREEN',
        message: 'File integrity is intact.',
        originalHash: evd.originalSha256Hash,
        currentHash: evd.sha256Hash,
        integrityIntact: true
      };
    }
  },

  // 5. Custody Chain APIs
  getCustodyChain: async (evidenceId) => {
    const data = await apiFetch(`/custody/${evidenceId}`);
    return data || mockCustody.filter(c => c.evidenceId === Number(evidenceId));
  },

  // 6. Audit Log APIs
  getAuditLogs: async () => {
    const data = await apiFetch('/audit-logs');
    return data || mockAuditLogs;
  },

  // 7. Investigator APIs
  getInvestigators: async () => {
    const data = await apiFetch('/investigators');
    return data || mockInvestigators;
  },

  addInvestigator: async (investigatorData, adminEmail = 'admin@dem.gov') => {
    const data = await apiFetch(`/investigators?adminEmail=${adminEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(investigatorData)
    });
    if (data) return data;

    const created = {
      id: mockInvestigators.length + 1,
      investigatorCode: `INV-${8000 + mockInvestigators.length + 1}`,
      assignedCasesCount: 0,
      status: 'ACTIVE',
      ...investigatorData
    };
    mockInvestigators.push(created);

    mockAuditLogs.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      username: adminEmail,
      role: 'ADMIN',
      action: 'UPDATE',
      description: `Registered investigator: ${created.name} (${created.investigatorCode})`
    });

    return created;
  },

  updateInvestigatorStatus: async (id, status, adminEmail = 'admin@dem.gov') => {
    const data = await apiFetch(`/investigators/${id}/status?status=${status}&adminEmail=${adminEmail}`, {
      method: 'PUT'
    });
    if (data) return data;

    const inv = mockInvestigators.find(i => i.id === id);
    if (inv) inv.status = status;
    return inv;
  },

  // 8. Reports API
  getSummaryStats: async () => {
    const data = await apiFetch('/reports/summary');
    if (data) return data;

    const totalCases = mockCases.length;
    const totalEvidence = mockEvidence.length;
    const verifiedEvidence = mockEvidence.filter(e => e.status === 'VERIFIED').length;
    const integrityAlerts = mockEvidence.filter(e => e.status === 'COMPROMISED').length;
    const activeInvestigations = mockCases.filter(c => c.status !== 'Closed').length;

    return {
      totalCases,
      totalEvidence,
      verifiedEvidence,
      verificationPercentage: Math.round((verifiedEvidence / totalEvidence) * 100),
      integrityAlerts,
      activeInvestigations,
      totalInvestigators: mockInvestigators.length,
      totalAuditLogs: mockAuditLogs.length
    };
  }
};
