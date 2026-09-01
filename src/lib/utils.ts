export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

export function shortHash(hash: string, length = 12) {
  if (!hash || hash.length <= length) return hash;
  return `${hash.slice(0, 5)}...${hash.slice(-Math.min(length - 5, 6))}`;
}

export function getRolePermissions(role: string) {
  const map: Record<string, string[]> = {
    ADMIN: ['all'],
    LEAD_INVESTIGATOR: ['investigations', 'evidence', 'reports'],
    FORENSIC_ANALYST: ['evidence', 'ai-forensics'],
    AUDITOR: ['verification', 'custody'],
    VIEWER: ['read-only'],
  };
  return map[role] || ['read-only'];
}
