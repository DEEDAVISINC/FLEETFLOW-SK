// Access Verification Loading Component
// Shows while verifying manager access permissions

import React from 'react';

const AccessVerificationLoading: React.FC = () => {
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
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        {/* Animated Lock Icon */}
        <div
          style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: 'pulse 2s infinite',
          }}
        >
          🔐
        </div>

        {/* Loading Heading */}
        <h2
          style={{
            color: 'white',
            marginBottom: '16px',
            fontSize: '24px',
            fontWeight: '600',
          }}
        >
          Verifying Access Permissions
        </h2>

        {/* Loading Description */}
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '30px',
            fontSize: '16px',
            lineHeight: '1.5',
          }}
        >
          Checking your manager credentials and company access permissions...
        </p>

        {/* Loading Spinner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#3b82f6',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.32s',
            }}
          ></div>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#3b82f6',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.16s',
            }}
          ></div>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#3b82f6',
              animation: 'bounce 1.4s infinite ease-in-out both',
            }}
          ></div>
        </div>

        {/* Security Notice */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '20px',
          }}
        >
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              fontSize: '14px',
            }}
          >
            <strong style={{ color: '#3b82f6' }}>🔒 Secure Access:</strong>{' '}
            Company payment and financial management features require
            manager-level verification
          </p>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }

          @keyframes bounce {
            0%,
            80%,
            100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AccessVerificationLoading;
