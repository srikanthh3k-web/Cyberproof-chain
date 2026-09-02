import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Database, Files, ShieldCheck, Cpu, AlertTriangle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard, SectionHeader, StatusBadge, Card, EmptyState, LoadingState } from '../App';
import { apiFetch } from '../lib/api';
import { DashboardData } from '../types';

const COLORS = ['#49c4ff', '#8b5cf6', '#f59e0b', '#22c55e'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/dashboard');
      const payload = await response.json();
      setData(payload);
    } catch (error) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const navigateToPath = (path: string) => navigate(path);

  if (loading) return <LoadingState label="Loading dashboard data" />;
  if (!data) return <EmptyState title="Dashboard unavailable" message="Unable to load the security dashboard." />;

  return (
    <>
      <SectionHeader
        title="Security Dashboard"
        subtitle="Operational integrity, chain-of-custody trust, and investigative telemetry"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-secondary" onClick={fetchDashboard}><RefreshCw size={15} style={{ marginRight: 6 }} /> Refresh</button>
            <StatusBadge status="LIVE" type="success" />
          </div>
        }
      />

      <div className="grid-4">
        <div onClick={() => navigateToPath('/evidence')} style={{ cursor: 'pointer' }}><StatCard label="Total Evidence" value={String(data.summary.totalEvidence)} icon={<Files size={18} />} tone="cyan" /></div>
        <div onClick={() => navigateToPath('/verification')} style={{ cursor: 'pointer' }}><StatCard label="Verified Evidence" value={String(data.summary.verifiedEvidence)} icon={<ShieldCheck size={18} />} tone="green" /></div>
        <div onClick={() => navigateToPath('/verification')} style={{ cursor: 'pointer' }}><StatCard label="Tampered Evidence" value={String(data.summary.tamperedEvidence)} icon={<AlertTriangle size={18} />} tone="red" /></div>
        <div onClick={() => navigateToPath('/investigations')} style={{ cursor: 'pointer' }}><StatCard label="Active Investigations" value={String(data.summary.activeInvestigations)} icon={<Activity size={18} />} tone="purple" /></div>
        <div onClick={() => navigateToPath('/blockchain')} style={{ cursor: 'pointer' }}><StatCard label="Blockchain Records" value={String(data.summary.blockchainRecords)} icon={<Database size={18} />} tone="cyan" /></div>
        <div onClick={() => navigateToPath('/threat-intelligence')} style={{ cursor: 'pointer' }}><StatCard label="Critical Threats" value={String(data.summary.criticalThreats)} icon={<Cpu size={18} />} tone="amber" /></div>
        <div onClick={() => navigateToPath('/investigations')} style={{ cursor: 'pointer' }}><StatCard label="Total Cases" value={String(data.summary.totalCases)} icon={<Files size={18} />} tone="cyan" /></div>
        <div onClick={() => navigateToPath('/alerts')} style={{ cursor: 'pointer' }}><StatCard label="Open Alerts" value={String(data.summary.openAlerts)} icon={<AlertTriangle size={18} />} tone="red" /></div>
        <div onClick={() => navigateToPath('/custody')} style={{ cursor: 'pointer' }}><StatCard label="Custody Events" value={String(data.summary.custodyEvents)} icon={<ShieldCheck size={18} />} tone="green" /></div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <Card className="panel" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Evidence Collection Timeline</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.investigationActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" stroke="#9aadce" />
                <YAxis stroke="#9aadce" />
                <Tooltip />
                <Bar dataKey="value" radius={[10,10,0,0]} fill="#49c4ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="panel" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Threat Severity Distribution</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.threatDistribution} dataKey="value" nameKey="name" outerRadius={70} fill="#49c4ff" label>
                  {data.threatDistribution.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <Card className="panel" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Blockchain Transactions</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.blockchainActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" stroke="#9aadce" />
                <YAxis stroke="#9aadce" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="panel" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Evidence Integrity Trend</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.integrityTrend.map((value, index) => ({ name: `Q${index + 1}`, value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" stroke="#9aadce" />
                <YAxis domain={[90, 100]} stroke="#9aadce" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <Card className="panel" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Live Activity</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {data.activity.map((item, index) => (
              <div key={item} onClick={() => navigateToPath(index % 2 === 0 ? '/evidence' : '/blockchain')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, background: 'rgba(15,23,42,0.7)', cursor: 'pointer' }}>
                <span className="badge badge-info">{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="panel" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Recent Alerts</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {data.liveAlerts.map((alert) => (
              <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.12)' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{alert.title}</div>
                  <div style={{ color: '#9aadce', marginTop: 4 }}>{alert.message}</div>
                </div>
                <StatusBadge status={alert.type} type={alert.type === 'CRITICAL' ? 'critical' : alert.type === 'WARNING' ? 'warning' : 'info'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
