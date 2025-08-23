'use client';

import React from 'react';
import CRMDashboard from './CRMDashboard';
import CRMPhoneIntegrationWidget from './CRMPhoneIntegrationWidget';
import CallFlowManager from './CallFlowManager';
import FloatingDialerWidget from './FloatingDialerWidget';
import { FreeSWITCHCallCenterDashboard } from './FreeSWITCHCallCenterDashboard';
import PhoneConnectionSetup from './PhoneConnectionSetup';
import SimplePhoneDialer from './SimplePhoneDialer';

interface FleetFlowCommunicationsHubProps {
  user?: any;
  onClose?: () => void;
  showCloseButton?: boolean;
}

/**
 * FleetFlow Communications Hub
 * Enterprise Voice Operations & CRM Integration Platform
 *
 * This is the comprehensive phone system for the entire FleetFlow application,
 * featuring:
 * - RingCentral-style call center operations
 * - Full CRM integration with lead management
 * - FreeSWITCH-powered call routing and monitoring
 * - Real-time phone-to-CRM data sync
 * - Floating dialer widget for quick access
 */
export default function FleetFlowCommunicationsHub({
  user,
  onClose,
  showCloseButton = false,
}: FleetFlowCommunicationsHubProps) {
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'callflow' | 'crm' | 'callcenter' | 'dialer' | 'setup'
  >('overview');

  return (
    <div style={{ marginBottom: '30px' }}>
      {/* Main Communications Hub Container */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              📞 FleetFlow Communications Hub
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                margin: '5px 0 0 0',
              }}
            >
              Enterprise Voice Operations & CRM Integration Platform
            </p>
          </div>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ← Close Communications Hub
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '12px',
          }}
        >
          {[
            { key: 'overview', label: '📊 Overview', icon: '📊' },
            { key: 'callflow', label: '📞 Call Flow', icon: '📞' },
            { key: 'crm', label: '👥 CRM', icon: '👥' },
            { key: 'callcenter', label: '🏢 Call Center', icon: '🏢' },
            { key: 'dialer', label: '☎️ Dialer', icon: '☎️' },
            { key: 'setup', label: '🔧 Phone Setup', icon: '🔧' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background:
                  activeTab === tab.key
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  activeTab === tab.key
                    ? '1px solid rgba(59, 130, 246, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '10px 16px',
                color:
                  activeTab === tab.key
                    ? '#60a5fa'
                    : 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* System Status & Integration Overview */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }}
            />
            <span
              style={{ color: '#22c55e', fontSize: '14px', fontWeight: '500' }}
            >
              ✅ System Online • FreeSWITCH Connected • CRM Integration Active •
              12 Agents Available
            </span>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* CRM Integration Status Widget */}
            <div style={{ marginBottom: '20px' }}>
              <CRMPhoneIntegrationWidget />
            </div>

            {/* Two-Column Layout: CRM Dashboard + Call Center */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px',
              }}
            >
              {/* Left: CRM Lead Management */}
              <div>
                <div
                  style={{
                    background: 'rgba(219, 39, 119, 0.1)',
                    border: '1px solid rgba(219, 39, 119, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '15px',
                  }}
                >
                  <h3
                    style={{
                      color: '#ec4899',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0',
                    }}
                  >
                    🎯 CRM Lead Management
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    AI-powered lead tracking with phone call integration
                  </p>
                </div>
                <CRMDashboard />
              </div>

              {/* Right: Call Center Operations */}
              <div>
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '15px',
                  }}
                >
                  <h3
                    style={{
                      color: '#22c55e',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0',
                    }}
                  >
                    📞 Call Center Operations
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    FreeSWITCH-powered call routing and agent management
                  </p>
                </div>
                <FreeSWITCHCallCenterDashboard />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'callflow' && (
          <div>
            <CallFlowManager user={user} />
          </div>
        )}

        {activeTab === 'crm' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <CRMPhoneIntegrationWidget />
            </div>
            <CRMDashboard />
          </div>
        )}

        {activeTab === 'callcenter' && (
          <div>
            <FreeSWITCHCallCenterDashboard />
          </div>
        )}

        {activeTab === 'dialer' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '15px',
                }}
              >
                <h3
                  style={{
                    color: '#22c55e',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: '0 0 8px 0',
                  }}
                >
                  ☎️ FleetFlow Phone Dialer
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  Make calls directly from FleetFlow with automatic call logging
                  and CRM integration
                </p>
              </div>

              {/* Centered, Contained Dialer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '20px 0',
                }}
              >
                <div
                  style={{
                    maxWidth: '380px',
                    width: '100%',
                  }}
                >
                  <SimplePhoneDialer />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phone Setup Tab */}
        {activeTab === 'setup' && (
          <div>
            <PhoneConnectionSetup
              user={user}
              onSetupComplete={(setupData) => {
                console.log('Phone setup completed:', setupData);
                // In production, this would save the setup data
              }}
            />
          </div>
        )}

        {/* Quick Actions Bar */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            <strong style={{ color: '#3b82f6' }}>Quick Actions:</strong>
          </div>
          {[
            { label: '📞 Make Call', action: 'call' },
            { label: '📋 View Leads', action: 'leads' },
            { label: '📊 Call Reports', action: 'reports' },
            { label: '⚙️ Agent Settings', action: 'settings' },
          ].map((item, index) => (
            <button
              key={index}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '6px',
                color: '#3b82f6',
                padding: '8px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.color = '#3b82f6';
              }}
              onClick={() => {
                console.log(`Communications Hub action: ${item.action}`);
                // Add action handlers here
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Dialer Widget - Always Available */}
      <FloatingDialerWidget
        userRole={user?.role || 'User'}
        department={user?.departmentCode || 'GENERAL'}
        hasDialerAccess={true}
      />
    </div>
  );
}
