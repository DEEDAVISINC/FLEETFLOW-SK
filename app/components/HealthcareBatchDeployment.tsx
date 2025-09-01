'use client';

import { useState } from 'react';

export interface HealthcareTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category:
    | 'partnerships'
    | 'research'
    | 'compliance'
    | 'api-integration'
    | 'marketing';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  timeline: string;
  deliverables: string[];
  revenueTarget?: string;
  createdAt: Date;
  dueDate?: Date;
}

interface HealthcareBatchDeploymentProps {
  onBatchDeploy: (tasks: HealthcareTask[]) => void;
  onClose: () => void;
}

const HEALTHCARE_STAFF_MAPPING = {
  'will-004': {
    name: 'Will',
    role: 'Sales Operations',
    avatar: '💼',
    department: 'Freight Operations',
  },
  'gary-003': {
    name: 'Gary',
    role: 'Lead Generation',
    avatar: '📈',
    department: 'Business Development',
  },
  'brook-009': {
    name: 'Brook R.',
    role: 'Brokerage Operations',
    avatar: '🌊',
    department: 'Relationships',
  },
  'kameelah-014': {
    name: 'Kameelah',
    role: 'DOT Compliance',
    avatar: '⚖️',
    department: 'Compliance & Safety',
  },
  'regina-015': {
    name: 'Regina',
    role: 'FMCSA Regulations',
    avatar: '📋',
    department: 'Compliance & Safety',
  },
  'drew-017': {
    name: 'Drew',
    role: 'Marketing',
    avatar: '📢',
    department: 'Business Development',
  },
};

const HEALTHCARE_TEMPLATES = {
  partnerships: {
    title: 'Healthcare Platform Partnership Applications',
    description:
      'Apply to and secure partnerships with major healthcare logistics platforms',
    category: 'partnerships' as const,
    priority: 'CRITICAL' as const,
    timeline: '14 days',
    suggestedStaff: ['will-004'],
    deliverables: [
      'MedSpeed Network partnership application submitted',
      'Quest Diagnostics carrier program application submitted',
      'McKesson pharmaceutical network application submitted',
      'LabCorp logistics network application submitted',
      'Partnership agreements negotiated and signed',
      'API credentials obtained for each platform',
    ],
    revenueTarget: '$500,000+',
  },
  research: {
    title: 'Hospital Transportation Manager Database Building',
    description:
      'Build comprehensive database of hospital logistics contacts for direct outreach',
    category: 'research' as const,
    priority: 'HIGH' as const,
    timeline: '21 days',
    suggestedStaff: ['gary-003'],
    deliverables: [
      'Database of 100+ hospital transportation managers',
      'TruckingPlanet Network healthcare logistics contacts extracted',
      'Contact information verified and current',
      'Prospect priority rankings with revenue potential',
      'Regional pharmaceutical distribution contacts identified',
      'Clinical trial logistics opportunities researched',
      'Medical equipment transport prospects catalogued',
    ],
    revenueTarget: '$250,000+',
  },
  compliance: {
    title: 'Healthcare Compliance Documentation & Validation',
    description:
      'Ensure all healthcare certifications and compliance documentation is current',
    category: 'compliance' as const,
    priority: 'CRITICAL' as const,
    timeline: '7 days',
    suggestedStaff: ['kameelah-014', 'regina-015'],
    deliverables: [
      'HIPAA compliance certification verified and documented',
      'Medical courier licenses confirmed current',
      'FDA compliance documentation validated',
      'DOT medical certification status checked',
      'Healthcare compliance packages prepared for partners',
      'Regulatory monitoring system established',
    ],
  },
  integration: {
    title: 'Healthcare API Integration & Pipeline Management',
    description:
      'Manage technical integration with healthcare logistics APIs and opportunity tracking',
    category: 'api-integration' as const,
    priority: 'HIGH' as const,
    timeline: '30 days',
    suggestedStaff: ['brook-009'],
    deliverables: [
      'Partnership application statuses monitored daily',
      'API credentials setup as approvals come in',
      'Healthcare search functionality tested and validated',
      'Opportunity data pipeline established',
      'Healthcare bid conversion tracking implemented',
      'Revenue pipeline forecasting system built',
    ],
    revenueTarget: '$300,000+',
  },
  marketing: {
    title: 'Healthcare Marketing Materials & Digital Presence',
    description:
      'Create specialized marketing materials for healthcare logistics market',
    category: 'marketing' as const,
    priority: 'MEDIUM' as const,
    timeline: '21 days',
    suggestedStaff: ['drew-017'],
    deliverables: [
      'Medical courier marketing brochure designed',
      'Pharmaceutical logistics presentation created',
      'HIPAA compliance marketing materials developed',
      'Healthcare partnership pitch deck built',
      'Healthcare-focused website pages updated',
      'Medical courier email marketing templates created',
    ],
  },
};

