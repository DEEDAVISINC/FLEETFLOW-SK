'use client';

import {
  Activity,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Play,
  Plus,
  Settings,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { TruckingPlanetDashboard } from '../ai-company-dashboard-enhanced';
import AIStaffScheduler from './AIStaffScheduler';
import AITaskAssignmentSystem from './AITaskAssignmentSystem';
import CampaignTemplates from './CampaignTemplates';
import TaskCreationInterface from './TaskCreationInterface';

interface CompanyStats {
  totalRevenue: number;
  activeStaff: number;
  completedTasks: number;
  efficiency: number;
  leadsGenerated: number;
  conversionRate: number;
}

interface QuickAssignmentPreset {
  id: string;
  name: string;
  description: string;
  targetType: string;
  staffAssigned: number;
  expectedRevenue: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  deadline?: string;
  estimatedRevenue: number;
}

export default function DEPOINTEAICompanyDashboard() {
  const [activeView, setActiveView] = useState<
    'overview' | 'scheduler' | 'assignments' | 'performance' | 'templates'
  >('overview');
  const [stats, setStats] = useState<CompanyStats>({
    totalRevenue: 847500,
    activeStaff: 18,
    completedTasks: 2456,
    efficiency: 94.7,
    leadsGenerated: 1847,
    conversionRate: 32.4,
  });
  const [isTaskCreationOpen, setIsTaskCreationOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Quick Assignment Presets for easy configuration
  const quickPresets: QuickAssignmentPreset[] = [
    {
      id: 'desperate_shippers_blitz',
      name: 'Desperate Shippers Blitz',
      description:
        'Target companies with safety violations and compliance issues for quick wins',
      targetType: 'Desperate Shippers',
      staffAssigned: 3,
      expectedRevenue: 150000,
      difficulty: 'easy',
      icon: '🎯',
    },
    {
      id: 'manufacturing_giants',
      name: 'Manufacturing Giants',
      description:
        'Go after large manufacturers with substantial shipping needs',
      targetType: 'Manufacturers',
      staffAssigned: 2,
      expectedRevenue: 300000,
      difficulty: 'hard',
      icon: '🏭',
    },
    {
      id: 'new_authority_goldmine',
      name: 'New Authority Goldmine',
      description: 'Target new authorities who need guidance and loads',
      targetType: 'New Authorities',
      staffAssigned: 2,
      expectedRevenue: 90000,
      difficulty: 'medium',
      icon: '🆕',
    },
    {
      id: 'owner_operator_army',
      name: 'Owner Operator Army',
      description:
        'Recruit individual owner-operators seeking consistent freight',
      targetType: 'Owner Operators',
      staffAssigned: 3,
      expectedRevenue: 120000,
      difficulty: 'medium',
      icon: '🚛',
    },
    {
      id: 'safety_crisis_rescue',
      name: 'Safety Crisis Rescue',
      description:
        'Help carriers with safety issues who need immediate assistance',
      targetType: 'Safety Violations',
      staffAssigned: 2,
      expectedRevenue: 180000,
      difficulty: 'easy',
      icon: '⚠️',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const assignPreset = async (presetId: string) => {
    // Here you would integrate with your backend to actually assign the preset
    console.info(`Assigning preset: ${presetId}`);

    // Show success message
    const preset = quickPresets.find((p) => p.id === presetId);
    if (preset) {
      alert(
        `✅ ${preset.name} has been deployed!\n\n${preset.staffAssigned} AI staff members are now targeting ${preset.targetType.toLowerCase()}.`
      );
    }
  };

  // Available AI Staff for task assignment
  const availableStaff = [
    {
      id: 'desiree',
      name: 'Desiree',
      role: 'Desperate Prospects Specialist',
      department: 'Lead Generation',
      avatar: '🎯',
    },
    {
      id: 'cliff',
      name: 'Cliff',
      role: 'Desperate Prospects Hunter',
      department: 'Lead Generation',
      avatar: '⛰️',
    },
    {
      id: 'gary',
      name: 'Gary',
      role: 'Lead Generation Specialist',
      department: 'Lead Generation',
      avatar: '📈',
    },
    {
      id: 'will',
      name: 'Will',
      role: 'Sales Operations Specialist',
      department: 'Sales',
      avatar: '💼',
    },
    {
      id: 'hunter',
      name: 'Hunter',
      role: 'Recruiting & Onboarding Specialist',
      department: 'Sales',
      avatar: '🎯',
    },
    {
      id: 'resse',
      name: 'Resse A. Bell',
      role: 'Accounting Specialist',
      department: 'Financial',
      avatar: '💰',
    },
    {
      id: 'dell',
      name: 'Dell',
      role: 'IT Support Specialist',
      department: 'Technology',
      avatar: '💻',
    },
    {
      id: 'logan',
      name: 'Logan',
      role: 'Logistics Coordination Specialist',
      department: 'Operations',
      avatar: '🚛',
    },
    {
      id: 'miles',
      name: 'Miles',
      role: 'Dispatch Coordination Specialist',
      department: 'Operations',
      avatar: '📍',
    },
    {
      id: 'brook',
      name: 'Brook R.',
      role: 'Brokerage Operations Specialist',
      department: 'Relationships',
      avatar: '🤝',
    },
    {
      id: 'carrie',
      name: 'Carrie R.',
      role: 'Carrier Relations Specialist',
      department: 'Relationships',
      avatar: '🚚',
    },
    {
      id: 'kameelah',
      name: 'Kameelah',
      role: 'DOT Compliance Specialist',
      department: 'Compliance & Safety',
      avatar: '✅',
    },
    {
      id: 'regina',
      name: 'Regina',
      role: 'FMCSA Regulations Specialist',
      department: 'Compliance & Safety',
      avatar: '📋',
    },
    {
      id: 'shanell',
      name: 'Shanell',
      role: 'Customer Service Specialist',
      department: 'Support & Service',
      avatar: '🛠️',
    },
    {
      id: 'clarence',
      name: 'Clarence',
      role: 'Claims & Insurance Specialist',
      department: 'Support & Service',
      avatar: '📄',
    },
    {
      id: 'drew',
      name: 'Drew',
      role: 'Marketing Specialist',
      department: 'Business Development',
      avatar: '📢',
    },
    {
      id: 'cal',
      name: 'Cal Ender',
      role: 'Schedule Optimization Specialist',
      department: 'Operations',
      avatar: '📅',
    },
    {
      id: 'ana',
      name: 'Ana Lytics',
      role: 'Data Analysis Specialist',
      department: 'Operations',
      avatar: '📊',
    },
  ];

  // Handle task creation
  const handleTaskCreate = (taskData: any) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      priority: taskData.priority,
      assignedTo: taskData.assignedTo,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deadline: taskData.deadline,
      estimatedRevenue: taskData.estimatedRevenue,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    // Update stats
    setStats((prev) => ({
      ...prev,
      completedTasks: prev.completedTasks + 1,
      totalRevenue: prev.totalRevenue + taskData.estimatedRevenue,
    }));

    console.info('✅ Task created successfully:', newTask);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6'>
      <div className='mx-auto max-w-7xl space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='flex items-center gap-3 text-4xl font-bold text-white'>
              <Building2 className='h-10 w-10 text-blue-400' />
              DEPOINTE AI Company Dashboard
            </h1>
            <p className='mt-2 text-slate-300'>
              Executive AI Workforce Management & Revenue Operations
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsTaskCreationOpen(true)}
              className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700'
            >
              <Plus className='h-4 w-4' />
              Add Task
            </button>
            <div className='text-right'>
              <div className='text-2xl font-bold text-green-400'>
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className='text-sm text-slate-400'>Monthly Revenue</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-6'>
          <div className='rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-blue-100'>Active AI Staff</p>
                <p className='text-3xl font-bold'>{stats.activeStaff}</p>
                <p className='text-xs text-blue-200'>All systems operational</p>
              </div>
              <Users className='h-8 w-8 text-blue-200' />
            </div>
          </div>

          <div className='rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-green-100'>Leads Generated</p>
                <p className='text-3xl font-bold'>{stats.leadsGenerated}</p>
                <p className='text-xs text-green-200'>This week</p>
              </div>
              <Target className='h-8 w-8 text-green-200' />
            </div>
          </div>

          <div className='rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-purple-100'>Conversion Rate</p>
                <p className='text-3xl font-bold'>{stats.conversionRate}%</p>
                <p className='text-xs text-purple-200'>Above industry avg</p>
              </div>
              <TrendingUp className='h-8 w-8 text-purple-200' />
            </div>
          </div>

          <div className='rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-orange-100'>Tasks Completed</p>
                <p className='text-3xl font-bold'>{stats.completedTasks}</p>
                <p className='text-xs text-orange-200'>This month</p>
              </div>
              <CheckCircle className='h-8 w-8 text-orange-200' />
            </div>
          </div>

          <div className='rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-pink-100'>Efficiency Rate</p>
                <p className='text-3xl font-bold'>{stats.efficiency}%</p>
                <p className='text-xs text-pink-200'>Optimized performance</p>
              </div>
              <Zap className='h-8 w-8 text-pink-200' />
            </div>
          </div>

          <div className='rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-teal-100'>Revenue/Staff</p>
                <p className='text-3xl font-bold'>
                  ${Math.round(stats.totalRevenue / stats.activeStaff / 1000)}K
                </p>
                <p className='text-xs text-teal-200'>Per AI member</p>
              </div>
              <DollarSign className='h-8 w-8 text-teal-200' />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='rounded-xl bg-slate-800 p-2'>
          <div className='flex space-x-2'>
            {[
              { id: 'overview', label: 'Command Center', icon: BarChart3 },
              { id: 'scheduler', label: 'AI Staff Scheduler', icon: Calendar },
              { id: 'assignments', label: 'Task Assignments', icon: Target },
              { id: 'templates', label: 'Templates', icon: FileText },
              {
                id: 'performance',
                label: 'Performance Analytics',
                icon: TrendingUp,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                  activeView === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <tab.icon className='h-4 w-4' />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Areas */}
        {activeView === 'overview' && (
          <div className='space-y-6'>
            {/* TruckingPlanet Integration */}
            <TruckingPlanetDashboard />

            {/* Quick Assignment Presets */}
            <div className='rounded-xl bg-slate-800 p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-white'>
                    🚀 Quick Assignment Presets
                  </h2>
                  <p className='mt-1 text-slate-400'>
                    Deploy AI staff to target specific prospect types instantly
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('assignments')}
                  className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
                >
                  <Settings className='mr-2 inline h-4 w-4' />
                  Custom Configuration
                </button>
              </div>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
                {quickPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className='rounded-lg bg-slate-700 p-6 transition-colors hover:bg-slate-600'
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='text-3xl'>{preset.icon}</div>
                        <div>
                          <h3 className='text-lg font-bold text-white'>
                            {preset.name}
                          </h3>
                          <p className='text-sm text-slate-300'>
                            {preset.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(preset.difficulty)}`}
                      >
                        {preset.difficulty}
                      </span>
                    </div>

                    <div className='mb-4 grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <p className='text-slate-400'>Target Type:</p>
                        <p className='font-medium text-white'>
                          {preset.targetType}
                        </p>
                      </div>
                      <div>
                        <p className='text-slate-400'>Staff Assigned:</p>
                        <p className='font-medium text-white'>
                          {preset.staffAssigned} AI Members
                        </p>
                      </div>
                    </div>

                    <div className='mb-4'>
                      <p className='text-sm text-slate-400'>
                        Expected Revenue:
                      </p>
                      <p className='text-xl font-bold text-green-400'>
                        ${preset.expectedRevenue.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => assignPreset(preset.id)}
                      className='w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700'
                    >
                      <Play className='mr-2 inline h-4 w-4' />
                      Deploy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className='rounded-xl bg-slate-800 p-6'>
              <h2 className='mb-6 text-2xl font-bold text-white'>
                🔥 Live AI Activity Feed
              </h2>
              <div className='space-y-4'>
                {[
                  {
                    time: '2 min ago',
                    message:
                      'Desiree identified 12 companies with safety violations - classic desperation signals detected',
                    type: 'success',
                    agent: 'Desiree (Desperate Prospects)',
                  },
                  {
                    time: '5 min ago',
                    message:
                      'Will completed outreach to 47 automotive suppliers - industrial sales goldmine',
                    type: 'info',
                    agent: 'Will (Sales Operations)',
                  },
                  {
                    time: '8 min ago',
                    message:
                      'Cliff generated 23 leads from desperate carriers - urgent needs identified',
                    type: 'success',
                    agent: 'Cliff (Desperate Prospects)',
                  },
                  {
                    time: '12 min ago',
                    message:
                      'Hunter contacted 156 owner-operators - building the recruitment pipeline',
                    type: 'info',
                    agent: 'Hunter (Recruiting & Onboarding)',
                  },
                  {
                    time: '15 min ago',
                    message:
                      'Regina found 8 FMCSA violations requiring immediate attention',
                    type: 'warning',
                    agent: 'Regina (FMCSA Regulations)',
                  },
                  {
                    time: '18 min ago',
                    message:
                      'Gary processed 234 new leads - qualification pipeline is flowing',
                    type: 'info',
                    agent: 'Gary (Lead Generation)',
                  },
                  {
                    time: '22 min ago',
                    message:
                      'Clarence handled 5 cargo claims - all resolved successfully',
                    type: 'success',
                    agent: 'Clarence (Claims & Insurance)',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 rounded-lg bg-slate-700 p-4'
                  >
                    <div
                      className={`mt-2 h-2 w-2 rounded-full ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }`}
                    ></div>
                    <div className='flex-1'>
                      <p className='text-white'>{activity.message}</p>
                      <p className='text-sm text-slate-400'>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'scheduler' && (
          <div className='rounded-xl bg-slate-800 p-6'>
            <AIStaffScheduler />
          </div>
        )}

        {activeView === 'assignments' && (
          <div className='rounded-xl bg-slate-800 p-6'>
            <AITaskAssignmentSystem />
          </div>
        )}

        {activeView === 'templates' && (
          <div className='rounded-xl bg-slate-800 p-6'>
            <CampaignTemplates />
          </div>
        )}

        {activeView === 'performance' && (
          <div className='rounded-xl bg-slate-800 p-6'>
            <div className='py-12 text-center'>
              <Activity className='mx-auto mb-4 h-16 w-16 text-slate-600' />
              <h3 className='mb-2 text-xl font-bold text-white'>
                Performance Analytics
              </h3>
              <p className='text-slate-400'>
                Advanced performance analytics coming soon...
              </p>
              <button
                onClick={() => setActiveView('scheduler')}
                className='mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
              >
                View Current Performance in Scheduler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Creation Interface */}
      <TaskCreationInterface
        isOpen={isTaskCreationOpen}
        onClose={() => setIsTaskCreationOpen(false)}
        onTaskCreate={handleTaskCreate}
        availableStaff={availableStaff}
      />
    </div>
  );
}
