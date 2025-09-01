'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ContractorOnboardingService, {
  DocumentRequirement,
  OnboardingSession,
  OnboardingStep,
} from '../../services/ContractorOnboardingService';

const ContractorOnboardingDashboard = () => {
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  useEffect(() => {
    loadOnboardingSession();
  }, []);

  const loadOnboardingSession = async () => {
    try {
      // This would normally get the session ID from authentication or URL params
      const sessionId = 'mock-session-id';
      const sessionData =
        await ContractorOnboardingService.getOnboardingSession(sessionId);
      setSession(sessionData);
    } catch (err: any) {
      setError(err.message || 'Failed to load onboarding session');
    } finally {
      setLoading(false);
    }
  };

  const handleStepAction = async (stepId: string, action: string) => {
    if (!session) return;

    setProcessingStep(stepId);
    setError(null);

    try {
      switch (action) {
        case 'review_contract':
          await handleContractReview();
          break;
        case 'review_nda':
          await handleNDAReview();
          break;
        case 'complete_training':
          window.location.href = '/training';
          break;
        case 'upload_insurance':
          await handleInsuranceUpload();
          break;
        case 'complete_background':
          await handleBackgroundCheck();
          break;
        default:
          console.info('Unknown action:', action);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process action');
    } finally {
      setProcessingStep(null);
    }
  };

  const handleContractReview = async () => {
    if (!session) return;

    // Generate and send contract for signing
    const contractorData = {
      id: session.contractorId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '555-123-4567',
      address: '123 Main St, City, ST 12345',
      role: 'dispatcher' as const,
      experience: 'Sample experience',
      references: [],
      certifications: [],
      availableHours: 'full_time',
      preferredRegions: ['Northeast'],
      emergencyContact: {
        name: 'Jane Doe',
        phone: '555-987-6543',
        relationship: 'Spouse',
      },
      bankingInfo: {
        accountType: 'checking',
        routingNumber: '123456789',
        accountNumber: '987654321',
        bankName: 'Sample Bank',
      },
      taxInfo: {
        ssn: '123-45-6789',
        taxId: '',
        businessType: 'individual' as const,
        businessName: '',
      },
    };

    const result = await ContractorOnboardingService.initiateDocumentSigning(
      session.id,
      'contractor_agreement',
      contractorData
    );

    // Open DocuSign in new window
    window.open(result.signingUrl, '_blank');
  };

  const handleNDAReview = async () => {
    if (!session) return;

    const contractorData = {
      id: session.contractorId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '555-123-4567',
      address: '123 Main St, City, ST 12345',
      role: 'dispatcher' as const,
      experience: 'Sample experience',
      references: [],
      certifications: [],
      availableHours: 'full_time',
      preferredRegions: ['Northeast'],
      emergencyContact: {
        name: 'Jane Doe',
        phone: '555-987-6543',
        relationship: 'Spouse',
      },
      bankingInfo: {
        accountType: 'checking',
        routingNumber: '123456789',
        accountNumber: '987654321',
        bankName: 'Sample Bank',
      },
      taxInfo: {
        ssn: '123-45-6789',
        taxId: '',
        businessType: 'individual' as const,
        businessName: '',
      },
    };

    const result = await ContractorOnboardingService.initiateDocumentSigning(
      session.id,
      'nda',
      contractorData
    );

    window.open(result.signingUrl, '_blank');
  };

  const handleInsuranceUpload = async () => {
    // This would open an insurance upload modal
    alert('Insurance upload feature coming soon');
  };

  const handleBackgroundCheck = async () => {
    if (!session) return;

    const contractorData = {
      id: session.contractorId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '555-123-4567',
      address: '123 Main St, City, ST 12345',
      role: 'dispatcher' as const,
      experience: 'Sample experience',
      references: [],
      certifications: [],
      availableHours: 'full_time',
      preferredRegions: ['Northeast'],
      emergencyContact: {
        name: 'Jane Doe',
        phone: '555-987-6543',
        relationship: 'Spouse',
      },
      bankingInfo: {
        accountType: 'checking',
        routingNumber: '123456789',
        accountNumber: '987654321',
        bankName: 'Sample Bank',
      },
      taxInfo: {
        ssn: '123-45-6789',
        taxId: '',
        businessType: 'individual' as const,
        businessName: '',
      },
    };

    const result =
      await ContractorOnboardingService.initiateBackgroundCheck(contractorData);
    alert(`Background check initiated. Check ID: ${result.checkId}`);
  };

  const getStepStatus = (step: OnboardingStep) => {
    switch (step.status) {
      case 'completed':
        return { color: '#10b981', icon: '✅', text: 'Completed' };
      case 'in_progress':
        return { color: '#f59e0b', icon: '⏳', text: 'In Progress' };
      case 'failed':
        return { color: '#ef4444', icon: '❌', text: 'Failed' };
      default:
        return { color: '#6b7280', icon: '⭕', text: 'Pending' };
    }
  };

  const getDocumentStatus = (doc: DocumentRequirement) => {
    switch (doc.status) {
      case 'signed':
        return { color: '#10b981', icon: '✅', text: 'Signed' };
      case 'sent':
        return { color: '#f59e0b', icon: '📧', text: 'Sent for Signing' };
      case 'generated':
        return { color: '#3b82f6', icon: '📄', text: 'Generated' };
      default:
        return { color: '#6b7280', icon: '⭕', text: 'Pending' };
    }
  };

  const getNextAction = (step: OnboardingStep) => {
    const actionMap: Record<string, { text: string; action: string }> = {
      background_check: {
        text: 'Complete Background Check',
        action: 'complete_background',
      },
      contract_signing: {
        text: 'Review & Sign Contract',
        action: 'review_contract',
      },
      nda_signing: { text: 'Review & Sign NDA', action: 'review_nda' },
      insurance_verification: {
        text: 'Upload Insurance',
        action: 'upload_insurance',
      },
      training_completion: {
        text: 'Complete Training',
        action: 'complete_training',
      },
    };

    return (
      actionMap[step.id] || { text: 'Complete Step', action: 'complete_step' }
    );
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        }}
      >
        <div style={{ color: 'white', fontSize: '18px' }}>
          Loading onboarding dashboard...
        </div>
      </div>
    );
  }

  // Mock session data since we don't have a real backend
  const mockSession: OnboardingSession = {
    id: 'ONB-123456',
    contractorId: 'CTR-123456',
    status: 'in_progress',
    currentStep: 3,
    totalSteps: 10,
    progressPercentage: 30,
    startedAt: new Date(),
    notes: [],
    steps: [
      {
        id: 'personal_info',
        name: 'Personal Information',
        description: 'Complete personal and contact information',
        status: 'completed',
        required: true,
        order: 1,
        completedAt: new Date(),
      },
      {
        id: 'experience_verification',
        name: 'Experience Verification',
        description: 'Verify transportation industry experience',
        status: 'completed',
        required: true,
        order: 2,
        completedAt: new Date(),
      },
      {
        id: 'background_check',
        name: 'Background Check',
        description: 'Complete background verification process',
        status: 'in_progress',
        required: true,
        order: 3,
      },
      {
        id: 'contract_signing',
        name: 'Contract Signing',
        description: 'Review and sign contractor agreement',
        status: 'pending',
        required: true,
        order: 4,
      },
      {
        id: 'nda_signing',
        name: 'NDA Signing',
        description: 'Review and sign non-disclosure agreement',
        status: 'pending',
        required: true,
        order: 5,
      },
      {
        id: 'insurance_verification',
        name: 'Insurance Verification',
        description: 'Verify required insurance coverage',
        status: 'pending',
        required: true,
        order: 6,
      },
      {
        id: 'training_completion',
        name: 'Training Completion',
        description: 'Complete required training modules',
        status: 'pending',
        required: true,
        order: 7,
      },
    ],
    documents: [
      {
        id: 'contractor_agreement',
        name: 'Independent Contractor Agreement',
        type: 'contractor_agreement',
        status: 'pending',
        required: true,
      },
      {
        id: 'nda',
        name: 'Non-Disclosure Agreement',
        type: 'nda',
        status: 'pending',
        required: true,
      },
      {
        id: 'w9',
        name: 'W-9 Tax Form',
        type: 'w9',
        status: 'pending',
        required: true,
      },
    ],
  };

  const displaySession = session || mockSession;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <h1
              style={{
                color: 'white',
                fontSize: '32px',
                marginBottom: '10px',
                fontWeight: 'bold',
              }}
            >
              🚛 FleetFlow Transportation
            </h1>
          </Link>
          <h2
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '24px',
              fontWeight: 'normal',
              marginBottom: '10px',
            }}
          >
            Contractor Onboarding Dashboard
          </h2>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}
          >
            Session ID: {displaySession.id}
          </div>
        </div>

        {/* Progress Overview */}
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{ color: '#1f2937', marginBottom: '20px', fontSize: '20px' }}
          >
            Onboarding Progress
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '12px',
                background: '#e5e7eb',
                borderRadius: '6px',
                overflow: 'hidden',
                marginRight: '20px',
              }}
            >
              <div
                style={{
                  width: `${displaySession.progressPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937',
              }}
            >
              {displaySession.progressPercentage}%
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: '#f0f9ff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #bae6fd',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#0369a1',
                }}
              >
                {
                  displaySession.steps.filter((s) => s.status === 'completed')
                    .length
                }
              </div>
              <div style={{ color: '#0369a1', fontSize: '14px' }}>
                Steps Completed
              </div>
            </div>

            <div
              style={{
                background: '#fef3c7',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #fbbf24',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#d97706',
                }}
              >
                {
                  displaySession.steps.filter((s) => s.status === 'in_progress')
                    .length
                }
              </div>
              <div style={{ color: '#d97706', fontSize: '14px' }}>
                In Progress
              </div>
            </div>

            <div
              style={{
                background: '#f3f4f6',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#4b5563',
                }}
              >
                {
                  displaySession.steps.filter((s) => s.status === 'pending')
                    .length
                }
              </div>
              <div style={{ color: '#4b5563', fontSize: '14px' }}>Pending</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fca5a5',
            }}
          >
            {error}
          </div>
        )}

        {/* Steps and Documents Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
          }}
        >
          {/* Onboarding Steps */}
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#1f2937',
                marginBottom: '20px',
                fontSize: '20px',
              }}
            >
              Onboarding Steps
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              {displaySession.steps.map((step, index) => {
                const status = getStepStatus(step);
                const nextAction = getNextAction(step);

                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background:
                        step.status === 'in_progress' ? '#fef3c7' : 'white',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: status.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontSize: '18px',
                      }}
                    >
                      {status.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '5px',
                        }}
                      >
                        {step.name}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginBottom: '10px',
                        }}
                      >
                        {step.description}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: status.color,
                        }}
                      >
                        Status: {status.text}
                      </div>
                    </div>

                    {step.status === 'in_progress' && (
                      <button
                        onClick={() =>
                          handleStepAction(step.id, nextAction.action)
                        }
                        disabled={processingStep === step.id}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor:
                            processingStep === step.id
                              ? 'not-allowed'
                              : 'pointer',
                          opacity: processingStep === step.id ? 0.5 : 1,
                        }}
                      >
                        {processingStep === step.id
                          ? 'Processing...'
                          : nextAction.text}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#1f2937',
                marginBottom: '20px',
                fontSize: '20px',
              }}
            >
              Documents
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              {displaySession.documents.map((doc) => {
                const status = getDocumentStatus(doc);

                return (
                  <div
                    key={doc.id}
                    style={{
                      padding: '15px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '20px',
                          marginRight: '10px',
                        }}
                      >
                        {status.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                          }}
                        >
                          {doc.name}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: status.color,
                            fontWeight: '500',
                          }}
                        >
                          {status.text}
                        </div>
                      </div>
                    </div>

                    {doc.documentUrl && (
                      <a
                        href={doc.documentUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{
                          color: '#3b82f6',
                          fontSize: '12px',
                          textDecoration: 'none',
                        }}
                      >
                        View Document
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <Link
            href='/contractor-onboarding'
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Back to Application
          </Link>

          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractorOnboardingDashboard;
