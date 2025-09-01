'use client';

import { useEffect, useState } from 'react';

export default function TestVendorPortalPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [portalLoads, setPortalLoads] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if session exists
    const session = localStorage.getItem('vendorSession');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setSessionData(parsed);
        console.info('✅ Session found:', parsed);
      } catch (error) {
        console.error('❌ Error parsing session:', error);
      }
    } else {
      console.info('❌ No session found');
    }

    // Test if vendor portal page loads
    fetch('/vendor-portal')
      .then((response) => {
        if (response.ok) {
          setPortalLoads(true);
          console.info('✅ Vendor portal page loads successfully');
        } else {
          setPortalLoads(false);
          console.info(
            '❌ Vendor portal page failed to load:',
            response.status
          );
        }
      })
      .catch((error) => {
        setPortalLoads(false);
        console.error('❌ Error loading vendor portal:', error);
      });
  }, []);

  const testPortalAccess = () => {
    // Set up test session
    const testSession = {
      shipperId: 'ABC-204-070',
      companyName: 'ABC Manufacturing Corp',
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('vendorSession', JSON.stringify(testSession));
    setSessionData(testSession);

    console.info('🧪 Test session set up');
    alert('🧪 Test session created. Try accessing /vendor-portal now.');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🧪 Vendor Portal Test Page</h1>
      <p>This page tests the vendor portal functionality.</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={testPortalAccess}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🧪 Set Up Test Session
        </button>

        <button
          onClick={() => (window.location.href = '/vendor-portal')}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🧪 Go to Vendor Portal
        </button>
      </div>

      <div
        style={{
          background: '#f3f4f6',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>Current Session Data:</h3>
        {sessionData ? (
          <pre
            style={{
              background: '#e5e7eb',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        ) : (
          <p>No session data found</p>
        )}
      </div>

      <div
        style={{ background: '#fef3c7', padding: '20px', borderRadius: '8px' }}
      >
        <h3>Portal Load Test:</h3>
        {portalLoads === true && (
          <p style={{ color: 'green' }}>
            ✅ Vendor portal page loads successfully
          </p>
        )}
        {portalLoads === false && (
          <p style={{ color: 'red' }}>❌ Vendor portal page failed to load</p>
        )}
        {portalLoads === null && <p>Testing portal load...</p>}
      </div>

      <div
        style={{
          background: '#dbeafe',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
        }}
      >
        <h3>Instructions:</h3>
        <ol>
          <li>Click ""Set Up Test Session"" to create a test session</li>
          <li>Click ""Go to Vendor Portal"" to test direct access</li>
          <li>Check if the vendor portal loads correctly</li>
          <li>If it redirects back to login, there's a session issue</li>
          <li>If it loads but shows errors, there's a page issue</li>
        </ol>
      </div>
    </div>
  );
}
