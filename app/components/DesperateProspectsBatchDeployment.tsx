'use client';

import { useState } from 'react';

export interface DesperateProspectsTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category:
    | 'desperate-manufacturers'
    | 'desperate-shippers'
    | 'crisis-intervention'
    | 'emergency-solutions'
    | 'rapid-onboarding'
    | 'urgent-marketing';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  timeline: string;
  deliverables: string[];
  revenueTarget?: string;
  createdAt: Date;
  dueDate?: Date;
}

interface DesperateProspectsBatchDeploymentProps {
  onBatchDeploy: (tasks: DesperateProspectsTask[]) => void;
  onClose: () => void;
}

const DESPERATE_PROSPECTS_STAFF_MAPPING = {
  'desiree-001': {
    name: 'Desiree',
    role: 'Desperate Prospects Specialist',
    avatar: '🎯',
    department: 'Business Development',
  },
  'cliff-002': {
    name: 'Cliff',
    role: 'Desperate Prospects Hunter',
    avatar: '⛰️',
    department: 'Business Development',
  },
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
  'shanell-013': {
    name: 'Shanell',
    role: 'Customer Service',
    avatar: '🎧',
    department: 'Support & Service',
  },
  'drew-017': {
    name: 'Drew',
    role: 'Marketing Specialist',
    avatar: '🎨',
    department: 'Business Development',
  },
};

const DESPERATE_PROSPECTS_TEMPLATES = [
  {
    id: 'desperate-manufacturers',
    title: 'Desperate Manufacturers Rescue Campaign',
    description:
      'Target manufacturing companies in crisis - supply chain failures, capacity overload, urgent shipping needs',
    priority: 'CRITICAL' as const,
    category: 'desperate-manufacturers' as const,
    timeline: '14 days',
    revenueTarget: '$300K+',
    staffAssignments: {
      'desiree-001': [
        'Manufacturing crisis identification',
        'Urgent need qualification',
        'Rapid solution positioning',
        'Emergency contract negotiations',
      ],
      'cliff-002': [
        'Desperate manufacturer hunting',
        'Crisis situation research',
        'Pain point amplification',
        'Competition displacement',
      ],
      'will-004': [
        'Emergency pricing strategies',
        'Crisis contract execution',
        'Rapid onboarding coordination',
      ],
      'brook-009': [
        'Emergency capacity allocation',
        'Priority shipping setup',
        'Crisis logistics management',
      ],
    },
    deliverables: [
      'Crisis manufacturers database (200+ companies)',
      'Emergency response protocols established',
      'Rapid onboarding process (24-hour activation)',
      'Priority capacity allocation system',
      'Crisis-focused pricing models',
    ],
  },
  {
    id: 'desperate-shippers',
    title: 'Desperate Shippers Emergency Response',
    description:
      'Target shippers in desperate situations - carrier failures, capacity shortages, urgent deadlines',
    priority: 'CRITICAL' as const,
    category: 'desperate-shippers' as const,
    timeline: '10 days',
    revenueTarget: '$250K+',
    staffAssignments: {
      'desiree-001': [
        'Shipper crisis assessment',
        'Urgent capacity needs analysis',
        'Emergency solution development',
        'Rapid contract processing',
      ],
      'cliff-002': [
        'Desperate shipper identification',
        'Crisis opportunity mining',
        'Competitor failure exploitation',
        'Emergency lead generation',
      ],
      'will-004': [
        'Emergency rate negotiations',
        'Crisis-premium pricing',
        'Fast-track contract signing',
      ],
      'shanell-013': [
        'Crisis customer support',
        '24/7 emergency response',
        'Urgent issue resolution',
      ],
    },
    deliverables: [
      'Emergency shipper response system',
      'Crisis opportunity pipeline (150+ prospects)',
      '24-hour response guarantee protocols',
      'Premium emergency pricing structure',
      'Rapid deployment capabilities',
    ],
  },
  {
    id: 'crisis-intervention',
    title: 'Supply Chain Crisis Intervention',
    description:
      'Immediate response to supply chain disasters - natural disasters, port closures, carrier bankruptcies',
    priority: 'CRITICAL' as const,
    category: 'crisis-intervention' as const,
    timeline: '7 days',
    revenueTarget: '$400K+',
    staffAssignments: {
      'desiree-001': [
        'Crisis situation mapping',
        'Affected companies identification',
        'Emergency solution packaging',
        'Crisis communication management',
      ],
      'cliff-002': [
        'Disaster opportunity hunting',
        'Crisis market intelligence',
        'Competitive advantage exploitation',
        'Emergency lead qualification',
      ],
      'will-004': [
        'Crisis premium pricing',
        'Emergency contract structures',
        'Disaster response negotiations',
      ],
      'brook-009': [
        'Emergency capacity coordination',
        'Crisis logistics planning',
        'Disaster recovery operations',
      ],
      'drew-017': [
        'Crisis response marketing',
        'Emergency capability messaging',
        'Disaster relief positioning',
      ],
    },
    deliverables: [
      'Crisis response command center',
      'Emergency capacity network activation',
      'Disaster recovery service packages',
      'Crisis communication protocols',
      'Premium emergency pricing models',
    ],
  },
  {
    id: 'rapid-onboarding',
    title: 'Desperate Client Rapid Onboarding',
    description:
      'Ultra-fast onboarding system for desperate prospects who need immediate solutions',
    priority: 'HIGH' as const,
    category: 'rapid-onboarding' as const,
    timeline: '5 days',
    revenueTarget: '$150K+',
    staffAssignments: {
      'desiree-001': [
        'Urgent onboarding coordination',
        'Fast-track documentation',
        'Emergency compliance processing',
      ],
      'brook-009': [
        'Rapid system integration',
        'Emergency portal setup',
        'Priority access configuration',
      ],
      'shanell-013': [
        'Emergency support setup',
        'Urgent training delivery',
        'Crisis customer success',
      ],
    },
    deliverables: [
      'Same-day onboarding capability',
      'Emergency documentation processing',
      'Priority system access protocols',
      'Urgent training programs',
    ],
  },
  {
    id: 'urgent-marketing',
    title: 'Crisis-Focused Marketing Blitz',
    description:
      'Targeted marketing campaign focusing on companies in crisis situations who need immediate help',
    priority: 'HIGH' as const,
    category: 'urgent-marketing' as const,
    timeline: '21 days',
    revenueTarget: '$200K+',
    staffAssignments: {
      'drew-017': [
        'Crisis-focused messaging',
        'Emergency solution marketing',
        'Desperate prospect targeting',
        'Crisis response advertising',
      ],
      'gary-003': [
        'Crisis lead generation',
        'Emergency prospect research',
        'Desperate company identification',
        'Crisis database building',
      ],
      'desiree-001': [
        'Crisis prospect qualification',
        'Emergency need validation',
        'Urgent solution positioning',
      ],
    },
    deliverables: [
      'Crisis-focused marketing campaign',
      'Emergency response advertising',
      'Desperate prospects database',
      'Crisis messaging frameworks',
      'Emergency lead generation system',
    ],
  },
];

