import { ArrowRight, ShieldCheck, Database, Cpu, Lock, Sparkles, Search } from 'lucide-react';
import { demoMetrics, demoArchitecture, demoFAQ, demoUseCases } from '../data/demo';

export default function LandingPage() {
  return (
    <div className="landing-shell">
      <div className="hero-panel">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trust Every Byte.</p>
            <h1>CYBERPROOF<br />CHAIN</h1>
            <p>Immutable Digital Evidence. Intelligent Cyber Forensics.</p>
            <div className="cta-row">
              <a href="/login" className="btn btn-primary">Launch Investigation</a>
              <a href="/sih-demo" className="btn btn-secondary">Explore Platform</a>
            </div>
            <div className="pill-row">
              <span className="pill">Evidence Verification</span>
              <span className="pill">AI Forensics</span>
              <span className="pill">Blockchain Ledger</span>
            </div>
            <div className="metric-row">
              {demoMetrics.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <div className="metric-value">{metric.value}{metric.suffix}</div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="nodes">
              <div className="node" data-pos="left"><ShieldCheck /></div>
              <div className="node" data-pos="mid"><Database /></div>
              <div className="node" data-pos="mid2"><Cpu /></div>
              <div className="node" data-pos="right"><Lock /></div>
              <div className="node" data-pos="end"><Sparkles /></div>
              <div className="line" style={{ left: '22%', top: '42%', width: '18%', transform: 'rotate(14deg)' }} />
              <div className="line" style={{ left: '42%', top: '28%', width: '18%', transform: 'rotate(40deg)' }} />
              <div className="line" style={{ left: '42%', top: '58%', width: '18%', transform: 'rotate(-32deg)' }} />
              <div className="line" style={{ left: '57%', top: '42%', width: '24%', transform: 'rotate(8deg)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-stack">
        <div className="feature-card">
          <p className="eyebrow">Problem</p>
          <h3>Evidence can be altered.</h3>
          <p>Digital evidence is vulnerable to tampering, deletion, and custody gaps during investigations and legal review.</p>
        </div>
        <div className="feature-card">
          <p className="eyebrow">Solution</p>
          <h3>Cryptographic integrity.</h3>
          <p>Every evidence item is hashed, verified, and anchored in an immutable ledger to preserve chain-of-custody trust.</p>
        </div>
        <div className="feature-card">
          <p className="eyebrow">Innovation</p>
          <h3>AI + Blockchain + Forensics.</h3>
          <p>Advanced analysis combines AI forensic reasoning, threat intelligence, and blockchain verification into a single workflow.</p>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: 32 }}>
        <div>
          <p className="eyebrow">Architecture</p>
          <h2>How the platform works</h2>
        </div>
      </div>
      <div className="grid-4">
        {demoArchitecture.map((step, index) => (
          <div className="feature-card" key={step}>
            <div className="eyebrow">0{index + 1}</div>
            <h3>{step}</h3>
            <p>{index === 0 && 'Evidence enters the platform from endpoint, cloud, and network sources.'}</p>
            <p>{index === 1 && 'Acquisition captures exact file metadata and chain-of-custody context.'}</p>
            <p>{index === 2 && 'SHA-256 fingerprints and signature-ready records protect evidence authenticity.'}</p>
            <p>{index === 3 && 'AI services classify threats and support investigation decisions.'}</p>
            <p>{index === 4 && 'Blockchain registry records immutable evidence events for independent verification.'}</p>
            <p>{index === 5 && 'Secure storage preserves evidence without exposing the original data directly.'}</p>
            <p>{index === 6 && 'Analysts and investigators work from a unified evidence intelligence dashboard.'}</p>
            <p>{index === 7 && 'Independent verification portals validate records without revealing sensitive content.'}</p>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: 32 }}>
        <div>
          <p className="eyebrow">Use Cases</p>
          <h2>Built for cyber investigations</h2>
        </div>
      </div>
      <div className="grid-3">
        {demoUseCases.map((useCase) => (
          <div key={useCase} className="feature-card"><h3>{useCase}</h3></div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: 32 }}>
        <div>
          <p className="eyebrow">FAQ</p>
          <h2>Questions judges ask</h2>
        </div>
      </div>
      <div className="grid-3">
        {demoFAQ.map((item) => (
          <div key={item.q} className="feature-card">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
