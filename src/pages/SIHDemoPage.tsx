import { useState } from 'react';
import { SectionHeader, Card, Button } from '../App';

const steps = [
  '01 Problem',
  '02 Evidence Acquisition',
  '03 Cryptographic Hash',
  '04 AI Analysis',
  '05 Blockchain Registration',
  '06 Chain of Custody',
  '07 Tampering Simulation',
  '08 Tampering Detection',
  '09 Verification',
  '10 Final Report',
];

export default function SIHDemoPage() {
  const [index, setIndex] = useState(0);

  return (
    <div className="sih-shell">
      <div className="hero-panel" style={{ maxWidth: 980, margin: '0 auto' }}>
        <p className="eyebrow">SIH DEMO MODE</p>
        <h2 style={{ marginTop: 6 }}>Cyberproof Chain presenter flow</h2>
        <div className="grid-2" style={{ marginTop: 18 }}>
          <div>
            <div className="badge badge-info" style={{ marginBottom: 18 }}>{steps[index]}</div>
            <h3 style={{ fontSize: '2rem', margin: '0 0 12px' }}>
              {index === 0 && 'Problem: digital evidence can be manipulated.'}
              {index === 1 && 'Evidence is acquired and preserved with accurate metadata.'}
              {index === 2 && 'SHA-256 generates a cryptographic fingerprint.'}
              {index === 3 && 'AI analysis classifies the threat pattern and rationale.'}
              {index === 4 && 'The event is recorded on an immutable blockchain ledger.'}
              {index === 5 && 'The chain of custody remains auditable and traceable.'}
              {index === 6 && 'Evidence is intentionally modified to simulate tampering.'}
              {index === 7 && 'The system flags integrity mismatch and raises an alert.'}
              {index === 8 && 'Verification confirms whether the evidence is authentic.'}
              {index === 9 && 'The final forensic report concludes the investigation.'}
            </h3>
            <p className="muted">
              {index === 0 && 'Digital evidence integrity is the decisive factor in cybercrime prosecution and incident response.'}
              {index === 1 && 'The platform captures acquisition context, device origin, and evidence metadata.'}
              {index === 2 && 'The fingerprint becomes the immutable reference point for every later validation.'}
              {index === 3 && 'AI builds deterministic logic around suspicious log patterns, device anomalies, and attack chains.'}
              {index === 4 && 'Each evidence registration is recorded with associated metadata and a hash reference.'}
              {index === 5 && 'Each transfer is logged and timestamped for legal and investigative review.'}
              {index === 6 && 'A deliberate change is introduced so the platform can demonstrate real tamper detection.'}
              {index === 7 && 'The mismatch proves why immutable evidence records matter.'}
              {index === 8 && 'Independent verification tests the original hash against the current hash.'}
              {index === 9 && 'The report consolidates AI findings, chain-of-custody, hashes, and blockchain verification.'}
            </p>
            <div className="cta-row" style={{ marginTop: 24 }}>
              <Button onClick={() => setIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev))}>Next Step</Button>
            </div>
          </div>
          <Card style={{ padding: 18 }}>
            <h3>Demo Sequence</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {steps.map((step, itemIndex) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, background: itemIndex === index ? 'rgba(73,196,255,0.15)' : 'rgba(15,23,42,0.7)', border: itemIndex === index ? '1px solid rgba(73,196,255,0.3)' : '1px solid rgba(148,163,184,0.12)' }}>
                  <span className="badge badge-info">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
