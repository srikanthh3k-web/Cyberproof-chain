import { useState } from 'react';
import { SectionHeader, Card, EmptyState } from '../App';
import { apiFetch } from '../lib/api';

export default function ThreatIntelligencePage() {
  const [indicator, setIndicator] = useState('192.168.1.44');
  const [result, setResult] = useState<any>(null);

  const search = async () => {
    const response = await apiFetch(`/api/threat-intelligence/${encodeURIComponent(indicator)}`);
    const data = await response.json();
    setResult(data);
  };

  return (
    <>
      <SectionHeader title="Threat Intelligence" subtitle="Search IPs, domains, URLs, or file hashes for reputation and risk context" />
      <Card style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input value={indicator} onChange={(e) => setIndicator(e.target.value)} placeholder="Search IP / Domain / URL / Hash" style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: '#0b1528', color: '#e9edf6', border: '1px solid rgba(148,163,184,0.2)' }} />
          <button className="btn btn-primary" onClick={search}>Lookup</button>
        </div>
      </Card>

      {result ? (
        <Card style={{ padding: 18, marginTop: 20 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div><strong>Reputation:</strong> {result.reputation}</div>
            <div><strong>Risk Score:</strong> {result.riskScore}</div>
            <div><strong>Threat Type:</strong> {result.threatType}</div>
            <div><strong>First Seen:</strong> {result.firstSeen}</div>
            <div><strong>Last Seen:</strong> {result.lastSeen}</div>
            <div><strong>Related Incidents:</strong> {result.relatedIncidents}</div>
            <div><strong>Indicators:</strong> {result.indicators.join(', ')}</div>
            <div><strong>Threat Sources:</strong> {result.sources.join(', ')}</div>
          </div>
        </Card>
      ) : <div style={{ marginTop: 20 }}><EmptyState title="No record loaded" message="Search for a threat intelligence indicator to inspect risk context." /></div>}
    </>
  );
}
