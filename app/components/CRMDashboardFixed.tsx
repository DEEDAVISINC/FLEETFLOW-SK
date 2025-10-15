'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  companyName: string;
  serviceCategory: string;
  estimatedValue: number;
  status: string;
  urgency: string;
  priority?: string;
}

export default function CRMDashboardFixed() {
  console.info('🔥 CRMDashboardFixed LOADED - NEW COMPONENT!');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with real lead data from CRM API
  const mockLeads: Lead[] = [];

  useEffect(() => {
    const loadData = async () => {
      try {
        console.info('🔄 CRMDashboardFixed: Starting data fetch...');
        const response = await fetch(
          '/api/ai-flow/services-sales?tenantId=tenant-demo-123'
        );
        console.info('📡 CRMDashboardFixed: Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.info('📊 CRMDashboardFixed: Data received:', data);

        if (data.success && data.data?.serviceLeads) {
          console.info(
            '✅ CRMDashboardFixed: Setting API leads:',
            data.data.serviceLeads.length
          );
          setLeads(data.data.serviceLeads);
        } else {
          console.info(
            '🔄 CRMDashboardFixed: Using mock data due to invalid API structure'
          );
          setLeads(mockLeads);
        }
      } catch (error) {
        console.error('❌ CRMDashboardFixed: Fetch error:', error);
        console.info('🔄 CRMDashboardFixed: Using fallback mock data');
        setLeads(mockLeads);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-lg text-gray-600'>Loading CRM data...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6'>
      <div className='mx-auto max-w-7xl space-y-6'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent'>
            CRM Lead Intelligence Dashboard
          </h1>
          <p className='mt-2 text-xl text-gray-600'>
            AI-Powered Service Lead Management & Pipeline Analytics
          </p>
        </div>

        {/* Metrics Cards */}
        <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-white/20 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-xl backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-100'>
                  Total Pipeline
                </p>
                <p className='text-2xl font-bold'>
                  $
                  {(
                    leads.reduce((sum, lead) => sum + lead.estimatedValue, 0) /
                    1000000
                  ).toFixed(1)}
                  M
                </p>
              </div>
              <div className='rounded-full bg-blue-400/20 p-3'>
                <svg
                  className='h-6 w-6 text-blue-200'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-xl backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-100'>
                  Active Leads
                </p>
                <p className='text-2xl font-bold'>{leads.length}</p>
              </div>
              <div className='rounded-full bg-purple-400/20 p-3'>
                <svg
                  className='h-6 w-6 text-purple-200'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-xl backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-orange-100'>Hot Leads</p>
                <p className='text-2xl font-bold'>
                  {leads.filter((lead) => lead.priority === 'hot').length}
                </p>
              </div>
              <div className='rounded-full bg-orange-400/20 p-3'>
                <svg
                  className='h-6 w-6 text-orange-200'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-xl backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-100'>
                  Avg Deal Size
                </p>
                <p className='text-2xl font-bold'>
                  $
                  {leads.length > 0
                    ? (
                        leads.reduce(
                          (sum, lead) => sum + lead.estimatedValue,
                          0
                        ) /
                        leads.length /
                        1000
                      ).toFixed(0)
                    : '0'}
                  K
                </p>
              </div>
              <div className='rounded-full bg-green-400/20 p-3'>
                <svg
                  className='h-6 w-6 text-green-200'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className='rounded-xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900'>
            Service Leads Pipeline
          </h2>

          <div className='space-y-4'>
            {leads.map((lead) => (
              <div
                key={lead.id}
                className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {lead.companyName}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {lead.serviceCategory}
                    </p>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-green-600'>
                        ${(lead.estimatedValue / 1000).toFixed(0)}K
                      </p>
                      <p className='text-sm text-gray-500'>Estimated Value</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          lead.priority === 'hot'
                            ? 'bg-red-100 text-red-800'
                            : lead.priority === 'urgent'
                              ? 'bg-orange-100 text-orange-800'
                              : lead.priority === 'high'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {lead.priority?.toUpperCase() || 'STANDARD'}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          lead.status === 'negotiating'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'proposal_sent'
                              ? 'bg-purple-100 text-purple-800'
                              : lead.status === 'demo_scheduled'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
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
        <div className='rounded-xl border border-white/20 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-xl backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-bold'>🤖 AI Recommendations</h3>
          <div className='space-y-2 text-sm'>
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
              • Total pipeline value: $
              {(
                leads.reduce((sum, lead) => sum + lead.estimatedValue, 0) /
                1000000
              ).toFixed(1)}
              M across {leads.length} active opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
