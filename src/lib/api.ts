const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function apiFetch(path: string, options?: RequestInit) {
  const requestPath = path.startsWith('/') ? path : `/${path}`;
  const headers = new Headers(options?.headers);
  const token = localStorage.getItem('cyberproof_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(`${apiBaseUrl}${requestPath}`, { ...options, headers });
}
