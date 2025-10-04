'use client';

import { useEffect, useState } from 'react';
import { credentialsService } from '../services/CredentialsManagementService';

interface Grant {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: Date;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Awarded' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string[];
  completionPercentage: number;
  documents: GrantDocument[];
  notes: string;
}

interface GrantDocument {
  id: string;
  name: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  assignedTo: string;
  dueDate: Date;
}

interface AIStaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  tasksCompleted: number;
  currentTasks: string[];
}

export default function GrantAcquisitionBatchDeployment() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [aiStaff, setAiStaff] = useState<AIStaffMember[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tracking' | 'deadlines' | 'staff' | 'credentials'
  >('overview');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  useEffect(() => {
    // Initialize grants with the top 3 prioritized grants
    const initialGrants: Grant[] = [
      {
        id: 'grant-1',
        name: 'Fifteen Percent Pledge Foundation Grant',
        provider: 'Fifteen Percent Pledge',
        amount: '$10,000 - $50,000',
        deadline: new Date('2025-12-31'),
        status: 'Not Started',
        priority: 'High',
        assignedTo: [],
        completionPercentage: 0,
        documents: [
          {
            id: 'doc-1-1',
            name: 'Business Overview & Mission Statement',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-17'),
          },
          {
            id: 'doc-1-2',
            name: 'Financial Statements (2023-2024)',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-20'),
          },
          {
            id: 'doc-1-3',
            name: 'Impact Plan & Community Engagement Strategy',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-24'),
          },
          {
            id: 'doc-1-4',
            name: 'Budget Breakdown & Fund Usage Plan',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-27'),
          },
        ],
        notes: 'Focus on community impact and Black-owned business support',
      },
      {
        id: 'grant-2',
        name: 'Nasdaq Entrepreneurial Center Grant',
        provider: 'Nasdaq Foundation',
        amount: '$25,000 - $100,000',
        deadline: new Date('2025-11-30'),
        status: 'Not Started',
        priority: 'High',
        assignedTo: [],
        completionPercentage: 0,
        documents: [
          {
            id: 'doc-2-1',
            name: 'Company Executive Summary',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-20'),
          },
          {
            id: 'doc-2-2',
            name: 'Technology Innovation & Scalability Plan',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-27'),
          },
          {
            id: 'doc-2-3',
            name: 'Financial Projections (3-Year)',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-11-03'),
          },
          {
            id: 'doc-2-4',
            name: 'Market Analysis & Competitive Advantage',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-11-10'),
          },
        ],
        notes: 'Emphasize tech innovation and scalability in logistics/freight',
      },
      {
        id: 'grant-3',
        name: 'Intuit Small Business Hero Grant',
        provider: 'Intuit',
        amount: '$10,000 - $25,000',
        deadline: new Date('2025-10-31'),
        status: 'Not Started',
        priority: 'High',
        assignedTo: [],
        completionPercentage: 0,
        documents: [
          {
            id: 'doc-3-1',
            name: 'Business Story & Founder Journey',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-15'),
          },
          {
            id: 'doc-3-2',
            name: 'Community Impact Statement',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-18'),
          },
          {
            id: 'doc-3-3',
            name: 'Financial Overview & Use of Funds',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-22'),
          },
          {
            id: 'doc-3-4',
            name: 'Video Pitch (2-3 minutes)',
            status: 'Pending',
            assignedTo: '',
            dueDate: new Date('2025-10-25'),
          },
        ],
        notes:
          'Storytelling focused - highlight personal journey and community impact',
      },
    ];

    setGrants(initialGrants);

    // Initialize AI Staff
    const staffMembers: AIStaffMember[] = [
      {
        id: 'staff-1',
        name: 'Grant Research AI',
        role: 'Research Specialist',
        specialty: 'Grant Discovery & Eligibility Analysis',
        avatar: '🔍',
        tasksCompleted: 0,
        currentTasks: [],
      },
      {
        id: 'staff-2',
        name: 'Application Writer AI',
        role: 'Content Specialist',
        specialty: 'Application Writing & Document Preparation',
        avatar: '✍️',
        tasksCompleted: 0,
        currentTasks: [],
      },
      {
        id: 'staff-3',
        name: 'Financial Analyst AI',
        role: 'Finance Specialist',
        specialty: 'Financial Statements & Projections',
        avatar: '📊',
        tasksCompleted: 0,
        currentTasks: [],
      },
      {
        id: 'staff-4',
        name: 'Deadline Manager AI',
        role: 'Project Manager',
        specialty: 'Timeline Management & Reminders',
        avatar: '⏰',
        tasksCompleted: 0,
        currentTasks: [],
      },
      {
        id: 'staff-5',
        name: 'Follow-up AI',
        role: 'Communications Specialist',
        specialty: 'Grant Follow-up & Relationship Management',
        avatar: '💬',
        tasksCompleted: 0,
        currentTasks: [],
      },
    ];

    setAiStaff(staffMembers);
  }, []);

  const handleDeployBatchCampaign = () => {
    setShowDeployModal(true);
  };

  const handleAssignStaff = (grantId: string, staffIds: string[]) => {
    setGrants((prev) =>
      prev.map((grant) =>
        grant.id === grantId
          ? { ...grant, assignedTo: staffIds, status: 'In Progress' as const }
          : grant
      )
    );
  };

  const getDaysUntilDeadline = (deadline: Date): number => {
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getDeadlineColor = (days: number): string => {
    if (days < 7) return '#ef4444';
    if (days < 14) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div
      style={{
        padding: '30px',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            🎯 Grant Acquisition Campaign
          </h1>
          <button
            onClick={handleDeployBatchCampaign}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#2563eb')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#3b82f6')
            }
          >
            🚀 Deploy All Staff
          </button>
        </div>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          AI-powered grant discovery, application, and tracking system for
          DEPOINTE
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}
          >
            Total Grants
          </div>
          <div
            style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}
          >
            {grants.length}
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}
          >
            In Progress
          </div>
          <div
            style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}
          >
            {grants.filter((g) => g.status === 'In Progress').length}
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}
          >
            Submitted
          </div>
          <div
            style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}
          >
            {grants.filter((g) => g.status === 'Submitted').length}
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}
          >
            AI Staff Active
          </div>
          <div
            style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}
          >
            {aiStaff.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '30px' }}>
          {(
            [
              'overview',
              'tracking',
              'deadlines',
              'staff',
              'credentials',
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom:
                  activeTab === tab
                    ? '2px solid #3b82f6'
                    : '2px solid transparent',
                color: activeTab === tab ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab ? '600' : '400',
                fontSize: '16px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '20px',
          }}
        >
          {grants.map((grant) => (
            <div
              key={grant.id}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: `2px solid ${grant.priority === 'High' ? '#3b82f6' : '#e5e7eb'}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {grant.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      color: '#6b7280',
                      fontSize: '14px',
                    }}
                  >
                    <span>🏢 {grant.provider}</span>
                    <span>💰 {grant.amount}</span>
                    <span
                      style={{
                        color: getDeadlineColor(
                          getDaysUntilDeadline(grant.deadline)
                        ),
                      }}
                    >
                      ⏰ {getDaysUntilDeadline(grant.deadline)} days left
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: '6px 12px',
                    backgroundColor:
                      grant.status === 'Not Started' ? '#f3f4f6' : '#dbeafe',
                    color:
                      grant.status === 'Not Started' ? '#6b7280' : '#3b82f6',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {grant.status}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Completion
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {grant.completionPercentage}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${grant.completionPercentage}%`,
                      height: '100%',
                      backgroundColor: '#3b82f6',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {/* Documents */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Required Documents:
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {grant.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <span>{doc.name}</span>
                      <span
                        style={{
                          padding: '4px 8px',
                          backgroundColor:
                            doc.status === 'Complete'
                              ? '#dcfce7'
                              : doc.status === 'In Progress'
                                ? '#fef3c7'
                                : '#f3f4f6',
                          color:
                            doc.status === 'Complete'
                              ? '#166534'
                              : doc.status === 'In Progress'
                                ? '#92400e'
                                : '#6b7280',
                          borderRadius: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Staff */}
              {grant.assignedTo.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Assigned AI Staff:
                  </div>
                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    {grant.assignedTo.map((staffId) => {
                      const staff = aiStaff.find((s) => s.id === staffId);
                      return staff ? (
                        <div
                          key={staffId}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ede9fe',
                            color: '#6b21a8',
                            borderRadius: '6px',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>{staff.avatar}</span>
                          <span>{staff.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  fontStyle: 'italic',
                }}
              >
                💡 {grant.notes}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedGrant(grant)}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '10px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#2563eb')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#3b82f6')
                }
              >
                Manage Grant
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === 'tracking' && (
        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Grant Application Tracking
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  Grant Name
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  Provider
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  Deadline
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {grants.map((grant) => (
                <tr
                  key={grant.id}
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                  <td style={{ padding: '16px' }}>{grant.name}</td>
                  <td style={{ padding: '16px' }}>{grant.provider}</td>
                  <td style={{ padding: '16px' }}>{grant.amount}</td>
                  <td
                    style={{
                      padding: '16px',
                      color: getDeadlineColor(
                        getDaysUntilDeadline(grant.deadline)
                      ),
                    }}
                  >
                    {grant.deadline.toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        backgroundColor:
                          grant.status === 'Not Started'
                            ? '#f3f4f6'
                            : '#dbeafe',
                        color:
                          grant.status === 'Not Started'
                            ? '#6b7280'
                            : '#3b82f6',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      {grant.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${grant.completionPercentage}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          minWidth: '40px',
                        }}
                      >
                        {grant.completionPercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deadlines Tab */}
      {activeTab === 'deadlines' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {grants.map((grant) => (
            <div
              key={grant.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${getDeadlineColor(getDaysUntilDeadline(grant.deadline))}`,
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                {grant.name}
              </h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: getDeadlineColor(
                      getDaysUntilDeadline(grant.deadline)
                    ),
                  }}
                >
                  {getDaysUntilDeadline(grant.deadline)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    days until deadline
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {grant.deadline.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  Upcoming Document Deadlines:
                </div>
                {grant.documents.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      fontSize: '12px',
                    }}
                  >
                    <span>{doc.name}</span>
                    <span style={{ color: '#6b7280' }}>
                      {doc.dueDate.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {aiStaff.map((staff) => (
            <div
              key={staff.id}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#ede9fe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                  }}
                >
                  {staff.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                    }}
                  >
                    {staff.name}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {staff.role}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Specialty:
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                  {staff.specialty}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#166534',
                      marginBottom: '4px',
                    }}
                  >
                    Tasks Completed
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#166534',
                    }}
                  >
                    {staff.tasksCompleted}
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#92400e',
                      marginBottom: '4px',
                    }}
                  >
                    Current Tasks
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#92400e',
                    }}
                  >
                    {staff.currentTasks.length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Credentials Tab */}
      {activeTab === 'credentials' && (
        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              🏆 Business Credentials & Certifications
            </h2>
            <button
              onClick={() => {
                const narrative =
                  credentialsService.generateCredentialsNarrative();
                navigator.clipboard.writeText(narrative);
                alert('Credentials narrative copied to clipboard!');
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📋 Copy for Grant Application
            </button>
          </div>

          {/* Summary Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '30px',
            }}
          >
            {[
              {
                label: 'Total Credentials',
                value: credentialsService.getAllCredentials().length,
                color: '#3b82f6',
              },
              {
                label: 'Federal Certifications',
                value:
                  credentialsService.getCredentialsByCategory('federal').length,
                color: '#10b981',
              },
              {
                label: 'Professional Licenses',
                value: credentialsService
                  .getAllCredentials()
                  .filter((c) => c.type === 'license').length,
                color: '#8b5cf6',
              },
              {
                label: 'Industries Served',
                value: 5,
                color: '#f59e0b',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${stat.color}`,
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '8px',
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Credentials by Category */}
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              Federal Certifications
            </h3>
            <div style={{ display: 'grid', gap: '12px', marginBottom: '30px' }}>
              {credentialsService
                .getCredentialsByCategory('federal')
                .map((cred) => (
                  <div
                    key={cred.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '2px solid #10b981',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                          }}
                        >
                          {cred.name}
                        </h4>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '8px',
                          }}
                        >
                          {cred.issuingAuthority}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#374151',
                            marginBottom: '12px',
                          }}
                        >
                          {cred.description}
                        </div>
                        {cred.documentFileName && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#10b981',
                              fontWeight: '600',
                            }}
                          >
                            📄 {cred.documentFileName}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {cred.grantApplicationValue.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              Professional Licenses
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {credentialsService
                .getAllCredentials()
                .filter((c) => c.type === 'license')
                .map((cred) => (
                  <div
                    key={cred.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#fef3c7',
                      borderRadius: '8px',
                      border: '2px solid #f59e0b',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                          }}
                        >
                          {cred.name}
                          {cred.credentialNumber && (
                            <span
                              style={{ color: '#f59e0b', marginLeft: '8px' }}
                            >
                              ({cred.credentialNumber})
                            </span>
                          )}
                        </h4>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '8px',
                          }}
                        >
                          {cred.issuingAuthority}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#374151',
                            marginBottom: '12px',
                          }}
                        >
                          {cred.description}
                        </div>
                        {cred.proofOfCompliance &&
                          cred.proofOfCompliance.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '6px',
                                }}
                              >
                                Compliance Proof:
                              </div>
                              <ul
                                style={{
                                  margin: 0,
                                  paddingLeft: '20px',
                                  fontSize: '12px',
                                }}
                              >
                                {cred.proofOfCompliance.map((proof, idx) => (
                                  <li key={idx} style={{ marginBottom: '4px' }}>
                                    {proof}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {cred.documentFileName && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#f59e0b',
                              fontWeight: '600',
                              marginTop: '8px',
                            }}
                          >
                            📄 {cred.documentFileName}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {cred.grantApplicationValue.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Supporting Documents */}
          <div style={{ marginTop: '40px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              📁 Supporting Documents for Grant Submission
            </h3>
            <div
              style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
              }}
            >
              <table style={{ width: '100%', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                      }}
                    >
                      Document
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontWeight: '600',
                      }}
                    >
                      Grant Relevance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {credentialsService
                    .getGrantSupportingDocuments()
                    .map((doc, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: '1px solid #e5e7eb' }}
                      >
                        <td style={{ padding: '12px' }}>{doc.fileName}</td>
                        <td style={{ padding: '12px' }}>{doc.category}</td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              padding: '4px 8px',
                              backgroundColor: doc.grantRelevance.includes(
                                'CRITICAL'
                              )
                                ? '#dcfce7'
                                : doc.grantRelevance.includes('HIGH')
                                  ? '#fef3c7'
                                  : '#f3f4f6',
                              color: doc.grantRelevance.includes('CRITICAL')
                                ? '#166534'
                                : doc.grantRelevance.includes('HIGH')
                                  ? '#92400e'
                                  : '#6b7280',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {doc.grantRelevance}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Deploy Modal */}
      {showDeployModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowDeployModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              🚀 Deploy AI Staff
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Deploy all AI staff members to begin automated grant discovery,
              application preparation, and deadline management.
            </p>
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                }}
              >
                Staff will be deployed for:
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  ✅ Grant Research & Discovery
                </li>
                <li
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  ✅ Application Document Preparation
                </li>
                <li
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  ✅ Financial Analysis & Projections
                </li>
                <li
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  ✅ Deadline Monitoring & Reminders
                </li>
                <li style={{ padding: '8px 0' }}>
                  ✅ Follow-up & Communication
                </li>
              </ul>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowDeployModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Auto-assign staff to grants
                  setGrants((prev) =>
                    prev.map((grant) => ({
                      ...grant,
                      assignedTo: [
                        'staff-1',
                        'staff-2',
                        'staff-3',
                        'staff-4',
                        'staff-5',
                      ],
                      status: 'In Progress' as const,
                    }))
                  );
                  setShowDeployModal(false);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#2563eb')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#3b82f6')
                }
              >
                Deploy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
