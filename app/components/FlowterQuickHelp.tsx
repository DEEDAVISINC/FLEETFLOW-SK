'use client';

import { ChevronDown, ChevronUp, HelpCircle, Search, X } from 'lucide-react';
import { useState } from 'react';

interface QuickHelpItem {
  category: string;
  title: string;
  description: string;
  keywords: string[];
  action: string;
}

export default function FlowterQuickHelp({
  isOpen,
  onClose,
  onAction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const helpItems: QuickHelpItem[] = [
    // Navigation
    {
      category: 'Navigation',
      title: 'Main Dashboard',
      description: 'View key metrics, recent activity, and quick actions',
      keywords: ['dashboard', 'overview', 'home', 'metrics'],
      action: 'navigate_main_dashboard',
    },
    {
      category: 'Navigation',
      title: 'Broker Dashboard',
      description: 'Access freight brokerage features and tools',
      keywords: ['broker', 'brokerage', 'freight', 'shipping'],
      action: 'navigate_broker_dashboard',
    },
    {
      category: 'Navigation',
      title: 'Analytics Hub',
      description: 'View comprehensive analytics and performance reports',
      keywords: ['analytics', 'reports', 'performance', 'data'],
      action: 'navigate_analytics_hub',
    },

    // CRM & Lead Management
    {
      category: 'CRM',
      title: 'CRM & Leads',
      description: 'Manage leads, prospects, and customer relationships',
      keywords: ['crm', 'leads', 'customers', 'prospects'],
      action: 'navigate_crm',
    },
    {
      category: 'CRM',
      title: 'Add New Lead',
      description: 'Create and qualify new leads in your pipeline',
      keywords: ['add lead', 'new lead', 'create lead'],
      action: 'add_lead_guide',
    },
    {
      category: 'CRM',
      title: 'Update Lead Status',
      description: 'Change lead status and track progress',
      keywords: ['status', 'update', 'progress'],
      action: 'lead_status_guide',
    },

    // Appointments & Scheduling
    {
      category: 'Appointments',
      title: 'Calendly Integration',
      description: 'Manage appointment types and view bookings',
      keywords: ['calendly', 'appointments', 'schedule'],
      action: 'navigate_calendly',
    },
    {
      category: 'Appointments',
      title: 'AI Booking Assistant',
      description: 'Use conversational booking for appointments',
      keywords: ['booking', 'ai assistant', 'chat'],
      action: 'booking_assistant_guide',
    },

    // Load Management & Operations
    {
      category: 'Operations',
      title: 'Load Management',
      description: 'Create and manage freight loads and shipments',
      keywords: ['load', 'loads', 'shipment', 'create load'],
      action: 'navigate_load_management',
    },
    {
      category: 'Operations',
      title: 'Dispatch Center',
      description: 'Access dispatch operations and real-time tracking',
      keywords: ['dispatch', 'operations', 'tracking'],
      action: 'navigate_dispatch',
    },
    {
      category: 'Operations',
      title: 'Load Board',
      description: 'Browse available loads and carrier capacity',
      keywords: ['load board', 'available loads', 'capacity'],
      action: 'navigate_load_board',
    },

    // Carrier Management
    {
      category: 'Carriers',
      title: 'Carrier Network',
      description: 'Manage your carrier relationships and partnerships',
      keywords: ['carrier', 'carriers', 'network', 'partnerships'],
      action: 'navigate_carrier_network',
    },
    {
      category: 'Carriers',
      title: 'Driver Management',
      description: 'Track drivers, vehicles, and fleet operations',
      keywords: ['driver', 'drivers', 'fleet', 'vehicles'],
      action: 'navigate_driver_management',
    },
    {
      category: 'Carriers',
      title: 'Carrier Compliance',
      description: 'Monitor carrier compliance and safety records',
      keywords: ['compliance', 'safety', 'carrier compliance'],
      action: 'navigate_carrier_compliance',
    },

    // Financial Management
    {
      category: 'Financial',
      title: 'Financial Dashboard',
      description: 'View revenue, costs, and profitability metrics',
      keywords: ['financial', 'revenue', 'profit', 'costs'],
      action: 'navigate_financial_dashboard',
    },
    {
      category: 'Financial',
      title: 'Invoice Management',
      description: 'Create, send, and track invoices and payments',
      keywords: ['invoice', 'billing', 'payment', 'invoicing'],
      action: 'navigate_invoicing',
    },
    {
      category: 'Financial',
      title: 'Payment Processing',
      description: 'Handle payments, collections, and financial transactions',
      keywords: ['payment', 'collections', 'transactions'],
      action: 'navigate_payments',
    },

    // Compliance & Safety
    {
      category: 'Compliance',
      title: 'DOT Compliance',
      description: 'Monitor DOT and FMCSA compliance requirements',
      keywords: ['dot', 'fmsca', 'compliance', 'regulations'],
      action: 'navigate_dot_compliance',
    },
    {
      category: 'Compliance',
      title: 'Safety Dashboard',
      description: 'Track safety metrics, incidents, and training',
      keywords: ['safety', 'incidents', 'training'],
      action: 'navigate_safety_dashboard',
    },

    // AI & Automation
    {
      category: 'AI',
      title: 'AI Dashboard',
      description: 'Access AI-powered analytics and insights',
      keywords: ['ai', 'artificial intelligence', 'insights'],
      action: 'navigate_ai_dashboard',
    },
    {
      category: 'AI',
      title: 'Automation Center',
      description: 'Set up automated workflows and processes',
      keywords: ['automation', 'workflows', 'processes'],
      action: 'navigate_automation',
    },
    {
      category: 'AI',
      title: 'AI Staff Management',
      description: 'Manage your AI staff team and performance',
      keywords: ['ai staff', 'team', 'assistants'],
      action: 'navigate_ai_staff',
    },

    // Communication
    {
      category: 'Communication',
      title: 'Phone System',
      description: 'Access phone dialer and communication tools',
      keywords: ['phone', 'dialer', 'communication'],
      action: 'navigate_phone_system',
    },
    {
      category: 'Communication',
      title: 'Call Center',
      description: 'Access call center analytics and management tools',
      keywords: ['call center', 'calls', 'analytics'],
      action: 'navigate_call_center',
    },

    // Market Intelligence
    {
      category: 'Intelligence',
      title: 'Market Intelligence',
      description: 'Access market data and competitor analysis',
      keywords: ['market', 'intelligence', 'competitor', 'analysis'],
      action: 'navigate_market_intelligence',
    },
    {
      category: 'Intelligence',
      title: 'Rate Analysis',
      description: 'Track pricing trends and rate optimization',
      keywords: ['rates', 'pricing', 'optimization'],
      action: 'navigate_rate_analysis',
    },

    // Campaign Management
    {
      category: 'Marketing',
      title: 'Campaign Management',
      description: 'Create and launch marketing campaigns',
      keywords: ['campaign', 'marketing', 'launch'],
      action: 'navigate_campaigns',
    },
    {
      category: 'Marketing',
      title: 'Email Templates',
      description: 'Browse and customize email campaign templates',
      keywords: ['email', 'templates', 'campaigns'],
      action: 'campaign_templates_guide',
    },

    // Tasks & Follow-ups
    {
      category: 'Tasks',
      title: 'Follow-up Tasks',
      description: 'Manage and complete pending follow-up tasks',
      keywords: ['tasks', 'follow up', 'reminders'],
      action: 'navigate_followups',
    },
    {
      category: 'Tasks',
      title: 'Task Prioritization',
      description: 'Understand how tasks are prioritized',
      keywords: ['priority', 'urgent', 'important'],
      action: 'task_prioritization_guide',
    },

    // Analytics
    {
      category: 'Analytics',
      title: 'Performance Reports',
      description: 'View analytics and performance metrics',
      keywords: ['analytics', 'reports', 'performance'],
      action: 'navigate_analytics',
    },
    {
      category: 'Analytics',
      title: 'Revenue Tracking',
      description: 'Monitor pipeline and revenue metrics',
      keywords: ['revenue', 'pipeline', 'money'],
      action: 'revenue_analytics_guide',
    },

    // Subscription & Billing
    {
      category: 'Subscription',
      title: 'My Current Plan',
      description: 'View your current subscription details and status',
      keywords: ['subscription', 'plan', 'current plan', 'what plan'],
      action: 'current_subscription_info',
    },
    {
      category: 'Subscription',
      title: 'Compare Plans',
      description: 'Compare features and pricing of different plans',
      keywords: ['compare', 'plans', 'pricing', 'vs', 'versus'],
      action: 'subscription_comparison',
    },
    {
      category: 'Subscription',
      title: 'Upgrade Plan',
      description: 'Learn how to upgrade to a higher-tier plan',
      keywords: ['upgrade', 'upgrade plan', 'change plan', 'higher tier'],
      action: 'upgrade_subscription_guide',
    },
    {
      category: 'Subscription',
      title: 'Billing & Payments',
      description: 'Manage payment methods, view invoices, and billing history',
      keywords: ['billing', 'payment', 'invoice', 'receipt', 'pay'],
      action: 'billing_payment_help',
    },
    {
      category: 'Subscription',
      title: 'Cancel Subscription',
      description: 'Understand the cancellation process and alternatives',
      keywords: ['cancel', 'stop subscription', 'end subscription'],
      action: 'cancellation_process',
    },
    {
      category: 'Subscription',
      title: 'Phone System Add-on',
      description: 'Learn about FleetFlow Phone system and pricing',
      keywords: ['phone', 'phone system', 'calls', 'minutes', 'sms'],
      action: 'phone_system_info',
    },
    {
      category: 'Subscription',
      title: 'Usage & Limits',
      description: 'Check your usage against plan limits and overages',
      keywords: ['usage', 'limits', 'overage', 'exceeded'],
      action: 'usage_limits_guide',
    },
  ];

  const categories = [...new Set(helpItems.map((item) => item.category))];

  const filteredItems = helpItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAction = (action: string) => {
    // Handle subscription-related actions by triggering appropriate queries
    if (
      action.startsWith('current_') ||
      action.startsWith('subscription_') ||
      action.startsWith('upgrade_') ||
      action.startsWith('billing_') ||
      action.startsWith('cancellation_') ||
      action.startsWith('phone_system_') ||
      action.startsWith('usage_')
    ) {
      // Map actions to subscription queries
      const actionMap: { [key: string]: string } = {
        current_subscription_info: 'What plan do I have?',
        subscription_comparison: 'Compare subscription plans',
        upgrade_subscription_guide: 'How do I upgrade my plan?',
        billing_payment_help: 'Help with billing and payments',
        cancellation_process: 'How do I cancel my subscription?',
        phone_system_info: 'Tell me about the phone system',
        usage_limits_guide: 'What are my usage limits?',
      };

      const query = actionMap[action] || action;
      onAction(`subscription_query:${query}`);
    } else {
      onAction(action);
    }
    onClose();
  };

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
          maxWidth: '700px',
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
            <HelpCircle
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
                Quick Help Center
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem',
                  margin: 0,
                }}
              >
                Find help with any feature instantly
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

        {/* Search */}
        <div
          style={{
            padding: '0 24px 20px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <div
            style={{
              position: 'relative',
              marginTop: '16px',
            }}
          >
            <Search
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            />
            <input
              type='text'
              placeholder='Search for help...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {categories.map((category) => {
            const categoryItems = filteredItems.filter(
              (item) => item.category === category
            );
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => toggleCategory(category)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#3b82f6',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{category}</span>
                  {expandedCategories.has(category) ? (
                    <ChevronUp style={{ width: '16px', height: '16px' }} />
                  ) : (
                    <ChevronDown style={{ width: '16px', height: '16px' }} />
                  )}
                </button>

                {expandedCategories.has(category) && (
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {categoryItems.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                        }}
                      >
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {item.title}
                        </h4>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '12px',
                          }}
                        >
                          {item.description}
                        </p>
                        <button
                          onClick={() => handleAction(item.action)}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3b82f6',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          Get Help
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
