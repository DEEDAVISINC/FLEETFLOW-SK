'use client';

import { useState } from 'react';
import TaskCreationInterface from '../components/TaskCreationInterface';

// Mobile optimization styles - matching billing-invoices page
const mobileStyles = `
  @media (max-width: 768px) {
    .financial-grid {
      grid-template-columns: 1fr !important;
    }
    .financial-card {
      margin: 10px 0 !important;
    }
  }
`;

// DEPOINTE AI Staff with Human Names (all 18 members)
const depointeStaff = [
  {
    id: 'desiree-001',
    name: 'Desiree',
    role: 'Desperate Prospects Specialist',
    department: 'Business Development',
    avatar: '🎯',
    status: 'busy',
    currentTask:
      'Analyzing 47 companies with safety violations - found 12 desperate shippers',
    tasksCompleted: 156,
    revenue: 24500,
    efficiency: 94.2,
  },
  {
    id: 'cliff-002',
    name: 'Cliff',
    role: 'Desperate Prospects Hunter',
    department: 'Business Development',
    avatar: '⛰️',
    status: 'active',
    currentTask:
      'Processing edge-case prospects - 23 urgent carriers identified',
    tasksCompleted: 89,
    revenue: 34200,
    efficiency: 98.7,
  },
  {
    id: 'gary-003',
    name: 'Gary',
    role: 'Lead Generation Specialist',
    department: 'Business Development',
    avatar: '📈',
    status: 'active',
    currentTask:
      'Generating 234 new leads - qualification pipeline flowing smoothly',
    tasksCompleted: 178,
    revenue: 28900,
    efficiency: 91.5,
  },
  {
    id: 'will-004',
    name: 'Will',
    role: 'Sales Operations Specialist',
    department: 'Freight Operations',
    avatar: '💼',
    status: 'busy',
    currentTask:
      'Closing deals on 47 automotive suppliers - industrial sales goldmine',
    tasksCompleted: 234,
    revenue: 67500,
    efficiency: 96.8,
  },
  {
    id: 'hunter-005',
    name: 'Hunter',
    role: 'Recruiting & Onboarding Specialist',
    department: 'Freight Operations',
    avatar: '🎯',
    status: 'active',
    currentTask:
      'Hunting for talent - contacted 156 owner-operators, building recruitment army',
    tasksCompleted: 145,
    revenue: 45300,
    efficiency: 93.4,
  },
  {
    id: 'logan-006',
    name: 'Logan',
    role: 'Logistics Coordination Specialist',
    department: 'Freight Operations',
    avatar: '🚛',
    status: 'busy',
    currentTask:
      'Orchestrating supply chain logistics - managing 89 active shipments',
    tasksCompleted: 198,
    revenue: 54700,
    efficiency: 97.1,
  },
  {
    id: 'miles-007',
    name: 'Miles',
    role: 'Dispatch Coordination Specialist',
    department: 'Freight Operations',
    avatar: '📍',
    status: 'active',
    currentTask:
      'Coordinating routes across 1,247 miles - optimizing dispatch efficiency',
    tasksCompleted: 167,
    revenue: 32100,
    efficiency: 95.2,
  },
  {
    id: 'dee-008',
    name: 'Dee',
    role: 'Freight Brokerage Specialist',
    department: 'Freight Operations',
    avatar: '🚚',
    status: 'busy',
    currentTask: 'Negotiating freight contracts - secured $45K in new business',
    tasksCompleted: 203,
    revenue: 78900,
    efficiency: 98.1,
  },
  {
    id: 'brook-009',
    name: 'Brook R.',
    role: 'Brokerage Operations Specialist',
    department: 'Relationships',
    avatar: '🌊',
    status: 'active',
    currentTask:
      'Managing broker relationships - 34 new partnerships established',
    tasksCompleted: 134,
    revenue: 41200,
    efficiency: 94.8,
  },
  {
    id: 'carrie-010',
    name: 'Carrie R.',
    role: 'Carrier Relations Specialist',
    department: 'Relationships',
    avatar: '🚛',
    status: 'active',
    currentTask:
      'Building carrier network - onboarded 67 new carriers this month',
    tasksCompleted: 187,
    revenue: 52300,
    efficiency: 96.2,
  },
  {
    id: 'shanell-011',
    name: 'Shanell',
    role: 'Customer Service Specialist',
    department: 'Support & Service',
    avatar: '💬',
    status: 'active',
    currentTask:
      'Customer excellence - resolved 89 issues with 98% satisfaction',
    tasksCompleted: 212,
    revenue: 18700,
    efficiency: 99.1,
  },
  {
    id: 'resse-012',
    name: 'Resse A. Bell',
    role: 'Accounting Specialist',
    department: 'Financial',
    avatar: '💰',
    status: 'active',
    currentTask:
      'Processing receivables - $78K in outstanding invoices reconciled',
    tasksCompleted: 167,
    revenue: 12400,
    efficiency: 99.2,
  },
  {
    id: 'dell-013',
    name: 'Dell',
    role: 'IT Support Specialist',
    department: 'Technology',
    avatar: '💻',
    status: 'active',
    currentTask: 'System maintenance - upgraded 15 workstations, zero downtime',
    tasksCompleted: 89,
    revenue: 8900,
    efficiency: 97.8,
  },
  {
    id: 'kameelah-014',
    name: 'Kameelah',
    role: 'DOT Compliance Specialist',
    department: 'Compliance & Safety',
    avatar: '⚖️',
    status: 'busy',
    currentTask:
      'DOT compliance audit - reviewed 234 driver records, all compliant',
    tasksCompleted: 145,
    revenue: 15600,
    efficiency: 96.4,
  },
  {
    id: 'regina-015',
    name: 'Regina',
    role: 'FMCSA Regulations Specialist',
    department: 'Compliance & Safety',
    avatar: '📋',
    status: 'busy',
    currentTask: 'FMCSA violations analysis - 8 critical issues resolved',
    tasksCompleted: 134,
    revenue: 18700,
    efficiency: 98.9,
  },
  {
    id: 'clarence-016',
    name: 'Clarence',
    role: 'Claims & Insurance Specialist',
    department: 'Support & Service',
    avatar: '🛡️',
    status: 'active',
    currentTask: 'Processing cargo claims - 5 claims resolved successfully',
    tasksCompleted: 98,
    revenue: 22300,
    efficiency: 94.7,
  },
  {
    id: 'drew-017',
    name: 'Drew',
    role: 'Marketing Specialist',
    department: 'Business Development',
    avatar: '📢',
    status: 'active',
    currentTask:
      'Digital marketing campaigns - 3 new campaigns launched, ROI +18%',
    tasksCompleted: 112,
    revenue: 31200,
    efficiency: 93.1,
  },
  {
    id: 'cal-018',
    name: 'C. Allen Durr',
    role: 'Schedule Optimization Specialist',
    department: 'Operations',
    avatar: '📅',
    status: 'active',
    currentTask:
      'Optimizing AI schedules - 3 efficiency improvements identified',
    tasksCompleted: 67,
    revenue: 9800,
    efficiency: 99.5,
  },
  {
    id: 'ana-019',
    name: 'Ana Lytics',
    role: 'Data Analysis Specialist',
    department: 'Operations',
    avatar: '📊',
    status: 'busy',
    currentTask:
      'Performance analytics - identified 5 optimization opportunities',
    tasksCompleted: 156,
    revenue: 14500,
    efficiency: 97.2,
  },
];

