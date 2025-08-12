'use client';

import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TruckingPlanetData {
  metrics: {
    totalRecordsProcessed: number;
    qualifiedLeads: number;
    highValueProspects: number;
    contactsEnriched: number;
    conversionRate: number;
    monthlyRevenue: number;
  };
  activity: {
    csvProcessing: string;
    leadGeneration: string;
    contactEnrichment: string;
    researchTasks: string;
  };
}

export default function TruckingPlanetIntelligence() {
  const [data, setData] = useState<TruckingPlanetData>({
    metrics: {
      totalRecordsProcessed: 12847,
      qualifiedLeads: 1247,
      highValueProspects: 234,
      contactsEnriched: 567,
      conversionRate: 23.5,
      monthlyRevenue: 2340000,
    },
    activity: {
      csvProcessing: 'Processing 1,247 shipper records from latest export',
      leadGeneration: 'Identified 89 pharmaceutical prospects',
      contactEnrichment:
        'Cross-referencing with LinkedIn - 67 decision makers found',
      researchTasks: 'Coordinating manual research on 156 high-value leads',
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/truckingplanet/metrics');
        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch TruckingPlanet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
          <p className='text-gray-600'>
            Loading TruckingPlanet Intelligence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            🌐 TruckingPlanet Network Intelligence
          </CardTitle>
          <p className='text-gray-600'>
            200K+ Shipper Database • Manual Integration • AI-Powered Processing
          </p>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-lg bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {data.metrics.totalRecordsProcessed.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Records Processed</div>
            </div>
            <div className='rounded-lg bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {data.metrics.qualifiedLeads.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Qualified Leads</div>
            </div>
            <div className='rounded-lg bg-purple-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {data.metrics.highValueProspects}
              </div>
              <div className='text-sm text-gray-600'>High-Value Prospects</div>
            </div>
            <div className='rounded-lg bg-pink-50 p-4 text-center'>
              <div className='text-2xl font-bold text-pink-600'>
                ${(data.metrics.monthlyRevenue / 1000000).toFixed(1)}M
              </div>
              <div className='text-sm text-gray-600'>Monthly Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Overview */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              📊 Database Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Dry Van Shippers</span>
                <Badge className='bg-blue-100 text-blue-800'>34,000+</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Flatbed-Stepdeck Shippers</span>
                <Badge className='bg-green-100 text-green-800'>10,900+</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Refrigerated Shippers</span>
                <Badge className='bg-purple-100 text-purple-800'>2,900+</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Distributors & Wholesalers</span>
                <Badge className='bg-orange-100 text-orange-800'>27,000+</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Hospital Equipment Suppliers</span>
                <Badge className='bg-red-100 text-red-800'>2,800+</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>FMCSA Licensed Shippers</span>
                <Badge className='bg-indigo-100 text-indigo-800'>43,000+</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              🔍 Current AI Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='rounded-lg bg-blue-50 p-3'>
                <div className='text-sm font-medium text-blue-800'>
                  CSV Processing
                </div>
                <div className='text-xs text-blue-600'>
                  {data.activity.csvProcessing}
                </div>
              </div>
              <div className='rounded-lg bg-green-50 p-3'>
                <div className='text-sm font-medium text-green-800'>
                  Lead Generation
                </div>
                <div className='text-xs text-green-600'>
                  {data.activity.leadGeneration}
                </div>
              </div>
              <div className='rounded-lg bg-purple-50 p-3'>
                <div className='text-sm font-medium text-purple-800'>
                  Contact Enrichment
                </div>
                <div className='text-xs text-purple-600'>
                  {data.activity.contactEnrichment}
                </div>
              </div>
              <div className='rounded-lg bg-orange-50 p-3'>
                <div className='text-sm font-medium text-orange-800'>
                  Research Tasks
                </div>
                <div className='text-xs text-orange-600'>
                  {data.activity.researchTasks}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Import Tools */}
      <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            📥 Manual Data Import Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <button className='rounded-lg border p-4 text-left transition-colors hover:bg-blue-50'>
              <div className='mb-2 flex items-center gap-3'>
                <span className='text-xl'>📊</span>
                <span className='font-medium'>Import CSV Data</span>
              </div>
              <p className='text-sm text-gray-600'>
                Upload CSV exports from TruckingPlanet databases for AI
                processing
              </p>
            </button>

            <button className='rounded-lg border p-4 text-left transition-colors hover:bg-green-50'>
              <div className='mb-2 flex items-center gap-3'>
                <span className='text-xl'>🔍</span>
                <span className='font-medium'>Research Workflow</span>
              </div>
              <p className='text-sm text-gray-600'>
                Create automated research tasks for high-value prospects
              </p>
            </button>

            <button className='rounded-lg border p-4 text-left transition-colors hover:bg-purple-50'>
              <div className='mb-2 flex items-center gap-3'>
                <span className='text-xl'>📧</span>
                <span className='font-medium'>Generate Outreach</span>
              </div>
              <p className='text-sm text-gray-600'>
                AI-generated personalized outreach campaigns for qualified leads
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* High-Value Prospects */}
      <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            🎯 High-Value Prospects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[
              {
                company: 'Pfizer Global Supply Chain',
                industry: 'Pharmaceutical',
                equipment: 'Refrigerated',
                value: '$2.4M',
                status: 'qualified',
                priority: 'critical',
              },
              {
                company: 'Ford Motor Company Logistics',
                industry: 'Automotive',
                equipment: 'Specialized',
                value: '$1.8M',
                status: 'researching',
                priority: 'high',
              },
              {
                company: 'Amazon Distribution Centers',
                industry: 'Retail',
                equipment: 'Dry Van',
                value: '$3.2M',
                status: 'contacted',
                priority: 'high',
              },
              {
                company: 'Walmart Supply Chain',
                industry: 'Retail',
                equipment: 'Mixed Fleet',
                value: '$4.1M',
                status: 'proposal',
                priority: 'critical',
              },
            ].map((prospect, index) => (
              <div
                key={index}
                className='grid grid-cols-6 items-center gap-4 rounded-lg border border-gray-100 p-3 hover:bg-gray-50'
              >
                <div className='font-medium'>{prospect.company}</div>
                <div className='text-sm text-gray-600'>{prospect.industry}</div>
                <div>
                  <Badge className='bg-blue-100 text-xs text-blue-800'>
                    {prospect.equipment}
                  </Badge>
                </div>
                <div className='font-medium text-green-600'>
                  {prospect.value}
                </div>
                <div>
                  <Badge
                    className={
                      prospect.status === 'qualified'
                        ? 'bg-green-100 text-green-800'
                        : prospect.status === 'researching'
                          ? 'bg-blue-100 text-blue-800'
                          : prospect.status === 'contacted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                    }
                  >
                    {prospect.status}
                  </Badge>
                </div>
                <div>
                  <Badge
                    className={
                      prospect.priority === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }
                  >
                    {prospect.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



