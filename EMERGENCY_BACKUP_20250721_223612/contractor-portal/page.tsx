'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ContractorWorkflowService from '../services/ContractorWorkflowService'

const ContractorPortal = () => {
  const searchParams = useSearchParams()
  const [workflowSession, setWorkflowSession] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [signingDocument, setSigningDocument] = useState<string | null>(null)

  useEffect(() => {
    loadUserWorkflowSession()
  }, [searchParams])

  const loadUserWorkflowSession = async () => {
    try {
      // Get user parameters from URL
      const userId = searchParams?.get('userId')
      const userRole = searchParams?.get('userRole')
      
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
            userId: 'JD-DC-2024015'
          }
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
            userId: 'SJ-BB-2024020'
          }
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
            userId: 'MW-DC-2024025'
          }
        }
      }

      const user = mockUsers[userId as keyof typeof mockUsers] || {
        id: userId || 'unknown',
        firstName: 'Unknown',
        lastName: 'User',
        email: 'unknown@example.com',
        role: userRole || 'Unknown',
        department: 'Unknown',
        hiredDate: '2024-01-01',
        userIdentifiers: {
          userId: 'UK-UN-2024001'
        }
      }

      setCurrentUser(user)

      // Mock workflow session based on user
      const mockSession = {
        id: `CWS-${user.id.toUpperCase()}`,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        status: 'active',
        currentStep: user.id === 'user-001' ? 4 : user.id === 'user-002' ? 2 : 1,
        steps: [
          {
            id: 'user_verification',
            name: 'User Verification',
            description: 'Verify user identity and role requirements',
            status: 'completed',
            order: 1,
            completedAt: new Date('2024-01-15T10:00:00Z')
          },
          {
            id: 'document_generation',
            name: 'Document Generation',
            description: 'Generate contractor agreement and NDA',
            status: user.id === 'user-001' ? 'completed' : user.id === 'user-002' ? 'completed' : 'in_progress',
            order: 2,
            completedAt: user.id === 'user-001' || user.id === 'user-002' ? new Date('2024-01-15T10:05:00Z') : undefined
          },
          {
            id: 'signature_request',
            name: 'Signature Request',
            description: 'Sign required documents',
            status: user.id === 'user-001' ? 'completed' : user.id === 'user-002' ? 'in_progress' : 'pending',
            order: 3,
            completedAt: user.id === 'user-001' ? new Date('2024-01-15T10:10:00Z') : undefined
          },
          {
            id: 'section_access_creation',
            name: 'Section Access Creation',
            description: 'Create initial section access permissions',
            status: user.id === 'user-001' ? 'completed' : 'pending',
            order: 4,
            completedAt: user.id === 'user-001' ? new Date('2024-01-15T10:15:00Z') : undefined
          },
          {
            id: 'training_assignment',
            name: 'Training Assignment',
            description: 'Assign required training modules',
            status: user.id === 'user-001' ? 'completed' : 'pending',
            order: 5,
            completedAt: user.id === 'user-001' ? new Date('2024-01-15T10:20:00Z') : undefined
          },
          {
            id: 'full_access_grant',
            name: 'Full Access Grant',
            description: 'Grant full system access after training',
            status: user.id === 'user-001' ? 'completed' : 'pending',
            order: 6,
            completedAt: user.id === 'user-001' ? new Date('2024-01-15T10:25:00Z') : undefined
          }
        ],
        signatureRequests: user.id === 'user-002' ? [
          {
            id: 'SIG-001',
            documentType: 'contractor_agreement',
            status: 'pending',
            signatureUrl: `/contractor-portal/sign/contractor-agreement?userId=${user.id}`,
            expiresAt: new Date('2024-01-22T23:59:59Z')
          },
          {
            id: 'SIG-002',
            documentType: 'nda',
            status: 'pending',
            signatureUrl: `/contractor-portal/sign/nda?userId=${user.id}`,
            expiresAt: new Date('2024-01-22T23:59:59Z')
          }
        ] : [],
        systemAccess: {
          currentLevel: user.id === 'user-001' ? 'full' : user.id === 'user-002' ? 'limited' : 'none',
          sections: user.id === 'user-001' ? ['dispatch', 'loads', 'drivers', 'reports', 'analytics'] : 
                   user.id === 'user-002' ? ['dispatch', 'loads'] : []
        },
        trainingRequirements: {
          required: ['dispatch_fundamentals', 'load_management', 'driver_communication', 'safety_protocols', 'system_navigation'],
          completed: [],
          inProgress: [],
          allCompleted: false
        },
        notifications: [
          {
            id: '1',
            type: 'system',
            message: 'Welcome to FleetFlow! Please complete your contractor onboarding process.',
            sentAt: new Date('2024-01-15T10:00:00Z'),
            delivered: true
          }
        ],
        createdAt: new Date('2024-01-15T10:00:00Z'),
        lastActivity: new Date()
      }

      setWorkflowSession(mockSession)
      setLoading(false)
    } catch (err) {
      console.error('Error loading workflow session:', err)
      setError('Failed to load contractor portal. Please try again.')
      setLoading(false)
    }
  }

  const handleSignDocument = async (documentType: string, signatureUrl: string) => {
    setSigningDocument(documentType)
    
    // In a real implementation, this would open the signature interface
    // For now, we'll simulate the signing process
    setTimeout(() => {
      setSigningDocument(null)
      
      // Update signature status
      if (workflowSession) {
        const updatedSession = { ...workflowSession }
        const signatureRequest = updatedSession.signatureRequests.find((req: any) => req.documentType === documentType)
        if (signatureRequest) {
          signatureRequest.status = 'signed'
          signatureRequest.signedAt = new Date()
        }
        
        // Check if all signatures are complete
        const allSigned = updatedSession.signatureRequests.every((req: any) => req.status === 'signed')
        if (allSigned) {
          // Move to next step
          const currentStepIndex = updatedSession.steps.findIndex((s: any) => s.id === 'signature_request')
          if (currentStepIndex !== -1) {
            updatedSession.steps[currentStepIndex].status = 'completed'
            updatedSession.steps[currentStepIndex].completedAt = new Date()
            
            // Start next step
            const nextStepIndex = currentStepIndex + 1
            if (nextStepIndex < updatedSession.steps.length) {
              updatedSession.steps[nextStepIndex].status = 'in_progress'
              updatedSession.currentStep = nextStepIndex
            }
          }
        }
        
        setWorkflowSession(updatedSession)
      }
    }, 2000)
  }

  const getStepStatus = (step: any) => {
    switch (step.status) {
      case 'completed':
        return { color: '#10b981', icon: '✅', text: 'Completed' }
      case 'in_progress':
        return { color: '#f59e0b', icon: '⏳', text: 'In Progress' }
      case 'pending':
        return { color: '#6b7280', icon: '⭕', text: 'Pending' }
      default:
        return { color: '#6b7280', icon: '⭕', text: 'Unknown' }
    }
  }

  const getSignatureStatus = (request: any) => {
    switch (request.status) {
      case 'signed':
        return { color: '#10b981', icon: '✅', text: 'Signed' }
      case 'pending':
        return { color: '#f59e0b', icon: '📝', text: 'Awaiting Signature' }
      case 'expired':
        return { color: '#ef4444', icon: '⏰', text: 'Expired' }
      default:
        return { color: '#6b7280', icon: '⭕', text: 'Unknown' }
    }
  }

  const getProgressPercentage = () => {
    if (!workflowSession) return 0
    const completedSteps = workflowSession.steps.filter((s: any) => s.status === 'completed').length
    return Math.round((completedSteps / workflowSession.steps.length) * 100)
  }

  const getDocumentDisplayName = (documentType: string) => {
    const names = {
      'contractor_agreement': 'Independent Contractor Agreement',
      'nda': 'Non-Disclosure Agreement',
      'w9': 'W-9 Tax Form',
      'insurance_cert': 'Insurance Certificate'
    }
    return names[documentType as keyof typeof names] || documentType
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading your onboarding portal...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ color: '#ef4444', fontSize: '18px', marginBottom: '10px' }}>Error</div>
          <div style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</div>
          <button
            onClick={loadUserWorkflowSession}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{
              color: 'white',
              fontSize: '32px',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              🚛 FleetFlow Transportation
            </h1>
          </Link>
          <h2 style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '24px',
            fontWeight: 'normal',
            marginBottom: '10px'
          }}>
            Contractor Portal
          </h2>
          <div style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px'
          }}>
            Welcome, {currentUser?.firstName} {currentUser?.lastName}
          </div>
        </div>

        {/* Progress Overview */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#1f2937', fontSize: '20px', margin: 0 }}>
              Onboarding Progress
            </h3>
            <div style={{
              background: workflowSession?.status === 'completed' ? '#10b981' : '#f59e0b',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {workflowSession?.status?.toUpperCase() || 'IN PROGRESS'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              flex: 1,
              height: '12px',
              background: '#e5e7eb',
              borderRadius: '6px',
              overflow: 'hidden',
              marginRight: '20px'
            }}>
              <div style={{
                width: `${getProgressPercentage()}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              {getProgressPercentage()}%
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: '#f0f9ff',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #bae6fd',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>
                {workflowSession?.steps?.filter((s: any) => s.status === 'completed').length || 0}
              </div>
              <div style={{ color: '#0369a1', fontSize: '14px' }}>
                Steps Completed
              </div>
            </div>
            
            <div style={{
              background: '#fef3c7',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #fbbf24',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                {workflowSession?.signatureRequests?.filter((r: any) => r.status === 'pending').length || 0}
              </div>
              <div style={{ color: '#d97706', fontSize: '14px' }}>
                Signatures Pending
              </div>
            </div>
            
            <div style={{
              background: '#ecfdf5',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {workflowSession?.trainingRequirements?.completed?.length || 0}
              </div>
              <div style={{ color: '#16a34a', fontSize: '14px' }}>
                Training Completed
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px'
        }}>
          {/* Workflow Steps */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#1f2937', marginBottom: '20px', fontSize: '20px' }}>
              Onboarding Steps
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {workflowSession?.steps?.map((step: any, index: number) => {
                const status = getStepStatus(step)
                
                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: step.status === 'in_progress' ? '#fef3c7' : 'white'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: status.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      fontSize: '18px'
                    }}>
                      {status.icon}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '5px'
                      }}>
                        {step.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '10px'
                      }}>
                        {step.description}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: status.color
                      }}>
                        Status: {status.text}
                      </div>
                      {step.completedAt && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginTop: '5px'
                        }}>
                          Completed: {new Date(step.completedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Items */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Signature Requests */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#1f2937', marginBottom: '15px', fontSize: '18px' }}>
                📝 Document Signatures
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {workflowSession?.signatureRequests?.map((request: any) => {
                  const status = getSignatureStatus(request)
                  
                  return (
                    <div
                      key={request.id}
                      style={{
                        padding: '15px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: request.status === 'pending' ? '#fef3c7' : 'white'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>
                          {getDocumentDisplayName(request.documentType)}
                        </div>
                        <div style={{
                          fontSize: '16px'
                        }}>
                          {status.icon}
                        </div>
                      </div>
                      
                      <div style={{
                        fontSize: '12px',
                        color: status.color,
                        fontWeight: '500',
                        marginBottom: '10px'
                      }}>
                        {status.text}
                      </div>
                      
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleSignDocument(request.documentType, request.signatureUrl)}
                          disabled={signingDocument === request.documentType}
                          style={{
                            background: signingDocument === request.documentType ? '#6b7280' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: signingDocument === request.documentType ? 'not-allowed' : 'pointer',
                            width: '100%'
                          }}
                        >
                          {signingDocument === request.documentType ? 'Signing...' : 'Sign Document'}
                        </button>
                      )}
                      
                      {request.signedAt && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginTop: '5px'
                        }}>
                          Signed: {new Date(request.signedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Training Requirements */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#1f2937', marginBottom: '15px', fontSize: '18px' }}>
                📚 Training Requirements
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  Progress:
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {workflowSession?.trainingRequirements?.completed?.length || 0} / {workflowSession?.trainingRequirements?.required?.length || 0}
                </span>
              </div>
              
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '15px'
              }}>
                Complete your training to unlock full system access.
              </div>
              
              <button
                onClick={() => window.location.href = '/training'}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                📖 Start Training
              </button>
            </div>

            {/* System Access */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#1f2937', marginBottom: '15px', fontSize: '18px' }}>
                🔐 System Access
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  Status:
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: workflowSession?.systemAccess?.granted ? '#10b981' : '#f59e0b',
                  background: workflowSession?.systemAccess?.granted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {workflowSession?.systemAccess?.granted ? 'GRANTED' : 'PENDING'}
                </span>
              </div>
              
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '15px'
              }}>
                {workflowSession?.systemAccess?.granted
                  ? 'You have initial system access. Complete training for full access.'
                  : 'System access will be granted after document signing.'}
              </div>
              
              {workflowSession?.systemAccess?.restrictions?.length > 0 && (
                <div style={{
                  fontSize: '12px',
                  color: '#f59e0b',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '8px',
                  borderRadius: '4px'
                }}>
                  Restrictions: {workflowSession.systemAccess.restrictions.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/settings"
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ⚙️ Settings
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Status
          </button>
          
          <Link
            href="/help"
            style={{
              background: '#f59e0b',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ❓ Get Help
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ContractorPortal 