import { useEffect, useState } from 'react';
import { SectionHeader, Card, StatusBadge } from '../App';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [query, setQuery] = useState('');

  const refresh = async () => {
    const [usersResponse, healthResponse] = await Promise.all([
      fetch('/api/users', { headers: { Authorization: `Bearer ${localStorage.getItem('cyberproof_token') || ''}` } }),
      fetch('/api/security-health'),
    ]);
    const usersData = await usersResponse.json();
    const healthData = await healthResponse.json();
    setUsers(usersData || []);
    setHealth(healthData || {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredUsers = users.filter((user) => !query || `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <SectionHeader title="Admin Panel" subtitle="Control plane for users, audit trails, health, and secure configuration" action={<button className="btn btn-secondary" onClick={refresh}>Refresh Status</button>} />
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <Card style={{ padding: 18 }}>
          <div className="muted">Users</div>
          <h3 style={{ margin: '10px 0 0' }}>{users.length}</h3>
        </Card>
        <Card style={{ padding: 18 }}>
          <div className="muted">System Health</div>
          <h3 style={{ margin: '10px 0 0' }}>{health ? 'Healthy' : 'Pending'}</h3>
        </Card>
        <Card style={{ padding: 18 }}>
          <div className="muted">Security Events</div>
          <h3 style={{ margin: '10px 0 0' }}>{health ? 'Active' : 'Pending'}</h3>
        </Card>
      </div>

      <Card style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' }} />
          <button className="btn btn-primary" onClick={refresh}>Search</button>
        </div>
      </Card>

      <Card style={{ padding: 18 }}>
        <h3 style={{ marginTop: 0 }}>System Health</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {health ? Object.entries(health).map(([key, value]) => (
            <div key={key}><StatusBadge status={`${key}: ${String(value)}`} type="success" /></div>
          )) : <div>No health data available yet.</div>}
        </div>
      </Card>

      <Card style={{ padding: 18, marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>User Access Matrix</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {filteredUsers.map((user) => (
            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(15,23,42,0.7)', borderRadius: 10 }}>
              <div>
                <strong>{user.name}</strong><div className="muted">{user.email}</div>
              </div>
              <span className="badge badge-info">{user.role}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
