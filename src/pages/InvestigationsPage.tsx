import { useEffect, useMemo, useState } from 'react';
import { Investigation } from '../types';
import { SectionHeader, StatusBadge, Card, EmptyState, LoadingState } from '../App';
import { apiFetch } from '../lib/api';

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ caseName: '', description: '', severity: 'MEDIUM', status: 'OPEN', leadInvestigator: 'Marcus Chen' });

  const fetchInvestigations = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/investigations');
      const data = await response.json();
      setInvestigations(data);
    } catch {
      setInvestigations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      const matchesSearch = !search || `${inv.caseName} ${inv.id} ${inv.leadInvestigator}`.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === 'ALL' || inv.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [investigations, search, severityFilter, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.caseName.trim()) {
      setMessage('Case name is required.');
      return;
    }

    const payload = {
      ...form,
      caseName: form.caseName.trim(),
      description: form.description.trim() || 'No description provided',
    };

    const endpoint = editingId ? `/api/investigations/${editingId}` : '/api/investigations';
    const method = editingId ? 'PATCH' : 'POST';

    const response = await apiFetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Unable to save investigation.');
      return;
    }

    setInvestigations((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item));
      }
      return [data, ...prev];
    });

    setForm({ caseName: '', description: '', severity: 'MEDIUM', status: 'OPEN', leadInvestigator: 'Marcus Chen' });
    setEditingId(null);
    setMessage(editingId ? 'Investigation updated successfully.' : 'Investigation created successfully.');
  };

  const handleEdit = (inv: Investigation) => {
    setEditingId(inv.id);
    setForm({
      caseName: inv.caseName,
      description: inv.description,
      severity: inv.severity,
      status: inv.status,
      leadInvestigator: inv.leadInvestigator,
    });
  };

  const handleDelete = async (id: string) => {
    const response = await apiFetch(`/api/investigations/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Unable to archive investigation.');
      return;
    }
    setInvestigations((prev) => prev.filter((item) => item.id !== id));
    setMessage('Investigation archived.');
  };

  const handleStatusChange = async (id: string, status: Investigation['status']) => {
    const response = await apiFetch(`/api/investigations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Unable to update status.');
      return;
    }
    setInvestigations((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setMessage('Status updated successfully.');
  };

  if (loading) return <LoadingState label="Loading investigations" />;

  return (
    <>
      <SectionHeader title="Investigation Management" subtitle="Case tracking, severity controls, and rapid assignment workflows" />
      {message && <div className="badge badge-info" style={{ marginBottom: 12 }}>{message}</div>}
      <Card style={{ padding: 18 }}>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
          <input placeholder="Case name" value={form.caseName} onChange={(e) => setForm({ ...form, caseName: e.target.value })} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' }} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' }} />
          <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as any })} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' }}>
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' }}>
            {['OPEN', 'UNDER INVESTIGATION', 'CONTAINED', 'RESOLVED', 'ARCHIVED'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Investigation'}</button>
        </form>
      </Card>

      <Card style={{ padding: 18, marginTop: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search investigations" style={{ ...fieldStyle }} />
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={{ ...fieldStyle }}>
            <option value="ALL">All severities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...fieldStyle }}>
            <option value="ALL">All statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="UNDER INVESTIGATION">UNDER INVESTIGATION</option>
            <option value="CONTAINED">CONTAINED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </Card>

      <div style={{ marginTop: 20 }}>
        {filteredInvestigations.length === 0 ? (
          <EmptyState title="No investigations found" message="Try another search or create a new investigation." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Investigation ID</th>
                <th>Case Name</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Lead Investigator</th>
                <th>Evidence Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestigations.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{inv.caseName}</td>
                  <td><StatusBadge status={inv.severity} type={inv.severity === 'CRITICAL' ? 'critical' : inv.severity === 'HIGH' ? 'warning' : 'info'} /></td>
                  <td><StatusBadge status={inv.status} type={inv.status === 'ARCHIVED' ? 'info' : inv.status === 'RESOLVED' ? 'success' : inv.status === 'CONTAINED' ? 'warning' : 'info'} /></td>
                  <td>{inv.leadInvestigator}</td>
                  <td>{inv.evidenceCount}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary" onClick={() => handleEdit(inv)}>Edit</button>
                      <button className="btn btn-secondary" onClick={() => handleStatusChange(inv.id, inv.status === 'ARCHIVED' ? 'OPEN' : 'ARCHIVED')}>{inv.status === 'ARCHIVED' ? 'Reopen' : 'Archive'}</button>
                      <button className="btn btn-ghost" onClick={() => handleDelete(inv.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const fieldStyle = { padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' } as const;
