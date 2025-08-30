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

interface HealthcareTaskAssignmentProps {
  onTaskAssign: (task: HealthcareTask) => void;
  onClose: () => void;
}

const HEALTHCARE_STAFF_MAPPING = {
  'will-004': {
    name: 'Will',
    role: 'Sales Operations Specialist',
    department: 'Freight Operations',
    avatar: '💼',
    specialties: [
      'partnership_applications',
      'healthcare_sales',
      'contract_negotiation',
      'revenue_generation',
    ],
  },
  'gary-003': {
    name: 'Gary',
    role: 'Lead Generation Specialist',
    department: 'Business Development',
    avatar: '📈',
    specialties: [
      'prospect_research',
      'lead_generation',
      'database_building',
      'market_research',
    ],
  },
  'brook-009': {
    name: 'Brook R.',
    role: 'Brokerage Operations Specialist',
    department: 'Relationships',
    avatar: '🌊',
    specialties: [
      'api_integration',
      'operations_management',
      'pipeline_tracking',
      'technical_coordination',
    ],
  },
  'kameelah-014': {
    name: 'Kameelah',
    role: 'DOT Compliance Specialist',
    department: 'Compliance & Safety',
    avatar: '⚖️',
    specialties: [
      'healthcare_compliance',
      'hipaa_validation',
      'certification_management',
      'regulatory_monitoring',
    ],
  },
  'regina-015': {
    name: 'Regina',
    role: 'FMCSA Regulations Specialist',
    department: 'Compliance & Safety',
    avatar: '📋',
    specialties: [
      'fda_compliance',
      'regulatory_monitoring',
      'compliance_documentation',
      'certification_support',
    ],
  },
  'drew-017': {
    name: 'Drew',
    role: 'Marketing Specialist',
    department: 'Business Development',
    avatar: '📢',
    specialties: [
      'healthcare_marketing',
      'digital_presence',
      'content_creation',
      'lead_nurturing',
    ],
  },
};

