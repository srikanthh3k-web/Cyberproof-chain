import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, Bell, LogOut, Menu, X, ArrowRight, Activity, Files, Database, Lock, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import DashboardPage from './pages/DashboardPage';
import InvestigationsPage from './pages/InvestigationsPage';
import EvidenceVaultPage from './pages/EvidenceVaultPage';
import AIForensicsPage from './pages/AIForensicsPage';
import BlockchainLedgerPage from './pages/BlockchainLedgerPage';
import ThreatIntelligencePage from './pages/ThreatIntelligencePage';
import ChainOfCustodyPage from './pages/ChainOfCustodyPage';
import ReportsPage from './pages/ReportsPage';
import VerificationPage from './pages/VerificationPage';
import AlertsPage from './pages/AlertsPage';
import TeamPage from './pages/TeamPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import SIHDemoPage from './pages/SIHDemoPage';

import { demoUser } from './data/demo';

const navMap = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Investigations', path: '/investigations' },
  { label: 'Evidence Vault', path: '/evidence' },
  { label: 'AI Forensics', path: '/ai-forensics' },
  { label: 'Blockchain Ledger', path: '/blockchain' },
  { label: 'Threat Intelligence', path: '/threat-intelligence' },
  { label: 'Chain of Custody', path: '/custody' },
  { label: 'Reports', path: '/reports' },
  { label: 'Verification', path: '/verification' },
  { label: 'Alerts', path: '/alerts' },
  { label: 'Team', path: '/team' },
  { label: 'Admin', path: '/admin' },
  { label: 'Settings', path: '/settings' },
  { label: 'Audit Logs', path: '/audit-logs' },
];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('cyberproof_token');
  const user = localStorage.getItem('cyberproof_user');
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cyberproof_user') || 'null') || demoUser;
    } catch {
      return demoUser;
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('cyberproof_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const filteredNav = useMemo(() => {
    return navMap.filter((item) => !search || item.label.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem('cyberproof_token');
    localStorage.removeItem('cyberproof_user');
    window.location.href = '/login';
  };

  const handleGlobalSearch = () => {
    const query = search.trim();
    if (!query) return;

    const clean = query.toLowerCase();
    const upper = query.toUpperCase();

    if (upper.includes('EVD-') || upper.includes('TX-') || upper.includes('INV-')) {
      navigate('/verification');
      return;
    }

    if (clean.includes('alert') || clean.includes('threat') || clean.includes('malware') || clean.includes('phishing')) {
      navigate('/alerts');
      return;
    }

    if (clean.includes('ip') || clean.includes('domain') || clean.includes('url') || clean.includes('hash') || clean.includes('.com') || clean.includes('.net')) {
      navigate('/threat-intelligence');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sih-demo" element={<SIHDemoPage />} />
        <Route path="/login" element={<LoginPage onLogin={(u) => setUser(u)} />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                  <div className="logo-wrap">
                    <div className="logo-mark"><ShieldCheck size={18} /></div>
                    <div>
                      <div className="logo-text">CYBERPROOF</div>
                      <div className="logo-sub">CHAIN</div>
                    </div>
                  </div>

                  <nav className="nav-list">
                    {filteredNav.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </nav>

                  <div className="sidebar-footer">
                    <div className="badge badge-info">Prototype / SIH Demo</div>
                  </div>
                </aside>

                <main className="main-panel">
                  <header className="topbar">
                    <div className="topbar-left">
                      <button className="mobile-toggle" onClick={() => setSidebarOpen((v) => !v)}>
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                      </button>
                      <div className="crumbs">
                        <span>Home</span>
                        <span className="divider">/</span>
                        <span>Cyberproof</span>
                      </div>
                    </div>

                    <div className="topbar-actions">
                      <div className="searchbox" onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGlobalSearch();
                      }}>
                        <Search size={15} />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Global search" />
                      </div>
                      <button className="icon-btn"><Bell size={17} /></button>
                      <div className="user-pill">
                        <div className="avatar">{user.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-role">{user.role}</div>
                        </div>
                      </div>
                      <button className="logout-btn" onClick={handleLogout}><LogOut size={16} /> Logout</button>
                    </div>
                  </header>

                  <div className="page-content">
                    <Routes>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/investigations" element={<InvestigationsPage />} />
                      <Route path="/evidence" element={<EvidenceVaultPage />} />
                      <Route path="/ai-forensics" element={<AIForensicsPage />} />
                      <Route path="/blockchain" element={<BlockchainLedgerPage />} />
                      <Route path="/threat-intelligence" element={<ThreatIntelligencePage />} />
                      <Route path="/custody" element={<ChainOfCustodyPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/verification" element={<VerificationPage />} />
                      <Route path="/alerts" element={<AlertsPage />} />
                      <Route path="/team" element={<TeamPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/audit-logs" element={<AuditLogsPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">CYBERPROOF CHAIN</p>
        <h2>{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon, tone = 'cyan' }: { label: string; value: string; icon?: React.ReactNode; tone?: 'cyan' | 'green' | 'amber' | 'red' | 'purple' }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon">{icon || <Activity size={18} />}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

export function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`panel ${className}`} style={style}>{children}</div>;
}

export function StatusBadge({ status, type = 'success' }: { status: string; type?: 'success' | 'warning' | 'critical' | 'info' }) {
  return <span className={`badge badge-${type}`}>{status}</span>;
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return <div className="empty-state"><div className="spinner" /><p>{label}...</p></div>;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return <div className="empty-state"><p className="empty-title">{title}</p><p>{message}</p></div>;
}

export function Button({ children, onClick, variant = 'primary', className = '' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; className?: string }) {
  return <button className={`btn btn-${variant} ${className}`} onClick={onClick}>{children}</button>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="progress"><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export const appIcons = { ShieldCheck, Search, Bell, LogOut, Menu, X, ArrowRight, Activity, Files, Database, Lock, Cpu, Sparkles };
