'use client';

import { useSession } from 'next-auth/react';

export default function TestSessionPage() {
  const { data: session, status } = useSession();
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Session Provider Test</h1>
      <div>
        <strong>Status:</strong> {status}
      </div>
      <div>
        <strong>Session:</strong> {session ? 'Available' : 'None'}
      </div>
      <div style={{ marginTop: '2rem', color: 'green' }}>
        ✅ If you can see this page without errors, SessionProvider is working!
      </div>
    </div>
  );
}
