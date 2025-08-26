'use client';

/**
 * Platform Services Agreement Signing Component
 * Handles the 50% revenue sharing agreement for FleetFlow platform services
 */

import { useState } from 'react';
import { PlatformServicesAgreement } from '../services/EnhancedICAOnboardingService';

interface PlatformServicesAgreementSigningProps {
  agreement: PlatformServicesAgreement;
  tenantId: string;
  userId: string;
  userName: string;
  onAgreementSigned: (agreementId: string) => void;
  onBack?: () => void;
}

export default function PlatformServicesAgreementSigning({
  agreement,
  tenantId,
  userId,
  userName,
  onAgreementSigned,
  onBack,
}: PlatformServicesAgreementSigningProps) {
  const [currentSection, setCurrentSection] = useState<
    'overview' | 'terms' | 'signature'
  >('overview');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState('');
  const [signingInProgress, setSigningInProgress] = useState(false);
  const [ipAddress] = useState('192.168.1.100'); // Would be actual IP in production

  const handleSign = async () => {
    if (!agreedToTerms || !signature.trim()) {
      alert('Please agree to terms and provide your digital signature');
      return;
    }

    setSigningInProgress(true);

    try {
      // Simulate signing process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(`✅ Platform Services Agreement signed successfully!

Agreement ID: ${agreement.agreementId}
Revenue Share: 50% FleetFlow / 50% ${tenantId}
Effective Date: ${agreement.effectiveDate}

Platform Services Enabled:
• FreightFlow RFx℠ (Government & Enterprise Contracts)
• AI Flow Platform (Lead Generation & Automation)
• Government Contract Access (SAM.gov Integration)
• Insurance Partnership Referrals (100% commission to FleetFlow)

Your organization can now access premium platform services with 50/50 revenue sharing on successful contracts!`);

      onAgreementSigned(agreement.agreementId);
    } catch (error) {
      alert('Failed to sign agreement. Please try again.');
    } finally {
      setSigningInProgress(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px',
          }}
        >
          FleetFlow Platform Services Agreement
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px',
          }}
        >
          Revenue Sharing Agreement for Premium Platform Services
        </p>

        {/* Progress Indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {[
            { key: 'overview', label: 'Overview', icon: '📋' },
            { key: 'terms', label: 'Terms', icon: '⚖️' },
            { key: 'signature', label: 'Signature', icon: '✍️' },
          ].map((section) => (
            <div
              key={section.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                background:
                  currentSection === section.key ? '#3b82f6' : '#f3f4f6',
                color: currentSection === section.key ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
              onClick={() => setCurrentSection(section.key as any)}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {currentSection === 'overview' && (
        <div>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
            📊 Agreement Overview
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            {/* Revenue Sharing */}
            <div
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  color: '#0369a1',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>💰</span> Revenue Sharing
              </h3>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#0369a1',
                  marginBottom: '8px',
                }}
              >
                50% / 50%
              </div>
              <p style={{ color: '#0369a1', fontSize: '14px', margin: 0 }}>
                Equal revenue split on all platform-generated contracts
              </p>
            </div>

            {/* Agreement Term */}
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  color: '#166534',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>📅</span> Agreement Term
              </h3>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#166534',
                  marginBottom: '8px',
                }}
              >
                12 Months
              </div>
              <p style={{ color: '#166534', fontSize: '14px', margin: 0 }}>
                Auto-renewal with 60-day notice
              </p>
            </div>

            {/* Enabled Services */}
            <div
              style={{
                background: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  color: '#d97706',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🚀</span> Platform Services
              </h3>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#d97706',
                  marginBottom: '8px',
                }}
              >
                4 Services
              </div>
              <p style={{ color: '#d97706', fontSize: '14px', margin: 0 }}>
                Premium access to all revenue services
              </p>
            </div>
          </div>

          {/* Service Details */}
          <div
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ color: '#1f2937', marginBottom: '16px' }}>
              🎯 Platform Services Included
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  📋
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px',
                    }}
                  >
                    FreightFlow RFx℠
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Government contracts, enterprise RFPs, InstantMarkets
                    opportunities
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    background: '#dcfce7',
                    color: '#166534',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  50% Share
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  🤖
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px',
                    }}
                  >
                    AI Flow Platform
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    AI-powered lead generation, customer acquisition, automated
                    negotiations
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    background: '#dcfce7',
                    color: '#166534',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  50% Share
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  🏛️
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px',
                    }}
                  >
                    Government Contracts
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    SAM.gov integration, federal contracting opportunities,
                    compliance support
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    background: '#dcfce7',
                    color: '#166534',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  50% Share
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#f3e8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  🛡️
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px',
                    }}
                  >
                    Insurance Partnerships
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Referral partnerships with Tivly, Covered, Insurify
                    ($300-$2,000+ per policy)
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    background: '#ddd6fe',
                    color: '#7c3aed',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  FleetFlow 100%
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  padding: '12px 24px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setCurrentSection('terms')}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Review Terms →
            </button>
          </div>
        </div>
      )}

      {currentSection === 'terms' && (
        <div>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
            ⚖️ Terms & Conditions
          </h2>

          <div
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3 style={{ color: '#1f2937', marginBottom: '16px' }}>
              Revenue Sharing Terms
            </h3>

            <div
              style={{ lineHeight: '1.6', color: '#374151', fontSize: '14px' }}
            >
              <p>
                <strong>1. Revenue Share Calculation:</strong> FleetFlow shall
                receive fifty percent (50%) of all gross revenue generated from
                contracts, customers, or opportunities obtained through the
                Platform Services listed in this Agreement.
              </p>

              <p>
                <strong>2. Qualifying Revenue:</strong> Revenue subject to
                sharing includes all amounts received by Tenant directly
                attributable to:
                <br />• Contracts obtained through FreightFlow RFx℠ service
                <br />• Customers acquired through AI Flow Platform
                <br />• Government contracts won through FleetFlow's SAM.gov
                integration
                <br />• Loads/shipments secured through platform opportunity
                discovery
              </p>

              <p>
                <strong>3. Excluded Revenue:</strong> The following revenue is
                NOT subject to revenue sharing:
                <br />• Existing customer relationships prior to Agreement
                effective date
                <br />• Contracts obtained through Tenant's independent
                marketing efforts
                <br />• Revenue from standard TMS services and operations
                <br />• Insurance commissions (retained 100% by FleetFlow)
              </p>

              <p>
                <strong>4. Payment Terms:</strong> FleetFlow's 50% revenue share
                is due within thirty (30) days of Tenant's receipt of payment
                from end customers. Monthly reporting required by 15th of each
                month.
              </p>

              <p>
                <strong>5. Service Access:</strong> Access to Platform Services
                is contingent upon signed Agreement and compliance with payment
                terms. FleetFlow reserves the right to suspend access for
                non-payment.
              </p>

              <p>
                <strong>6. Intellectual Property:</strong> FleetFlow retains all
                rights to platform technology, partnerships, and opportunity
                discovery systems. Tenant retains rights to developed customer
                relationships.
              </p>

              <p>
                <strong>7. Term & Termination:</strong> Agreement is effective
                for twelve (12) months with automatic renewal. Either party may
                terminate with 60 days' written notice. Revenue sharing
                continues for existing contracts post-termination.
              </p>

              <p>
                <strong>8. Compliance:</strong> Both parties shall maintain
                required licenses and comply with applicable regulations. All
                disputes subject to binding arbitration in Michigan.
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
            <button
              onClick={() => setCurrentSection('overview')}
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              ← Back to Overview
            </button>
            <button
              onClick={() => setCurrentSection('signature')}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Proceed to Signature →
            </button>
          </div>
        </div>
      )}

      {currentSection === 'signature' && (
        <div>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
            ✍️ Electronic Signature
          </h2>

          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ color: '#0369a1', marginBottom: '12px' }}>
              Agreement Summary
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                fontSize: '14px',
              }}
            >
              <div>
                <strong>Tenant:</strong> {tenantId}
                <br />
                <strong>User:</strong> {userName}
                <br />
                <strong>User ID:</strong> {userId}
              </div>
              <div>
                <strong>Revenue Share:</strong> 50% FleetFlow / 50% Tenant
                <br />
                <strong>Term:</strong> 12 months (auto-renewal)
                <br />
                <strong>Effective:</strong> {agreement.effectiveDate}
              </div>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                color: '#92400e',
              }}
            >
              <input
                type='checkbox'
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{
                  marginTop: '4px',
                  width: '16px',
                  height: '16px',
                }}
              />
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  ✅ I agree to the Platform Services Agreement terms
                </div>
                <div style={{ fontSize: '14px' }}>
                  I understand that FleetFlow will receive 50% of revenue from
                  contracts obtained through FreightFlow RFx℠, AI Flow Platform,
                  and Government Contract services. I acknowledge that this
                  creates a business partnership for platform-generated
                  opportunities while I retain 100% of revenue from my
                  independent business development efforts.
                </div>
              </div>
            </label>
          </div>

          {/* Digital Signature Input */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Digital Signature *
            </label>
            <input
              type='text'
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={`Type your full name: ${userName}`}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'cursive',
              }}
            />
            <div
              style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}
            >
              Type your full legal name as your digital signature
            </div>
          </div>

          {/* Legal Information */}
          <div
            style={{
              background: '#f3f4f6',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              Legal Information:
            </div>
            <div>IP Address: {ipAddress}</div>
            <div>Timestamp: {new Date().toLocaleString()}</div>
            <div>User Agent: {navigator.userAgent}</div>
            <div style={{ marginTop: '8px' }}>
              By signing electronically, you acknowledge this agreement has the
              same legal effect as a handwritten signature.
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setCurrentSection('terms')}
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              ← Back to Terms
            </button>

            <button
              onClick={handleSign}
              disabled={
                !agreedToTerms || !signature.trim() || signingInProgress
              }
              style={{
                padding: '12px 32px',
                background:
                  !agreedToTerms || !signature.trim() || signingInProgress
                    ? '#9ca3af'
                    : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor:
                  !agreedToTerms || !signature.trim() || signingInProgress
                    ? 'not-allowed'
                    : 'pointer',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              {signingInProgress
                ? '⏳ Signing Agreement...'
                : '✍️ Sign Agreement'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
