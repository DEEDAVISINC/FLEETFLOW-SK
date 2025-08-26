'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { checkPermission } from '../config/access';
import {
  CarrierPortalProfile,
  onboardingIntegration,
} from '../services/onboarding-integration';

const AccessRestricted = () => (
  <div
    style={{
      background: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}
  >
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px 32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '16px',
        }}
      >
        Access Restricted
      </h1>
      <p
        style={{
          color: '#6b7280',
          marginBottom: '16px',
          lineHeight: '1.6',
        }}
      >
        You need carrier portal management permissions to access this system.
      </p>
      <button
        onClick={() => window.history.back()}
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          border: 'none',
          fontWeight: '500',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Go Back
      </button>
    </div>
  </div>
);

const CarrierCard: React.FC<{
  carrier: CarrierPortalProfile;
  onClick: () => void;
}> = ({ carrier, onClick }) => {
  const getStatusColor = (status: CarrierPortalProfile['status']) => {
    switch (status) {
      case 'active':
        return '#059669';
      case 'suspended':
        return '#d97706';
      case 'under_review':
        return '#6b7280';
      case 'pending':
        return '#7c3aed';
      case 'inactive':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: CarrierPortalProfile['status']) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'suspended':
        return '⚠️';
      case 'under_review':
        return '🔍';
      case 'pending':
        return '⏳';
      case 'inactive':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 12px 40px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '12px',
        }}
      >
        <div>
          <h3
            style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '600',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            {carrier.companyName}
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <span>DOT: {carrier.dotNumber}</span>
            <span>MC: {carrier.mcNumber}</span>
          </div>
        </div>
        <span
          style={{
            background: getStatusColor(carrier.status),
            color: 'white',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {getStatusIcon(carrier.status)}{' '}
          {carrier.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Onboarding Progress (for non-active carriers) */}
      {carrier.status !== 'active' && (
        <div style={{ marginBottom: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
                fontWeight: '500',
              }}
            >
              Onboarding Progress
            </span>
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.7rem',
              }}
            >
              {Math.floor(Math.random() * 5) + 1}/5 Steps
            </span>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              height: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #10b981, #059669)',
                height: '100%',
                width: `${(Math.floor(Math.random() * 5) + 1) * 20}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          <div>Contact: {carrier.contactName}</div>
          <div style={{ marginTop: '2px' }}>Email: {carrier.contactEmail}</div>
        </div>
      </div>

      {/* Enhanced Status Indicators */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '6px',
          fontSize: '0.7rem',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            background: carrier.documentsUploaded
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
            padding: '4px 6px',
            borderRadius: '4px',
            color: carrier.documentsUploaded ? '#10b981' : '#ef4444',
            textAlign: 'center',
          }}
        >
          {carrier.documentsUploaded ? '✅' : '❌'} Documents
        </div>
        <div
          style={{
            background: carrier.insuranceVerified
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
            padding: '4px 6px',
            borderRadius: '4px',
            color: carrier.insuranceVerified ? '#10b981' : '#ef4444',
            textAlign: 'center',
          }}
        >
          {carrier.insuranceVerified ? '✅' : '❌'} Insurance
        </div>
        <div
          style={{
            background: carrier.agreementSigned
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
            padding: '4px 6px',
            borderRadius: '4px',
            color: carrier.agreementSigned ? '#10b981' : '#ef4444',
            textAlign: 'center',
          }}
        >
          {carrier.agreementSigned ? '✅' : '❌'} Agreement
        </div>
        <div
          style={{
            background: carrier.portalAccess
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
            padding: '4px 6px',
            borderRadius: '4px',
            color: carrier.portalAccess ? '#10b981' : '#ef4444',
            textAlign: 'center',
          }}
        >
          {carrier.portalAccess ? '✅' : '❌'} Portal
        </div>
      </div>

      {/* Factoring & Additional Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.7)',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <span>🏦 {Math.random() > 0.5 ? 'TBS Factoring' : 'Apex Capital'}</span>
        <span>👥 {Math.floor(Math.random() * 10) + 1} Drivers</span>
      </div>
    </div>
  );
};

export default function EnhancedCarrierPortal() {
  // Check access permission
  if (!checkPermission('canManageCarrierPortal')) {
    return <AccessRestricted />;
  }

  const [activeView, setActiveView] = useState<
    'dashboard' | 'onboarding' | 'analytics'
  >('dashboard');
  const [carriers, setCarriers] = useState<CarrierPortalProfile[]>([]);
  const [selectedCarrier, setSelectedCarrier] =
    useState<CarrierPortalProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive' | 'pending' | 'suspended' | 'under_review'
  >('all');

  useEffect(() => {
    // Load all carriers from the integration service
    const allCarriers = onboardingIntegration.getAllCarriers();
    setCarriers(allCarriers);
  }, []);

  const filteredCarriers = carriers.filter((carrier) => {
    const matchesSearch =
      !searchTerm ||
      carrier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.mcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.dotNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || carrier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCarrierClick = (carrier: CarrierPortalProfile) => {
    setSelectedCarrier(carrier);
    setShowDetailModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedCarrier(null);
    setShowDetailModal(false);
  };

  const getStatusCounts = () => {
    const onboardingPipeline = carriers.filter(
      (c) => c.status === 'pending' || c.status === 'under_review'
    ).length;
    const averageCompletionTime = 12; // Mock: days to complete onboarding
    const complianceRate = Math.round(
      (carriers.filter((c) => c.documentsUploaded && c.insuranceVerified)
        .length /
        carriers.length) *
        100
    );
    const portalAdoption = Math.round(
      (carriers.filter((c) => c.portalAccess).length /
        carriers.filter((c) => c.status === 'active').length) *
        100
    );

    return {
      total: carriers.length,
      active: carriers.filter((c) => c.status === 'active').length,
      underReview: carriers.filter((c) => c.status === 'under_review').length,
      portalEnabled: carriers.filter((c) => c.portalAccess).length,
      onboardingPipeline,
      averageCompletionTime,
      complianceRate,
      portalAdoption,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
        radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>🚚</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Enhanced Carrier Portal
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 8px 0',
                  }}
                >
                  Comprehensive carrier management with workflow tracking &
                  analytics
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Live Onboarding Active
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <Link href='/onboarding/carrier-onboarding/new'>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                + New Carrier
              </button>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'dashboard', label: '📊 Overview', icon: '📊' },
              { id: 'onboarding', label: '🚀 Onboarding', icon: '🚀' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  background:
                    activeView === tab.id
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.2)',
                  color: activeView === tab.id ? '#4c1d95' : 'white',
                  transform:
                    activeView === tab.id
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                  boxShadow:
                    activeView === tab.id
                      ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                      : 'none',
                }}
                onMouseOver={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Total Carriers
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {statusCounts.total}
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      All registered
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>🏢</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Active Carriers
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {statusCounts.active}
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      Currently active
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>✅</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      In Pipeline
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {statusCounts.onboardingPipeline}
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      Onboarding
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(245, 158, 11, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>⏳</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Avg. Completion
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {statusCounts.averageCompletionTime}d
                    </p>
                    <p
                      style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}
                    >
                      Days to complete
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>📊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Onboarding Pipeline Progress */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 24px 0',
                }}
              >
                🔄 Onboarding Pipeline Progress
              </h2>

              {/* Mock onboarding pipeline data */}
              {(() => {
                const pipelineCarriers = [
                  {
                    id: 'pipeline-1',
                    name: 'Swift Logistics LLC',
                    mcNumber: 'MC-789456',
                    currentStep: 2,
                    steps: [
                      'FMCSA',
                      'Documents',
                      'Factoring',
                      'Agreements',
                      'Portal',
                    ],
                    startDate: '2024-12-18',
                    estimatedCompletion: '2024-12-30',
                  },
                  {
                    id: 'pipeline-2',
                    name: 'Prime Transport Inc',
                    mcNumber: 'MC-456789',
                    currentStep: 4,
                    steps: [
                      'FMCSA',
                      'Documents',
                      'Factoring',
                      'Agreements',
                      'Portal',
                    ],
                    startDate: '2024-12-15',
                    estimatedCompletion: '2024-12-27',
                  },
                  {
                    id: 'pipeline-3',
                    name: 'Elite Freight Solutions',
                    mcNumber: 'MC-123987',
                    currentStep: 1,
                    steps: [
                      'FMCSA',
                      'Documents',
                      'Factoring',
                      'Agreements',
                      'Portal',
                    ],
                    startDate: '2024-12-20',
                    estimatedCompletion: '2025-01-02',
                  },
                ];

                return pipelineCarriers.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {pipelineCarriers.map((carrier) => (
                      <div
                        key={carrier.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '600',
                                margin: '0 0 4px 0',
                              }}
                            >
                              {carrier.name}
                            </h3>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.8rem',
                                margin: 0,
                              }}
                            >
                              {carrier.mcNumber} • Started {carrier.startDate} •
                              Est. {carrier.estimatedCompletion}
                            </p>
                          </div>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.3)',
                              color: '#60a5fa',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                            }}
                          >
                            Step {carrier.currentStep + 1}/5
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '4px',
                            marginBottom: '8px',
                          }}
                        >
                          {carrier.steps.map((step, index) => (
                            <div
                              key={index}
                              style={{
                                flex: 1,
                                height: '6px',
                                borderRadius: '3px',
                                background:
                                  index <= carrier.currentStep
                                    ? 'linear-gradient(90deg, #10b981, #059669)'
                                    : 'rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease',
                              }}
                            />
                          ))}
                        </div>

                        {/* Step Labels */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.7rem',
                          }}
                        >
                          {carrier.steps.map((step, index) => (
                            <span
                              key={index}
                              style={{
                                color:
                                  index <= carrier.currentStep
                                    ? '#10b981'
                                    : 'rgba(255, 255, 255, 0.6)',
                                fontWeight:
                                  index === carrier.currentStep ? '600' : '400',
                              }}
                            >
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      padding: '20px',
                    }}
                  >
                    No carriers currently in the onboarding pipeline
                  </div>
                );
              })()}
            </div>

            {/* Document Compliance Dashboard */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 24px 0',
                }}
              >
                📄 Document Compliance Dashboard
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {/* Document Categories */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#10b981',
                      marginBottom: '8px',
                    }}
                  >
                    85%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Insurance Complete
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      marginBottom: '8px',
                    }}
                  >
                    92%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Legal/Regulatory
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      marginBottom: '8px',
                    }}
                  >
                    78%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Financial Forms
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#ef4444',
                      marginBottom: '8px',
                    }}
                  >
                    3
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Expiring Soon
                  </div>
                </div>
              </div>

              {/* Document Expiration Alerts */}
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <h3
                  style={{
                    color: '#fca5a5',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: '0 0 12px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  ⚠️ Document Expiration Alerts
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {[
                    {
                      carrier: 'Swift Logistics LLC',
                      doc: 'Auto Liability Insurance',
                      expires: '2024-12-30',
                    },
                    {
                      carrier: 'Prime Transport Inc',
                      doc: 'Cargo Insurance',
                      expires: '2025-01-05',
                    },
                    {
                      carrier: 'Elite Freight Solutions',
                      doc: 'Certificate of Insurance',
                      expires: '2025-01-10',
                    },
                  ].map((alert, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '8px 0',
                      }}
                    >
                      <span>
                        {alert.carrier} - {alert.doc}
                      </span>
                      <span
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                        }}
                      >
                        Expires {alert.expires}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Carriers */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  Recent Carrier Activity
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type='text'
                    placeholder='Search carriers...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {filteredCarriers.slice(0, 5).map((carrier) => (
                  <div
                    key={carrier.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleCarrierClick(carrier)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px',
                        }}
                      >
                        {carrier.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                          }}
                        >
                          {carrier.companyName}
                        </h3>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          MC: {carrier.mcNumber} • DOT: {carrier.dotNumber}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {carrier.documentsUploaded ? '✅' : '❌'}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Documents
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {carrier.insuranceVerified ? '✅' : '❌'}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Insurance
                        </p>
                      </div>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background:
                            carrier.status === 'active'
                              ? 'rgba(74, 222, 128, 0.2)'
                              : carrier.status === 'pending'
                                ? 'rgba(251, 191, 36, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                          color:
                            carrier.status === 'active'
                              ? '#4ade80'
                              : carrier.status === 'pending'
                                ? '#fbbf24'
                                : '#ef4444',
                          border: `1px solid ${
                            carrier.status === 'active'
                              ? '#4ade80'
                              : carrier.status === 'pending'
                                ? '#fbbf24'
                                : '#ef4444'
                          }`,
                        }}
                      >
                        {carrier.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Actions Panel */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 24px 0',
                }}
              >
                ⚡ Quick Workflow Actions
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                <Link
                  href='/onboarding/carrier-onboarding/new'
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🚀</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        Start New Onboarding
                      </div>
                      <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                        Begin carrier verification workflow
                      </div>
                    </div>
                  </button>
                </Link>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📊</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      FMCSA Bulk Lookup
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                      Verify multiple carriers
                    </div>
                  </div>
                </button>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(245, 158, 11, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📄</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      Document Review Queue
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                      Pending approvals ({statusCounts.underReview})
                    </div>
                  </div>
                </button>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(139, 92, 246, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📝</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      Generate Agreements
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                      Bulk contract creation
                    </div>
                  </div>
                </button>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(6, 182, 212, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(6, 182, 212, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>👤</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      Portal Setup Assistant
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                      Configure driver access
                    </div>
                  </div>
                </button>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🏦</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      Factoring Integration
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                      Payment processing status
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding View */}
        {activeView === 'onboarding' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                🚀 Carrier Onboarding Center
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Streamlined workflow for carrier verification and portal setup
              </p>
            </div>
            <div style={{ padding: '24px' }}>
              {/* Search and Filter */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type='text'
                  placeholder='Search by company name, MC, or DOT number...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '300px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='all'>All Status</option>
                  <option value='active'>Active</option>
                  <option value='pending'>Pending</option>
                  <option value='inactive'>Inactive</option>
                  <option value='suspended'>Suspended</option>
                  <option value='under_review'>Under Review</option>
                </select>
              </div>

              {/* Carriers Grid */}
              {filteredCarriers.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {filteredCarriers.map((carrier) => (
                    <CarrierCard
                      key={carrier.id}
                      carrier={carrier}
                      onClick={() => handleCarrierClick(carrier)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📋
                  </div>
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: '0 0 12px 0',
                    }}
                  >
                    No Carriers Found
                  </h3>
                  <p style={{ marginBottom: '24px' }}>
                    {searchTerm || statusFilter !== 'all'
                      ? 'No carriers match your search criteria.'
                      : 'No carriers have been onboarded yet.'}
                  </p>
                  <Link href='/onboarding/carrier-onboarding/new'>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Start Carrier Onboarding
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: '0 0 8px 0',
                    }}
                  >
                    📊 Carrier Performance Analytics
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Deep insights into your carrier onboarding and management
                    performance
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Export Report
                  </button>
                  <button
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Date Range
                  </button>
                </div>
              </div>

              {/* Performance Charts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '32px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    📈 Onboarding Trends
                  </h3>
                  <div
                    style={{
                      height: '200px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        📈
                      </div>
                      <p style={{ color: 'white', margin: '0 0 8px 0' }}>
                        Onboarding efficiency improving
                      </p>
                      <p
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#10b981',
                          margin: '0 0 4px 0',
                        }}
                      >
                        +18%
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        vs last quarter
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: 'white',
                      marginBottom: '16px',
                    }}
                  >
                    🎯 Compliance Rate
                  </h3>
                  <div
                    style={{
                      height: '200px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🎯
                      </div>
                      <p style={{ color: 'white', margin: '0 0 8px 0' }}>
                        DOT compliance rate
                      </p>
                      <p
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                          margin: '0 0 4px 0',
                        }}
                      >
                        94%
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        Industry leading
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    🚚
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: 'white',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Carriers Onboarded
                  </h3>
                  <p
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#10b981',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {statusCounts.total}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                      fontSize: '12px',
                    }}
                  >
                    Total
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    ⏱️
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: 'white',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Avg. Time
                  </h3>
                  <p
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {statusCounts.averageCompletionTime}d
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                      fontSize: '12px',
                    }}
                  >
                    To complete
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    💻
                  </div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: 'white',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Portal Adoption
                  </h3>
                  <p
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {statusCounts.portalAdoption}%
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                      fontSize: '12px',
                    }}
                  >
                    Active users
                  </p>
                </div>
              </div>

              {/* Performance Insights */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  🎯 Key Insights & Recommendations
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    />
                    <p style={{ color: 'white', margin: 0, lineHeight: '1.5' }}>
                      <strong>High Performance:</strong> Onboarding completion
                      rate has improved by 18% this quarter through workflow
                      optimization.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#fbbf24',
                        borderRadius: '50%',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    />
                    <p style={{ color: 'white', margin: 0, lineHeight: '1.5' }}>
                      <strong>Opportunity:</strong> Document upload process can
                      be streamlined to reduce average completion time by 2-3
                      days.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    />
                    <p style={{ color: 'white', margin: 0, lineHeight: '1.5' }}>
                      <strong>Trend:</strong> Portal adoption rate increased by
                      12% with the new mobile-friendly interface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Carrier Modal */}
      {showDetailModal && selectedCarrier && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #022c22, #044e46)',
              borderRadius: '20px',
              padding: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                  }}
                >
                  {selectedCarrier.companyName}
                </h2>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    margin: 0,
                  }}
                >
                  DOT: {selectedCarrier.dotNumber} • MC:{' '}
                  {selectedCarrier.mcNumber}
                </p>
              </div>
              <button
                onClick={handleCloseDetails}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                ✕
              </button>
            </div>

            {/* Onboarding Workflow Progress */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                }}
              >
                🔄 Onboarding Workflow Progress
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                }}
              >
                {[
                  'FMCSA',
                  'Documents',
                  'Factoring',
                  'Agreements',
                  'Portal',
                ].map((step, index) => {
                  const isCompleted =
                    selectedCarrier.status === 'active' || Math.random() > 0.3;
                  const isCurrent = !isCompleted && index === 2; // Mock current step
                  return (
                    <div
                      key={step}
                      style={{
                        background: isCompleted
                          ? 'rgba(16, 185, 129, 0.3)'
                          : isCurrent
                            ? 'rgba(59, 130, 246, 0.3)'
                            : 'rgba(255, 255, 255, 0.1)',
                        border: `2px solid ${
                          isCompleted
                            ? 'rgba(16, 185, 129, 0.5)'
                            : isCurrent
                              ? 'rgba(59, 130, 246, 0.5)'
                              : 'rgba(255, 255, 255, 0.2)'
                        }`,
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                        {isCompleted ? '✅' : isCurrent ? '🔄' : '⏳'}
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                        }}
                      >
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document Status Details */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                }}
              >
                📄 Document Status
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {[
                  {
                    name: 'Certificate of Insurance',
                    status: selectedCarrier.insuranceVerified,
                    expires: '2025-06-15',
                  },
                  {
                    name: 'Auto Liability Insurance',
                    status: selectedCarrier.insuranceVerified,
                    expires: '2025-06-15',
                  },
                  {
                    name: 'Cargo Insurance',
                    status: selectedCarrier.insuranceVerified,
                    expires: '2025-06-15',
                  },
                  {
                    name: 'W-9 Tax Form',
                    status: selectedCarrier.documentsUploaded,
                    expires: 'N/A',
                  },
                  {
                    name: 'MC Authority Letter',
                    status: selectedCarrier.documentsUploaded,
                    expires: 'N/A',
                  },
                ].map((doc, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span style={{ color: 'white' }}>
                      {doc.status ? '✅' : '❌'} {doc.name}
                    </span>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {doc.expires !== 'N/A'
                        ? `Expires: ${doc.expires}`
                        : doc.expires}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                }}
              >
                ⚡ Quick Actions
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px',
                }}
              >
                {[
                  { label: '📧 Send Reminder', color: '#3b82f6' },
                  { label: '📄 Request Documents', color: '#f59e0b' },
                  { label: '📝 Update Status', color: '#8b5cf6' },
                  { label: '🚀 Complete Onboarding', color: '#10b981' },
                ].map((action, index) => (
                  <button
                    key={index}
                    style={{
                      background: action.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
