'use client';

import { useState } from 'react';

export interface ShipperTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category:
    | 'direct-sales'
    | 'enterprise'
    | 'research'
    | 'compliance'
    | 'portal-integration'
    | 'marketing';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  timeline: string;
  deliverables: string[];
  revenueTarget?: string;
  createdAt: Date;
  dueDate?: Date;
}

interface ShipperBatchDeploymentProps {
  onBatchDeploy: (tasks: ShipperTask[]) => void;
  onClose: () => void;
}

const SHIPPER_STAFF_MAPPING = {
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
  'clarence-012': {
    name: 'Clarence',
    role: 'Claims & Insurance',
    avatar: '🛡️',
    department: 'Support & Service',
  },
  'drew-017': {
    name: 'Drew',
    role: 'Marketing Specialist',
    avatar: '🎨',
    department: 'Business Development',
  },
  'ana-018': {
    name: 'Ana Lytics',
    role: 'Data Analysis',
    avatar: '📊',
    department: 'Operations',
  },
  'shanell-013': {
    name: 'Shanell',
    role: 'Customer Service',
    avatar: '🎧',
    department: 'Support & Service',
  },
};

const SHIPPER_TEMPLATES = [
  {
    id: 'shipper-direct-outreach',
    title: 'Direct Shipper Outreach Campaign',
    description:
      'Target manufacturing and retail companies for direct shipping partnerships',
    priority: 'CRITICAL' as const,
    category: 'direct-sales' as const,
    timeline: '45 days',
    revenueTarget: '$200K+',
    staffAssignments: {
      'will-004': [
        'Partnership negotiations',
        'Contract closing',
        'Rate discussions',
      ],
      'gary-003': [
        'Manufacturing prospect research',
        'Retail chain contacts',
        'Decision maker identification',
      ],
      'shanell-013': [
        'Follow-up coordination',
        'Customer onboarding',
        'Service quality assurance',
      ],
      'drew-017': [
        'Shipper-focused collateral',
        'Case studies',
        'ROI presentations',
      ],
    },
    deliverables: [
      'Target prospect database (500+ shippers)',
      'Direct partnership applications (50+ companies)',
      'Contract negotiations in progress (15+ shippers)',
      'Onboarding portal for new shippers',
    ],
  },
  {
    id: 'shipper-enterprise-sales',
    title: 'Enterprise Shipper Acquisition',
    description:
      'Focus on Fortune 1000 companies with high-volume shipping needs',
    priority: 'HIGH' as const,
    category: 'enterprise' as const,
    timeline: '60 days',
    revenueTarget: '$500K+',
    staffAssignments: {
      'will-004': [
        'C-suite presentations',
        'Enterprise contract negotiations',
        'RFP responses',
      ],
      'gary-003': [
        'Enterprise prospect research',
        'Stakeholder mapping',
        'Competitive analysis',
      ],
      'ana-018': [
        'Volume analysis',
        'Cost savings projections',
        'ROI calculations',
      ],
      'drew-017': [
        'Executive presentation decks',
        'Enterprise case studies',
        'Proposal design',
      ],
    },
    deliverables: [
      'Enterprise prospect pipeline (100+ Fortune 1000)',
      'C-suite meetings scheduled (25+ executives)',
      'RFP submissions (10+ major enterprises)',
      'Enterprise pricing models developed',
    ],
  },
  {
    id: 'shipper-portal-integration',
    title: 'Shipper Portal Development',
    description:
      'Build integrated portal for seamless shipper onboarding and management',
    priority: 'HIGH' as const,
    category: 'portal-integration' as const,
    timeline: '30 days',
    revenueTarget: '$150K+',
    staffAssignments: {
      'brook-009': [
        'Portal API development',
        'Integration testing',
        'Data flow optimization',
      ],
      'clarence-012': [
        'Insurance integration',
        'Claims portal setup',
        'Risk management',
      ],
      'shanell-013': [
        'User experience testing',
        'Customer training materials',
        'Support documentation',
      ],
      'ana-018': [
        'Performance analytics',
        'Usage tracking',
        'Optimization insights',
      ],
    },
    deliverables: [
      'Self-service shipper onboarding portal',
      'Real-time shipment tracking integration',
      'Automated documentation system',
      'Performance analytics dashboard',
    ],
  },
  {
    id: 'shipper-market-research',
    title: 'Shipper Market Intelligence',
    description:
      'Comprehensive analysis of shipper market opportunities and pricing strategies',
    priority: 'MEDIUM' as const,
    category: 'research' as const,
    timeline: '21 days',
    revenueTarget: '$75K+',
    staffAssignments: {
      'gary-003': [
        'Market sizing analysis',
        'Competitive landscape',
        'Opportunity identification',
      ],
      'ana-018': ['Data analysis', 'Pricing optimization', 'Market trends'],
      'drew-017': [
        'Market research reports',
        'Competitive positioning',
        'Strategy presentations',
      ],
    },
    deliverables: [
      'Comprehensive shipper market analysis',
      'Competitive pricing strategy',
      'Target market segmentation',
      'Go-to-market strategy recommendations',
    ],
  },
  {
    id: 'shipper-marketing-campaign',
    title: 'Shipper Acquisition Marketing',
    description:
      'Multi-channel marketing campaign targeting potential shippers',
    priority: 'MEDIUM' as const,
    category: 'marketing' as const,
    timeline: '35 days',
    revenueTarget: '$100K+',
    staffAssignments: {
      'drew-017': [
        'Campaign design',
        'Content creation',
        'Digital marketing',
        'Brand positioning',
      ],
      'gary-003': [
        'Lead generation',
        'Content distribution',
        'Social media outreach',
      ],
      'shanell-013': [
        'Lead qualification',
        'Follow-up campaigns',
        'Conversion tracking',
      ],
    },
    deliverables: [
      'Multi-channel marketing campaign',
      'Lead generation system',
      'Content marketing materials',
      'Performance tracking dashboard',
    ],
  },
];

