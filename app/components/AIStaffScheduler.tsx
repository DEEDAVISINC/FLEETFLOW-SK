'use client';

import { Activity, TrendingUp, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { depointeStaffRoster, DEPOINTEStaffMember } from './DEPOINTEStaffRoster';

interface AIStaffMember {
  id: string;
  name: string;
  role: string;
  department:
    | 'sales'
    | 'operations'
    | 'support'
    | 'lead_generation'
    | 'analytics'
    | 'procurement'
    | 'government_contracting'
    | 'executive_operations'
    | 'front_office'
    | 'executive_leadership';
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
    procurement: number;
    governmentContracting: number;
    executiveOperations: number;
    frontOffice: number;
    executiveLeadership: number;
  };
}

export default function AIStaffScheduler(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [staffSchedules, setStaffSchedules] = useState<Record<string, any>>({});
  const [staffTasks, setStaffTasks] = useState<Record<string, any[]>>({});

  // Map DEPOINTE Staff Roster to AI Staff Scheduler format (all 26 staff members)
  const allStaff: AIStaffMember[] = depointeStaffRoster.map((staff) => {
    // Map department to scheduler department types
    const departmentMap: Record<string, AIStaffMember['department']> = {
      'Accounting': 'analytics',
      'IT Support': 'support',
      'Logistics': 'operations',
      'Dispatch': 'operations',
      'Freight Brokerage': 'operations',
      'Sales': 'sales',
      'Recruiting': 'sales',
      'Brokerage Operations': 'operations',
      'Carrier Relations': 'operations',
      'Safety & Compliance': 'operations',
      'Customer Service': 'support',
      'Lead Generation': 'lead_generation',
      'Data Analytics': 'analytics',
      'Material Procurement': 'procurement',
      'Government Contracting': 'government_contracting',
      'Front Office': 'front_office',
      'Executive Operations': 'executive_operations',
      'Executive Leadership': 'executive_leadership',
    };

    return {
      id: staff.id,
      name: staff.fullName,
      role: staff.internalRole,
      department: departmentMap[staff.department] || 'operations',
      avatar: staff.avatar,
      status: 'active',
      currentTask: 'Ready for assignment',
      tasksCompleted: 0,
      revenue: 0,
      efficiency: 100,
      lastActivity: 'Just now',
      schedule: {
        shift: 'morning',
        workHours: '9AM - 5PM',
        breakTime: '12PM - 1PM',
        weeklyHours: 40,
        overtime: 0,
      },
      performance: {
        weeklyGoal: 100,
        monthlyGoal: 400,
        completionRate: 95,
        qualityScore: 92,
        responseTime: '<15 minutes',
      },
      specializations: staff.specializations,
    };
  });

  const handleScheduleUpdate = (staffId: string, schedule: any) => {
    setStaffSchedules((prev) => ({ ...prev, [staffId]: schedule }));
    alert(
      `✅ Schedule updated for ${allStaff.find((s) => s.id === staffId)?.name}`
    );
  };

  const handleTaskAssignment = (staffId: string, task: any) => {
    setStaffTasks((prev) => ({
      ...prev,
      [staffId]: [...(prev[staffId] || []), task],
    }));
    alert(
      `✅ Task assigned to ${allStaff.find((s) => s.id === staffId)?.name}`
    );
  };

  const selectedStaffData = selectedStaff
    ? allStaff.find((s) => s.id === selectedStaff)
    : null;

  return React.createElement(
    'div',
    {
      style: {
        width: '100%',
        padding: '20px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          marginBottom: '20px',
          textAlign: 'center',
        },
      },
      React.createElement(
        'h2',
        {
          style: {
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '8px',
          },
        },
        '📅 AI Staff Scheduler'
      ),
      React.createElement(
        'p',
        {
          style: {
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '1rem',
          },
        },
        'Workforce Management & Schedule Optimization'
      )
    ),

    React.createElement(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          },
        },
        React.createElement(Activity, {
          style: {
            width: '32px',
            height: '32px',
            color: '#22c55e',
            margin: '0 auto 8px',
          },
        }),
        React.createElement(
          'p',
          {
            style: {
              color: 'white',
              fontSize: '0.875rem',
              marginBottom: '4px',
            },
          },
          'Active Staff'
        ),
        React.createElement(
          'p',
          {
            style: { color: '#22c55e', fontSize: '1.5rem', fontWeight: '700' },
          },
          '--'
        )
      ),

      React.createElement(
        'div',
        {
          style: {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          },
        },
        React.createElement(TrendingUp, {
          style: {
            width: '32px',
            height: '32px',
            color: '#3b82f6',
            margin: '0 auto 8px',
          },
        }),
        React.createElement(
          'p',
          {
            style: {
              color: 'white',
              fontSize: '0.875rem',
              marginBottom: '4px',
            },
          },
          'Total Revenue'
        ),
        React.createElement(
          'p',
          {
            style: { color: '#3b82f6', fontSize: '1.5rem', fontWeight: '700' },
          },
          '--'
        )
      ),

      React.createElement(
        'div',
        {
          style: {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          },
        },
        React.createElement(Zap, {
          style: {
            width: '32px',
            height: '32px',
            color: '#8b5cf6',
            margin: '0 auto 8px',
          },
        }),
        React.createElement(
          'p',
          {
            style: {
              color: 'white',
              fontSize: '0.875rem',
              marginBottom: '4px',
            },
          },
          'Avg Efficiency'
        ),
        React.createElement(
          'p',
          {
            style: { color: '#8b5cf6', fontSize: '1.5rem', fontWeight: '700' },
          },
          '--'
        )
      )
    ),

    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        },
      },
      [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'schedules', label: 'Schedules', icon: '📅' },
        { id: 'assignments', label: 'Task Assignments', icon: '🎯' },
        { id: 'performance', label: 'Performance', icon: '📈' },
        { id: 'templates', label: 'Templates', icon: '📝' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
      ].map((tab) =>
        React.createElement(
          'button',
          {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            style: {
              background:
                activeTab === tab.id
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)',
              border:
                activeTab === tab.id
                  ? '2px solid #8b5cf6'
                  : '1px solid rgba(148, 163, 184, 0.2)',
              color:
                activeTab === tab.id ? '#8b5cf6' : 'rgba(255, 255, 255, 0.7)',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
          },
          tab.icon,
          tab.label
        )
      )
    ),

    React.createElement(
      'div',
      {
        style: {
          marginTop: '20px',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
        },
      },
      // Overview Tab
      activeTab === 'overview' &&
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            {
              style: {
                color: 'white',
                marginBottom: '16px',
                fontSize: '1.2rem',
              },
            },
            '📊 Staff Overview'
          ),
          React.createElement(
            'p',
            {
              style: {
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '16px',
              },
            },
            'Monitor your AI staff performance and activity across all departments.'
          ),
          React.createElement(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              },
            },
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                },
              },
              React.createElement(
                'h4',
                { style: { color: '#8b5cf6', marginBottom: '8px' } },
                'Active Sessions'
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                  },
                },
                '--'
              )
            ),
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                },
              },
              React.createElement(
                'h4',
                { style: { color: '#22c55e', marginBottom: '8px' } },
                'Tasks Completed Today'
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                  },
                },
                '--'
              )
            ),
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                },
              },
              React.createElement(
                'h4',
                { style: { color: '#3b82f6', marginBottom: '8px' } },
                'Scheduled Hours'
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                  },
                },
                '--'
              )
            )
          )
        ),

      // Schedules Tab
      activeTab === 'schedules' &&
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            {
              style: {
                color: 'white',
                marginBottom: '16px',
                fontSize: '1.2rem',
              },
            },
            '📅 Schedule Management'
          ),
          React.createElement(
            'p',
            {
              style: {
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '20px',
              },
            },
            'Select a staff member to configure their schedule'
          ),

          // Staff Selection Cards
          React.createElement(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              },
            },
            allStaff.map((staff) =>
              React.createElement(
                'div',
                {
                  key: staff.id,
                  onClick: () => setSelectedStaff(staff.id),
                  style: {
                    background:
                      selectedStaff === staff.id
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))'
                        : 'rgba(0, 0, 0, 0.3)',
                    border:
                      selectedStaff === staff.id
                        ? '2px solid #8b5cf6'
                        : '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  },
                  onMouseEnter: (e: any) => {
                    if (selectedStaff !== staff.id) {
                      e.currentTarget.style.background =
                        'rgba(139, 92, 246, 0.1)';
                      e.currentTarget.style.borderColor = '#8b5cf6';
                    }
                  },
                  onMouseLeave: (e: any) => {
                    if (selectedStaff !== staff.id) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor =
                        'rgba(148, 163, 184, 0.2)';
                    }
                  },
                },
                React.createElement(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    },
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        fontSize: '2rem',
                      },
                    },
                    staff.avatar
                  ),
                  React.createElement(
                    'div',
                    { style: { flex: 1 } },
                    React.createElement(
                      'h4',
                      {
                        style: {
                          color: 'white',
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: '700',
                        },
                      },
                      staff.name
                    ),
                    React.createElement(
                      'p',
                      {
                        style: {
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: 0,
                          fontSize: '0.85rem',
                        },
                      },
                      staff.role
                    )
                  ),
                  React.createElement('div', {
                    style: {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background:
                        staff.status === 'active' ? '#22c55e' : '#6b7280',
                    },
                  })
                ),
                React.createElement(
                  'div',
                  {
                    style: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                    },
                  },
                  `🕐 ${staff.schedule.workHours}`,
                  React.createElement('br'),
                  `📊 ${staff.efficiency}% efficiency`
                ),
                selectedStaff === staff.id &&
                  React.createElement(
                    'div',
                    {
                      style: {
                        marginTop: '12px',
                        padding: '8px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '6px',
                        color: '#8b5cf6',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textAlign: 'center',
                      },
                    },
                    '✓ SELECTED'
                  )
              )
            )
          ),

          // Schedule Configuration Panel (shows when staff is selected)
          selectedStaffData &&
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '2px solid #8b5cf6',
                  borderRadius: '12px',
                  padding: '24px',
                  marginTop: '24px',
                },
              },
              React.createElement(
                'h4',
                {
                  style: {
                    color: '#8b5cf6',
                    marginBottom: '20px',
                    fontSize: '1.2rem',
                  },
                },
                `⚙️ Configure Schedule for ${selectedStaffData.name}`
              ),

              React.createElement(
                'div',
                {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px',
                  },
                },

                // Shift Selection
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    {
                      style: {
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      },
                    },
                    '⏰ Shift'
                  ),
                  React.createElement(
                    'select',
                    {
                      defaultValue: selectedStaffData.schedule.shift,
                      style: {
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                      },
                    },
                    React.createElement(
                      'option',
                      { value: 'morning' },
                      '🌅 Morning (6AM - 2PM)'
                    ),
                    React.createElement(
                      'option',
                      { value: 'afternoon' },
                      '🌇 Afternoon (2PM - 10PM)'
                    ),
                    React.createElement(
                      'option',
                      { value: 'evening' },
                      '🌙 Evening (10PM - 6AM)'
                    ),
                    React.createElement(
                      'option',
                      { value: '24/7' },
                      '⚡ 24/7 Always On'
                    )
                  )
                ),

                // Work Hours
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    {
                      style: {
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      },
                    },
                    '🕐 Work Hours'
                  ),
                  React.createElement('input', {
                    type: 'text',
                    defaultValue: selectedStaffData.schedule.workHours,
                    placeholder: 'e.g., 9:00 AM - 5:00 PM',
                    style: {
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                    },
                  })
                ),

                // Weekly Hours
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    {
                      style: {
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      },
                    },
                    '📊 Weekly Hours'
                  ),
                  React.createElement('input', {
                    type: 'number',
                    defaultValue: selectedStaffData.schedule.weeklyHours,
                    min: 0,
                    max: 168,
                    style: {
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                    },
                  })
                )
              ),

              React.createElement(
                'button',
                {
                  onClick: () =>
                    handleScheduleUpdate(
                      selectedStaffData.id,
                      selectedStaffData.schedule
                    ),
                  style: {
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '16px',
                  },
                },
                '💾 Save Schedule'
              )
            ),

          // Schedule Controls
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                flexWrap: 'wrap',
              },
            },
            React.createElement(
              'button',
              {
                style: {
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                },
              },
              '⚡ Auto-Optimize'
            ),
            React.createElement(
              'button',
              {
                style: {
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                },
              },
              '📋 Create Template'
            ),
            React.createElement(
              'button',
              {
                style: {
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                },
              },
              '🔄 Bulk Update'
            )
          ),

          // Current Schedule Grid
          React.createElement(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
                marginBottom: '24px',
              },
            },
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  },
                },
                React.createElement(
                  'h4',
                  {
                    style: { color: '#f59e0b', margin: 0, fontSize: '1.1rem' },
                  },
                  '🌅 Morning Shift'
                ),
                React.createElement(
                  'span',
                  {
                    style: {
                      color: '#f59e0b',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    },
                  },
                  '6AM - 2PM'
                )
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    marginBottom: '12px',
                  },
                },
                'Lead generation, sales outreach, and high-value prospecting'
              ),
              React.createElement(
                'div',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                  },
                },
                '• 8 active staff members',
                React.createElement('br'),
                '• Peak performance: 94.2%',
                React.createElement('br'),
                '• 45 tasks completed today'
              )
            ),

            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  },
                },
                React.createElement(
                  'h4',
                  {
                    style: { color: '#8b5cf6', margin: 0, fontSize: '1.1rem' },
                  },
                  '🌇 Afternoon Shift'
                ),
                React.createElement(
                  'span',
                  {
                    style: {
                      color: '#8b5cf6',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    },
                  },
                  '1PM - 9PM'
                )
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    marginBottom: '12px',
                  },
                },
                'Follow-ups, analytics, and relationship building'
              ),
              React.createElement(
                'div',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                  },
                },
                '• 6 active staff members',
                React.createElement('br'),
                '• Steady performance: 87.8%',
                React.createElement('br'),
                '• 32 tasks completed today'
              )
            ),

            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  },
                },
                React.createElement(
                  'h4',
                  {
                    style: { color: '#06b6d4', margin: 0, fontSize: '1.1rem' },
                  },
                  '🌙 Overnight Shift'
                ),
                React.createElement(
                  'span',
                  {
                    style: {
                      color: '#06b6d4',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    },
                  },
                  '10PM - 6AM'
                )
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    marginBottom: '12px',
                  },
                },
                'Maintenance, reporting, and background processing'
              ),
              React.createElement(
                'div',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.8rem',
                  },
                },
                '• 3 active staff members',
                React.createElement('br'),
                '• Low-volume processing: 76.4%',
                React.createElement('br'),
                '• 12 maintenance tasks completed'
              )
            )
          ),

          // Schedule Features
          React.createElement(
            'div',
            {
              style: {
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '20px',
              },
            },
            React.createElement(
              'h4',
              {
                style: {
                  color: 'white',
                  marginBottom: '16px',
                  fontSize: '1.1rem',
                },
              },
              '🎯 Advanced Schedule Management Features'
            ),
            React.createElement(
              'div',
              {
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  },
                },
                '• 🤖 AI-powered shift optimization',
                React.createElement('br'),
                '• ⚡ Real-time workload balancing',
                React.createElement('br'),
                '• 🎯 Smart task distribution',
                React.createElement('br'),
                '• 📊 Performance-based scheduling'
              ),
              React.createElement(
                'div',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  },
                },
                '• 🌍 Multi-timezone coordination',
                React.createElement('br'),
                '• 🔄 Automated shift rotations',
                React.createElement('br'),
                '• 📅 Holiday & event scheduling',
                React.createElement('br'),
                '• ⚠️ Conflict detection & resolution'
              ),
              React.createElement(
                'div',
                {
                  style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  },
                },
                '• 📈 Historical performance analysis',
                React.createElement('br'),
                '• 🎪 Template-based scheduling',
                React.createElement('br'),
                '• 🔧 Manual override capabilities',
                React.createElement('br'),
                '• 📱 Mobile schedule access'
              )
            )
          )
        ),

      // Assignments Tab
      activeTab === 'assignments' &&
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            {
              style: {
                color: 'white',
                marginBottom: '16px',
                fontSize: '1.2rem',
              },
            },
            '🎯 Task Assignments'
          ),
          React.createElement(
            'p',
            {
              style: {
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '20px',
              },
            },
            'Select a staff member, then assign tasks to them'
          ),

          // Staff Selection for Task Assignment
          React.createElement(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              },
            },
            allStaff.map((staff) =>
              React.createElement(
                'div',
                {
                  key: staff.id,
                  onClick: () => setSelectedStaff(staff.id),
                  style: {
                    background:
                      selectedStaff === staff.id
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3))'
                        : 'rgba(0, 0, 0, 0.3)',
                    border:
                      selectedStaff === staff.id
                        ? '2px solid #22c55e'
                        : '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  },
                  onMouseEnter: (e: any) => {
                    if (selectedStaff !== staff.id) {
                      e.currentTarget.style.background =
                        'rgba(34, 197, 94, 0.1)';
                      e.currentTarget.style.borderColor = '#22c55e';
                    }
                  },
                  onMouseLeave: (e: any) => {
                    if (selectedStaff !== staff.id) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor =
                        'rgba(148, 163, 184, 0.2)';
                    }
                  },
                },
                React.createElement(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    },
                  },
                  React.createElement(
                    'div',
                    { style: { fontSize: '2rem' } },
                    staff.avatar
                  ),
                  React.createElement(
                    'div',
                    { style: { flex: 1 } },
                    React.createElement(
                      'h4',
                      {
                        style: {
                          color: 'white',
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: '700',
                        },
                      },
                      staff.name
                    ),
                    React.createElement(
                      'p',
                      {
                        style: {
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: 0,
                          fontSize: '0.85rem',
                        },
                      },
                      staff.role
                    )
                  )
                ),
                React.createElement(
                  'div',
                  {
                    style: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                    },
                  },
                  `📋 ${staffTasks[staff.id]?.length || 0} tasks assigned`,
                  React.createElement('br'),
                  `✓ ${staff.tasksCompleted} completed`
                ),
                selectedStaff === staff.id &&
                  React.createElement(
                    'div',
                    {
                      style: {
                        marginTop: '12px',
                        padding: '8px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        borderRadius: '6px',
                        color: '#22c55e',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textAlign: 'center',
                      },
                    },
                    '✓ SELECTED'
                  )
              )
            )
          ),

          // Task Assignment Panel (shows when staff is selected)
          selectedStaffData &&
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid #22c55e',
                  borderRadius: '12px',
                  padding: '24px',
                  marginTop: '24px',
                },
              },
              React.createElement(
                'h4',
                {
                  style: {
                    color: '#22c55e',
                    marginBottom: '20px',
                    fontSize: '1.2rem',
                  },
                },
                `📋 Assign Task to ${selectedStaffData.name}`
              ),

              React.createElement(
                'div',
                {
                  style: {
                    display: 'grid',
                    gap: '16px',
                    marginBottom: '20px',
                  },
                },

                // Task Type Selection
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    {
                      style: {
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      },
                    },
                    '📌 Task Type'
                  ),
                  React.createElement(
                    'select',
                    {
                      id: 'taskType',
                      style: {
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                      },
                    },
                    React.createElement(
                      'option',
                      { value: 'lead_generation' },
                      '🎯 Lead Generation'
                    ),
                    React.createElement(
                      'option',
                      { value: 'email_campaign' },
                      '📧 Email Campaign'
                    ),
                    React.createElement(
                      'option',
                      { value: 'cold_calling' },
                      '📞 Cold Calling'
                    ),
                    React.createElement(
                      'option',
                      { value: 'follow_up' },
                      '🔄 Follow-up'
                    ),
                    React.createElement(
                      'option',
                      { value: 'data_mining' },
                      '⛏️ Data Mining'
                    ),
                    React.createElement(
                      'option',
                      { value: 'analytics' },
                      '📊 Analytics Report'
                    ),
                    React.createElement(
                      'option',
                      { value: 'customer_service' },
                      '🎧 Customer Service'
                    ),
                    React.createElement(
                      'option',
                      { value: 'recruiting' },
                      '👥 Recruiting'
                    )
                  )
                ),

                // Task Name
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    {
                      style: {
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      },
                    },
                    '✏️ Task Name'
                  ),
                  React.createElement('input', {
                    type: 'text',
                    id: 'taskName',
                    placeholder: 'e.g., Healthcare leads - urgent prospects',
                    style: {
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                    },
                  })
                ),

                // Task Description
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    {
                      style: {
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      },
                    },
                    '📝 Description'
                  ),
                  React.createElement('textarea', {
                    id: 'taskDescription',
                    placeholder:
                      'Describe the task details, targets, and expected outcomes...',
                    rows: 3,
                    style: {
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    },
                  })
                ),

                // Priority
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'label',
                    {
                      style: {
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      },
                    },
                    '⚡ Priority'
                  ),
                  React.createElement(
                    'select',
                    {
                      id: 'taskPriority',
                      style: {
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                      },
                    },
                    React.createElement('option', { value: 'low' }, '🟢 Low'),
                    React.createElement(
                      'option',
                      { value: 'medium' },
                      '🟡 Medium'
                    ),
                    React.createElement('option', { value: 'high' }, '🟠 High'),
                    React.createElement(
                      'option',
                      { value: 'urgent' },
                      '🔴 Urgent'
                    )
                  )
                )
              ),

              React.createElement(
                'button',
                {
                  onClick: () => {
                    const taskType = (
                      document.getElementById('taskType') as HTMLSelectElement
                    )?.value;
                    const taskName = (
                      document.getElementById('taskName') as HTMLInputElement
                    )?.value;
                    const taskDescription = (
                      document.getElementById(
                        'taskDescription'
                      ) as HTMLTextAreaElement
                    )?.value;
                    const taskPriority = (
                      document.getElementById(
                        'taskPriority'
                      ) as HTMLSelectElement
                    )?.value;

                    if (!taskName) {
                      alert('❌ Please enter a task name');
                      return;
                    }

                    const newTask = {
                      id: `task-${Date.now()}`,
                      type: taskType,
                      name: taskName,
                      description: taskDescription,
                      priority: taskPriority,
                      assignedAt: new Date().toISOString(),
                      status: 'assigned',
                    };

                    handleTaskAssignment(selectedStaffData.id, newTask);

                    // Clear form
                    (
                      document.getElementById('taskName') as HTMLInputElement
                    ).value = '';
                    (
                      document.getElementById(
                        'taskDescription'
                      ) as HTMLTextAreaElement
                    ).value = '';
                  },
                  style: {
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '16px',
                  },
                },
                '✅ Assign Task'
              ),

              // Show assigned tasks
              staffTasks[selectedStaffData.id] &&
                staffTasks[selectedStaffData.id].length > 0 &&
                React.createElement(
                  'div',
                  {
                    style: {
                      marginTop: '24px',
                      padding: '16px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                    },
                  },
                  React.createElement(
                    'h5',
                    {
                      style: {
                        color: 'white',
                        marginBottom: '12px',
                        fontSize: '1rem',
                      },
                    },
                    `📋 Current Tasks (${staffTasks[selectedStaffData.id].length})`
                  ),
                  ...staffTasks[selectedStaffData.id].map((task: any) =>
                    React.createElement(
                      'div',
                      {
                        key: task.id,
                        style: {
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '6px',
                          marginBottom: '8px',
                        },
                      },
                      React.createElement(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '8px',
                          },
                        },
                        React.createElement(
                          'h6',
                          {
                            style: {
                              color: 'white',
                              margin: 0,
                              fontSize: '0.95rem',
                              fontWeight: '600',
                            },
                          },
                          task.name
                        ),
                        React.createElement(
                          'span',
                          {
                            style: {
                              padding: '4px 8px',
                              background:
                                task.priority === 'urgent'
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : task.priority === 'high'
                                    ? 'rgba(251, 146, 60, 0.2)'
                                    : task.priority === 'medium'
                                      ? 'rgba(234, 179, 8, 0.2)'
                                      : 'rgba(34, 197, 94, 0.2)',
                              color:
                                task.priority === 'urgent'
                                  ? '#ef4444'
                                  : task.priority === 'high'
                                    ? '#fb923c'
                                    : task.priority === 'medium'
                                      ? '#eab308'
                                      : '#22c55e',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                            },
                          },
                          task.priority.toUpperCase()
                        )
                      ),
                      React.createElement(
                        'p',
                        {
                          style: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: 0,
                            fontSize: '0.85rem',
                          },
                        },
                        task.description || 'No description provided'
                      )
                    )
                  )
                )
            ),
          React.createElement(
            'div',
            {
              style: {
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '16px',
              },
            },
            React.createElement(
              'h4',
              { style: { color: '#f59e0b', marginBottom: '12px' } },
              'Available Tasks'
            ),
            React.createElement(
              'div',
              { style: { color: 'rgba(255, 255, 255, 0.6)' } },
              '• Lead generation campaigns',
              React.createElement('br'),
              '• Customer outreach sequences',
              React.createElement('br'),
              '• Data analysis and reporting',
              React.createElement('br'),
              '• Compliance monitoring',
              React.createElement('br'),
              '• Performance optimization'
            )
          )
        ),

      // Performance Tab
      activeTab === 'performance' &&
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            {
              style: {
                color: 'white',
                marginBottom: '16px',
                fontSize: '1.2rem',
              },
            },
            '📈 Performance Analytics'
          ),
          React.createElement(
            'p',
            {
              style: {
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '16px',
              },
            },
            'Track individual and team performance metrics across all departments.'
          ),
          React.createElement(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              },
            },
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                },
              },
              React.createElement(
                'h4',
                { style: { color: '#22c55e', marginBottom: '8px' } },
                'Success Rate'
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                  },
                },
                '--%'
              )
            ),
            React.createElement(
              'div',
              {
                style: {
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                },
              },
              React.createElement(
                'h4',
                { style: { color: '#ef4444', marginBottom: '8px' } },
                'Response Time'
              ),
              React.createElement(
                'p',
                {
                  style: {
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                  },
                },
                '--ms'
              )
            )
          )
        ),

      // Templates Tab
      activeTab === 'templates' &&
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            {
              style: {
                color: 'white',
                marginBottom: '16px',
                fontSize: '1.2rem',
              },
            },
            '📝 Schedule Templates'
          ),
          React.createElement(
            'p',
            {
              style: {
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '16px',
              },
            },
            'Pre-configured schedule templates for different business scenarios.'
          ),
          React.createElement(
            'div',
            { style: { color: 'rgba(255, 255, 255, 0.6)' } },
            'Templates will be available for:',
            React.createElement('br'),
            '• High-volume lead generation periods',
            React.createElement('br'),
            '• Holiday and peak season schedules',
            React.createElement('br'),
            '• Maintenance and system updates',
            React.createElement('br'),
            '• Custom department configurations'
          )
        ),

      // Analytics Tab
      activeTab === 'analytics' &&
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            {
              style: {
                color: 'white',
                marginBottom: '16px',
                fontSize: '1.2rem',
              },
            },
            '📊 Advanced Analytics'
          ),
          React.createElement(
            'p',
            {
              style: {
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '16px',
              },
            },
            'Deep insights into AI staff performance, workload distribution, and optimization opportunities.'
          ),
          React.createElement(
            'div',
            {
              style: {
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '16px',
              },
            },
            React.createElement(
              'h4',
              { style: { color: '#8b5cf6', marginBottom: '12px' } },
              'Available Analytics'
            ),
            React.createElement(
              'div',
              { style: { color: 'rgba(255, 255, 255, 0.6)' } },
              '• Workload distribution analysis',
              React.createElement('br'),
              '• Performance trend analysis',
              React.createElement('br'),
              '• Cost optimization insights',
              React.createElement('br'),
              '• Peak usage pattern detection',
              React.createElement('br'),
              '• Efficiency correlation studies'
            )
          )
        )
    )
  );
}
