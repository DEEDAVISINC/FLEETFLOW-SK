'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getCurrentUser, checkPermission } from '../config/access'
import CertificationSystem from '../components/CertificationSystem'
import { dispatchQuizQuestions, brokerQuizQuestions } from '../data/quizQuestions'

export default function WorkflowTrainingPage() {
  const { user } = getCurrentUser()
  const hasManagementAccess = checkPermission('hasManagementAccess')
  const [selectedRole, setSelectedRole] = useState<'dispatcher' | 'driver'>('dispatcher')
  const [selectedModule, setSelectedModule] = useState<string>('overview')
  const [showQuiz, setShowQuiz] = useState<string | null>(null)
  const [certificates, setCertificates] = useState<any[]>([])

  const handleCertificationEarned = (certificate: any) => {
    setCertificates(prev => [...prev, certificate])
    localStorage.setItem('fleetflow_workflow_certificates', JSON.stringify([...certificates, certificate]))
  }

  // Workflow training modules for Dispatchers
  const dispatcherModules = [
    {
      id: 'overview',
      title: '🌟 FleetFlow Ecosystem Overview',
      duration: '30 minutes',
      level: 'Essential',
      description: 'Master the complete FleetFlow workflow ecosystem and interconnected processes',
      sections: [
        {
          title: 'Dashboard Navigation',
          content: 'Learn to navigate the main dashboard and access all key features efficiently',
          interactive: true,
          demo: '/dashboard-demo'
        },
        {
          title: 'Workflow Connections',
          content: 'Understand how each module connects to create seamless operations',
          interactive: true,
          demo: '/workflow-demo'
        },
        {
          title: 'Quick Actions & Shortcuts',
          content: 'Master keyboard shortcuts and quick action buttons for maximum efficiency',
          interactive: true,
          demo: '/shortcuts-demo'
        }
      ]
    },
    {
      id: 'dispatch-flow',
      title: '🚛 Dispatch Workflow Mastery',
      duration: '45 minutes',
      level: 'Core',
      description: 'Complete dispatcher workflow from load creation to delivery confirmation',
      sections: [
        {
          title: 'Load Creation & Assignment',
          content: 'Create loads, assign drivers, and set up delivery schedules',
          interactive: true,
          demo: '/load-creation-demo'
        },
        {
          title: 'Real-time Tracking',
          content: 'Monitor driver locations, delivery progress, and handle updates',
          interactive: true,
          demo: '/tracking-demo'
        },
        {
          title: 'Communication Hub',
          content: 'Manage driver communications, customer updates, and issue resolution',
          interactive: true,
          demo: '/communication-demo'
        },
        {
          title: 'Delivery Confirmation',
          content: 'Process PODs, photos, signatures, and complete delivery workflows',
          interactive: true,
          demo: '/delivery-demo'
        }
      ]
    },
    {
      id: 'broker-flow',
      title: '🤝 Brokerage Workflow Integration',
      duration: '40 minutes',
      level: 'Advanced',
      description: 'Manage carrier relationships and freight brokerage operations',
      sections: [
        {
          title: 'Carrier Network Management',
          content: 'Add carriers, manage relationships, and track performance metrics',
          interactive: true,
          demo: '/carrier-demo'
        },
        {
          title: 'Load Posting & Matching',
          content: 'Post loads to load boards and match with available carriers',
          interactive: true,
          demo: '/matching-demo'
        },
        {
          title: 'Rate Negotiation Tools',
          content: 'Use built-in tools for rate calculations and negotiations',
          interactive: true,
          demo: '/negotiation-demo'
        }
      ]
    },
    {
      id: 'compliance-flow',
      title: '⚖️ Compliance Workflow Management',
      duration: '35 minutes',
      level: 'Essential',
      description: 'Ensure DOT compliance and manage regulatory requirements',
      sections: [
        {
          title: 'Driver Compliance Monitoring',
          content: 'Track HOS, medical certificates, and license renewals',
          interactive: true,
          demo: '/compliance-monitoring-demo'
        },
        {
          title: 'Vehicle Inspection Workflows',
          content: 'Manage DVIR submissions and vehicle maintenance schedules',
          interactive: true,
          demo: '/inspection-demo'
        },
        {
          title: 'Safety Score Management',
          content: 'Monitor CSA scores and implement corrective actions',
          interactive: true,
          demo: '/safety-score-demo'
        }
      ]
    }
  ]

  // Workflow training modules for Drivers
  const driverModules = [
    {
      id: 'mobile-overview',
      title: '📱 FleetFlow Mobile Mastery',
      duration: '25 minutes',
      level: 'Essential',
      description: 'Master the FleetFlow mobile app for seamless on-the-road operations',
      sections: [
        {
          title: 'Mobile App Navigation',
          content: 'Learn to navigate the mobile interface and access key features',
          interactive: true,
          demo: '/mobile-nav-demo'
        },
        {
          title: 'Load Acceptance Workflow',
          content: 'Accept loads, view details, and confirm availability',
          interactive: true,
          demo: '/load-accept-demo'
        },
        {
          title: 'GPS & Navigation Integration',
          content: 'Use integrated GPS and receive optimized route suggestions',
          interactive: true,
          demo: '/gps-demo'
        }
      ]
    },
    {
      id: 'delivery-workflow',
      title: '📦 Delivery Workflow Excellence',
      duration: '35 minutes',
      level: 'Core',
      description: 'Complete delivery process from pickup to POD submission',
      sections: [
        {
          title: 'Pickup Confirmation',
          content: 'Confirm pickups, take photos, and update load status',
          interactive: true,
          demo: '/pickup-demo'
        },
        {
          title: 'En-Route Updates',
          content: 'Provide real-time updates and communicate delays',
          interactive: true,
          demo: '/enroute-demo'
        },
        {
          title: 'Delivery Process',
          content: 'Complete deliveries with photos, signatures, and POD submission',
          interactive: true,
          demo: '/delivery-process-demo'
        },
        {
          title: 'Documentation Upload',
          content: 'Upload BOLs, receipts, and other required documentation',
          interactive: true,
          demo: '/documentation-demo'
        }
      ]
    },
    {
      id: 'communication-flow',
      title: '💬 Communication Workflow',
      duration: '20 minutes',
      level: 'Essential',
      description: 'Effective communication with dispatch and customers',
      sections: [
        {
          title: 'Dispatch Communication',
          content: 'Use in-app messaging and quick status updates',
          interactive: true,
          demo: '/dispatch-comm-demo'
        },
        {
          title: 'Customer Updates',
          content: 'Send automated and manual customer notifications',
          interactive: true,
          demo: '/customer-updates-demo'
        },
        {
          title: 'Emergency Protocols',
          content: 'Handle breakdowns, accidents, and emergency situations',
          interactive: true,
          demo: '/emergency-demo'
        }
      ]
    },
    {
      id: 'compliance-driver',
      title: '📋 Driver Compliance Workflow',
      duration: '30 minutes',
      level: 'Essential',
      description: 'Maintain compliance with HOS and safety regulations',
      sections: [
        {
          title: 'HOS Management',
          content: 'Log hours, manage duty status, and avoid violations',
          interactive: true,
          demo: '/hos-demo'
        },
        {
          title: 'DVIR Submissions',
          content: 'Complete daily vehicle inspections and report issues',
          interactive: true,
          demo: '/dvir-demo'
        },
        {
          title: 'Document Management',
          content: 'Upload licenses, medical certificates, and training records',
          interactive: true,
          demo: '/driver-docs-demo'
        }
      ]
    }
  ]

  const currentModules = selectedRole === 'dispatcher' ? dispatcherModules : driverModules
  const selectedModuleData = currentModules.find(m => m.id === selectedModule) || currentModules[0]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '40px'
    }}>
      {/* Navigation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px 20px',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}>
            🚛 FleetFlow
          </Link>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link href="/training" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                ← All Training
              </button>
            </Link>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          margin: '0 auto',
          maxWidth: '900px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 16px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🔄 Workflow Ecosystem Training
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 24px 0',
            lineHeight: '1.6'
          }}>
            Master the complete FleetFlow workflow ecosystem for seamless operations
          </p>

          {/* Role Selection */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginTop: '20px'
          }}>
            <button
              onClick={() => setSelectedRole('dispatcher')}
              style={{
                background: selectedRole === 'dispatcher' 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedRole === 'dispatcher' ? '#667eea' : 'white',
                border: selectedRole === 'dispatcher' 
                  ? '2px solid rgba(255, 255, 255, 0.9)' 
                  : '1px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 24px',
                borderRadius: '20px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
            >
              🎯 Dispatcher Training
            </button>
            <button
              onClick={() => setSelectedRole('driver')}
              style={{
                background: selectedRole === 'driver' 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedRole === 'driver' ? '#667eea' : 'white',
                border: selectedRole === 'driver' 
                  ? '2px solid rgba(255, 255, 255, 0.9)' 
                  : '1px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 24px',
                borderRadius: '20px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
            >
              🚛 Driver Training
            </button>
          </div>

          {/* User Info */}
          {hasManagementAccess && (
            <div style={{
              marginTop: '20px',
              display: 'inline-block',
              padding: '8px 16px',
              background: 'rgba(76, 175, 80, 0.3)',
              border: '1px solid rgba(76, 175, 80, 0.5)',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#4CAF50',
              fontWeight: '600'
            }}>
              🔐 Training Access | Role: {user?.role?.toUpperCase() || 'TRAINEE'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '30px'
      }}>
        {/* Module Sidebar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {selectedRole === 'dispatcher' ? '🎯 Dispatcher Modules' : '🚛 Driver Modules'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentModules.map(module => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                style={{
                  background: selectedModule === module.id 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'rgba(249, 250, 251, 0.8)',
                  color: selectedModule === module.id ? 'white' : '#374151',
                  border: selectedModule === module.id 
                    ? 'none' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {module.title}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  opacity: selectedModule === module.id ? 0.9 : 0.7 
                }}>
                  {module.duration} • {module.level}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Module Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                {selectedModuleData.title}
              </h2>
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <span style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {selectedModuleData.level}
                </span>
                <span style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#374151',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  ⏱️ {selectedModuleData.duration}
                </span>
              </div>
            </div>
          </div>

          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '32px',
            fontSize: '1.1rem'
          }}>
            {selectedModuleData.description}
          </p>

          {/* Training Sections */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {selectedModuleData.sections.map((section, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(249, 250, 251, 0.8)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h4 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    {index + 1}. {section.title}
                  </h4>
                  {section.interactive && (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      🎮 Interactive
                    </span>
                  )}
                </div>
                
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginBottom: '16px'
                }}>
                  {section.content}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    📖 Start Lesson
                  </button>
                  {section.interactive && (
                    <button style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      🎮 Interactive Demo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Tracking */}
          <div style={{
            marginTop: '40px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
            borderRadius: '16px',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px'
            }}>
              📊 Training Progress
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
              fontSize: '0.9rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📚</div>
                <div style={{ fontWeight: '600', color: '#374151' }}>0/{selectedModuleData.sections.length}</div>
                <div style={{ color: '#6b7280' }}>Lessons</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>⏱️</div>
                <div style={{ fontWeight: '600', color: '#374151' }}>0%</div>
                <div style={{ color: '#6b7280' }}>Complete</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🏆</div>
                <div style={{ fontWeight: '600', color: '#374151' }}>0/1</div>
                <div style={{ color: '#6b7280' }}>Certificate</div>
              </div>
            </div>

            {/* Certification Button */}
            {(selectedModule === 'dispatch-flow' || selectedModule === 'broker-flow') && (
              <div style={{
                marginTop: '24px',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => setShowQuiz(selectedModule === 'dispatch-flow' ? 'dispatch' : 'broker')}
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  🏆 Take Certification Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Integration Info */}
      <div style={{
        textAlign: 'center',
        marginTop: '60px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          margin: '0 auto',
          maxWidth: '800px',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px'
          }}>
            🔄 Complete Workflow Ecosystem
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontWeight: '600' }}>Dispatch Operations</div>
              <div style={{ opacity: 0.8 }}>Load management & tracking</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚛</div>
              <div style={{ fontWeight: '600' }}>Driver Mobile App</div>
              <div style={{ opacity: 0.8 }}>On-the-road operations</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚖️</div>
              <div style={{ fontWeight: '600' }}>Compliance Management</div>
              <div style={{ opacity: 0.8 }}>DOT & safety requirements</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
              <div style={{ fontWeight: '600' }}>Analytics & Reporting</div>
              <div style={{ opacity: 0.8 }}>Performance insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Quiz Overlay */}
      {showQuiz && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowQuiz(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                zIndex: 2001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
            
            {showQuiz === 'dispatch' && (
              <CertificationSystem
                moduleId="workflow-dispatch"
                moduleTitle="Dispatcher Workflow Mastery Certification"
                questions={dispatchQuizQuestions}
                passingScore={80}
                onCertificationEarned={handleCertificationEarned}
              />
            )}
            
            {showQuiz === 'broker' && (
              <CertificationSystem
                moduleId="workflow-broker"
                moduleTitle="Brokerage Workflow Excellence Certification"
                questions={brokerQuizQuestions}
                passingScore={85}
                onCertificationEarned={handleCertificationEarned}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