export default function ShipperBatchDeployment({
  onBatchDeploy,
  onClose,
}: ShipperBatchDeploymentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskAssignments, setTaskAssignments] = useState<{
    [taskId: string]: string[];
  }>({});

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleStaffAssignment = (taskId: string, staffId: string) => {
    setTaskAssignments((prev) => ({
      ...prev,
      [taskId]: prev[taskId]
        ? prev[taskId].includes(staffId)
          ? prev[taskId].filter((id) => id !== staffId)
          : [...prev[taskId], staffId]
        : [staffId],
    }));
  };

  const handleGoLive = () => {
    const deployTasks: ShipperTask[] = selectedTasks.map((taskId) => {
      const template = SHIPPER_TEMPLATES.find((t) => t.id === taskId);
      if (!template) throw new Error(`Template not found: ${taskId}`);

      return {
        id: `shipper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: template.title,
        description: template.description,
        assignedTo: taskAssignments[taskId] || [],
        priority: template.priority,
        category: template.category,
        status: 'pending' as const,
        timeline: template.timeline,
        deliverables: template.deliverables,
        revenueTarget: template.revenueTarget,
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      };
    });

    console.log('🚀 SHIPPER EXPANSION DEPLOYMENT:', deployTasks);
    onBatchDeploy(deployTasks);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '2rem',
                fontWeight: '700',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              🚛 Shipper Expansion Campaign
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem',
                margin: '8px 0 0 0',
              }}
            >
              Deploy AI-powered shipper acquisition campaigns
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background:
                    step <= currentStep
                      ? '#3b82f6'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                }}
              >
                {step}
              </div>
              <span
                style={{
                  color:
                    step <= currentStep
                      ? '#3b82f6'
                      : 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '600',
                }}
              >
                {step === 1 ? 'Select' : step === 2 ? 'Configure' : 'Deploy'}
              </span>
              {step < 3 && (
                <div
                  style={{
                    width: '60px',
                    height: '2px',
                    background:
                      step < currentStep
                        ? '#3b82f6'
                        : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Tasks */}
        {currentStep === 1 && (
          <div>
            <h3
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              📋 Select Shipper Campaigns
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
              }}
            >
              {SHIPPER_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => toggleTaskSelection(template.id)}
                  style={{
                    background: selectedTasks.includes(template.id)
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(15, 23, 42, 0.8)',
                    border: selectedTasks.includes(template.id)
                      ? '2px solid #3b82f6'
                      : '1px solid rgba(148, 163, 184, 0.2)',
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
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        margin: '0 0 10px 0',
                      }}
                    >
                      {template.title}
                    </h4>
                    <span
                      style={{
                        background:
                          template.priority === 'CRITICAL'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : template.priority === 'HIGH'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(34, 197, 94, 0.2)',
                        color:
                          template.priority === 'CRITICAL'
                            ? '#ef4444'
                            : template.priority === 'HIGH'
                              ? '#f59e0b'
                              : '#22c55e',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      {template.priority}
                    </span>
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      margin: '0 0 15px 0',
                    }}
                  >
                    {template.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: '#3b82f6',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      {template.timeline} • {template.revenueTarget}
                    </span>
                    {selectedTasks.includes(template.id) && (
                      <span
                        style={{
                          color: '#3b82f6',
                          fontSize: '1.5rem',
                        }}
                      >
                        ✅
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={selectedTasks.length === 0}
                style={{
                  background:
                    selectedTasks.length > 0
                      ? '#3b82f6'
                      : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: selectedTasks.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: selectedTasks.length > 0 ? 1 : 0.5,
                }}
              >
                Configure Teams ({selectedTasks.length})
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Configure Staff Assignments */}
        {currentStep === 2 && (
          <div>
            <h3
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              👥 Assign DEPOINTE AI Staff
            </h3>
            {selectedTasks.map((taskId) => {
              const template = SHIPPER_TEMPLATES.find((t) => t.id === taskId);
              if (!template) return null;

              return (
                <div
                  key={taskId}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '15px',
                    }}
                  >
                    {template.title}
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '15px',
                    }}
                  >
                    {Object.entries(SHIPPER_STAFF_MAPPING).map(
                      ([staffId, staff]) => (
                        <div
                          key={staffId}
                          onClick={() => toggleStaffAssignment(taskId, staffId)}
                          style={{
                            background: (
                              taskAssignments[taskId] || []
                            ).includes(staffId)
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: (taskAssignments[taskId] || []).includes(
                              staffId
                            )
                              ? '2px solid #3b82f6'
                              : '1px solid rgba(148, 163, 184, 0.2)',
                            borderRadius: '10px',
                            padding: '15px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '8px',
                            }}
                          >
                            <span style={{ fontSize: '24px' }}>
                              {staff.avatar}
                            </span>
                            <div>
                              <div
                                style={{
                                  color: 'white',
                                  fontSize: '1rem',
                                  fontWeight: '700',
                                }}
                              >
                                {staff.name}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {staff.role}
                              </div>
                            </div>
                          </div>
                          {template.staffAssignments[staffId] && (
                            <div style={{ marginTop: '10px' }}>
                              {template.staffAssignments[staffId].map(
                                (task, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.85rem',
                                      padding: '2px 0',
                                    }}
                                  >
                                    • {task}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                          {(taskAssignments[taskId] || []).includes(
                            staffId
                          ) && (
                            <div
                              style={{
                                color: '#3b82f6',
                                fontSize: '1.2rem',
                                textAlign: 'right',
                                marginTop: '10px',
                              }}
                            >
                              ✅
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
            <div
              style={{
                marginTop: '30px',
                textAlign: 'center',
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: 'rgba(148, 163, 184, 0.2)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Review & Deploy
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Deploy */}
        {currentStep === 3 && (
          <div>
            <h3
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              🚀 Ready to Launch Shipper Campaigns
            </h3>
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ color: 'white', marginBottom: '15px' }}>
                📊 Deployment Summary
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <p>
                  • <strong>{selectedTasks.length}</strong> shipper campaigns
                  selected
                </p>
                <p>
                  •{' '}
                  <strong>
                    {Object.values(taskAssignments).flat().length}
                  </strong>{' '}
                  total staff assignments
                </p>
                <p>
                  •{' '}
                  <strong>
                    {[...new Set(Object.values(taskAssignments).flat())].length}
                  </strong>{' '}
                  unique AI staff members involved
                </p>
                <p>
                  • Estimated revenue potential: <strong>$1,025K+</strong>
                </p>
              </div>
            </div>
            <div
              style={{
                marginTop: '30px',
                textAlign: 'center',
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  background: 'rgba(148, 163, 184, 0.2)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleGoLive}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 40px',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🚀 GO LIVE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
