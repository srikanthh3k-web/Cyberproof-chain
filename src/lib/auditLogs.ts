export interface AuditLog {
  id: string;
  user?: string;
  action?: string;
  resource?: string;
  result?: string;
  timestamp?: string;
  relatedCase?: string;
  relatedEvidence?: string;
  severity?: string;
  details?: string;
}

export interface AuditLogFilters {
  query: string;
  action: string;
  user: string;
  result: string;
}

export type AuditLogRequestState = 'success' | 'empty' | 'unauthorized' | 'error';

export function auditLogRequestState(status: number, recordCount: number): AuditLogRequestState {
  if (status === 401 || status === 403) return 'unauthorized';
  if (status < 200 || status >= 300) return 'error';
  return recordCount ? 'success' : 'empty';
}

export function filterAuditLogs(logs: AuditLog[], filters: AuditLogFilters) {
  const query = filters.query.trim().toLowerCase();
  return logs.filter((log) => {
    const searchable = [log.id, log.user, log.action, log.resource, log.result, log.relatedCase, log.relatedEvidence, log.details]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return (!query || searchable.includes(query))
      && (!filters.action || log.action === filters.action)
      && (!filters.user || log.user === filters.user)
      && (!filters.result || log.result === filters.result);
  });
}