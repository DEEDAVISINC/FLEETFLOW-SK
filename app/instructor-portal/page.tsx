'use client';

import { useEffect, useState } from 'react';
import UserProfileWorkflowService, {
  InstructorDashboardData,
} from '../services/UserProfileWorkflowService';

export default function InstructorPortal() {
  const [instructorData, setInstructorData] =
    useState<InstructorDashboardData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const workflowService = UserProfileWorkflowService.getInstance();

  useEffect(() => {
    // For demo, using Sarah Johnson as instructor
    const data = workflowService.getInstructorDashboard('sarah_johnson');
    setInstructorData(data);
  }, [workflowService]);

  const handleProgressUpdate = (
    studentId: string,
    moduleId: string,
    newProgress: number
  ) => {
    workflowService.updateTrainingProgress(studentId, moduleId, {
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : 'in_progress',
      completedDate:
        newProgress === 100
          ? new Date().toISOString().split('T')[0]
          : undefined,
      score:
        newProgress === 100 ? Math.floor(Math.random() * 20) + 80 : undefined, // Random score 80-100
    });

    // Refresh instructor data
    const updatedData = workflowService.getInstructorDashboard('sarah_johnson');
    setInstructorData(updatedData);
  };

  if (!instructorData) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        Loading instructor dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          🎓 FleetFlow University℠ Instructor Portal
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0',
            fontSize: '16px',
          }}
        >
          Welcome, {instructorData.instructorName} - Monitor student progress
          and manage training assignments
        </p>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Performance Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#3b82f6',
                marginBottom: '8px',
              }}
            >
              {instructorData.performanceMetrics.totalStudents}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Total Students
            </div>
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '8px',
              }}
            >
              {Math.round(instructorData.performanceMetrics.averageCompletion)}%
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Avg Completion
            </div>
          </div>

          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ef4444',
                marginBottom: '8px',
              }}
            >
              {instructorData.performanceMetrics.overdueAssignments}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Overdue Tasks
            </div>
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#f59e0b',
                marginBottom: '8px',
              }}
            >
              {instructorData.performanceMetrics.recentCompletions}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Recent Completions
            </div>
          </div>
        </div>

        {/* Student List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👥 My Students
            </h2>
          </div>

          <div style={{ padding: '24px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
              }}
            >
              {instructorData.students.map((student) => (
                <div
                  key={student.userId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 4px 0',
                          color: 'white',
                        }}
                      >
                        {student.userName}
                      </h3>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {student.department}
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color:
                            student.overallProgress >= 80
                              ? '#10b981'
                              : student.overallProgress >= 50
                                ? '#f59e0b'
                                : '#ef4444',
                        }}
                      >
                        {student.overallProgress}%
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {student.completedModules}/{student.totalModules}{' '}
                        Complete
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      height: '8px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        background:
                          student.overallProgress >= 80
                            ? '#10b981'
                            : student.overallProgress >= 50
                              ? '#f59e0b'
                              : '#ef4444',
                        height: '100%',
                        width: `${student.overallProgress}%`,
                        borderRadius: '8px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  {/* Training Modules */}
                  <div
                    style={{
                      display: 'grid',
                      gap: '8px',
                    }}
                  >
                    {student.progressData.map((progress) => (
                      <div
                        key={progress.moduleId}
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
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                              marginBottom: '4px',
                            }}
                          >
                            {progress.moduleName}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color:
                                progress.status === 'completed'
                                  ? '#10b981'
                                  : progress.status === 'in_progress'
                                    ? '#f59e0b'
                                    : '#ef4444',
                            }}
                          >
                            {progress.status === 'completed'
                              ? '✅ Completed'
                              : progress.status === 'in_progress'
                                ? '📚 In Progress'
                                : '⏳ Not Started'}
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color:
                                progress.status === 'completed'
                                  ? '#10b981'
                                  : progress.status === 'in_progress'
                                    ? '#f59e0b'
                                    : '#ef4444',
                            }}
                          >
                            {progress.progress}%
                          </div>
                          {progress.status !== 'completed' && (
                            <button
                              onClick={() =>
                                handleProgressUpdate(
                                  student.userId,
                                  progress.moduleId,
                                  progress.progress + 25
                                )
                              }
                              style={{
                                background: 'rgba(59, 130, 246, 0.8)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.background =
                                  'rgba(59, 130, 246, 1)';
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.background =
                                  'rgba(59, 130, 246, 0.8)';
                              }}
                            >
                              +25%
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Student Actions */}
                  <div
                    style={{
                      marginTop: '16px',
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <button
                      onClick={() =>
                        setSelectedStudent(
                          selectedStudent === student.userId
                            ? null
                            : student.userId
                        )
                      }
                      style={{
                        background: 'rgba(16, 185, 129, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background =
                          'rgba(16, 185, 129, 1)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background =
                          'rgba(16, 185, 129, 0.8)';
                      }}
                    >
                      📊 View Details
                    </button>
                    <button
                      style={{
                        background: 'rgba(245, 158, 11, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background =
                          'rgba(245, 158, 11, 1)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background =
                          'rgba(245, 158, 11, 0.8)';
                      }}
                    >
                      📝 Send Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Connection Info */}
        <div
          style={{
            marginTop: '32px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
              color: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🔄 Complete Profile Workflow System
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '8px',
                }}
              >
                1️⃣ User Management
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Creates profiles, assigns training modules, grants permissions
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '8px',
                }}
              >
                2️⃣ User Profile
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Shows assigned training, progress tracking, completion status
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#8b5cf6',
                  marginBottom: '8px',
                }}
              >
                3️⃣ Instructor Portal
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Monitors student progress, updates completion, provides feedback
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
