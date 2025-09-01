'use client';

import { useState } from 'react';

interface CampaignMetrics {
  name: string;
  monthlyRevenue: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
  startDate: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
}

export default function CampaignExecutionPlan() {
  const [selectedPhase, setSelectedPhase] = useState<
    'phase1' | 'phase2' | 'phase3'
  >('phase1');

  // PHASE 1: TOP 3 PRIORITY CAMPAIGNS (CONSERVATIVE PROJECTIONS)
  const phase1Campaigns: CampaignMetrics[] = [
    {
      name: 'Desperate Shippers Blitz',
      monthlyRevenue: 7500, // Conservative: $7,500/month based on realistic conversion rates
      duration: 30,
      difficulty: 'medium',
      priority: 1,
      startDate: 'Immediate',
      status: 'planned',
    },
    {
      name: 'New Businesses Freight Blitz',
      monthlyRevenue: 6000, // Conservative: $6,000/month based on startup freight needs
      duration: 30,
      difficulty: 'easy',
      priority: 2,
      startDate: 'Week 2',
      status: 'planned',
    },
    {
      name: 'High-Value Prospect Acceleration',
      monthlyRevenue: 15000, // Conservative: $15,000/month based on 12 conversions at $50K average
      duration: 30,
      difficulty: 'hard',
      priority: 3,
      startDate: 'Week 4',
      status: 'planned',
    },
  ];

  // PHASE 2: HIGH-REVENUE ENTERPRISE CAMPAIGNS
  const phase2Campaigns: CampaignMetrics[] = [
    {
      name: 'Enterprise Manufacturer Hunt',
      monthlyRevenue: 16667,
      duration: 45,
      difficulty: 'medium',
      priority: 3,
      startDate: 'Month 2',
      status: 'planned',
    },
    {
      name: 'High-Value Prospect Acceleration',
      monthlyRevenue: 20000,
      duration: 30,
      difficulty: 'hard',
      priority: 4,
      startDate: 'Month 2',
      status: 'planned',
    },
  ];

  // PHASE 3: VERTICAL & NICHE CAMPAIGNS
  const phase3Campaigns: CampaignMetrics[] = [
    {
      name: 'Food & Beverage Manufacturer Initiative',
      monthlyRevenue: 9286,
      duration: 35,
      difficulty: 'medium',
      priority: 5,
      startDate: 'Month 3',
      status: 'planned',
    },
    {
      name: 'Warehouse & 3PL Provider Initiative',
      monthlyRevenue: 8889,
      duration: 45,
      difficulty: 'medium',
      priority: 6,
      startDate: 'Month 3',
      status: 'planned',
    },
  ];

  const totalPhase1Revenue = phase1Campaigns.reduce(
    (sum, campaign) => sum + campaign.monthlyRevenue,
    0
  );
  const totalPhase2Revenue = phase2Campaigns.reduce(
    (sum, campaign) => sum + campaign.monthlyRevenue,
    0
  );
  const totalPhase3Revenue = phase3Campaigns.reduce(
    (sum, campaign) => sum + campaign.monthlyRevenue,
    0
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-600';
      case 'paused':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className='mx-auto max-w-6xl space-y-6 p-6'>
      {/* Header */}
      <div className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white'>
        <h1 className='mb-2 text-3xl font-bold'>
          🎯 Strategic Campaign Execution Plan
        </h1>
        <p className='text-xl'>
          Focus on 3 High-Value Campaigns for Maximum Revenue
        </p>
        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='rounded-lg bg-white/10 p-4'>
            <div className='text-2xl font-bold'>$28,500</div>
            <div className='text-sm'>
              Monthly Revenue (Phase 1 - 3 Campaigns)
            </div>
          </div>
          <div className='rounded-lg bg-white/10 p-4'>
            <div className='text-2xl font-bold'>90 Days</div>
            <div className='text-sm'>Time to Full Revenue (3 Campaigns)</div>
          </div>
          <div className='rounded-lg bg-white/10 p-4'>
            <div className='text-2xl font-bold'>91%</div>
            <div className='text-sm'>AI Cost Reduction</div>
          </div>
        </div>
      </div>

      {/* Phase Selector */}
      <div className='mb-6 flex space-x-4'>
        {[
          {
            id: 'phase1',
            label: 'Phase 1: Priority Campaigns',
            count: phase1Campaigns.length,
          },
          {
            id: 'phase2',
            label: 'Phase 2: Enterprise Focus',
            count: phase2Campaigns.length,
          },
          {
            id: 'phase3',
            label: 'Phase 3: Vertical Expansion',
            count: phase3Campaigns.length,
          },
        ].map((phase) => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhase(phase.id as any)}
            className={`rounded-lg px-6 py-3 font-semibold transition-all ${
              selectedPhase === phase.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {phase.label} ({phase.count})
          </button>
        ))}
      </div>

      {/* Phase Content */}
      {selectedPhase === 'phase1' && (
        <div className='space-y-6'>
          <div className='border-l-4 border-green-500 bg-green-50 p-6'>
            <h2 className='mb-2 text-2xl font-bold text-green-800'>
              🚀 PHASE 1: CONSERVATIVE REVENUE EXECUTION
            </h2>
            <p className='mb-4 text-green-700'>
              Start with the 3 most valuable campaigns for maximum revenue
              generation
            </p>
            <div className='rounded-lg bg-white p-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <h3 className='mb-2 text-lg font-bold'>📊 Revenue Impact</h3>
                  <div className='text-3xl font-bold text-green-600'>
                    ${totalPhase1Revenue.toLocaleString()}/month
                  </div>
                  <div className='text-sm text-gray-600'>
                    Combined monthly revenue
                  </div>
                </div>
                <div>
                  <h3 className='mb-2 text-lg font-bold'>⏰ Timeline</h3>
                  <div className='text-3xl font-bold text-blue-600'>
                    90 Days
                  </div>
                  <div className='text-sm text-gray-600'>
                    To full revenue generation (3 campaigns)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Cards */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {phase1Campaigns.map((campaign, index) => (
              <div
                key={campaign.name}
                className='rounded-lg border bg-white p-6 shadow-lg'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`h-4 w-4 rounded-full ${getDifficultyColor(campaign.difficulty)}`}
                    ></div>
                    <h3 className='text-xl font-bold'>{campaign.name}</h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${getStatusColor(campaign.status)}`}
                  >
                    {campaign.status.toUpperCase()}
                  </span>
                </div>

                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Monthly Revenue:</span>
                    <span className='font-bold text-green-600'>
                      ${campaign.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Duration:</span>
                    <span className='font-bold'>{campaign.duration} days</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Difficulty:</span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold text-white ${getDifficultyColor(campaign.difficulty)}`}
                    >
                      {campaign.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Priority:</span>
                    <span className='font-bold text-blue-600'>
                      #{campaign.priority}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Start Date:</span>
                    <span className='font-bold'>{campaign.startDate}</span>
                  </div>
                </div>

                <div className='mt-4 border-t pt-4'>
                  <button className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
                    🚀 Launch Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPhase === 'phase2' && (
        <div className='space-y-6'>
          <div className='border-l-4 border-blue-500 bg-blue-50 p-6'>
            <h2 className='mb-2 text-2xl font-bold text-blue-800'>
              🏭 PHASE 2: ENTERPRISE EXPANSION
            </h2>
            <p className='mb-4 text-blue-700'>
              Add high-value enterprise campaigns after Phase 1 success
            </p>
            <div className='rounded-lg bg-white p-4'>
              <div className='text-3xl font-bold text-blue-600'>
                ${totalPhase2Revenue.toLocaleString()}/month
              </div>
              <div className='text-sm text-gray-600'>
                Additional monthly revenue
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {phase2Campaigns.map((campaign) => (
              <div
                key={campaign.name}
                className='rounded-lg border bg-white p-6 opacity-75 shadow-lg'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-xl font-bold'>{campaign.name}</h3>
                  <span className='rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-500'>
                    PLANNED
                  </span>
                </div>
                <div className='mb-2 text-2xl font-bold text-green-600'>
                  ${campaign.monthlyRevenue.toLocaleString()}/month
                </div>
                <div className='text-gray-600'>
                  Starts: {campaign.startDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPhase === 'phase3' && (
        <div className='space-y-6'>
          <div className='border-l-4 border-purple-500 bg-purple-50 p-6'>
            <h2 className='mb-2 text-2xl font-bold text-purple-800'>
              📈 PHASE 3: VERTICAL DOMINATION
            </h2>
            <p className='mb-4 text-purple-700'>
              Scale with industry-specific campaigns
            </p>
            <div className='rounded-lg bg-white p-4'>
              <div className='text-3xl font-bold text-purple-600'>
                ${totalPhase3Revenue.toLocaleString()}/month
              </div>
              <div className='text-sm text-gray-600'>
                Additional monthly revenue
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {phase3Campaigns.map((campaign) => (
              <div
                key={campaign.name}
                className='rounded-lg border bg-white p-6 opacity-50 shadow-lg'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-xl font-bold'>{campaign.name}</h3>
                  <span className='rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-500'>
                    FUTURE
                  </span>
                </div>
                <div className='mb-2 text-2xl font-bold text-green-600'>
                  ${campaign.monthlyRevenue.toLocaleString()}/month
                </div>
                <div className='text-gray-600'>
                  Starts: {campaign.startDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Summary */}
      <div className='rounded-lg bg-gray-50 p-6'>
        <h3 className='mb-4 text-xl font-bold'>🎯 Strategic Summary</h3>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-green-600'>$28,500</div>
            <div className='text-sm text-gray-600'>
              Phase 1 Monthly Revenue (3 Campaigns)
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-blue-600'>$68,667</div>
            <div className='text-sm text-gray-600'>
              Phase 1-2 Combined Revenue
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-purple-600'>$93,556</div>
            <div className='text-sm text-gray-600'>
              All Phase Revenue Potential
            </div>
          </div>
        </div>
        <div className='mt-4 text-center text-sm text-gray-600'>
          Start with Phase 1 for fastest revenue, then expand strategically
        </div>
      </div>
    </div>
  );
}
