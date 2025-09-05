'use client';

import {
  BarChart3,
  Clock,
  Eye,
  Mail,
  MessageSquare,
  Reply,
  Send,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTopPerformingTemplates } from '../services/DEPOINTEEmailTemplates';

interface EmailCampaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  subject: string;
  template: string;
  targetSegment: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
  createdAt: string;
  lastSent: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  performance: {
    avgOpenRate: number;
    avgClickRate: number;
    avgReplyRate: number;
  };
}

interface OutreachSequence {
  id: string;
  name: string;
  steps: SequenceStep[];
  targetAudience: string;
  totalContacts: number;
  activeContacts: number;
  completedContacts: number;
}

interface SequenceStep {
  id: string;
  type: 'email' | 'call' | 'linkedin' | 'wait';
  templateId?: string;
  subject?: string;
  content?: string;
  delay: number; // hours
  conditions?: string[];
}

export default function DEPOINTEEmailOutreach() {
  const [activeTab, setActiveTab] = useState<
    'campaigns' | 'templates' | 'sequences' | 'analytics'
  >('campaigns');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [sequences, setSequences] = useState<OutreachSequence[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockCampaigns: EmailCampaign[] = [
      {
        id: 'camp-001',
        name: 'DOT Violation Recovery - Manufacturing',
        status: 'active',
        subject:
          '[Company Name] - Strategic Freight Solutions for Compliance Recovery',
        template: 'dot-violation-recovery',
        targetSegment: 'Manufacturing companies with recent DOT violations',
        sentCount: 234,
        openRate: 42.3,
        clickRate: 8.7,
        replyRate: 3.2,
        conversionRate: 1.8,
        createdAt: '2025-01-15',
        lastSent: '2025-01-20',
      },
      {
        id: 'camp-002',
        name: 'Capacity Crisis - E-commerce',
        status: 'active',
        subject: 'Peak Season Freight Capacity Solutions',
        template: 'capacity-crisis',
        targetSegment: 'E-commerce companies with seasonal capacity issues',
        sentCount: 156,
        openRate: 38.9,
        clickRate: 12.4,
        replyRate: 4.1,
        conversionRate: 2.3,
        createdAt: '2025-01-18',
        lastSent: '2025-01-19',
      },
    ];

    // Load top performing templates from our professional library
    const topTemplates = getTopPerformingTemplates(6);

    setCampaigns(mockCampaigns);
    setTemplates(topTemplates);
  }, []);

  const campaignStats = [
    {
      label: 'Active Campaigns',
      value: campaigns.filter((c) => c.status === 'active').length,
      icon: Target,
    },
    {
      label: 'Total Emails Sent',
      value: campaigns.reduce((sum, c) => sum + c.sentCount, 0),
      icon: Send,
    },
    { label: 'Average Open Rate', value: '40.6%', icon: Eye },
    { label: 'Average Reply Rate', value: '3.7%', icon: Reply },
    { label: 'Conversions This Month', value: 12, icon: TrendingUp },
  ];

  const renderCampaigns = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-bold text-gray-900'>Email Campaigns</h3>
        <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
          <Mail className='h-4 w-4' />
          New Campaign
        </button>
      </div>

      {/* Campaign Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        {campaignStats.map((stat, index) => (
          <div
            key={index}
            className='rounded-lg border border-gray-200 bg-white p-6'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>{stat.label}</p>
                <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
              </div>
              <stat.icon className='h-8 w-8 text-blue-600' />
            </div>
          </div>
        ))}
      </div>

      {/* Campaigns List */}
      <div className='space-y-4'>
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className='rounded-lg border border-gray-200 bg-white p-6'
          >
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <h4 className='text-lg font-medium text-gray-900'>
                  {campaign.name}
                </h4>
                <p className='text-sm text-gray-600'>
                  {campaign.targetSegment}
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  campaign.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : campaign.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {campaign.status}
              </div>
            </div>

            <div className='mb-4 grid grid-cols-2 gap-4 md:grid-cols-5'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-gray-900'>
                  {campaign.sentCount}
                </p>
                <p className='text-xs text-gray-600'>Sent</p>
              </div>
              <div className='text-center'>
                <p className='text-2xl font-bold text-green-600'>
                  {campaign.openRate}%
                </p>
                <p className='text-xs text-gray-600'>Opens</p>
              </div>
              <div className='text-center'>
                <p className='text-2xl font-bold text-blue-600'>
                  {campaign.clickRate}%
                </p>
                <p className='text-xs text-gray-600'>Clicks</p>
              </div>
              <div className='text-center'>
                <p className='text-2xl font-bold text-purple-600'>
                  {campaign.replyRate}%
                </p>
                <p className='text-xs text-gray-600'>Replies</p>
              </div>
              <div className='text-center'>
                <p className='text-2xl font-bold text-orange-600'>
                  {campaign.conversionRate}%
                </p>
                <p className='text-xs text-gray-600'>Conversions</p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button className='rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'>
                Edit
              </button>
              <button className='rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'>
                Clone
              </button>
              <button className='rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'>
                Pause
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-bold text-gray-900'>Email Templates</h3>
        <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
          <Mail className='h-4 w-4' />
          New Template
        </button>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {templates.map((template) => (
          <div
            key={template.id}
            className='rounded-lg border border-gray-200 bg-white p-6'
          >
            <div className='mb-4'>
              <h4 className='text-lg font-medium text-gray-900'>
                {template.name}
              </h4>
              <span className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'>
                {template.category}
              </span>
            </div>

            <div className='mb-4'>
              <p className='text-sm font-medium text-gray-700'>Subject:</p>
              <p className='text-sm text-gray-600'>{template.subject}</p>
            </div>

            <div className='mb-4 grid grid-cols-3 gap-4'>
              <div className='text-center'>
                <p className='text-xl font-bold text-green-600'>
                  {template.performance.avgOpenRate}%
                </p>
                <p className='text-xs text-gray-600'>Avg Open Rate</p>
              </div>
              <div className='text-center'>
                <p className='text-xl font-bold text-blue-600'>
                  {template.performance.avgClickRate}%
                </p>
                <p className='text-xs text-gray-600'>Avg Click Rate</p>
              </div>
              <div className='text-center'>
                <p className='text-xl font-bold text-purple-600'>
                  {template.performance.avgReplyRate}%
                </p>
                <p className='text-xs text-gray-600'>Avg Reply Rate</p>
              </div>
            </div>

            <div className='mb-4'>
              <p className='mb-2 text-sm font-medium text-gray-700'>
                Variables:
              </p>
              <div className='flex flex-wrap gap-2'>
                {template.variables.map((variable, index) => (
                  <span
                    key={index}
                    className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700'
                  >
                    [{variable}]
                  </span>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button className='rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'>
                Edit
              </button>
              <button className='rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'>
                Preview
              </button>
              <button className='rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'>
                Clone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className='space-y-6'>
      <h3 className='text-2xl font-bold text-gray-900'>
        Email Outreach Analytics
      </h3>

      {/* Overall Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h4 className='text-lg font-medium text-gray-900'>
              Deliverability
            </h4>
            <Mail className='h-6 w-6 text-green-600' />
          </div>
          <p className='text-3xl font-bold text-green-600'>98.7%</p>
          <p className='text-sm text-gray-600'>Bounce rate: 1.3%</p>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h4 className='text-lg font-medium text-gray-900'>Response Rate</h4>
            <Reply className='h-6 w-6 text-blue-600' />
          </div>
          <p className='text-3xl font-bold text-blue-600'>3.7%</p>
          <p className='text-sm text-gray-600'>+0.8% vs last month</p>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h4 className='text-lg font-medium text-gray-900'>
              Qualified Leads
            </h4>
            <Target className='h-6 w-6 text-purple-600' />
          </div>
          <p className='text-3xl font-bold text-purple-600'>47</p>
          <p className='text-sm text-gray-600'>This month</p>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h4 className='text-lg font-medium text-gray-900'>
              Revenue Impact
            </h4>
            <TrendingUp className='h-6 w-6 text-orange-600' />
          </div>
          <p className='text-3xl font-bold text-orange-600'>$187K</p>
          <p className='text-sm text-gray-600'>Pipeline value</p>
        </div>
      </div>

      {/* Performance by Industry */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h4 className='mb-4 text-lg font-medium text-gray-900'>
          Performance by Industry
        </h4>
        <div className='space-y-3'>
          {[
            {
              industry: 'Manufacturing',
              sent: 450,
              opens: 42.1,
              replies: 3.8,
              conversions: 2.1,
            },
            {
              industry: 'E-commerce',
              sent: 320,
              opens: 38.7,
              replies: 4.2,
              conversions: 1.9,
            },
            {
              industry: 'Healthcare',
              sent: 180,
              opens: 45.3,
              replies: 3.1,
              conversions: 2.4,
            },
            {
              industry: 'Construction',
              sent: 120,
              opens: 36.8,
              replies: 2.9,
              conversions: 1.7,
            },
          ].map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
            >
              <div className='flex-1'>
                <p className='font-medium text-gray-900'>{item.industry}</p>
                <p className='text-sm text-gray-600'>{item.sent} emails sent</p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-gray-600'>Opens: {item.opens}%</p>
                <p className='text-sm text-gray-600'>
                  Replies: {item.replies}%
                </p>
                <p className='text-sm text-gray-600'>
                  Conversions: {item.conversions}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>
            DEPOINTE Email Outreach
          </h2>
          <p className='text-gray-600'>
            ListKit-style cold email system for freight brokerage
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800'>
            98.7% Deliverability
          </div>
          <div className='rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800'>
            3.7% Response Rate
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200'>
        <div className='flex space-x-8'>
          {[
            { id: 'campaigns', label: 'Campaigns', icon: Mail },
            { id: 'templates', label: 'Templates', icon: MessageSquare },
            { id: 'sequences', label: 'Sequences', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <tab.icon className='h-4 w-4' />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'campaigns' && renderCampaigns()}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'sequences' && (
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <h3 className='mb-4 text-xl font-medium text-gray-900'>
            Outreach Sequences
          </h3>
          <p className='text-gray-600'>
            Automated follow-up sequences coming soon...
          </p>
        </div>
      )}
    </div>
  );
}
