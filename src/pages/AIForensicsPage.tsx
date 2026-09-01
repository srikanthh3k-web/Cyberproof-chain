import { useState } from 'react';
import { SectionHeader, Card, Button, ProgressBar } from '../App';

export default function AIForensicsPage() {
  const [form, setForm] = useState({ evidence: 'malware_log.txt', logData: 'Suspicious auth events', ip: '192.168.1.44', domain: 'example-domain.com', hash: '8f4c2d7a7d5e0a1d4a5e8f6d4c1a2b3f1c5d6a7b8c9d0e1f2a3b4c5d6e7f8', url: 'http://example-domain.com/login' });
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    const response = await fetch('/api/forensics/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <>
      <SectionHeader title="AI Forensics" subtitle="Threat classification, confidence scoring, and investigation rationale" />
      <div className="grid-2">
        <Card style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Evidence Intelligence Input</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <input value={form.evidence} onChange={(e) => setForm({ ...form, evidence: e.target.value })} style={fieldStyle} placeholder="Evidence file" />
            <textarea value={form.logData} onChange={(e) => setForm({ ...form, logData: e.target.value })} style={{ ...fieldStyle, minHeight: 110 }} placeholder="Log data" />
            <input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} style={fieldStyle} placeholder="IP address" />
            <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} style={fieldStyle} placeholder="Domain" />
            <input value={form.hash} onChange={(e) => setForm({ ...form, hash: e.target.value })} style={fieldStyle} placeholder="Hash" />
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} style={fieldStyle} placeholder="URL" />
            <Button onClick={analyze}>Run AI Analysis</Button>
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          {result ? (
            <>
              <h3 style={{ marginTop: 0 }}>Threat Classification</h3>
              <div className="badge badge-critical" style={{ marginBottom: 14 }}>{result.riskLevel}</div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div><strong>Threat:</strong> {result.threat}</div>
                <div><strong>Confidence:</strong> {result.confidence}%</div>
                <div><strong>Attack Category:</strong> {result.attackCategory}</div>
                <div><strong>MITRE ATT&CK:</strong> {result.mitreTechnique}</div>
                <div><strong>Suspicion Score:</strong> {result.suspicionScore}/100</div>
                <ProgressBar value={result.suspicionScore} />
                <div><strong>Why?:</strong> {result.why}</div>
                <div><strong>Evidence supporting conclusion:</strong> {result.evidence}</div>
                <div><strong>Indicators:</strong> {result.indicators.join(', ')}</div>
                <div><strong>Recommended next step:</strong> {result.recommendedAction}</div>
              </div>
            </>
          ) : (
            <div className="empty-state"><p>Run analysis to generate AI forensic findings.</p></div>
          )}
        </Card>
      </div>
    </>
  );
}

const fieldStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' } as const;
