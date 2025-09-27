'use client';

import {
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Search,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface NAICSCode {
  code: string;
  description: string;
  category: string;
  opportunityLevel: 'high' | 'medium' | 'low';
  avgContractValue: number;
}

interface RFIOpportunity {
  id: string;
  agency: string;
  title: string;
  naicsCode: string;
  estimatedValue: number;
  responseDeadline: string;
  logisticsComponent: string;
  status: 'monitoring' | 'responding' | 'submitted' | 'follow_up';
  competitiveLevel: 'low' | 'medium' | 'high';
}

interface GovernmentMetrics {
  activeMonitoring: number;
  rfiResponses: number;
  relationshipsBuilt: number;
  pipelineValue: number;
  successRate: number;
  avgContractValue: number;
}

export default function GovernmentRFICampaign() {
  const [metrics] = useState<GovernmentMetrics>({
    activeMonitoring: 47,
    rfiResponses: 23,
    relationshipsBuilt: 15,
    pipelineValue: 8500000,
    successRate: 78.3,
    avgContractValue: 2400000,
  });

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'direct' | 'component' | 'partnership'
  >('all');

  // Strategic NAICS codes for comprehensive coverage
  const strategicNAICS: NAICSCode[] = [
    {
      code: '488510',
      description: 'Freight Transportation Arrangement',
      category: 'Direct Transportation',
      opportunityLevel: 'high',
      avgContractValue: 5000000,
    },
    {
      code: '484110',
      description: 'General Freight Trucking, Local',
      category: 'Direct Transportation',
      opportunityLevel: 'high',
      avgContractValue: 2500000,
    },
    {
      code: '484121',
      description: 'General Freight Trucking, Long-Distance, Truckload',
      category: 'Direct Transportation',
      opportunityLevel: 'high',
      avgContractValue: 4200000,
    },
    {
      code: '488390',
      description: 'Other Support Activities for Transportation',
      category: 'Support Services',
      opportunityLevel: 'medium',
      avgContractValue: 1800000,
    },
    {
      code: '493110',
      description: 'General Warehousing and Storage',
      category: 'Logistics Support',
      opportunityLevel: 'medium',
      avgContractValue: 3100000,
    },
    {
      code: '541614',
      description: 'Process, Physical Distribution, and Logistics Consulting',
      category: 'Consulting Services',
      opportunityLevel: 'high',
      avgContractValue: 1500000,
    },
    {
      code: '336411',
      description: 'Aircraft Manufacturing (Logistics Component)',
      category: 'Component Opportunity',
      opportunityLevel: 'medium',
      avgContractValue: 850000,
    },
    {
      code: '325412',
      description: 'Pharmaceutical Preparation Mfg (Distribution)',
      category: 'Component Opportunity',
      opportunityLevel: 'high',
      avgContractValue: 1200000,
    },
    {
      code: '334511',
      description: 'Electronic Equipment Mfg (Logistics)',
      category: 'Component Opportunity',
      opportunityLevel: 'medium',
      avgContractValue: 900000,
    },
  ];

  // Current RFI opportunities being monitored/pursued
  const activeOpportunities: RFIOpportunity[] = [
    {
      id: 'dod_logistics_2025',
      agency: 'Department of Defense',
      title: 'Multi-Modal Transportation Services - Global Logistics Support',
      naicsCode: '488510',
      estimatedValue: 15000000,
      responseDeadline: '2025-02-15',
      logisticsComponent: 'Full logistics management for overseas deployment',
      status: 'responding',
      competitiveLevel: 'high',
    },
    {
      id: 'fema_disaster_transport',
      agency: 'FEMA',
      title: 'Emergency Transportation Services - Disaster Relief Logistics',
      naicsCode: '484121',
      estimatedValue: 8500000,
      responseDeadline: '2025-01-30',
      logisticsComponent: 'Critical infrastructure and supply distribution',
      status: 'submitted',
      competitiveLevel: 'medium',
    },
    {
      id: 'va_medical_distribution',
      agency: 'Veterans Affairs',
      title: 'Medical Equipment Distribution Network',
      naicsCode: '325412',
      estimatedValue: 4200000,
      responseDeadline: '2025-02-28',
      logisticsComponent: 'Temperature-controlled pharmaceutical distribution',
      status: 'monitoring',
      competitiveLevel: 'low',
    },
    {
      id: 'gsa_supply_chain',
      agency: 'General Services Administration',
      title: 'Federal Supply Chain Optimization Study',
      naicsCode: '541614',
      estimatedValue: 2800000,
      responseDeadline: '2025-03-15',
      logisticsComponent: 'Logistics consulting and process optimization',
      status: 'responding',
      competitiveLevel: 'medium',
    },
    {
      id: 'dhs_security_logistics',
      agency: 'Department of Homeland Security',
      title: 'Border Security Equipment Transport & Installation',
      naicsCode: '334511',
      estimatedValue: 6700000,
      responseDeadline: '2025-02-10',
      logisticsComponent: 'Specialized equipment transportation and deployment',
      status: 'follow_up',
      competitiveLevel: 'high',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'monitoring':
        return 'bg-blue-100 text-blue-800';
      case 'responding':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'follow_up':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompetitiveColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const initiateRFIResponse = (opportunityId: string) => {
    const opportunity = activeOpportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      alert(
        `🚀 RFI Response Campaign Initiated!\n\n` +
          `Opportunity: ${opportunity.title}\n` +
          `Agency: ${opportunity.agency}\n` +
          `Value: $${opportunity.estimatedValue.toLocaleString()}\n` +
          `Deadline: ${opportunity.responseDeadline}\n\n` +
          `AI staff are now preparing comprehensive response package.`
      );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='flex items-center gap-3 text-3xl font-bold text-white'>
            <Shield className='h-8 w-8 text-blue-400' />
            Government RFI & Sources Sought Campaign
            <span className='rounded-full bg-blue-600 px-3 py-1 text-sm font-normal'>
              Strategic Intelligence
            </span>
          </h2>
          <p className='mt-2 text-slate-300'>
            Comprehensive NAICS-based monitoring and strategic response to
            government opportunities
          </p>
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold text-green-400'>
            ${metrics.pipelineValue.toLocaleString()}
          </div>
          <div className='text-sm text-slate-400'>Active Pipeline Value</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-6'>
        <div className='rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-blue-100'>Active Monitoring</p>
              <p className='text-3xl font-bold'>{metrics.activeMonitoring}</p>
              <p className='text-xs text-blue-200'>Opportunities tracked</p>
            </div>
            <Search className='h-8 w-8 text-blue-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-green-100'>RFI Responses</p>
              <p className='text-3xl font-bold'>{metrics.rfiResponses}</p>
              <p className='text-xs text-green-200'>Submitted this quarter</p>
            </div>
            <FileText className='h-8 w-8 text-green-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-purple-100'>Relationships</p>
              <p className='text-3xl font-bold'>{metrics.relationshipsBuilt}</p>
              <p className='text-xs text-purple-200'>Contracting officers</p>
            </div>
            <Users className='h-8 w-8 text-purple-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-orange-100'>Success Rate</p>
              <p className='text-3xl font-bold'>{metrics.successRate}%</p>
              <p className='text-xs text-orange-200'>RFI to RFP conversion</p>
            </div>
            <Target className='h-8 w-8 text-orange-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-pink-100'>Avg Contract</p>
              <p className='text-3xl font-bold'>
                ${Math.round(metrics.avgContractValue / 1000000)}M
              </p>
              <p className='text-xs text-pink-200'>Contract value</p>
            </div>
            <DollarSign className='h-8 w-8 text-pink-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-teal-100'>Win Rate</p>
              <p className='text-3xl font-bold'>34%</p>
              <p className='text-xs text-teal-200'>Contract awards</p>
            </div>
            <TrendingUp className='h-8 w-8 text-teal-200' />
          </div>
        </div>
      </div>

      {/* Opportunity Category Filter */}
      <div className='rounded-xl bg-slate-800 p-4'>
        <div className='flex items-center gap-4'>
          <h3 className='text-lg font-semibold text-white'>
            Opportunity Focus:
          </h3>
          <div className='flex gap-2'>
            {[
              { id: 'all', label: 'All Opportunities' },
              { id: 'direct', label: 'Direct Transportation' },
              { id: 'component', label: 'Logistics Components' },
              { id: 'partnership', label: 'Partnership Opportunities' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic NAICS Codes */}
      <div className='rounded-xl bg-slate-800 p-6'>
        <h3 className='mb-6 text-2xl font-bold text-white'>
          🎯 Strategic NAICS Code Monitoring
        </h3>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          {strategicNAICS.map((naics, index) => (
            <div
              key={index}
              className='rounded-lg bg-slate-700 p-4 transition-colors hover:bg-slate-600'
            >
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <h4 className='font-bold text-white'>{naics.code}</h4>
                  <p className='text-sm text-slate-300'>{naics.description}</p>
                  <p className='mt-1 text-xs text-slate-400'>
                    {naics.category}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    naics.opportunityLevel === 'high'
                      ? 'bg-green-100 text-green-800'
                      : naics.opportunityLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {naics.opportunityLevel}
                </span>
              </div>
              <div className='text-sm'>
                <p className='text-slate-400'>Avg Contract Value:</p>
                <p className='font-bold text-green-400'>
                  ${(naics.avgContractValue / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active RFI Opportunities */}
      <div className='rounded-xl bg-slate-800 p-6'>
        <h3 className='mb-6 text-2xl font-bold text-white'>
          🔥 Active RFI & Sources Sought Opportunities
        </h3>
        <div className='space-y-4'>
          {activeOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className='rounded-lg bg-slate-700 p-6 transition-colors hover:bg-slate-600'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <Building2 className='h-5 w-5 text-blue-400' />
                    <h4 className='text-lg font-bold text-white'>
                      {opportunity.agency}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        opportunity.status
                      )}`}
                    >
                      {opportunity.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h5 className='mb-2 font-semibold text-white'>
                    {opportunity.title}
                  </h5>
                  <p className='mb-3 text-sm text-slate-300'>
                    {opportunity.logisticsComponent}
                  </p>

                  <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-4'>
                    <div>
                      <p className='text-slate-400'>NAICS Code:</p>
                      <p className='font-medium text-white'>
                        {opportunity.naicsCode}
                      </p>
                    </div>
                    <div>
                      <p className='text-slate-400'>Estimated Value:</p>
                      <p className='font-bold text-green-400'>
                        ${(opportunity.estimatedValue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className='text-slate-400'>Response Deadline:</p>
                      <p className='flex items-center gap-1 font-medium text-white'>
                        <Calendar className='h-3 w-3' />
                        {opportunity.responseDeadline}
                      </p>
                    </div>
                    <div>
                      <p className='text-slate-400'>Competition Level:</p>
                      <p
                        className={`flex items-center gap-1 font-medium ${getCompetitiveColor(
                          opportunity.competitiveLevel
                        )}`}
                      >
                        <AlertTriangle className='h-3 w-3' />
                        {opportunity.competitiveLevel.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between border-t border-slate-600 pt-4'>
                <div className='flex items-center gap-4 text-sm text-slate-400'>
                  <span>Est. Response Time: 5-7 days</span>
                  <span>•</span>
                  <span>
                    Win Probability:{' '}
                    {opportunity.competitiveLevel === 'low'
                      ? '75%'
                      : opportunity.competitiveLevel === 'medium'
                        ? '45%'
                        : '25%'}
                  </span>
                </div>
                <button
                  onClick={() => initiateRFIResponse(opportunity.id)}
                  className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700'
                  disabled={opportunity.status === 'submitted'}
                >
                  <Target className='mr-2 inline h-4 w-4' />
                  {opportunity.status === 'submitted'
                    ? 'Response Submitted'
                    : 'Initiate Response'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Sector Intelligence */}
      <div className='rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6'>
        <div className='mb-6'>
          <h3 className='flex items-center gap-3 text-2xl font-bold text-white'>
            <Zap className='h-6 w-6 text-indigo-400' />
            Cross-Sector Logistics Intelligence
          </h3>
          <p className='mt-2 text-slate-300'>
            AI monitoring for logistics components across all government
            contract categories
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[
            {
              sector: 'Defense Manufacturing',
              keywords: ['logistics support', 'supply chain', 'distribution'],
              opportunities: 12,
              avgValue: '$3.2M',
              risk: 'Medium',
            },
            {
              sector: 'Healthcare Services',
              keywords: ['medical transport', 'pharmaceutical distribution'],
              opportunities: 8,
              avgValue: '$1.8M',
              risk: 'Low',
            },
            {
              sector: 'Technology Infrastructure',
              keywords: ['equipment deployment', 'installation logistics'],
              opportunities: 15,
              avgValue: '$2.1M',
              risk: 'High',
            },
            {
              sector: 'Construction Services',
              keywords: ['materials transport', 'project logistics'],
              opportunities: 6,
              avgValue: '$1.4M',
              risk: 'Low',
            },
          ].map((sector, index) => (
            <div key={index} className='rounded-lg bg-slate-800/50 p-4'>
              <div className='mb-3'>
                <h4 className='font-bold text-white'>{sector.sector}</h4>
                <div className='mt-2 flex flex-wrap gap-1'>
                  {sector.keywords.map((keyword, kidx) => (
                    <span
                      key={kidx}
                      className='rounded-full bg-indigo-600/20 px-2 py-1 text-xs text-indigo-400'
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <p className='text-slate-400'>Opportunities:</p>
                  <p className='font-bold text-white'>{sector.opportunities}</p>
                </div>
                <div>
                  <p className='text-slate-400'>Avg Value:</p>
                  <p className='font-bold text-green-400'>{sector.avgValue}</p>
                </div>
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <div
                  className={`h-2 w-2 rounded-full ${
                    sector.risk === 'Low'
                      ? 'bg-green-500'
                      : sector.risk === 'Medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                ></div>
                <span className='text-xs text-slate-400'>
                  {sector.risk} Competition
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Government Intelligence Feed */}
      <div className='rounded-xl bg-slate-800 p-6'>
        <h3 className='mb-6 text-2xl font-bold text-white'>
          🔥 Live Government Intelligence Feed
        </h3>
        <div className='space-y-4'>
          {[
            {
              time: '15 min ago',
              message:
                'New RFI posted by DOD for "Global Logistics Modernization" - NAICS 488510 - Est. $25M',
              type: 'success',
              agent: 'Monica (Government Intelligence)',
            },
            {
              time: '32 min ago',
              message:
                'VA issued Sources Sought for Medical Equipment Distribution Network - Logistics component identified',
              type: 'info',
              agent: 'Rae (Requirements Analysis)',
            },
            {
              time: '1 hour ago',
              message:
                'FEMA disaster relief RFI response submitted - Technical capabilities highlighted',
              type: 'success',
              agent: 'Quincy (Response Specialist)',
            },
            {
              time: '2 hours ago',
              message:
                'GSA contracting officer meeting scheduled for supply chain optimization discussion',
              type: 'info',
              agent: 'Samantha (Relationship Manager)',
            },
            {
              time: '3 hours ago',
              message:
                'DHS border security contract includes specialized transport component - Partnership opportunity',
              type: 'warning',
              agent: 'Monica (Government Intelligence)',
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
              />
              <div className='flex-1'>
                <p className='text-white'>{activity.message}</p>
                <div className='mt-1 flex items-center gap-2 text-sm text-slate-400'>
                  <span>{activity.time}</span>
                  <span>•</span>
                  <span>{activity.agent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
