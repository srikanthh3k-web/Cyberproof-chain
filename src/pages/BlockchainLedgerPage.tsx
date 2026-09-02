import { useEffect, useState } from 'react';
import { SectionHeader, Card, StatusBadge } from '../App';
import { BlockchainBlock } from '../types';
import { apiFetch } from '../lib/api';

export default function BlockchainLedgerPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    apiFetch('/api/blockchain/blocks').then((r) => r.json()).then((d) => {
      const normalized = d.map((block: any) => ({
        ...block,
        index: block.blockIndex ?? block.index,
        transactions: Array.isArray(block.transactions) ? block.transactions : [],
        validator: block.validator || 'LOCAL DEMO VALIDATOR',
      }));
      setBlocks(normalized);
      setSelected(normalized[0] ?? null);
    });
  }, []);

  return (
    <>
      <SectionHeader title="Blockchain Ledger" subtitle="Simulated immutable evidence registry with validator-backed confirmations" />
      <div className="grid-2">
        <Card style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Linked Blocks</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {blocks.map((block) => (
              <button key={block.index} onClick={() => setSelected(block)} style={{ textAlign: 'left', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 14, padding: 14, color: '#e9edf6', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong>Block #{block.index}</strong>
                  <StatusBadge status="CONFIRMED" type="success" />
                </div>
                <div>Previous Hash: {block.previousHash}</div>
                <div>Current Hash: {block.hash}</div>
                <div>Evidence IDs: {(block.evidenceIds || []).join(', ')}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          {selected ? (
            <>
              <h3 style={{ marginTop: 0 }}>Block #{selected.index}</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                <div><strong>Previous Hash</strong>: {selected.previousHash}</div>
                <div><strong>Current Hash</strong>: {selected.hash}</div>
                <div><strong>Timestamp</strong>: {selected.timestamp}</div>
                <div><strong>Transaction Count</strong>: {selected.transactions.length}</div>
                <div><strong>Validator</strong>: {selected.validator}</div>
                <div><strong>Nonce</strong>: {selected.nonce}</div>
                <div><strong>Evidence IDs</strong>: {(selected.evidenceIds || []).join(', ')}</div>
                <div><strong>Transactions</strong>: {selected.transactions.map((tx: any) => tx.txId).join(', ') || 'None'}</div>
              </div>
            </>
          ) : <div className="empty-state"><p>No block selected.</p></div>}
        </Card>
      </div>
    </>
  );
}
