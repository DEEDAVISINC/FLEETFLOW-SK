'use client';

import {
  getDialerAccess,
  getDialerAccessColors,
  getDialerAccessDescription,
  toggleDialerAccess,
} from '../utils/dialerAccess';

interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  role: string;
  status: string;
  lastLogin: string;
  permissions: string[];
  createdDate: string;
}

interface DialerAccessManagementProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export default function DialerAccessManagement({
  user,
  onUpdateUser,
}: DialerAccessManagementProps) {
  const accessLevel = getDialerAccess(user);
  const description = getDialerAccessDescription(user);
  const colors = getDialerAccessColors(user);

  const handleToggleAccess = (enabled: boolean) => {
    const updatedPermissions = toggleDialerAccess(user, enabled);
    const updatedUser = {
      ...user,
      permissions: updatedPermissions,
    };
    onUpdateUser(updatedUser);
  };

  return (
    <div
      style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        border: '2px solid #e2e8f0',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '24px' }}>📞</span>
        <h4
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0,
          }}
        >
          Phone Dialer Access
        </h4>
      </div>

      {/* Access Status Display */}
      <div
        style={{
          background: colors.background,
          color: colors.color,
          padding: '12px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>{colors.icon}</span>
        {description}
      </div>

      {/* Toggle for Optional Access (Dispatchers & Brokers) */}
      {(accessLevel === 'enabled' || accessLevel === 'disabled') && (
        <div style={{ marginBottom: '12px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={accessLevel === 'enabled'}
              onChange={(e) => handleToggleAccess(e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            Enable Phone Dialer Access
          </label>
        </div>
      )}

      {/* Role-based Information */}
      <div
        style={{
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.5',
          background: '#f9fafb',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
        }}
      >
        <strong>Access Rules:</strong>
        <br />• <strong>Customer Service & Sales:</strong> Always enabled
        (required for role)
        <br />• <strong>Dispatchers & Brokers:</strong> Optional (can be
        enabled/disabled)
        <br />• <strong>Drivers:</strong> Never enabled (restricted for safety)
        <br />
        <br />
        <strong>Current Role:</strong> {user.role} ({user.department})<br />
        <strong>Access Level:</strong> {accessLevel.toUpperCase()}
      </div>

      {/* Test Dialer Button (if enabled) */}
      {(accessLevel === 'required' || accessLevel === 'enabled') && (
        <button
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          📞 Test Dialer Access
        </button>
      )}
    </div>
  );
}
