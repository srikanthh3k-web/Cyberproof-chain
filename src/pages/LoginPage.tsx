import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function LoginPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('cyberproof_token', data.token);
      localStorage.setItem('cyberproof_user', JSON.stringify(data.user));
      onLogin(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid login');
    }
  };

  return (
    <div className="landing-shell">
      <div className="hero-panel" style={{ maxWidth: 520, margin: '80px auto' }}>
        <p className="eyebrow">Secure Access</p>
        <h2 style={{ marginTop: 8 }}>Login to Cyberproof Chain</h2>
        <p className="muted">Initial admin access is configured on the backend only. Production secrets are never exposed in the frontend.</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <label>
            <div className="muted" style={{ marginBottom: 8 }}>Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: '#0b1528', color: '#e9edf6', border: '1px solid rgba(148,163,184,0.2)' }} />
          </label>
          <label>
            <div className="muted" style={{ marginBottom: 8 }}>Password</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: '#0b1528', color: '#e9edf6', border: '1px solid rgba(148,163,184,0.2)' }} />
          </label>
          {error && <div className="badge badge-critical" style={{ width: 'fit-content' }}>{error}</div>}
          <button type="submit" className="btn btn-primary">Authenticate</button>
        </form>
        <div className="pill-row" style={{ marginTop: 24 }}>
          <span className="pill">Local demo environment only</span>
          <span className="pill">JWT session + RBAC enabled</span>
        </div>
      </div>
    </div>
  );
}
