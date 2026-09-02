const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');

process.env.PORT = '0';
const { startServer, demoData } = require('./server');
const auditLogsPath = path.resolve(__dirname, '../src/lib/auditLogs.ts');
const auditLogsModule = new Module(auditLogsPath);
const auditLogsSource = fs.readFileSync(auditLogsPath, 'utf8');
const ts = require('typescript');
auditLogsModule._compile(ts.transpileModule(auditLogsSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, auditLogsPath);
const { auditLogRequestState, filterAuditLogs } = auditLogsModule.exports;

let server;
let token;

async function request(pathname, options) {
  return fetch(`http://127.0.0.1:${server.address().port}${pathname}`, options);
}

test('audit logs page data contract', async (t) => {
  server = await startServer();
  t.after(() => server.close());

  const loginResponse = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'investigator@cyberproof.local', password: 'investigator123' }),
  });
  token = (await loginResponse.json()).token;

  await t.test('authenticated user can load logs', async () => {
    const response = await request('/api/audit-logs', { headers: { Authorization: `Bearer ${token}` } });
    const logs = await response.json();
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(logs));
  });

  await t.test('unauthorized and API error states are classified', async () => {
    const unauthorized = await request('/api/audit-logs');
    assert.equal(unauthorized.status, 401);
    assert.equal(auditLogRequestState(unauthorized.status, 0), 'unauthorized');
    assert.equal(auditLogRequestState(500, 0), 'error');
  });

  await t.test('empty logs state is classified', async () => {
    const originalLogs = demoData.auditLogs;
    demoData.auditLogs = [];
    const response = await request('/api/audit-logs', { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(auditLogRequestState(response.status, (await response.json()).length), 'empty');
    demoData.auditLogs = originalLogs;
  });

  await t.test('search and filters narrow audit events', () => {
    const logs = [
      { id: 'AUD-1', user: 'analyst@example.test', action: 'UPLOAD', result: 'SUCCESS', details: 'Evidence upload' },
      { id: 'AUD-2', user: 'admin@example.test', action: 'DELETE', result: 'DENIED', details: 'Case record' },
    ];
    assert.equal(filterAuditLogs(logs, { query: 'evidence', action: '', user: '', result: '' }).length, 1);
    assert.equal(filterAuditLogs(logs, { query: '', action: 'DELETE', user: '', result: 'DENIED' }).length, 1);
    assert.equal(filterAuditLogs(logs, { query: '', action: '', user: 'missing', result: '' }).length, 0);
  });
});