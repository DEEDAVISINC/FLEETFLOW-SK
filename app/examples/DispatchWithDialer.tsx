'use client';

import { useEffect, useState } from 'react';
import FloatingDialerWidget from '../components/FloatingDialerWidget';
import { getCurrentUser } from '../config/access';

// Example integration of FloatingDialerWidget in Dispatch Central
export default function DispatchWithDialer() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      {/* Your existing dispatch content would go here */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ color: 'white', marginBottom: '16px' }}>
          🚛 Dispatch Central with Integrated Dialer
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
          This is an example of how the FloatingDialerWidget integrates with
          existing pages.
        </p>

        {/* User Info Display */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ color: 'white', margin: '0 0 8px 0' }}>Current User:</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0' }}>
            <strong>Name:</strong> {user.user?.name || 'Unknown'}
            <br />
            <strong>Role:</strong> {user.user?.role || 'Unknown'}
            <br />
            <strong>Department:</strong> {user.user?.department || 'Unknown'}
            <br />
            <strong>Permissions:</strong>{' '}
            {user.user?.permissions?.join(', ') || 'None'}
          </p>
        </div>

        {/* Dialer Access Info */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <h3 style={{ color: '#60a5fa', margin: '0 0 8px 0' }}>
            📞 Dialer Integration
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0',
              fontSize: '14px',
            }}
          >
            The dialer widget will appear in the bottom-right corner if you have
            access based on your role:
          </p>
          <ul
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              marginTop: '8px',
            }}
          >
            <li>
              <strong>Customer Service & Sales:</strong> Always visible
              (required)
            </li>
            <li>
              <strong>Dispatchers & Brokers:</strong> Visible if enabled in user
              settings
            </li>
            <li>
              <strong>Drivers:</strong> Never visible (restricted)
            </li>
          </ul>
        </div>
      </div>

      {/* Floating Dialer Widget */}
      <FloatingDialerWidget
        userRole={user.user?.role || ''}
        department={user.user?.department || ''}
        hasDialerAccess={
          user.user?.permissions?.includes('dialer_access') || false
        }
      />
    </div>
  );
}
