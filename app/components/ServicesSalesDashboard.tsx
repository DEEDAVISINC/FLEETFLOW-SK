'use client';

import {
  BarChart3,
  Briefcase,
  Building2,
  DollarSign,
  Mail,
  Navigation,
  Phone,
  Target,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function ServicesSalesDashboard() {
  const [servicesData, setServicesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicesData = async () => {
      try {
        const response = await fetch(
          '/api/ai-flow/services-sales?tenantId=tenant-demo-123&metrics=true'
        );
        if (response.ok) {
          const data = await response.json();
          setServicesData(data.data);
        }
      } catch (error) {
        console.error('Failed to load services data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServicesData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-600' />
          <p className='text-gray-600'>Loading Services Sales Pipeline...</p>
        </div>
      </div>
    );
  }

  if (!servicesData) {
    return (
      <div className='p-8 text-center'>
        <Briefcase className='mx-auto mb-4 h-16 w-16 text-gray-400' />
        <h3 className='mb-2 text-xl font-semibold text-gray-900'>
          Services Sales Pipeline
        </h3>
        <p className='text-gray-600'>Failed to load services sales data</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Revenue Engine Header */}
      <div className='rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white'>
        <div className='mb-4 flex items-center gap-3'>
          <Briefcase className='h-8 w-8' />
          <div>
            <h2 className='text-3xl font-bold'>💰 Services Sales Pipeline</h2>
            <p className='text-green-100'>
              B2B Revenue Engine - Logistics, Warehousing, Dispatching &
              Brokerage Services
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              $
              {(
                servicesData.metrics?.totalPipelineValue || 1662000
              ).toLocaleString()}
            </div>
            <div className='text-sm text-green-100'>Pipeline Value</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              $
              {(
                servicesData.metrics?.monthlyRecurringRevenue || 138500
              ).toLocaleString()}
            </div>
            <div className='text-sm text-green-100'>Monthly Recurring</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              {servicesData.metrics?.hotLeads || 2}
            </div>
            <div className='text-sm text-green-100'>Hot Leads</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              {servicesData.metrics?.conversionRate?.toFixed(1) || 25.0}%
            </div>
            <div className='text-sm text-green-100'>Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Service Categories Overview */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Truck className='h-8 w-8 text-blue-200' />
              <div className='text-right'>
                <div className='text-2xl font-bold'>1</div>
                <div className='text-sm text-blue-100'>Active</div>
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold'>
              🏭 Logistics Services
            </h3>
            <p className='text-sm text-blue-100'>
              Supply chain management, inventory optimization
            </p>
            <div className='mt-4 text-sm'>
              <div className='flex justify-between'>
                <span>Pipeline:</span>
                <span className='font-semibold'>$480K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-500 to-purple-600 text-white'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Building2 className='h-8 w-8 text-purple-200' />
              <div className='text-right'>
                <div className='text-2xl font-bold'>1</div>
                <div className='text-sm text-purple-100'>Active</div>
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold'>
              📦 Warehousing Services
            </h3>
            <p className='text-sm text-purple-100'>
              3PL warehousing, cross-docking, fulfillment
            </p>
            <div className='mt-4 text-sm'>
              <div className='flex justify-between'>
                <span>Pipeline:</span>
                <span className='font-semibold'>$360K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-500 to-orange-600 text-white'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Navigation className='h-8 w-8 text-orange-200' />
              <div className='text-right'>
                <div className='text-2xl font-bold'>1</div>
                <div className='text-sm text-orange-100'>Active</div>
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold'>
              📡 Dispatching Services
            </h3>
            <p className='text-sm text-orange-100'>
              Load dispatching, route optimization
            </p>
            <div className='mt-4 text-sm'>
              <div className='flex justify-between'>
                <span>Pipeline:</span>
                <span className='font-semibold'>$72K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-teal-500 to-teal-600 text-white'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Users className='h-8 w-8 text-teal-200' />
              <div className='text-right'>
                <div className='text-2xl font-bold'>1</div>
                <div className='text-sm text-teal-100'>Active</div>
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold'>🤝 Freight Brokerage</h3>
            <p className='text-sm text-teal-100'>
              Carrier procurement, rate negotiation
            </p>
            <div className='mt-4 text-sm'>
              <div className='flex justify-between'>
                <span>Pipeline:</span>
                <span className='font-semibold'>$750K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Service Leads */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5 text-green-600' />
            🔥 Hot Service Leads - Ready to Close
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <h4 className='text-lg font-bold text-gray-900'>
                    Midwest Manufacturing Corp
                  </h4>
                  <div className='mt-1 flex gap-2'>
                    <Badge className='bg-red-100 text-red-800'>HOT LEAD</Badge>
                    <Badge className='bg-blue-100 text-blue-800'>
                      Logistics
                    </Badge>
                    <Badge className='bg-green-100 text-green-800'>
                      PROPOSAL SENT
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-600'>
                    $480,000
                  </div>
                  <div className='text-sm text-gray-500'>
                    85% Win Probability
                  </div>
                </div>
              </div>
              <div className='mb-2 text-sm text-gray-700'>
                <strong>Contact:</strong> Robert Chen - VP of Operations |{' '}
                <strong>Rep:</strong> Sarah Martinez
              </div>
              <div className='text-sm font-medium text-red-800'>
                🎯 Decision meeting scheduled Dec 23rd - Contract ready to sign!
              </div>
            </div>

            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <h4 className='text-lg font-bold text-gray-900'>
                    Urban Retail Solutions
                  </h4>
                  <div className='mt-1 flex gap-2'>
                    <Badge className='bg-red-100 text-red-800'>HOT LEAD</Badge>
                    <Badge className='bg-teal-100 text-teal-800'>
                      Freight Brokerage
                    </Badge>
                    <Badge className='bg-purple-100 text-purple-800'>
                      NEGOTIATING
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-600'>
                    $750,000
                  </div>
                  <div className='text-sm text-gray-500'>
                    90% Win Probability
                  </div>
                </div>
              </div>
              <div className='mb-2 text-sm text-gray-700'>
                <strong>Contact:</strong> Amanda Foster - Supply Chain Manager |{' '}
                <strong>Rep:</strong> Carlos Mendez
              </div>
              <div className='text-sm font-medium text-red-800'>
                🎯 Contract terms finalized - Signature expected Dec 28th!
              </div>
            </div>

            <div className='rounded-lg border p-4'>
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <h4 className='text-lg font-bold text-gray-900'>
                    Pacific Coast Imports
                  </h4>
                  <div className='mt-1 flex gap-2'>
                    <Badge className='bg-orange-100 text-orange-800'>
                      URGENT
                    </Badge>
                    <Badge className='bg-purple-100 text-purple-800'>
                      Warehousing
                    </Badge>
                    <Badge className='bg-blue-100 text-blue-800'>
                      DEMO SCHEDULED
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-600'>
                    $360,000
                  </div>
                  <div className='text-sm text-gray-500'>
                    70% Win Probability
                  </div>
                </div>
              </div>
              <div className='mb-2 text-sm text-gray-700'>
                <strong>Contact:</strong> Maria Rodriguez - Logistics Director |{' '}
                <strong>Rep:</strong> David Kim
              </div>
              <div className='text-sm font-medium text-gray-900'>
                📅 Warehouse tour scheduled Dec 22nd - Decision by Jan 15th
              </div>
            </div>

            <div className='rounded-lg border p-4'>
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <h4 className='text-lg font-bold text-gray-900'>
                    Thunder Trucking LLC
                  </h4>
                  <div className='mt-1 flex gap-2'>
                    <Badge className='bg-yellow-100 text-yellow-800'>
                      HIGH
                    </Badge>
                    <Badge className='bg-orange-100 text-orange-800'>
                      Dispatching
                    </Badge>
                    <Badge className='bg-blue-100 text-blue-800'>
                      QUALIFIED
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-600'>
                    $72,000
                  </div>
                  <div className='text-sm text-gray-500'>
                    65% Win Probability
                  </div>
                </div>
              </div>
              <div className='mb-2 text-sm text-gray-700'>
                <strong>Contact:</strong> Mike Thompson - Owner/Operator |{' '}
                <strong>Rep:</strong> Jennifer Lopez
              </div>
              <div className='text-sm font-medium text-gray-900'>
                📋 Sending dispatch proposal with 30-day trial offer
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Performance */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-green-600' />
              Revenue Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                <span className='font-medium'>Total Pipeline</span>
                <div className='text-right'>
                  <div className='text-xl font-bold text-green-600'>$1.66M</div>
                  <div className='text-sm text-gray-500'>5 active deals</div>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3'>
                <span className='font-medium'>Monthly Recurring</span>
                <div className='text-xl font-bold text-blue-600'>$138.5K</div>
              </div>
              <div className='flex items-center justify-between rounded-lg bg-purple-50 p-3'>
                <span className='font-medium'>Average Deal Size</span>
                <div className='text-xl font-bold text-purple-600'>$332K</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5 text-blue-600' />
              Sales Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='font-medium'>Sarah Martinez</div>
                  <div className='text-sm text-gray-500'>
                    1 lead • Logistics specialist
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-green-600'>$480K</div>
                  <div className='text-sm text-gray-500'>85% close rate</div>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='font-medium'>Carlos Mendez</div>
                  <div className='text-sm text-gray-500'>
                    1 lead • Brokerage specialist
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-green-600'>$750K</div>
                  <div className='text-sm text-gray-500'>90% close rate</div>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='font-medium'>David Kim</div>
                  <div className='text-sm text-gray-500'>
                    1 lead • Warehousing specialist
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-green-600'>$360K</div>
                  <div className='text-sm text-gray-500'>70% close rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Zap className='h-5 w-5 text-yellow-600' />
            🚀 AI-Powered Revenue Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <button className='rounded-lg border-2 border-blue-200 p-4 text-left transition-colors hover:border-blue-400 hover:bg-blue-50'>
              <div className='mb-2 flex items-center gap-3'>
                <Mail className='h-6 w-6 text-blue-600' />
                <span className='font-semibold'>Generate Proposals</span>
              </div>
              <p className='text-sm text-gray-600'>
                AI-generated service proposals with ROI analysis
              </p>
            </button>

            <button className='rounded-lg border-2 border-green-200 p-4 text-left transition-colors hover:border-green-400 hover:bg-green-50'>
              <div className='mb-2 flex items-center gap-3'>
                <Phone className='h-6 w-6 text-green-600' />
                <span className='font-semibold'>Schedule Site Visits</span>
              </div>
              <p className='text-sm text-gray-600'>
                Automated facility tours and assessments
              </p>
            </button>

            <button className='rounded-lg border-2 border-purple-200 p-4 text-left transition-colors hover:border-purple-400 hover:bg-purple-50'>
              <div className='mb-2 flex items-center gap-3'>
                <BarChart3 className='h-6 w-6 text-purple-600' />
                <span className='font-semibold'>ROI Analysis</span>
              </div>
              <p className='text-sm text-gray-600'>
                Cost savings and efficiency reports
              </p>
            </button>

            <button className='rounded-lg border-2 border-orange-200 p-4 text-left transition-colors hover:border-orange-400 hover:bg-orange-50'>
              <div className='mb-2 flex items-center gap-3'>
                <Target className='h-6 w-6 text-orange-600' />
                <span className='font-semibold'>Lead Discovery</span>
              </div>
              <p className='text-sm text-gray-600'>
                Find new prospects needing services
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
