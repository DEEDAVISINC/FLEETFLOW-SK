'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkPermission, getCurrentUser } from '../../config/access';
import type {
  QuizAttempt,
  TrainingProgress,
} from '../../utils/trainingProgress';
import { progressManager } from '../../utils/trainingProgress';

interface UserTrainingData {
  user: TrainingProgress;
  completedModules: number;
  averageScore: number;
  lastActivity: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export default function TrainingAdminPage() {
  const { user } = getCurrentUser();
  const hasAdminAccess = checkPermission('hasAdminAccess');

  const [trainingData, setTrainingData] = useState<UserTrainingData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newUserAssignment, setNewUserAssignment] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    userRole: 'driver',
    modules: [] as string[],
  });

  useEffect(() => {
    if (hasAdminAccess) {
      loadTrainingData();
      loadAnalytics();
    }
  }, [hasAdminAccess]);

  const loadTrainingData = () => {
    const allProgress = progressManager.getAllUsersProgress();

    const userData: UserTrainingData[] = allProgress.map((progress) => {
      const completedModules = progress.modules.filter(
        (m) => m.isCompleted
      ).length;
      const quizAttempts = progress.quizAttempts;
      const averageScore =
        quizAttempts.length > 0
          ? Math.round(
              quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
                quizAttempts.length
            )
          : 0;

      let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
      if (progress.overallCompletionPercentage === 100) {
        status = 'completed';
      } else if (progress.modules.length > 0 || quizAttempts.length > 0) {
        status = 'in-progress';
      }

      return {
        user: progress,
        completedModules,
        averageScore,
        lastActivity: progress.lastAccessed,
        status,
      };
    });

    setTrainingData(userData);
  };

  const loadAnalytics = () => {
    const analytics = progressManager.getTrainingAnalytics();
    setAnalytics(analytics);
  };

  const handleAssignTraining = () => {
    if (newUserAssignment.userId && newUserAssignment.modules.length > 0) {
      // Initialize user if they don't exist
      progressManager.initializeUserProgress(
        newUserAssignment.userId,
        newUserAssignment.userRole,
        newUserAssignment.userName,
        newUserAssignment.userEmail
      );

      // Assign modules
      progressManager.assignTrainingModules(
        newUserAssignment.userId,
        newUserAssignment.modules
      );

      setShowAssignModal(false);
      setNewUserAssignment({
        userId: '',
        userName: '',
        userEmail: '',
        userRole: 'driver',
        modules: [],
      });

      loadTrainingData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#F59E0B';
      case 'not-started':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'not-started':
        return '⭕';
      default:
        return '⭕';
    }
  };

  const moduleNames = {
    dispatch: 'Dispatch Operations',
    broker: 'Freight Broker Agent',
    compliance: 'Compliance & Safety',
    safety: 'Safety Management',
    workflow: 'Workflow Management',
    'sms-workflow': 'SMS Communication',
  };

  if (!hasAdminAccess) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>
          You don't have permission to access the training administration panel.
        </p>
        <Link
          href='/training'
          style={{ color: '#3B82F6', textDecoration: 'underline' }}
        >
          Return to Training
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1F2937',
                margin: '0 0 10px 0',
              }}
            >
              🎓 Training Administration
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#6B7280', margin: 0 }}>
              Manage training assignments, track progress, and monitor
              performance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => setShowAssignModal(true)}
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'translateY(0)')
              }
            >
              ➕ Assign Training
            </button>
            <Link
              href='/training'
              style={{
                background: 'linear-gradient(135deg, #6B7280, #4B5563)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'transform 0.2s',
              }}
            >
              ← Back to Training
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '20px',
            }}
          >
            📊 Training Analytics
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {analytics.totalUsers}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Total Users
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {analytics.activeUsers}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Active Users (30 days)
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {analytics.completedTrainings}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Completed Trainings
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {analytics.averageScore}%
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Average Score
              </div>
            </div>
          </div>

          {/* Module Statistics */}
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '15px',
            }}
          >
            Module Performance
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '15px',
            }}
          >
            {analytics.moduleStats.map((stat: any) => (
              <div
                key={stat.moduleId}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '10px',
                  }}
                >
                  {moduleNames[stat.moduleId as keyof typeof moduleNames] ||
                    stat.moduleId}
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    fontSize: '0.9rem',
                  }}
                >
                  <div>
                    Enrolled: <strong>{stat.enrolled}</strong>
                  </div>
                  <div>
                    Completed: <strong>{stat.completed}</strong>
                  </div>
                  <div>
                    Completion Rate: <strong>{stat.completionRate}%</strong>
                  </div>
                  <div>
                    Avg Score: <strong>{stat.averageScore}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Training Table */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(10px)',
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
          <h2
            style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1F2937' }}
          >
            👥 User Training Progress
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem', color: '#6B7280' }}>
              Filter by Module:
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '0.9rem',
              }}
            >
              <option value='all'>All Modules</option>
              {Object.entries(moduleNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  User
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Progress
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Modules Completed
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Average Score
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Last Activity
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {trainingData.map((userData, index) => (
                <>
                  <tr
                    key={userData.user.userId}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor:
                        index % 2 === 0
                          ? 'rgba(249, 250, 251, 0.5)'
                          : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1F2937' }}>
                          {userData.user.userName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                          {userData.user.userEmail}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#1D4ED8',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                        }}
                      >
                        {userData.user.userRole}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                        }}
                      >
                        <span>{getStatusIcon(userData.status)}</span>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            color: getStatusColor(userData.status),
                          }}
                        >
                          {userData.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div
                        style={{
                          background: '#F3F4F6',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#1F2937',
                        }}
                      >
                        {userData.user.overallCompletionPercentage}%
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      {userData.completedModules} /{' '}
                      {userData.user.assignedModules.length}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      {userData.averageScore > 0
                        ? `${userData.averageScore}%`
                        : 'N/A'}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: '#6B7280',
                      }}
                    >
                      {new Date(userData.lastActivity).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() =>
                          setSelectedUser(
                            selectedUser === userData.user.userId
                              ? null
                              : userData.user.userId
                          )
                        }
                        style={{
                          background:
                            'linear-gradient(135deg, #6366F1, #4F46E5)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        {selectedUser === userData.user.userId
                          ? 'Hide'
                          : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {/* Expanded details row */}
                  {selectedUser === userData.user.userId && (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          padding: '20px',
                          backgroundColor: 'rgba(239, 246, 255, 0.5)',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                          }}
                        >
                          {/* Assigned Modules */}
                          <div>
                            <h4
                              style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#1F2937',
                                marginBottom: '10px',
                              }}
                            >
                              Assigned Modules
                            </h4>
                            {userData.user.assignedModules.map(
                              (moduleId: string) => {
                                const userModule = userData.user.modules.find(
                                  (m: any) => m.moduleId === moduleId
                                );
                                return (
                                  <div
                                    key={moduleId}
                                    style={{
                                      background: 'white',
                                      padding: '10px',
                                      borderRadius: '8px',
                                      marginBottom: '8px',
                                      border: '1px solid #E5E7EB',
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <span style={{ fontWeight: '500' }}>
                                        {moduleNames[
                                          moduleId as keyof typeof moduleNames
                                        ] || moduleId}
                                      </span>
                                      <span
                                        style={{
                                          color: userModule?.isCompleted
                                            ? '#10B981'
                                            : '#F59E0B',
                                          fontSize: '0.8rem',
                                          fontWeight: '600',
                                        }}
                                      >
                                        {userModule?.isCompleted
                                          ? '✅ Completed'
                                          : '🔄 In Progress'}
                                      </span>
                                    </div>
                                    {userModule && (
                                      <div
                                        style={{
                                          fontSize: '0.8rem',
                                          color: '#6B7280',
                                          marginTop: '4px',
                                        }}
                                      >
                                        Time spent:{' '}
                                        {Math.round(
                                          userModule.totalTimeSpent / 60
                                        )}{' '}
                                        minutes
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>

                          {/* Quiz Attempts */}
                          <div>
                            <h4
                              style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#1F2937',
                                marginBottom: '10px',
                              }}
                            >
                              Recent Quiz Attempts
                            </h4>
                            {userData.user.quizAttempts
                              .slice(-5)
                              .map((attempt: QuizAttempt) => (
                                <div
                                  key={attempt.attemptId}
                                  style={{
                                    background: 'white',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    border: '1px solid #E5E7EB',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ fontWeight: '500' }}>
                                      {moduleNames[
                                        attempt.quizId as keyof typeof moduleNames
                                      ] || attempt.quizId}
                                    </span>
                                    <span
                                      style={{
                                        color: attempt.passed
                                          ? '#10B981'
                                          : '#EF4444',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                      }}
                                    >
                                      {attempt.score}%
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.8rem',
                                      color: '#6B7280',
                                      marginTop: '4px',
                                    }}
                                  >
                                    {attempt.correctAnswers}/
                                    {attempt.totalQuestions} correct •{' '}
                                    {new Date(
                                      attempt.completedAt
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            {userData.user.quizAttempts.length === 0 && (
                              <div
                                style={{
                                  color: '#6B7280',
                                  fontSize: '0.9rem',
                                  fontStyle: 'italic',
                                }}
                              >
                                No quiz attempts yet
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '20px',
              }}
            >
              Assign Training Modules
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '5px',
                }}
              >
                User ID
              </label>
              <input
                type='text'
                value={newUserAssignment.userId}
                onChange={(e) =>
                  setNewUserAssignment((prev) => ({
                    ...prev,
                    userId: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '1rem',
                }}
                placeholder='Enter unique user ID'
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '5px',
                }}
              >
                Full Name
              </label>
              <input
                type='text'
                value={newUserAssignment.userName}
                onChange={(e) =>
                  setNewUserAssignment((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '1rem',
                }}
                placeholder='Enter full name'
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '5px',
                }}
              >
                Email
              </label>
              <input
                type='email'
                value={newUserAssignment.userEmail}
                onChange={(e) =>
                  setNewUserAssignment((prev) => ({
                    ...prev,
                    userEmail: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '1rem',
                }}
                placeholder='Enter email address'
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '5px',
                }}
              >
                Role
              </label>
              <select
                value={newUserAssignment.userRole}
                onChange={(e) =>
                  setNewUserAssignment((prev) => ({
                    ...prev,
                    userRole: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '1rem',
                }}
              >
                <option value='driver'>Driver</option>
                <option value='dispatcher'>Dispatcher</option>
                <option value='broker'>Broker</option>
                <option value='manager'>Manager</option>
                <option value='admin'>Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '10px',
                }}
              >
                Training Modules
              </label>
              {Object.entries(moduleNames).map(([key, name]) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={newUserAssignment.modules.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewUserAssignment((prev) => ({
                          ...prev,
                          modules: [...prev.modules, key],
                        }));
                      } else {
                        setNewUserAssignment((prev) => ({
                          ...prev,
                          modules: prev.modules.filter((m) => m !== key),
                        }));
                      }
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>{name}</span>
                </label>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowAssignModal(false)}
                style={{
                  background: '#6B7280',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTraining}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Assign Training
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
