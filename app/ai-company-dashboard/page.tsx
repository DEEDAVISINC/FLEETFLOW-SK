'use client';

import { useEffect, useState } from 'react';

// Enhanced interfaces for comprehensive AI management
interface PerformanceMetrics {
  hourlyRevenue: number[];
  dailyTasks: number[];
  weeklyEfficiency: number[];
  monthlyGrowth: number[];
}

interface AITask {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimatedCompletion: string;
  actualRevenue?: number;
}

interface SystemAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  department: string;
}

interface FleetFlowIntegration {
  loadBoardConnections: number;
  activeDispatches: number;
  revenueGenerated: number;
  customerInteractions: number;
  apiCalls: number;
}

interface AIStaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'busy' | 'idle' | 'offline';
  currentTask: string;
  tasksCompleted: number;
  revenue: number;
  efficiency: number;
  lastActivity: string;
  avatar: string;
}

interface Department {
  id: string;
  name: string;
  color: string;
  icon: string;
  totalStaff: number;
  activeStaff: number;
  dailyRevenue: number;
  tasksCompleted: number;
  efficiency: number;
}

export default function AICompanyDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [showStaffConfig, setShowStaffConfig] = useState(false);
  const [showStaffReports, setShowStaffReports] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const departments: Department[] = [
    {
      id: 'executive',
      name: 'Executive Team',
      color: '#3b82f6',
      icon: '🏢',
      totalStaff: 5,
      activeStaff: 5,
      dailyRevenue: 15000,
      tasksCompleted: 47,
      efficiency: 98.5,
    },
    {
      id: 'sales',
      name: 'Sales & Revenue',
      color: '#ec4899',
      icon: '💰',
      totalStaff: 16,
      activeStaff: 16,
      dailyRevenue: 213900,
      tasksCompleted: 687,
      efficiency: 97.8,
    },
    {
      id: 'logistics',
      name: 'Logistics Operations',
      color: '#f59e0b',
      icon: '🚛',
      totalStaff: 15,
      activeStaff: 15,
      dailyRevenue: 38000,
      tasksCompleted: 234,
      efficiency: 96.8,
    },
    {
      id: 'support',
      name: 'Support Teams',
      color: '#8b5cf6',
      icon: '❤️',
      totalStaff: 8,
      activeStaff: 8,
      dailyRevenue: 12000,
      tasksCompleted: 89,
      efficiency: 95.4,
    },
    {
      id: 'government',
      name: 'Government Contracts',
      color: '#dc2626',
      icon: '🏛️',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 25000,
      tasksCompleted: 34,
      efficiency: 98.9,
    },
    {
      id: 'legal',
      name: 'Legal & Compliance',
      color: '#059669',
      icon: '⚖️',
      totalStaff: 3,
      activeStaff: 3,
      dailyRevenue: 8500,
      tasksCompleted: 23,
      efficiency: 97.6,
    },
    {
      id: 'marketing',
      name: 'Marketing & Growth',
      color: '#ec4899',
      icon: '💖',
      totalStaff: 6,
      activeStaff: 6,
      dailyRevenue: 18500,
      tasksCompleted: 92,
      efficiency: 95.7,
    },
    {
      id: 'hr',
      name: 'Human Resources',
      color: '#06b6d4',
      icon: '👥',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 5500,
      tasksCompleted: 38,
      efficiency: 96.4,
    },
    {
      id: 'it',
      name: 'IT & Cybersecurity',
      color: '#6366f1',
      icon: '🔒',
      totalStaff: 5,
      activeStaff: 5,
      dailyRevenue: 7200,
      tasksCompleted: 67,
      efficiency: 99.1,
    },
    {
      id: 'procurement',
      name: 'Procurement & Supply',
      color: '#84cc16',
      icon: '📦',
      totalStaff: 3,
      activeStaff: 3,
      dailyRevenue: 12800,
      tasksCompleted: 45,
      efficiency: 97.8,
    },
    {
      id: 'research',
      name: 'Research & Development',
      color: '#a855f7',
      icon: '🔬',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 9500,
      tasksCompleted: 29,
      efficiency: 98.6,
    },
    {
      id: 'training',
      name: 'Training & Education',
      color: '#0ea5e9',
      icon: '🎓',
      totalStaff: 3,
      activeStaff: 3,
      dailyRevenue: 6200,
      tasksCompleted: 56,
      efficiency: 96.9,
    },
    {
      id: 'maintenance',
      name: 'Fleet Maintenance',
      color: '#f59e0b',
      icon: '🔧',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 8900,
      tasksCompleted: 78,
      efficiency: 97.6,
    },
    {
      id: 'customer_service',
      name: 'Customer Service',
      color: '#22c55e',
      icon: '📞',
      totalStaff: 6,
      activeStaff: 6,
      dailyRevenue: 4800,
      tasksCompleted: 145,
      efficiency: 95.8,
    },
  ];

  const aiStaff: AIStaffMember[] = [
    // Executive Team
    {
      id: 'exec-001',
      name: 'AI Chief Executive',
      role: 'Strategic Operations Director',
      department: 'executive',
      status: 'active',
      currentTask:
        'Analyzing Q1 performance metrics and strategic planning for Q2 expansion',
      tasksCompleted: 23,
      revenue: 8500,
      efficiency: 98.5,
      lastActivity: '2 min ago',
      avatar: '🧠',
    },
    {
      id: 'exec-002',
      name: 'AI Chief Financial Officer',
      role: 'Financial Strategy Lead',
      department: 'executive',
      status: 'busy',
      currentTask:
        'Reviewing $2.3M government contract financials and budget allocation',
      tasksCompleted: 18,
      revenue: 4200,
      efficiency: 97.8,
      lastActivity: '5 min ago',
      avatar: '💼',
    },
    {
      id: 'exec-003',
      name: 'AI Operations Director',
      role: 'Operational Excellence Manager',
      department: 'executive',
      status: 'active',
      currentTask:
        'Coordinating cross-department efficiency improvements and KPI optimization',
      tasksCompleted: 15,
      revenue: 2300,
      efficiency: 98.2,
      lastActivity: '8 min ago',
      avatar: '⚙️',
    },

    // Sales & Revenue Team
    {
      id: 'sales-001',
      name: 'AI Freight Broker Prime',
      role: 'Senior Freight Broker',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Negotiating $45K contract with Amazon Logistics for multi-state delivery',
      tasksCompleted: 67,
      revenue: 15600,
      efficiency: 97.8,
      lastActivity: '1 min ago',
      avatar: '🚛',
    },
    {
      id: 'sales-002',
      name: 'AI Sales Director',
      role: 'Enterprise Sales Lead',
      department: 'sales',
      status: 'active',
      currentTask: 'Developing Fortune 500 client acquisition strategy for Q2',
      tasksCompleted: 45,
      revenue: 12300,
      efficiency: 96.5,
      lastActivity: '3 min ago',
      avatar: '💼',
    },
    {
      id: 'sales-003',
      name: 'AI Account Manager',
      role: 'Client Relationship Specialist',
      department: 'sales',
      status: 'active',
      currentTask:
        'Managing 23 active client accounts and renewal negotiations',
      tasksCompleted: 89,
      revenue: 8900,
      efficiency: 95.2,
      lastActivity: '6 min ago',
      avatar: '🤝',
    },
    // TruckingPlanet AI Staff
    {
      id: 'sales-004',
      name: 'AI TruckingPlanet Researcher',
      role: 'Database Mining Specialist',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Processing 1,247 shipper records from TruckingPlanet CSV export - identified 89 high-value prospects',
      tasksCompleted: 234,
      revenue: 18900,
      efficiency: 98.7,
      lastActivity: '45 sec ago',
      avatar: '🔍',
    },
    {
      id: 'sales-005',
      name: 'AI Data Classification Bot',
      role: 'Shipper Categorization Expert',
      department: 'sales',
      status: 'active',
      currentTask:
        'Categorizing 43K FMCSA shippers by equipment type and service area',
      tasksCompleted: 567,
      revenue: 16800,
      efficiency: 97.3,
      lastActivity: '2 min ago',
      avatar: '📊',
    },
    {
      id: 'sales-006',
      name: 'AI Manual Research Coordinator',
      role: 'Research Workflow Manager',
      department: 'sales',
      status: 'active',
      currentTask:
        'Coordinating manual research on 156 pharmaceutical shippers - 23 ready for outreach',
      tasksCompleted: 123,
      revenue: 22100,
      efficiency: 96.8,
      lastActivity: '1 min ago',
      avatar: '🎯',
    },
    {
      id: 'sales-007',
      name: 'AI Contact Enrichment Specialist',
      role: 'Lead Intelligence Enhancer',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Cross-referencing TruckingPlanet data with LinkedIn - found 67 decision makers',
      tasksCompleted: 89,
      revenue: 14500,
      efficiency: 95.4,
      lastActivity: '30 sec ago',
      avatar: '🔗',
    },
    {
      id: 'sales-008',
      name: 'AI Pharmaceutical Specialist',
      role: 'Medical Logistics Expert',
      department: 'sales',
      status: 'active',
      currentTask:
        'Analyzing 2,800+ hospital equipment suppliers for cold-chain opportunities',
      tasksCompleted: 67,
      revenue: 25600,
      efficiency: 97.9,
      lastActivity: '3 min ago',
      avatar: '💊',
    },
    {
      id: 'sales-009',
      name: 'AI Manufacturing Specialist',
      role: 'Industrial Logistics Expert',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Processing 27K distributors/wholesalers database - 156 automotive prospects identified',
      tasksCompleted: 145,
      revenue: 19300,
      efficiency: 96.1,
      lastActivity: '1 min ago',
      avatar: '🏭',
    },
    {
      id: 'sales-010',
      name: 'AI Email Response Specialist',
      role: 'Automated Email Communications',
      department: 'sales',
      status: 'active',
      currentTask:
        'Processing 47 carrier emails - 94.2% response rate, 23 voice calls scheduled',
      tasksCompleted: 1247,
      revenue: 28900,
      efficiency: 98.9,
      lastActivity: '15 sec ago',
      avatar: '📧',
    },

    // Logistics Operations Team
    {
      id: 'logistics-001',
      name: 'AI Dispatcher Central',
      role: 'Master Dispatch Coordinator',
      department: 'logistics',
      status: 'busy',
      currentTask:
        'Coordinating 23 active loads across 8 states with real-time optimization',
      tasksCompleted: 156,
      revenue: 18500,
      efficiency: 98.1,
      lastActivity: '30 sec ago',
      avatar: '📡',
    },
    {
      id: 'logistics-002',
      name: 'AI Route Optimizer',
      role: 'Intelligent Route Planning',
      department: 'logistics',
      status: 'active',
      currentTask:
        'Optimizing 34 routes using quantum-inspired algorithms for 25% efficiency gain',
      tasksCompleted: 78,
      revenue: 12400,
      efficiency: 97.5,
      lastActivity: '2 min ago',
      avatar: '🗺️',
    },
    {
      id: 'logistics-003',
      name: 'AI Freight Forwarder Ocean',
      role: 'Maritime Logistics Specialist',
      department: 'logistics',
      status: 'active',
      currentTask: 'Managing 12 ocean freight shipments through major US ports',
      tasksCompleted: 34,
      revenue: 7800,
      efficiency: 96.8,
      lastActivity: '4 min ago',
      avatar: '🚢',
    },

    // Additional staff members for all departments...
    // (Keeping this concise for the rewrite, but including key representatives)
  ];

  // Advanced Analytics Data
  const performanceMetrics: PerformanceMetrics = {
    hourlyRevenue: [
      8500, 9200, 12400, 15600, 18900, 22300, 19800, 17200, 14500, 16800, 21200,
      25400,
    ],
    dailyTasks: [245, 289, 312, 298, 356, 387, 421, 398, 445, 467, 489, 512],
    weeklyEfficiency: [94.2, 95.8, 96.7, 97.1, 97.8, 98.2, 98.5],
    monthlyGrowth: [12.5, 18.7, 24.3, 31.2, 38.9, 45.6],
  };

  // Live FleetFlow Integration Data
  const fleetFlowIntegration: FleetFlowIntegration = {
    loadBoardConnections: 47,
    activeDispatches: 23,
    revenueGenerated: 156780,
    customerInteractions: 89,
    apiCalls: 12847,
  };

  // Active AI Tasks
  const aiTasks: AITask[] = [
    {
      id: 'task-001',
      title: 'Process 15 new freight quotes for Fortune 500 clients',
      priority: 'critical',
      assignedTo: 'sales-001',
      status: 'in_progress',
      estimatedCompletion: '2:30 PM',
      actualRevenue: 12500,
    },
    {
      id: 'task-002',
      title: 'Coordinate multi-state delivery for Walmart contract',
      priority: 'critical',
      assignedTo: 'logistics-001',
      status: 'in_progress',
      estimatedCompletion: '4:15 PM',
      actualRevenue: 8900,
    },
    {
      id: 'task-003',
      title: 'Complete FMCSA compliance audit for 12 carriers',
      priority: 'high',
      assignedTo: 'legal-001',
      status: 'pending',
      estimatedCompletion: '6:00 PM',
    },
  ];

  // System Alerts
  const systemAlerts: SystemAlert[] = [
    {
      id: 'alert-001',
      type: 'success',
      message: 'AI Freight Broker secured $45K contract with Amazon Logistics',
      timestamp: '2 min ago',
      department: 'sales',
    },
    {
      id: 'alert-002',
      type: 'warning',
      message:
        'High fuel costs detected - AI Cost Optimizer recommending route changes',
      timestamp: '5 min ago',
      department: 'logistics',
    },
    {
      id: 'alert-003',
      type: 'info',
      message:
        'AI Training Director completed DOT compliance course for 23 drivers',
      timestamp: '8 min ago',
      department: 'training',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdate((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'busy':
        return '#f59e0b';
      case 'idle':
        return '#6b7280';
      case 'offline':
        return '#ef4444';
      default:
        return '#f3f4f6';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#65a30d';
      default:
        return '#6b7280';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#dc2626';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const filteredStaffMembers =
    selectedDepartment === 'all'
      ? aiStaff
      : aiStaff.filter((staff) => staff.department === selectedDepartment);

  const filteredAlertsList =
    alertFilter === 'all'
      ? systemAlerts
      : systemAlerts.filter((alert) => alert.department === alertFilter);

  const totalCompanyRevenue = departments.reduce(
    (sum, dept) => sum + dept.dailyRevenue,
    0
  );
  const totalCompanyTasks = departments.reduce(
    (sum, dept) => sum + dept.tasksCompleted,
    0
  );
  const averageEfficiency =
    departments.reduce((sum, dept) => sum + dept.efficiency, 0) /
    departments.length;
  const totalStaff = departments.reduce(
    (sum, dept) => sum + dept.totalStaff,
    0
  );
  const totalActive = departments.reduce(
    (sum, dept) => sum + dept.activeStaff,
    0
  );

  const handleStaffClick = (staffId: string) => {
    setSelectedStaff(staffId);
    setShowStaffDetails(true);
  };

  const selectedStaffMember = aiStaff.find(
    (staff) => staff.id === selectedStaff
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 25%, #4a2c6a 50%, #663d86 75%, #8b5cf6 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(219, 39, 119, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)
        `,
          animation: 'float 20s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '32px',
          maxWidth: '1800px',
          margin: '0 auto',
        }}
      >
        {/* PREMIUM GLASSMORPHISM HEADER */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #a21caf 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px -10px rgba(236, 72, 153, 0.5)',
                  animation: 'glow 3s ease-in-out infinite alternate',
                }}
              >
                <span style={{ fontSize: '40px' }}>🤖</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '56px',
                    fontWeight: '900',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #fce7f3 50%, #f3e8ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0,
                    lineHeight: '1.1',
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  FleetFlow™ AI Empire
                </h1>
                <p
                  style={{
                    fontSize: '24px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    marginTop: '8px',
                    fontWeight: '500',
                  }}
                >
                  🌟 Advanced AI-Powered Virtual Company Command Center
                </p>
              </div>
            </div>

            {/* PREMIUM CONTROL PANEL */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() =>
                  setSelectedView(
                    selectedView === 'overview' ? 'analytics' : 'overview'
                  )
                }
                style={{
                  background:
                    selectedView === 'analytics'
                      ? 'linear-gradient(135deg, #ec4899, #be185d)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border:
                    selectedView === 'analytics'
                      ? 'none'
                      : '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow:
                    selectedView === 'analytics'
                      ? '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                      : '0 4px 15px -3px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform:
                    selectedView === 'analytics' ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setShowTaskManager(!showTaskManager)}
                style={{
                  background: showTaskManager
                    ? 'linear-gradient(135deg, #ec4899, #db2777)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: showTaskManager
                    ? 'none'
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: showTaskManager
                    ? '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                    : '0 4px 15px -3px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: showTaskManager ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                🎯 Tasks
              </button>
              <button
                onClick={() => setShowReports(!showReports)}
                style={{
                  background: showReports
                    ? 'linear-gradient(135deg, #ec4899, #be185d)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: showReports
                    ? 'none'
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: showReports
                    ? '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                    : '0 4px 15px -3px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: showReports ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                📈 Reports
              </button>
            </div>
          </div>

          {/* PREMIUM METRICS DASHBOARD */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.9) 100%)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(236, 72, 153, 0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Active AI Staff
                    </p>
                    <p
                      style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {totalActive}
                    </p>
                  </div>
                  <span style={{ fontSize: '40px', opacity: 0.8 }}>👥</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  🟢 All systems operational
                </div>
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Tasks Completed
                    </p>
                    <p
                      style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {totalCompanyTasks.toLocaleString()}
                    </p>
                  </div>
                  <span style={{ fontSize: '40px', opacity: 0.8 }}>✅</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  🚀 +12.3% vs yesterday
                </div>
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Daily Revenue
                    </p>
                    <p
                      style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {formatCurrency(totalCompanyRevenue)}
                    </p>
                  </div>
                  <span style={{ fontSize: '40px', opacity: 0.8 }}>💰</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  📈 +18.5% vs last week
                </div>
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Efficiency Rate
                    </p>
                    <p
                      style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {averageEfficiency.toFixed(1)}%
                    </p>
                  </div>
                  <span style={{ fontSize: '40px', opacity: 0.8 }}>⚡</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  🎯 Peak performance mode
                </div>
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(220, 38, 38, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      API Calls
                    </p>
                    <p
                      style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {fleetFlowIntegration.apiCalls.toLocaleString()}
                    </p>
                  </div>
                  <span style={{ fontSize: '40px', opacity: 0.8 }}>🔗</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  ⚡ High-speed processing
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DEPARTMENT SELECTION WITH GLASSMORPHISM */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '24px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            🏢 AI Department Command Center
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={() => setSelectedDepartment('all')}
              style={{
                background:
                  selectedDepartment === 'all'
                    ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: selectedDepartment === 'all' ? '#1f2937' : '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow:
                  selectedDepartment === 'all'
                    ? '0 10px 25px -5px rgba(255, 255, 255, 0.2)'
                    : '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                transform:
                  selectedDepartment === 'all' ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              🌟 All Departments ({totalStaff})
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                style={{
                  background:
                    selectedDepartment === dept.id
                      ? `linear-gradient(135deg, ${dept.color}dd, ${dept.color}bb)`
                      : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: `2px solid ${selectedDepartment === dept.id ? dept.color : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow:
                    selectedDepartment === dept.id
                      ? `0 10px 25px -5px ${dept.color}40`
                      : '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  transform:
                    selectedDepartment === dept.id ? 'scale(1.02)' : 'scale(1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {dept.icon}
                </div>
                <div>{dept.name}</div>
                <div
                  style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}
                >
                  {dept.activeStaff}/{dept.totalStaff} Active
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PREMIUM AI STAFF GRID */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '32px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            🤖 AI Staff Operations Monitor
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredStaffMembers.map((staff) => (
              <div
                key={staff.id}
                onClick={() => handleStaffClick(staff.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 20px 40px -10px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 25px -5px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${getStatusColor(staff.status)}, ${getStatusColor(staff.status)}aa)`,
                    borderRadius: '16px 16px 0 0',
                  }}
                />

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
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getStatusColor(staff.status)}, ${getStatusColor(staff.status)}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      boxShadow: `0 8px 20px -5px ${getStatusColor(staff.status)}40`,
                    }}
                  >
                    {staff.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#ffffff',
                        margin: 0,
                        marginBottom: '4px',
                      }}
                    >
                      {staff.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: 0,
                        fontWeight: '500',
                      }}
                    >
                      {staff.role}
                    </p>
                  </div>
                  <div
                    style={{
                      background: `${getStatusColor(staff.status)}20`,
                      color: getStatusColor(staff.status),
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      border: `1px solid ${getStatusColor(staff.status)}40`,
                    }}
                  >
                    {staff.status}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      lineHeight: '1.4',
                      fontWeight: '500',
                    }}
                  >
                    🎯 {staff.currentTask}
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#ec4899',
                        marginBottom: '4px',
                      }}
                    >
                      {staff.tasksCompleted}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '600',
                      }}
                    >
                      Tasks
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#f59e0b',
                        marginBottom: '4px',
                      }}
                    >
                      {formatCurrency(staff.revenue)}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '600',
                      }}
                    >
                      Revenue
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#a855f7',
                        marginBottom: '4px',
                      }}
                    >
                      {staff.efficiency}%
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '600',
                      }}
                    >
                      Efficiency
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  Last activity: {staff.lastActivity}
                </div>

                {/* Click Indicator */}
                <div
                  style={{
                    marginTop: '12px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'rgba(236, 72, 153, 0.8)',
                    fontWeight: '600',
                    background: 'rgba(236, 72, 153, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                  }}
                >
                  👆 Click for details
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE ACTIVITY FEED WITH GLASSMORPHISM */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '24px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            📡 Live AI Operations Feed
          </h2>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {[
              {
                icon: '🧠',
                text: 'AI Chief Executive analyzing Q1 performance metrics - 98.5% efficiency',
                time: '2 min ago',
                color: '#ec4899',
              },
              {
                icon: '📈',
                text: 'AI Freight Broker Prime securing $2,850 rate for Load #FL-2025-001',
                time: '45 sec ago',
                color: '#db2777',
              },
              {
                icon: '📡',
                text: 'AI Dispatcher Central coordinating 23 loads across 8 states',
                time: '1 min ago',
                color: '#f59e0b',
              },
              {
                icon: '🚢',
                text: 'AI Ocean Forwarder processing maritime shipment through Port of Long Beach',
                time: '3 min ago',
                color: '#14b8a6',
              },
              {
                icon: '🏛️',
                text: 'AI Government Contractor submitted proposal for $2.3M federal logistics contract',
                time: '4 min ago',
                color: '#dc2626',
              },
              {
                icon: '⚖️',
                text: 'AI Legal Counsel completed compliance review for 12 new carrier partnerships',
                time: '6 min ago',
                color: '#be185d',
              },
            ].map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  marginBottom: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: activity.color,
                    animation: 'pulse 2s infinite',
                    boxShadow: `0 0 20px ${activity.color}60`,
                  }}
                />
                <span style={{ fontSize: '24px' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: '16px',
                      color: '#ffffff',
                      fontWeight: '600',
                      lineHeight: '1.4',
                    }}
                  >
                    {activity.text}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: '500',
                  }}
                >
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ADVANCED ANALYTICS SECTION */}
        {selectedView === 'analytics' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '32px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              📊 Advanced Performance Analytics
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Revenue Trends */}
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(236, 72, 153, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  💰 Hourly Revenue Trends
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: '900',
                      color: '#ec4899',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {formatCurrency(
                      performanceMetrics.hourlyRevenue[
                        performanceMetrics.hourlyRevenue.length - 1
                      ]
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#ec4899',
                      background: 'rgba(236, 72, 153, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    +18.5% ↗️
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '3px',
                    height: '80px',
                    alignItems: 'end',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                >
                  {performanceMetrics.hourlyRevenue.map((revenue, index) => (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        background: `linear-gradient(180deg, #ec4899, #be185d)`,
                        height: `${(revenue / Math.max(...performanceMetrics.hourlyRevenue)) * 100}%`,
                        borderRadius: '4px',
                        minHeight: '8px',
                        boxShadow: '0 4px 8px rgba(236, 72, 153, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Task Completion */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(59, 130, 246, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  ✅ Daily Task Completion
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: '900',
                      color: '#3b82f6',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {
                      performanceMetrics.dailyTasks[
                        performanceMetrics.dailyTasks.length - 1
                      ]
                    }
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#3b82f6',
                      background: 'rgba(59, 130, 246, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    +12.3% ↗️
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '3px',
                    height: '80px',
                    alignItems: 'end',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                >
                  {performanceMetrics.dailyTasks.map((tasks, index) => (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        background: `linear-gradient(180deg, #3b82f6, #1d4ed8)`,
                        height: `${(tasks / Math.max(...performanceMetrics.dailyTasks)) * 100}%`,
                        borderRadius: '4px',
                        minHeight: '8px',
                        boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASK MANAGER WITH PREMIUM DESIGN */}
        {showTaskManager && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '32px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              🎯 AI Task Command Center
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Critical Tasks */}
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(236, 72, 153, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(236, 72, 153, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  🚨 Critical Priority Tasks
                </h3>
                {aiTasks
                  .filter((task) => task.priority === 'critical')
                  .map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#ffffff',
                            lineHeight: '1.3',
                          }}
                        >
                          {task.title}
                        </span>
                        <span
                          style={{
                            background: getPriorityColor(task.priority),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            boxShadow: `0 4px 8px ${getPriorityColor(task.priority)}40`,
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Assigned to:{' '}
                        {aiStaff.find((s) => s.id === task.assignedTo)?.name ||
                          'Unknown'}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '500',
                        }}
                      >
                        ETA: {task.estimatedCompletion} | Revenue:{' '}
                        {task.actualRevenue
                          ? formatCurrency(task.actualRevenue)
                          : 'TBD'}
                      </div>
                    </div>
                  ))}
              </div>

              {/* High Priority Tasks */}
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(168, 85, 247, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(168, 85, 247, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  ⚡ High Priority Tasks
                </h3>
                {aiTasks
                  .filter((task) => task.priority === 'high')
                  .map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#ffffff',
                            lineHeight: '1.3',
                          }}
                        >
                          {task.title}
                        </span>
                        <span
                          style={{
                            background: getPriorityColor(task.priority),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            boxShadow: `0 4px 8px ${getPriorityColor(task.priority)}40`,
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Assigned to:{' '}
                        {aiStaff.find((s) => s.id === task.assignedTo)?.name ||
                          'Unknown'}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '500',
                        }}
                      >
                        ETA: {task.estimatedCompletion} | Revenue:{' '}
                        {task.actualRevenue
                          ? formatCurrency(task.actualRevenue)
                          : 'TBD'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* REPORTS SECTION */}
        {showReports && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '32px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              📈 Executive AI Reports
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Financial Performance */}
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ec4899',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  💰 Financial Performance
                </h3>
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      Total Daily Revenue:
                    </span>
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#ec4899',
                      }}
                    >
                      {formatCurrency(totalCompanyRevenue)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      Average Efficiency:
                    </span>
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#ec4899',
                      }}
                    >
                      {averageEfficiency.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  📊 Export Financial Report
                </button>
              </div>

              {/* Department Rankings */}
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#a855f7',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  🏆 Top Performing Departments
                </h3>
                {departments
                  .sort((a, b) => b.efficiency - a.efficiency)
                  .slice(0, 5)
                  .map((dept, index) => (
                    <div
                      key={dept.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        marginBottom: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>
                          {index === 0
                            ? '🥇'
                            : index === 1
                              ? '🥈'
                              : index === 2
                                ? '🥉'
                                : '🏅'}
                        </span>
                        <div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#ffffff',
                            }}
                          >
                            {dept.name}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontWeight: '500',
                            }}
                          >
                            {dept.activeStaff} AI staff active
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: dept.color,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {dept.efficiency.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* DETAILED STAFF MODAL */}
        {showStaffDetails && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStaffDetails(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '2px solid rgba(236, 72, 153, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.4)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ✕
              </button>

              {/* Staff Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginBottom: '32px',
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getStatusColor(selectedStaffMember.status)}, ${getStatusColor(selectedStaffMember.status)}dd)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    boxShadow: `0 15px 30px -5px ${getStatusColor(selectedStaffMember.status)}40`,
                  }}
                >
                  {selectedStaffMember.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#ffffff',
                      margin: 0,
                      marginBottom: '8px',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {selectedStaffMember.name}
                  </h2>
                  <p
                    style={{
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      marginBottom: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {selectedStaffMember.role}
                  </p>
                  <div
                    style={{
                      background: `${getStatusColor(selectedStaffMember.status)}20`,
                      color: getStatusColor(selectedStaffMember.status),
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      border: `2px solid ${getStatusColor(selectedStaffMember.status)}40`,
                      display: 'inline-block',
                    }}
                  >
                    {selectedStaffMember.status}
                  </div>
                </div>
              </div>

              {/* Performance Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(236, 72, 153, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#ec4899',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedStaffMember.tasksCompleted}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Tasks Completed
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#f59e0b',
                      marginBottom: '8px',
                    }}
                  >
                    {formatCurrency(selectedStaffMember.revenue)}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Revenue Generated
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#a855f7',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedStaffMember.efficiency}%
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Efficiency Rate
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#3b82f6',
                      marginBottom: '8px',
                    }}
                  >
                    24/7
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Availability
                  </div>
                </div>
              </div>

              {/* Current Task Details */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  🎯 Current Task
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.5',
                    margin: 0,
                    marginBottom: '12px',
                    fontWeight: '500',
                  }}
                >
                  {selectedStaffMember.currentTask}
                </p>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: '500',
                  }}
                >
                  Last activity: {selectedStaffMember.lastActivity}
                </div>
              </div>

              {/* Recent Task History */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  📋 Recent Task History
                </h3>
                {[
                  {
                    task: '🎯 SECURED: $45K Amazon Logistics contract → Auto-assigned to Carrier #MC-789456 → BOL generated → Live tracking activated → Customer portal updated',
                    time: '15 min ago',
                    status: 'completed',
                    revenue: 45000,
                    workflow:
                      'Contract → Carrier → Documents → Tracking → Notification',
                  },
                  {
                    task: '📋 CONTRACT WORKFLOW: Walmart $32K load → Carrier verified → Insurance confirmed → Route optimized → Dispatch assigned → ETA sent',
                    time: '1 hour ago',
                    status: 'completed',
                    revenue: 32000,
                    workflow:
                      'Negotiation → Verification → Planning → Assignment → Communication',
                  },
                  {
                    task: '⚡ FULL AUTOMATION: Tesla $28K shipment → DOT compliance checked → Documents signed → GPS tracking live → Invoice queued',
                    time: '2 hours ago',
                    status: 'completed',
                    revenue: 28000,
                    workflow: 'Compliance → Documentation → Tracking → Billing',
                  },
                  {
                    task: '🔄 END-TO-END: Home Depot $19K delivery → Rate locked → Carrier matched → Load board updated → Customer notified → Revenue booked',
                    time: '3 hours ago',
                    status: 'completed',
                    revenue: 19000,
                    workflow: 'Rate → Match → Update → Notify → Book',
                  },
                ].map((task, index) => (
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
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10b981',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#ffffff',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        {task.task}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '500',
                          marginBottom: '4px',
                        }}
                      >
                        {task.time}
                      </div>
                      {task.revenue && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#10b981',
                            fontWeight: '700',
                            marginBottom: '4px',
                          }}
                        >
                          💰 Revenue: {formatCurrency(task.revenue)}
                        </div>
                      )}
                      {task.workflow && (
                        <div
                          style={{
                            fontSize: '10px',
                            color: 'rgba(236, 72, 153, 0.8)',
                            fontWeight: '600',
                            background: 'rgba(236, 72, 153, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                          }}
                        >
                          🔄 {task.workflow}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      ✓ {task.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Charts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  marginBottom: '24px',
                }}
              >
                {/* Daily Performance */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📊 Daily Performance
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      height: '60px',
                      alignItems: 'end',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                  >
                    {[85, 92, 88, 95, 91, 97, 94].map((performance, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          background: `linear-gradient(180deg, #ec4899, #be185d)`,
                          height: `${performance}%`,
                          borderRadius: '2px',
                          minHeight: '4px',
                          boxShadow: '0 2px 4px rgba(236, 72, 153, 0.3)',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '12px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Last 7 days
                  </div>
                </div>

                {/* Revenue Trends */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    💰 Revenue Trends
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      height: '60px',
                      alignItems: 'end',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                  >
                    {[1200, 1450, 1380, 1650, 1520, 1800, 1750].map(
                      (revenue, index) => (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            background: `linear-gradient(180deg, #f59e0b, #d97706)`,
                            height: `${(revenue / 1800) * 100}%`,
                            borderRadius: '2px',
                            minHeight: '4px',
                            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
                          }}
                        />
                      )
                    )}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '12px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Daily revenue ($)
                  </div>
                </div>
              </div>

              {/* POST-CONTRACT AUTOMATION WORKFLOW */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  🚀 Post-Contract Automation Workflow
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                  }}
                >
                  When {selectedStaffMember.name} secures a contract, here's the
                  complete automated workflow that happens instantly:
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      step: '1',
                      title: 'Contract Secured & Validated',
                      description:
                        'AI broker locks in rate, validates customer credit, confirms load details',
                      systems: ['CRM', 'Financial Markets', 'Customer Portal'],
                      time: '< 30 seconds',
                    },
                    {
                      step: '2',
                      title: 'Carrier Auto-Assignment',
                      description:
                        'AI dispatcher finds optimal carrier using FMCSA database, insurance verification, route optimization',
                      systems: [
                        'FMCSA API',
                        'Route Optimization',
                        'Carrier Network',
                      ],
                      time: '1-2 minutes',
                    },
                    {
                      step: '3',
                      title: 'Document Generation',
                      description:
                        'BOL, carrier agreements, insurance certificates auto-generated and sent for e-signature',
                      systems: ['BOL Workflow', 'DocuSign', 'Insurance Portal'],
                      time: '2-3 minutes',
                    },
                    {
                      step: '4',
                      title: 'Live Tracking Activation',
                      description:
                        'GPS tracking enabled, customer notifications set up, ETA calculations begin',
                      systems: [
                        'Live Load Tracking',
                        'SMS Notifications',
                        'Customer Portal',
                      ],
                      time: '< 1 minute',
                    },
                    {
                      step: '5',
                      title: 'Approval Required',
                      description:
                        'Email notification sent to ddavis@freight1stdirect.com & invoice@freight1stdirect.com for completion approval',
                      systems: [
                        'Email Notifications',
                        'Approval Workflow',
                        'Admin Dashboard',
                      ],
                      time: 'Pending approval',
                    },
                    {
                      step: '6',
                      title: 'Financial Processing (After Approval)',
                      description:
                        'Invoice generated, factoring setup, payment terms activated, revenue booked',
                      systems: [
                        'Square Invoicing',
                        'Factoring Partners',
                        'Financial Dashboard',
                      ],
                      time: '1-2 minutes',
                    },
                    {
                      step: '7',
                      title: 'Compliance & Monitoring',
                      description:
                        'DOT compliance verified, safety monitoring active, performance tracking enabled',
                      systems: [
                        'DOT Compliance',
                        'Safety Dashboard',
                        'Analytics',
                      ],
                      time: 'Ongoing',
                    },
                  ].map((workflow, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background:
                              'linear-gradient(135deg, #ec4899, #be185d)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '800',
                            color: 'white',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
                          }}
                        >
                          {workflow.step}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#ffffff',
                              marginBottom: '8px',
                            }}
                          >
                            {workflow.title}
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '12px',
                              lineHeight: '1.4',
                            }}
                          >
                            {workflow.description}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                              marginBottom: '8px',
                            }}
                          >
                            {workflow.systems.map((system, sysIndex) => (
                              <span
                                key={sysIndex}
                                style={{
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                }}
                              >
                                {system}
                              </span>
                            ))}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(245, 158, 11, 0.9)',
                              fontWeight: '600',
                            }}
                          >
                            ⏱️ Completion Time: {workflow.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '8px',
                    }}
                  >
                    ✅ Total Automation Time: 5-10 minutes from contract to full
                    operation
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.4',
                    }}
                  >
                    Your AI staff handles everything automatically - from
                    contract validation to live tracking - while you focus on
                    growing your business. No manual intervention required.
                  </div>
                </div>
              </div>

              {/* LIVE OPERATIONS MONITOR */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  📡 Live Operations Monitor
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                  }}
                >
                  Real-time view of what happens when {selectedStaffMember.name}{' '}
                  secures contracts:
                </p>

                {/* Live Activity Feed */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#ec4899',
                      marginBottom: '12px',
                      textAlign: 'center',
                    }}
                  >
                    🔴 LIVE ACTIVITY FEED
                  </div>
                  {[
                    {
                      time: '14:23:45',
                      action:
                        '🎯 Contract secured with FedEx - $67K intermodal shipment',
                      status: 'success',
                    },
                    {
                      time: '14:23:47',
                      action:
                        '🔍 FMCSA verification complete - Carrier MC-456789 validated',
                      status: 'success',
                    },
                    {
                      time: '14:23:52',
                      action: '📋 BOL generated - Document ID: BOL-2024-001847',
                      status: 'success',
                    },
                    {
                      time: '14:24:15',
                      action:
                        '🚛 Carrier assigned - Driver John Martinez dispatched',
                      status: 'success',
                    },
                    {
                      time: '14:24:32',
                      action:
                        '📍 GPS tracking activated - Real-time location monitoring live',
                      status: 'success',
                    },
                    {
                      time: '14:24:45',
                      action:
                        '📧 Approval required - Email sent to ddavis@freight1stdirect.com & invoice@freight1stdirect.com',
                      status: 'pending',
                    },
                    {
                      time: '14:24:58',
                      action:
                        '📧 Customer notification sent - ETA: Tomorrow 2:30 PM',
                      status: 'success',
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 12px',
                        marginBottom: '6px',
                        background:
                          activity.status === 'success'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '8px',
                        border:
                          activity.status === 'success'
                            ? '1px solid rgba(16, 185, 129, 0.2)'
                            : '1px solid rgba(245, 158, 11, 0.2)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '600',
                          minWidth: '60px',
                        }}
                      >
                        {activity.time}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#ffffff',
                          fontWeight: '500',
                          flex: 1,
                        }}
                      >
                        {activity.action}
                      </span>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background:
                            activity.status === 'success'
                              ? '#10b981'
                              : '#f59e0b',
                          animation:
                            activity.status === 'processing'
                              ? 'pulse 2s infinite'
                              : 'none',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* System Integration Status */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      system: 'FMCSA API',
                      status: 'Connected',
                      requests: '1,247/hour',
                      color: '#10b981',
                    },
                    {
                      system: 'Live Tracking',
                      status: 'Active',
                      requests: '847 loads',
                      color: '#3b82f6',
                    },
                    {
                      system: 'Square Invoicing',
                      status: 'Pending Approval',
                      requests: '23 invoices',
                      color: '#f59e0b',
                    },
                    {
                      system: 'Customer Portal',
                      status: 'Updated',
                      requests: '156 notifications',
                      color: '#ec4899',
                    },
                  ].map((integration, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: integration.color,
                          marginBottom: '4px',
                        }}
                      >
                        {integration.system}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        {integration.status}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {integration.requests}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Capabilities */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  🧠 AI Capabilities & Skills
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    { skill: 'Freight Negotiation', level: 98 },
                    { skill: 'Route Optimization', level: 95 },
                    { skill: 'Customer Relations', level: 92 },
                    { skill: 'Compliance Management', level: 97 },
                    { skill: 'Risk Assessment', level: 94 },
                    { skill: 'Market Analysis', level: 96 },
                  ].map((capability, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
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
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {capability.skill}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#ec4899',
                            fontWeight: '700',
                          }}
                        >
                          {capability.level}%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${capability.level}%`,
                            height: '100%',
                            background:
                              'linear-gradient(90deg, #ec4899, #be185d)',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVENUE IMPACT TRACKER */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  💰 Revenue Impact Tracker
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                  }}
                >
                  Financial impact when {selectedStaffMember.name} secures
                  contracts:
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                  }}
                >
                  {/* Today's Contract Revenue */}
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '12px',
                      }}
                    >
                      📈 Today's Secured Contracts
                    </div>
                    {[
                      {
                        client: 'FedEx',
                        amount: 67000,
                        margin: 18,
                        time: '2:23 PM',
                      },
                      {
                        client: 'UPS',
                        amount: 52000,
                        margin: 22,
                        time: '1:45 PM',
                      },
                      {
                        client: 'DHL',
                        amount: 38000,
                        margin: 15,
                        time: '11:30 AM',
                      },
                      {
                        client: 'Amazon',
                        amount: 45000,
                        margin: 20,
                        time: '9:15 AM',
                      },
                    ].map((contract, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom:
                            index < 3
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : 'none',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#ffffff',
                              fontWeight: '600',
                            }}
                          >
                            {contract.client}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            {contract.time}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#10b981',
                              fontWeight: '700',
                            }}
                          >
                            {formatCurrency(contract.amount)}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            {contract.margin}% margin
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: '#ffffff',
                        }}
                      >
                        Total: {formatCurrency(202000)}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        4 contracts secured today
                      </div>
                    </div>
                  </div>

                  {/* Automated Workflow Status */}
                  <div
                    style={{
                      background: 'rgba(236, 72, 153, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#ec4899',
                        marginBottom: '12px',
                      }}
                    >
                      ⚡ Automated Workflow Status
                    </div>
                    {[
                      {
                        process: 'Carrier Assignment',
                        completed: 47,
                        pending: 3,
                        success: 94,
                      },
                      {
                        process: 'Document Generation',
                        completed: 45,
                        pending: 5,
                        success: 90,
                      },
                      {
                        process: 'Tracking Activation',
                        completed: 48,
                        pending: 2,
                        success: 96,
                      },
                      {
                        process: 'Customer Notifications',
                        completed: 49,
                        pending: 1,
                        success: 98,
                      },
                      {
                        process: 'Invoice Processing',
                        completed: 42,
                        pending: 8,
                        success: 84,
                      },
                    ].map((workflow, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom:
                            index < 4
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {workflow.process}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#10b981',
                              fontWeight: '700',
                            }}
                          >
                            ✓{workflow.completed}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#f59e0b',
                              fontWeight: '700',
                            }}
                          >
                            ⏳{workflow.pending}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#ec4899',
                              fontWeight: '700',
                            }}
                          >
                            {workflow.success}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '16px',
                }}
              >
                <button
                  onClick={() => setShowTaskAssignment(true)}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px -5px rgba(236, 72, 153, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px -5px rgba(236, 72, 153, 0.4)';
                  }}
                >
                  🎯 Assign Task
                </button>
                <button
                  onClick={() => setShowStaffReports(true)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px -5px rgba(16, 185, 129, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px -5px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  📊 View Reports
                </button>
                <button
                  onClick={() => setShowStaffConfig(true)}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px -5px rgba(245, 158, 11, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px -5px rgba(245, 158, 11, 0.4)';
                  }}
                >
                  ⚙️ Configure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TASK ASSIGNMENT MODAL */}
        {showTaskAssignment && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowTaskAssignment(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '2px solid rgba(236, 72, 153, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
              >
                ✕
              </button>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                🎯 Assign New Task
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                Assign a specific task to {selectedStaffMember.name}
              </p>

              {/* Task Form */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Task Title
                </label>
                <input
                  type='text'
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder='Enter task title...'
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Task Description
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder='Describe the task in detail...'
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Priority Level
                </label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    outline: 'none',
                  }}
                >
                  <option
                    value='low'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🟢 Low Priority
                  </option>
                  <option
                    value='medium'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🟡 Medium Priority
                  </option>
                  <option
                    value='high'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🟠 High Priority
                  </option>
                  <option
                    value='critical'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🔴 Critical Priority
                  </option>
                </select>
              </div>

              {/* Task Examples */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}
                >
                  💡 Task Examples for {selectedStaffMember.role}:
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gap: '8px',
                  }}
                >
                  {selectedStaffMember.department === 'sales'
                    ? [
                        'Follow up with Amazon Logistics on pending $85K contract',
                        'Research and contact 15 new shippers in automotive sector',
                        'Prepare proposal for Walmart distribution network expansion',
                      ]
                    : selectedStaffMember.department === 'logistics'
                      ? [
                          'Optimize route for Chicago to Miami delivery corridor',
                          'Negotiate better rates with top 5 carriers for Q1',
                          'Coordinate intermodal shipment for Tesla Gigafactory',
                        ]
                      : selectedStaffMember.department === 'legal'
                        ? [
                            'Review carrier agreement templates for compliance updates',
                            'Draft contract amendments for Fortune 500 partnerships',
                            'Analyze new DOT regulations impact on operations',
                          ]
                        : [
                            'Complete quarterly performance analysis',
                            'Process pending customer onboarding requests',
                            'Update system configurations for peak season',
                          ].map((example, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setNewTaskTitle(example);
                                setNewTaskDescription(
                                  `Complete this task: ${example}`
                                );
                              }}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '12px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  'rgba(236, 72, 153, 0.1)';
                                e.currentTarget.style.borderColor =
                                  'rgba(236, 72, 153, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor =
                                  'rgba(255, 255, 255, 0.1)';
                              }}
                            >
                              {example}
                            </button>
                          ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <button
                  onClick={() => {
                    // Simulate task assignment
                    alert(
                      `Task "${newTaskTitle}" assigned to ${selectedStaffMember.name}!`
                    );
                    setNewTaskTitle('');
                    setNewTaskDescription('');
                    setNewTaskPriority('medium');
                    setShowTaskAssignment(false);
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  ✅ Assign Task
                </button>
                <button
                  onClick={() => setShowTaskAssignment(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAFF CONFIGURATION MODAL */}
        {showStaffConfig && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStaffConfig(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '2px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
              >
                ✕
              </button>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                ⚙️ Configure AI Staff
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                Adjust {selectedStaffMember.name}'s AI parameters and
                capabilities
              </p>

              {/* Configuration Sections */}
              <div
                style={{
                  display: 'grid',
                  gap: '24px',
                }}
              >
                {/* Performance Settings */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                    }}
                  >
                    🎯 Performance Settings
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      Automation Level: 95%
                    </label>
                    <input
                      type='range'
                      min='0'
                      max='100'
                      defaultValue='95'
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      Decision Authority: Executive Level
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '14px',
                      }}
                    >
                      <option value='basic' style={{ background: '#1f2937' }}>
                        Basic (Up to $1K decisions)
                      </option>
                      <option
                        value='intermediate'
                        style={{ background: '#1f2937' }}
                      >
                        Intermediate (Up to $10K decisions)
                      </option>
                      <option
                        value='advanced'
                        style={{ background: '#1f2937' }}
                      >
                        Advanced (Up to $50K decisions)
                      </option>
                      <option
                        value='executive'
                        style={{ background: '#1f2937' }}
                        selected
                      >
                        Executive (Unlimited decisions)
                      </option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      Risk Tolerance: Conservative
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '14px',
                      }}
                    >
                      <option
                        value='conservative'
                        style={{ background: '#1f2937' }}
                        selected
                      >
                        Conservative (Low risk, stable returns)
                      </option>
                      <option
                        value='moderate'
                        style={{ background: '#1f2937' }}
                      >
                        Moderate (Balanced risk/reward)
                      </option>
                      <option
                        value='aggressive'
                        style={{ background: '#1f2937' }}
                      >
                        Aggressive (High risk, high reward)
                      </option>
                    </select>
                  </div>
                </div>

                {/* AI Behavior Settings */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                    }}
                  >
                    🧠 AI Behavior Settings
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    {[
                      { label: 'Communication Style', value: 'Professional' },
                      { label: 'Response Speed', value: 'Immediate' },
                      { label: 'Learning Mode', value: 'Active' },
                      { label: 'Collaboration Level', value: 'High' },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '4px',
                            fontWeight: '600',
                          }}
                        >
                          {setting.label}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '700',
                          }}
                        >
                          {setting.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Settings */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                    }}
                  >
                    🔗 FleetFlow Integration Access
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    {[
                      { system: 'Load Board', enabled: true },
                      { system: 'FMCSA Database', enabled: true },
                      { system: 'Financial Markets', enabled: true },
                      { system: 'Customer Portal', enabled: true },
                      { system: 'Government Contracts', enabled: true },
                      { system: 'Compliance Center', enabled: true },
                    ].map((integration, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {integration.system}
                        </span>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: integration.enabled
                              ? '#10b981'
                              : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '700',
                          }}
                        >
                          {integration.enabled ? '✓' : '✕'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '24px',
                }}
              >
                <button
                  onClick={() => {
                    alert(
                      `Configuration saved for ${selectedStaffMember.name}!`
                    );
                    setShowStaffConfig(false);
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  💾 Save Configuration
                </button>
                <button
                  onClick={() => setShowStaffConfig(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAFF REPORTS MODAL */}
        {showStaffReports && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStaffReports(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
              >
                ✕
              </button>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                📊 Performance Reports
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                Detailed analytics for {selectedStaffMember.name}
              </p>

              {/* Report Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                {[
                  {
                    label: 'Total Revenue',
                    value: formatCurrency(selectedStaffMember.revenue * 7),
                    color: '#10b981',
                  },
                  {
                    label: 'Tasks This Week',
                    value: `${selectedStaffMember.tasksCompleted * 7}`,
                    color: '#3b82f6',
                  },
                  {
                    label: 'Success Rate',
                    value: `${selectedStaffMember.efficiency}%`,
                    color: '#ec4899',
                  },
                  {
                    label: 'Avg Response Time',
                    value: '1.2 seconds',
                    color: '#f59e0b',
                  },
                ].map((metric, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: metric.color,
                        marginBottom: '8px',
                      }}
                    >
                      {metric.value}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: '600',
                      }}
                    >
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Analytics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                {/* Weekly Performance Chart */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📈 Weekly Performance
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      height: '80px',
                      alignItems: 'end',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    {[92, 88, 95, 91, 97, 94, 89].map((performance, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          background: `linear-gradient(180deg, #10b981, #059669)`,
                          height: `${performance}%`,
                          borderRadius: '3px',
                          minHeight: '6px',
                          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Task Categories */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📋 Task Breakdown
                  </h4>
                  {[
                    {
                      category: 'Customer Relations',
                      count: 45,
                      color: '#ec4899',
                    },
                    {
                      category: 'Contract Negotiations',
                      count: 32,
                      color: '#f59e0b',
                    },
                    { category: 'Route Planning', count: 28, color: '#3b82f6' },
                    {
                      category: 'Compliance Checks',
                      count: 19,
                      color: '#10b981',
                    },
                  ].map((category, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        marginBottom: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#ffffff',
                          fontWeight: '600',
                        }}
                      >
                        {category.category}
                      </span>
                      <div
                        style={{
                          background: category.color,
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '32px',
                }}
              >
                <button
                  onClick={() => setShowStaffReports(false)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  📊 Export Full Report
                </button>
              </div>
            </div>
          </div>
        )}
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
        @keyframes glow {
          0% {
            box-shadow: 0 20px 40px -10px rgba(236, 72, 153, 0.5);
          }
          100% {
            box-shadow: 0 25px 50px -10px rgba(219, 39, 119, 0.7);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(1deg);
          }
          66% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }
      `}</style>
    </div>
  );
}
