'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ContractorPortal = () => {
  const searchParams = useSearchParams();
  const [workflowSession, setWorkflowSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingDocument, setSigningDocument] = useState<string | null>(null);

  useEffect(() => {
    loadUserWorkflowSession();
  }, [searchParams]);

  const loadUserWorkflowSession = async () => {
    try {
      // Get user parameters from URL
      const userId = searchParams?.get('userId');
      const userRole = searchParams?.get('userRole');

      // Mock user data based on userId parameter
      const mockUsers = {
        'user-001': {
          id: 'user-001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'Dispatcher',
          department: 'Operations',
          hiredDate: '2024-01-15',
          userIdentifiers: {
            userId: 'JD-DC-2024015',
          },
        },
        'user-002': {
          id: 'user-002',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@example.com',
          role: 'Broker Agent',
          department: 'Sales',
          hiredDate: '2024-01-20',
          userIdentifiers: {
            userId: 'SJ-BB-2024020',
          },
        },
        'user-003': {
          id: 'user-003',
          firstName: 'Mike',
          lastName: 'Wilson',
          email: 'mike.wilson@example.com',
          role: 'Dispatcher',
          department: 'Operations',
          hiredDate: '2024-01-25',
          userIdentifiers: {
            userId: 'MW-DC-2024025',
          },
        },
      };

      const user = mockUsers[userId as keyof typeof mockUsers] || {
        id: userId || 'unknown',
        firstName: 'Unknown',
        lastName: 'User',
        email: 'unknown@example.com',
        role: userRole || 'Unknown',
        department: 'Unknown',
        hiredDate: '2024-01-01',
        userIdentifiers: {
          userId: 'UK-UN-2024001',
        },
      };

      setCurrentUser(user);

      // Mock workflow session based on user
      const mockSession = {
        id: `CWS-${user.id.toUpperCase()}`,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        status: 'active',
        currentStep:
          user.id === 'user-001' ? 4 : user.id === 'user-002' ? 2 : 1,
        steps: [
          {
            id: 'user_verification',
            name: 'User Verification',
            description: 'Verify user identity and role requirements',
            status: 'completed',
            order: 1,
            completedAt: new Date('2024-01-15T10:00:00Z'),
          },
          {
            id: 'document_generation',
            name: 'Document Generation',
            description: 'Generate contractor agreement and NDA',
            status:
              user.id === 'user-001'
                ? 'completed'
                : user.id === 'user-002'
                  ? 'completed'
                  : 'in_progress',
            order: 2,
            completedAt:
              user.id === 'user-001' || user.id === 'user-002'
                ? new Date('2024-01-15T10:05:00Z')
                : undefined,
          },
          {
            id: 'signature_request',
            name: 'Signature Request',
            description: 'Sign required documents',
            status:
              user.id === 'user-001'
                ? 'completed'
                : user.id === 'user-002'
                  ? 'in_progress'
                  : 'pending',
            order: 3,
            completedAt:
              user.id === 'user-001'
                ? new Date('2024-01-15T10:10:00Z')
                : undefined,
          },
          {
            id: 'section_access_creation',
            name: 'Section Access Creation',
            description: 'Create initial section access permissions',
            status: user.id === 'user-001' ? 'completed' : 'pending',
            order: 4,
            completedAt:
              user.id === 'user-001'
                ? new Date('2024-01-15T10:15:00Z')
                : undefined,
          },
          {
            id: 'training_assignment',
            name: 'Training Assignment',
            description: 'Assign required training modules',
            status: user.id === 'user-001' ? 'completed' : 'pending',
            order: 5,
            completedAt:
              user.id === 'user-001'
                ? new Date('2024-01-15T10:20:00Z')
                : undefined,
          },
          {
            id: 'full_access_grant',
            name: 'Full Access Grant',
            description: 'Grant full system access after training',
            status: user.id === 'user-001' ? 'completed' : 'pending',
            order: 6,
            completedAt:
              user.id === 'user-001'
                ? new Date('2024-01-15T10:25:00Z')
                : undefined,
          },
        ],
        signatureRequests:
          user.id === 'user-002'
            ? [
                {
                  id: 'SIG-001',
                  documentType: 'contractor_agreement',
                  status: 'pending',
                  signatureUrl: `/contractor-portal/sign/contractor-agreement?userId=${user.id}`,
                  expiresAt: new Date('2024-01-22T23:59:59Z'),
                },
                {
                  id: 'SIG-002',
                  documentType: 'nda',
                  status: 'pending',
                  signatureUrl: `/contractor-portal/sign/nda?userId=${user.id}`,
                  expiresAt: new Date('2024-01-22T23:59:59Z'),
                },
              ]
            : [],
        systemAccess: {
          currentLevel:
            user.id === 'user-001'
              ? 'full'
              : user.id === 'user-002'
                ? 'limited'
                : 'none',
          sections:
            user.id === 'user-001'
              ? ['dispatch', 'loads', 'drivers', 'reports', 'analytics']
              : user.id === 'user-002'
                ? ['dispatch', 'loads']
                : [],
        },
        trainingRequirements: {
          required: [
            'dispatch_fundamentals',
            'load_management',
            'driver_communication',
            'safety_protocols',
            'system_navigation',
          ],
          completed: [],
          inProgress: [],
          allCompleted: false,
        },
        notifications: [
          {
            id: '1',
            type: 'system',
            message:
              'Welcome to FleetFlow! Please complete your contractor onboarding process.',
            sentAt: new Date('2024-01-15T10:00:00Z'),
            delivered: true,
          },
        ],
        createdAt: new Date('2024-01-15T10:00:00Z'),
        lastActivity: new Date(),
      };

      setWorkflowSession(mockSession);
      setLoading(false);
    } catch (err) {
      console.error('Error loading workflow session:', err);
      setError('Failed to load contractor portal. Please try again.');
      setLoading(false);
    }
  };

  const handleSignDocument = async (
    documentType: string,
    signatureUrl: string
  ) => {
    setSigningDocument(documentType);

    // In a real implementation, this would open the signature interface
    // For now, we'll simulate the signing process
    setTimeout(() => {
      setSigningDocument(null);

      // Update signature status
      if (workflowSession) {
        const updatedSession = { ...workflowSession };
        const signatureRequest = updatedSession.signatureRequests.find(
          (req: any) => req.documentType === documentType
        );
        if (signatureRequest) {
          signatureRequest.status = 'signed';
          signatureRequest.signedAt = new Date();
        }

        // Check if all signatures are complete
        const allSigned = updatedSession.signatureRequests.every(
          (req: any) => req.status === 'signed'
        );
        if (allSigned) {
          // Move to next step
          const currentStepIndex = updatedSession.steps.findIndex(
            (s: any) => s.id === 'signature_request'
          );
          if (currentStepIndex !== -1) {
            updatedSession.steps[currentStepIndex].status = 'completed';
            updatedSession.steps[currentStepIndex].completedAt = new Date();

            // Start next step
            const nextStepIndex = currentStepIndex + 1;
            if (nextStepIndex < updatedSession.steps.length) {
              updatedSession.steps[nextStepIndex].status = 'in_progress';
              updatedSession.currentStep = nextStepIndex;
            }
          }
        }

        setWorkflowSession(updatedSession);
      }
    }, 2000);
  };

  const getStepStatus = (step: any) => {
    switch (step.status) {
      case 'completed':
        return {
          color: '#10b981',
          icon: '✅',
          text: 'Completed',
          bgColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 0.4)',
        };
      case 'in_progress':
        return {
          color: '#f59e0b',
          icon: '⏳',
          text: 'In Progress',
          bgColor: 'rgba(245, 158, 11, 0.2)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
        };
      case 'pending':
        return {
          color: '#ef4444',
          icon: '⭕',
          text: 'Pending',
          bgColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgba(239, 68, 68, 0.4)',
        };
      default:
        return {
          color: '#6b7280',
          icon: '⭕',
          text: 'Unknown',
          bgColor: 'rgba(107, 114, 128, 0.2)',
          borderColor: 'rgba(107, 114, 128, 0.4)',
        };
    }
  };

  const getSignatureStatus = (request: any) => {
    switch (request.status) {
      case 'signed':
        return { color: '#10b981', icon: '✅', text: 'Signed' };
      case 'pending':
        return { color: '#f59e0b', icon: '📝', text: 'Awaiting Signature' };
      case 'expired':
        return { color: '#ef4444', icon: '⏰', text: 'Expired' };
      default:
        return { color: '#6b7280', icon: '⭕', text: 'Unknown' };
    }
  };

  const getProgressPercentage = () => {
    if (!workflowSession) return 0;
    const completedSteps = workflowSession.steps.filter(
      (s: any) => s.status === 'completed'
    ).length;
    return Math.round((completedSteps / workflowSession.steps.length) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 33) {
      // Red-Orange for 0-33%
      return 'linear-gradient(90deg, #ef4444, #f97316)';
    } else if (percentage <= 66) {
      // Yellow for 34-66%
      return 'linear-gradient(90deg, #f59e0b, #eab308)';
    } else {
      // Green for 67-100%
      return 'linear-gradient(90deg, #10b981, #059669)';
    }
  };

  const getDocumentDisplayName = (documentType: string) => {
    const names = {
      contractor_agreement: 'Independent Contractor Agreement',
      nda: 'Non-Disclosure Agreement',
      w9: 'W-9 Tax Form',
      insurance_cert: 'Insurance Certificate',
    };
    return names[documentType as keyof typeof names] || documentType;
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
          Loading your onboarding portal...
        </div>
      </div>
    );
  }

  if (error) {
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
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <div
            style={{ color: '#ef4444', fontSize: '18px', marginBottom: '10px' }}
          >
            Error
          </div>
          <div style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</div>
          <button
            onClick={loadUserWorkflowSession}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 🔧 ENHANCED HEADER - Unified Portal Style with Blue Theme */}
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
                <div style={{ fontSize: '32px' }}>📋</div>
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
                  FleetFlow Transportation
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '18px',
                      fontWeight: '600',
                    }}
                  >
                    Independent Contractor Portal
                  </span>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '16px',
                  }}
                >
                  Welcome, {currentUser?.firstName} {currentUser?.lastName} •{' '}
                  {currentUser?.role}
                </div>
              </div>
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                Status
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '12px',
                }}
              >
                {workflowSession?.status?.toUpperCase() || 'IN PROGRESS'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
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
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '24px',
                margin: 0,
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Onboarding Progress
            </h3>
            <div
              style={{
                background:
                  workflowSession?.status === 'completed'
                    ? '#10b981'
                    : '#f59e0b',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {workflowSession?.status?.toUpperCase() || 'IN PROGRESS'}
            </div>
          </div>

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
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                overflow: 'hidden',
                marginRight: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: `${getProgressPercentage()}%`,
                  height: '100%',
                  background: getProgressColor(getProgressPercentage()),
                  transition: 'width 0.5s ease, background 0.5s ease',
                }}
              />
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {getProgressPercentage()}%
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
                background: 'rgba(59, 130, 246, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {workflowSession?.steps?.filter(
                  (s: any) => s.status === 'completed'
                ).length || 0}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Steps Completed
              </div>
            </div>

            <div
              style={{
                background: 'rgba(251, 191, 36, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {workflowSession?.signatureRequests?.filter(
                  (r: any) => r.status === 'pending'
                ).length || 0}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Signatures Pending
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {workflowSession?.trainingRequirements?.completed?.length || 0}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Training Completed
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
          }}
        >
          {/* Workflow Steps */}
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
            <h3
              style={{
                color: 'white',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Onboarding Steps
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              {workflowSession?.steps?.map((step: any, index: number) => {
                const status = getStepStatus(step);

                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px',
                      border: `2px solid ${status.borderColor}`,
                      borderRadius: '12px',
                      background: status.bgColor,
                      backdropFilter: 'blur(5px)',
                      boxShadow: `0 4px 12px ${status.borderColor}`,
                      transition: 'all 0.3s ease',
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
                        border: `2px solid ${status.borderColor}`,
                        boxShadow: `0 0 8px ${status.borderColor}`,
                      }}
                    >
                      {status.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '5px',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        }}
                      >
                        {step.name}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '10px',
                        }}
                      >
                        {step.description}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Status: {status.text}
                      </div>
                      {step.completedAt && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginTop: '5px',
                          }}
                        >
                          Completed:{' '}
                          {new Date(step.completedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Signature Requests */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                📝 Document Signatures
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {workflowSession?.signatureRequests?.map((request: any) => {
                  const status = getSignatureStatus(request);

                  return (
                    <div
                      key={request.id}
                      style={{
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        background:
                          request.status === 'pending'
                            ? 'rgba(251, 191, 36, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          }}
                        >
                          {getDocumentDisplayName(request.documentType)}
                        </div>
                        <div
                          style={{
                            fontSize: '16px',
                          }}
                        >
                          {status.icon}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '500',
                          marginBottom: '10px',
                        }}
                      >
                        {status.text}
                      </div>

                      {request.status === 'pending' && (
                        <button
                          onClick={() =>
                            handleSignDocument(
                              request.documentType,
                              request.signatureUrl
                            )
                          }
                          disabled={signingDocument === request.documentType}
                          style={{
                            background:
                              signingDocument === request.documentType
                                ? 'rgba(107, 114, 128, 0.8)'
                                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            backdropFilter: 'blur(5px)',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            cursor:
                              signingDocument === request.documentType
                                ? 'not-allowed'
                                : 'pointer',
                            width: '100%',
                          }}
                        >
                          {signingDocument === request.documentType
                            ? 'Signing...'
                            : 'Sign Document'}
                        </button>
                      )}

                      {request.signedAt && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '5px',
                          }}
                        >
                          Signed: {new Date(request.signedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Training Requirements */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                📚 Training Requirements
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Progress:
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {workflowSession?.trainingRequirements?.completed?.length ||
                    0}{' '}
                  /{' '}
                  {workflowSession?.trainingRequirements?.required?.length || 0}
                </span>
              </div>

              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '15px',
                }}
              >
                Complete your training to unlock full system access.
              </div>

              <button
                onClick={() => (window.location.href = '/training')}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                📖 Start Training
              </button>
            </div>

            {/* System Access */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                🔐 System Access
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Status:
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: workflowSession?.systemAccess?.granted
                      ? '#10b981'
                      : '#f59e0b',
                    background: workflowSession?.systemAccess?.granted
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(245, 158, 11, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {workflowSession?.systemAccess?.granted
                    ? 'GRANTED'
                    : 'PENDING'}
                </span>
              </div>

              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '15px',
                }}
              >
                {workflowSession?.systemAccess?.granted
                  ? 'You have initial system access. Complete training for full access.'
                  : 'System access will be granted after document signing.'}
              </div>

              {workflowSession?.systemAccess?.restrictions?.length > 0 && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'white',
                    background: 'rgba(245, 158, 11, 0.2)',
                    backdropFilter: 'blur(5px)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                  }}
                >
                  Restrictions:{' '}
                  {workflowSession.systemAccess.restrictions.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href='/settings'
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            ⚙️ Settings
          </Link>

          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 8px 25px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            🔄 Refresh Status
          </button>

          <Link
            href='/help'
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            ❓ Get Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContractorPortal;
