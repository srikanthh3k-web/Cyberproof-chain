export type Role = 'ADMIN' | 'LEAD_INVESTIGATOR' | 'FORENSIC_ANALYST' | 'AUDITOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Investigation {
  id: string;
  caseName: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'UNDER INVESTIGATION' | 'CONTAINED' | 'RESOLVED' | 'ARCHIVED';
  leadInvestigator: string;
  createdDate: string;
  lastUpdated: string;
  evidenceCount: number;
}

export interface EvidenceItem {
  id: string;
  filename: string;
  fileType: string;
  fileSize: string;
  sha256: string;
  createdTime: string;
  uploadedBy: string;
  investigationId: string;
  integrityStatus: 'VERIFIED' | 'TAMPERED';
  blockchainTxId: string;
  currentCustodian: string;
  tampered: boolean;
}

export interface AlertItem {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  time: string;
  resolved: boolean;
}

export interface ThreatIntelRecord {
  ip: string;
  domain: string;
  url: string;
  fileHash: string;
  reputation: string;
  riskScore: number;
  threatType: string;
  firstSeen: string;
  lastSeen: string;
  relatedIncidents: number;
  indicators: string[];
  sources: string[];
}

export interface BlockchainBlock {
  index: number;
  previousHash: string;
  hash: string;
  timestamp: string;
  transactions: number;
  validator: string;
  evidenceIds: string[];
  nonce: number;
}

export interface ForensicsResult {
  threat: string;
  confidence: number;
  attackCategory: string;
  riskLevel: string;
  mitreTechnique: string;
  indicators: string[];
  why: string;
  evidence: string;
  falsePositives: string;
  recommendedAction: string;
  suspicionScore: number;
  summary: string;
}

export interface DashboardData {
  summary: {
    totalEvidence: number;
    verifiedEvidence: number;
    tamperedEvidence: number;
    activeInvestigations: number;
    blockchainRecords: number;
    criticalThreats: number;
    totalCases: number;
    openAlerts: number;
    custodyEvents: number;
  };
  metrics: { label: string; value: number; suffix: string }[];
  evidenceTrend: number[];
  threatDistribution: { name: string; value: number }[];
  investigationActivity: { name: string; value: number }[];
  blockchainActivity: { name: string; value: number }[];
  integrityTrend: number[];
  activity: string[];
  liveAlerts: AlertItem[];
}