export default function HealthcareBatchDeployment({
  onBatchDeploy,
  onClose,
}: HealthcareBatchDeploymentProps) {
  const [selectedTasks, setSelectedTasks] = useState<{ [key: string]: any }>(
    {}
  );
  const [deploymentStep, setDeploymentStep] = useState<
    'select' | 'configure' | 'deploy'
  >('select');

  const toggleTaskSelection = (templateKey: string) => {
    const template = HEALTHCARE_TEMPLATES[templateKey];
    if (!template) return;

    setSelectedTasks((prev) => {
      if (prev[templateKey]) {
        const newTasks = { ...prev };
        delete newTasks[templateKey];
        return newTasks;
      } else {
        return {
          ...prev,
          [templateKey]: {
            ...template,
            assignedTo: [...template.suggestedStaff],
            id: `healthcare-${templateKey}`,
          },
        };
      }
    });
  };

  const toggleStaffAssignment = (templateKey: string, staffId: string) => {
    setSelectedTasks((prev) => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey],
        assignedTo: prev[templateKey]?.assignedTo?.includes(staffId)
          ? prev[templateKey].assignedTo.filter((id) => id !== staffId)
          : [...(prev[templateKey]?.assignedTo || []), staffId],
      },
    }));
  };

  const handleGoLive = () => {
    const tasksToDeploy = Object.entries(selectedTasks).map(
      ([key, taskData]) => ({
        id: `healthcare-${key}-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assignedTo || [],
        priority: taskData.priority,
        category: taskData.category,
        status: 'pending' as const,
        timeline: taskData.timeline,
        deliverables: taskData.deliverables || [],
        revenueTarget: taskData.revenueTarget,
        createdAt: new Date(),
        dueDate: new Date(
          Date.now() +
            parseInt(taskData.timeline.replace(' days', '')) *
              24 *
              60 *
              60 *
              1000
        ),
      })
    );

    console.info('🚀 DEPLOYING ALL HEALTHCARE TASKS:', tasksToDeploy);
    onBatchDeploy(tasksToDeploy);
    onClose();
  };

  const selectedTaskCount = Object.keys(selectedTasks).length;
  const totalStaffAssigned = new Set(
    Object.values(selectedTasks).flatMap((task: any) => task.assignedTo || [])
  ).size;
  const totalRevenue = Object.values(selectedTasks).reduce(
    (sum, task: any) =>
      sum +
      (task.revenueTarget
        ? parseInt(task.revenueTarget.replace(/[^0-9]/g, ''))
        : 0),
    0
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '95%',
          maxWidth: '1200px',
          maxHeight: '95vh',
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 30px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: 0,
              }}
            >
              🏥 Healthcare Logistics Deployment Center
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '4px 0 0 0',
                fontSize: '0.9rem',
              }}
            >
              Select, Configure & Deploy Healthcare Tasks to DEPOINTE AI Team
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress Steps */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          {[
            { key: 'select', label: '1. Select Tasks', icon: '📋' },
            { key: 'configure', label: '2. Configure Teams', icon: '👥' },
            { key: 'deploy', label: '3. Deploy Live', icon: '🚀' },
          ].map((step, index) => (
            <div
              key={step.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background:
                  deploymentStep === step.key
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                color:
                  deploymentStep === step.key
                    ? '#22c55e'
                    : 'rgba(255, 255, 255, 0.6)',
                fontWeight: deploymentStep === step.key ? '700' : '500',
                fontSize: '0.9rem',
                marginRight: index < 2 ? '20px' : '0',
              }}
            >
              <span style={{ fontSize: '16px' }}>{step.icon}</span>
              {step.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '30px' }}>
          {deploymentStep === 'select' && (
            <>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                📋 Select Healthcare Tasks for Deployment
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '16px',
                  marginBottom: '30px',
                }}
              >
                {Object.entries(HEALTHCARE_TEMPLATES).map(([key, template]) => {
                  const isSelected = !!selectedTasks[key];
                  return (
                    <div
                      key={key}
                      onClick={() => toggleTaskSelection(key)}
                      style={{
                        background: isSelected
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected
                          ? '2px solid rgba(34, 197, 94, 0.4)'
                          : '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#22c55e',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '700',
                          }}
                        >
                          ✓
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '10px',
                        }}
                      >
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            margin: 0,
                            paddingRight: '30px',
                          }}
                        >
                          {template.title}
                        </h4>
                        <div
                          style={{
                            background:
                              template.priority === 'CRITICAL'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)',
                            color:
                              template.priority === 'CRITICAL'
                                ? '#ef4444'
                                : '#f59e0b',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {template.priority}
                        </div>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '12px',
                          lineHeight: '1.4',
                        }}
                      >
                        {template.description}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                        }}
                      >
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          📅 {template.timeline}
                        </span>
                        {template.revenueTarget && (
                          <span style={{ color: '#22c55e', fontWeight: '600' }}>
                            💰 {template.revenueTarget}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selection Summary */}
              {selectedTaskCount > 0 && (
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <h4
                    style={{
                      color: '#22c55e',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: '0 0 10px 0',
                    }}
                  >
                    ✅ {selectedTaskCount} Task
                    {selectedTaskCount > 1 ? 's' : ''} Selected for Deployment
                  </h4>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {Object.keys(selectedTasks)
                      .map((key) => HEALTHCARE_TEMPLATES[key].title)
                      .join(', ')}
                  </div>
                </div>
              )}
            </>
          )}

          {deploymentStep === 'configure' && (
            <>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                👥 Configure Team Assignments
              </h3>
              {Object.entries(selectedTasks).map(([templateKey, taskData]) => (
                <div
                  key={templateKey}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '15px',
                    }}
                  >
                    {taskData.title}
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px',
                    }}
                  >
                    {Object.entries(HEALTHCARE_STAFF_MAPPING).map(
                      ([staffId, staff]) => {
                        const isAssigned =
                          taskData.assignedTo?.includes(staffId);
                        return (
                          <div
                            key={staffId}
                            onClick={() =>
                              toggleStaffAssignment(templateKey, staffId)
                            }
                            style={{
                              background: isAssigned
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(255, 255, 255, 0.05)',
                              border: isAssigned
                                ? '1px solid rgba(34, 197, 94, 0.3)'
                                : '1px solid rgba(148, 163, 184, 0.1)',
                              borderRadius: '8px',
                              padding: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>
                              {staff.avatar}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  color: 'white',
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                }}
                              >
                                {staff.name}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {staff.role}
                              </div>
                            </div>
                            {isAssigned && (
                              <div
                                style={{
                                  color: '#22c55e',
                                  fontSize: '14px',
                                  fontWeight: '700',
                                }}
                              >
                                ✓
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {deploymentStep === 'deploy' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '72px', marginBottom: '20px' }}>🚀</div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '700',
                    margin: '0 0 10px 0',
                  }}
                >
                  Ready for Healthcare Logistics Deployment!
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1rem',
                  }}
                >
                  All systems configured and ready to go live
                </p>
              </div>

              {/* Deployment Summary */}
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
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '2rem',
                      fontWeight: '700',
                    }}
                  >
                    {selectedTaskCount}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Tasks Ready
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '2rem',
                      fontWeight: '700',
                    }}
                  >
                    {totalStaffAssigned}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    AI Staff Deployed
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '2rem',
                      fontWeight: '700',
                    }}
                  >
                    ${(totalRevenue / 1000).toFixed(0)}K+
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Revenue Target
                  </div>
                </div>
              </div>

              {/* Task List Preview */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '15px',
                  }}
                >
                  📋 Deployment Queue
                </h4>
                {Object.entries(selectedTasks).map(([key, taskData], index) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '10px',
                      padding: '10px 0',
                    }}
                  >
                    <div
                      style={{
                        color: '#22c55e',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                        }}
                      >
                        {taskData.title}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Assigned to:{' '}
                        {taskData.assignedTo
                          ?.map((id) => HEALTHCARE_STAFF_MAPPING[id]?.name)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: '20px 30px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '15px' }}>
            {deploymentStep !== 'select' && (
              <button
                onClick={() =>
                  setDeploymentStep(
                    deploymentStep === 'configure' ? 'select' : 'configure'
                  )
                }
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            {deploymentStep === 'select' && selectedTaskCount > 0 && (
              <button
                onClick={() => setDeploymentStep('configure')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
              >
                Configure Teams →
              </button>
            )}
            {deploymentStep === 'configure' && (
              <button
                onClick={() => setDeploymentStep('deploy')}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                }}
              >
                Review Deployment →
              </button>
            )}
            {deploymentStep === 'deploy' && (
              <button
                onClick={handleGoLive}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '20px' }}>🚀</span>
                GO LIVE - DEPLOY ALL
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
