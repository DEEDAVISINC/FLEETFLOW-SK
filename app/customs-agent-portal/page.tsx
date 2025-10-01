'use client';

import { useState } from 'react';
import FreightForwarderDashboardGuide from '../components/FreightForwarderDashboardGuide';

export default function CustomsAgentPortalPage() {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '30px',
        paddingTop: '100px',
        color: 'white',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Dashboard Guide */}
      <FreightForwarderDashboardGuide onStepClick={handleTabClick} />

      {/* Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient top border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background:
              'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            🚢
          </div>
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '800',
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Customs Agent Portal
            </h1>
            <p style={{ margin: '0', color: 'rgba(255,255,255,0.8)' }}>
              ABC Shipping Corporation
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ margin: '0 0 4px 0', color: 'rgba(255,255,255,0.7)' }}>
              Welcome back, Demo Customs Agent
            </p>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Powered by Flow Forward Logistics
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{ fontSize: '18px', fontWeight: '600', color: '#06b6d4' }}
            >
              Customs Agent
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Portal Access Level
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'dashboard', label: '🏠 Dashboard', color: '#06b6d4' },
            { id: 'shipments', label: '📦 Shipments', color: '#059669' },
            { id: 'documents', label: '📄 Documents', color: '#dc2626' },
            { id: 'communication', label: '💬 Messages', color: '#7c3aed' },
            { id: 'reports', label: '📊 Reports', color: '#ea580c' },
          ].map((tab) => (
            <button
              key={tab.id}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: tab.color,
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'all 0.2s',
                boxShadow: `0 0 20px ${tab.color}40`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          minHeight: '600px',
        }}
      >
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚢</div>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 16px 0',
              color: '#06b6d4',
            }}
          >
            Customs Agent Portal
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 32px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Professional customs clearance and documentation management system.
            Track shipments, upload documents, and communicate with your freight
            forwarder.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Shipment Tracking
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>
                Real-time tracking of all your shipments with detailed status
                updates
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Document Management
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>
                Upload and manage customs documentation securely
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Direct Communication
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>
                Instant messaging with your freight forwarding team
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Compliance Analytics
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>
                Track compliance status and customs clearance progress
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
