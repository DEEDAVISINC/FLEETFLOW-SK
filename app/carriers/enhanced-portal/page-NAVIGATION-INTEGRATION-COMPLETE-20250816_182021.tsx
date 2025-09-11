'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CarrierInvitationManager from '../../components/CarrierInvitationManager';
import EnhancedNewCarrierButton from '../../components/EnhancedNewCarrierButton';
import CarrierInvitationService from '../../services/CarrierInvitationService';
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

// Invitation Landing Page Component
const InvitationLandingPage: React.FC<{
  invitationData: {
    ref?: string;
    carrier?: string;
    mc?: string;
    dot?: string;
    email?: string;
    inviter?: string;
  };
  onProceedToOnboarding: () => void;
  onReturnToPortal: () => void;
}> = ({ invitationData, onProceedToOnboarding, onReturnToPortal }) => {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '60px 40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {/* Welcome Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚛</div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            Welcome to FleetFlow!
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.2rem',
              lineHeight: '1.6',
              marginBottom: '8px',
            }}
          >
            You've been invited to join our carrier network
          </p>
          {invitationData.inviter && (
            <p
              style={{
                color: '#14b8a6',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              Invited by: {decodeURIComponent(invitationData.inviter)}
            </p>
          )}
        </div>

        {/* Carrier Information */}
        {(invitationData.carrier ||
          invitationData.mc ||
          invitationData.dot) && (
          <div
            style={{
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h3
              style={{
                color: '#14b8a6',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              📋 Your Information
            </h3>
            <div style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
              {invitationData.carrier && (
                <div style={{ color: 'white', fontSize: '1rem' }}>
                  <strong>Company:</strong>{' '}
                  {decodeURIComponent(invitationData.carrier)}
                </div>
              )}
              {invitationData.mc && (
                <div style={{ color: 'white', fontSize: '1rem' }}>
                  <strong>MC Number:</strong> {invitationData.mc}
                </div>
              )}
              {invitationData.dot && (
                <div style={{ color: 'white', fontSize: '1rem' }}>
                  <strong>DOT Number:</strong> {invitationData.dot}
                </div>
              )}
              {invitationData.email && (
                <div style={{ color: 'white', fontSize: '1rem' }}>
                  <strong>Email:</strong>{' '}
                  {decodeURIComponent(invitationData.email)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Driver OTR Flow Benefits */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            🚛 Access to Driver OTR Flow Portal
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>📱</span> Complete mobile driver workflow management
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>📄</span> Digital document management and BOL processing
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🤝</span> Professional broker relationships and load
              assignments
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>💰</span> Competitive rates and automated settlement
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>📊</span> Real-time performance tracking and analytics
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
          <button
            onClick={onProceedToOnboarding}
            style={{
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '200px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 12px 30px rgba(20, 184, 166, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🚀 Start Onboarding
          </button>

          <button
            onClick={onReturnToPortal}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '200px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📊 View Portal
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            Questions? Contact us at support@fleetflowapp.com
          </p>
        </div>
      </div>
    </div>
  );
};

// 6-Step Onboarding Process Configuration
const ONBOARDING_STEPS = [
  {
    id: 'fmcsa_verification',
    title: 'FMCSA Verification',
    subtitle: 'DOT/MC Authority Validation',
    description:
      'Real-time verification of carrier authority, safety ratings, and operational compliance through FMCSA integration',
    icon: '🏛️',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    metrics: [
      'DOT Number Validation',
      'MC Authority Verification',
      'Safety Rating Check',
      'Operating Authority Status',
    ],
    avgDuration: '15 minutes',
    automationLevel: '95%',
  },
  {
    id: 'travel_limits',
    title: 'Service Configuration',
    subtitle: 'Travel Limits & Commodities',
    description:
      'Configure service areas, equipment capabilities, commodity restrictions, and operational parameters',
    icon: '🗺️',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
    metrics: [
      'Service States/Regions',
      'Equipment Types',
      'Commodity Classes',
      'Radius Limitations',
    ],
    avgDuration: '25 minutes',
    automationLevel: '78%',
  },
  {
    id: 'document_verification',
    title: 'Document Intelligence',
    subtitle: 'AI-Powered Document Processing',
    description:
      'Advanced OCR and AI verification of insurance certificates, tax forms, and regulatory documents',
    icon: '🤖',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    metrics: [
      'Insurance Certificates',
      'W-9 Tax Forms',
      'Operating Authority',
      'ELD Compliance',
    ],
    avgDuration: '35 minutes',
    automationLevel: '87%',
  },
  {
    id: 'factoring_setup',
    title: 'Financial Integration',
    subtitle: 'Payment & Factoring Setup',
    description:
      'Automated factoring company integration, payment terms configuration, and ACH setup',
    icon: '🏦',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    metrics: [
      'Factor Company Setup',
      'NOA Processing',
      'Payment Terms',
      'ACH Configuration',
    ],
    avgDuration: '20 minutes',
    automationLevel: '92%',
  },
  {
    id: 'agreement_execution',
    title: 'Digital Agreements',
    subtitle: 'Electronic Contract Execution',
    description:
      'Comprehensive broker-carrier agreements with digital signature, audit trails, and legal compliance',
    icon: '📋',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    metrics: [
      'Carrier Packet',
      'Terms & Conditions',
      'Insurance Requirements',
      'Commission Structure',
    ],
    avgDuration: '30 minutes',
    automationLevel: '83%',
  },
  {
    id: 'portal_activation',
    title: 'Portal Activation',
    subtitle: 'Driver Access & Training',
    description:
      'Complete portal setup with driver account creation, permissions, and system training',
    icon: '🚀',
    color: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    metrics: [
      'Account Creation',
      'Permission Setup',
      'Training Completion',
      'System Integration',
    ],
    avgDuration: '45 minutes',
    automationLevel: '76%',
  },
];

// Status configuration
const STATUS_CONFIG = {
  active: {
    color: '#10b981',
    label: 'ACTIVE',
    icon: '🟢',
    priority: 1,
    description: 'Fully operational and compliant',
  },
  pending: {
    color: '#f59e0b',
    label: 'ONBOARDING',
    icon: '🟡',
    priority: 2,
    description: 'In progress - requires attention',
  },
  under_review: {
    color: '#8b5cf6',
    label: 'REVIEW',
    icon: '🟣',
    priority: 3,
    description: 'Management review required',
  },
  suspended: {
    color: '#ef4444',
    label: 'SUSPENDED',
    icon: '🔴',
    priority: 4,
    description: 'Compliance issue - action needed',
  },
  inactive: {
    color: '#6b7280',
    label: 'INACTIVE',
    icon: '⚫',
    priority: 5,
    description: 'Not currently active',
  },
};

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

  // Enhanced state management for portal functionality
  const [activeView, setActiveView] = useState<
    'executive' | 'workflow' | 'analytics' | 'compliance' | 'invitations'
  >('executive');
  const [carriers, setCarriers] = useState<CarrierPortalProfile[]>([]);
  const [selectedCarrier, setSelectedCarrier] =
    useState<CarrierPortalProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive' | 'pending' | 'suspended' | 'under_review'
  >('all');
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'progress' | 'date'>(
    'status'
  );

  // Invitation landing page state
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showInvitationLanding, setShowInvitationLanding] = useState(false);
  const [invitationData, setInvitationData] = useState({
    ref: '',
    carrier: '',
    mc: '',
    dot: '',
    email: '',
    inviter: '',
  });

  // Check for invitation parameters on component mount
  useEffect(() => {
    if (!searchParams) return;

    const ref = searchParams.get('ref');
    const carrier = searchParams.get('carrier');
    const mc = searchParams.get('mc');
    const dot = searchParams.get('dot');
    const email = searchParams.get('email');
    const inviter = searchParams.get('inviter');
    const showInvitations = searchParams.get('showInvitations');

    // If we have invitation parameters, show the landing page
    if (ref || carrier || mc || dot || inviter) {
      setInvitationData({
        ref: ref || '',
        carrier: carrier || '',
        mc: mc || '',
        dot: dot || '',
        email: email || '',
        inviter: inviter || '',
      });
      setShowInvitationLanding(true);

      // Track that the invitation was opened
      if (ref) {
        const invitationService = CarrierInvitationService.getInstance();
        invitationService.updateInvitationStatus(ref, 'opened');
        console.info(`Invitation ${ref} marked as opened`);
      }
    }

    // If showInvitations parameter is present, go directly to invitations tab
    if (showInvitations === 'true') {
      setActiveView('invitations');
    }
  }, [searchParams]);

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

  // Invitation landing page handlers
  const handleProceedToOnboarding = () => {
    // Track that the invitation process was started
    if (invitationData.ref) {
      const invitationService = CarrierInvitationService.getInstance();
      invitationService.updateInvitationStatus(invitationData.ref, 'started');
      console.info(`Invitation ${invitationData.ref} marked as started`);
    }

    // Build the onboarding URL with pre-filled data
    const params = new URLSearchParams();
    if (invitationData.carrier) params.set('company', invitationData.carrier);
    if (invitationData.mc) params.set('mc', invitationData.mc);
    if (invitationData.dot) params.set('dot', invitationData.dot);
    if (invitationData.email) params.set('email', invitationData.email);
    if (invitationData.ref) params.set('invitationRef', invitationData.ref);

    const onboardingUrl = `/onboarding/carrier-onboarding/new?${params.toString()}`;

    // Redirect to onboarding with pre-filled data
    router.push(onboardingUrl);
  };

  const handleReturnToPortal = () => {
    // Hide the landing page and show the normal portal
    setShowInvitationLanding(false);

    // Clear URL parameters for a clean portal experience
    router.replace('/carriers/enhanced-portal');
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

  // 🎯 AI Recruiting Prospects Integration
  const [recruitingProspects, setRecruitingProspects] = useState<any[]>([]);
  const [prospectNotifications, setProspectNotifications] = useState<any[]>([]);
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [prospectMetrics, setProspectMetrics] = useState({
    totalProspects: 0,
    readyForOnboarding: 0,
    averageAIScore: 0,
    totalEstimatedRevenue: 0,
    conversionRate: 0,
    unreadNotifications: 0,
  });

  // API Integration Functions
  const loadRecruitingProspects = async () => {
    try {
      const response = await fetch(
        '/api/ai-flow/recruiting-prospects?action=get_prospects&tenantId=tenant-demo-123&limit=10'
      );
      const data = await response.json();
      if (data.success) {
        setRecruitingProspects(data.data.prospects);
        setProspectMetrics((prev) => ({
          ...prev,
          ...data.data.metrics,
        }));
      }
    } catch (error) {
      console.error('Failed to load recruiting prospects:', error);
    }
  };

  const loadProspectNotifications = async () => {
    try {
      const response = await fetch(
        '/api/ai-flow/recruiting-prospects?action=get_notifications&limit=5'
      );
      const data = await response.json();
      if (data.success) {
        setProspectNotifications(data.data.notifications);
        setProspectMetrics((prev) => ({
          ...prev,
          unreadNotifications: data.data.unreadCount,
        }));
      }
    } catch (error) {
      console.error('Failed to load prospect notifications:', error);
    }
  };

  const approveProspectForOnboarding = async (
    prospectId: string,
    approvalData: any
  ) => {
    try {
      const response = await fetch('/api/ai-flow/recruiting-prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_onboarding',
          prospectId,
          approvalData,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Refresh prospects and notifications
        loadRecruitingProspects();
        loadProspectNotifications();
        // Close modal
        setShowProspectModal(false);
        // Show success message
        alert(`${data.data.prospect.companyName} approved for onboarding!`);
      }
    } catch (error) {
      console.error('Failed to approve prospect:', error);
    }
  };

  const rejectProspectForOnboarding = async (
    prospectId: string,
    rejectionData: any
  ) => {
    try {
      const response = await fetch('/api/ai-flow/recruiting-prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_onboarding',
          prospectId,
          approvalData: rejectionData,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Refresh prospects and notifications
        loadRecruitingProspects();
        loadProspectNotifications();
        // Close modal
        setShowProspectModal(false);
        // Show rejection message
        alert(`${data.data.prospect.companyName} rejected for onboarding.`);
      }
    } catch (error) {
      console.error('Failed to reject prospect:', error);
    }
  };

  const handleProspectClick = (prospect: any) => {
    setSelectedProspect(prospect);
    setShowProspectModal(true);
  };

  // Load recruiting prospects data on component mount
  useEffect(() => {
    loadRecruitingProspects();
    loadProspectNotifications();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      loadRecruitingProspects();
      loadProspectNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show invitation landing page if accessed via invitation link
  if (showInvitationLanding) {
    return (
      <InvitationLandingPage
        invitationData={invitationData}
        onProceedToOnboarding={handleProceedToOnboarding}
        onReturnToPortal={handleReturnToPortal}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #0c1821 0%, #1a2332 20%, #2d3748 40%, #1a202c 60%, #0f1419 80%, #000000 100%),
        radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%)
      `,
        backgroundSize:
          '100% 100%, 1400px 1400px, 1000px 1000px, 800px 800px, 100% 100%',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%, 0 0',
        backgroundAttachment: 'fixed',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, ""Segoe UI"", sans-serif',
      }}
    >
      {/* Portal Header */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href='/' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #2563eb, #1d4ed8)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #3b82f6, #1e40af)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span style={{ marginRight: '8px' }}>←</span>
                FleetFlow Dashboard
              </button>
            </Link>

            <div>
              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.03em',
                  textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                🏢 Carrier Management Portal
              </h1>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Advanced 6-step onboarding workflow with AI-powered verification
                & compliance monitoring
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                }}
              />
              <span
                style={{
                  color: '#10b981',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Live System Active
              </span>
            </div>

            <Link
              href='/onboarding/carrier-onboarding/new'
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 30px rgba(16, 185, 129, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
              >
                <span style={{ marginRight: '8px' }}>🚀</span>
                Start New Onboarding
              </button>
            </Link>
          </div>
        </div>
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
            <EnhancedNewCarrierButton
              onDirectOnboarding={() => {
                window.location.href = '/onboarding/carrier-onboarding/new';
              }}
              onShowInvitations={() => {
                setActiveView('invitations');
              }}
              currentUser={{
                name: 'Portal User',
                role: 'Admin',
                company: 'FleetFlow',
              }}
            />
          </div>
        </div>

        {/* Portal Navigation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              {
                id: 'executive',
                label: 'Executive Dashboard',
                icon: '📊',
                color: '#1e40af',
              },
              {
                id: 'workflow',
                label: '6-Step Workflow',
                icon: '🔄',
                color: '#10b981',
              },
              {
                id: 'analytics',
                label: 'Performance Analytics',
                icon: '📈',
                color: '#f59e0b',
              },
              {
                id: 'compliance',
                label: 'Compliance Center',
                icon: '🛡️',
                color: '#ef4444',
              },
              {
                id: 'invitations',
                label: 'Carrier Invitations',
                icon: '📧',
                color: '#8b5cf6',
              },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveView(mode.id as any)}
                style={{
                  padding: '16px 24px',
                  borderRadius: '16px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  background:
                    activeView === mode.id
                      ? `linear-gradient(135deg, ${mode.color}, ${mode.color}dd)`
                      : 'rgba(255, 255, 255, 0.08)',
                  color:
                    activeView === mode.id
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.8)',
                  transform:
                    activeView === mode.id
                      ? 'translateY(-4px) scale(1.05)'
                      : 'translateY(0) scale(1)',
                  boxShadow:
                    activeView === mode.id
                      ? `0 12px 30px ${mode.color}40, 0 0 0 2px ${mode.color}30`
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: `2px solid ${activeView === mode.id ? mode.color : 'rgba(255, 255, 255, 0.1)'}`,
                }}
                onMouseOver={(e) => {
                  if (activeView !== mode.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== mode.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ marginRight: '12px', fontSize: '1.2rem' }}>
                  {mode.icon}
                </span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Executive Dashboard View */}
        {activeView === 'executive' && (
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
                    currentStep: 3,
                    steps: [
                      'FMCSA Verification',
                      'Service Configuration',
                      'Document Intelligence',
                      'Financial Integration',
                      'Digital Agreements',
                      'Portal Activation',
                    ],
                    startDate: '2024-12-18',
                    estimatedCompletion: '2024-12-30',
                  },
                  {
                    id: 'pipeline-2',
                    name: 'Prime Transport Inc',
                    mcNumber: 'MC-456789',
                    currentStep: 5,
                    steps: [
                      'FMCSA Verification',
                      'Service Configuration',
                      'Document Intelligence',
                      'Financial Integration',
                      'Digital Agreements',
                      'Portal Activation',
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
                      'FMCSA Verification',
                      'Service Configuration',
                      'Document Intelligence',
                      'Financial Integration',
                      'Digital Agreements',
                      'Portal Activation',
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
              id='document-compliance-dashboard'
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

            {/* AI Recruiting Prospects Dashboard */}
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
                  🤖 AI Recruiting Prospects
                </h2>
                <div
                  style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
                >
                  {prospectMetrics.unreadNotifications > 0 && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        animation: 'pulse 2s infinite',
                      }}
                    >
                      🔔 {prospectMetrics.unreadNotifications} New Notifications
                    </div>
                  )}
                  <button
                    onClick={() => {
                      loadRecruitingProspects();
                      loadProspectNotifications();
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
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
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* Prospects Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(59, 130, 246, 0.2)';
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
                      color: '#60a5fa',
                      marginBottom: '8px',
                    }}
                  >
                    {prospectMetrics.totalProspects}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Total Prospects
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(16, 185, 129, 0.2)';
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
                      color: '#34d399',
                      marginBottom: '8px',
                    }}
                  >
                    {prospectMetrics.readyForOnboarding}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Ready for Onboarding
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(245, 158, 11, 0.2)';
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
                      color: '#fbbf24',
                      marginBottom: '8px',
                    }}
                  >
                    {prospectMetrics.averageAIScore}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Avg AI Score
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(139, 92, 246, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#a78bfa',
                      marginBottom: '8px',
                    }}
                  >
                    ${(prospectMetrics.totalEstimatedRevenue / 1000).toFixed(0)}
                    K
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Est. Revenue
                  </div>
                </div>
              </div>

              {/* Prospects List */}
              <div style={{ display: 'grid', gap: '12px' }}>
                {recruitingProspects.length > 0 ? (
                  recruitingProspects.slice(0, 5).map((prospect) => (
                    <div
                      key={prospect.id}
                      onClick={() => handleProspectClick(prospect)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 25px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
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
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${
                              prospect.priority === 'urgent'
                                ? '#ef4444, #dc2626'
                                : prospect.priority === 'high'
                                  ? '#f59e0b, #d97706'
                                  : prospect.priority === 'medium'
                                    ? '#3b82f6, #2563eb'
                                    : '#6b7280, #4b5563'
                            })`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: 'white',
                          }}
                        >
                          {prospect.companyName.charAt(0)}
                        </div>
                        <div>
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {prospect.companyName}
                          </h3>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              fontSize: '0.8rem',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            <span>
                              AI Score: {prospect.aiScore.overall}/100
                            </span>
                            <span>•</span>
                            <span>
                              Fleet: {prospect.businessInfo.fleetSize} trucks
                            </span>
                            <span>•</span>
                            <span>
                              ${(prospect.estimatedRevenue / 1000).toFixed(0)}K
                              revenue
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            background: `${
                              prospect.status === 'ready_for_onboarding'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : prospect.status === 'qualified'
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : prospect.status === 'interested'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : 'rgba(107, 114, 128, 0.2)'
                            }`,
                            color: `${
                              prospect.status === 'ready_for_onboarding'
                                ? '#34d399'
                                : prospect.status === 'qualified'
                                  ? '#60a5fa'
                                  : prospect.status === 'interested'
                                    ? '#fbbf24'
                                    : '#9ca3af'
                            }`,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                          }}
                        >
                          {prospect.status.replace('_', ' ')}
                        </div>
                        {prospect.onboardingApprovalStatus === 'pending' && (
                          <div
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#fca5a5',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '500',
                              animation: 'pulse 2s infinite',
                            }}
                          >
                            APPROVAL NEEDED
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                      padding: '32px',
                    }}
                  >
                    No recruiting prospects available
                  </div>
                )}
              </div>

              {recruitingProspects.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    View All {recruitingProspects.length} Prospects
                  </button>
                </div>
              )}
            </div>

            {/* Recent Carriers */}
            <div
              id='recent-carrier-activity'
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

        {/* 6-Step Workflow Management View */}
        {activeView === 'workflow' && (
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

        {/* Performance Analytics View */}
        {activeView === 'analytics' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '800',
                margin: '0 0 32px 0',
                textAlign: 'center',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              📈 Performance Analytics
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
              }}
            >
              {/* Performance Charts Placeholder */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                  }}
                >
                  Onboarding Efficiency
                </h3>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '3rem',
                    fontWeight: '800',
                    marginBottom: '8px',
                  }}
                >
                  +18%
                </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem',
                  }}
                >
                  Improvement this quarter
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                  }}
                >
                  Compliance Rate
                </h3>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '3rem',
                    fontWeight: '800',
                    marginBottom: '8px',
                  }}
                >
                  94%
                </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem',
                  }}
                >
                  Industry leading
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Center View */}
        {activeView === 'compliance' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '800',
                margin: '0 0 32px 0',
                textAlign: 'center',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              🛡️ Compliance Center
            </h2>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚨</div>
              <h3
                style={{
                  color: '#ef4444',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  marginBottom: '16px',
                }}
              >
                Compliance Monitoring Active
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                }}
              >
                Real-time monitoring of carrier compliance status, document
                expiration alerts, and automated regulatory updates across all
                onboarded carriers.
              </p>
            </div>
          </div>
        )}

        {/* Carrier Invitations View */}
        {activeView === 'invitations' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CarrierInvitationManager
              currentUser={{
                name: 'Portal Admin',
                role: 'Admin',
                company: 'FleetFlow',
              }}
            />
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
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '8px',
                }}
              >
                {[
                  'FMCSA Verification',
                  'Service Configuration',
                  'Document Intelligence',
                  'Financial Integration',
                  'Digital Agreements',
                  'Portal Activation',
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

      {/* Prospect Approval Modal */}
      {showProspectModal && selectedProspect && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowProspectModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                  }}
                >
                  🤖 AI Recruiting Prospect
                </h2>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                    fontSize: '1rem',
                  }}
                >
                  Management Approval Required
                </p>
              </div>
              <button
                onClick={() => setShowProspectModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
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

            {/* Modal Content */}
            <div style={{ padding: '32px' }}>
              {/* Company Info */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${
                        selectedProspect.priority === 'urgent'
                          ? '#ef4444, #dc2626'
                          : selectedProspect.priority === 'high'
                            ? '#f59e0b, #d97706'
                            : selectedProspect.priority === 'medium'
                              ? '#3b82f6, #2563eb'
                              : '#6b7280, #4b5563'
                      })`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {selectedProspect.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {selectedProspect.companyName}
                    </h3>
                    <div
                      style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
                    >
                      {selectedProspect.mcNumber && (
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          MC: {selectedProspect.mcNumber}
                        </span>
                      )}
                      {selectedProspect.dotNumber && (
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          DOT: {selectedProspect.dotNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Score */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color:
                          selectedProspect.aiScore.overall >= 90
                            ? '#10b981'
                            : selectedProspect.aiScore.overall >= 80
                              ? '#f59e0b'
                              : '#ef4444',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedProspect.aiScore.overall}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Overall
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#60a5fa',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedProspect.aiScore.financial}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Financial
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#34d399',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedProspect.aiScore.safety}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Safety
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedProspect.aiScore.performance}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Performance
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#a78bfa',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedProspect.aiScore.compatibility}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Compatibility
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '1rem',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Fleet Size
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                      {selectedProspect.businessInfo.fleetSize} trucks
                    </p>
                  </div>
                  <div>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '1rem',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Equipment
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                      {selectedProspect.businessInfo.equipmentTypes.join(', ')}
                    </p>
                  </div>
                  <div>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '1rem',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Operating States
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                      {selectedProspect.businessInfo.operatingStates.join(', ')}
                    </p>
                  </div>
                  <div>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '1rem',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Specializations
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                      {selectedProspect.businessInfo.specializations.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Revenue & Probability */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      color: '#34d399',
                      marginBottom: '8px',
                    }}
                  >
                    ${(selectedProspect.estimatedRevenue / 1000).toFixed(0)}K
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Estimated Annual Revenue
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      color: '#60a5fa',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedProspect.conversionProbability}%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Conversion Probability
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    margin: '0 0 16px 0',
                  }}
                >
                  Contact Information
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div>
                    <strong style={{ color: 'white' }}>
                      {selectedProspect.contactInfo.name}
                    </strong>
                    <br />
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {selectedProspect.contactInfo.title}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      📧 {selectedProspect.contactInfo.email}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      📞 {selectedProspect.contactInfo.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '32px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    margin: '0 0 12px 0',
                  }}
                >
                  AI Analysis Notes
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {selectedProspect.notes}
                </p>
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
                <button
                  onClick={() =>
                    approveProspectForOnboarding(selectedProspect.id, {
                      approvedBy: 'Management',
                      notes:
                        'Approved based on AI analysis and business metrics',
                    })
                  }
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ✅ Approve for Onboarding
                </button>
                <button
                  onClick={() =>
                    rejectProspectForOnboarding(selectedProspect.id, {
                      rejectedBy: 'Management',
                      reason: 'Does not meet current onboarding criteria',
                    })
                  }
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ❌ Reject Prospect
                </button>
                <button
                  onClick={() => setShowProspectModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portal CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
