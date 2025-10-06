'use client';

import {
  Brain,
  Calendar,
  Clock,
  DollarSign,
  Lightbulb,
  Phone,
  Plus,
  Save,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface NewTask {
  title: string;
  description: string;
  type:
    | 'lead_generation'
    | 'outreach'
    | 'research'
    | 'compliance'
    | 'support'
    | 'analysis'
    | 'email_monitoring'
    | 'phone_answering'
    | 'email_response'
    | 'call_routing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[];
  targetProspects: {
    type: string;
    quantity: number;
    criteria: string[];
  };
  schedule: {
    isRecurring: boolean;
    recurringDays: string[]; // ['monday', 'wednesday', 'friday']
    startTime: string;
    endTime: string;
    duration: number; // hours per day
    startDate: string;
    endDate?: string; // optional end date for recurring tasks
  };
  deadline: string;
  estimatedRevenue: number;
  contactMethods: string[];
  specialInstructions: string;
}

interface TaskCreationInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreate: (task: NewTask) => void;
  availableStaff: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
    avatar: string;
  }>;
}

export default function TaskCreationInterface({
  isOpen,
  onClose,
  onTaskCreate,
  availableStaff,
}: TaskCreationInterfaceProps) {
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    type: 'lead_generation',
    priority: 'medium',
    assignedTo: [],
    targetProspects: {
      type: '',
      quantity: 50,
      criteria: [],
    },
    schedule: {
      isRecurring: false,
      recurringDays: [],
      startTime: '09:00',
      endTime: '17:00',
      duration: 8,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    },
    deadline: '',
    estimatedRevenue: 0,
    contactMethods: [],
    specialInstructions: '',
  });

  const [currentCriteria, setCurrentCriteria] = useState('');
  const [currentMethod, setCurrentMethod] = useState('');

  // AI Features State
  const [aiSuggestions, setAiSuggestions] = useState<{
    staffRecommendations: Array<{
      id: string;
      reason: string;
      confidence: number;
    }>;
    scheduleOptimizations: Array<{ suggestion: string; impact: string }>;
    taskImprovements: Array<{ area: string; recommendation: string }>;
    conflictWarnings: Array<{
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  }>({
    staffRecommendations: [],
    scheduleOptimizations: [],
    taskImprovements: [],
    conflictWarnings: [],
  });
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const taskTypes = [
    { value: 'lead_generation', label: 'Lead Generation', icon: '🎯' },
    { value: 'outreach', label: 'Prospect Outreach', icon: '📞' },
    { value: 'research', label: 'Market Research', icon: '🔍' },
    { value: 'compliance', label: 'Compliance Check', icon: '✅' },
    { value: 'support', label: 'Customer Support', icon: '🛟' },
    { value: 'analysis', label: 'Data Analysis', icon: '📊' },
    { value: 'email_monitoring', label: 'Email Monitoring', icon: '📧' },
    { value: 'phone_answering', label: 'Phone Answering', icon: '📞' },
    { value: 'email_response', label: 'Email Response', icon: '✉️' },
    { value: 'call_routing', label: 'Call Routing', icon: '📱' },
  ];

  const priorityLevels = [
    {
      value: 'low',
      label: 'Low Priority',
      color: 'text-green-500',
      bg: 'bg-green-500/20',
    },
    {
      value: 'medium',
      label: 'Medium Priority',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/20',
    },
    {
      value: 'high',
      label: 'High Priority',
      color: 'text-orange-500',
      bg: 'bg-orange-500/20',
    },
    {
      value: 'urgent',
      label: 'Urgent',
      color: 'text-red-500',
      bg: 'bg-red-500/20',
    },
  ];

  const prospectTypes = [
    'Desperate Shippers',
    'New Manufacturers',
    'Safety Violators',
    'High-Volume Carriers',
    'Owner-Operators',
    'Private Fleets',
    'Brokers',
    'Freight Forwarders',
  ];

  const contactMethodOptions = [
    'Cold Calling',
    'Email Campaign',
    'LinkedIn Outreach',
    'Direct Mail',
    'Warm Referrals',
    'Social Media',
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Monday', short: 'Mon' },
    { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { value: 'thursday', label: 'Thursday', short: 'Thu' },
    { value: 'friday', label: 'Friday', short: 'Fri' },
    { value: 'saturday', label: 'Saturday', short: 'Sat' },
    { value: 'sunday', label: 'Sunday', short: 'Sun' },
  ];

  const handleAddCriteria = () => {
    if (currentCriteria.trim()) {
      setNewTask((prev) => ({
        ...prev,
        targetProspects: {
          ...prev.targetProspects,
          criteria: [...prev.targetProspects.criteria, currentCriteria.trim()],
        },
      }));
      setCurrentCriteria('');
    }
  };

  const handleAddContactMethod = () => {
    if (currentMethod && !newTask.contactMethods.includes(currentMethod)) {
      setNewTask((prev) => ({
        ...prev,
        contactMethods: [...prev.contactMethods, currentMethod],
      }));
      setCurrentMethod('');
    }
  };

  const handleStaffToggle = (staffId: string) => {
    setNewTask((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(staffId)
        ? prev.assignedTo.filter((id) => id !== staffId)
        : [...prev.assignedTo, staffId],
    }));
  };

  const handleDayToggle = (day: string) => {
    setNewTask((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        recurringDays: prev.schedule.recurringDays.includes(day)
          ? prev.schedule.recurringDays.filter((d) => d !== day)
          : [...prev.schedule.recurringDays, day],
      },
    }));
  };

  // AI Analysis Functions
  const generateAiSuggestions = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const suggestions = {
      staffRecommendations: generateStaffRecommendations(),
      scheduleOptimizations: generateScheduleOptimizations(),
      taskImprovements: generateTaskImprovements(),
      conflictWarnings: detectConflicts(),
    };

    setAiSuggestions(suggestions);
    setIsAnalyzing(false);
    setShowAiInsights(true);
  };

  const generateStaffRecommendations = () => {
    const recommendations = [];

    // Analyze task type and recommend best staff
    if (newTask.type === 'lead_generation') {
      if (newTask.targetProspects.type === 'Desperate Shippers') {
        recommendations.push({
          id: 'desiree',
          reason:
            '🎯 Desiree specializes in desperate prospects with 94.2% success rate',
          confidence: 95,
        });
        recommendations.push({
          id: 'cliff',
          reason:
            '⛰️ Cliff excels at edge-case prospects and urgent situations',
          confidence: 92,
        });
      } else {
        recommendations.push({
          id: 'gary',
          reason:
            '📈 Gary handles general lead generation with 89.2% completion rate',
          confidence: 88,
        });
      }
    }

    if (newTask.type === 'outreach') {
      recommendations.push({
        id: 'will',
        reason: '💼 Will has highest revenue per contact ($67,500 monthly)',
        confidence: 96,
      });
    }

    return recommendations;
  };

  const generateScheduleOptimizations = () => {
    const optimizations = [];

    if (
      newTask.schedule.isRecurring &&
      newTask.schedule.recurringDays.includes('friday')
    ) {
      optimizations.push({
        suggestion:
          'Move Friday tasks to Thursday for 15% better conversion rates',
        impact: '🚀 Expected 15% improvement in lead quality',
      });
    }

    if (newTask.schedule.startTime < '09:00') {
      optimizations.push({
        suggestion:
          'Early morning (6-9 AM) shows 23% higher response rates for desperate prospects',
        impact: '📈 +23% response rate for urgent leads',
      });
    }

    if (newTask.schedule.duration > 6) {
      optimizations.push({
        suggestion: 'Split long tasks into 4-hour blocks to maintain quality',
        impact: '✨ Maintains 95%+ efficiency throughout the day',
      });
    }

    return optimizations;
  };

  const generateTaskImprovements = () => {
    const improvements = [];

    if (newTask.targetProspects.quantity > 100) {
      improvements.push({
        area: 'Target Quantity',
        recommendation:
          'Consider 50-75 prospects for higher quality conversion (vs quantity approach)',
      });
    }

    if (newTask.contactMethods.length < 2) {
      improvements.push({
        area: 'Multi-Channel Approach',
        recommendation: 'Add LinkedIn + Email for 34% higher response rates',
      });
    }

    if (!newTask.deadline && newTask.type === 'lead_generation') {
      improvements.push({
        area: 'Urgency Factor',
        recommendation: 'Set 7-day deadline to create urgency and focus',
      });
    }

    return improvements;
  };

  const detectConflicts = () => {
    const conflicts = [];

    // Check if multiple staff assigned to same time slots
    if (newTask.assignedTo.length > 3) {
      conflicts.push({
        type: 'Resource Conflict',
        message:
          'Too many staff assigned - may dilute focus and accountability',
        severity: 'medium' as const,
      });
    }

    // Check for weekend scheduling issues
    if (
      newTask.schedule.recurringDays.includes('saturday') ||
      newTask.schedule.recurringDays.includes('sunday')
    ) {
      conflicts.push({
        type: 'Schedule Warning',
        message:
          'Weekend work shows 40% lower response rates for B2B prospects',
        severity: 'low' as const,
      });
    }

    // Check for unrealistic revenue expectations
    if (
      newTask.estimatedRevenue > 10000 &&
      newTask.targetProspects.quantity < 20
    ) {
      conflicts.push({
        type: 'Revenue Expectation',
        message:
          'High revenue target with low prospect count - may need more leads',
        severity: 'high' as const,
      });
    }

    return conflicts;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidRecurring =
      !newTask.schedule.isRecurring ||
      newTask.schedule.recurringDays.length > 0;

    if (newTask.title && newTask.assignedTo.length > 0 && isValidRecurring) {
      onTaskCreate(newTask);
      onClose();
      // Reset form
      setNewTask({
        title: '',
        description: '',
        type: 'lead_generation',
        priority: 'medium',
        assignedTo: [],
        targetProspects: { type: '', quantity: 50, criteria: [] },
        schedule: {
          isRecurring: false,
          recurringDays: [],
          startTime: '09:00',
          endTime: '17:00',
          duration: 8,
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
        },
        deadline: '',
        estimatedRevenue: 0,
        contactMethods: [],
        specialInstructions: '',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxHeight: '90vh',
          width: '100%',
          maxWidth: '1000px',
          overflowY: 'auto',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background:
            'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(30, 64, 175, 0.95) 50%, rgba(59, 130, 246, 0.9) 100%)',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px 32px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              }}
            >
              <Plus style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                Create New Task
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                }}
              >
                Assign work to your AI staff
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <X style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>
        </div>

        {/* AI Insights Panel */}
        {showAiInsights && (
          <div className='border-b border-slate-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='flex items-center gap-2 text-lg font-semibold text-white'>
                <Brain className='h-5 w-5 text-blue-400' />
                AI Task Optimization
              </h3>
              <button
                type='button'
                onClick={() => setShowAiInsights(false)}
                className='text-slate-400 hover:text-white'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            {/* Staff Recommendations */}
            {aiSuggestions.staffRecommendations.length > 0 && (
              <div className='mb-6'>
                <h4 className='mb-3 flex items-center gap-2 text-sm font-medium text-blue-300'>
                  <Users className='h-4 w-4' />
                  Recommended Staff
                </h4>
                <div className='space-y-2'>
                  {aiSuggestions.staffRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded-lg bg-slate-800/50 p-3'
                    >
                      <span className='text-sm text-slate-300'>
                        {rec.reason}
                      </span>
                      <div className='flex items-center gap-2'>
                        <div className='text-xs text-green-400'>
                          {rec.confidence}% match
                        </div>
                        <button
                          type='button'
                          onClick={() => {
                            if (!newTask.assignedTo.includes(rec.id)) {
                              handleStaffToggle(rec.id);
                            }
                          }}
                          className='rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700'
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule Optimizations */}
            {aiSuggestions.scheduleOptimizations.length > 0 && (
              <div className='mb-6'>
                <h4 className='mb-3 flex items-center gap-2 text-sm font-medium text-green-300'>
                  <TrendingUp className='h-4 w-4' />
                  Schedule Optimizations
                </h4>
                <div className='space-y-2'>
                  {aiSuggestions.scheduleOptimizations.map((opt, index) => (
                    <div key={index} className='rounded-lg bg-slate-800/50 p-3'>
                      <div className='text-sm text-slate-300'>
                        {opt.suggestion}
                      </div>
                      <div className='text-xs text-green-400'>{opt.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Task Improvements */}
            {aiSuggestions.taskImprovements.length > 0 && (
              <div className='mb-6'>
                <h4 className='mb-3 flex items-center gap-2 text-sm font-medium text-yellow-300'>
                  <Lightbulb className='h-4 w-4' />
                  Task Improvements
                </h4>
                <div className='space-y-2'>
                  {aiSuggestions.taskImprovements.map((imp, index) => (
                    <div key={index} className='rounded-lg bg-slate-800/50 p-3'>
                      <div className='text-sm font-medium text-yellow-300'>
                        {imp.area}
                      </div>
                      <div className='text-sm text-slate-300'>
                        {imp.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflict Warnings */}
            {aiSuggestions.conflictWarnings.length > 0 && (
              <div className='mb-4'>
                <h4 className='mb-3 flex items-center gap-2 text-sm font-medium text-red-300'>
                  <Zap className='h-4 w-4' />
                  Potential Issues
                </h4>
                <div className='space-y-2'>
                  {aiSuggestions.conflictWarnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 ${
                        warning.severity === 'high'
                          ? 'border border-red-700/50 bg-red-900/20'
                          : warning.severity === 'medium'
                            ? 'border border-yellow-700/50 bg-yellow-900/20'
                            : 'bg-slate-800/50'
                      }`}
                    >
                      <div className='text-sm font-medium text-slate-200'>
                        {warning.type}
                      </div>
                      <div className='text-sm text-slate-400'>
                        {warning.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Smart Templates */}
          <div style={{ marginBottom: '32px' }}>
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              <Lightbulb
                style={{ width: '20px', height: '20px', color: '#fbbf24' }}
              />
              Quick Start Templates
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              }}
            >
              <button
                type='button'
                onClick={() => {
                  setNewTask({
                    title: 'Target Desperate Shippers - Mon/Wed/Fri',
                    description:
                      'Focus on companies with safety violations, compliance issues, or urgent freight needs',
                    type: 'lead_generation',
                    priority: 'high',
                    assignedTo: ['desiree', 'cliff'],
                    targetProspects: {
                      type: 'Desperate Shippers',
                      quantity: 50,
                      criteria: [
                        'Safety violations',
                        'Late payments',
                        'Urgent freight needs',
                      ],
                    },
                    schedule: {
                      isRecurring: true,
                      recurringDays: ['monday', 'wednesday', 'friday'],
                      startTime: '08:00',
                      endTime: '16:00',
                      duration: 6,
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '',
                    },
                    deadline: '',
                    estimatedRevenue: 8500,
                    contactMethods: ['Cold Calling', 'Email Campaign'],
                    specialInstructions:
                      'Focus on companies showing signs of desperation - safety issues, cash flow problems, or urgent needs',
                  });
                }}
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #dc2626, #f97316)',
                  padding: '20px',
                  textAlign: 'left',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(220, 38, 38, 0.3)';
                }}
              >
                <div style={{ marginBottom: '12px', fontSize: '24px' }}>🎯</div>
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    marginBottom: '4px',
                  }}
                >
                  Desperate Shippers
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  High-urgency prospects, M/W/F
                </div>
              </button>

              <button
                type='button'
                onClick={() => {
                  setNewTask({
                    title: 'General Lead Generation - Daily',
                    description:
                      'Systematic lead generation across all prospect types with focus on volume and quality',
                    type: 'lead_generation',
                    priority: 'medium',
                    assignedTo: ['gary', 'drew'],
                    targetProspects: {
                      type: 'New Manufacturers',
                      quantity: 100,
                      criteria: [
                        'Fortune 500',
                        'Growing companies',
                        'Multiple locations',
                      ],
                    },
                    schedule: {
                      isRecurring: true,
                      recurringDays: [
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                      ],
                      startTime: '09:00',
                      endTime: '17:00',
                      duration: 8,
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '',
                    },
                    deadline: '',
                    estimatedRevenue: 15000,
                    contactMethods: [
                      'LinkedIn Outreach',
                      'Email Campaign',
                      'Cold Calling',
                    ],
                    specialInstructions:
                      'Focus on building long-term relationships and sustainable growth',
                  });
                }}
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  padding: '20px',
                  textAlign: 'left',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <div style={{ marginBottom: '12px', fontSize: '24px' }}>📈</div>
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    marginBottom: '4px',
                  }}
                >
                  Growth Focus
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  Volume-based lead gen, daily
                </div>
              </button>

              <button
                type='button'
                onClick={() => {
                  setNewTask({
                    title: 'Carrier Recruitment Drive',
                    description:
                      'Aggressive owner-operator and carrier recruitment campaign',
                    type: 'outreach',
                    priority: 'high',
                    assignedTo: ['hunter', 'carrie', 'will'],
                    targetProspects: {
                      type: 'Owner-Operators',
                      quantity: 75,
                      criteria: [
                        'Independent drivers',
                        'Small fleets',
                        'Regional carriers',
                      ],
                    },
                    schedule: {
                      isRecurring: true,
                      recurringDays: ['tuesday', 'thursday'],
                      startTime: '07:00',
                      endTime: '15:00',
                      duration: 8,
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '',
                    },
                    deadline: '',
                    estimatedRevenue: 12000,
                    contactMethods: [
                      'Cold Calling',
                      'Social Media',
                      'Direct Mail',
                    ],
                    specialInstructions:
                      'Target drivers looking for better rates, consistent loads, and reliable payments',
                  });
                }}
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #059669, #14b8a6)',
                  padding: '20px',
                  textAlign: 'left',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(5, 150, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(5, 150, 105, 0.3)';
                }}
              >
                <div style={{ marginBottom: '12px', fontSize: '24px' }}>🚛</div>
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    marginBottom: '4px',
                  }}
                >
                  Carrier Recruitment
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  Driver & carrier focus, Tue/Thu
                </div>
              </button>
            </div>
          </div>

          {/* Basic Task Info */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='lg:col-span-2'>
              <label className='mb-2 block text-sm font-medium text-white'>
                Task Title *
              </label>
              <input
                type='text'
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder='e.g., Generate desperate shipper leads in Texas'
                className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                required
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-white'>
                Task Type *
              </label>
              <select
                value={newTask.type}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    type: e.target.value as any,
                  }))
                }
                className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                {taskTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-white'>
                Priority Level *
              </label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    priority: e.target.value as any,
                  }))
                }
                className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                {priorityLevels.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Analysis Trigger */}
          <div className='flex items-center justify-between rounded-lg border border-blue-700/50 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600'>
                <Brain className='h-5 w-5 text-white' />
              </div>
              <div>
                <h4 className='font-semibold text-white'>
                  AI Task Optimization
                </h4>
                <p className='text-sm text-slate-400'>
                  Get smart suggestions for staff, scheduling, and task
                  improvements
                </p>
              </div>
            </div>
            <button
              type='button'
              onClick={generateAiSuggestions}
              disabled={!newTask.title || isAnalyzing}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-all ${
                isAnalyzing
                  ? 'cursor-wait bg-blue-500'
                  : newTask.title
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'cursor-not-allowed bg-slate-600'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className='h-4 w-4' />
                  Get AI Insights
                </>
              )}
            </button>
          </div>

          {/* Description */}
          <div>
            <label className='mb-2 block text-sm font-medium text-white'>
              Task Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder='Detailed instructions for the AI staff...'
              rows={3}
              className='w-full resize-none rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>

          {/* Target Prospects */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-white'>
              <Target className='h-5 w-5' />
              Target Prospects
            </h3>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Prospect Type
                </label>
                <select
                  value={newTask.targetProspects.type}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      targetProspects: {
                        ...prev.targetProspects,
                        type: e.target.value,
                      },
                    }))
                  }
                  className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                >
                  <option value=''>Select prospect type</option>
                  {prospectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Target Quantity
                </label>
                <input
                  type='number'
                  value={newTask.targetProspects.quantity}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      targetProspects: {
                        ...prev.targetProspects,
                        quantity: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  min='1'
                  className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Expected Revenue
                </label>
                <div className='relative'>
                  <DollarSign className='absolute top-3.5 left-3 h-4 w-4 text-slate-400' />
                  <input
                    type='number'
                    value={newTask.estimatedRevenue}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        estimatedRevenue: parseFloat(e.target.value) || 0,
                      }))
                    }
                    min='0'
                    step='100'
                    placeholder='5000'
                    className='w-full rounded-lg border border-slate-600 bg-slate-800 py-3 pr-4 pl-10 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>

            {/* Targeting Criteria */}
            <div>
              <label className='mb-2 block text-sm font-medium text-white'>
                Targeting Criteria
              </label>
              <div className='mb-2 flex gap-2'>
                <input
                  type='text'
                  value={currentCriteria}
                  onChange={(e) => setCurrentCriteria(e.target.value)}
                  placeholder='e.g., Companies with safety violations'
                  className='flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddCriteria())
                  }
                />
                <button
                  type='button'
                  onClick={handleAddCriteria}
                  className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
                >
                  Add
                </button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {newTask.targetProspects.criteria.map((criteria, index) => (
                  <span
                    key={index}
                    className='flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-sm text-white'
                  >
                    {criteria}
                    <button
                      type='button'
                      onClick={() =>
                        setNewTask((prev) => ({
                          ...prev,
                          targetProspects: {
                            ...prev.targetProspects,
                            criteria: prev.targetProspects.criteria.filter(
                              (_, i) => i !== index
                            ),
                          },
                        }))
                      }
                      className='text-slate-400 hover:text-white'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
              <Phone className='h-5 w-5' />
              Contact Methods
            </h3>
            <div className='mb-2 flex gap-2'>
              <select
                value={currentMethod}
                onChange={(e) => setCurrentMethod(e.target.value)}
                className='flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                <option value=''>Select contact method</option>
                {contactMethodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              <button
                type='button'
                onClick={handleAddContactMethod}
                className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
              >
                Add
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {newTask.contactMethods.map((method, index) => (
                <span
                  key={index}
                  className='flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-sm text-white'
                >
                  {method}
                  <button
                    type='button'
                    onClick={() =>
                      setNewTask((prev) => ({
                        ...prev,
                        contactMethods: prev.contactMethods.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className='text-slate-400 hover:text-white'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Task Scheduling */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-white'>
              <Clock className='h-5 w-5' />
              Task Scheduling
            </h3>

            {/* Recurring vs One-time */}
            <div>
              <label className='mb-3 block text-sm font-medium text-white'>
                Schedule Type
              </label>
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() =>
                    setNewTask((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule, isRecurring: false },
                    }))
                  }
                  className={`rounded-lg border px-4 py-2 font-medium transition-all ${
                    !newTask.schedule.isRecurring
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  One-time Task
                </button>
                <button
                  type='button'
                  onClick={() =>
                    setNewTask((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule, isRecurring: true },
                    }))
                  }
                  className={`rounded-lg border px-4 py-2 font-medium transition-all ${
                    newTask.schedule.isRecurring
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Recurring Schedule
                </button>
              </div>
            </div>

            {/* Recurring Days Selection */}
            {newTask.schedule.isRecurring && (
              <div>
                <label className='mb-3 block text-sm font-medium text-white'>
                  Select Days * ({newTask.schedule.recurringDays.length}{' '}
                  selected)
                </label>
                <div className='grid grid-cols-7 gap-2'>
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type='button'
                      onClick={() => handleDayToggle(day.value)}
                      className={`rounded-lg border p-3 text-center transition-all ${
                        newTask.schedule.recurringDays.includes(day.value)
                          ? 'border-green-500 bg-green-600 text-white'
                          : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className='text-xs font-medium'>{day.short}</div>
                    </button>
                  ))}
                </div>
                {newTask.schedule.isRecurring &&
                  newTask.schedule.recurringDays.length === 0 && (
                    <p className='mt-2 text-sm text-yellow-400'>
                      ⚠️ Please select at least one day for recurring tasks
                    </p>
                  )}
              </div>
            )}

            {/* Time and Duration */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Start Time
                </label>
                <input
                  type='time'
                  value={newTask.schedule.startTime}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule, startTime: e.target.value },
                    }))
                  }
                  className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  End Time
                </label>
                <input
                  type='time'
                  value={newTask.schedule.endTime}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule, endTime: e.target.value },
                    }))
                  }
                  className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Hours per Day
                </label>
                <input
                  type='number'
                  value={newTask.schedule.duration}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        duration: parseInt(e.target.value) || 1,
                      },
                    }))
                  }
                  min='1'
                  max='24'
                  className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Start Date
                </label>
                <input
                  type='date'
                  value={newTask.schedule.startDate}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule, startDate: e.target.value },
                    }))
                  }
                  className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>
            </div>

            {/* End Date for Recurring */}
            {newTask.schedule.isRecurring && (
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>
                    End Date (Optional)
                  </label>
                  <input
                    type='date'
                    value={newTask.schedule.endDate}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, endDate: e.target.value },
                      }))
                    }
                    className='w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    placeholder='Leave blank for indefinite'
                  />
                </div>
                <div className='flex items-end'>
                  <div className='text-sm text-slate-400'>
                    Leave end date blank for recurring tasks that run
                    indefinitely
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Preview */}
            {newTask.schedule.isRecurring &&
              newTask.schedule.recurringDays.length > 0 && (
                <div className='rounded-lg border border-slate-600 bg-slate-800 p-4'>
                  <h4 className='mb-2 text-sm font-medium text-white'>
                    📅 Schedule Preview:
                  </h4>
                  <p className='text-sm text-slate-300'>
                    <strong>{newTask.title || 'This task'}</strong> will run on{' '}
                    <strong className='text-green-400'>
                      {newTask.schedule.recurringDays
                        .map(
                          (day) =>
                            daysOfWeek.find((d) => d.value === day)?.label
                        )
                        .join(', ')}
                    </strong>{' '}
                    from <strong>{newTask.schedule.startTime}</strong> to{' '}
                    <strong>{newTask.schedule.endTime}</strong> (
                    {newTask.schedule.duration} hours/day)
                    {newTask.schedule.endDate && (
                      <>
                        {' '}
                        until <strong>{newTask.schedule.endDate}</strong>
                      </>
                    )}
                  </p>
                </div>
              )}
          </div>

          {/* AI Staff Assignment */}
          <div>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='flex items-center gap-2 text-lg font-semibold text-white'>
                <Users className='h-5 w-5' />
                Assign AI Staff * ({newTask.assignedTo.length} selected)
              </h3>

              {/* Quick Assignment Presets */}
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => {
                    setNewTask((prev) => ({
                      ...prev,
                      assignedTo: ['desiree', 'cliff', 'will'],
                    }));
                  }}
                  className='rounded bg-purple-600 px-3 py-1 text-xs text-white hover:bg-purple-700'
                >
                  🎯 Desperate Team
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setNewTask((prev) => ({
                      ...prev,
                      assignedTo: ['gary', 'drew', 'will'],
                    }));
                  }}
                  className='rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700'
                >
                  📈 Growth Team
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setNewTask((prev) => ({
                      ...prev,
                      assignedTo: [],
                    }));
                  }}
                  className='rounded bg-slate-600 px-3 py-1 text-xs text-white hover:bg-slate-700'
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
              {availableStaff.map((staff) => (
                <button
                  key={staff.id}
                  type='button'
                  onClick={() => handleStaffToggle(staff.id)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    newTask.assignedTo.includes(staff.id)
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className='text-2xl'>{staff.avatar}</div>
                    <div>
                      <p className='font-medium'>{staff.name}</p>
                      <p className='text-sm opacity-80'>{staff.role}</p>
                      <p className='text-xs opacity-60'>{staff.department}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline & Special Instructions */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-medium text-white'>
                Deadline (Optional)
              </label>
              <div className='relative'>
                <Calendar className='absolute top-3.5 left-3 h-4 w-4 text-slate-400' />
                <input
                  type='date'
                  value={newTask.deadline}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                  className='w-full rounded-lg border border-slate-600 bg-slate-800 py-3 pr-4 pl-10 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-white'>
                Special Instructions
              </label>
              <textarea
                value={newTask.specialInstructions}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    specialInstructions: e.target.value,
                  }))
                }
                placeholder='Any specific requirements or notes...'
                rows={3}
                className='w-full resize-none rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className='flex justify-end gap-4 border-t border-slate-700 pt-6'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={
                !newTask.title ||
                newTask.assignedTo.length === 0 ||
                (newTask.schedule.isRecurring &&
                  newTask.schedule.recurringDays.length === 0)
              }
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-600'
            >
              <Save className='h-4 w-4' />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
