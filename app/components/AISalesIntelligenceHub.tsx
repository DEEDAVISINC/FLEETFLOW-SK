'use client';

import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SalesMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgDealSize: number;
  pipelineValue: number;
  monthlyRevenue: number;
  activeProposals: number;
  closedDeals: number;
}

interface LeadData {
  id: string;
  company: string;
  contact: string;
  source: 'FMCSA' | 'TruckingPlanet' | 'Cold Outreach' | 'Referral';
  score: number;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  value: number;
  lastActivity: string;
  nextAction: string;
}

interface PricingData {
  currentRate: number;
  marketRate: number;
  competitorRates: number[];
  recommendedRate: number;
  margin: number;
  confidence: number;
}

export default function AISalesIntelligenceHub() {
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics>({
    totalLeads: 2847,
    qualifiedLeads: 1247,
    conversionRate: 28.4,
    avgDealSize: 185000,
    pipelineValue: 12500000,
    monthlyRevenue: 2340000,
    activeProposals: 89,
    closedDeals: 156,
  });

  const [leads, setLeads] = useState<LeadData[]>([
    {
      id: 'lead-001',
      company: 'Pfizer Global Supply Chain',
      contact: 'Sarah Johnson (VP Logistics)',
      source: 'TruckingPlanet',
      score: 95,
      status: 'proposal',
      value: 2400000,
      lastActivity: '2 hours ago',
      nextAction: 'Follow up on proposal presentation',
    },
    {
      id: 'lead-002',
      company: 'Ford Motor Company',
      contact: 'Michael Chen (Dir. Transportation)',
      source: 'FMCSA',
      score: 88,
      status: 'negotiation',
      value: 1800000,
      lastActivity: '1 day ago',
      nextAction: 'Contract terms discussion scheduled',
    },
    {
      id: 'lead-003',
      company: 'Amazon Distribution Centers',
      contact: 'Jennifer Rodriguez (Logistics Manager)',
      source: 'Cold Outreach',
      score: 82,
      status: 'qualified',
      value: 3200000,
      lastActivity: '3 hours ago',
      nextAction: 'Schedule discovery call',
    },
  ]);

  const [pricingData, setPricingData] = useState<PricingData>({
    currentRate: 2.85,
    marketRate: 3.12,
    competitorRates: [2.95, 3.05, 3.18, 2.88, 3.22],
    recommendedRate: 3.08,
    margin: 22.5,
    confidence: 87,
  });

  const [selectedTab, setSelectedTab] = useState('dashboard');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSalesMetrics((prev) => ({
        ...prev,
        totalLeads: prev.totalLeads + Math.floor(Math.random() * 3),
        pipelineValue: prev.pipelineValue + Math.floor(Math.random() * 50000),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'proposal':
        return 'bg-yellow-100 text-yellow-800';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'closed':
        return 'bg-emerald-100 text-emerald-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'FMCSA':
        return 'bg-blue-100 text-blue-800';
      case 'TruckingPlanet':
        return 'bg-purple-100 text-purple-800';
      case 'Cold Outreach':
        return 'bg-green-100 text-green-800';
      case 'Referral':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            🎯 AI Sales Intelligence Hub
          </CardTitle>
          <p className='text-gray-600'>
            Advanced sales automation • Lead generation • Dynamic pricing •
            Pipeline management
          </p>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className='flex gap-2'>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'leads', label: 'Lead Generation', icon: '🎯' },
          { id: 'pricing', label: 'Dynamic Pricing', icon: '💰' },
          { id: 'pipeline', label: 'Sales Pipeline', icon: '📈' },
          { id: 'analytics', label: 'Revenue Analytics', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {selectedTab === 'dashboard' && (
        <div className='space-y-6'>
          {/* Key Metrics */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
              <CardContent className='p-4'>
                <div className='text-2xl font-bold'>
                  {salesMetrics.totalLeads?.toLocaleString() || '0'}
                </div>
                <div className='text-sm text-blue-100'>Total Leads</div>
              </CardContent>
            </Card>
            <Card className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
              <CardContent className='p-4'>
                <div className='text-2xl font-bold'>
                  {salesMetrics.conversionRate}%
                </div>
                <div className='text-sm text-green-100'>Conversion Rate</div>
              </CardContent>
            </Card>
            <Card className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
              <CardContent className='p-4'>
                <div className='text-2xl font-bold'>
                  ${((salesMetrics.pipelineValue || 0) / 1000000).toFixed(1)}M
                </div>
                <div className='text-sm text-purple-100'>Pipeline Value</div>
              </CardContent>
            </Card>
            <Card className='bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
              <CardContent className='p-4'>
                <div className='text-2xl font-bold'>
                  ${((salesMetrics.monthlyRevenue || 0) / 1000000).toFixed(1)}M
                </div>
                <div className='text-sm text-orange-100'>Monthly Revenue</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Sales Features */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle>🤖 AI Sales Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                    <div>
                      <div className='font-medium text-green-800'>
                        Lead Scoring Active
                      </div>
                      <div className='text-sm text-green-600'>
                        Processing 247 new prospects
                      </div>
                    </div>
                    <Badge className='bg-green-100 text-green-800'>Live</Badge>
                  </div>
                  <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3'>
                    <div>
                      <div className='font-medium text-blue-800'>
                        Outreach Sequences
                      </div>
                      <div className='text-sm text-blue-600'>
                        89 automated campaigns running
                      </div>
                    </div>
                    <Badge className='bg-blue-100 text-blue-800'>Active</Badge>
                  </div>
                  <div className='flex items-center justify-between rounded-lg bg-purple-50 p-3'>
                    <div>
                      <div className='font-medium text-purple-800'>
                        Proposal Generation
                      </div>
                      <div className='text-sm text-purple-600'>
                        23 proposals generated today
                      </div>
                    </div>
                    <Badge className='bg-purple-100 text-purple-800'>
                      Automated
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle>📈 Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Lead Qualification Rate
                    </span>
                    <span className='text-sm font-bold text-green-600'>
                      78.3%
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Average Deal Size
                    </span>
                    <span className='text-sm font-bold text-blue-600'>
                      ${salesMetrics.avgDealSize?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Sales Cycle Length
                    </span>
                    <span className='text-sm font-bold text-purple-600'>
                      18.5 days
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Customer Lifetime Value
                    </span>
                    <span className='text-sm font-bold text-orange-600'>
                      $2.4M
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Lead Generation Tab */}
      {selectedTab === 'leads' && (
        <div className='space-y-6'>
          <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle>🎯 Lead Generation Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <Button className='h-auto flex-col items-start p-4'>
                    <div className='mb-2 text-lg'>🔍 FMCSA Integration</div>
                    <div className='text-left text-sm'>
                      Automated prospect discovery from FMCSA database
                    </div>
                  </Button>
                  <Button
                    className='h-auto flex-col items-start p-4'
                    variant='outline'
                  >
                    <div className='mb-2 text-lg'>🌐 TruckingPlanet Sync</div>
                    <div className='text-left text-sm'>
                      Process 200K+ shipper records with AI scoring
                    </div>
                  </Button>
                  <Button
                    className='h-auto flex-col items-start p-4'
                    variant='outline'
                  >
                    <div className='mb-2 text-lg'>📧 Cold Outreach</div>
                    <div className='text-left text-sm'>
                      AI-generated personalized campaigns
                    </div>
                  </Button>
                </div>

                {/* Lead List */}
                <div className='space-y-3'>
                  <h4 className='text-lg font-semibold'>
                    High-Value Prospects
                  </h4>
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className='grid grid-cols-7 items-center gap-4 rounded-lg border p-3 hover:bg-gray-50'
                    >
                      <div className='font-medium'>{lead.company}</div>
                      <div className='text-sm text-gray-600'>
                        {lead.contact}
                      </div>
                      <Badge className={getSourceColor(lead.source)}>
                        {lead.source}
                      </Badge>
                      <div className='text-center'>
                        <div className='text-lg font-bold text-blue-600'>
                          {lead.score}
                        </div>
                        <div className='text-xs text-gray-500'>Score</div>
                      </div>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <div className='font-medium text-green-600'>
                        ${((lead.value || 0) / 1000000).toFixed(1)}M
                      </div>
                      <div className='text-xs text-gray-500'>
                        {lead.lastActivity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dynamic Pricing Tab */}
      {selectedTab === 'pricing' && (
        <div className='space-y-6'>
          <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle>💰 Dynamic Pricing Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold'>Market Analysis</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3'>
                      <span className='font-medium'>Current Rate</span>
                      <span className='text-xl font-bold text-blue-600'>
                        ${pricingData.currentRate}/mile
                      </span>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                      <span className='font-medium'>Market Rate</span>
                      <span className='text-xl font-bold text-green-600'>
                        ${pricingData.marketRate}/mile
                      </span>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-purple-50 p-3'>
                      <span className='font-medium'>AI Recommended</span>
                      <span className='text-xl font-bold text-purple-600'>
                        ${pricingData.recommendedRate}/mile
                      </span>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-orange-50 p-3'>
                      <span className='font-medium'>Projected Margin</span>
                      <span className='text-xl font-bold text-orange-600'>
                        {pricingData.margin}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold'>
                    Competitive Intelligence
                  </h4>
                  <div className='space-y-2'>
                    {pricingData.competitorRates.map((rate, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between rounded-lg border p-2'
                      >
                        <span className='text-sm'>Competitor {index + 1}</span>
                        <span className='font-medium'>${rate}/mile</span>
                      </div>
                    ))}
                  </div>
                  <div className='rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
                    <div className='text-sm font-medium text-gray-800'>
                      AI Confidence
                    </div>
                    <div className='text-2xl font-bold text-purple-600'>
                      {pricingData.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Pipeline Tab */}
      {selectedTab === 'pipeline' && (
        <div className='space-y-6'>
          <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle>📈 Sales Pipeline Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold'>Pipeline Stages</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3'>
                      <div>
                        <div className='font-medium text-blue-800'>
                          New Leads
                        </div>
                        <div className='text-sm text-blue-600'>
                          Initial contact made
                        </div>
                      </div>
                      <Badge className='bg-blue-100 text-blue-800'>247</Badge>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                      <div>
                        <div className='font-medium text-green-800'>
                          Qualified
                        </div>
                        <div className='text-sm text-green-600'>
                          Needs assessment complete
                        </div>
                      </div>
                      <Badge className='bg-green-100 text-green-800'>156</Badge>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-yellow-50 p-3'>
                      <div>
                        <div className='font-medium text-yellow-800'>
                          Proposal
                        </div>
                        <div className='text-sm text-yellow-600'>
                          Proposals submitted
                        </div>
                      </div>
                      <Badge className='bg-yellow-100 text-yellow-800'>
                        89
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-orange-50 p-3'>
                      <div>
                        <div className='font-medium text-orange-800'>
                          Negotiation
                        </div>
                        <div className='text-sm text-orange-600'>
                          Contract discussions
                        </div>
                      </div>
                      <Badge className='bg-orange-100 text-orange-800'>
                        34
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold'>Automation Features</h4>
                  <div className='space-y-3'>
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 font-medium'>
                        📧 Follow-up Sequences
                      </div>
                      <div className='text-sm text-gray-600'>
                        Automated email campaigns with 67% open rate
                      </div>
                    </div>
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 font-medium'>
                        📄 Proposal Generation
                      </div>
                      <div className='text-sm text-gray-600'>
                        AI-generated proposals in 15 minutes
                      </div>
                    </div>
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 font-medium'>
                        🤝 Contract Assistance
                      </div>
                      <div className='text-sm text-gray-600'>
                        Negotiation talking points and objection handling
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Analytics Tab */}
      {selectedTab === 'analytics' && (
        <div className='space-y-6'>
          <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle>📋 Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold'>
                    Performance Tracking
                  </h4>
                  <div className='space-y-3'>
                    <div className='rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4'>
                      <div className='text-sm text-gray-600'>
                        Monthly Revenue
                      </div>
                      <div className='text-2xl font-bold text-green-600'>
                        $
                        {((salesMetrics.monthlyRevenue || 0) / 1000000).toFixed(
                          1
                        )}
                        M
                      </div>
                      <div className='text-sm text-green-600'>
                        ↑ 23% from last month
                      </div>
                    </div>
                    <div className='rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
                      <div className='text-sm text-gray-600'>
                        Average Deal Size
                      </div>
                      <div className='text-2xl font-bold text-blue-600'>
                        ${salesMetrics.avgDealSize?.toLocaleString() || '0'}
                      </div>
                      <div className='text-sm text-blue-600'>
                        ↑ 15% improvement
                      </div>
                    </div>
                    <div className='rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 p-4'>
                      <div className='text-sm text-gray-600'>Sales Cycle</div>
                      <div className='text-2xl font-bold text-purple-600'>
                        18.5 days
                      </div>
                      <div className='text-sm text-purple-600'>
                        ↓ 12% faster
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-semibold'>
                    Optimization Insights
                  </h4>
                  <div className='space-y-3'>
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 font-medium text-green-600'>
                        🎯 Top Performing Source
                      </div>
                      <div className='text-sm'>
                        TruckingPlanet leads convert 34% higher
                      </div>
                    </div>
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 font-medium text-blue-600'>
                        📊 Best Industry Segment
                      </div>
                      <div className='text-sm'>
                        Pharmaceutical logistics: $2.4M avg deal size
                      </div>
                    </div>
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 font-medium text-purple-600'>
                        ⏰ Optimal Contact Time
                      </div>
                      <div className='text-sm'>
                        Tuesday 10-11 AM: 67% response rate
                      </div>
                    </div>
                    <div className='rounded-lg border p-3'>
                      <div className='mb-2 font-medium text-orange-600'>
                        🔄 Follow-up Impact
                      </div>
                      <div className='text-sm'>
                        5-touch sequence increases close rate by 45%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
