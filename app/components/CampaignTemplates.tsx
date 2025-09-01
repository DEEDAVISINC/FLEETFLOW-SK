'use client';

import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  MessageSquare,
  Phone,
  Play,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: 'lead_generation' | 'follow_up' | 'nurture' | 'conversion' | 'retention';
  targetAudience: string;
  expectedResults: {
    leads: number;
    conversions: number;
    revenue: number;
  };
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  aiStaff: string[];
  channels: string[];
  steps: CampaignStep[];
  successMetrics: string[];
  icon: string;
  color: string;
}

interface CampaignStep {
  id: string;
  name: string;
  description: string;
  timing: string;
  channel: string;
  aiStaff?: string;
  template?: string;
  automationLevel: 'manual' | 'semi' | 'full';
}

interface CampaignInstance {
  id: string;
  templateId: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  progress: number;
  results: {
    leads: number;
    conversions: number;
    revenue: number;
  };
}

export default function CampaignTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<CampaignInstance[]>([]);

  // Comprehensive Campaign Templates
  const campaignTemplates: CampaignTemplate[] = [
    // LEAD GENERATION CAMPAIGNS
    {
      id: 'desperate_shippers_blitz',
      name: 'Desperate Shippers Blitz',
      description: 'Target companies with urgent shipping needs using FMCSA and TruckingPlanet data',
      category: 'lead_generation',
      targetAudience: 'Companies with compliance issues, capacity shortages, expiring contracts',
      expectedResults: {
        leads: 150,
        conversions: 45,
        revenue: 225000,
      },
      duration: '30 days',
      difficulty: 'easy',
      aiStaff: ['Desiree', 'Cliff', 'Gary'],
      channels: ['Phone', 'Email', 'LinkedIn'],
      icon: '🎯',
      color: 'bg-red-500',
      steps: [
        {
          id: 'initial_research',
          name: 'Data Intelligence Gathering',
          description: 'Leverage FMCSA and TruckingPlanet APIs to identify desperate shippers',
          timing: 'Day 1',
          channel: 'Data Analysis',
          aiStaff: 'Cliff',
          automationLevel: 'full',
        },
        {
          id: 'urgent_phone_outreach',
          name: 'Urgent Phone Outreach',
          description: 'Immediate phone calls to companies with critical capacity issues',
          timing: 'Day 1-3',
          channel: 'Phone',
          aiStaff: 'Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'compliance_focused_email',
          name: 'Compliance-Focused Email Campaign',
          description: 'Target carriers with DOT violations and compliance issues',
          timing: 'Day 2-7',
          channel: 'Email',
          aiStaff: 'Cliff',
          automationLevel: 'full',
        },
        {
          id: 'follow_up_sequence',
          name: 'Multi-Touch Follow-Up',
          description: 'Automated follow-up sequences with personalized offers',
          timing: 'Day 4-30',
          channel: 'Multi-Channel',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '150+ qualified leads generated',
        '45+ proposal meetings booked',
        '$225K+ pipeline created',
        '60%+ qualification rate',
      ],
    },

    {
      id: 'enterprise_manufacturer_hunt',
      name: 'Enterprise Manufacturer Hunt',
      description: 'Target large manufacturers with substantial shipping volumes using Thomas.net',
      category: 'lead_generation',
      targetAudience: 'Enterprise manufacturers (500+ employees) with high shipping volumes',
      expectedResults: {
        leads: 75,
        conversions: 15,
        revenue: 750000,
      },
      duration: '45 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Will', 'Gary'],
      channels: ['LinkedIn', 'Email', 'Phone'],
      icon: '🏭',
      color: 'bg-blue-500',
      steps: [
        {
          id: 'thomas_net_research',
          name: 'Thomas.net Intelligence',
          description: 'Research large manufacturers and their shipping patterns',
          timing: 'Day 1-7',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'linkedin_connection',
          name: 'LinkedIn Connection Campaign',
          description: 'Connect with decision-makers at target manufacturers',
          timing: 'Day 8-14',
          channel: 'LinkedIn',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'personalized_email_sequence',
          name: 'Personalized Email Sequence',
          description: 'Send customized proposals based on manufacturer needs',
          timing: 'Day 15-30',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'executive_phone_calls',
          name: 'Executive Phone Outreach',
          description: 'Direct calls to C-level executives at target companies',
          timing: 'Day 31-45',
          channel: 'Phone',
          aiStaff: 'Will',
          automationLevel: 'manual',
        },
      ],
      successMetrics: [
        '75+ enterprise leads identified',
        '15+ executive meetings booked',
        '$750K+ revenue potential',
        '40%+ meeting-to-proposal conversion',
      ],
    },

    {
      id: 'supply_chain_disruption_targeting',
      name: 'Supply Chain Disruption Targeting',
      description: 'Identify and target companies experiencing supply chain disruptions',
      category: 'lead_generation',
      targetAudience: 'Companies with supply chain issues, inventory problems, production delays',
      expectedResults: {
        leads: 120,
        conversions: 36,
        revenue: 180000,
      },
      duration: '25 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Logan', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '⚡',
      color: 'bg-orange-500',
      steps: [
        {
          id: 'disruption_detection',
          name: 'Disruption Intelligence',
          description: 'Monitor news, social media, and industry reports for disruptions',
          timing: 'Ongoing',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'crisis_email_campaign',
          name: 'Crisis Response Email',
          description: 'Send immediate assistance offers to affected companies',
          timing: 'Within 24 hours',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'emergency_phone_support',
          name: 'Emergency Phone Support',
          description: 'Provide immediate phone consultation for urgent needs',
          timing: 'Day 1-3',
          channel: 'Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'recovery_solution_proposals',
          name: 'Recovery Solution Proposals',
          description: 'Present comprehensive recovery and prevention solutions',
          timing: 'Day 4-25',
          channel: 'Multi-Channel',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '120+ crisis-affected leads',
        '36+ recovery proposals sent',
        '$180K+ immediate revenue',
        '75%+ response rate during crisis',
      ],
    },

    // FOLLOW-UP CAMPAIGNS
    {
      id: 'proposal_follow_up_accelerator',
      name: 'Proposal Follow-Up Accelerator',
      description: 'Systematic follow-up sequence for outstanding proposals',
      category: 'follow_up',
      targetAudience: 'Prospects with outstanding proposals (30+ days old)',
      expectedResults: {
        leads: 0,
        conversions: 25,
        revenue: 125000,
      },
      duration: '21 days',
      difficulty: 'easy',
      aiStaff: ['Gary', 'Will'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '📧',
      color: 'bg-green-500',
      steps: [
        {
          id: 'proposal_review',
          name: 'Proposal Status Review',
          description: 'Review outstanding proposals and identify follow-up opportunities',
          timing: 'Day 1',
          channel: 'CRM Analysis',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'gentle_reminder_email',
          name: 'Gentle Reminder Email',
          description: 'Send value-add reminder emails with updated information',
          timing: 'Day 2-7',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'decision_maker_phone',
          name: 'Decision Maker Phone Call',
          description: 'Connect with decision-makers to discuss proposal status',
          timing: 'Day 8-14',
          channel: 'Phone',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'final_urgency_sequence',
          name: 'Final Urgency Sequence',
          description: 'Limited-time offers and final follow-up attempts',
          timing: 'Day 15-21',
          channel: 'Multi-Channel',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '25+ proposals converted to business',
        '$125K+ additional revenue',
        '40%+ conversion rate on aged proposals',
        'Improved proposal-to-close cycle time',
      ],
    },

    // NURTURE CAMPAIGNS
    {
      id: 'cold_lead_warming_sequence',
      name: 'Cold Lead Warming Sequence',
      description: 'Transform cold leads into warm prospects through value-driven content',
      category: 'nurture',
      targetAudience: 'Cold leads (60+ days since last contact)',
      expectedResults: {
        leads: 0,
        conversions: 30,
        revenue: 150000,
      },
      duration: '60 days',
      difficulty: 'medium',
      aiStaff: ['Gary', 'Desiree'],
      channels: ['Email', 'LinkedIn', 'Content'],
      icon: '🔥',
      color: 'bg-purple-500',
      steps: [
        {
          id: 'lead_segmentation',
          name: 'Lead Segmentation & Scoring',
          description: 'Analyze cold leads and segment by industry and potential value',
          timing: 'Day 1',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'educational_content_series',
          name: 'Educational Content Series',
          description: 'Send industry insights and shipping optimization tips',
          timing: 'Day 7-42',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'value_add_touchpoints',
          name: 'Value-Add Touchpoints',
          description: 'Share case studies, whitepapers, and industry reports',
          timing: 'Day 14-49',
          channel: 'Multi-Channel',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'warm_lead_reengagement',
          name: 'Warm Lead Reengagement',
          description: 'Personalized outreach to leads showing engagement',
          timing: 'Day 50-60',
          channel: 'Phone/Email',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '30+ cold leads converted to opportunities',
        '$150K+ pipeline generated',
        '25%+ re-engagement rate',
        'Improved lead scoring accuracy',
      ],
    },

    // CONVERSION CAMPAIGNS
    {
      id: 'high_value_prospect_acceleration',
      name: 'High-Value Prospect Acceleration',
      description: 'Accelerate conversion of high-value prospects through intensive outreach',
      category: 'conversion',
      targetAudience: 'High-value prospects ($50K+ potential) in consideration phase',
      expectedResults: {
        leads: 0,
        conversions: 12,
        revenue: 600000,
      },
      duration: '30 days',
      difficulty: 'hard',
      aiStaff: ['Will', 'Gary', 'Resse A. Bell'],
      channels: ['Phone', 'Email', 'LinkedIn', 'In-Person'],
      icon: '🚀',
      color: 'bg-indigo-500',
      steps: [
        {
          id: 'prospect_qualification',
          name: 'High-Value Prospect Qualification',
          description: 'Verify prospect qualification and budget authority',
          timing: 'Day 1-3',
          channel: 'Phone/Email',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'executive_level_outreach',
          name: 'Executive-Level Outreach',
          description: 'Connect with C-level decision makers and influencers',
          timing: 'Day 4-10',
          channel: 'Phone/LinkedIn',
          aiStaff: 'Will',
          automationLevel: 'manual',
        },
        {
          id: 'customized_proposal_delivery',
          name: 'Customized Proposal Delivery',
          description: 'Deliver tailored proposals with executive summaries',
          timing: 'Day 11-15',
          channel: 'Email/In-Person',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'objection_handling_sequence',
          name: 'Objection Handling Sequence',
          description: 'Address concerns and provide additional information',
          timing: 'Day 16-25',
          channel: 'Phone/Email',
          aiStaff: 'Will',
          automationLevel: 'manual',
        },
        {
          id: 'final_close_acceleration',
          name: 'Final Close Acceleration',
          description: 'Limited-time offers and final negotiation support',
          timing: 'Day 26-30',
          channel: 'Multi-Channel',
          aiStaff: 'Resse A. Bell',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '12+ high-value deals closed',
        '$600K+ revenue generated',
        '50%+ close rate on qualified prospects',
        'Average deal size: $50K+',
      ],
    },

    // RETENTION CAMPAIGNS
    {
      id: 'client_loyalty_acceleration',
      name: 'Client Loyalty Acceleration',
      description: 'Strengthen relationships with existing clients through proactive engagement',
      category: 'retention',
      targetAudience: 'Current clients with 6+ months relationship',
      expectedResults: {
        leads: 0,
        conversions: 0,
        revenue: 300000,
      },
      duration: '90 days',
      difficulty: 'easy',
      aiStaff: ['Shanell', 'Gary', 'Brook R.'],
      channels: ['Email', 'Phone', 'Survey', 'Newsletter'],
      icon: '💎',
      color: 'bg-teal-500',
      steps: [
        {
          id: 'satisfaction_assessment',
          name: 'Client Satisfaction Assessment',
          description: 'Survey clients to identify satisfaction levels and improvement areas',
          timing: 'Day 1-7',
          channel: 'Email/Survey',
          aiStaff: 'Shanell',
          automationLevel: 'full',
        },
        {
          id: 'proactive_value_delivery',
          name: 'Proactive Value Delivery',
          description: 'Provide additional services and optimization recommendations',
          timing: 'Day 8-60',
          channel: 'Email/Phone',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'relationship_strengthening',
          name: 'Relationship Strengthening',
          description: 'Regular check-ins and personalized communications',
          timing: 'Ongoing',
          channel: 'Multi-Channel',
          aiStaff: 'Brook R.',
          automationLevel: 'semi',
        },
        {
          id: 'expansion_opportunity_identification',
          name: 'Expansion Opportunity Identification',
          description: 'Identify and pursue additional service opportunities',
          timing: 'Day 30-90',
          channel: 'Phone/Email',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '$300K+ additional revenue from expansions',
        '95%+ client retention rate',
        '25+ expansion opportunities identified',
        'NPS score improvement of 15+ points',
      ],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Campaigns', icon: Target },
    { id: 'lead_generation', name: 'Lead Generation', icon: Users },
    { id: 'follow_up', name: 'Follow-Up', icon: Mail },
    { id: 'nurture', name: 'Nurture', icon: TrendingUp },
    { id: 'conversion', name: 'Conversion', icon: DollarSign },
    { id: 'retention', name: 'Retention', icon: CheckCircle },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? campaignTemplates
    : campaignTemplates.filter(template => template.category === selectedCategory);

  const launchCampaign = (template: CampaignTemplate) => {
    const newCampaign: CampaignInstance = {
      id: `campaign_${Date.now()}`,
      templateId: template.id,
      name: template.name,
      status: 'active',
      startDate: new Date().toISOString(),
      progress: 0,
      results: {
        leads: 0,
        conversions: 0,
        revenue: 0,
      },
    };

    setActiveCampaigns([...activeCampaigns, newCampaign]);
    // Here you would integrate with your campaign management system
    alert(`🚀 Campaign "${template.name}" launched successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🎯 Campaign Templates
            </h2>
            <p className="text-gray-600 mt-1">
              Pre-configured campaign strategies powered by DEPOINTE AI staff
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {filteredTemplates.length} Templates Available
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Active Campaigns
          </h3>
          <div className="space-y-3">
            {activeCampaigns.map((campaign) => {
              const template = campaignTemplates.find(t => t.id === campaign.templateId);
              return (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{template?.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">
                        Started {new Date(campaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="font-medium">{campaign.progress}%</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : campaign.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaign Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Template Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${template.color} text-white`}>
                  <span className="text-xl">{template.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      template.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : template.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {template.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{template.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            {/* Target Audience */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-700">Target Audience</span>
              </div>
              <p className="text-xs text-gray-600">{template.targetAudience}</p>
            </div>

            {/* Expected Results */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-700">Expected Results</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-lg font-bold text-gray-900">{template.expectedResults.leads}</div>
                  <div className="text-xs text-gray-600">Leads</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-lg font-bold text-gray-900">{template.expectedResults.conversions}</div>
                  <div className="text-xs text-gray-600">Conversions</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-lg font-bold text-gray-900">${(template.expectedResults.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
              </div>
            </div>

            {/* AI Staff */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-700">AI Staff Assigned</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {template.aiStaff.map((staff, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {staff}
                  </span>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-700">Success Metrics</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                {template.successMetrics.slice(0, 2).map((metric, index) => (
                  <li key={index} className="flex items-center space-x-1">
                    <span className="text-green-500">•</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => launchCampaign(template)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Play className="h-4 w-4" />
                <span>Launch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${selectedTemplate.color} text-white`}>
                    <span className="text-2xl">{selectedTemplate.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTemplate.name}
                    </h2>
                    <p className="text-gray-600 mt-1">{selectedTemplate.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Campaign Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Duration</span>
                  </div>
                  <p className="text-gray-600">{selectedTemplate.duration}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">AI Staff</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.aiStaff.map((staff, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {staff}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Expected Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ${(selectedTemplate.expectedResults.revenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>

              {/* Campaign Steps */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Steps</h3>
                <div className="space-y-4">
                  {selectedTemplate.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{step.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            step.automationLevel === 'full'
                              ? 'bg-green-100 text-green-800'
                              : step.automationLevel === 'semi'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {step.automationLevel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{step.timing}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{step.channel}</span>
                          </span>
                          {step.aiStaff && (
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{step.aiStaff}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.successMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-900">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    launchCampaign(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Launch Campaign</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
