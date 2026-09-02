const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { app, demoData, signToken } = require('./server');
const authToken = signToken({ id: 'USR-102', email: 'investigator@cyberproof.local', role: 'LEAD_INVESTIGATOR' });

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function request(server, path, options) {
  const headers = new Headers(options?.headers);
  headers.set('Authorization', `Bearer ${authToken}`);
  return fetch(`http://127.0.0.1:${server.address().port}${path}`, { ...options, headers });
}

test('evidence hashing and verification', async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  await t.test('registers and verifies unchanged evidence', async () => {
    const content = 'test evidence content';
    const response = await request(server, '/api/evidence/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'test.txt', content }),
    });
    const registered = (await response.json()).evidence;
    const verification = await (await request(server, `/api/evidence/${registered.id}/verify`, { method: 'POST' })).json();

    assert.equal(registered.sha256, sha256(content));
    assert.equal(verification.status, 'VERIFIED');
    assert.equal(verification.currentHash, registered.sha256);
    assert.equal(demoData.evidence.find((item) => item.id === registered.id).integrityStatus, 'VERIFIED');
  });

  await t.test('detects modified evidence without replacing the original hash', async () => {
    const content = 'evidence before modification';
    const response = await request(server, '/api/evidence/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'modified.txt', content }),
    });
    const registered = (await response.json()).evidence;
    const stored = demoData.evidence.find((item) => item.id === registered.id);
    stored.content = 'evidence after modification';
    const verification = await (await request(server, `/api/evidence/${stored.id}/verify`, { method: 'POST' })).json();

    assert.equal(verification.status, 'TAMPERING_DETECTED');
    assert.equal(verification.originalHash, sha256(content));
    assert.equal(stored.sha256, verification.originalHash);
    assert.equal(demoData.alerts[0].type, 'CRITICAL');
    assert.equal(demoData.custodyEvents[0].action, 'Tampering Detected');
  });

  await t.test('restores demo evidence and verifies it', async () => {
    await request(server, '/api/demo/tamper', { method: 'POST' });
    const restore = await (await request(server, '/api/demo/restore', { method: 'POST' })).json();
    const verification = await (await request(server, '/api/verification/EVD-1046')).json();

    assert.equal(restore.restoredHash, verification.currentHash);
    assert.equal(verification.status, 'VERIFIED');
  });

  await t.test('repeated verification returns the same SHA-256', async () => {
    const first = await (await request(server, '/api/verification/EVD-1046')).json();
    const second = await (await request(server, '/api/verification/EVD-1046')).json();

    assert.equal(first.currentHash, second.currentHash);
    assert.equal(first.currentHash, first.originalHash);
  });
});