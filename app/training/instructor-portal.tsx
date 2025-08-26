'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkPermission, getCurrentUser } from '../config/access';
import { quizGenerator } from '../utils/quizGenerator';
import {
  getUserTrainingAccess,
  hasModuleAccess,
} from '../utils/trainingAccess';
import { progressManager } from '../utils/trainingProgress';

// User roles definition
const USER_ROLES = {
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  BROKER: 'broker',
  MANAGER: 'manager',
  ADMIN: 'admin',
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
  SMS_WORKFLOW: 'sms-workflow',
  AI_FLOW: 'ai-flow',
} as const;

export default function TrainingPage() {
  const { user } = getCurrentUser();
  const hasManagementAccess = checkPermission('hasManagementAccess');
  const trainingAccess = getUserTrainingAccess(
    user || {
      id: 'guest',
      name: 'Guest',
      email: '',
      role: 'Viewer',
      status: 'Active',
      permissions: [],
    }
  );

  // Enhanced admin state management
  const [activeView, setActiveView] = useState<
    | 'dashboard'
    | 'students'
    | 'courses'
    | 'analytics'
    | 'assessments'
    | 'reports'
  >('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<string | null>(null);

  // Initialize user progress - must be at top level
  useEffect(() => {
    // Initialize user progress with their actual info
    if (user) {
      progressManager.initializeUserProgress(user.id, user.role, user.name);
    }

    // Load progress for allowed modules only
    const allowedModules = trainingAccess.allowedModules;
    allowedModules.forEach((moduleId) => {
      const progress = progressManager.getModuleProgress(
        user?.id || 'guest',
        moduleId
      );
      if (!progress) {
        progressManager.updateModuleProgress(user?.id || 'guest', moduleId, {
          completed: false,
          progress: 0,
          timeSpent: 0,
          lastAccessed: new Date().toISOString(),
          quizScores: {},
        });
      }
    });
  }, [user, trainingAccess.allowedModules]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [moduleProgress, setModuleProgress] = useState<{
    [key: string]: number;
  }>({});
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [dynamicQuizData, setDynamicQuizData] = useState<any>(null);

  // Mock student data for demonstration
  const [students] = useState([
    {
      id: 'FM-MGR-2023005',
      name: 'Francisco Martinez',
      email: 'francisco.martinez@fleetflow.com',
      department: 'Management',
      role: 'Fleet Manager',
      enrollmentDate: '2024-01-15',
      completedCourses: 3,
      totalCourses: 4,
      averageScore: 94.2,
      lastActivity: '2024-12-30',
      status: 'Active',
      currentCourse: 'Fleet Operations Excellence',
      progress: 78,
    },
    {
      id: 'SJ-DC-2024014',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@fleetflow.com',
      department: 'Dispatch',
      role: 'Senior Dispatcher',
      enrollmentDate: '2024-02-01',
      completedCourses: 2,
      totalCourses: 4,
      averageScore: 89.7,
      lastActivity: '2024-12-29',
      status: 'Active',
      currentCourse: 'Dispatcher Operations Mastery',
      progress: 92,
    },
    {
      id: 'ED-BB-2024061',
      name: 'Emily Davis',
      email: 'emily.davis@fleetflow.com',
      department: 'Brokerage',
      role: 'Freight Broker',
      enrollmentDate: 'I2024-03-10',
      completedCourses: 4,
      totalCourses: 4,
      averageScore: 96.8,
      lastActivity: '2024-12-30',
      status: 'Completed',
      currentCourse: 'All Courses Complete',
      progress: 100,
    },
    {
      id: 'MR-DM-2024022',
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@fleetflow.com',
      department: 'Driver Management',
      role: 'Driver Coordinator',
      enrollmentDate: '2024-01-25',
      completedCourses: 1,
      totalCourses: 4,
      averageScore: 87.3,
      lastActivity: '2024-12-28',
      status: 'In Progress',
      currentCourse: 'Compliance & Safety Excellence',
      progress: 34,
    },
  ]);

  // Administrative view of courses (referencing university courses)
  const comprehensiveCourses = [
    {
      id: 'dispatcher-operations-mastery',
      title: 'Dispatcher Operations Mastery',
      enrolledStudents: students.filter((s) =>
        s.currentCourse.includes('Dispatcher')
      ).length,
      completionRate: Math.round(
        students
          .filter((s) => s.currentCourse.includes('Dispatcher'))
          .reduce((acc, s) => acc + s.progress, 0) /
          Math.max(
            students.filter((s) => s.currentCourse.includes('Dispatcher'))
              .length,
            1
          )
      ),
      averageScore: Math.round(
        students
          .filter((s) => s.currentCourse.includes('Dispatcher'))
          .reduce((acc, s) => acc + s.averageScore, 0) /
          Math.max(
            students.filter((s) => s.currentCourse.includes('Dispatcher'))
              .length,
            1
          )
      ),
      status: 'Active',
    },
    {
      id: 'broker-business-mastery',
      title: 'Broker Business Mastery',
      enrolledStudents: students.filter((s) => s.department === 'Brokerage')
        .length,
      completionRate: Math.round(
        students
          .filter((s) => s.department === 'Brokerage')
          .reduce((acc, s) => acc + s.progress, 0) /
          Math.max(
            students.filter((s) => s.department === 'Brokerage').length,
            1
          )
      ),
      averageScore: Math.round(
        students
          .filter((s) => s.department === 'Brokerage')
          .reduce((acc, s) => acc + s.averageScore, 0) /
          Math.max(
            students.filter((s) => s.department === 'Brokerage').length,
            1
          )
      ),
      status: 'Active',
    },
    {
      id: 'fleet-operations-excellence',
      title: 'Fleet Operations Excellence',
      enrolledStudents: students.filter((s) =>
        s.currentCourse.includes('Fleet')
      ).length,
      completionRate: Math.round(
        students
          .filter((s) => s.currentCourse.includes('Fleet'))
          .reduce((acc, s) => acc + s.progress, 0) /
          Math.max(
            students.filter((s) => s.currentCourse.includes('Fleet')).length,
            1
          )
      ),
      averageScore: Math.round(
        students
          .filter((s) => s.currentCourse.includes('Fleet'))
          .reduce((acc, s) => acc + s.averageScore, 0) /
          Math.max(
            students.filter((s) => s.currentCourse.includes('Fleet')).length,
            1
          )
      ),
      status: 'Active',
    },
    {
      id: 'compliance-safety-excellence',
      title: 'Compliance & Safety Excellence',
      enrolledStudents: students.filter((s) =>
        s.currentCourse.includes('Compliance')
      ).length,
      completionRate: Math.round(
        students
          .filter((s) => s.currentCourse.includes('Compliance'))
          .reduce((acc, s) => acc + s.progress, 0) /
          Math.max(
            students.filter((s) => s.currentCourse.includes('Compliance'))
              .length,
            1
          )
      ),
      averageScore: Math.round(
        students
          .filter((s) => s.currentCourse.includes('Compliance'))
          .reduce((acc, s) => acc + s.averageScore, 0) /
          Math.max(
            students.filter((s) => s.currentCourse.includes('Compliance'))
              .length,
            1
          )
      ),
      status: 'Active',
    },
  ];

  // Component initialization useEffect - moved here to fix React Hook violation
  useEffect(() => {
    const progress: { [key: string]: number } = {};

    trainingAccess.allowedModules.forEach((moduleId) => {
      progress[moduleId] = progressManager.getModuleCompletionPercentage(
        moduleId,
        user?.id
      );
    });

    setModuleProgress(progress);
    setCertificates(progressManager.getCertificates(user?.id));

    // Load available quiz modules from dynamic generator
    setAvailableModules(quizGenerator.getAvailableModules());
  }, [user, trainingAccess]);

  // Check if user has access to training
  if (!trainingAccess.canAccessTraining) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '600px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1
            style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '20px' }}
          >
            🚫 Access Restricted
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              marginBottom: '30px',
            }}
          >
            You don't have access to FleetFlow University℠. Please contact your
            administrator to request training access.
          </p>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCertificationEarned = (certificate: any) => {
    progressManager.awardCertificate(certificate, user?.id);
    setCertificates((prev) => [...prev, certificate]);
  };

  const handleStartLesson = (moduleId: string, lessonId: string) => {
    if (!hasModuleAccess(user, moduleId)) {
      alert('You do not have access to this training module.');
      return;
    }

    progressManager.startModule(moduleId, user?.id);
    // Simulate lesson completion after a short time (in real app, track actual completion)
    setTimeout(() => {
      progressManager.completeLesson(moduleId, lessonId, 5, user?.id); // 5 minutes simulated
      setModuleProgress((prev) => ({
        ...prev,
        [moduleId]: progressManager.getModuleCompletionPercentage(
          moduleId,
          user?.id
        ),
      }));
    }, 1000);
  };

  const handleStartQuiz = (moduleId: string) => {
    if (!user || !hasModuleAccess(user, moduleId)) {
      alert('You do not have access to this training module.');
      return;
    }

    const isEligible = progressManager.isCertificationEligible(
      moduleId,
      user?.id
    );
    if (isEligible) {
      try {
        // Generate dynamic quiz for modules that have quiz generator support
        if (availableModules.includes(moduleId)) {
          const quizData = quizGenerator.generateQuiz(moduleId);
          setDynamicQuizData(quizData);
        }
        setShowQuiz(moduleId);
      } catch (error) {
        console.error('Error generating quiz:', error);
        alert('Unable to generate quiz. Please try again later.');
      }
    } else {
      alert(
        `Complete the training module first! Progress: ${moduleProgress[moduleId] || 0}%`
      );
    }
  };

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
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 4s ease-in-out infinite reverse',
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
                transition: 'all 0.3s ease',
              }}
            >
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Professional LMS Header */}
      <div
        style={{
          marginBottom: '32px',
          padding: '0 24px',
        }}
      >
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
                🎓 FleetFlow University℠
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
                  🏫 Learning Management System - Administrator Console
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
                👨‍🏫 {user?.name}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                Training Administrator • {user?.role?.toUpperCase()}
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
                <span>📊 {students.length} Students</span>
                <span>📚 {comprehensiveCourses.length} Active Courses</span>
                <span>
                  🎯 {students.filter((s) => s.status === 'Completed').length}{' '}
                  Graduates
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
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'students', label: '👥 Student Roster', icon: '👥' },
              { id: 'courses', label: '📚 Course Management', icon: '📚' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' },
              { id: 'assessments', label: '🧠 Assessments', icon: '🧠' },
              { id: 'reports', label: '📋 Reports', icon: '📋' },
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
        {activeView === 'students' && (
          <div>
            {/* Student Roster Header */}
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
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  👥 Student Roster Management
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
                    + Add Student
                  </button>
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
                    📊 Export Report
                  </button>
                </div>
              </div>

              {/* Student Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '16px',
                }}
              >
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    style={{
                      background:
                        selectedStudent?.id === student.id
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))'
                          : 'rgba(255, 255, 255, 0.08)',
                      border:
                        selectedStudent?.id === student.id
                          ? '2px solid rgba(59, 130, 246, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
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
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {student.name}
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '4px',
                          }}
                        >
                          🆔 {student.id}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          📧 {student.email}
                        </div>
                      </div>
                      <div
                        style={{
                          background:
                            student.status === 'Completed'
                              ? '#10b981'
                              : student.status === 'Active'
                                ? '#3b82f6'
                                : '#f59e0b',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        {student.status}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                            marginBottom: '2px',
                          }}
                        >
                          Department
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          {student.department}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                            marginBottom: '2px',
                          }}
                        >
                          Role
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          {student.role}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Overall Progress
                        </span>
                        <span
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          {student.progress}%
                        </span>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          height: '8px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            background:
                              student.progress >= 80
                                ? '#10b981'
                                : student.progress >= 50
                                  ? '#3b82f6'
                                  : '#f59e0b',
                            height: '100%',
                            width: `${student.progress}%`,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      <span>
                        📚 {student.completedCourses}/{student.totalCourses}{' '}
                        Courses
                      </span>
                      <span>⭐ {student.averageScore}% Avg</span>
                      <span>📅 {student.lastActivity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Student Details */}
            {selectedStudent && (
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
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '20px',
                  }}
                >
                  📊 Student Profile: {selectedStudent.name}
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '24px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: '#60a5fa',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      Personal Information
                    </h4>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.6',
                      }}
                    >
                      <div>
                        <strong>Student ID:</strong> {selectedStudent.id}
                      </div>
                      <div>
                        <strong>Email:</strong> {selectedStudent.email}
                      </div>
                      <div>
                        <strong>Department:</strong>{' '}
                        {selectedStudent.department}
                      </div>
                      <div>
                        <strong>Role:</strong> {selectedStudent.role}
                      </div>
                      <div>
                        <strong>Enrolled:</strong>{' '}
                        {selectedStudent.enrollmentDate}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4
                      style={{
                        color: '#60a5fa',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      Academic Performance
                    </h4>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.6',
                      }}
                    >
                      <div>
                        <strong>Current Course:</strong>{' '}
                        {selectedStudent.currentCourse}
                      </div>
                      <div>
                        <strong>Progress:</strong> {selectedStudent.progress}%
                      </div>
                      <div>
                        <strong>Completed:</strong>{' '}
                        {selectedStudent.completedCourses}/
                        {selectedStudent.totalCourses} courses
                      </div>
                      <div>
                        <strong>Average Score:</strong>{' '}
                        {selectedStudent.averageScore}%
                      </div>
                      <div>
                        <strong>Status:</strong> {selectedStudent.status}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4
                      style={{
                        color: '#60a5fa',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      Quick Actions
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        📝 Assign Course
                      </button>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        🏆 Award Certificate
                      </button>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        📧 Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'dashboard' && (
          <div>
            {/* Dashboard Overview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              {/* Stats Cards */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h4
                  style={{
                    color: '#60a5fa',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  📊 Total Students
                </h4>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '4px',
                  }}
                >
                  {students.length}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  Across all departments
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h4
                  style={{
                    color: '#10b981',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  🎯 Completion Rate
                </h4>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '4px',
                  }}
                >
                  {Math.round(
                    students.reduce((acc, s) => acc + s.progress, 0) /
                      students.length
                  )}
                  %
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  Average progress
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h4
                  style={{
                    color: '#f59e0b',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  🏆 Graduates
                </h4>
                <div
                  style={{
                    color: 'white',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '4px',
                  }}
                >
                  {students.filter((s) => s.status === 'Completed').length}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  Certified professionals
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'courses' && (
          <div>
            {/* Course Management Header */}
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
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  📚 Course Analytics & Oversight
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
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
                    📊 Full Analytics
                  </button>
                </div>
              </div>

              {/* Course Overview Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#60a5fa',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {comprehensiveCourses.length}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Active Courses
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {comprehensiveCourses.reduce(
                      (acc, course) => acc + course.enrolledStudents,
                      0
                    )}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Total Enrollments
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {Math.round(
                      comprehensiveCourses.reduce(
                        (acc, course) => acc + course.completionRate,
                        0
                      ) / comprehensiveCourses.length
                    )}
                    %
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Avg Completion
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#a855f7',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {Math.round(
                      comprehensiveCourses.reduce(
                        (acc, course) => acc + course.averageScore,
                        0
                      ) / comprehensiveCourses.length
                    )}
                    %
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Avg Score
                  </div>
                </div>
              </div>

              {/* Course Performance Summary */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '20px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  📋 Course Performance Summary
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {comprehensiveCourses.map((course, index) => (
                    <div
                      key={course.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <h5
                          style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          {course.title}
                        </h5>
                        <div
                          style={{
                            background:
                              course.status === 'Active'
                                ? '#10b981'
                                : '#6b7280',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                          }}
                        >
                          {course.status}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '8px',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#60a5fa', fontWeight: '700' }}>
                            {course.enrolledStudents}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Students
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#10b981', fontWeight: '700' }}>
                            {course.completionRate}%
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Complete
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#f59e0b', fontWeight: '700' }}>
                            {course.averageScore}%
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Avg Score
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note about course location */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '20px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    margin: 0,
                  }}
                >
                  💡 <strong>Course Management:</strong> The 4 Role-Based
                  Comprehensive Courses are managed in
                  <strong style={{ color: '#60a5fa' }}>
                    {' '}
                    FleetFlow University℠
                  </strong>{' '}
                  (/university). This dashboard provides administrative
                  oversight and analytics.
                </p>
              </div>
            </div>
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
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              📈 Advanced Analytics
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Comprehensive analytics dashboard coming soon...
            </p>
          </div>
        )}

        {activeView === 'assessments' && (
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
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              🧠 Assessment Management
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Quiz and assessment creation tools coming soon...
            </p>
          </div>
        )}

        {activeView === 'reports' && (
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
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '16px',
              }}
            >
              📋 Advanced Reporting
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Comprehensive reporting suite coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
