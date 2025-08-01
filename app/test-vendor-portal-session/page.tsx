'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TestVendorPortalSession() {
  const router = useRouter();

  useEffect(() => {
    // Set up a test session
    const testSession = {
      shipperId: 'ABC-204-070',
      companyName: 'ABC Manufacturing Corp',
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('vendorSession', JSON.stringify(testSession));

    console.log('🧪 Test session created:', testSession);

    // Redirect to vendor portal
    setTimeout(() => {
      router.push('/vendor-portal');
    }, 1000);
  }, [router]);

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'system-ui, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
        }}
      >
        <h1>🧪 Testing Vendor Portal Session</h1>
        <p>Creating test session and redirecting to vendor portal...</p>
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          <p>Redirecting in 1 second...</p>
        </div>
      </div>
    </div>
  );
}
