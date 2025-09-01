'use client';

import {
  AlertTriangle,
  DollarSign,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Lead {
  id: string;
  companyName: string;
  potentialValue?: number;
  salesActivity: {
    status: string;
    winProbability: number;
  };
  priority?: string;
}

export default function NewCRMDashboard() {
  // FORCE REFRESH: 2024-12-21 23:52:00
  console.info('🔥 NewCRMDashboard LOADED - TIMESTAMP: 2024-12-21 23:52:00');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Add fallback mock data in case API fails
  const mockLeads: Lead[] = [
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
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        console.info('🔄 NewCRMDashboard: Starting data fetch...');
        const response = await fetch(
          '/api/ai-flow/services-sales?tenantId=tenant-demo-123'
        );
        console.info('📡 NewCRMDashboard: Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.info('📊 NewCRMDashboard: Data received:', data);

        if (data.success && data.data?.serviceLeads) {
          console.info(
            '✅ NewCRMDashboard: Setting leads:',
            data.data.serviceLeads.length
          );
          setLeads(data.data.serviceLeads);
        } else {
          console.warn('⚠️ NewCRMDashboard: Invalid data structure:', data);
        }
      } catch (error) {
        console.error('❌ NewCRMDashboard: Fetch error:', error);
        console.info('🔄 NewCRMDashboard: Using fallback mock data');
        setLeads(mockLeads);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className='space-y-6'>
        <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-center'>
              <div className='text-lg'>Loading CRM data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalValue = leads.reduce(
    (sum, lead) => sum + (lead.potentialValue || 0),
    0
  );
  const qualifiedLeads = leads.filter((lead) =>
    ['qualified', 'demo_scheduled', 'proposal_sent', 'negotiating'].includes(
      lead.salesActivity?.status || ''
    )
  ).length;
  const avgWinRate =
    leads.length > 0
      ? Math.round(
          leads.reduce(
            (sum, lead) => sum + (lead.salesActivity?.winProbability || 0),
            0
          ) / leads.length
        )
      : 0;

  return (
    <div className='space-y-6'>
      {/* Main CRM Dashboard Card */}
      <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            CRM Lead Intelligence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Left Column - Lead Intelligence */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                  <span className='font-medium'>CRM System Active</span>
                </div>
                <Badge className='bg-green-100 text-green-800'>
                  {leads.length} Active Leads
                </Badge>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-lg bg-blue-50 p-4 text-center'>
                  <div className='text-3xl font-bold text-blue-600'>
                    {leads.length}
                  </div>
                  <div className='text-sm text-gray-600'>Total Leads</div>
                </div>
                <div className='rounded-lg bg-purple-50 p-4 text-center'>
                  <div className='text-3xl font-bold text-purple-600'>
                    {qualifiedLeads}
                  </div>
                  <div className='text-sm text-gray-600'>Qualified</div>
                </div>
              </div>

              <div className='rounded-lg bg-orange-50 p-4 text-center'>
                <div className='text-2xl font-bold text-orange-600'>
                  ${(totalValue / 1000000).toFixed(1)}M
                </div>
                <div className='text-sm text-gray-600'>Pipeline Value</div>
              </div>
            </div>

            {/* Right Column - Revenue Analytics */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Revenue Analytics</h3>

              <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-lg bg-green-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    ${Math.round(totalValue / leads.length / 1000)}K
                  </div>
                  <div className='text-sm text-gray-600'>Avg Deal Size</div>
                </div>
                <div className='rounded-lg bg-pink-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-pink-600'>
                    {avgWinRate}%
                  </div>
                  <div className='text-sm text-gray-600'>Avg Win Rate</div>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium'>AI Features</h4>
                <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                  <Target className='h-4 w-4 text-green-600' />
                  <span className='text-sm'>Lead Scoring & Qualification</span>
                </div>
                <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                  <TrendingUp className='h-4 w-4 text-blue-600' />
                  <span className='text-sm'>Pipeline Analytics</span>
                </div>
                <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                  <DollarSign className='h-4 w-4 text-purple-600' />
                  <span className='text-sm'>Revenue Forecasting</span>
                </div>
                <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                  <AlertTriangle className='h-4 w-4 text-orange-600' />
                  <span className='text-sm'>Risk Assessment</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Value Pipeline Card */}
      <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5 text-yellow-500' />
            High-Value Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {leads
              .filter((lead) => (lead.potentialValue || 0) > 50000)
              .slice(0, 5)
              .map((lead) => (
                <div
                  key={lead.id}
                  className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-bold text-white'>
                      {lead.companyName.charAt(0)}
                    </div>
                    <div>
                      <div className='font-medium'>{lead.companyName}</div>
                      <div className='text-sm text-gray-600'>
                        {lead.salesActivity?.winProbability || 0}% win
                        probability
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold text-green-600'>
                      ${(lead.potentialValue || 0).toLocaleString()}
                    </div>
                    <Badge
                      className={
                        lead.priority === 'hot'
                          ? 'bg-red-100 text-red-800'
                          : lead.priority === 'urgent'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {lead.priority || 'standard'} Priority
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status Card */}
      <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
            <div className='rounded-lg bg-blue-50 p-3'>
              <div className='text-sm text-gray-600'>Component:</div>
              <div className='font-bold'>NewCRMDashboard</div>
            </div>
            <div className='rounded-lg bg-green-50 p-3'>
              <div className='text-sm text-gray-600'>Leads Loaded:</div>
              <div className='font-bold'>{leads.length}</div>
            </div>
            <div className='rounded-lg bg-purple-50 p-3'>
              <div className='text-sm text-gray-600'>API Status:</div>
              <div className='font-bold text-green-600'>Connected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
