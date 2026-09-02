import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { Card, EmptyState, LoadingState, SectionHeader, StatusBadge } from '../App';
import { apiFetch } from '../lib/api';
import { AuditLog, auditLogRequestState, filterAuditLogs } from '../lib/auditLogs';

type RequestState = 'loading' | 'success' | 'empty' | 'error' | 'unauthorized';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [state, setState] = useState<RequestState>('loading');
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ query: '', action: '', user: '', result: '' });

  const loadLogs = async () => {
    setState('loading');
    setError('');
    try {
      const token = localStorage.getItem('cyberproof_token');
      const response = await apiFetch('/api/audit-logs', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok && response.status !== 401 && response.status !== 403) throw new Error('Audit logs could not be loaded.');
      if (response.status === 401 || response.status === 403) {
        setState(auditLogRequestState(response.status, 0));
        return;
      }
      const data = await response.json();
      const records = Array.isArray(data) ? data : [];
      setLogs(records);
      setState(auditLogRequestState(response.status, records.length));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Audit logs could not be loaded.');
      setState('error');
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const actions = useMemo(() => [...new Set(logs.map((log) => log.action).filter(Boolean))], [logs]);
  const users = useMemo(() => [...new Set(logs.map((log) => log.user).filter(Boolean))], [logs]);
  const results = useMemo(() => [...new Set(logs.map((log) => log.result).filter(Boolean))], [logs]);
  const filteredLogs = useMemo(() => filterAuditLogs(logs, filters), [logs, filters]);

  if (state === 'loading') return <LoadingState label="Loading audit logs" />;

  return (
    <>
      <SectionHeader
        title="Audit Logs"
        subtitle="Authenticated record of security-relevant platform activity"
        action={<button className="btn btn-secondary" onClick={loadLogs}><RefreshCw size={15} /> Refresh</button>}
      />

      {state === 'unauthorized' && <Card style={{ padding: 18 }}><EmptyState title="Authorization required" message="Your session cannot access audit logs. Sign in again to continue." /></Card>}
      {state === 'error' && <Card style={{ padding: 18 }}><EmptyState title="Unable to load audit logs" message={error} /></Card>}
      {state === 'empty' && <Card style={{ padding: 18 }}><EmptyState title="No audit events" message="There are no audit events available for this session." /></Card>}

      {state === 'success' && (
        <>
          <Card style={{ padding: 18, marginBottom: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: 12 }}>
              <div style={searchStyle}><Search size={15} /><input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Search audit events" /></div>
              <select value={filters.action} onChange={(event) => setFilters({ ...filters, action: event.target.value })} style={fieldStyle}><option value="">All actions</option>{actions.map((action) => <option key={action} value={action}>{action}</option>)}</select>
              <select value={filters.user} onChange={(event) => setFilters({ ...filters, user: event.target.value })} style={fieldStyle}><option value="">All users</option>{users.map((user) => <option key={user} value={user}>{user}</option>)}</select>
              <select value={filters.result} onChange={(event) => setFilters({ ...filters, result: event.target.value })} style={fieldStyle}><option value="">All results</option>{results.map((result) => <option key={result} value={result}>{result}</option>)}</select>
            </div>
          </Card>

          {filteredLogs.length === 0 ? <EmptyState title="No matching events" message="Try a different search or filter." /> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Event ID</th><th>User</th><th>Action</th><th>Resource</th><th>Result</th><th>Timestamp</th><th>Related Case</th><th>Related Evidence</th><th>Severity</th></tr></thead>
                <tbody>{filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td><td>{log.user || '-'}</td><td>{log.action || '-'}</td><td>{log.resource || log.details || '-'}</td><td>{log.result ? <StatusBadge status={log.result} type="info" /> : '-'}</td><td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</td><td>{log.relatedCase || '-'}</td><td>{log.relatedEvidence || '-'}</td><td>{log.severity ? <StatusBadge status={log.severity} type={log.severity === 'CRITICAL' ? 'critical' : 'warning'} /> : '-'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}

const fieldStyle = { padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' } as const;
const searchStyle = { ...fieldStyle, display: 'flex', alignItems: 'center', gap: 8 } as const;