const HEALTHCARE_TASK_TEMPLATES = {
  healthcare_partnerships: {
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
      'McKesson Connect pharmaceutical network application submitted',
      'LabCorp logistics network application submitted',
      'Partnership agreements negotiated and signed',
      'API credentials obtained for each platform',
    ],
    revenueTarget: '$500,000+',
  },
  hospital_research: {
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
      'TruckingPlanet shipper database cross-referenced for healthcare clients',
    ],
    revenueTarget: '$250,000+',
  },
  healthcare_compliance: {
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
  api_integration: {
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
  healthcare_marketing: {
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

export default function HealthcareTaskAssignment({
  onTaskAssign,
  onClose,
}: HealthcareTaskAssignmentProps) {
  const [selectedTasks, setSelectedTasks] = useState<{
    [key: string]: Partial<HealthcareTask>;
  }>({});
  const [deploymentStep, setDeploymentStep] = useState<
    'select' | 'configure' | 'deploy'
  >('select');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleTemplateSelect = (templateKey: string) => {
    const template = HEALTHCARE_TASK_TEMPLATES[templateKey];
    if (!template) {
      console.log('❌ Template not found:', templateKey);
      return;
    }

    console.log('📋 Template selected:', templateKey, template);
    setSelectedTemplate(templateKey);

    const taskData = {
      title: template.title,
      description: template.description,
      assignedTo: template.suggestedStaff || [],
      priority: template.priority,
      category: template.category,
      timeline: template.timeline,
      deliverables: template.deliverables,
      revenueTarget: template.revenueTarget,
    };

    console.log('📝 Setting task data:', taskData);
    setCustomTask(taskData);
  };

  const handleStaffToggle = (staffId: string) => {
    console.log('👤 Staff toggle clicked:', staffId);
    setCustomTask((prev) => {
      const newAssignedTo = prev.assignedTo?.includes(staffId)
        ? prev.assignedTo.filter((id) => id !== staffId)
        : [...(prev.assignedTo || []), staffId];

      console.log('👥 Updated assigned staff:', newAssignedTo);

      return {
        ...prev,
        assignedTo: newAssignedTo,
      };
    });
  };

  const handleSubmit = () => {
    console.log('🚀 Submit clicked - customTask:', customTask);
    console.log(
      '📋 Validation - Title:',
      customTask.title,
      'AssignedTo:',
      customTask.assignedTo
    );

    if (!customTask.title || !customTask.assignedTo?.length) {
      console.log('❌ Validation failed - missing title or staff assignment');
      alert(
        'Please ensure the task has a title and at least one staff member assigned.'
      );
      return;
    }

    const task: HealthcareTask = {
      id: `healthcare-${Date.now()}`,
      title: customTask.title!,
      description: customTask.description || '',
      assignedTo: customTask.assignedTo!,
      priority: customTask.priority!,
      category: customTask.category!,
      status: 'pending',
      timeline: customTask.timeline!,
      deliverables: customTask.deliverables || [],
      revenueTarget: customTask.revenueTarget,
      createdAt: new Date(),
      dueDate: customTask.timeline
        ? new Date(
            Date.now() +
              parseInt(customTask.timeline.replace(' days', '')) *
                24 *
                60 *
                60 *
                1000
          )
        : undefined,
    };

    console.log('✅ Task created:', task);
    onTaskAssign(task);
    onClose();
  };

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
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
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
              🏥 Assign Healthcare Logistics Tasks
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '4px 0 0 0',
                fontSize: '0.9rem',
              }}
            >
              Deploy DEPOINTE AI team on healthcare opportunities
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

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '30px' }}>
          {!isCustomMode ? (
            <>
              {/* Template Selection */}
              <div style={{ marginBottom: '30px' }}>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '15px',
                  }}
                >
                  📋 Healthcare Task Templates
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '15px',
                  }}
                >
                  {Object.entries(HEALTHCARE_TASK_TEMPLATES).map(
                    ([key, template]) => (
                      <div
                        key={key}
                        onClick={() => handleTemplateSelect(key)}
                        style={{
                          background:
                            selectedTemplate === key
                              ? 'rgba(34, 197, 94, 0.1)'
                              : 'rgba(255, 255, 255, 0.05)',
                          border:
                            selectedTemplate === key
                              ? '1px solid rgba(34, 197, 94, 0.3)'
                              : '1px solid rgba(148, 163, 184, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px',
                          }}
                        >
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              margin: 0,
                            }}
                          >
                            {template.title}
                          </h4>
                          <div
                            style={{
                              background:
                                template.priority === 'CRITICAL'
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : template.priority === 'HIGH'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : 'rgba(59, 130, 246, 0.2)',
                              color:
                                template.priority === 'CRITICAL'
                                  ? '#ef4444'
                                  : template.priority === 'HIGH'
                                    ? '#f59e0b'
                                    : '#3b82f6',
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
                            marginBottom: '8px',
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
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          <span>📅 {template.timeline}</span>
                          {template.revenueTarget && (
                            <span
                              style={{ color: '#22c55e', fontWeight: '600' }}
                            >
                              💰 {template.revenueTarget}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <button
                  onClick={() => setIsCustomMode(true)}
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    color: '#8b5cf6',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ✏️ Create Custom Task
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Custom Task Creation */}
              <div style={{ marginBottom: '30px' }}>
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
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      margin: 0,
                    }}
                  >
                    ✏️ Custom Healthcare Task
                  </h3>
                  <button
                    onClick={() => setIsCustomMode(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      color: 'white',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    ← Back to Templates
                  </button>
                </div>

                {/* Custom Task Form */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Task Title
                    </label>
                    <input
                      type='text'
                      value={customTask.title}
                      onChange={(e) =>
                        setCustomTask((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder='Enter healthcare task title...'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      value={customTask.description}
                      onChange={(e) =>
                        setCustomTask((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                      placeholder='Describe the healthcare logistics task...'
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Staff Assignment (shown for both modes when task is selected) */}
          {(selectedTemplate || isCustomMode) && (
            <div style={{ marginBottom: '30px' }}>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '15px',
                }}
              >
                👥 Assign DEPOINTE AI Staff
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '12px',
                }}
              >
                {Object.entries(HEALTHCARE_STAFF_MAPPING).map(
                  ([staffId, staff]) => {
                    const isAssigned = customTask.assignedTo?.includes(staffId);
                    return (
                      <div
                        key={staffId}
                        onClick={() => handleStaffToggle(staffId)}
                        style={{
                          background: isAssigned
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isAssigned
                            ? '1px solid rgba(34, 197, 94, 0.3)'
                            : '1px solid rgba(148, 163, 184, 0.1)',
                          borderRadius: '10px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            background: isAssigned
                              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                              : 'linear-gradient(135deg, #64748b, #475569)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                          }}
                        >
                          {staff.avatar}
                        </div>
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
                              fontSize: '16px',
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
          )}

          {/* Action Buttons */}
          {(selectedTemplate || isCustomMode) && (
            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                paddingTop: '20px',
                borderTop: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!customTask.title || !customTask.assignedTo?.length}
                style={{
                  background:
                    !customTask.title || !customTask.assignedTo?.length
                      ? 'rgba(139, 92, 246, 0.5)'
                      : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor:
                    !customTask.title || !customTask.assignedTo?.length
                      ? 'not-allowed'
                      : 'pointer',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                }}
              >
                🚀 Assign Healthcare Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
