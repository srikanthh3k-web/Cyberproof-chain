import { useEffect, useState } from 'react';
import { SectionHeader, StatusBadge, Card, LoadingState } from '../App';
import { EvidenceItem } from '../types';
import { apiFetch } from '../lib/api';

export default function EvidenceVaultPage() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [uploadState, setUploadState] = useState('');
  const [calculatedHash, setCalculatedHash] = useState('');
  const [form, setForm] = useState({ filename: 'malware_log.txt', fileType: 'TXT', fileSize: '1.4 MB', uploadedBy: 'analyst@cyberproof.local', investigationId: 'INV-1001', currentCustodian: 'Marcus Chen' });

  useEffect(() => {
    apiFetch('/api/evidence').then((r) => r.json()).then((d) => setItems(d)).finally(() => setLoading(false));
  }, []);

  const calculateFileHash = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setForm((prev) => ({
      ...prev,
      filename: file.name,
      fileType: file.name.split('.').pop()?.toUpperCase() || 'TXT',
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    }));

    const hash = await calculateFileHash(file);
    setCalculatedHash(hash);

    const text = await file.text();
    setFileContent(text || '');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !fileContent) {
      setUploadState('Please select a file before uploading.');
      return;
    }

    setUploadState('Hashing file and registering evidence...');
    const payloadContent = fileContent || 'original evidence body';
    const response = await apiFetch('/api/evidence/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        content: payloadContent,
        fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : form.fileSize,
        hash: calculatedHash || undefined,
      }),
    });
    const data = await response.json();
    setItems((prev) => [data.evidence, ...prev]);
    setUploadState(`Evidence registered successfully. Hash: ${data.evidence.sha256.slice(0, 20)}...`);
    setSelectedFile(null);
    setCalculatedHash('');
    setFileContent('');
    (e.currentTarget as HTMLFormElement).reset();
  };

  if (loading) return <LoadingState label="Loading evidence vault" />;

  return (
    <>
      <SectionHeader title="Evidence Vault" subtitle="Upload, hash, verify, and protect chain-of-custody records" />
      <Card style={{ padding: 18, marginBottom: 20 }}>
        <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
          <input type="file" onChange={handleFileSelect} style={{ ...fieldStyle, gridColumn: 'span 2' }} />
          <input value={form.filename} onChange={(e) => setForm({ ...form, filename: e.target.value })} placeholder="Filename" style={{ ...fieldStyle }} />
          <input value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} placeholder="File type" style={{ ...fieldStyle }} />
          <input value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} placeholder="File size" style={{ ...fieldStyle }} />
          <input value={form.uploadedBy} onChange={(e) => setForm({ ...form, uploadedBy: e.target.value })} placeholder="Uploaded by" style={{ ...fieldStyle }} />
          <input value={form.investigationId} onChange={(e) => setForm({ ...form, investigationId: e.target.value })} placeholder="Investigation ID" style={{ ...fieldStyle }} />
          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 1' }}>Upload Evidence</button>
        </form>
        {calculatedHash && <div className="badge badge-info" style={{ marginTop: 12 }}>Computed SHA-256: {calculatedHash.slice(0, 24)}...</div>}
        {uploadState && <div className="badge badge-success" style={{ marginTop: 12 }}>{uploadState}</div>}
      </Card>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Evidence ID</th>
              <th>Filename</th>
              <th>Type</th>
              <th>Hash</th>
              <th>Uploaded By</th>
              <th>Investigation</th>
              <th>Status</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.filename}</td>
                <td>{item.fileType}</td>
                <td>{item.sha256.slice(0, 12)}...</td>
                <td>{item.uploadedBy}</td>
                <td>{item.investigationId}</td>
                <td><StatusBadge status={item.integrityStatus} type={item.tampered ? 'critical' : 'success'} /></td>
                <td>{item.blockchainTxId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const fieldStyle = { padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.2)', background: '#0b1528', color: '#e9edf6' } as const;
