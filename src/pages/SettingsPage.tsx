import { SectionHeader, Card, StatusBadge } from '../App';

export default function SettingsPage() {
  return (
    <>
      <SectionHeader title="Security Settings" subtitle="Security posture and operational controls" />
      <div className="grid-2">
        <Card style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Environment Controls</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            <div>Authentication: <StatusBadge status="Secure" type="success" /></div>
            <div>Rate Limiting: <StatusBadge status="Enabled" type="info" /></div>
            <div>CORS: <StatusBadge status="Configured" type="success" /></div>
            <div>Session Security: <StatusBadge status="Encrypted" type="success" /></div>
            <div>File Validation: <StatusBadge status="Enabled" type="success" /></div>
          </div>
        </Card>
        <Card style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Local Prototype Notes</h3>
          <p className="muted">This is a LOCAL DEMONSTRATION NETWORK. Real public blockchain deployment should be set through environment variables such as BLOCKCHAIN_RPC_URL and PRIVATE_KEY.</p>
        </Card>
      </div>
    </>
  );
}
