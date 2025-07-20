'use client';

import React, { useState, useEffect } from 'react';

interface TrainingProps {
  userRole: 'dispatcher' | 'broker';
  userName: string;
  onTrainingComplete: (certificateData: any) => void;
}

interface TrainingModule {
  id: number;
  title: string;
  description: string;
  content: string[];
  assessment: {
    question: string;
    options: string[];
    correct: number;
  };
  roleSpecific?: {
    dispatcher?: string[];
    broker?: string[];
  };
}

export const CarrierOnboardWorkflowTraining: React.FC<TrainingProps> = ({
  userRole,
  userName,
  onTrainingComplete
}) => {
  const [currentModule, setCurrentModule] = useState(0);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<number[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const trainingModules: TrainingModule[] = [
    {
      id: 1,
      title: "🎯 System Overview & Navigation",
      description: "Master the FleetFlow carrier onboarding interface and workflow navigation",
      content: [
        "Welcome to the FleetFlow Carrier Onboarding Workflow training! This comprehensive system automates the entire carrier registration process.",
        "The main dashboard provides real-time visibility into all carrier applications, with color-coded status indicators for quick assessment.",
        "Green indicators show completed steps, yellow indicates in-progress items, and red alerts require immediate attention.",
        "Navigation is intuitive - use the sidebar menu to access different sections: New Applications, Document Review, Verification Status, and Completed Onboarding.",
        "The search and filter functions help you quickly locate specific carriers or applications based on various criteria."
      ],
      assessment: {
        question: "What color indicator shows that a carrier application step requires immediate attention?",
        options: ["Green", "Yellow", "Red", "Blue"],
        correct: 2
      },
      roleSpecific: {
        dispatcher: [
          "As a dispatcher, you'll primarily monitor carrier status and coordinate with operations.",
          "Focus on the real-time tracking features and communication tools for carrier coordination."
        ],
        broker: [
          "As a broker, you'll oversee the complete onboarding process and ensure compliance standards.",
          "Pay attention to regulatory requirements and documentation verification workflows."
        ]
      }
    },
    {
      id: 2,
      title: "📋 Document Verification Process",
      description: "Learn the automated document processing and verification protocols",
      content: [
        "Our AI-powered document verification system automatically processes and validates all carrier documentation.",
        "Required documents include: Operating Authority, Insurance Certificates, W-9 Forms, Safety Records, and Driver Qualifications.",
        "The system performs real-time verification against FMCSA databases and insurance provider APIs.",
        "Document quality is automatically assessed - blurry, incomplete, or expired documents are flagged for manual review.",
        "Verification status is updated in real-time, with automated notifications sent to carriers for any missing or rejected documents."
      ],
      assessment: {
        question: "Which database does the system check for real-time verification?",
        options: ["IRS Database", "FMCSA Database", "State DMV", "Insurance Registry"],
        correct: 1
      },
      roleSpecific: {
        dispatcher: [
          "Monitor document status and assist carriers with upload issues or questions.",
          "Use the quick-reference guide for common document problems and solutions."
        ],
        broker: [
          "Review flagged documents and make final approval decisions.",
          "Ensure all regulatory requirements are met before proceeding to next steps."
        ]
      }
    },
    {
      id: 3,
      title: "⚡ Automated Workflow Management",
      description: "Understand the 24-hour automated onboarding workflow and intervention points",
      content: [
        "The system follows a structured 24-hour workflow designed for maximum efficiency and compliance.",
        "Hour 0-2: Initial application review and automated document verification begins.",
        "Hour 2-8: Insurance verification, FMCSA safety record checks, and background screening.",
        "Hour 8-16: Manual review of flagged items, compliance verification, and final documentation.",
        "Hour 16-24: Final approval process, agreement generation, and welcome package delivery.",
        "Intervention points are clearly marked where human oversight is required or recommended."
      ],
      assessment: {
        question: "During which time period does manual review of flagged items typically occur?",
        options: ["Hour 0-2", "Hour 2-8", "Hour 8-16", "Hour 16-24"],
        correct: 2
      },
      roleSpecific: {
        dispatcher: [
          "Track workflow progress and identify potential delays early.",
          "Coordinate with carriers on any required actions or additional information."
        ],
        broker: [
          "Monitor compliance checkpoints and approve critical workflow decisions.",
          "Manage escalations and handle complex regulatory situations."
        ]
      }
    },
    {
      id: 4,
      title: "📞 Communication & Notifications",
      description: "Master the automated communication system and notification management",
      content: [
        "The integrated communication system maintains constant contact with carriers throughout the onboarding process.",
        "Automated SMS and email notifications keep carriers informed of their application status and next steps.",
        "The system generates personalized messages based on carrier progress and any specific requirements.",
        "Two-way communication allows carriers to respond directly to requests or ask questions through the platform.",
        "All communications are logged and tracked for compliance and quality assurance purposes."
      ],
      assessment: {
        question: "What types of automated notifications does the system send to carriers?",
        options: ["Only SMS", "Only Email", "SMS and Email", "Phone calls only"],
        correct: 2
      },
      roleSpecific: {
        dispatcher: [
          "Monitor communication logs and respond to carrier inquiries promptly.",
          "Use template responses for common questions to maintain consistency."
        ],
        broker: [
          "Review communication patterns and ensure professional standards are maintained.",
          "Handle escalated communication issues and complex carrier concerns."
        ]
      }
    },
    {
      id: 5,
      title: "✅ Quality Assurance & Compliance",
      description: "Implement quality controls and ensure regulatory compliance throughout the process",
      content: [
        "Quality assurance is built into every step of the onboarding process with multiple verification checkpoints.",
        "Compliance monitoring ensures all carriers meet federal, state, and company-specific requirements.",
        "The system maintains detailed audit trails for all actions, decisions, and communications.",
        "Regular quality reviews help identify process improvements and training opportunities.",
        "Compliance reports are automatically generated for regulatory agencies and internal stakeholders."
      ],
      assessment: {
        question: "What is automatically generated for regulatory agencies?",
        options: ["Carrier lists", "Compliance reports", "Payment records", "Route plans"],
        correct: 1
      },
      roleSpecific: {
        dispatcher: [
          "Ensure all quality checkpoints are completed before advancing carrier status.",
          "Report any quality concerns or process deviations immediately."
        ],
        broker: [
          "Oversee compliance verification and sign off on final carrier approvals.",
          "Manage regulatory relationships and ensure audit readiness at all times."
        ]
      }
    }
  ];

  const startTraining = () => {
    setTrainingStarted(true);
    setModuleProgress([0]);
  };

  const nextStep = () => {
    if (currentModule < trainingModules.length - 1) {
      setCurrentModule(currentModule + 1);
      setModuleProgress([...moduleProgress, 0]);
    } else {
      setShowAssessment(true);
    }
  };

  const answerAssessment = (answer: number) => {
    const newAnswers = [...assessmentAnswers, answer];
    setAssessmentAnswers(newAnswers);
    
    if (currentModule < trainingModules.length - 1) {
      setCurrentModule(currentModule + 1);
      setShowAssessment(false);
    } else {
      // Calculate final score
      let correctAnswers = 0;
      newAnswers.forEach((answer, index) => {
        if (answer === trainingModules[index].assessment.correct) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / trainingModules.length) * 100);
      setFinalScore(score);
      setTrainingComplete(true);
      
      // Check if passed
      const passingScore = userRole === 'broker' ? 90 : 80;
      if (score >= passingScore) {
        const certificateData = {
          userName,
          userRole,
          score,
          completionDate: new Date().toISOString(),
          certificateId: `COW-${Date.now()}-${userName.replace(/\s+/g, '').toUpperCase()}`,
          passed: true
        };
        onTrainingComplete(certificateData);
      }
    }
  };

  const currentModuleData = trainingModules[currentModule];
  const progressPercentage = ((currentModule + 1) / trainingModules.length) * 100;

  if (!trainingStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '48px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px'
            }}>
              🚛 Carrier Onboard Workflow
            </h1>
            <h2 style={{
              fontSize: '2rem',
              color: 'white',
              marginBottom: '12px'
            }}>
              Professional Training Certification
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '24px'
            }}>
              Master the automated 24-hour carrier onboarding system
            </p>
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '12px',
              padding: '16px 24px',
              display: 'inline-block'
            }}>
              <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Training for: {userRole === 'broker' ? '🏢 Broker' : '📋 Dispatcher'} • {userName}
              </span>
            </div>
          </div>

          {/* Training Overview */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              color: 'white',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📚 Training Overview
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {trainingModules.map((module, index) => (
                <div key={module.id} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h4 style={{
                    color: '#10b981',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    Module {index + 1}
                  </h4>
                  <h5 style={{
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '8px'
                  }}>
                    {module.title}
                  </h5>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {module.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div style={{
              background: userRole === 'broker' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${userRole === 'broker' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h4 style={{
                color: userRole === 'broker' ? '#3b82f6' : '#10b981',
                marginBottom: '16px',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                🎯 Certification Requirements
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <strong style={{ color: 'white' }}>Passing Score:</strong>
                  <div style={{ color: userRole === 'broker' ? '#3b82f6' : '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {userRole === 'broker' ? '90%' : '80%'}+ Required
                  </div>
                </div>
                <div>
                  <strong style={{ color: 'white' }}>Duration:</strong>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>45 minutes</div>
                </div>
                <div>
                  <strong style={{ color: 'white' }}>Format:</strong>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Interactive modules + Assessment</div>
                </div>
                <div>
                  <strong style={{ color: 'white' }}>Certificate:</strong>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Valid for 12 months</div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={startTraining}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '20px 48px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
              }}
            >
              🚀 Begin Training Certification
            </button>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '16px',
              fontSize: '0.9rem'
            }}>
              Click to start your journey to certification mastery
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (trainingComplete) {
    const passed = finalScore >= (userRole === 'broker' ? 90 : 80);
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '48px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>
            {passed ? '🎉' : '📚'}
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            color: passed ? '#10b981' : '#f59e0b',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            {passed ? 'Congratulations!' : 'Training Complete'}
          </h1>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'white',
            marginBottom: '32px'
          }}>
            {passed 
              ? `You've successfully completed the Carrier Onboard Workflow training!`
              : `You've completed the training. Please review and retake to achieve certification.`
            }
          </p>

          <div style={{
            background: passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h3 style={{
              color: passed ? '#10b981' : '#f59e0b',
              fontSize: '1.5rem',
              marginBottom: '16px'
            }}>
              Final Score: {finalScore}%
            </h3>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem'
            }}>
              Required: {userRole === 'broker' ? '90%' : '80%'}+ to pass
            </p>
            
            {passed && (
              <p style={{
                color: '#10b981',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginTop: '16px'
              }}>
                ✅ Certification Earned! Your certificate is being generated.
              </p>
            )}
          </div>

          {!passed && (
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
              }}
            >
              📖 Retake Training
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Progress Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ color: 'white', margin: 0 }}>
              Module {currentModule + 1} of {trainingModules.length}
            </h2>
            <span style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              height: '100%',
              width: `${progressPercentage}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Module Content */}
        {!showAssessment ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '24px'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              color: 'white',
              marginBottom: '16px'
            }}>
              {currentModuleData.title}
            </h1>
            
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '32px'
            }}>
              {currentModuleData.description}
            </p>

            {/* Main Content */}
            <div style={{ marginBottom: '32px' }}>
              {currentModuleData.content.map((paragraph, index) => (
                <p key={index} style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.7',
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  borderLeft: '4px solid #10b981'
                }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Role-Specific Content */}
            {currentModuleData.roleSpecific && (
              <div style={{
                background: userRole === 'broker' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${userRole === 'broker' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <h4 style={{
                  color: userRole === 'broker' ? '#3b82f6' : '#10b981',
                  marginBottom: '16px',
                  fontSize: '1.3rem'
                }}>
                  👤 For {userRole === 'broker' ? 'Brokers' : 'Dispatchers'}:
                </h4>
                {currentModuleData.roleSpecific[userRole]?.map((item, index) => (
                  <p key={index} style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginBottom: '12px'
                  }}>
                    • {item}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={nextStep}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                float: 'right'
              }}
            >
              {currentModule < trainingModules.length - 1 ? 'Next Module →' : 'Start Assessment →'}
            </button>
            <div style={{ clear: 'both' }} />
          </div>
        ) : (
          /* Assessment */
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              color: 'white',
              marginBottom: '24px'
            }}>
              📝 Module {currentModule + 1} Assessment
            </h2>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                color: 'white',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                {currentModuleData.assessment.question}
              </h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {currentModuleData.assessment.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => answerAssessment(index)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                      e.currentTarget.style.borderColor = '#10b981';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
