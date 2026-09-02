import { useEffect, useState } from 'react';
import { SectionHeader, Card } from '../App';
import { apiFetch } from '../lib/api';

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/team').then((r) => r.json()).then((d) => setUsers(d));
  }, []);

  return (
    <>
      <SectionHeader title="Team" subtitle="Authorized users and role-based access control" />
      <div className="grid-3">
        {users.map((user) => (
          <Card key={user.email} style={{ padding: 18 }}>
            <div className="avatar" style={{ width: 42, height: 42, marginBottom: 10 }}>{user.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}</div>
            <h3 style={{ margin: '8px 0 4px' }}>{user.name}</h3>
            <div className="muted">{user.role}</div>
            <p>{user.email}</p>
            <span className="badge badge-info">{user.active ? 'Active' : 'Inactive'}</span>
          </Card>
        ))}
      </div>
    </>
  );
}
