// Manager-Only Access Denied Component
// Shows when non-managers try to access company payment/financial functions

import Link from 'next/link';
import React from 'react';

interface ManagerOnlyAccessDeniedProps {
  attemptedResource?: string;
  userRole?: string;
  redirectPath?: string;
}

const ManagerOnlyAccessDenied: React.FC<ManagerOnlyAccessDeniedProps> = ({
  attemptedResource = 'company payment management',
  userRole = 'broker agent',
  redirectPath = '/broker/dashboard',
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {/* Lock Icon */}
        <div
          style={{
            fontSize: '64px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))',
          }}
        >
          🔒
        </div>

        {/* Main Heading */}
        <h1
          style={{
            color: '#ef4444',
            marginBottom: '16px',
            fontSize: '28px',
            fontWeight: '700',
          }}
        >
          Manager Access Required
        </h1>

        {/* Description */}
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '24px',
            fontSize: '16px',
            lineHeight: '1.6',
          }}
        >
          Access to{' '}
          <strong style={{ color: '#fbbf24' }}>{attemptedResource}</strong> is
          restricted to company managers only.{' '}
          {userRole === 'broker agent' ? 'Broker agents' : 'Users'} do not have
          permission to access these financial management features.
        </p>

        {/* Security Notice */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '8px' }}>⚠️</span>
            <strong style={{ color: '#ef4444', fontSize: '16px' }}>
              Security Notice
            </strong>
          </div>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            Company payment routing, billing management, and agent commission
            oversight require manager-level authorization to ensure compliance,
            prevent unauthorized access, and maintain proper corporate
            governance.
          </p>
        </div>

        {/* Access Requirements */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
          }}
        >
          <h3
            style={{
              color: '#3b82f6',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            👔 Required Access Level
          </h3>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              ✅ <strong>Role:</strong> Manager
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              ✅ <strong>Department:</strong> MGR (Management)
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
              }}
            >
              ✅ <strong>Permission Level:</strong> Company Manager
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href={redirectPath}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🏠</span>
            Return to Dashboard
          </Link>

          <Link
            href='/settings'
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.9)',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>⚙️</span>
            Account Settings
          </Link>
        </div>

        {/* Contact Support */}
        <div
          style={{
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              margin: 0,
            }}
          >
            Need manager access? Contact your system administrator or
            <Link
              href='/support'
              style={{
                color: '#fbbf24',
                textDecoration: 'none',
                marginLeft: '4px',
              }}
            >
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerOnlyAccessDenied;
