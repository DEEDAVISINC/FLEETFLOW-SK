'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getCurrentUser, checkPermission } from '../config/access'

export default function TrainingPage() {
  const { user } = getCurrentUser()
  const hasManagementAccess = checkPermission('hasManagementAccess')
  const [selectedModule, setSelectedModule] = useState<'overview' | 'dispatch' | 'broker' | 'compliance' | 'safety' | 'video'>('overview')
  const [selectedCategory, setSelectedCategory] = useState('All')

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
    }
  ]

  const categories = ['All', 'Operations', 'Compliance', 'Safety', 'Technology', 'Customer Relations']

  const filteredModules = selectedCategory === 'All' 
    ? trainingModules 
    : trainingModules.filter(module => module.category === selectedCategory)

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
            🎓 Enhanced Training Center
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Professional development for transportation excellence
          </p>
          
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

              {/* Action Button */}
              <button
                style={{
                  width: '100%',
                  background: `linear-gradient(135deg, ${module.borderColor.replace('0.3', '0.8')}, ${module.borderColor.replace('0.3', '1')})`,
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '20px',
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
                🚀 Start Training Module
              </button>
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
      </div>
    </div>
  )
}
