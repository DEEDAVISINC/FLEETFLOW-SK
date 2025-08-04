'use client';

import { useState } from 'react';
import CyberSecurityProtocolsWidget from '../components/CyberSecurityProtocolsWidget';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('security');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          🔐 Security & Settings
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '18px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Comprehensive security management and system configuration for
          FleetFlow
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {[
            { id: 'security', label: 'Security Protocols', icon: '🛡️' },
            { id: 'settings', label: 'System Settings', icon: '⚙️' },
            { id: 'permissions', label: 'User Permissions', icon: '👥' },
            { id: 'audit', label: 'Audit Logs', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
                background:
                  activeTab === tab.id
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.2)',
                color: activeTab === tab.id ? '#4c1d95' : 'white',
                transform:
                  activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:
                  activeTab === tab.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                    : 'none',
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Security Protocols Tab */}
        {activeTab === 'security' && <CyberSecurityProtocolsWidget />}

        {/* System Settings Tab */}
        {activeTab === 'settings' && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚙️</div>
            <h3
              style={{
                color: 'white',
                marginBottom: '16px',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              System Settings
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              System configuration and preferences will be available here.
              <br />
              Coming soon with advanced configuration options.
            </p>
          </div>
        )}

        {/* User Permissions Tab */}
        {activeTab === 'permissions' && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>👥</div>
            <h3
              style={{
                color: 'white',
                marginBottom: '16px',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              User Permissions
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              Role-based access control and user permission management.
              <br />
              Advanced permission settings coming soon.
            </p>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
            <h3
              style={{
                color: 'white',
                marginBottom: '16px',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              Audit Logs
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              Comprehensive audit trail and system activity logs.
              <br />
              Detailed logging and monitoring features coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
