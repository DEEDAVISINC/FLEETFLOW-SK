'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, checkPermission } from '../config/access'
import { getUserTrainingAccess, hasModuleAccess, getUserAssignedModules, formatTrainingAccessDescription } from '../utils/trainingAccess'
import CertificationSystem from '../components/CertificationSystem'
import { dispatchQuizQuestions, brokerQuizQuestions, complianceQuizQuestions, smsWorkflowQuizQuestions } from '../data/quizQuestions'
import { progressManager } from '../utils/trainingProgress'
import { quizGenerator } from '../utils/quizGenerator'

// User roles definition
const USER_ROLES = {
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  BROKER: 'broker',
  MANAGER: 'manager',
  ADMIN: 'admin'
} as const;

// Training module definitions
const TRAINING_MODULES = {
  DISPATCH: 'dispatch',
  BROKER: 'broker', 
  COMPLIANCE: 'compliance',
  SAFETY: 'safety',
  TECHNOLOGY: 'technology',
  CUSTOMER: 'customer',
  WORKFLOW: 'workflow',
  SMS_WORKFLOW: 'sms-workflow'
} as const;

export default function TrainingPage() {
  const { user } = getCurrentUser()
  const hasManagementAccess = checkPermission('hasManagementAccess')
  const trainingAccess = getUserTrainingAccess(user || { 
    id: 'guest', 
    name: 'Guest', 
    email: '', 
    role: 'Viewer', 
    status: 'Active', 
    permissions: [] 
  })
  
  const [selectedModule, setSelectedModule] = useState<'overview' | 'dispatch' | 'broker' | 'compliance' | 'safety' | 'video'>('overview')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showQuiz, setShowQuiz] = useState<string | null>(null)
  const [certificates, setCertificates] = useState<any[]>([])
  const [moduleProgress, setModuleProgress] = useState<{[key: string]: number}>({})
  const [availableModules, setAvailableModules] = useState<string[]>([])
  const [dynamicQuizData, setDynamicQuizData] = useState<any>(null)

  // Check if user has access to training
  if (!trainingAccess.canAccessTraining) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '600px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '20px' }}>
            🚫 Access Restricted
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '30px' }}>
            You don't have access to FleetFlow University. Please contact your administrator to request training access.
          </p>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Initialize user progress with their actual info
    if (user) {
      progressManager.initializeUserProgress(user.id, user.role, user.name)
    }

    // Load progress for allowed modules only
    const progress: {[key: string]: number} = {}
    
    trainingAccess.allowedModules.forEach(moduleId => {
      progress[moduleId] = progressManager.getModuleCompletionPercentage(moduleId, user?.id)
    })
    
    setModuleProgress(progress)
    setCertificates(progressManager.getCertificates(user?.id))
    
    // Load available quiz modules from dynamic generator
    setAvailableModules(quizGenerator.getAvailableModules())
  }, [user, trainingAccess])

  const handleCertificationEarned = (certificate: any) => {
    progressManager.awardCertificate(certificate, user?.id)
    setCertificates(prev => [...prev, certificate])
  }

  const handleStartLesson = (moduleId: string, lessonId: string) => {
    if (!hasModuleAccess(user, moduleId)) {
      alert('You do not have access to this training module.')
      return
    }

    progressManager.startModule(moduleId, user?.id)
    // Simulate lesson completion after a short time (in real app, track actual completion)
    setTimeout(() => {
      progressManager.completeLesson(moduleId, lessonId, 5, user?.id) // 5 minutes simulated
      setModuleProgress(prev => ({
        ...prev,
        [moduleId]: progressManager.getModuleCompletionPercentage(moduleId, user?.id)
      }))
    }, 1000)
  }

  const handleStartQuiz = (moduleId: string) => {
    if (!user || !hasModuleAccess(user, moduleId)) {
      alert('You do not have access to this training module.')
      return
    }

    const isEligible = progressManager.isCertificationEligible(moduleId, user?.id)
    if (isEligible) {
      try {
        // Generate dynamic quiz for modules that have quiz generator support
        if (availableModules.includes(moduleId)) {
          const quizData = quizGenerator.generateQuiz(moduleId)
          setDynamicQuizData(quizData)
        }
        setShowQuiz(moduleId)
      } catch (error) {
        console.error('Error generating quiz:', error)
        alert('Unable to generate quiz. Please try again later.')
      }
    } else {
      alert(`Complete the training module first! Progress: ${moduleProgress[moduleId] || 0}%`)
    }
  }

  // Training modules data
  const trainingModules = [
    {
      id: 'dispatch',
      title: '🚛 Dispatch Operations',
      category: 'Operations',
      description: 'Master the art of efficient dispatch operations and load coordination',
      duration: '2-3 hours',
      level: 'Intermediate',
      color: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      resources: [
        { type: 'presentation', title: 'Dispatch Fundamentals', url: '#', icon: '📊' },
        { type: 'video', title: 'Load Coordination Masterclass', url: '#', icon: '🎥' },
        { type: 'document', title: 'Dispatch Checklist Template', url: '#', icon: '📋' },
        { type: 'quiz', title: 'Dispatch Knowledge Test', url: '#', icon: '🧠' }
      ]
    },
    {
      id: 'broker',
      title: '🤝 Freight Brokerage',
      category: 'Operations',
      description: 'Learn carrier relationships and freight matching strategies',
      duration: '3-4 hours',
      level: 'Advanced',
      color: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      resources: [
        { type: 'presentation', title: 'Brokerage Best Practices', url: '#', icon: '📊' },
        { type: 'video', title: 'Carrier Negotiation Tactics', url: '#', icon: '🎥' },
        { type: 'document', title: 'Rate Calculation Workbook', url: '#', icon: '📈' },
        { type: 'template', title: 'Broker Agreement Template', url: '#', icon: '📄' }
      ]
    },
    {
      id: 'compliance',
      title: '⚖️ DOT Compliance',
      category: 'Compliance',
      description: 'Stay compliant with DOT regulations and safety requirements',
      duration: '1-2 hours',
      level: 'Essential',
      color: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      resources: [
        { type: 'presentation', title: 'DOT Regulations Overview', url: '#', icon: '📊' },
        { type: 'video', title: 'HOS Compliance Training', url: '#', icon: '🎥' },
        { type: 'document', title: 'Compliance Checklist', url: '#', icon: '✅' },
        { type: 'guide', title: 'Violation Prevention Guide', url: '#', icon: '🛡️' }
      ]
    },
    {
      id: 'safety',
      title: '🦺 Safety Management',
      category: 'Safety',
      description: 'Implement comprehensive safety protocols and risk management',
      duration: '2 hours',
      level: 'Essential',
      color: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      resources: [
        { type: 'presentation', title: 'Safety Management Systems', url: '#', icon: '📊' },
        { type: 'video', title: 'Risk Assessment Training', url: '#', icon: '🎥' },
        { type: 'document', title: 'Safety Incident Report Forms', url: '#', icon: '📋' },
        { type: 'checklist', title: 'Vehicle Inspection Checklist', url: '#', icon: '🔍' }
      ]
    },
    {
      id: 'technology',
      title: '💻 Technology Systems',
      category: 'Technology',
      description: 'Master FleetFlow and integrated transportation technology',
      duration: '1.5 hours',
      level: 'Beginner',
      color: 'rgba(147, 51, 234, 0.15)',
      borderColor: 'rgba(147, 51, 234, 0.3)',
      resources: [
        { type: 'presentation', title: 'FleetFlow System Overview', url: '#', icon: '📊' },
        { type: 'video', title: 'TMS Integration Tutorial', url: '#', icon: '🎥' },
        { type: 'document', title: 'User Manual & Quick Reference', url: '#', icon: '📖' },
        { type: 'demo', title: 'Interactive System Demo', url: '#', icon: '🖥️' }
      ]
    },
    {
      id: 'customer',
      title: '🤝 Customer Service',
      category: 'Customer Relations',
      description: 'Deliver exceptional customer service and relationship management',
      duration: '1.5 hours',
      level: 'Intermediate',
      color: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      resources: [
        { type: 'presentation', title: 'Customer Service Excellence', url: '#', icon: '📊' },
        { type: 'video', title: 'Difficult Customer Scenarios', url: '#', icon: '🎥' },
        { type: 'document', title: 'Communication Templates', url: '#', icon: '💬' },
        { type: 'roleplay', title: 'Customer Service Roleplay', url: '#', icon: '🎭' }
      ]
    },
    {
      id: 'workflow',
      title: '🔄 Workflow Ecosystem Training',
      category: 'Operations',
      description: 'Specialized training for dispatchers and drivers on complete workflow mastery',
      duration: '2-3 hours',
      level: 'Specialized',
      color: 'rgba(102, 126, 234, 0.15)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      resources: [
        { type: 'specialized', title: 'Dispatcher Workflow Training', url: '/workflow-training', icon: '🎯' },
        { type: 'specialized', title: 'Driver Mobile App Training', url: '/workflow-training', icon: '🚛' },
        { type: 'interactive', title: 'Workflow Ecosystem Overview', url: '/workflow-training', icon: '🔄' },
        { type: 'demo', title: 'End-to-End Process Demo', url: '/workflow-training', icon: '📱' }
      ]
    },
    {
      id: 'sms-workflow',
      title: '📱 SMS Notification System',
      category: 'Communications',
      description: 'Master the SMS notification system within the FleetFlow WorkFlow Ecosystem',
      duration: '1.5 hours',
      level: 'Intermediate',
      color: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      resources: [
        { type: 'training', title: 'Complete SMS Training Guide', url: '/sms-training', icon: '📚' },
        { type: 'demo', title: 'SMS Workflow Ecosystem Demo', url: '/sms-workflow', icon: '📱' },
        { type: 'interactive', title: 'Message Tracking & Logs', url: '/notes', icon: '📋' },
        { type: 'presentation', title: 'SMS Integration Architecture', url: '/sms-training', icon: '🏗️' },
        { type: 'guide', title: 'Templates & Best Practices', url: '/sms-training', icon: '�' },
        { type: 'quiz', title: 'SMS System Knowledge Test', url: '#', icon: '🧠' }
      ]
    }
  ]

  const categories = ['All', 'Operations', 'Compliance', 'Safety', 'Technology', 'Customer Relations', 'Communications']

  // Filter modules based on user access and category
  const accessibleModules = trainingModules.filter(module => 
    trainingAccess.allowedModules.includes(module.id as any)
  )
  
  const filteredModules = selectedCategory === 'All' 
    ? accessibleModules 
    : accessibleModules.filter(module => module.category === selectedCategory)

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
              ← Back to Dashboard
            </button>
          </Link>
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
          maxWidth: '800px',
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
            🎓 FleetFlow University
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: 'rgba(255, 255, 255, 0.95)',
            margin: '0 0 8px 0',
            fontWeight: '600',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            "Knowledge on & off the Road"
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            lineHeight: '1.6',
            fontStyle: 'italic'
          }}>
            "Dispatch Smart, Drive Safe, Deal Right"
          </p>
          
          {/* User Info */}
          <div style={{
            marginTop: '20px',
            display: 'inline-block',
            padding: '8px 16px',
            background: user?.role === 'broker' ? 'rgba(16, 185, 129, 0.3)' :
                       user?.role === 'dispatcher' ? 'rgba(59, 130, 246, 0.3)' :
                       user?.role === 'driver' ? 'rgba(239, 68, 68, 0.3)' :
                       'rgba(76, 175, 80, 0.3)',
            border: user?.role === 'broker' ? '1px solid rgba(16, 185, 129, 0.5)' :
                   user?.role === 'dispatcher' ? '1px solid rgba(59, 130, 246, 0.5)' :
                   user?.role === 'driver' ? '1px solid rgba(239, 68, 68, 0.5)' :
                   '1px solid rgba(76, 175, 80, 0.5)',
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: user?.role === 'broker' ? '#10B981' :
                  user?.role === 'dispatcher' ? '#3B82F6' :
                  user?.role === 'driver' ? '#EF4444' :
                  '#4CAF50',
            fontWeight: '600'
          }}>
            {user?.role === 'broker' ? '🤝' :
             user?.role === 'dispatcher' ? '🚛' :
             user?.role === 'driver' ? '👨‍💼' :
             '🔐'} {user?.name || 'Current User'} | {user?.role?.toUpperCase() || 'TRAINEE'}
            <br />
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Access to {trainingAccess.allowedModules.length} training modules
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        padding: '0 20px'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              background: selectedCategory === category 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: selectedCategory === category ? '#667eea' : 'white',
              border: selectedCategory === category 
                ? '2px solid rgba(255, 255, 255, 0.9)' 
                : '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Progress Summary Card */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto 40px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🎯 Your Learning Journey
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {accessibleModules.map(module => (
              <div key={module.id} style={{
                textAlign: 'center',
                padding: '12px',
                background: module.color,
                borderRadius: '12px',
                border: `1px solid ${module.borderColor}`
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  marginBottom: '4px'
                }}>
                  {moduleProgress[module.id] === 100 ? '🏆' : 
                   moduleProgress[module.id] > 50 ? '📚' : '📖'}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  {module.id.toUpperCase()}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: moduleProgress[module.id] === 100 ? '#059669' : '#6b7280'
                }}>
                  {moduleProgress[module.id] || 0}%
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div>
              <div style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Overall Progress
              </div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#1f2937'
              }}>
                {Math.round(Object.values(moduleProgress).reduce((a, b) => a + b, 0) / accessibleModules.length) || 0}% Complete
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Certificates Earned
              </div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#059669'
              }}>
                {certificates.length} 🏆
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px'
        }}>
          {filteredModules.map(module => (
            <div
              key={module.id}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                border: `2px solid ${module.borderColor}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  }}>
                    {module.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      background: module.color,
                      color: '#374151',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {module.level}
                    </span>
                    <span style={{
                      background: 'rgba(107, 114, 128, 0.1)',
                      color: '#374151',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      ⏱️ {module.duration}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontSize: '1rem'
              }}>
                {module.description}
              </p>

              {/* Resources */}
              <div style={{
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                paddingTop: '20px'
              }}>
                <h4 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '16px'
                }}>
                  📚 Training Resources
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px'
                }}>
                  {module.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        background: 'rgba(249, 250, 251, 0.8)',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: '#374151',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = module.color
                        e.currentTarget.style.transform = 'translateX(4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(249, 250, 251, 0.8)'
                        e.currentTarget.style.transform = 'translateX(0)'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{resource.icon}</span>
                      <span>{resource.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                    Progress
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {moduleProgress[module.id] || 0}%
                  </span>
                </div>
                <div style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: moduleProgress[module.id] === 100 
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    height: '100%',
                    width: `${moduleProgress[module.id] || 0}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => handleStartLesson(module.id, `lesson_${Date.now()}`)}
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${module.borderColor.replace('0.3', '0.8')}, ${module.borderColor.replace('0.3', '1')})`,
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  🚀 Start Training
                </button>
                
                {/* Show certification button for all modules with quiz support */}
                {(availableModules.includes(module.id) || ['dispatch', 'broker', 'compliance'].includes(module.id)) && (
                  <button
                    onClick={() => handleStartQuiz(module.id)}
                    disabled={!progressManager.isCertificationEligible(module.id, user?.id)}
                    style={{
                      flex: 1,
                      background: progressManager.isCertificationEligible(module.id, user?.id)
                        ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                        : 'rgba(107, 114, 128, 0.3)',
                      color: progressManager.isCertificationEligible(module.id, user?.id) ? 'white' : '#9CA3AF',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: progressManager.isCertificationEligible(module.id, user?.id) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (progressManager.isCertificationEligible(module.id, user?.id)) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (progressManager.isCertificationEligible(module.id, user?.id)) {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    {progressManager.isCertificationEligible(module.id, user?.id) ? '🏆 Get Certified' : '🔒 Complete Training First'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        textAlign: 'center',
        marginTop: '60px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '30px',
          margin: '0 auto',
          maxWidth: '600px',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px'
          }}>
            💡 Training Center Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem'
          }}>
            <div>📊 Interactive Presentations</div>
            <div>🎥 Video Learning</div>
            <div>📋 Downloadable Resources</div>
            <div>🧠 Knowledge Assessments</div>
            <div>📈 Progress Tracking</div>
            <div>🏆 Certification System</div>
          </div>
        </div>

        {/* Dynamic Quiz Status - Admin View */}
        {hasManagementAccess && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '20px',
            margin: '20px auto 0',
            maxWidth: '800px',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px'
            }}>
              🔧 Quiz System Status (Admin View)
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.8rem'
            }}>
              {availableModules.map(moduleId => {
                const validation = quizGenerator.validateModuleQuestions(moduleId)
                return (
                  <div key={moduleId} style={{
                    padding: '8px 12px',
                    background: validation.isValid 
                      ? 'rgba(16, 185, 129, 0.2)' 
                      : 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    border: validation.isValid 
                      ? '1px solid rgba(16, 185, 129, 0.4)' 
                      : '1px solid rgba(239, 68, 68, 0.4)'
                  }}>
                    <div style={{ fontWeight: '600' }}>
                      {validation.isValid ? '✅' : '⚠️'} {moduleId.toUpperCase()}
                    </div>
                    <div>
                      {validation.availableQuestions}/{validation.requiredQuestions} questions
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{
              marginTop: '12px',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontStyle: 'italic'
            }}>
              ✨ Dynamic quiz system automatically updates as training content grows
            </div>
          </div>
        )}
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
              onClick={() => {
                setShowQuiz(null)
                setDynamicQuizData(null)
              }}
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
            
            {/* Dynamic Quiz Support */}
            {showQuiz && dynamicQuizData && availableModules.includes(showQuiz) && (
              <CertificationSystem
                moduleId={showQuiz}
                moduleTitle={`${showQuiz.charAt(0).toUpperCase() + showQuiz.slice(1)} Certification`}
                questions={dynamicQuizData.questions}
                passingScore={dynamicQuizData.config.passingScore}
                onCertificationEarned={handleCertificationEarned}
              />
            )}
            
            {/* Legacy Static Quizzes (for backward compatibility) */}
            {showQuiz === 'dispatch' && (!dynamicQuizData || !availableModules.includes('dispatch')) && (
              <CertificationSystem
                moduleId="dispatch"
                moduleTitle="Dispatch Operations Certification"
                questions={dispatchQuizQuestions}
                passingScore={80}
                onCertificationEarned={handleCertificationEarned}
              />
            )}
            
            {showQuiz === 'broker' && (!dynamicQuizData || !availableModules.includes('broker')) && (
              <CertificationSystem
                moduleId="broker"
                moduleTitle="Freight Brokerage Certification"
                questions={brokerQuizQuestions}
                passingScore={85}
                onCertificationEarned={handleCertificationEarned}
              />
            )}
            
            {showQuiz === 'compliance' && (!dynamicQuizData || !availableModules.includes('compliance')) && (
              <CertificationSystem
                moduleId="compliance"
                moduleTitle="DOT Compliance Certification"
                questions={complianceQuizQuestions}
                passingScore={90}
                onCertificationEarned={handleCertificationEarned}
              />
            )}
            
            {showQuiz === 'sms-workflow' && (!dynamicQuizData || !availableModules.includes('sms-workflow')) && (
              <CertificationSystem
                moduleId="sms-workflow"
                moduleTitle="SMS Workflow Ecosystem Certification"
                questions={smsWorkflowQuizQuestions}
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
