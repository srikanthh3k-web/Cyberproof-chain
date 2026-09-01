const demoData = {
  users: [
    { id: 'USR-101', name: 'Ava Patel', email: 'admin@cyberproof.local', role: 'ADMIN', password: 'admin123' },
    { id: 'USR-102', name: 'Marcus Chen', email: 'investigator@cyberproof.local', role: 'LEAD_INVESTIGATOR', password: 'investigator123' },
    { id: 'USR-103', name: 'Nina Gomez', email: 'analyst@cyberproof.local', role: 'FORENSIC_ANALYST', password: 'analyst123' },
  ],
  investigations: [
    { id: 'INV-1001', caseName: 'Credential Stuffing Campaign', severity: 'CRITICAL', status: 'UNDER INVESTIGATION', leadInvestigator: 'Marcus Chen' },
  ],
};

module.exports = { demoData };
