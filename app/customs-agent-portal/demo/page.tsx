'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomsAgentPortalDemo() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to portal with demo parameters
    router.push('/customs-agent-portal?client=CLIENT-001&ff=FF-001');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚢</div>
        <div style={{ fontSize: '18px' }}>Loading demo portal...</div>
      </div>
    </div>
  );
}
