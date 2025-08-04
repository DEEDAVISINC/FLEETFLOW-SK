'use client';

import Link from 'next/link';
import { useState } from 'react';
import { checkPermission, getCurrentUser } from '../config/access';

export default function InstructorPortal() {
  const { user } = getCurrentUser();
  const hasManagementAccess = checkPermission('hasManagementAccess');

  // Instructor state management
  const [activeView, setActiveView] = useState<
    | 'my-classes'
    | 'course-creation'
    | 'student-progress'
    | 'assignments'
    | 'communication'
    | 'analytics'
  >('my-classes');

  // Mock instructor data
  const [instructorClasses] = useState([
    {
      id: 'dispatcher-ops-001',
      title: 'Dispatcher Operations Mastery',
      code: 'DOM-2024',
      students: 12,
      completionRate: 78,
      averageScore: 89.2,
      nextSession: '2025-01-15',
      status: 'Active',
      description:
        'Comprehensive dispatcher training covering load coordination, route optimization, and customer communication.',
    },
    {
      id: 'broker-business-001',
      title: 'Broker Business Excellence',
      code: 'BBE-2024',
      students: 8,
      completionRate: 92,
      averageScore: 94.7,
      nextSession: '2025-01-18',
      status: 'Active',
      description:
        'Advanced freight brokerage operations, negotiation strategies, and market analysis.',
    },
    {
      id: 'fleet-ops-001',
      title: 'Fleet Operations Management',
      code: 'FOM-2024',
      students: 15,
      completionRate: 65,
      averageScore: 86.3,
      nextSession: '2025-01-20',
      status: 'Active',
      description:
        'Complete fleet management including maintenance, compliance, and driver coordination.',
    },
    {
      id: 'compliance-safety-001',
      title: 'DOT Compliance & Safety',
      code: 'DCS-2024',
      students: 20,
      completionRate: 84,
      averageScore: 91.8,
      nextSession: '2025-01-22',
      status: 'Active',
      description:
        'DOT regulations, safety protocols, and compliance management for transportation operations.',
    },
  ]);

  const [recentStudents] = useState([
    {
      id: 'FM-MGR-2023005',
      name: 'Francisco Martinez',
      class: 'Fleet Operations Management',
      progress: 78,
      lastActivity: '2 hours ago',
      status: 'Active',
    },
    {
      id: 'SJ-DC-2024014',
      name: 'Sarah Johnson',
      class: 'Dispatcher Operations Mastery',
      progress: 92,
      lastActivity: '1 day ago',
      status: 'Active',
    },
    {
      id: 'ED-BB-2024061',
      name: 'Emily Davis',
      class: 'Broker Business Excellence',
      progress: 100,
      lastActivity: '3 hours ago',
      status: 'Completed',
    },
  ]);

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>

      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '300px',
          height: '300px',
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Navigation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '12px 20px',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Link
            href='/'
            style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            🚛 FleetFlow™
          </Link>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href='/university' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🎓 FleetFlow University℠
              </button>
            </Link>
            <Link href='/training/admin' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🏫 Admin Portal
              </button>
            </Link>
            <Link href='/' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                ← Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Professional Instructor Header */}
      <div style={{ marginBottom: '32px', padding: '0 24px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            margin: '0 auto',
            maxWidth: '1600px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                👨‍🏫 FleetFlow University℠ - Instructor Portal
              </h1>
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  display: 'inline-block',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.3rem',
                    color: '#60a5fa',
                    margin: '0',
                    fontWeight: '700',
                  }}
                >
                  🎯 Direct Connection to FleetFlow University for Course
                  Monitoring & Assignment
                </h2>
              </div>
            </div>

            {/* Instructor Info */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px 20px',
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                👨‍🏫 {user?.name || 'Instructor'}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                Senior Instructor • {user?.role?.toUpperCase() || 'INSTRUCTOR'}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <span>📚 {instructorClasses.length} Active Classes</span>
                <span>
                  👥{' '}
                  {instructorClasses.reduce(
                    (acc, cls) => acc + cls.students,
                    0
                  )}{' '}
                  Students
                </span>
                <span>
                  🎯{' '}
                  {Math.round(
                    instructorClasses.reduce(
                      (acc, cls) => acc + cls.completionRate,
                      0
                    ) / instructorClasses.length
                  )}
                  % Avg Completion
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'my-classes', label: '📚 Course Management', icon: '📚' },
              {
                id: 'course-creation',
                label: '🎯 Course Creation',
                icon: '🎯',
              },
              {
                id: 'student-progress',
                label: '👥 Student Progress',
                icon: '👥',
              },
              { id: 'assignments', label: '📝 Assignment Tools', icon: '📝' },
              {
                id: 'communication',
                label: '💬 Communication Hub',
                icon: '💬',
              },
              {
                id: 'analytics',
                label: '📊 Performance Analytics',
                icon: '📊',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                style={{
                  background:
                    activeView === tab.id
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))'
                      : 'rgba(255, 255, 255, 0.1)',
                  border:
                    activeView === tab.id
                      ? '2px solid rgba(59, 130, 246, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  color:
                    activeView === tab.id
                      ? '#60a5fa'
                      : 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.95rem',
                  fontWeight: activeView === tab.id ? '700' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow:
                    activeView === tab.id
                      ? '0 4px 12px rgba(59, 130, 246, 0.2)'
                      : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '0 24px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* MY CLASSES - Direct Title */}
        {activeView === 'my-classes' && (
          <div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
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
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  📚 Course Management - Direct FleetFlow University Connection
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    + Create New Class
                  </button>
                  <Link href='/university' style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🎓 View University Courses
                    </button>
                  </Link>
                </div>
              </div>

              {/* Class Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '20px',
                }}
              >
                {instructorClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {classItem.title}
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '4px',
                          }}
                        >
                          📋 Course Code: {classItem.code}
                        </div>
                      </div>
                      <div
                        style={{
                          background:
                            classItem.status === 'Active'
                              ? '#10b981'
                              : '#6b7280',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        {classItem.status}
                      </div>
                    </div>

                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        marginBottom: '16px',
                        lineHeight: '1.4',
                      }}
                    >
                      {classItem.description}
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            color: '#60a5fa',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '2px',
                          }}
                        >
                          {classItem.students}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Students
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '2px',
                          }}
                        >
                          {classItem.completionRate}%
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Complete
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            color: '#f59e0b',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '2px',
                          }}
                        >
                          {classItem.averageScore}%
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Avg Score
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        📅 Next Session: {classItem.nextSession}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          flex: 1,
                        }}
                      >
                        📊 View Details
                      </button>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          flex: 1,
                        }}
                      >
                        📝 Assign Work
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Student Activity */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                📈 Recent Student Activity
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        {student.name}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {student.class} • {student.lastActivity}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          {student.progress}%
                        </div>
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            height: '4px',
                            width: '60px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              background:
                                student.progress >= 80 ? '#10b981' : '#3b82f6',
                              height: '100%',
                              width: `${student.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          background:
                            student.status === 'Completed'
                              ? '#10b981'
                              : '#3b82f6',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                        }}
                      >
                        {student.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Views - Placeholder Content */}
        {activeView === 'course-creation' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              🎯 Course Creation Tools
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                marginBottom: '24px',
              }}
            >
              Advanced course creation and curriculum management tools
            </p>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              + Create New Course
            </button>
          </div>
        )}

        {activeView === 'student-progress' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              👥 Student Progress Monitoring
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Track student progress, performance analytics, and engagement
              metrics
            </p>
          </div>
        )}

        {activeView === 'assignments' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              📝 Assignment Tools
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Create, assign, and manage coursework and assessments
            </p>
          </div>
        )}

        {activeView === 'communication' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              💬 Communication Hub
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Message students, send announcements, and manage class
              communications
            </p>
          </div>
        )}

        {activeView === 'analytics' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              📊 Performance Analytics
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Comprehensive analytics and reporting for instructor insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