export default function DEPOINTEDashboard() {
  const [isTaskCreationOpen, setIsTaskCreationOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedView, setSelectedView] = useState('overview');
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([
    'FREIGHT_OPERATIONS',
    'BUSINESS_DEVELOPMENT',
  ]); // Start with key departments expanded
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStaffMember, setSelectedStaffMember] = useState<string | null>(
    null
  );
  const [staffDetailsView, setStaffDetailsView] = useState<
    'overview' | 'tasks' | 'crm' | 'performance'
  >('overview');

  // Department structure and organization
  const departments = {
    FINANCIAL: {
      name: '💰 Financial',
      color: '#f59e0b',
      staff: depointeStaff.filter((staff) => staff.department === 'Financial'),
    },
    TECHNOLOGY: {
      name: '💻 Technology',
      color: '#3b82f6',
      staff: depointeStaff.filter((staff) => staff.department === 'Technology'),
    },
    FREIGHT_OPERATIONS: {
      name: '🚛 Freight Operations',
      color: '#10b981',
      staff: depointeStaff.filter((staff) =>
        [
          'Logistics Coordination Specialist',
          'Dispatch Coordination Specialist',
          'Freight Brokerage Specialist',
          'Sales Operations Specialist',
          'Recruiting & Onboarding Specialist',
        ].includes(staff.role)
      ),
    },
    RELATIONSHIPS: {
      name: '🤝 Relationships',
      color: '#8b5cf6',
      staff: depointeStaff.filter((staff) =>
        [
          'Brokerage Operations Specialist',
          'Carrier Relations Specialist',
        ].includes(staff.role)
      ),
    },
    COMPLIANCE_SAFETY: {
      name: '⚖️ Compliance & Safety',
      color: '#ef4444',
      staff: depointeStaff.filter(
        (staff) => staff.department === 'Compliance & Safety'
      ),
    },
    SUPPORT_SERVICE: {
      name: '🛡️ Support & Service',
      color: '#06b6d4',
      staff: depointeStaff.filter(
        (staff) => staff.department === 'Support & Service'
      ),
    },
    BUSINESS_DEVELOPMENT: {
      name: '📈 Business Development',
      color: '#ec4899',
      staff: depointeStaff.filter(
        (staff) => staff.department === 'Business Development'
      ),
    },
    OPERATIONS: {
      name: '📊 Operations',
      color: '#f97316',
      staff: depointeStaff.filter((staff) => staff.department === 'Operations'),
    },
  };

  // Helper functions
  const toggleDepartment = (deptKey: string) => {
    setExpandedDepartments((prev) =>
      prev.includes(deptKey)
        ? prev.filter((d) => d !== deptKey)
        : [...prev, deptKey]
    );
  };

  const getFilteredDepartments = () => {
    if (selectedDepartment === 'all') return departments;
    return Object.fromEntries(
      Object.entries(departments).filter(([key]) => key === selectedDepartment)
    );
  };

  // Calculate metrics
  const totalRevenue = depointeStaff.reduce(
    (sum, staff) => sum + staff.revenue,
    0
  );
  const totalTasks = depointeStaff.reduce(
    (sum, staff) => sum + staff.tasksCompleted,
    0
  );
  const averageEfficiency =
    depointeStaff.reduce((sum, staff) => sum + staff.efficiency, 0) /
    depointeStaff.length;
  const activeStaff = depointeStaff.filter(
    (staff) => staff.status !== 'offline'
  ).length;

  // Available staff for task assignment
  const availableStaff = depointeStaff.map((staff) => ({
    id: staff.id,
    name: staff.name,
    role: staff.role,
    department: staff.department,
  }));

  // Handle task creation
  const handleTaskCreate = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setIsTaskCreationOpen(false);
  };

  // Get detailed staff member data for CRM
  const getStaffDetails = (staffId: string) => {
    const staff = depointeStaff.find((s) => s.id === staffId);
    if (!staff) return null;

    return {
      ...staff,
      taskHistory: [
        {
          id: 'task-001',
          title: 'Prospect Analysis - Safety Violations',
          status: 'completed',
          completedAt: '2 hours ago',
          type: 'lead-generation',
          result: 'Found 12 desperate shippers, 8 qualified leads generated',
          timeSpent: '3.5 hours',
          revenue: '$24,500',
        },
        {
          id: 'task-002',
          title: 'Follow-up on Automotive Suppliers',
          status: 'in-progress',
          startedAt: '30 minutes ago',
          type: 'sales',
          progress: 65,
          expectedCompletion: 'In 2 hours',
        },
        {
          id: 'task-003',
          title: 'FMCSA Compliance Check',
          status: 'pending',
          scheduledFor: 'Tomorrow 9:00 AM',
          type: 'compliance',
          priority: 'high',
        },
      ],
      crmActivities: [
        {
          id: 'crm-001',
          type: 'call',
          contact: 'ABC Manufacturing Corp',
          result: 'Interested - scheduled follow-up',
          timestamp: '1 hour ago',
          duration: '15 minutes',
          notes: 'Need urgent freight services, budget confirmed $45K monthly',
        },
        {
          id: 'crm-002',
          type: 'email',
          contact: 'XYZ Logistics Inc',
          result: 'Quote requested',
          timestamp: '3 hours ago',
          subject: 'Freight Solutions Proposal',
          status: 'awaiting-response',
        },
        {
          id: 'crm-003',
          type: 'lead',
          contact: 'Delta Transport Solutions',
          result: 'Qualified lead',
          timestamp: '5 hours ago',
          leadScore: 95,
          urgency: 'high',
          estimatedValue: '$67,000',
        },
      ],
      currentProspects: [
        {
          id: 'prospect-001',
          company: 'MegaCorp Industries',
          status: 'hot-lead',
          lastContact: '2 hours ago',
          estimatedValue: '$89,000',
          urgencyLevel: 'high',
          nextAction: 'Send proposal by EOD',
        },
        {
          id: 'prospect-002',
          company: 'FastTrack Shipping',
          status: 'follow-up-needed',
          lastContact: '1 day ago',
          estimatedValue: '$34,000',
          urgencyLevel: 'medium',
          nextAction: 'Schedule demo call',
        },
      ],
      performance: {
        thisWeek: {
          callsMade: 47,
          emailsSent: 89,
          leadsGenerated: 23,
          dealsCompleted: 8,
          revenue: '$156,000',
        },
        thisMonth: {
          callsMade: 189,
          emailsSent: 334,
          leadsGenerated: 87,
          dealsCompleted: 34,
          revenue: '$594,000',
        },
      },
    };
  };

  // Performance Metrics component
  const PerformanceMetrics = ({
    title,
    metrics,
    color,
  }: {
    title: string;
    metrics: { label: string; value: string }[];
    color: string;
  }) => (
    <div
      className='financial-card'
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <h4
        className='financial-header'
        style={{
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: '700',
          marginBottom: '16px',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        {title}
      </h4>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className='performance-metric'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom:
              index < metrics.length - 1
                ? '1px solid rgba(148, 163, 184, 0.1)'
                : 'none',
          }}
        >
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem',
            }}
          >
            {metric.label}
          </span>
          <span
            style={{
              color: color,
              fontWeight: '700',
              fontSize: '1rem',
              textShadow: `0 2px 8px ${color}40`,
            }}
          >
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '20px',
      }}
    >
      <style>{mobileStyles}</style>

      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <div>
            <h1
              style={{
                color: 'white',
                fontSize: '2rem',
                fontWeight: '800',
                margin: '0',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DEPOINTE AI Company Dashboard
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0',
                fontSize: '0.9rem',
              }}
            >
              🚛 Freight Brokerage & Transportation | DEPOINTE/ Freight 1st
              Direct
            </p>
          </div>
          <button
            onClick={() => setIsTaskCreationOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>➕</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      <div
        className='financial-grid'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <PerformanceMetrics
          title='💰 Revenue Metrics'
          metrics={[
            { label: 'Daily Revenue', value: '$593,000' },
            { label: 'Monthly Target', value: '$2.1M' },
            { label: 'Growth Rate', value: '+24.3%' },
            { label: 'Avg Deal Size', value: '$45,300' },
          ]}
          color='#22c55e'
        />
        <PerformanceMetrics
          title='⚡ Efficiency Metrics'
          metrics={[
            { label: 'Tasks Completed', value: totalTasks.toLocaleString() },
            {
              label: 'Avg Efficiency',
              value: `${averageEfficiency.toFixed(1)}%`,
            },
            { label: 'Response Time', value: '0.8s' },
            { label: 'Uptime', value: '99.9%' },
          ]}
          color='#3b82f6'
        />
        <PerformanceMetrics
          title='📈 Growth Metrics'
          metrics={[
            { label: 'Active AI Staff', value: activeStaff.toString() },
            {
              label: 'Departments',
              value: Object.keys(departments).length.toString(),
            },
            { label: 'Success Rate', value: '96.8%' },
            { label: 'Conversion', value: '32.4%' },
          ]}
          color='#8b5cf6'
        />
      </div>

      {/* Department Filter Controls */}
      <div
        className='financial-card'
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '15px 20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <h2
            className='financial-header'
            style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '800',
              margin: '0',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            🎯 DEPOINTE AI Departments ({Object.keys(departments).length} Depts,{' '}
            {depointeStaff.length} Staff)
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              <option
                value='all'
                style={{ background: '#1e293b', color: 'white' }}
              >
                All Departments
              </option>
              {Object.entries(departments).map(([key, dept]) => (
                <option
                  key={key}
                  value={key}
                  style={{ background: '#1e293b', color: 'white' }}
                >
                  {dept.name} ({dept.staff.length})
                </option>
              ))}
            </select>

            <button
              onClick={() => setExpandedDepartments(Object.keys(departments))}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Expand All
            </button>

            <button
              onClick={() => setExpandedDepartments([])}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Department-Based AI Staff Organization */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Object.entries(getFilteredDepartments()).map(([deptKey, dept]) => {
          const isExpanded = expandedDepartments.includes(deptKey);
          const deptRevenue = dept.staff.reduce(
            (sum, staff) => sum + staff.revenue,
            0
          );
          const deptTasks = dept.staff.reduce(
            (sum, staff) => sum + staff.tasksCompleted,
            0
          );
          const deptEfficiency =
            dept.staff.length > 0
              ? dept.staff.reduce((sum, staff) => sum + staff.efficiency, 0) /
                dept.staff.length
              : 0;
          const activeCount = dept.staff.filter(
            (staff) => staff.status === 'active' || staff.status === 'busy'
          ).length;

          return (
            <div
              key={deptKey}
              className='financial-card'
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden',
              }}
            >
              {/* Department Header */}
              <div
                onClick={() => toggleDepartment(deptKey)}
                style={{
                  padding: '20px',
                  background: `linear-gradient(135deg, ${dept.color}20, ${dept.color}10)`,
                  borderBottom: isExpanded
                    ? '1px solid rgba(148, 163, 184, 0.1)'
                    : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                    }}
                  >
                    <h3
                      style={{
                        color: dept.color,
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {dept.name} ({dept.staff.length} Staff)
                    </h3>
                    <div
                      style={{
                        background: `${dept.color}20`,
                        color: dept.color,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      {activeCount}/{dept.staff.length} Active
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    {/* Department Summary Stats */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '15px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#22c55e', fontWeight: '700' }}>
                          ${(deptRevenue / 1000).toFixed(0)}K
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.7rem',
                          }}
                        >
                          Revenue
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#3b82f6', fontWeight: '700' }}>
                          {deptTasks}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.7rem',
                          }}
                        >
                          Tasks
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#a855f7', fontWeight: '700' }}>
                          {deptEfficiency.toFixed(1)}%
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.7rem',
                          }}
                        >
                          Efficiency
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        color: 'white',
                        fontSize: '1.2rem',
                        transform: isExpanded
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Staff Grid (Collapsible) */}
              {isExpanded && (
                <div style={{ padding: '20px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {dept.staff.map((staff) => (
                      <div
                        key={staff.id}
                        onClick={() => setSelectedStaffMember(staff.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(148, 163, 184, 0.1)',
                          borderRadius: '8px',
                          padding: '16px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          ':hover': {
                            background: 'rgba(255, 255, 255, 0.08)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.08)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.05)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px',
                          }}
                        >
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${staff.status === 'busy' ? '#f59e0b' : '#10b981'}, ${staff.status === 'busy' ? '#d97706' : '#059669'})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                            }}
                          >
                            {staff.avatar}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                color: 'white',
                                margin: 0,
                                fontSize: '1rem',
                                fontWeight: '700',
                              }}
                            >
                              {staff.name}
                            </h4>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                margin: 0,
                                fontSize: '0.8rem',
                              }}
                            >
                              {staff.role}
                            </p>
                          </div>
                          <div
                            style={{
                              background: `${staff.status === 'busy' ? '#f59e0b20' : '#10b98120'}`,
                              color:
                                staff.status === 'busy' ? '#f59e0b' : '#10b981',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}
                          >
                            {staff.status}
                          </div>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.8rem',
                            marginBottom: '12px',
                          }}
                        >
                          🎯 {staff.currentTask}
                        </p>
                        <div
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#8b5cf6',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textAlign: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          👆 Click to view detailed CRM
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color: '#ec4899',
                                fontWeight: '700',
                                fontSize: '1rem',
                              }}
                            >
                              {staff.tasksCompleted}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.7rem',
                              }}
                            >
                              Tasks
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: '#f59e0b',
                                fontWeight: '700',
                                fontSize: '1rem',
                              }}
                            >
                              ${staff.revenue.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.7rem',
                              }}
                            >
                              Revenue
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: '#a855f7',
                                fontWeight: '700',
                                fontSize: '1rem',
                              }}
                            >
                              {staff.efficiency}%
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.7rem',
                              }}
                            >
                              Efficiency
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Activity Feed */}
      <div
        className='financial-card'
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          marginTop: '30px',
        }}
      >
        <h2
          className='financial-header'
          style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '800',
            marginBottom: '20px',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          📡 Live DEPOINTE Activity Feed
        </h2>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {[
            {
              time: '2 min ago',
              message:
                'Desiree identified 12 companies with safety violations - classic desperation signals detected',
              agent: 'Desiree (Desperate Prospects)',
              type: 'success',
            },
            {
              time: '5 min ago',
              message:
                'Will completed outreach to 47 automotive suppliers - industrial sales goldmine',
              agent: 'Will (Sales Operations)',
              type: 'info',
            },
            {
              time: '8 min ago',
              message:
                'Cliff generated 23 leads from desperate carriers - urgent needs identified',
              agent: 'Cliff (Desperate Prospects)',
              type: 'success',
            },
            {
              time: '12 min ago',
              message:
                'Hunter contacted 156 owner-operators - building the recruitment pipeline',
              agent: 'Hunter (Recruiting & Onboarding)',
              type: 'info',
            },
            {
              time: '15 min ago',
              message:
                'Logan orchestrated 89 shipments - supply chain running smoothly',
              agent: 'Logan (Logistics)',
              type: 'success',
            },
            {
              time: '18 min ago',
              message:
                'Miles coordinated 1,247 miles of routes - dispatch efficiency optimized',
              agent: 'Miles (Dispatch)',
              type: 'info',
            },
            {
              time: '22 min ago',
              message:
                'Regina resolved 8 FMCSA violations - compliance maintained',
              agent: 'Regina (FMCSA Regulations)',
              type: 'warning',
            },
            {
              time: '25 min ago',
              message:
                'Clarence processed 5 cargo claims - all resolved successfully',
              agent: 'Clarence (Claims & Insurance)',
              type: 'success',
            },
            {
              time: '28 min ago',
              message:
                'Drew launched 3 marketing campaigns - ROI increased by 18%',
              agent: 'Drew (Marketing)',
              type: 'success',
            },
            {
              time: '32 min ago',
              message:
                'Resse A. Bell reconciled $78K in receivables - accounting current',
              agent: 'Resse A. Bell (Accounting)',
              type: 'info',
            },
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                marginBottom: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    activity.type === 'success'
                      ? '#22c55e'
                      : activity.type === 'warning'
                        ? '#f59e0b'
                        : '#3b82f6',
                  animation: 'pulse 2s infinite',
                }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: 'white',
                    margin: 0,
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  {activity.message}
                </p>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: 0,
                    fontSize: '0.7rem',
                  }}
                >
                  {activity.agent} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Member CRM Details Modal */}
      {selectedStaffMember && (
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
              setSelectedStaffMember(null);
              setStaffDetailsView('overview');
            }
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '1200px',
              height: '90%',
              maxHeight: '800px',
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
            {(() => {
              const staffDetails = getStaffDetails(selectedStaffMember);
              if (!staffDetails) return null;

              return (
                <>
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${staffDetails.status === 'busy' ? '#f59e0b' : '#10b981'}, ${staffDetails.status === 'busy' ? '#d97706' : '#059669'})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                        }}
                      >
                        {staffDetails.avatar}
                      </div>
                      <div>
                        <h2
                          style={{
                            color: 'white',
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: '700',
                          }}
                        >
                          {staffDetails.name}
                        </h2>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '1rem',
                          }}
                        >
                          {staffDetails.role} • {staffDetails.department}
                        </p>
                        <div
                          style={{
                            background: `${staffDetails.status === 'busy' ? '#f59e0b20' : '#10b98120'}`,
                            color:
                              staffDetails.status === 'busy'
                                ? '#f59e0b'
                                : '#10b981',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            display: 'inline-block',
                            marginTop: '5px',
                          }}
                        >
                          {staffDetails.status}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStaffMember(null);
                        setStaffDetailsView('overview');
                      }}
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

                  {/* Tab Navigation */}
                  <div
                    style={{
                      display: 'flex',
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    }}
                  >
                    {[
                      { key: 'overview', label: '📊 Overview' },
                      { key: 'tasks', label: '✅ Tasks & Work' },
                      { key: 'crm', label: '📞 CRM Activities' },
                      { key: 'performance', label: '📈 Performance' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setStaffDetailsView(tab.key as any)}
                        style={{
                          background:
                            staffDetailsView === tab.key
                              ? 'rgba(139, 92, 246, 0.2)'
                              : 'transparent',
                          border: 'none',
                          color:
                            staffDetailsView === tab.key
                              ? '#8b5cf6'
                              : 'rgba(255, 255, 255, 0.7)',
                          padding: '15px 25px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          borderBottom:
                            staffDetailsView === tab.key
                              ? '2px solid #8b5cf6'
                              : '2px solid transparent',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Content Area */}
                  <div
                    style={{
                      flex: 1,
                      padding: '30px',
                      overflowY: 'auto',
                    }}
                  >
                    {/* Overview Tab */}
                    {staffDetailsView === 'overview' && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '25px',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                          }}
                        >
                          <div
                            style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              border: '1px solid rgba(34, 197, 94, 0.2)',
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
                              ${staffDetails.revenue.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Total Revenue Generated
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
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
                              {staffDetails.tasksCompleted}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Tasks Completed
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(168, 85, 247, 0.1)',
                              border: '1px solid rgba(168, 85, 247, 0.2)',
                              borderRadius: '12px',
                              padding: '20px',
                              textAlign: 'center',
                            }}
                          >
                            <div
                              style={{
                                color: '#a855f7',
                                fontSize: '2rem',
                                fontWeight: '700',
                              }}
                            >
                              {staffDetails.efficiency}%
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.9rem',
                              }}
                            >
                              Efficiency Rating
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            borderRadius: '12px',
                            padding: '20px',
                          }}
                        >
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '1.2rem',
                              fontWeight: '700',
                              marginBottom: '15px',
                            }}
                          >
                            🎯 Currently Working On
                          </h3>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '1rem',
                              lineHeight: '1.6',
                            }}
                          >
                            {staffDetails.currentTask}
                          </p>
                        </div>

                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            borderRadius: '12px',
                            padding: '20px',
                          }}
                        >
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '1.2rem',
                              fontWeight: '700',
                              marginBottom: '15px',
                            }}
                          >
                            🔥 Hot Prospects
                          </h3>
                          {staffDetails.currentProspects.map(
                            (prospect, index) => (
                              <div
                                key={prospect.id}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '12px 0',
                                  borderBottom:
                                    index <
                                    staffDetails.currentProspects.length - 1
                                      ? '1px solid rgba(148, 163, 184, 0.1)'
                                      : 'none',
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      color: 'white',
                                      fontSize: '0.95rem',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {prospect.company}
                                  </div>
                                  <div
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    {prospect.nextAction} • Last contact:{' '}
                                    {prospect.lastContact}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div
                                    style={{
                                      color: '#22c55e',
                                      fontSize: '0.9rem',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {prospect.estimatedValue}
                                  </div>
                                  <div
                                    style={{
                                      background:
                                        prospect.urgencyLevel === 'high'
                                          ? '#ef444420'
                                          : '#f59e0b20',
                                      color:
                                        prospect.urgencyLevel === 'high'
                                          ? '#ef4444'
                                          : '#f59e0b',
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.7rem',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    {prospect.urgencyLevel}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tasks & Work Tab */}
                    {staffDetailsView === 'tasks' && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '1.3rem',
                              fontWeight: '700',
                              margin: 0,
                            }}
                          >
                            Task History & Current Work
                          </h3>
                          <button
                            onClick={() => setIsTaskCreationOpen(true)}
                            style={{
                              background:
                                'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px 20px',
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            ➕ Assign New Task
                          </button>
                        </div>

                        {staffDetails.taskHistory.map((task) => (
                          <div
                            key={task.id}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(148, 163, 184, 0.1)',
                              borderRadius: '12px',
                              padding: '20px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '15px',
                              }}
                            >
                              <div>
                                <h4
                                  style={{
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    margin: 0,
                                  }}
                                >
                                  {task.title}
                                </h4>
                                <p
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.9rem',
                                    margin: '5px 0 0 0',
                                  }}
                                >
                                  Type: {task.type.replace('-', ' ')} •{' '}
                                  {task.completedAt ||
                                    task.startedAt ||
                                    task.scheduledFor}
                                </p>
                              </div>
                              <div
                                style={{
                                  background:
                                    task.status === 'completed'
                                      ? '#22c55e20'
                                      : task.status === 'in-progress'
                                        ? '#f59e0b20'
                                        : '#64748b20',
                                  color:
                                    task.status === 'completed'
                                      ? '#22c55e'
                                      : task.status === 'in-progress'
                                        ? '#f59e0b'
                                        : '#64748b',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {task.status}
                              </div>
                            </div>

                            {task.status === 'completed' && (
                              <div style={{ marginBottom: '10px' }}>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.9rem',
                                    marginBottom: '5px',
                                  }}
                                >
                                  <strong>Result:</strong> {task.result}
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '20px',
                                    fontSize: '0.8rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                  }}
                                >
                                  <span>Time: {task.timeSpent}</span>
                                  <span>Revenue: {task.revenue}</span>
                                </div>
                              </div>
                            )}

                            {task.status === 'in-progress' && (
                              <div style={{ marginBottom: '10px' }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    Progress: {task.progress}%
                                  </span>
                                  <span
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    Expected: {task.expectedCompletion}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    height: '8px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      background:
                                        'linear-gradient(135deg, #f59e0b, #d97706)',
                                      height: '100%',
                                      width: `${task.progress}%`,
                                      transition: 'width 0.3s ease',
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {task.status === 'pending' && task.priority && (
                              <div
                                style={{
                                  background:
                                    task.priority === 'high'
                                      ? '#ef444420'
                                      : '#64748b20',
                                  color:
                                    task.priority === 'high'
                                      ? '#ef4444'
                                      : '#64748b',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  display: 'inline-block',
                                }}
                              >
                                Priority: {task.priority}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CRM Activities Tab */}
                    {staffDetailsView === 'crm' && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                        }}
                      >
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            margin: 0,
                          }}
                        >
                          Recent CRM Activities
                        </h3>

                        {staffDetails.crmActivities.map((activity) => (
                          <div
                            key={activity.id}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(148, 163, 184, 0.1)',
                              borderRadius: '12px',
                              padding: '20px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '15px',
                              }}
                            >
                              <div
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  background:
                                    activity.type === 'call'
                                      ? '#22c55e20'
                                      : activity.type === 'email'
                                        ? '#3b82f620'
                                        : '#8b5cf620',
                                  color:
                                    activity.type === 'call'
                                      ? '#22c55e'
                                      : activity.type === 'email'
                                        ? '#3b82f6'
                                        : '#8b5cf6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '18px',
                                }}
                              >
                                {activity.type === 'call'
                                  ? '📞'
                                  : activity.type === 'email'
                                    ? '📧'
                                    : '🎯'}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    margin: 0,
                                  }}
                                >
                                  {activity.contact}
                                </h4>
                                <p
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.9rem',
                                    margin: '2px 0',
                                  }}
                                >
                                  {activity.type === 'email'
                                    ? activity.subject
                                    : activity.type.toUpperCase()}{' '}
                                  • {activity.timestamp}
                                </p>
                              </div>
                              <div
                                style={{
                                  background:
                                    activity.result.includes('Interested') ||
                                    activity.result.includes('Qualified')
                                      ? '#22c55e20'
                                      : '#f59e0b20',
                                  color:
                                    activity.result.includes('Interested') ||
                                    activity.result.includes('Qualified')
                                      ? '#22c55e'
                                      : '#f59e0b',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                }}
                              >
                                {activity.result}
                              </div>
                            </div>

                            {activity.notes && (
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '0.9rem',
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  padding: '10px',
                                  borderRadius: '6px',
                                  borderLeft: '3px solid #8b5cf6',
                                }}
                              >
                                <strong>Notes:</strong> {activity.notes}
                              </div>
                            )}

                            {activity.leadScore && (
                              <div
                                style={{
                                  marginTop: '10px',
                                  display: 'flex',
                                  gap: '15px',
                                  alignItems: 'center',
                                }}
                              >
                                <span
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  Lead Score:{' '}
                                  <strong style={{ color: '#8b5cf6' }}>
                                    {activity.leadScore}/100
                                  </strong>
                                </span>
                                <span
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  Estimated Value:{' '}
                                  <strong style={{ color: '#22c55e' }}>
                                    {activity.estimatedValue}
                                  </strong>
                                </span>
                              </div>
                            )}

                            {activity.duration && (
                              <div
                                style={{
                                  marginTop: '10px',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '0.8rem',
                                }}
                              >
                                Duration: {activity.duration}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Performance Tab */}
                    {staffDetailsView === 'performance' && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '25px',
                        }}
                      >
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            margin: 0,
                          }}
                        >
                          Performance Analytics
                        </h3>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '20px',
                          }}
                        >
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
                                fontWeight: '700',
                                marginBottom: '15px',
                              }}
                            >
                              📅 This Week
                            </h4>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Calls Made:
                                </span>
                                <span
                                  style={{
                                    color: '#22c55e',
                                    fontWeight: '700',
                                  }}
                                >
                                  {staffDetails.performance.thisWeek.callsMade}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Emails Sent:
                                </span>
                                <span
                                  style={{
                                    color: '#3b82f6',
                                    fontWeight: '700',
                                  }}
                                >
                                  {staffDetails.performance.thisWeek.emailsSent}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Leads Generated:
                                </span>
                                <span
                                  style={{
                                    color: '#8b5cf6',
                                    fontWeight: '700',
                                  }}
                                >
                                  {
                                    staffDetails.performance.thisWeek
                                      .leadsGenerated
                                  }
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Deals Completed:
                                </span>
                                <span
                                  style={{
                                    color: '#f59e0b',
                                    fontWeight: '700',
                                  }}
                                >
                                  {
                                    staffDetails.performance.thisWeek
                                      .dealsCompleted
                                  }
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  paddingTop: '10px',
                                  borderTop:
                                    '1px solid rgba(148, 163, 184, 0.1)',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Revenue:
                                </span>
                                <span
                                  style={{
                                    color: '#22c55e',
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                  }}
                                >
                                  {staffDetails.performance.thisWeek.revenue}
                                </span>
                              </div>
                            </div>
                          </div>

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
                                fontWeight: '700',
                                marginBottom: '15px',
                              }}
                            >
                              📊 This Month
                            </h4>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Calls Made:
                                </span>
                                <span
                                  style={{
                                    color: '#22c55e',
                                    fontWeight: '700',
                                  }}
                                >
                                  {staffDetails.performance.thisMonth.callsMade}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Emails Sent:
                                </span>
                                <span
                                  style={{
                                    color: '#3b82f6',
                                    fontWeight: '700',
                                  }}
                                >
                                  {
                                    staffDetails.performance.thisMonth
                                      .emailsSent
                                  }
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Leads Generated:
                                </span>
                                <span
                                  style={{
                                    color: '#8b5cf6',
                                    fontWeight: '700',
                                  }}
                                >
                                  {
                                    staffDetails.performance.thisMonth
                                      .leadsGenerated
                                  }
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Deals Completed:
                                </span>
                                <span
                                  style={{
                                    color: '#f59e0b',
                                    fontWeight: '700',
                                  }}
                                >
                                  {
                                    staffDetails.performance.thisMonth
                                      .dealsCompleted
                                  }
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  paddingTop: '10px',
                                  borderTop:
                                    '1px solid rgba(148, 163, 184, 0.1)',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Revenue:
                                </span>
                                <span
                                  style={{
                                    color: '#22c55e',
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                  }}
                                >
                                  {staffDetails.performance.thisMonth.revenue}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

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
                              fontWeight: '700',
                              marginBottom: '15px',
                            }}
                          >
                            🏆 Performance Insights
                          </h4>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '15px',
                            }}
                          >
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  color: '#22c55e',
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                }}
                              >
                                {Math.round(
                                  (staffDetails.performance.thisMonth
                                    .dealsCompleted /
                                    staffDetails.performance.thisMonth
                                      .leadsGenerated) *
                                    100
                                )}
                                %
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.9rem',
                                }}
                              >
                                Conversion Rate
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  color: '#3b82f6',
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                }}
                              >
                                $
                                {Math.round(
                                  parseInt(
                                    staffDetails.performance.thisMonth.revenue.replace(
                                      /[$,]/g,
                                      ''
                                    )
                                  ) /
                                    staffDetails.performance.thisMonth
                                      .dealsCompleted
                                ).toLocaleString()}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.9rem',
                                }}
                              >
                                Avg Deal Value
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  color: '#8b5cf6',
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                }}
                              >
                                {Math.round(
                                  staffDetails.performance.thisMonth.callsMade /
                                    4.3
                                )}{' '}
                                {/* Assuming ~30 days / 7 days per week */}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.9rem',
                                }}
                              >
                                Calls per Week
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {isTaskCreationOpen && (
        <TaskCreationInterface
          onClose={() => setIsTaskCreationOpen(false)}
          onTaskCreate={handleTaskCreate}
          availableStaff={availableStaff}
        />
      )}
    </div>
  );
}
