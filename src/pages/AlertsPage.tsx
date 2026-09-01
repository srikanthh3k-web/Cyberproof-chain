import { useEffect, useMemo, useState } from 'react';
import { SectionHeader, Card, StatusBadge } from '../App';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchAlerts = async () => {
    const response = await fetch('/api/alerts');
    const data = await response.json();
    setAlerts(data);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesFilter = filter === 'ALL' || alert.type === filter;
      const matchesQuery = !query || `${alert.title} ${alert.message}`.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [alerts, filter, query]);

  const updateAlert = async (id: string, patch: Partial<{ resolved: boolean; type: string }>) => {
    const response = await fetch(`/api/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (response.ok) {
      await fetchAlerts();
    }
  };

  const deleteAlert = async (id: string) => {
    const response = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
    if (response.ok) {
      await fetchAlerts();
    }
  };

  return (
    <>
      <SectionHeader title="Alert Center" subtitle="Operational warnings, critical notifications, and resolution status" />
      <Card style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alerts" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' }}>
            <option value="ALL">All</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </Card>
      <div style={{ display: 'grid', gap: 12 }}>
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <h3 style={{ margin: 0 }}>{alert.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{alert.message}</p>
              </div>
              <StatusBadge status={alert.type} type={alert.type === 'CRITICAL' ? 'critical' : alert.type === 'WARNING' ? 'warning' : 'info'} />
            </div>
            <div className="pill-row" style={{ marginTop: 12 }}>
              <button className="btn btn-secondary" onClick={() => updateAlert(alert.id, { resolved: !alert.resolved })}>{alert.resolved ? 'Mark Unresolved' : 'Resolve'}</button>
              <button className="btn btn-secondary" onClick={() => updateAlert(alert.id, { type: alert.type === 'INFO' ? 'WARNING' : 'INFO' })}>Toggle Priority</button>
              <button className="btn btn-ghost" onClick={() => deleteAlert(alert.id)}>Delete</button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
