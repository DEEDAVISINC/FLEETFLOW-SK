'use client';

import { useState } from 'react';
import { checkPermission, getCurrentUser } from '../../../config/access';
import { OnboardingWorkflow } from '../components/OnboardingWorkflow';

// Access Control Component
const AccessRestricted = () => (
  <div
    style={{
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}
  >
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px 32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
      <h1
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '16px',
        }}
      >
        Access Restricted
      </h1>
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '16px',
          lineHeight: '1.6',
        }}
      >
        You need management permissions to start new carrier onboarding.
      </p>
      <button
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.transform = 'translateY(-2px)')
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.transform = 'translateY(0)')
        }
      >
        Go Back
      </button>
    </div>
  </div>
);

interface OnboardingRecord {
  carrierId: string;
  startDate: string;
  completionDate: string;
  status: string;
  steps: any;
  summary: any;
}

export default function NewCarrierOnboardingPage() {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [completedOnboarding, setCompletedOnboarding] =
    useState<OnboardingRecord | null>(null);

  const user = getCurrentUser();

  if (!checkPermission('canStartNewOnboarding')) {
    return <AccessRestricted />;
  }

  const handleStartOnboarding = () => {
    setShowWorkflow(true);
  };

  const handleOnboardingComplete = (data: any) => {
    setCompletedOnboarding(data);
    setShowWorkflow(false);

    // Log integration results if available
    if (data.integrationResult) {
      console.log('🎉 Onboarding Integration Success:', data.integrationResult);
    }

    console.log('Onboarding completed:', data);
  };

  const handleOnboardingCancel = () => {
    setShowWorkflow(false);
  };

  const handleStartNew = () => {
    setCompletedOnboarding(null);
    setShowWorkflow(true);
  };

  if (showWorkflow) {
    return (
      <OnboardingWorkflow
        onComplete={handleOnboardingComplete}
        onCancel={handleOnboardingCancel}
      />
    );
  }

  if (completedOnboarding) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          minHeight: '100vh',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Carrier Onboarding Complete!
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}
          >
            {completedOnboarding.summary.carrierInfo?.legalName || 'Carrier'}{' '}
            has been successfully onboarded and is ready to begin operations.
          </p>

          {/* Summary Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                ✅
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                FMCSA Verified
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {completedOnboarding.summary.documentsUploaded}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Documents
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {completedOnboarding.summary.factoringEnabled ? '✅' : '❌'}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Factoring
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {completedOnboarding.summary.agreementsSigned}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Agreements
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {completedOnboarding.summary.portalUsers}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Portal Users
              </div>
            </div>
          </div>

          {/* Carrier Details */}
          {completedOnboarding.summary.carrierInfo && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                📋 Carrier Information
              </h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <div>
                  <strong>Company:</strong>{' '}
                  {completedOnboarding.summary.carrierInfo.legalName}
                </div>
                <div>
                  <strong>DOT:</strong>{' '}
                  {completedOnboarding.summary.carrierInfo.dotNumber}
                </div>
                <div>
                  <strong>MC:</strong>{' '}
                  {completedOnboarding.summary.carrierInfo.mcNumber}
                </div>
                <div>
                  <strong>Safety Rating:</strong>{' '}
                  {completedOnboarding.summary.carrierInfo.safetyRating}
                </div>
                <div>
                  <strong>Completion Date:</strong>{' '}
                  {new Date(
                    completedOnboarding.completionDate
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {/* Integration Results */}
          {completedOnboarding.integrationResult &&
            completedOnboarding.integrationResult.success && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '32px',
                  textAlign: 'left',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                  }}
                >
                  ✅ Portal Integration Complete
                </h3>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '16px',
                  }}
                >
                  {completedOnboarding.integrationResult.message}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                      🏢
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Carrier Portal Created
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Status:{' '}
                      {completedOnboarding.integrationResult.carrierProfile
                        ?.status || 'Active'}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                      👥
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Driver Accounts
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {completedOnboarding.integrationResult.driverProfiles
                        ?.length || 0}{' '}
                      created
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() =>
                      (window.location.href = '/carriers/enhanced-portal')
                    }
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    🏢 View Carrier Portal
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = '/admin/driver-otr-flow')
                    }
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    👥 View Driver Portal
                  </button>
                </div>
              </div>
            )}

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
                (window.location.href = '/onboarding/carrier-onboarding')
              }
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              📊 View Dashboard
            </button>

            <button
              onClick={() => {
                // Mock download functionality
                const blob = new Blob(
                  [JSON.stringify(completedOnboarding, null, 2)],
                  { type: 'application/json' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `carrier_onboarding_${completedOnboarding.carrierId}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              📄 Download Report
            </button>

            <button
              onClick={handleStartNew}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ➕ Start New Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚛</div>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
          }}
        >
          New Carrier Onboarding
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          Start the comprehensive carrier onboarding process including FMCSA
          verification, document upload, factoring setup, agreement signing, and
          portal access configuration.
        </p>

        {/* Process Overview */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            📋 Onboarding Process Overview
          </h3>
          <div style={{ display: 'grid', gap: '12px', textAlign: 'left' }}>
            {[
              {
                icon: '📊',
                title: 'FMCSA Verification',
                desc: 'Automatic carrier data import and safety rating check',
              },
              {
                icon: '📄',
                title: 'Document Upload',
                desc: 'Insurance, legal, and financial document collection',
              },
              {
                icon: '🏦',
                title: 'Factoring Setup',
                desc: 'Payment processing and factoring company configuration',
              },
              {
                icon: '📝',
                title: 'Agreement Signing',
                desc: 'Electronic signature of broker-carrier agreements',
              },
              {
                icon: '👤',
                title: 'Portal Access',
                desc: 'Driver portal setup and user account creation',
              },
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{step.icon}</div>
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px',
          }}
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
            ⏱️ <strong>Estimated Time:</strong> 15-30 minutes depending on
            document availability
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartOnboarding}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            display: 'block',
            margin: '0 auto',
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLElement).style.transform = 'translateY(-2px)')
          }
          onMouseOut={(e) =>
            ((e.target as HTMLElement).style.transform = 'translateY(0)')
          }
        >
          🚀 Start Carrier Onboarding
        </button>

        {/* Back to Dashboard */}
        <button
          onClick={() =>
            (window.location.href = '/onboarding/carrier-onboarding')
          }
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '16px',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