export default function DesperateProspectsBatchDeployment({
  onBatchDeploy,
  onClose,
}: DesperateProspectsBatchDeploymentProps) {
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
    const deployTasks: DesperateProspectsTask[] = selectedTasks.map(
      (taskId) => {
        const template = DESPERATE_PROSPECTS_TEMPLATES.find(
          (t) => t.id === taskId
        );
        if (!template) throw new Error(`Template not found: ${taskId}`);

        return {
          id: `desperate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        };
      }
    );

    console.info('🚨 DESPERATE PROSPECTS DEPLOYMENT:', deployTasks);
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
          border: '1px solid rgba(239, 68, 68, 0.3)',
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
              🚨 Desperate Manufacturers & Shippers Campaign
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem',
                margin: '8px 0 0 0',
              }}
            >
              Target companies in crisis for rapid high-value conversions
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
                      ? '#ef4444'
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
                      ? '#ef4444'
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
                        ? '#ef4444'
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
              🚨 Select Crisis Response Campaigns
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
              }}
            >
              {DESPERATE_PROSPECTS_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => toggleTaskSelection(template.id)}
                  style={{
                    background: selectedTasks.includes(template.id)
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(15, 23, 42, 0.8)',
                    border: selectedTasks.includes(template.id)
                      ? '2px solid #ef4444'
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
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
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
                        color: '#ef4444',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      ⚡ {template.timeline} • {template.revenueTarget}
                    </span>
                    {selectedTasks.includes(template.id) && (
                      <span
                        style={{
                          color: '#ef4444',
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
                      ? '#ef4444'
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
                🚨 Configure Crisis Teams ({selectedTasks.length})
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
              👥 Assign Crisis Response Team
            </h3>
            {selectedTasks.map((taskId) => {
              const template = DESPERATE_PROSPECTS_TEMPLATES.find(
                (t) => t.id === taskId
              );
              if (!template) return null;

              return (
                <div
                  key={taskId}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
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
                    {Object.entries(DESPERATE_PROSPECTS_STAFF_MAPPING).map(
                      ([staffId, staff]) => (
                        <div
                          key={staffId}
                          onClick={() => toggleStaffAssignment(taskId, staffId)}
                          style={{
                            background: (
                              taskAssignments[taskId] || []
                            ).includes(staffId)
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: (taskAssignments[taskId] || []).includes(
                              staffId
                            )
                              ? '2px solid #ef4444'
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
                                color: '#ef4444',
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
                  background: '#ef4444',
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
              🚨 Ready to Launch Crisis Response Campaign
            </h3>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ color: 'white', marginBottom: '15px' }}>
                ⚡ Emergency Deployment Summary
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <p>
                  • <strong>{selectedTasks.length}</strong> crisis response
                  campaigns selected
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
                  crisis response team members
                </p>
                <p>
                  • Estimated revenue potential: <strong>$1,300K+</strong>
                </p>
                <p>
                  • <strong>Desiree & Cliff</strong> leading desperate prospects
                  targeting
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
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 40px',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🚨 ACTIVATE CRISIS RESPONSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
