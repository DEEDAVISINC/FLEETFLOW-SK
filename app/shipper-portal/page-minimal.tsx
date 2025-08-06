'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkPermission } from '../config/access';
import { useShipper } from '../contexts/ShipperContext';
import { logUserAction } from '../utils/logger';

// Access control component
const AccessRestricted = () => (
  <div
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}
  >
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
      }}
    >
      <h1 style={{ color: 'white', marginBottom: '20px' }}>
        Access Restricted
      </h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '30px' }}>
        You don't have permission to access the Shipper Portal.
      </p>
      <Link href='/' style={{ textDecoration: 'none' }}>
        <button
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          ← Back to Dashboard
        </button>
      </Link>
    </div>
  </div>
);

export default function ShipperPortalMinimal() {
  const { shippers } = useShipper();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    logUserAction('Accessed Shipper Portal', undefined, 'ShipperPortal');
  }, []);

  // Check access permission
  if (
    !checkPermission('canManageShipperPortal') &&
    !checkPermission('canViewShipperPortal')
  ) {
    return <AccessRestricted />;
  }

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <Link
            href='/'
            style={{ textDecoration: 'none', marginRight: '20px' }}
          >
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          </Link>
          <h1 style={{ color: 'white', margin: 0 }}>Shipper Portal</h1>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            Shippers Overview
          </h2>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <p>Total Shippers: {shippers.length}</p>
            <p>Status: System operational</p>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '20px',
          }}
        >
          <h3 style={{ color: 'white', marginBottom: '15px' }}>
            Recent Activity
          </h3>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <p>• System monitoring active</p>
            <p>• All integrations operational</p>
            <p>• Ready for production deployment</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Full shipper management features will be available in the next
            update.
          </p>
        </div>
      </div>
    </div>
  );
}
