'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SafetyResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'drivers' | 'equipment' | 'compliance'>('general')

  // General Safety Resources
  const generalSafety = [
    {
      name: 'OSHA Trucking Safety',
      description: 'Occupational Safety and Health Administration trucking industry guidelines',
      website: 'https://osha.gov/trucking',
      category: 'Regulations'
    },
    {
      name: 'FMCSA Safety Management',
      description: 'Federal Motor Carrier Safety Administration safety management systems',
      website: 'https://fmcsa.dot.gov/safety',
      category: 'Federal'
    },
    {
      name: 'American Trucking Safety',
      description: 'ATA safety programs and best practices for commercial motor vehicles',
      website: 'https://truckingsafety.org',
      category: 'Industry'
    },
    {
      name: 'National Safety Council',
      description: 'Commercial driving safety resources and training materials',
      website: 'https://nsc.org/road/commercial-vehicles',
      category: 'Training'
    }
  ]

  // Driver Safety Resources
  const driverSafety = [
    {
      name: 'Hours of Service Rules',
      description: 'Complete guide to HOS regulations and electronic logging devices',
      website: 'https://fmcsa.dot.gov/regulations/hours-service',
      category: 'HOS'
    },
    {
      name: 'Smith System Training',
      description: 'Professional driver safety training and defensive driving techniques',
      website: 'https://smithsystem.com',
      category: 'Training'
    },
    {
      name: 'National Registry Medical',
      description: 'DOT medical examiner certification and health requirements',
      website: 'https://nationalregistry.fmcsa.dot.gov',
      category: 'Medical'
    },
    {
      name: 'Truck Driver Safety',
      description: 'Comprehensive safety tips, checklists, and best practices',
      website: 'https://truckdriversafety.com',
      category: 'Resources'
    }
  ]

  // Equipment Safety Resources
  const equipmentSafety = [
    {
      name: 'DOT Vehicle Inspections',
      description: 'Commercial vehicle safety inspection requirements and procedures',
      website: 'https://fmcsa.dot.gov/safety/inspections',
      category: 'Inspections'
    },
    {
      name: 'CVSA Safety Alliance',
      description: 'Commercial Vehicle Safety Alliance inspection and enforcement',
      website: 'https://cvsa.org',
      category: 'Enforcement'
    },
    {
      name: 'Brake Safety Week',
      description: 'Annual commercial vehicle brake safety campaign and resources',
      website: 'https://brakesafetyweek.org',
      category: 'Maintenance'
    },
    {
      name: 'Tire Safety Group',
      description: 'Commercial tire safety, maintenance, and inspection guidelines',
      website: 'https://tiresafetygroup.com',
      category: 'Tires'
    }
  ]

  // Compliance Safety Resources
  const complianceSafety = [
    {
      name: 'Safety Management Systems',
      description: 'Implementing comprehensive safety management programs',
      website: 'https://fmcsa.dot.gov/safety/safety-management',
      category: 'Management'
    },
    {
      name: 'CSA Safety Scores',
      description: 'Compliance, Safety, Accountability program and scoring system',
      website: 'https://ai.fmcsa.dot.gov/sms',
      category: 'Scoring'
    },
    {
      name: 'Safety Audit Prep',
      description: 'Preparing for DOT safety audits and compliance reviews',
      website: 'https://fmcsa.dot.gov/safety/audits',
      category: 'Audits'
    },
    {
      name: 'Drug & Alcohol Testing',
      description: 'DOT drug and alcohol testing requirements and procedures',
      website: 'https://fmcsa.dot.gov/regulations/drug-alcohol-testing',
      category: 'Testing'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Content Container */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 24px 80px 24px' 
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #ffffff, #fef2f2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 16px 0'
            }}>
              🦺 Safety Resources
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              Comprehensive safety resources, regulations, and best practices for transportation professionals
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['general', 'drivers', 'equipment', 'compliance'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedCategory === category 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px'
                  }}
                >
                  {category === 'general' && '🛡️ General Safety'}
                  {category === 'drivers' && '👤 Driver Safety'}
                  {category === 'equipment' && '🚛 Equipment Safety'}
                  {category === 'compliance' && '📋 Compliance'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🚨 Emergency Safety Contacts
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0',
                fontSize: '16px'
              }}>
                <strong>Emergency:</strong> 911 | <strong>DOT Hotline:</strong> 1-888-DOT-SAFT | <strong>Roadside Assistance:</strong> Contact your carrier
              </p>
            </div>
            <div>
              <Link href="/compliance" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'white',
                  color: '#dc2626',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}>
                  Compliance Hub
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {selectedCategory === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🛡️ General Safety Resources
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {generalSafety.map((resource, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {resource.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(239, 68, 68, 0.3)',
                        color: '#fca5a5',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        {resource.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {resource.description}
                    </p>
                    <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{
                      color: '#ffffff',
                      background: 'rgba(239, 68, 68, 0.6)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(239, 68, 68, 0.8)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.6)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      View Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'drivers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                👤 Driver Safety Resources
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {driverSafety.map((resource, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {resource.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(34, 197, 94, 0.3)',
                        color: '#86efac',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                      }}>
                        {resource.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {resource.description}
                    </p>
                    <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{
                      color: '#ffffff',
                      background: 'rgba(34, 197, 94, 0.6)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(34, 197, 94, 0.8)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(34, 197, 94, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(34, 197, 94, 0.6)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      View Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 8px 0'
                  }}>
                    🚛 Driver Management Portal
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0'
                  }}>
                    Access your driver dashboard for HOS tracking, safety scores, and training resources.
                  </p>
                </div>
                <div>
                  <Link href="/drivers" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'white',
                      color: '#1d4ed8',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      Driver Management Portal
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'equipment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🚛 Equipment Safety Resources
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {equipmentSafety.map((resource, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {resource.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        {resource.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {resource.description}
                    </p>
                    <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{
                      color: '#ffffff',
                      background: 'rgba(245, 158, 11, 0.6)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(245, 158, 11, 0.8)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.6)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      View Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 8px 0'
                  }}>
                    🔧 Maintenance Hub
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0'
                  }}>
                    Access vehicle maintenance schedules, inspection checklists, and repair tracking.
                  </p>
                </div>
                <div>
                  <Link href="/maintenance" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      Maintenance
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'compliance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                📋 Compliance Safety Resources
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {complianceSafety.map((resource, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {resource.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(147, 51, 234, 0.3)',
                        color: '#c4b5fd',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(147, 51, 234, 0.2)'
                      }}>
                        {resource.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {resource.description}
                    </p>
                    <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{
                      color: '#ffffff',
                      background: 'rgba(147, 51, 234, 0.6)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(147, 51, 234, 0.8)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(147, 51, 234, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(147, 51, 234, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(147, 51, 234, 0.6)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      View Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 8px 0'
                  }}>
                    📊 Compliance Dashboard
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0'
                  }}>
                    Monitor compliance metrics, audit schedules, and safety scoring in real-time.
                  </p>
                </div>
                <div>
                  <Link href="/compliance" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'white',
                      color: '#5b21b6',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      Compliance Hub
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
