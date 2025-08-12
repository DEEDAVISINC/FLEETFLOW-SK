'use client';

import { useEffect, useState } from 'react';

export default function TabCompatibleCRMDashboard() {
  console.log('🚀 TabCompatibleCRMDashboard LOADED - TAB SYSTEM COMPATIBLE');

  const [leads, setLeads] = useState([
    {
      id: 'SL-001',
      companyName: 'Midwest Manufacturing Corp',
      serviceCategory: 'Logistics',
      priority: 'hot',
      estimatedValue: 480000,
      status: 'proposal_sent',
      urgency: 'high',
    },
    {
      id: 'SL-002',
      companyName: 'Pacific Coast Imports LLC',
      serviceCategory: 'Warehousing',
      priority: 'urgent',
      estimatedValue: 360000,
      status: 'demo_scheduled',
      urgency: 'urgent',
    },
    {
      id: 'SL-003',
      companyName: 'Thunder Trucking LLC',
      serviceCategory: 'Dispatching',
      priority: 'high',
      estimatedValue: 72000,
      status: 'qualified',
      urgency: 'medium',
    },
    {
      id: 'SL-004',
      companyName: 'Urban Retail Solutions Inc',
      serviceCategory: 'Freight_Brokerage',
      priority: 'hot',
      estimatedValue: 750000,
      status: 'negotiating',
      urgency: 'high',
    },
    {
      id: 'SL-005',
      companyName: 'Southwest Food Distributors',
      serviceCategory: 'Supply_Chain_Consulting',
      priority: 'high',
      estimatedValue: 180000,
      status: 'contacted',
      urgency: 'medium',
    },
  ]);

  useEffect(() => {
    console.log(
      '✅ TabCompatibleCRMDashboard: Component mounted with',
      leads.length,
      'leads'
    );
  }, []);

  const totalPipeline = leads.reduce(
    (sum, lead) => sum + lead.estimatedValue,
    0
  );
  const hotLeads = leads.filter((lead) => lead.priority === 'hot').length;
  const avgDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent'>
          CRM Lead Intelligence Dashboard
        </h2>
        <p className='mt-2 text-lg text-gray-300'>
          AI-Powered Service Lead Management & Pipeline Analytics
        </p>
      </div>

      {/* Metrics Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Total Pipeline */}
        <div className='rounded-xl border border-white/20 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-xl backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-blue-100'>
                Total Pipeline
              </p>
              <p className='text-2xl font-bold'>
                ${(totalPipeline / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className='rounded-full bg-blue-400/20 p-3'>
              <span className='text-2xl'>💰</span>
            </div>
          </div>
        </div>

        {/* Active Leads */}
        <div className='rounded-xl border border-white/20 bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-xl backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-purple-100'>
                Active Leads
              </p>
              <p className='text-2xl font-bold'>{leads.length}</p>
            </div>
            <div className='rounded-full bg-purple-400/20 p-3'>
              <span className='text-2xl'>👥</span>
            </div>
          </div>
        </div>

        {/* Hot Leads */}
        <div className='rounded-xl border border-white/20 bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-xl backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-orange-100'>Hot Leads</p>
              <p className='text-2xl font-bold'>{hotLeads}</p>
            </div>
            <div className='rounded-full bg-orange-400/20 p-3'>
              <span className='text-2xl'>🔥</span>
            </div>
          </div>
        </div>

        {/* Avg Deal Size */}
        <div className='rounded-xl border border-white/20 bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-xl backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-green-100'>
                Avg Deal Size
              </p>
              <p className='text-2xl font-bold'>
                ${(avgDealSize / 1000).toFixed(0)}K
              </p>
            </div>
            <div className='rounded-full bg-green-400/20 p-3'>
              <span className='text-2xl'>📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className='rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm'>
        <h3 className='mb-6 text-2xl font-bold text-white'>
          Service Leads Pipeline
        </h3>

        <div className='space-y-4'>
          {leads.map((lead) => (
            <div
              key={lead.id}
              className='rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm'
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <h4 className='text-lg font-semibold text-white'>
                    {lead.companyName}
                  </h4>
                  <p className='text-sm text-gray-300'>
                    {lead.serviceCategory}
                  </p>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-green-400'>
                      ${(lead.estimatedValue / 1000).toFixed(0)}K
                    </p>
                    <p className='text-sm text-gray-400'>Estimated Value</p>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        lead.priority === 'hot'
                          ? 'border border-red-500/30 bg-red-500/20 text-red-300'
                          : lead.priority === 'urgent'
                            ? 'border border-orange-500/30 bg-orange-500/20 text-orange-300'
                            : lead.priority === 'high'
                              ? 'border border-yellow-500/30 bg-yellow-500/20 text-yellow-300'
                              : 'border border-gray-500/30 bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {lead.priority?.toUpperCase() || 'STANDARD'}
                    </span>

                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        lead.status === 'negotiating'
                          ? 'border border-blue-500/30 bg-blue-500/20 text-blue-300'
                          : lead.status === 'proposal_sent'
                            ? 'border border-purple-500/30 bg-purple-500/20 text-purple-300'
                            : lead.status === 'demo_scheduled'
                              ? 'border border-green-500/30 bg-green-500/20 text-green-300'
                              : 'border border-gray-500/30 bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {lead.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className='rounded-xl border border-white/20 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 p-6 shadow-xl backdrop-blur-sm'>
        <h3 className='mb-4 text-xl font-bold text-white'>
          🤖 AI Recommendations
        </h3>
        <div className='space-y-2 text-sm text-gray-200'>
          <p>
            • Focus on closing Urban Retail Solutions ($750K) - 90% win
            probability
          </p>
          <p>
            • Schedule follow-up with Midwest Manufacturing - proposal expires
            Dec 31st
          </p>
          <p>
            • Prioritize Pacific Coast Imports demo - decision timeline is 30
            days
          </p>
          <p>
            • Total pipeline value: ${(totalPipeline / 1000000).toFixed(1)}M
            across {leads.length} active opportunities
          </p>
        </div>
      </div>
    </div>
  );
}
