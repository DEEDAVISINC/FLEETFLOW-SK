'use client';

import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: GuideStep[];
  tips?: string[];
}

interface GuideStep {
  title: string;
  description: string;
  screenshot?: string;
  action?: string;
}

export default function CRMUserGuide({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const guideSections: GuideSection[] = [
    {
      id: 'navigation',
      title: '🏠 Dashboard Navigation',
      icon: <BarChart3 className='h-5 w-5' />,
      description:
        'Learn how to navigate your Depointe AI dashboard and access all CRM features.',
      steps: [
        {
          title: 'Main Navigation Tabs',
          description:
            'Your dashboard has several main sections accessible via the top navigation: Overview, CRM & Leads, AI Staff Scheduler, Calendly, Campaigns, and Analytics. Click any tab to switch views.',
          action:
            'Try clicking different navigation tabs to explore each section.',
        },
        {
          title: 'Quick Access Buttons',
          description:
            'Look for the floating Quantum AI Virtual Assistant (chat bubble) in the bottom-right corner for instant help with booking appointments.',
          action:
            'Click the blue chat bubble to start a conversation with the AI assistant.',
        },
        {
          title: 'Settings & Preferences',
          description:
            'Access system settings through the gear icon to customize your dashboard experience and notification preferences.',
          action: 'Explore the settings menu to personalize your workflow.',
        },
      ],
    },
    {
      id: 'crm-leads',
      title: '🎯 Managing Leads & Prospects',
      icon: <Users className='h-5 w-5' />,
      description:
        'Everything you need to know about managing your freight brokerage leads and prospects.',
      steps: [
        {
          title: 'Viewing Your Leads',
          description:
            'Go to the "CRM & Leads" tab to see all your leads. Each lead card shows company name, contact info, status, estimated value, and last activity.',
          action: 'Navigate to CRM & Leads tab and review your lead database.',
        },
        {
          title: 'Lead Status Management',
          description:
            'Update lead status by clicking the status dropdown on each lead card. Options include: New, Contacted, Qualified, Proposal, Negotiating, Closed Won, Closed Lost.',
          action:
            "Try updating a lead's status by clicking the status dropdown.",
        },
        {
          title: 'Adding New Leads',
          description:
            'Leads are automatically created from your campaign responses and Calendly bookings. You can also manually add leads using the "Add Lead" button.',
          action: 'Look for the "Add Lead" button in the CRM section.',
        },
        {
          title: 'Lead Scoring & Qualification',
          description:
            'Your AI system automatically scores leads based on 50+ criteria including company size, freight needs, timeline, and engagement level.',
          action: 'Check the lead score indicator on each lead card.',
        },
      ],
      tips: [
        'Always update lead status after phone calls or emails',
        'Use the search bar to quickly find specific leads',
        'Review high-scoring leads daily for best results',
      ],
    },
    {
      id: 'appointments',
      title: '📅 Appointment Scheduling',
      icon: <Calendar className='h-5 w-5' />,
      description:
        'Master your Calendly integration and appointment booking system.',
      steps: [
        {
          title: 'Calendly Integration Setup',
          description:
            'Your system is already connected to Calendly V2 API. Go to the "Calendly" tab to manage your appointment types and view upcoming bookings.',
          action: 'Visit the Calendly tab to see your appointment settings.',
        },
        {
          title: 'Appointment Types',
          description:
            'You have four appointment types: Discovery Call (30min), Strategy Session (60min), Proposal Review (45min), and Follow-up Call (30min).',
          action: 'Review each appointment type and its booking URL.',
        },
        {
          title: 'Manual Booking',
          description:
            'Click any appointment type in the Calendly section to open the booking page. Copy booking links to share with prospects.',
          action:
            'Try clicking on "Book Discovery Call" to see the booking process.',
        },
        {
          title: 'AI-Powered Booking Assistant',
          description:
            'Use the Quantum AI Virtual Assistant (chat bubble) to help prospects book appointments conversationally. The AI qualifies leads and guides them through booking.',
          action:
            'Click the chat bubble and ask "I need to book an appointment"',
        },
      ],
      tips: [
        'Share your Calendly links in email signatures and proposals',
        'The AI assistant can handle booking conversations 24/7',
        'Check upcoming appointments daily to prepare for meetings',
      ],
    },
    {
      id: 'campaigns',
      title: '🚀 Campaign Management',
      icon: <Target className='h-5 w-5' />,
      description:
        'Learn how to create, launch, and manage your freight brokerage campaigns.',
      steps: [
        {
          title: 'Campaign Templates',
          description:
            'Go to the "Campaigns" tab to browse pre-built campaign templates. Each template includes email sequences, phone scripts, and success metrics.',
          action: 'Navigate to Campaigns tab and explore available templates.',
        },
        {
          title: 'Template Selection',
          description:
            'Click on any campaign template to view details including target audience, expected results, and step-by-step execution plan.',
          action: 'Click on a campaign template to see its full details.',
        },
        {
          title: 'Campaign Launch',
          description:
            'After selecting a template, click "Launch Campaign" to start the automated sequence. The system will begin contacting prospects immediately.',
          action: 'Try launching a campaign (it will show a preview first).',
        },
        {
          title: 'Campaign Monitoring',
          description:
            'Track campaign performance in real-time. Monitor leads generated, response rates, and conversion metrics.',
          action: 'Check the campaign performance metrics after launch.',
        },
      ],
      tips: [
        'Start with the "Desperate Shippers Blitz" for immediate revenue',
        'Monitor campaign results daily and adjust as needed',
        'Use follow-up campaigns for leads that need nurturing',
      ],
    },
    {
      id: 'ai-staff',
      title: '🤖 AI Staff Management',
      icon: <Zap className='h-5 w-5' />,
      description: 'Manage your AI workforce and optimize their performance.',
      steps: [
        {
          title: 'Staff Overview',
          description:
            'Visit the "AI Staff Scheduler" tab to see all 18 DEPOINTE AI staff members across different departments.',
          action: 'Go to AI Staff Scheduler to see your team.',
        },
        {
          title: 'Department Breakdown',
          description:
            'Your AI staff is organized into departments: Financial, Technology, Freight Operations, Relationships, Compliance & Safety, Support & Service, Business Development.',
          action: 'Explore each department to understand staff roles.',
        },
        {
          title: 'Schedule Management',
          description:
            'Click through different schedule tabs (Overview, Schedules, Assignments, Performance, Templates, Analytics) to manage your AI workforce.',
          action: 'Try the different schedule management options.',
        },
        {
          title: 'Performance Monitoring',
          description:
            'Track individual AI staff performance, task completion rates, and efficiency metrics.',
          action: 'Review performance analytics for each staff member.',
        },
      ],
      tips: [
        'AI staff works 24/7 across different time zones',
        'Monitor performance to optimize task assignments',
        'Use the scheduler to balance workload across departments',
      ],
    },
    {
      id: 'follow-ups',
      title: '📞 Follow-up Task Management',
      icon: <Clock className='h-5 w-5' />,
      description:
        'Stay on top of your follow-up tasks and never miss an opportunity.',
      steps: [
        {
          title: 'Viewing Tasks',
          description:
            'Follow-up tasks appear in the CRM section and on the main dashboard. Tasks are automatically created from campaign responses and lead interactions.',
          action: 'Check the "Pending Follow-ups" counter on your dashboard.',
        },
        {
          title: 'Task Details',
          description:
            'Click on any follow-up task to see details including lead info, task type, due date, and priority level.',
          action: 'Click on a follow-up task to see its details.',
        },
        {
          title: 'Task Completion',
          description:
            'Mark tasks as complete by clicking the checkbox or update status. Add notes about your interaction for future reference.',
          action: 'Try completing a follow-up task.',
        },
        {
          title: 'Task Prioritization',
          description:
            'Tasks are automatically prioritized based on lead score, urgency, and deal value. Focus on high-priority tasks first.',
          action: 'Sort tasks by priority to see the most important ones.',
        },
      ],
      tips: [
        'Complete follow-up tasks within 24 hours for best results',
        'Add detailed notes after each interaction',
        'Use the priority system to focus on high-value opportunities',
      ],
    },
    {
      id: 'analytics',
      title: '📊 Analytics & Reporting',
      icon: <BarChart3 className='h-5 w-5' />,
      description:
        'Track your performance and optimize your freight brokerage business.',
      steps: [
        {
          title: 'Dashboard Metrics',
          description:
            'Your main dashboard shows key metrics including total leads, active prospects, pending follow-ups, and pipeline value.',
          action: 'Review the metric cards on your main dashboard.',
        },
        {
          title: 'CRM Analytics',
          description:
            'In the CRM section, view detailed analytics about lead sources, conversion rates, and deal progression.',
          action: 'Check the analytics in the CRM section.',
        },
        {
          title: 'Campaign Performance',
          description:
            'Track campaign results including leads generated, response rates, and revenue attribution.',
          action: 'Review campaign performance metrics.',
        },
        {
          title: 'Calendly Analytics',
          description:
            'Monitor appointment booking rates, show-up rates, and client conversion metrics.',
          action: 'Check Calendly analytics for booking performance.',
        },
      ],
      tips: [
        'Review analytics weekly to identify improvement opportunities',
        'Track which campaigns generate the highest-quality leads',
        'Monitor conversion rates to optimize your sales process',
      ],
    },
    {
      id: 'automation',
      title: '⚡ Email Automation',
      icon: <Mail className='h-5 w-5' />,
      description: 'Master your automated email sequences and lead nurturing.',
      steps: [
        {
          title: 'Automated Sequences',
          description:
            'Your system automatically sends personalized email sequences to leads based on their behavior and qualification score.',
          action: 'Check the email automation settings in campaign templates.',
        },
        {
          title: 'Lead Nurturing',
          description:
            'Leads receive automated follow-up emails with relevant content, case studies, and calls-to-action.',
          action: 'Review the email sequence in any campaign template.',
        },
        {
          title: 'Personalization',
          description:
            'Emails are personalized with company name, contact info, and relevant freight industry content.',
          action: 'Look at the personalization variables in email templates.',
        },
        {
          title: 'Performance Tracking',
          description:
            'Track email open rates, click-through rates, and response rates for each campaign.',
          action: 'Monitor email performance metrics in campaign analytics.',
        },
      ],
      tips: [
        'Email sequences run automatically once campaigns are launched',
        'Monitor email performance to optimize content',
        'Personalized emails get 3x higher response rates',
      ],
    },
  ];

  const currentGuideSection = guideSections[currentSection];
  const currentGuideStep = currentGuideSection?.steps[currentStep];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          width: '100%',
          maxWidth: '900px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen
              style={{ width: '24px', height: '24px', color: '#3b82f6' }}
            />
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: 0,
                }}
              >
                📚 CRM User Guide
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem',
                  margin: 0,
                }}
              >
                Complete guide to using your Depointe AI CRM system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <div
            style={{
              width: '280px',
              borderRight: '1px solid rgba(148, 163, 184, 0.2)',
              padding: '20px',
              overflowY: 'auto',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Guide Sections
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {guideSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(index);
                    setCurrentStep(0);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background:
                      currentSection === index
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'transparent',
                    color:
                      currentSection === index
                        ? '#3b82f6'
                        : 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {section.icon}
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      {section.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {section.steps.length} steps
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {currentGuideSection && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    {currentGuideSection.icon}
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: 0,
                      }}
                    >
                      {currentGuideSection.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                      margin: 0,
                    }}
                  >
                    {currentGuideSection.description}
                  </p>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Step {currentStep + 1} of{' '}
                      {currentGuideSection.steps.length}
                    </span>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {Math.round(
                        ((currentStep + 1) / currentGuideSection.steps.length) *
                          100
                      )}
                      % Complete
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                    }}
                  >
                    <div
                      style={{
                        width: `${((currentStep + 1) / currentGuideSection.steps.length) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                {currentGuideStep && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '12px',
                      padding: '24px',
                      marginBottom: '24px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      {currentGuideStep.title}
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '16px',
                      }}
                    >
                      {currentGuideStep.description}
                    </p>
                    {currentGuideStep.action && (
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <CheckCircle
                            style={{
                              width: '16px',
                              height: '16px',
                              color: '#3b82f6',
                            }}
                          />
                          <span
                            style={{
                              color: '#3b82f6',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                            }}
                          >
                            Action Required
                          </span>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            margin: 0,
                          }}
                        >
                          {currentGuideStep.action}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tips */}
                {currentGuideSection.tips && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <Zap
                        style={{
                          width: '16px',
                          height: '16px',
                          color: '#f59e0b',
                        }}
                      />
                      <span
                        style={{
                          color: '#f59e0b',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                        }}
                      >
                        Pro Tips
                      </span>
                    </div>
                    <ul
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        margin: 0,
                        paddingLeft: '20px',
                      }}
                    >
                      {currentGuideSection.tips.map((tip, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Navigation */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      background:
                        currentStep === 0
                          ? 'rgba(148, 163, 184, 0.1)'
                          : 'rgba(59, 130, 246, 0.1)',
                      color:
                        currentStep === 0
                          ? 'rgba(148, 163, 184, 0.5)'
                          : '#3b82f6',
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    <ChevronLeft style={{ width: '16px', height: '16px' }} />
                    Previous
                  </button>

                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Step {currentStep + 1} of {currentGuideSection.steps.length}
                  </div>

                  <button
                    onClick={() => {
                      if (currentStep < currentGuideSection.steps.length - 1) {
                        setCurrentStep(currentStep + 1);
                      } else if (currentSection < guideSections.length - 1) {
                        setCurrentSection(currentSection + 1);
                        setCurrentStep(0);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    {currentStep < currentGuideSection.steps.length - 1
                      ? 'Next Step'
                      : currentSection < guideSections.length - 1
                        ? 'Next Section'
                        : 'Complete'}
                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

