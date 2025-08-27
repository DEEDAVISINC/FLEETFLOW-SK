'use client';

import {
  Activity,
  CheckCircle,
  Play,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import AITaskAssignmentSystem from './AITaskAssignmentSystem';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AIStaffMember {
  id: string;
  name: string;
  role: string;
  department:
    | 'sales'
    | 'operations'
    | 'support'
    | 'lead_generation'
    | 'analytics';
  avatar: string;
  status: 'active' | 'busy' | 'idle' | 'scheduled_break' | 'off_duty';
  currentTask: string;
  tasksCompleted: number;
  revenue: number;
  efficiency: number;
  lastActivity: string;
  schedule: {
    shift: 'morning' | 'afternoon' | 'evening' | '24/7';
    workHours: string;
    breakTime: string;
    weeklyHours: number;
    overtime: number;
  };
  performance: {
    weeklyGoal: number;
    monthlyGoal: number;
    completionRate: number;
    qualityScore: number;
    responseTime: string;
  };
  specializations: string[];
}

interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  shifts: {
    morning: string[];
    afternoon: string[];
    evening: string[];
    overnight: string[];
  };
  coverage: {
    sales: number;
    leadGen: number;
    support: number;
    analytics: number;
  };
}

export default function AIStaffScheduler() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [scheduleMode, setScheduleMode] = useState<'auto' | 'manual'>('auto');
  const [currentTime] = useState(new Date());

  // AI Staff Database
  const [aiStaff, setAiStaff] = useState<AIStaffMember[]>([
    // LEAD GENERATION DEPARTMENT
    {
      id: 'desiree-001',
      name: 'Desiree',
      role: 'Desperate Prospects Specialist',
      department: 'lead_generation',
      avatar: '🎯',
      status: 'busy',
      currentTask:
        'Analyzing 47 companies with safety violations - found 12 desperate shippers',
      tasksCompleted: 156,
      revenue: 24500,
      efficiency: 94.2,
      lastActivity: '2 min ago',
      schedule: {
        shift: '24/7',
        workHours: '24/7 Continuous',
        breakTime: '2 min every 30 min',
        weeklyHours: 168,
        overtime: 0,
      },
      performance: {
        weeklyGoal: 50,
        monthlyGoal: 200,
        completionRate: 87.3,
        qualityScore: 96.1,
        responseTime: '1.2s',
      },
      specializations: [
        'Safety Issues',
        'Compliance Problems',
        'Desperate Prospects',
      ],
    },
    {
      id: 'cliff-002',
      name: 'Cliff',
      role: 'Desperate Prospects Hunter',
      department: 'lead_generation',
      avatar: '⛰️',
      status: 'active',
      currentTask:
        'Processing edge-case prospects - 23 urgent carriers identified',
      tasksCompleted: 89,
      revenue: 34200,
      efficiency: 98.7,
      lastActivity: '45 sec ago',
      schedule: {
        shift: 'morning',
        workHours: '6:00 AM - 2:00 PM',
        breakTime: '10:00 AM - 10:15 AM',
        weeklyHours: 40,
        overtime: 8,
      },
      performance: {
        weeklyGoal: 30,
        monthlyGoal: 120,
        completionRate: 92.4,
        qualityScore: 94.8,
        responseTime: '0.8s',
      },
      specializations: ['Edge Prospects', 'Urgent Needs', 'Crisis Situations'],
    },
    {
      id: 'gary-003',
      name: 'Gary',
      role: 'Lead Generation Specialist',
      department: 'lead_generation',
      avatar: '📈',
      status: 'active',
      currentTask:
        'Generating 234 new leads - qualification pipeline flowing smoothly',
      tasksCompleted: 178,
      revenue: 28900,
      efficiency: 91.5,
      lastActivity: '3 min ago',
      schedule: {
        shift: 'morning',
        workHours: '7:00 AM - 3:00 PM',
        breakTime: '11:00 AM - 11:15 AM',
        weeklyHours: 40,
        overtime: 4,
      },
      performance: {
        weeklyGoal: 60,
        monthlyGoal: 240,
        completionRate: 89.2,
        qualityScore: 92.1,
        responseTime: '1.1s',
      },
      specializations: [
        'General Leads',
        'Pipeline Management',
        'Lead Qualification',
      ],
    },

    // SALES DEPARTMENT
    {
      id: 'will-004',
      name: 'Will',
      role: 'Sales Operations Specialist',
      department: 'sales',
      avatar: '💼',
      status: 'busy',
      currentTask:
        'Closing deals on 47 automotive suppliers - industrial sales goldmine',
      tasksCompleted: 234,
      revenue: 67500,
      efficiency: 96.8,
      lastActivity: '15 sec ago',
      schedule: {
        shift: 'morning',
        workHours: '8:00 AM - 4:00 PM',
        breakTime: '12:00 PM - 12:30 PM',
        weeklyHours: 40,
        overtime: 12,
      },
      performance: {
        weeklyGoal: 80,
        monthlyGoal: 320,
        completionRate: 94.7,
        qualityScore: 97.2,
        responseTime: '0.3s',
      },
      specializations: ['Deal Closing', 'Client Relations', 'Sales Strategy'],
    },
    {
      id: 'hunter-005',
      name: 'Hunter',
      role: 'Recruiting & Onboarding Specialist',
      department: 'sales',
      avatar: '🎯',
      status: 'active',
      currentTask:
        'Hunting for talent - contacted 156 owner-operators, building recruitment army',
      tasksCompleted: 145,
      revenue: 45300,
      efficiency: 93.4,
      lastActivity: '1 min ago',
      schedule: {
        shift: 'afternoon',
        workHours: '1:00 PM - 9:00 PM',
        breakTime: '5:00 PM - 5:15 PM',
        weeklyHours: 40,
        overtime: 6,
      },
      performance: {
        weeklyGoal: 45,
        monthlyGoal: 180,
        completionRate: 88.7,
        qualityScore: 90.5,
        responseTime: '1.5s',
      },
      specializations: [
        'Talent Hunting',
        'Driver Recruitment',
        'Carrier Onboarding',
      ],
    },

    // OPERATIONS DEPARTMENT
    {
      id: 'c-allen-durr-006',
      name: 'C. Allen Durr',
      role: 'Schedule Optimization Specialist',
      department: 'operations',
      avatar: '📅',
      status: 'active',
      currentTask:
        'Optimizing staff schedules - identified 3 efficiency improvements',
      tasksCompleted: 45,
      revenue: 15800,
      efficiency: 99.1,
      lastActivity: '30 sec ago',
      schedule: {
        shift: '24/7',
        workHours: 'Continuous Monitoring',
        breakTime: 'Self-optimizing',
        weeklyHours: 168,
        overtime: 0,
      },
      performance: {
        weeklyGoal: 20,
        monthlyGoal: 80,
        completionRate: 98.9,
        qualityScore: 99.5,
        responseTime: '0.1s',
      },
      specializations: [
        'Schedule Optimization',
        'Workload Balancing',
        'Time Management',
      ],
    },
    {
      id: 'miles-007',
      name: 'Miles',
      role: 'Dispatch Coordination Specialist',
      department: 'operations',
      avatar: '📍',
      status: 'active',
      currentTask:
        'Coordinating routes across 1,247 miles - optimizing dispatch efficiency',
      tasksCompleted: 167,
      revenue: 32100,
      efficiency: 95.2,
      lastActivity: '1 min ago',
      schedule: {
        shift: 'morning',
        workHours: '5:00 AM - 1:00 PM',
        breakTime: '9:00 AM - 9:15 AM',
        weeklyHours: 40,
        overtime: 8,
      },
      performance: {
        weeklyGoal: 55,
        monthlyGoal: 220,
        completionRate: 91.3,
        qualityScore: 94.7,
        responseTime: '0.7s',
      },
      specializations: [
        'Route Optimization',
        'Dispatch Coordination',
        'Mileage Planning',
      ],
    },
    {
      id: 'logan-008',
      name: 'Logan',
      role: 'Logistics Coordination Specialist',
      department: 'operations',
      avatar: '🚛',
      status: 'busy',
      currentTask:
        'Orchestrating supply chain logistics - managing 89 active shipments',
      tasksCompleted: 198,
      revenue: 54700,
      efficiency: 97.1,
      lastActivity: '45 sec ago',
      schedule: {
        shift: 'afternoon',
        workHours: '2:00 PM - 10:00 PM',
        breakTime: '6:00 PM - 6:15 PM',
        weeklyHours: 40,
        overtime: 10,
      },
      performance: {
        weeklyGoal: 65,
        monthlyGoal: 260,
        completionRate: 93.8,
        qualityScore: 96.2,
        responseTime: '0.5s',
      },
      specializations: [
        'Supply Chain',
        'Shipment Coordination',
        'Logistics Planning',
      ],
    },

    // SUPPORT DEPARTMENT
    {
      id: 'shanell-009',
      name: 'Shanell',
      role: 'Customer Service Specialist',
      department: 'support',
      avatar: '🛠️',
      status: 'active',
      currentTask:
        'Providing excellent service - resolved 67 customer inquiries today',
      tasksCompleted: 234,
      revenue: 18500,
      efficiency: 96.3,
      lastActivity: '2 min ago',
      schedule: {
        shift: 'morning',
        workHours: '8:00 AM - 4:00 PM',
        breakTime: '12:00 PM - 12:30 PM',
        weeklyHours: 40,
        overtime: 0,
      },
      performance: {
        weeklyGoal: 70,
        monthlyGoal: 280,
        completionRate: 94.1,
        qualityScore: 98.2,
        responseTime: '0.4s',
      },
      specializations: [
        'Customer Support',
        'Issue Resolution',
        'Service Excellence',
      ],
    },
    {
      id: 'deanna-010',
      name: 'Deanna',
      role: 'Data Analysis Specialist',
      department: 'analytics',
      avatar: '📊',
      status: 'active',
      currentTask:
        'Analyzing performance metrics - all systems optimal, trends identified',
      tasksCompleted: 127,
      revenue: 8900,
      efficiency: 97.4,
      lastActivity: '1 min ago',
      schedule: {
        shift: 'afternoon',
        workHours: '1:00 PM - 9:00 PM',
        breakTime: '5:00 PM - 5:15 PM',
        weeklyHours: 40,
        overtime: 0,
      },
      performance: {
        weeklyGoal: 40,
        monthlyGoal: 160,
        completionRate: 91.8,
        qualityScore: 95.6,
        responseTime: '0.5s',
      },
      specializations: [
        'Data Analysis',
        'Performance Monitoring',
        'Trend Analysis',
      ],
    },
  ]);

  // Schedule Templates
  const scheduleTemplates: ScheduleTemplate[] = [
    {
      id: 'high_performance',
      name: 'High Performance Coverage',
      description: 'Maximum lead generation with optimal staff distribution',
      shifts: {
        morning: ['Cliff', 'Will', 'Deanna'],
        afternoon: ['Gary', 'Deanna', 'C. Allen Durr'],
        evening: ['Will', 'Desiree'],
        overnight: ['Desiree', 'C. Allen Durr'],
      },
      coverage: {
        sales: 60,
        leadGen: 80,
        support: 40,
        analytics: 60,
      },
    },
    {
      id: 'balanced',
      name: 'Balanced Operations',
      description: 'Even workload distribution across all departments',
      shifts: {
        morning: ['Cliff', 'Will'],
        afternoon: ['Gary', 'Deanna'],
        evening: ['Desiree', 'C. Allen Durr'],
        overnight: ['Desiree'],
      },
      coverage: {
        sales: 50,
        leadGen: 60,
        support: 50,
        analytics: 50,
      },
    },
    {
      id: 'lead_generation_focus',
      name: 'Lead Generation Focus',
      description: 'Maximum lead generation capacity with support coverage',
      shifts: {
        morning: ['Desiree', 'Cliff', 'Will'],
        afternoon: ['Gary', 'Desiree', 'Will'],
        evening: ['Desiree', 'Cliff'],
        overnight: ['Desiree', 'C. Allen Durr'],
      },
      coverage: {
        sales: 70,
        leadGen: 90,
        support: 30,
        analytics: 40,
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'idle':
        return 'bg-blue-500';
      case 'scheduled_break':
        return 'bg-purple-500';
      case 'off_duty':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'lead_generation':
        return 'bg-blue-100 text-blue-800';
      case 'operations':
        return 'bg-purple-100 text-purple-800';
      case 'support':
        return 'bg-orange-100 text-orange-800';
      case 'analytics':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStaff =
    selectedDepartment === 'all'
      ? aiStaff
      : aiStaff.filter((staff) => staff.department === selectedDepartment);

  const departmentStats = {
    sales: aiStaff.filter((s) => s.department === 'sales').length,
    lead_generation: aiStaff.filter((s) => s.department === 'lead_generation')
      .length,
    operations: aiStaff.filter((s) => s.department === 'operations').length,
    support: aiStaff.filter((s) => s.department === 'support').length,
    analytics: aiStaff.filter((s) => s.department === 'analytics').length,
  };

  const totalRevenue = aiStaff.reduce((sum, staff) => sum + staff.revenue, 0);
  const avgEfficiency =
    aiStaff.reduce((sum, staff) => sum + staff.efficiency, 0) / aiStaff.length;
  const totalTasksCompleted = aiStaff.reduce(
    (sum, staff) => sum + staff.tasksCompleted,
    0
  );

  return (
    <div className='mx-auto w-full max-w-7xl space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='flex items-center gap-3 text-3xl font-bold text-gray-900'>
            <Users className='h-8 w-8 text-blue-600' />
            DEPOINTE AI Staff Scheduler
          </h1>
          <p className='mt-1 text-gray-600'>
            Workforce Management & Schedule Optimization
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Select
            value={scheduleMode}
            onValueChange={(value) =>
              setScheduleMode(value as 'auto' | 'manual')
            }
          >
            <SelectTrigger className='w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='auto'>Auto Schedule</SelectItem>
              <SelectItem value='manual'>Manual Control</SelectItem>
            </SelectContent>
          </Select>
          <Button className='bg-blue-600 hover:bg-blue-700'>
            <Play className='mr-2 h-4 w-4' />
            Optimize Schedules
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Active Staff</p>
                <p className='text-2xl font-bold text-green-600'>
                  {
                    aiStaff.filter(
                      (s) => s.status === 'active' || s.status === 'busy'
                    ).length
                  }
                </p>
                <p className='text-xs text-gray-500'>
                  of {aiStaff.length} total
                </p>
              </div>
              <Activity className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Revenue</p>
                <p className='text-2xl font-bold text-blue-600'>
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className='text-xs text-green-600'>+12.4% from last week</p>
              </div>
              <TrendingUp className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Avg Efficiency</p>
                <p className='text-2xl font-bold text-purple-600'>
                  {avgEfficiency.toFixed(1)}%
                </p>
                <p className='text-xs text-green-600'>Above target (85%)</p>
              </div>
              <Zap className='h-8 w-8 text-purple-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Tasks Completed</p>
                <p className='text-2xl font-bold text-orange-600'>
                  {totalTasksCompleted}
                </p>
                <p className='text-xs text-gray-500'>This week</p>
              </div>
              <CheckCircle className='h-8 w-8 text-orange-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-6'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='schedules'>Schedules</TabsTrigger>
          <TabsTrigger value='assignments'>Task Assignments</TabsTrigger>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='templates'>Templates</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className='w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Departments</SelectItem>
                <SelectItem value='sales'>
                  Sales ({departmentStats.sales})
                </SelectItem>
                <SelectItem value='lead_generation'>
                  Lead Generation ({departmentStats.lead_generation})
                </SelectItem>
                <SelectItem value='operations'>
                  Operations ({departmentStats.operations})
                </SelectItem>
                <SelectItem value='support'>
                  Support ({departmentStats.support})
                </SelectItem>
                <SelectItem value='analytics'>
                  Analytics ({departmentStats.analytics})
                </SelectItem>
              </SelectContent>
            </Select>
            <div className='text-sm text-gray-600'>
              Showing {filteredStaff.length} staff members
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {filteredStaff.map((staff) => (
              <Card
                key={staff.id}
                className='transition-shadow hover:shadow-lg'
              >
                <CardContent className='p-6'>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='text-2xl'>{staff.avatar}</div>
                      <div>
                        <h3 className='text-lg font-semibold'>{staff.name}</h3>
                        <p className='text-sm text-gray-600'>{staff.role}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`h-3 w-3 rounded-full ${getStatusColor(staff.status)}`}
                      ></div>
                      <Badge className={getDepartmentColor(staff.department)}>
                        {staff.department.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='rounded-md bg-gray-50 p-3'>
                      <p className='text-sm font-medium text-gray-700'>
                        Current Task:
                      </p>
                      <p className='mt-1 text-sm text-gray-600'>
                        {staff.currentTask}
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>
                        Last activity: {staff.lastActivity}
                      </p>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-600'>Schedule</p>
                        <p className='font-medium'>
                          {staff.schedule.workHours}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {staff.schedule.shift} shift
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Weekly Hours</p>
                        <p className='font-medium'>
                          {staff.schedule.weeklyHours}h
                        </p>
                        {staff.schedule.overtime > 0 && (
                          <p className='text-xs text-orange-600'>
                            +{staff.schedule.overtime}h OT
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-3 gap-4 border-t pt-3'>
                      <div className='text-center'>
                        <p className='text-lg font-bold text-green-600'>
                          {staff.tasksCompleted}
                        </p>
                        <p className='text-xs text-gray-600'>Tasks</p>
                      </div>
                      <div className='text-center'>
                        <p className='text-lg font-bold text-blue-600'>
                          ${staff.revenue.toLocaleString()}
                        </p>
                        <p className='text-xs text-gray-600'>Revenue</p>
                      </div>
                      <div className='text-center'>
                        <p className='text-lg font-bold text-purple-600'>
                          {staff.efficiency}%
                        </p>
                        <p className='text-xs text-gray-600'>Efficiency</p>
                      </div>
                    </div>

                    <div className='flex flex-wrap gap-1 pt-2'>
                      {staff.specializations.map((spec, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value='schedules' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Current Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {/* Time Blocks */}
                <div className='grid grid-cols-4 gap-4'>
                  {[
                    'Morning (6AM-2PM)',
                    'Afternoon (2PM-10PM)',
                    'Evening (10PM-6AM)',
                    '24/7 Coverage',
                  ].map((period, index) => (
                    <div key={index} className='rounded-lg bg-gray-50 p-4'>
                      <h4 className='mb-3 font-semibold'>{period}</h4>
                      <div className='space-y-2'>
                        {aiStaff
                          .filter((staff) => {
                            if (index === 0)
                              return staff.schedule.shift === 'morning';
                            if (index === 1)
                              return staff.schedule.shift === 'afternoon';
                            if (index === 2)
                              return staff.schedule.shift === 'evening';
                            if (index === 3)
                              return staff.schedule.shift === '24/7';
                            return false;
                          })
                          .map((staff) => (
                            <div
                              key={staff.id}
                              className='flex items-center gap-2 text-sm'
                            >
                              <span className='text-lg'>{staff.avatar}</span>
                              <span className='truncate'>{staff.name}</span>
                              <div
                                className={`h-2 w-2 rounded-full ${getStatusColor(staff.status)}`}
                              ></div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Department Coverage Chart */}
                <div className='grid grid-cols-5 gap-4'>
                  {Object.entries(departmentStats).map(([dept, count]) => (
                    <div
                      key={dept}
                      className='rounded-lg border bg-white p-4 text-center'
                    >
                      <h5 className='mb-2 font-medium capitalize'>
                        {dept.replace('_', ' ')}
                      </h5>
                      <div className='text-2xl font-bold text-blue-600'>
                        {count}
                      </div>
                      <div className='text-xs text-gray-500'>Active Staff</div>
                      <div className='mt-2'>
                        <div className='h-2 rounded-full bg-gray-200'>
                          <div
                            className='h-2 rounded-full bg-blue-600'
                            style={{
                              width: `${(count / Math.max(...Object.values(departmentStats))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Assignments Tab */}
        <TabsContent value='assignments' className='space-y-6'>
          <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <div className='flex items-center gap-3'>
              <Target className='h-6 w-6 text-blue-600' />
              <div>
                <h3 className='font-semibold text-blue-900'>
                  AI Task Assignment System
                </h3>
                <p className='text-sm text-blue-700'>
                  Configure AI staff to target specific prospect types like
                  desperate shippers, manufacturers, and carriers
                </p>
              </div>
            </div>
          </div>
          <AITaskAssignmentSystem />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value='performance' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {aiStaff.slice(0, 6).map((staff) => (
              <Card key={staff.id}>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <span className='text-xl'>{staff.avatar}</span>
                    {staff.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-600'>Weekly Goal</p>
                        <p className='font-bold'>
                          {staff.performance.weeklyGoal}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Completion Rate</p>
                        <p className='font-bold text-green-600'>
                          {staff.performance.completionRate}%
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-600'>Quality Score</p>
                        <p className='font-bold text-blue-600'>
                          {staff.performance.qualityScore}%
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Response Time</p>
                        <p className='font-bold text-purple-600'>
                          {staff.performance.responseTime}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span>Weekly Progress</span>
                        <span>
                          {staff.tasksCompleted}/{staff.performance.weeklyGoal}
                        </span>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-green-600'
                          style={{
                            width: `${Math.min((staff.tasksCompleted / staff.performance.weeklyGoal) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value='templates' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {scheduleTemplates.map((template) => (
              <Card
                key={template.id}
                className='transition-shadow hover:shadow-md'
              >
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <p className='text-sm text-gray-600'>
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      {Object.entries(template.coverage).map(
                        ([dept, percentage]) => (
                          <div key={dept} className='flex justify-between'>
                            <span className='text-sm capitalize'>
                              {dept.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className='text-sm font-medium'>
                              {percentage}%
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    <Button className='w-full' variant='outline'>
                      Apply Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {aiStaff.slice(0, 6).map((staff) => (
                    <div
                      key={staff.id}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-2'>
                        <span>{staff.avatar}</span>
                        <span className='text-sm'>{staff.name}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-16 rounded-full bg-gray-200'>
                          <div
                            className='h-2 rounded-full bg-green-600'
                            style={{ width: `${staff.efficiency}%` }}
                          ></div>
                        </div>
                        <span className='text-sm font-medium'>
                          {staff.efficiency}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {aiStaff
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 6)
                    .map((staff) => (
                      <div
                        key={staff.id}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <span>{staff.avatar}</span>
                          <span className='text-sm'>{staff.name}</span>
                        </div>
                        <span className='text-sm font-medium'>
                          ${staff.revenue.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
