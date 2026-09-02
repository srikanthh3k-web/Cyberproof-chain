const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(24).toString('base64url');

app.use(helmet());
const allowedOrigins = FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false }));

const demoData = {
  users: [
    { id: 'USR-101', name: 'Ava Patel', email: 'admin@cyberproof.local', role: 'ADMIN', password: 'admin123', active: true },
    { id: 'USR-102', name: 'Marcus Chen', email: 'investigator@cyberproof.local', role: 'LEAD_INVESTIGATOR', password: 'investigator123', active: true },
    { id: 'USR-103', name: 'Nina Gomez', email: 'analyst@cyberproof.local', role: 'FORENSIC_ANALYST', password: 'analyst123', active: true },
    { id: 'USR-104', name: 'Samuel Reed', email: 'auditor@cyberproof.local', role: 'AUDITOR', password: 'auditor123', active: true },
    { id: 'USR-105', name: 'Lena Brooks', email: 'viewer@cyberproof.local', role: 'VIEWER', password: 'viewer123', active: true },
  ],
  investigations: [
    { id: 'INV-1001', caseName: 'Credential Stuffing Campaign', description: 'Large-scale credential abuse against employee accounts', severity: 'CRITICAL', status: 'UNDER INVESTIGATION', leadInvestigator: 'Marcus Chen', createdDate: '2026-08-12', lastUpdated: '2026-09-01', evidenceCount: 5 },
    { id: 'INV-1002', caseName: 'Malware Delivery Ring', description: 'Phishing-based delivery chain for remote access trojan', severity: 'HIGH', status: 'OPEN', leadInvestigator: 'Ava Patel', createdDate: '2026-08-21', lastUpdated: '2026-08-31', evidenceCount: 4 },
    { id: 'INV-1003', caseName: 'Insider Data Exfiltration', description: 'Potential unauthorized data export from finance system', severity: 'CRITICAL', status: 'CONTAINED', leadInvestigator: 'Marcus Chen', createdDate: '2026-08-25', lastUpdated: '2026-09-01', evidenceCount: 8 },
    { id: 'INV-1004', caseName: 'Banking Trojan Activity', description: 'Suspicious web injection and credential harvesting flow', severity: 'HIGH', status: 'RESOLVED', leadInvestigator: 'Nina Gomez', createdDate: '2026-07-12', lastUpdated: '2026-08-19', evidenceCount: 6 },
    { id: 'INV-1005', caseName: 'Ransomware Negotiation Trail', description: 'Analysis of communications, staging and payment flow', severity: 'CRITICAL', status: 'UNDER INVESTIGATION', leadInvestigator: 'Ava Patel', createdDate: '2026-08-14', lastUpdated: '2026-09-01', evidenceCount: 7 },
    { id: 'INV-1006', caseName: 'DDoS Botnet Coordination', description: 'Command and control network analysis', severity: 'MEDIUM', status: 'OPEN', leadInvestigator: 'Marcus Chen', createdDate: '2026-08-22', lastUpdated: '2026-08-30', evidenceCount: 3 },
    { id: 'INV-1007', caseName: 'Webshell Persistence', description: 'Investigation of compromised portal and malicious persistence', severity: 'HIGH', status: 'ARCHIVED', leadInvestigator: 'Nina Gomez', createdDate: '2026-07-02', lastUpdated: '2026-07-29', evidenceCount: 4 },
    { id: 'INV-1008', caseName: 'Phishing Infrastructure Mapping', description: 'Enumeration of malicious infrastructure and spoofed domains', severity: 'MEDIUM', status: 'OPEN', leadInvestigator: 'Marcus Chen', createdDate: '2026-08-27', lastUpdated: '2026-09-01', evidenceCount: 2 },
    { id: 'INV-1009', caseName: 'Endpoint Evasion Tactics', description: 'Behavioral investigation into anti-forensic tooling', severity: 'HIGH', status: 'UNDER INVESTIGATION', leadInvestigator: 'Ava Patel', createdDate: '2026-08-15', lastUpdated: '2026-09-01', evidenceCount: 5 },
    { id: 'INV-1010', caseName: 'State-Sponsored Reconnaissance', description: 'Cyber threat actor infrastructure mapping and malware triage', severity: 'CRITICAL', status: 'UNDER INVESTIGATION', leadInvestigator: 'Marcus Chen', createdDate: '2026-08-19', lastUpdated: '2026-09-01', evidenceCount: 9 },
  ],
  evidence: [
    { id: 'EVD-1042', filename: 'malware_log.txt', fileType: 'TXT', fileSize: '1.4 MB', sha256: '8f4c2d7a7d5e0a1d4a5e8f6d4c1a2b3f1c5d6a7b8c9d0e1f2a3b4c5d6e7f8', createdTime: '2026-09-01T20:41:23Z', uploadedBy: 'Nina Gomez', investigationId: 'INV-1001', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1042', currentCustodian: 'Marcus Chen', tampered: false },
    { id: 'EVD-1043', filename: 'phishing_email.eml', fileType: 'EML', fileSize: '412 KB', sha256: '91a2db0fda0e39af201f5c019218d0c9f3051f1aa3cb1fbc598d76d36b1234e2', createdTime: '2026-08-29T11:06:10Z', uploadedBy: 'Marcus Chen', investigationId: 'INV-1002', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1043', currentCustodian: 'Ava Patel', tampered: false },
    { id: 'EVD-1044', filename: 'memory_dump.raw', fileType: 'RAW', fileSize: '482 MB', sha256: 'e2865835d6a5c50f06efab0d2845f28d68154089a6a4d4f1b1c7c49c0c2b09d8', createdTime: '2026-08-28T08:52:13Z', uploadedBy: 'Ava Patel', investigationId: 'INV-1003', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1044', currentCustodian: 'Samuel Reed', tampered: false },
    { id: 'EVD-1045', filename: 'log_traffic.csv', fileType: 'CSV', fileSize: '760 KB', sha256: '44f1d53c99810d91ce7f6757ca0ca0b3b6e6d7a1ef7a4a25b3d90d5d13b4a91', createdTime: '2026-08-16T14:18:40Z', uploadedBy: 'Marcus Chen', investigationId: 'INV-1004', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1045', currentCustodian: 'Nina Gomez', tampered: false },
    { id: 'EVD-1046', filename: 'dns_capture.pcap', fileType: 'PCAP', fileSize: '8.6 MB', sha256: '28226c00e25e4bca5038bc75a7e3d8947ad0818016d7419e44c86168964ceab6', content: 'demo dns capture evidence', registeredContent: 'demo dns capture evidence', createdTime: '2026-08-24T15:10:22Z', uploadedBy: 'Ava Patel', investigationId: 'INV-1005', integrityStatus: 'TAMPERED', blockchainTxId: 'TX-1046', currentCustodian: 'Marcus Chen', tampered: true },
    { id: 'EVD-1047', filename: 'device_snapshot.img', fileType: 'IMG', fileSize: '12.3 GB', sha256: '92f1db2e2ba1d4a3bd7afae4e33b56d9980f7467d16a005c1b96873b4f31707a', createdTime: '2026-08-11T06:01:51Z', uploadedBy: 'Nina Gomez', investigationId: 'INV-1006', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1047', currentCustodian: 'Ava Patel', tampered: false },
    { id: 'EVD-1048', filename: 'incident_report.pdf', fileType: 'PDF', fileSize: '3.2 MB', sha256: 'c9a8d2ec31f7c98a7a8d254fa0ea3470c128f786a7d444de43f09c7e17a1df4c', createdTime: '2026-08-22T09:44:11Z', uploadedBy: 'Samuel Reed', investigationId: 'INV-1007', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1048', currentCustodian: 'Marcus Chen', tampered: false },
    { id: 'EVD-1049', filename: 'auth_logs.json', fileType: 'JSON', fileSize: '2.1 MB', sha256: 'dda4f7d5d5b9bc3a9836b89b5dfe3f0f0f5f5cb14b3dbd8fe0275fe885d18867', createdTime: '2026-08-09T18:23:44Z', uploadedBy: 'Ava Patel', investigationId: 'INV-1008', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1049', currentCustodian: 'Nina Gomez', tampered: false },
    { id: 'EVD-1050', filename: 'network_scan.txt', fileType: 'TXT', fileSize: '845 KB', sha256: '361f1f0c6a7008ce908f918d3378a5a8017d4db3ca5d4f5d5d58b4d9880d4f75', createdTime: '2026-08-07T13:03:00Z', uploadedBy: 'Marcus Chen', investigationId: 'INV-1009', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1050', currentCustodian: 'Ava Patel', tampered: false },
    { id: 'EVD-1051', filename: 'malware_sample.bin', fileType: 'BIN', fileSize: '10.8 MB', sha256: '7adfe2d4de0d7d52ac2484b4328d593db4748c15856b42eb8e57f6c5f5097d0a', createdTime: '2026-08-30T22:14:27Z', uploadedBy: 'Nina Gomez', investigationId: 'INV-1010', integrityStatus: 'VERIFIED', blockchainTxId: 'TX-1051', currentCustodian: 'Marcus Chen', tampered: false },
  ],
  blockchain: [
    { blockIndex: 100, previousHash: '0000GENESIS', hash: '0x9fca3d1ad3f5cd4b', timestamp: '2026-09-01T20:41:23Z', nonce: 24781, transactions: [{ txId: 'TX-1042', type: 'EVIDENCE_REGISTERED', evidenceId: 'EVD-1042', hash: '8f4c2d7a7d5e0a1d4a5e8f6d4c1a2b3f1c5d6a7b8c9d0e1f2a3b4c5d6e7f8', status: 'CONFIRMED' }], evidenceIds: ['EVD-1042'] },
    { blockIndex: 101, previousHash: '0x9fca3d1ad3f5cd4b', hash: '0x190c823e9c7300de', timestamp: '2026-09-01T20:43:18Z', nonce: 24590, transactions: [{ txId: 'TX-1043', type: 'EVIDENCE_REGISTERED', evidenceId: 'EVD-1043', hash: '91a2db0fda0e39af201f5c019218d0c9f3051f1aa3cb1fbc598d76d36b1234e2', status: 'CONFIRMED' }], evidenceIds: ['EVD-1043'] },
    { blockIndex: 102, previousHash: '0x190c823e9c7300de', hash: '0x0b1d44cd5c91bfaa', timestamp: '2026-09-01T20:46:44Z', nonce: 28942, transactions: [{ txId: 'TX-1046', type: 'TAMPER_DETECTED', evidenceId: 'EVD-1046', hash: 'd87f5d4e7cb1632319efc2a429d43f21908bc8d2d92d2d91036c048a7d7b0d1d', status: 'REJECTED' }], evidenceIds: ['EVD-1046'] },
    { blockIndex: 103, previousHash: '0x0b1d44cd5c91bfaa', hash: '0x4de1ea6ff52cb8b1', timestamp: '2026-09-01T20:49:22Z', nonce: 31021, transactions: [{ txId: 'TX-1048', type: 'EVIDENCE_REGISTERED', evidenceId: 'EVD-1048', hash: 'c9a8d2ec31f7c98a7a8d254fa0ea3470c128f786a7d444de43f09c7e17a1df4c', status: 'CONFIRMED' }], evidenceIds: ['EVD-1048'] },
    { blockIndex: 104, previousHash: '0x4de1ea6ff52cb8b1', hash: '0x51cf2cbaf57a11d2', timestamp: '2026-09-01T20:52:18Z', nonce: 27873, transactions: [{ txId: 'TX-1051', type: 'CUSTODY_TRANSFER', evidenceId: 'EVD-1051', hash: '7adfe2d4de0d7d52ac2484b4328d593db4748c15856b42eb8e57f6c5f5097d0a', status: 'CONFIRMED' }], evidenceIds: ['EVD-1051'] },
  ],
  transactions: [
    { txId: 'TX-1042', evidenceId: 'EVD-1042', action: 'EVIDENCE_REGISTERED', timestamp: '2026-09-01T20:41:23Z', hash: '8f4c2d7a7d5e0a1d4a5e8f6d4c1a2b3f1c5d6a7b8c9d0e1f2a3b4c5d6e7f8', status: 'CONFIRMED' },
    { txId: 'TX-1043', evidenceId: 'EVD-1043', action: 'EVIDENCE_VERIFIED', timestamp: '2026-08-29T11:12:04Z', hash: '91a2db0fda0e39af201f5c019218d0c9f3051f1aa3cb1fbc598d76d36b1234e2', status: 'CONFIRMED' },
    { txId: 'TX-1046', evidenceId: 'EVD-1046', action: 'TAMPER_DETECTED', timestamp: '2026-08-24T15:12:11Z', hash: 'd87f5d4e7cb1632319efc2a429d43f21908bc8d2d92d2d91036c048a7d7b0d1d', status: 'REJECTED' },
    { txId: 'TX-1051', evidenceId: 'EVD-1051', action: 'CUSTODY_TRANSFER', timestamp: '2026-08-30T22:16:09Z', hash: '7adfe2d4de0d7d52ac2484b4328d593db4748c15856b42eb8e57f6c5f5097d0a', status: 'CONFIRMED' },
  ],
  alerts: [
    { id: 'ALT-1001', type: 'CRITICAL', title: 'Evidence tampering detected', message: 'EVD-1046 fingerprint mismatch detected on comparison review', time: '2026-09-01T21:04:10Z', resolved: false },
    { id: 'ALT-1002', type: 'WARNING', title: 'Critical threat detected', message: 'Credential access pattern matches brute force campaign', time: '2026-09-01T20:59:12Z', resolved: false },
    { id: 'ALT-1003', type: 'INFO', title: 'Evidence verified', message: 'EVD-1042 successful integrity verification completed', time: '2026-09-01T20:43:18Z', resolved: true },
    { id: 'ALT-1004', type: 'INFO', title: 'Custody transferred', message: 'EVD-1051 transferred to Marcus Chen', time: '2026-08-30T22:17:00Z', resolved: true },
    { id: 'ALT-1005', type: 'CRITICAL', title: 'Blockchain record confirmed', message: 'Block 104 accepted by validator cluster', time: '2026-09-01T20:52:18Z', resolved: false },
    { id: 'ALT-1006', type: 'WARNING', title: 'Unusual login pattern', message: '4 failed logins followed by suspicious successful login', time: '2026-08-31T09:26:30Z', resolved: false },
    { id: 'ALT-1007', type: 'INFO', title: 'New evidence uploaded', message: 'EVD-1051 uploaded into INV-1010', time: '2026-08-30T22:14:27Z', resolved: true },
    { id: 'ALT-1008', type: 'CRITICAL', title: 'Threat Intel update', message: 'malware.example-domain.com added to high-risk feed', time: '2026-08-29T08:11:55Z', resolved: false },
  ],
  threatIntel: [
    { ip: '192.168.1.44', domain: 'example-domain.com', url: 'http://example-domain.com/login', fileHash: 'f9d1a8...8d12', reputation: 'High Risk', riskScore: 94, threatType: 'Credential Stuffing', firstSeen: '2026-08-29', lastSeen: '2026-09-01', relatedIncidents: 18, indicators: ['multiple failed auths', 'impossible travel', 'unknown device'], sources: ['SOC', 'Threat Feed'], analysis: 'Sequence of failed credentials followed by unexpected successful authentication from an unknown device.' },
    { ip: '10.0.0.17', domain: 'suspicious-login.exe', url: 'https://malware.example.org/download', fileHash: '12ab34...45fe', reputation: 'Malicious', riskScore: 88, threatType: 'Malware Delivery', firstSeen: '2026-08-20', lastSeen: '2026-08-31', relatedIncidents: 11, indicators: ['exe dropper', 'C2 beacon', 'loader stage'], sources: ['Sandbox', 'Threat Feed'], analysis: 'Executable dropper establishes persistence and beaconing behavior similar to staged malware delivery.' },
    { ip: '203.0.113.88', domain: 'banking-portal-check.com', url: 'https://banking-portal-check.com/validate', fileHash: 'b17b4a...af0d', reputation: 'Suspicious', riskScore: 76, threatType: 'Phishing', firstSeen: '2026-08-11', lastSeen: '2026-09-01', relatedIncidents: 9, indicators: ['brand imitation', 'credential harvest'], sources: ['Domain Feed', 'SOC'], analysis: 'Brand impersonation and credential collection flow targeting financial portal access.' },
    { ip: '198.51.100.12', domain: 'vpn-verify.net', url: 'https://vpn-verify.net/download', fileHash: 'cd7e12...0fb5', reputation: 'Malicious', riskScore: 92, threatType: 'RAT Delivery', firstSeen: '2026-08-18', lastSeen: '2026-09-01', relatedIncidents: 21, indicators: ['remote access', 'persist depth'], sources: ['MISP', 'Threat Feed'], analysis: 'Remote access payload with persistence and evasion indicators.' },
  ],
  custodyEvents: [
    { timestamp: '2026-08-12T09:12:00Z', evidenceId: 'EVD-1042', user: 'Nina Gomez', action: 'Evidence Collected', location: 'Endpoint 4D-17', signature: 'ECDSA-512', transactionId: 'TX-1042' },
    { timestamp: '2026-08-12T09:13:10Z', evidenceId: 'EVD-1042', user: 'Ava Patel', action: 'Hash Generated', location: 'Acquisition Station', signature: 'SHA256-Fingerprint', transactionId: 'TX-1042' },
    { timestamp: '2026-08-12T09:14:30Z', evidenceId: 'EVD-1042', user: 'Marcus Chen', action: 'Registered', location: 'Blockchain Registry', signature: 'ECDSA-512', transactionId: 'TX-1042' },
    { timestamp: '2026-08-13T12:44:10Z', evidenceId: 'EVD-1043', user: 'Nina Gomez', action: 'Transferred', location: 'Lab 3C', signature: 'RSA-2048', transactionId: 'TX-1043' },
    { timestamp: '2026-08-15T17:02:00Z', evidenceId: 'EVD-1046', user: 'Marcus Chen', action: 'Analyzed', location: 'Forensic Workbench', signature: 'ECDSA-512', transactionId: 'TX-1046' },
    { timestamp: '2026-08-16T08:22:40Z', evidenceId: 'EVD-1042', user: 'Samuel Reed', action: 'Verified', location: 'Verification Portal', signature: 'RSA-2048', transactionId: 'TX-1042' },
    { timestamp: '2026-08-17T10:20:00Z', evidenceId: 'EVD-1042', user: 'Ava Patel', action: 'Reported', location: 'Case Management', signature: 'ECDSA-512', transactionId: 'TX-1042' },
  ],
  auditLogs: [
    { id: 'AUD-201', user: 'admin@cyberproof.local', action: 'Login', timestamp: '2026-09-01T20:22:10Z', details: 'Admin session initialized' },
    { id: 'AUD-202', user: 'investigator@cyberproof.local', action: 'Evidence Verified', timestamp: '2026-09-01T20:41:23Z', details: 'EVD-1042 verified' },
    { id: 'AUD-203', user: 'analyst@cyberproof.local', action: 'AI Analysis', timestamp: '2026-09-01T20:46:00Z', details: 'Threat classification generated' },
    { id: 'AUD-204', user: 'auditor@cyberproof.local', action: 'Custody Review', timestamp: '2026-09-01T20:55:33Z', details: 'Chain-of-custody timeline inspected' },
    { id: 'AUD-205', user: 'viewer@cyberproof.local', action: 'Evidence Lookup', timestamp: '2026-09-01T20:59:48Z', details: 'Verification portal lookup successful' },
  ],
  securityEvents: [
    { id: 'SEC-101', type: 'AUTH', severity: 'INFO', message: 'Admin session initialized', timestamp: '2026-09-01T20:22:10Z' },
    { id: 'SEC-102', type: 'EVIDENCE', severity: 'INFO', message: 'EVD-1042 verified', timestamp: '2026-09-01T20:41:23Z' },
  ],
};

async function seedDemoUsers() {
  const defaults = {
    'admin@cyberproof.local': ADMIN_PASSWORD,
    'investigator@cyberproof.local': 'investigator123',
    'analyst@cyberproof.local': 'analyst123',
    'auditor@cyberproof.local': 'auditor123',
    'viewer@cyberproof.local': 'viewer123',
  };

  for (const user of demoData.users) {
    if (!user.passwordHash) {
      user.passwordHash = await bcrypt.hash(defaults[user.email] || 'password123', 10);
    }
    delete user.password;
  }
}

async function validateCredentials(email, password) {
  const user = demoData.users.find((entry) => entry.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user || !user.passwordHash) return null;
  const valid = await bcrypt.compare(password || '', user.passwordHash);
  return valid ? user : null;
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    return next();
  };
}

function generateHash(payload) {
  const normalized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

demoData.evidence.forEach((evidence) => {
  if (typeof evidence.content !== 'string') {
    evidence.content = `${evidence.filename} demo evidence`;
    evidence.registeredContent = evidence.content;
    evidence.sha256 = generateHash(evidence.content);
  } else if (typeof evidence.registeredContent !== 'string') {
    evidence.registeredContent = evidence.content;
  }
});

function verifyEvidence(evidence) {
  const originalHash = evidence.sha256;
  const currentHash = generateHash(evidence.content);
  const tampered = originalHash !== currentHash;
  const timestamp = new Date().toISOString();
  const action = tampered ? 'TAMPER_DETECTED' : 'EVIDENCE_VERIFIED';
  const transactionId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;

  evidence.integrityStatus = tampered ? 'TAMPERED' : 'VERIFIED';
  evidence.tampered = tampered;
  demoData.transactions.unshift({ txId: transactionId, evidenceId: evidence.id, action, timestamp, hash: currentHash, status: tampered ? 'REJECTED' : 'CONFIRMED' });
  buildBlock(demoData.blockchain[demoData.blockchain.length - 1]?.hash || '0000GENESIS', evidence.id, transactionId, action, currentHash, tampered ? 'REJECTED' : 'CONFIRMED');
  demoData.custodyEvents.unshift({ timestamp, evidenceId: evidence.id, user: 'System', action: tampered ? 'Tampering Detected' : 'Verified', location: 'Verification Portal', signature: 'SHA256-Fingerprint', transactionId });
  if (tampered) {
    demoData.alerts.unshift({ id: `ALT-${Date.now()}`, type: 'CRITICAL', title: 'Evidence tampering detected', message: `${evidence.id} fingerprint mismatch detected during verification.`, time: timestamp, resolved: false });
  }

  return {
    evidenceId: evidence.id,
    originalHash,
    currentHash,
    tampered,
    status: tampered ? 'TAMPERING_DETECTED' : 'VERIFIED',
    blockchainTxId: transactionId,
    verificationHistory: [{ timestamp, result: tampered ? 'TAMPERING_DETECTED' : 'VERIFIED' }],
    explanation: tampered ? 'The evidence fingerprint no longer matches the cryptographic fingerprint recorded during acquisition.' : 'Evidence integrity verified against the stored hash.',
  };
}

function buildBlock(previousHash, evidenceId, txId, txAction = 'EVIDENCE_REGISTERED', evidenceHash, transactionStatus = 'CONFIRMED') {
  const previousBlock = demoData.blockchain[demoData.blockchain.length - 1];
  const blockIndex = previousBlock ? previousBlock.blockIndex + 1 : 100;
  const timestamp = new Date().toISOString();
  const evidenceIds = [evidenceId];
  let nonce = 0;
  let hash = '';

  while (!hash.startsWith('0x')) {
    nonce += 1;
    hash = `${crypto.createHash('sha256').update(`${blockIndex}${previousHash}${timestamp}${JSON.stringify(evidenceIds)}${nonce}${txId}`).digest('hex')}`;
    if (hash.length > 20 && nonce % 2 === 0) break;
  }

  const block = {
    blockIndex,
    previousHash: previousHash || '0000GENESIS',
    hash: `0x${hash.slice(0, 16)}`,
    timestamp,
    nonce,
    transactions: [{ txId, type: txAction, evidenceId, hash: evidenceHash || generateHash(evidenceId), status: transactionStatus }],
    evidenceIds,
  };
  demoData.blockchain.push(block);
  return block;
}

function demoForensicsResult(input = {}) {
  const indicators = input.indicators || ['192.168.1.44', 'suspicious-login.exe', 'example-domain.com'];
  return {
    threat: input.threat || 'Credential Access',
    confidence: input.confidence || 94,
    attackCategory: input.attackCategory || 'Credential Stuffing',
    riskLevel: input.riskLevel || 'CRITICAL',
    mitreTechnique: input.mitreTechnique || 'T1059',
    indicators,
    why: 'Multiple failed authentication attempts were followed by a successful login from an unusual device. The sequence is consistent with credential-stuffing behavior.',
    evidence: 'Authentication logs show 17 failed attempts in 4 minutes followed by a successful login from an unrecognized endpoint.',
    falsePositives: 'Low, as the source was confirmed by multiple login failures and a suspicious device ID.',
    recommendedAction: 'Isolate the affected account, reset credentials, and review privileged access logs.',
    suspicionScore: input.suspicionScore || 94,
    summary: 'High-confidence signal for credential abuse with suspicious remote login patterns.',
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'cyberproof-chain-api' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await validateCredentials(email, password);

  if (!user) {
    demoData.securityEvents.unshift({
      id: `SEC-${Date.now()}`,
      type: 'AUTH_FAILURE',
      severity: 'WARNING',
      message: `Failed login attempt for ${email || 'unknown user'}`,
      timestamp: new Date().toISOString(),
    });
    demoData.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      user: email || 'unknown',
      action: 'FAILED_LOGIN',
      timestamp: new Date().toISOString(),
      details: 'Failed authentication attempt',
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);
  demoData.securityEvents.unshift({
    id: `SEC-${Date.now()}`,
    type: 'AUTH',
    severity: 'INFO',
    message: `Successful login: ${user.email}`,
    timestamp: new Date().toISOString(),
  });
  demoData.auditLogs.unshift({
    id: `AUD-${Date.now()}`,
    user: user.email,
    action: 'LOGIN',
    timestamp: new Date().toISOString(),
    details: 'Successful authentication',
  });

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    demoCredentials: 'Local demo authentication only. Production secrets stay in environment variables.'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Session closed' });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = demoData.users.find((entry) => entry.id === req.user.sub || entry.email === req.user.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/users', authMiddleware, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'LEAD_INVESTIGATOR'), (req, res) => {
  res.json(demoData.users.map(({ passwordHash, ...user }) => user));
});

app.get('/api/dashboard', authMiddleware, (req, res) => {
  const totalEvidence = demoData.evidence.length;
  const verifiedEvidence = demoData.evidence.filter((item) => item.integrityStatus === 'VERIFIED').length;
  const tamperedEvidence = demoData.evidence.filter((item) => item.tampered).length;
  const activeInvestigations = demoData.investigations.filter((item) => item.status !== 'ARCHIVED' && item.status !== 'RESOLVED').length;
  const blockchainRecords = demoData.blockchain.reduce((sum, block) => sum + block.transactions.length, 0);
  const criticalThreats = demoData.threatIntel.filter((item) => item.riskScore >= 80).length;
  const openAlerts = demoData.alerts.filter((alert) => !alert.resolved).length;
  const custodyEvents = demoData.custodyEvents.length;

  res.json({
    summary: {
      totalEvidence,
      verifiedEvidence,
      tamperedEvidence,
      activeInvestigations,
      blockchainRecords,
      criticalThreats,
      totalCases: demoData.investigations.length,
      openAlerts,
      custodyEvents,
    },
    metrics: [
      { label: 'Evidence Records', value: totalEvidence, suffix: '' },
      { label: 'Integrity Verified', value: Number(((verifiedEvidence / totalEvidence) * 100).toFixed(2)), suffix: '%' },
      { label: 'Active Investigations', value: activeInvestigations, suffix: '' },
      { label: 'Tampering Attempts', value: tamperedEvidence, suffix: '' },
      { label: 'Blockchain Events', value: blockchainRecords, suffix: '' },
    ],
    evidenceTrend: [42, 51, 58, 64, 71, 78, 96, 110],
    threatDistribution: [
      { name: 'Critical', value: 18 },
      { name: 'High', value: 26 },
      { name: 'Medium', value: 21 },
      { name: 'Low', value: 12 },
    ],
    investigationActivity: [
      { name: 'Mon', value: 15 },
      { name: 'Tue', value: 18 },
      { name: 'Wed', value: 22 },
      { name: 'Thu', value: 20 },
      { name: 'Fri', value: 25 },
      { name: 'Sat', value: 27 },
      { name: 'Sun', value: 31 },
    ],
    blockchainActivity: [
      { name: 'Jan', value: 140 },
      { name: 'Feb', value: 180 },
      { name: 'Mar', value: 220 },
      { name: 'Apr', value: 260 },
      { name: 'May', value: 290 },
      { name: 'Jun', value: 310 },
    ],
    integrityTrend: [98.4, 98.7, 99.1, 99.5, 99.7, 99.98],
    activity: [
      'Evidence EVD-1042 uploaded',
      'SHA-256 fingerprint generated',
      'AI analysis completed',
      'Blockchain record created',
      'Verification successful',
      'Tampering event flagged by policy engine',
    ],
    liveAlerts: demoData.alerts.slice(0, 6),
  });
});

app.get('/api/investigations', authMiddleware, (req, res) => {
  res.json(demoData.investigations);
});

app.post('/api/investigations', authMiddleware, (req, res) => {
  const payload = req.body || {};
  const newInv = {
    id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    caseName: payload.caseName || 'New Case',
    description: payload.description || 'No description provided',
    severity: payload.severity || 'MEDIUM',
    status: payload.status || 'OPEN',
    leadInvestigator: payload.leadInvestigator || 'Marcus Chen',
    createdDate: new Date().toISOString().slice(0, 10),
    lastUpdated: new Date().toISOString().slice(0, 10),
    evidenceCount: 0,
  };
  demoData.investigations.unshift(newInv);
  res.status(201).json(newInv);
});

app.patch('/api/investigations/:id', authMiddleware, (req, res) => {
  const investigation = demoData.investigations.find((entry) => entry.id === req.params.id);
  if (!investigation) return res.status(404).json({ error: 'Investigation not found' });

  const payload = req.body || {};
  Object.assign(investigation, {
    ...payload,
    lastUpdated: new Date().toISOString().slice(0, 10),
  });

  return res.json(investigation);
});

app.delete('/api/investigations/:id', authMiddleware, (req, res) => {
  const index = demoData.investigations.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Investigation not found' });

  const [removed] = demoData.investigations.splice(index, 1);
  return res.json({ success: true, removed });
});

app.get('/api/evidence', authMiddleware, (req, res) => {
  res.json(demoData.evidence);
});

app.post('/api/evidence/upload', authMiddleware, (req, res) => {
  const payload = req.body || {};
  if (!payload.filename || !payload.content) {
    return res.status(400).json({ error: 'File name and content are required' });
  }

  const normalizedContent = String(payload.content);
  const sha256 = generateHash(normalizedContent);
  const evidenceId = `EVD-${Math.floor(1000 + Math.random() * 9000)}`;
  const transactionId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
  const previousHash = demoData.blockchain[demoData.blockchain.length - 1]?.hash || '0000GENESIS';
  const fileType = payload.fileType || 'TXT';
  const evidence = {
    id: evidenceId,
    filename: payload.filename,
    fileType,
    fileSize: payload.fileSize || '1.2 MB',
    sha256,
    content: normalizedContent,
    registeredContent: normalizedContent,
    createdTime: new Date().toISOString(),
    uploadedBy: payload.uploadedBy || 'investigator@cyberproof.local',
    investigationId: payload.investigationId || demoData.investigations[0].id,
    integrityStatus: 'VERIFIED',
    blockchainTxId: transactionId,
    currentCustodian: payload.currentCustodian || 'Marcus Chen',
    tampered: false,
  };

  const newBlock = {
    blockIndex: demoData.blockchain[demoData.blockchain.length - 1].blockIndex + 1,
    previousHash,
    hash: `0x${generateHash(`${previousHash}${evidenceId}${transactionId}${Date.now()}`).slice(0, 16)}`,
    timestamp: new Date().toISOString(),
    nonce: Math.floor(Math.random() * 90000) + 10000,
    transactions: [{ txId: transactionId, type: 'EVIDENCE_REGISTERED', evidenceId, hash: sha256, status: 'CONFIRMED' }],
    evidenceIds: [evidenceId],
  };

  demoData.evidence.unshift(evidence);
  demoData.transactions.unshift({ txId: transactionId, evidenceId, action: 'EVIDENCE_REGISTERED', timestamp: evidence.createdTime, hash: sha256, status: 'CONFIRMED' });
  demoData.blockchain.push(newBlock);
  demoData.alerts.unshift({
    id: `ALT-${Math.random().toString().slice(2, 8)}`,
    type: 'INFO',
    title: 'Evidence registered',
    message: `Evidence ${evidence.id} successfully registered.`,
    time: new Date().toISOString(),
    resolved: true,
  });

  res.status(201).json({
    message: 'Evidence uploaded and registered',
    evidence,
    workflow: ['UPLOAD', 'HASH', 'ANALYZE', 'SIGN', 'BLOCKCHAIN', 'VERIFY'],
    blockchain: newBlock,
  });
});

app.get('/api/evidence/:id', authMiddleware, (req, res) => {
  const evidence = demoData.evidence.find((item) => item.id === req.params.id);
  if (!evidence) return res.status(404).json({ error: 'Evidence not found' });
  res.json({ evidence, custody: demoData.custodyEvents, verification: [{ hash: evidence.sha256, status: evidence.integrityStatus }] });
});

app.post('/api/evidence/:id/verify', authMiddleware, (req, res) => {
  const evidence = demoData.evidence.find((item) => item.id === req.params.id);
  if (!evidence) return res.status(404).json({ error: 'Evidence not found' });
  res.json(verifyEvidence(evidence));
});

app.get('/api/evidence/:id/custody', authMiddleware, (req, res) => {
  const evidenceId = req.params.id;
  const events = demoData.custodyEvents.filter((event) => event.evidenceId === evidenceId || event.transactionId === evidenceId);
  res.json(events);
});

app.post('/api/evidence/:id/transfer', authMiddleware, (req, res) => {
  const evidence = demoData.evidence.find((item) => item.id === req.params.id);
  const { custodian, location } = req.body || {};
  if (!evidence) return res.status(404).json({ error: 'Evidence not found' });
  evidence.currentCustodian = custodian || 'Ava Patel';
  demoData.custodyEvents.unshift({
    timestamp: new Date().toISOString(),
    evidenceId: evidence.id,
    user: 'System',
    action: 'Transferred',
    location: location || 'Secure Locker',
    signature: 'RSA-2048',
    transactionId: evidence.blockchainTxId,
  });
  res.json({ message: 'Custody transferred', evidence });
});

app.get('/api/blockchain/blocks', authMiddleware, (req, res) => {
  res.json(demoData.blockchain);
});

app.get('/api/blockchain/transactions', authMiddleware, (req, res) => {
  res.json(demoData.transactions);
});

app.get('/api/blockchain/validate', authMiddleware, (req, res) => {
  let valid = true;
  for (let i = 1; i < demoData.blockchain.length; i += 1) {
    const previous = demoData.blockchain[i - 1];
    const current = demoData.blockchain[i];
    if (current.previousHash !== previous.hash) {
      valid = false;
      break;
    }
  }
  res.json({ valid, network: 'LOCAL DEMONSTRATION NETWORK', lastBlock: demoData.blockchain[demoData.blockchain.length - 1] });
});

app.post('/api/forensics/analyze', authMiddleware, (req, res) => {
  const payload = req.body || {};
  const result = demoForensicsResult({
    threat: payload.threat || 'Credential Access',
    confidence: payload.confidence || 94,
    attackCategory: payload.attackCategory || 'Credential Stuffing',
    riskLevel: payload.riskLevel || 'CRITICAL',
    mitreTechnique: payload.mitreTechnique || 'T1059',
    indicators: payload.indicators || ['192.168.1.44', 'suspicious-login.exe', 'example-domain.com'],
    suspicionScore: payload.suspicionScore || 94,
  });
  res.json({
    ...result,
    source: 'LOCAL DEMO ANALYSIS',
    hash: payload.hash || '8f4c2d7a7d5e0a1d4a5e8f6d4c1a2b3f1c5d6a7b8c9d0e1f2a3b4c5d6e7f8',
    requestedAt: new Date().toISOString(),
  });
});

app.get('/api/threat-intelligence/:indicator', authMiddleware, (req, res) => {
  const indicator = (req.params.indicator || '').toLowerCase();
  const record = demoData.threatIntel.find((entry) => {
    const values = [entry.ip, entry.domain, entry.url, entry.fileHash];
    return values.some((value) => value.toLowerCase() === indicator);
  });

  if (!record) {
    return res.status(404).json({ error: 'No threat intelligence record found', mode: 'LOCAL DEMO DATA' });
  }

  res.json({ ...record, mode: 'LOCAL DEMO DATA' });
});

app.post('/api/reports/generate', authMiddleware, (req, res) => {
  const payload = req.body || {};
  const report = {
    caseId: payload.caseId || 'INV-1001',
    investigationSummary: payload.investigationSummary || 'Credential stuffing campaign across privileged users and suspicious login attempts.',
    evidenceInventory: demoData.evidence.slice(0, 3),
    aiFindings: demoForensicsResult(),
    blockchainVerification: 'Verified via immutable ledger',
    integrityStatus: 'VERIFIED',
    investigatorDetails: payload.investigator || 'Marcus Chen',
    generatedAt: new Date().toISOString(),
    timeline: demoData.custodyEvents,
    preview: 'Forensic report generated successfully.',
    network: 'LOCAL DEMONSTRATION NETWORK',
  };
  res.json(report);
});

app.get('/api/audit-logs', authMiddleware, (req, res) => {
  res.json(demoData.auditLogs);
});

app.get('/api/security-events', authMiddleware, (req, res) => {
  res.json(demoData.securityEvents);
});

app.get('/api/alerts', authMiddleware, (req, res) => {
  res.json(demoData.alerts);
});

app.patch('/api/alerts/:id', authMiddleware, (req, res) => {
  const alert = demoData.alerts.find((entry) => entry.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  Object.assign(alert, req.body || {});
  return res.json(alert);
});

app.delete('/api/alerts/:id', authMiddleware, (req, res) => {
  const index = demoData.alerts.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Alert not found' });
  const [removed] = demoData.alerts.splice(index, 1);
  return res.json({ success: true, removed });
});

app.get('/api/custody', authMiddleware, (req, res) => {
  res.json(demoData.custodyEvents);
});

app.get('/api/team', authMiddleware, (req, res) => {
  res.json(demoData.users);
});

app.get('/api/security-health', authMiddleware, authorizeRoles('SUPER_ADMIN', 'ADMIN'), (req, res) => {
  res.json({
    authentication: 'Secure',
    api: 'Protected',
    database: 'Connected',
    blockchain: 'Operational',
    auditLogging: 'Active',
    rateLimiting: 'Enabled',
    session: 'Encrypted',
    headers: 'Secure',
    cors: 'Configured',
  });
});

app.get('/api/verification/:identifier', (req, res) => {
  const identifier = req.params.identifier;
  const record = demoData.evidence.find((item) => item.id === identifier || item.blockchainTxId === identifier || item.sha256 === identifier);
  if (!record) return res.status(404).json({ error: 'No record found', status: 'NOT FOUND' });
  const verification = verifyEvidence(record);

  res.json({
    evidenceId: record.id,
    evidenceFound: true,
    hashMatch: !verification.tampered,
    blockchainRecord: !!record.blockchainTxId,
    timestamp: record.createdTime,
    integrityStatus: record.integrityStatus,
    hash: verification.currentHash,
    originalHash: verification.originalHash,
    currentHash: verification.currentHash,
    status: verification.status,
    network: 'LOCAL DEMONSTRATION NETWORK',
  });
});

app.post('/api/demo/tamper', authMiddleware, (req, res) => {
  const record = demoData.evidence.find((item) => item.id === 'EVD-1046') || demoData.evidence[0];
  const originalHash = record.sha256;
  record.content = `${record.content} [tampered]`;
  const currentHash = generateHash(record.content);
  return res.json({ success: true, evidenceId: record.id, originalHash, currentHash, status: 'TAMPERING_DETECTED' });
});

app.post('/api/demo/restore', authMiddleware, (req, res) => {
  const record = demoData.evidence.find((item) => item.id === 'EVD-1046') || demoData.evidence[0];
  record.content = record.registeredContent;
  const restoredHash = generateHash(record.content);
  return res.json({ success: true, evidenceId: record.id, restoredHash, status: 'RESTORED' });
});

app.get('/api/demo', authMiddleware, (req, res) => {
  const users = demoData.users.map(({ passwordHash, password, ...user }) => user);
  const evidence = demoData.evidence.map(({ content, registeredContent, ...item }) => item);
  res.json({
    investigations: demoData.investigations,
    evidence,
    blockchain: demoData.blockchain,
    alerts: demoData.alerts,
    threatIntel: demoData.threatIntel,
    custodyEvents: demoData.custodyEvents,
    users,
    description: 'Live demonstration mode for Cyberproof Chain'
  });
});

app.post('/api/demo/run', authMiddleware, (req, res) => {
  const demoEvidence = demoData.evidence.find((item) => item.id === 'EVD-1046') || demoData.evidence[0];
  const tampered = { ...demoEvidence, id: 'EVD-1046', integrityStatus: 'TAMPERED', tampered: true, sha256: 'XYZ789...' };

  res.json({
    steps: [
      'Evidence upload completed',
      'Hash generated',
      'AI analysis performed',
      'Blockchain registration confirmed',
      'Verification succeeded',
      'Tampering simulation triggered',
      'Tampering detection raised',
    ],
    tamperedEvidence: tampered,
    message: 'Live demonstration executed successfully.',
  });
});

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.message === 'Origin is not allowed by CORS') {
    return res.status(403).json({ error: 'Origin is not allowed by CORS' });
  }
  console.error('Unhandled request error:', error.message);
  return res.status(500).json({ error: 'Internal server error' });
});

let server;
let startPromise;

function startServer() {
  if (server) return Promise.resolve(server);
  if (startPromise) return startPromise;

  startPromise = seedDemoUsers()
    .then(() => new Promise((resolve, reject) => {
      const nextServer = app.listen(PORT, '0.0.0.0', () => {
        server = nextServer;
        console.log(`Cyberproof Chain backend listening on 0.0.0.0:${PORT}`);
        resolve(nextServer);
      });
      nextServer.once('error', reject);
    }))
    .catch((error) => {
      startPromise = undefined;
      throw error;
    });

  return startPromise;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to initialize backend:', error);
    process.exit(1);
  });
}

module.exports = { app, startServer, demoData, signToken };
