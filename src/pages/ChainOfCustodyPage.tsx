import { useEffect, useState } from 'react';
import { SectionHeader, Card, StatusBadge } from '../App';
import { apiFetch } from '../lib/api';

export default function ChainOfCustodyPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/custody').then((r) => r.json()).then((d) => setEvents(d));
  }, []);

  return (
    <>
      <SectionHeader title="Chain of Custody" subtitle="Verified custodial events from acquisition to case closure" />
      <div style={{ display: 'grid', gap: 16 }}>
        {events.map((event, index) => (
          <Card key={`${event.action}-${event.evidenceId || index}`} style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="eyebrow">{new Date(event.timestamp).toLocaleString()}</div>
                <h3 style={{ margin: '8px 0 0' }}>{event.action}</h3>
              </div>
              <StatusBadge status="VALID" type="success" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginTop: 14 }}>
              <div><strong>User</strong><div>{event.user}</div></div>
              <div><strong>Location / Device</strong><div>{event.location}</div></div>
              <div><strong>Digital Signature</strong><div>{event.signature}</div></div>
              <div><strong>Transaction ID</strong><div>{event.transactionId}</div></div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
