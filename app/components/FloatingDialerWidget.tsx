'use client';

import { useState } from 'react';
import SimplePhoneDialer from './SimplePhoneDialer';

interface FloatingDialerWidgetProps {
  userRole?: string;
  department?: string;
  hasDialerAccess?: boolean;
}

export default function FloatingDialerWidget({
  userRole = '',
  department = '',
  hasDialerAccess = false,
}: FloatingDialerWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Role-based access control
  const isCustomerService =
    department === 'CS' || userRole === 'Customer Service';
  const isSales = department === 'SALES' || userRole === 'Sales';
  const isDispatcher = department === 'DC' || userRole === 'Dispatcher';
  const isBroker = department === 'BB' || userRole === 'Broker';
  const isDriver = department === 'DM' || userRole === 'Driver';

  // Access logic
  const hasRequiredAccess = isCustomerService || isSales; // Always have access
  const hasOptionalAccess = (isDispatcher || isBroker) && hasDialerAccess; // Optional access
  const hasNoAccess = isDriver; // Never have access

  // Don't render if no access
  if (hasNoAccess || (!hasRequiredAccess && !hasOptionalAccess)) {
    return null;
  }

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          color: 'white',
          fontSize: '24px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow =
            '0 12px 32px rgba(34, 197, 94, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';
        }}
        title={`Phone Dialer - ${hasRequiredAccess ? 'Required' : 'Enabled'} for ${userRole}`}
      >
        📞
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: isMinimized ? '60px' : '320px',
        height: isMinimized ? '60px' : '500px',
        background: 'rgba(30, 58, 138, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            display: isMinimized ? 'none' : 'block',
          }}
        >
          📞 {userRole} Dialer
          {hasRequiredAccess && (
            <span
              style={{
                fontSize: '10px',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '8px',
              }}
            >
              REQUIRED
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: '#f59e0b',
              fontSize: '12px',
              cursor: 'pointer',
            }}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '📞' : '−'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: '#ef4444',
              fontSize: '12px',
              cursor: 'pointer',
            }}
            title='Close'
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div
          style={{
            padding: '16px',
            height: 'calc(100% - 60px)',
            overflowY: 'auto',
          }}
        >
          <SimplePhoneDialer />
        </div>
      )}
    </div>
  );
}
