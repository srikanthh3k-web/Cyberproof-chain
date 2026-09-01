import { useState } from 'react';
import { SectionHeader, Card, Button, StatusBadge } from '../App';

export default function VerificationPage() {
  const [identifier, setIdentifier] = useState('EVD-1042');
  const [result, setResult] = useState<any>(null);
  const [statusText, setStatusText] = useState('');

  const verify = async () => {
    const response = await fetch(`/api/verification/${encodeURIComponent(identifier)}`);
    const data = await response.json();
    setResult(data);
    setStatusText(data.integrityStatus === 'TAMPERED' ? '🚨 EVIDENCE TAMPERING DETECTED' : '✓ INTEGRITY VERIFIED');
  };

  const simulateTampering = async () => {
    const response = await fetch('/api/demo/tamper', { method: 'POST' });
    const data = await response.json();
    setResult({ ...data, evidenceFound: true, blockchainRecord: true, integrityStatus: 'TAMPERED', hash: data.currentHash, originalHash: data.originalHash, currentHash: data.currentHash });
    setStatusText('🚨 EVIDENCE TAMPERING DETECTED');
  };

  const restoreDemo = async () => {
    const response = await fetch('/api/demo/restore', { method: 'POST' });
    const data = await response.json();
    setResult({ ...data, evidenceFound: true, blockchainRecord: true, integrityStatus: 'VERIFIED', hash: data.restoredHash, originalHash: data.restoredHash, currentHash: data.restoredHash });
    setStatusText('✓ INTEGRITY VERIFIED');
  };

  return (
    <>
      <SectionHeader title="Verification Portal" subtitle="Public-style evidence verification with hash and ledger validation" />
      <Card style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Evidence ID / Transaction ID" style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: '#0b1528', color: '#e9edf6', border: '1px solid rgba(148,163,184,0.2)' }} />
          <Button onClick={verify}>Verify Record</Button>
          <Button onClick={simulateTampering}>Simulate Tampering</Button>
          <Button onClick={restoreDemo}>Restore Demo</Button>
        </div>
      </Card>

      {result ? (
        <Card style={{ padding: 18, marginTop: 20 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div><StatusBadge status={statusText || 'RECORD FOUND'} type={statusText.includes('TAMPER') ? 'critical' : 'success'} /></div>
            <div><strong>Evidence Found:</strong> {result.evidenceFound ? 'Yes' : 'No'}</div>
            <div><strong>Hash Match:</strong> {result.hashMatch ?? (result.integrityStatus === 'VERIFIED' ? 'Verified' : 'Mismatch')}</div>
            <div><strong>Original SHA-256:</strong> {result.originalHash || result.hash || 'N/A'}</div>
            <div><strong>Current SHA-256:</strong> {result.currentHash || result.hash || 'N/A'}</div>
            <div><strong>Blockchain Record:</strong> {result.blockchainRecord ? 'Verified' : 'Not Found'}</div>
            <div><strong>Timestamp:</strong> {result.timestamp || new Date().toISOString()}</div>
            <div><strong>Integrity Status:</strong> {result.integrityStatus || 'UNKNOWN'}</div>
          </div>
        </Card>
      ) : null}
    </>
  );
}
