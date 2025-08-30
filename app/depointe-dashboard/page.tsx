'use client';

import { useEffect, useState } from 'react';
import HealthcareBatchDeployment, {
  HealthcareTask,
} from '../components/HealthcareBatchDeployment';
import TaskCreationInterface from '../components/TaskCreationInterface';

// DEPOINTE AI Staff with Human Names (all 18 members) - No mock data
const depointeStaff = [
  {
    id: 'desiree-001',
    name: 'Desiree',
    role: 'Desperate Prospects Specialist',
    department: 'Business Development',
    avatar: '🎯',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'cliff-002',
    name: 'Cliff',
    role: 'Desperate Prospects Hunter',
    department: 'Business Development',
    avatar: '⛰️',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'gary-003',
    name: 'Gary',
    role: 'Lead Generation Specialist',
    department: 'Business Development',
    avatar: '📈',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'will-004',
    name: 'Will',
    role: 'Sales Operations Specialist',
    department: 'Freight Operations',
    avatar: '💼',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'hunter-005',
    name: 'Hunter',
    role: 'Recruiting & Onboarding Specialist',
    department: 'Freight Operations',
    avatar: '🎯',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'logan-006',
    name: 'Logan',
    role: 'Logistics Coordination Specialist',
    department: 'Freight Operations',
    avatar: '🚛',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'miles-007',
    name: 'Miles',
    role: 'Dispatch Coordination Specialist',
    department: 'Freight Operations',
    avatar: '📍',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'dee-008',
    name: 'Dee',
    role: 'Freight Brokerage Specialist',
    department: 'Freight Operations',
    avatar: '🚚',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'brook-009',
    name: 'Brook R.',
    role: 'Brokerage Operations Specialist',
    department: 'Relationships',
    avatar: '🌊',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'carrie-010',
    name: 'Carrie R.',
    role: 'Carrier Relations Specialist',
    department: 'Relationships',
    avatar: '🚛',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'shanell-011',
    name: 'Shanell',
    role: 'Customer Service Specialist',
    department: 'Support & Service',
    avatar: '💬',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'resse-012',
    name: 'Resse A. Bell',
    role: 'Accounting Specialist',
    department: 'Financial',
    avatar: '💰',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'dell-013',
    name: 'Dell',
    role: 'IT Support Specialist',
    department: 'Technology',
    avatar: '💻',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'kameelah-014',
    name: 'Kameelah',
    role: 'DOT Compliance Specialist',
    department: 'Compliance & Safety',
    avatar: '⚖️',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'regina-015',
    name: 'Regina',
    role: 'FMCSA Regulations Specialist',
    department: 'Compliance & Safety',
    avatar: '📋',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'clarence-016',
    name: 'Clarence',
    role: 'Claims & Insurance Specialist',
    department: 'Support & Service',
    avatar: '🛡️',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'drew-017',
    name: 'Drew',
    role: 'Marketing Specialist',
    department: 'Business Development',
    avatar: '📢',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'cal-018',
    name: 'C. Allen Durr',
    role: 'Schedule Optimization Specialist',
    department: 'Operations',
    avatar: '📅',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
  {
    id: 'ana-019',
    name: 'Ana Lytics',
    role: 'Data Analysis Specialist',
    department: 'Operations',
    avatar: '📊',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
  },
];

export default function DEPOINTEDashboard() {
  const [isTaskCreationOpen, setIsTaskCreationOpen] = useState(false);
  const [isHealthcareTaskOpen, setIsHealthcareTaskOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [healthcareTasks, setHealthcareTasks] = useState<HealthcareTask[]>([]);
  const [selectedView, setSelectedView] = useState('overview');
  const [liveActivities, setLiveActivities] = useState<any[]>([]);
  const [staffData, setStaffData] = useState(depointeStaff);
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

  // Load saved healthcare tasks and activity feed on page load
  useEffect(() => {
    // Load healthcare tasks from localStorage
    const savedHealthcareTasks = localStorage.getItem(
      'depointe-healthcare-tasks'
    );
    if (savedHealthcareTasks) {
      try {
        const tasks = JSON.parse(savedHealthcareTasks);
        setHealthcareTasks(tasks);

        // Update staff status based on saved tasks
        setStaffData((prevStaff) => {
          const updatedStaff = [...prevStaff];

          tasks.forEach((task: HealthcareTask) => {
            task.assignedTo.forEach((staffId: string) => {
              const staffIndex = updatedStaff.findIndex(
                (staff) => staff.id === staffId
              );
              if (staffIndex !== -1) {
                updatedStaff[staffIndex] = {
                  ...updatedStaff[staffIndex],
                  status: 'busy',
                  currentTask: `🏥 ${task.title}`,
                  tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
                  revenue:
                    updatedStaff[staffIndex].revenue +
                    (task.priority === 'CRITICAL'
                      ? 125000
                      : task.priority === 'HIGH'
                        ? 75000
                        : task.priority === 'MEDIUM'
                          ? 45000
                          : 25000),
                  efficiency: Math.min(
                    95,
                    updatedStaff[staffIndex].efficiency + 15
                  ),
                };
              }
            });
          });

          return updatedStaff;
        });
      } catch (error) {
        console.error('Error loading healthcare tasks:', error);
      }
    }

    // Load activity feed from localStorage
    const savedActivityFeed = localStorage.getItem('depointe-activity-feed');
    if (savedActivityFeed) {
      try {
        const activities = JSON.parse(savedActivityFeed);
        setLiveActivities(activities);
      } catch (error) {
        console.error('Error loading activity feed:', error);
      }
    }
  }, []);

  // Department structure and organization
  const departments = {
    FINANCIAL: {
      name: '💰 Financial',
      color: '#f59e0b',
      staff: staffData.filter((staff) => staff.department === 'Financial'),
    },
    TECHNOLOGY: {
      name: '💻 Technology',
      color: '#3b82f6',
      staff: staffData.filter((staff) => staff.department === 'Technology'),
    },
    FREIGHT_OPERATIONS: {
      name: '🚛 Freight Operations',
      color: '#10b981',
      staff: staffData.filter((staff) =>
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
      staff: staffData.filter((staff) =>
        [
          'Brokerage Operations Specialist',
          'Carrier Relations Specialist',
        ].includes(staff.role)
      ),
    },
    COMPLIANCE_SAFETY: {
      name: '⚖️ Compliance & Safety',
      color: '#ef4444',
      staff: staffData.filter(
        (staff) => staff.department === 'Compliance & Safety'
      ),
    },
    SUPPORT_SERVICE: {
      name: '🛡️ Support & Service',
      color: '#06b6d4',
      staff: staffData.filter(
        (staff) => staff.department === 'Support & Service'
      ),
    },
    BUSINESS_DEVELOPMENT: {
      name: '📈 Business Development',
      color: '#ec4899',
      staff: staffData.filter(
        (staff) => staff.department === 'Business Development'
      ),
    },
    OPERATIONS: {
      name: '📊 Operations',
      color: '#f97316',
      staff: staffData.filter((staff) => staff.department === 'Operations'),
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
  const totalRevenue = staffData.reduce((sum, staff) => sum + staff.revenue, 0);
  const totalTasks = staffData.reduce(
    (sum, staff) => sum + staff.tasksCompleted,
    0
  );
  const averageEfficiency =
    staffData.reduce((sum, staff) => sum + staff.efficiency, 0) /
    staffData.length;
  const activeStaff = staffData.filter(
    (staff) => staff.status !== 'offline'
  ).length;

  // Available staff for task assignment
  const availableStaff = staffData.map((staff) => ({
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

  // Handle healthcare batch deployment
  const handleHealthcareBatchDeploy = (
    healthcareTasksData: HealthcareTask[]
  ) => {
    console.log('🚀 HEALTHCARE BATCH DEPLOYMENT:', healthcareTasksData);

    // Update healthcare tasks state
    setHealthcareTasks(healthcareTasksData);

    // Save to localStorage for persistence
    localStorage.setItem(
      'depointe-healthcare-tasks',
      JSON.stringify(healthcareTasksData)
    );

    // Update staff members with their assigned tasks
    setStaffData((prevStaff) => {
      const updatedStaff = [...prevStaff];

      healthcareTasksData.forEach((task) => {
        task.assignedTo.forEach((staffId) => {
          const staffIndex = updatedStaff.findIndex(
            (staff) => staff.id === staffId
          );
          if (staffIndex !== -1) {
            // Update staff member's current task and status
            updatedStaff[staffIndex] = {
              ...updatedStaff[staffIndex],
              status: 'busy',
              currentTask: `🏥 ${task.title}`,
              tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
              // Add estimated revenue based on task priority
              revenue:
                updatedStaff[staffIndex].revenue +
                (task.priority === 'CRITICAL'
                  ? 125000
                  : task.priority === 'HIGH'
                    ? 75000
                    : task.priority === 'MEDIUM'
                      ? 45000
                      : 25000),
              efficiency: Math.min(
                95,
                updatedStaff[staffIndex].efficiency + 15
              ),
            };
          }
        });
      });

      return updatedStaff;
    });

    // Create activity entries
    const newActivities = [
      {
        id: `batch-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'healthcare_deployment' as const,
        staffId: 'system',
        staffName: 'DEPOINTE AI',
        action: `🚀 HEALTHCARE DEPLOYMENT: ${healthcareTasksData.length} tasks deployed to ${[...new Set(healthcareTasksData.flatMap((t) => t.assignedTo))].length} AI specialists`,
        details: `Healthcare logistics expansion launched with $1,250K+ revenue target`,
        priority: 'critical' as const,
      },
      ...healthcareTasksData.map((task) => ({
        id: `activity-${task.id}`,
        timestamp: new Date().toISOString(),
        type: 'healthcare_deployment' as const,
        staffId: task.assignedTo[0], // Primary assignee
        staffName:
          staffData.find((s) => s.id === task.assignedTo[0])?.name ||
          'AI Staff',
        action: `Healthcare task deployed: ${task.title}`,
        details: `Priority: ${task.priority} | Timeline: ${task.timeline} | Revenue Target: ${task.revenueTarget || 'TBD'}`,
        priority: task.priority.toLowerCase() as
          | 'low'
          | 'medium'
          | 'high'
          | 'critical',
      })),
    ];

    // Add to activity feed
    setLiveActivities((prev) => [...newActivities, ...prev].slice(0, 50));

    // Save activity feed to localStorage
    localStorage.setItem(
      'depointe-activity-feed',
      JSON.stringify([...newActivities, ...liveActivities].slice(0, 50))
    );

    setIsHealthcareTaskOpen(false);

    // Show success notification
    console.log(
      '✅ Healthcare tasks deployed successfully to DEPOINTE AI team!'
    );
  };

  // Get detailed staff member data for CRM
  const getStaffDetails = (staffId: string) => {
    const staff = staffData.find((s) => s.id === staffId);
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
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '20px',
        paddingTop: '90px',
        color: 'white',
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segue UI", Roboto, sans-serif',
      }}
    >
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
          <div style={{ display: 'flex', gap: '12px' }}>
            {healthcareTasks.length === 0 && (
              <button
                onClick={() => setIsHealthcareTaskOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px -4px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '18px' }}>🏥</span>
                Healthcare Tasks
              </button>
            )}
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
      </div>

      {/* Live Campaign Deployments Section */}
      {healthcareTasks.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '700',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            🚀 Live Campaign Deployments
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  animation: 'pulse 2s infinite',
                }}
              />
              LIVE
            </div>
          </h3>

          {/* Ultra-Compact Campaign Card */}
          <div
            onClick={() => {
              // Click to expand functionality will go here
              console.log(
                'Healthcare campaign clicked - expand to show individual tasks'
              );
            }}
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '60px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Left side - Campaign info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                🏥
              </div>
              <div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  Healthcare Logistics Campaign
                </h4>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                    marginTop: '2px',
                  }}
                >
                  {healthcareTasks.length} tasks,{' '}
                  {
                    [
                      ...new Set(
                        healthcareTasks.flatMap((task) => task.assignedTo)
                      ),
                    ].length
                  }{' '}
                  staff, $1,250K+ target,{' '}
                  {
                    healthcareTasks.filter(
                      (task) => task.priority === 'CRITICAL'
                    ).length
                  }{' '}
                  critical
                </div>
              </div>
            </div>

            {/* Right side - Staff avatars and actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* Staff avatars */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  ...new Set(
                    healthcareTasks.flatMap((task) => task.assignedTo)
                  ),
                ]
                  .slice(0, 3)
                  .map((staffId) => {
                    const staff = staffData.find((s) => s.id === staffId);
                    return staff ? (
                      <div
                        key={staffId}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background:
                            'linear-gradient(135deg, #22c55e, #16a34a)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          border: '1px solid rgba(34, 197, 94, 0.5)',
                        }}
                        title={staff.name}
                      >
                        {staff.avatar}
                      </div>
                    ) : null;
                  })}
                {[
                  ...new Set(
                    healthcareTasks.flatMap((task) => task.assignedTo)
                  ),
                ].length > 3 && (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    +
                    {[
                      ...new Set(
                        healthcareTasks.flatMap((task) => task.assignedTo)
                      ),
                    ].length - 3}
                  </div>
                )}
              </div>

              {/* Clear button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent campaign click
                  setHealthcareTasks([]);
                  setLiveActivities([]);
                  localStorage.removeItem('depointe-healthcare-tasks');
                  localStorage.removeItem('depointe-activity-feed');
                  setStaffData((prevStaff) =>
                    prevStaff.map((staff) => ({
                      ...staff,
                      status: 'available',
                      currentTask: 'Ready for task assignment',
                      revenue: 0,
                      efficiency: 0,
                      tasksCompleted: 0,
                    }))
                  );
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>

              {/* Expand indicator */}
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '12px',
                }}
              >
                ▶
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes pulse {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}</style>
        </div>
      )}

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
            {
              label: 'Total Revenue',
              value: `$${(totalRevenue / 1000).toFixed(0)}K`,
            },
            { label: 'Monthly Target', value: '$500K+' },
            { label: 'Growth Rate', value: totalRevenue > 0 ? '+15%' : '0%' },
            {
              label: 'Avg Deal Size',
              value:
                totalTasks > 0
                  ? `$${Math.round(totalRevenue / totalTasks / 1000)}K`
                  : '$0',
            },
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
            { label: 'Response Time', value: '--' },
            { label: 'Uptime', value: '--' },
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
            { label: 'Success Rate', value: '--' },
            { label: 'Conversion', value: '--' },
          ]}
          color='#8b5cf6'
        />
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
          📡 Live DEPOINTE Activity Feed ({liveActivities.length} activities)
        </h2>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {liveActivities.length > 0 ? (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {liveActivities.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background:
                        activity.priority === 'critical'
                          ? '#ef4444'
                          : activity.priority === 'high'
                            ? '#f59e0b'
                            : activity.priority === 'medium'
                              ? '#3b82f6'
                              : '#10b981',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {activity.staffName}: {activity.action}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {activity.details}
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.7rem',
                    }}
                  >
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📡</div>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Waiting for Live Activity
              </h3>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>
                Your DEPOINTE AI staff activity will appear here in real-time
              </p>
            </div>
          )}
        </div>
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
          marginTop: '30px',
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
            {staffData.length} Staff)
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
      <TaskCreationInterface
        isOpen={isTaskCreationOpen}
        onClose={() => setIsTaskCreationOpen(false)}
        onTaskCreate={handleTaskCreate}
        availableStaff={availableStaff}
      />

      {/* Healthcare Batch Deployment Modal */}
      {isHealthcareTaskOpen && (
        <HealthcareBatchDeployment
          onClose={() => setIsHealthcareTaskOpen(false)}
          onBatchDeploy={handleHealthcareBatchDeploy}
        />
      )}
    </div>
  );
}
