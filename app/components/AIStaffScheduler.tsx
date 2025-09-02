'use client';

import { Activity, TrendingUp, Zap } from 'lucide-react';
import React, { useState } from 'react';

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

export default function AIStaffScheduler(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('overview');

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
            'Comprehensive AI staff scheduling with automated optimization, conflict resolution, and performance tracking.'
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
                marginBottom: '16px',
              },
            },
            'Assign specific tasks and campaigns to your AI staff members.'
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
