'use client';

import {
  BarChart3,
  Building2,
  Globe,
  Mail,
  Phone,
  Search,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function ShipperDiscoveryDashboard() {
  const [shipperData, setShipperData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShipperData = async () => {
      try {
        const response = await fetch(
          '/api/ai-flow/shipper-discovery?tenantId=tenant-demo-123&metrics=true'
        );
        if (response.ok) {
          const data = await response.json();
          setShipperData(data.data);
        }
      } catch (error) {
        console.error('Failed to load shipper discovery data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShipperData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>Loading Shipper Discovery Pipeline...</p>
        </div>
      </div>
    );
  }

  if (!shipperData) {
    return (
      <div className='p-8 text-center'>
        <Building2 className='mx-auto mb-4 h-16 w-16 text-gray-400' />
        <h3 className='mb-2 text-xl font-semibold text-gray-900'>
          Shipper Discovery Pipeline
        </h3>
        <p className='text-gray-600'>Failed to load shipper discovery data</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discovered':
        return 'bg-blue-100 text-blue-800';
      case 'researching':
        return 'bg-purple-100 text-purple-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'proposal_requested':
        return 'bg-emerald-100 text-emerald-800';
      case 'won':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Discovery Engine Header */}
      <div className='rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white'>
        <div className='mb-4 flex items-center gap-3'>
          <Building2 className='h-8 w-8' />
          <div>
            <h2 className='text-3xl font-bold'>
              🏭 Shipper & Manufacturer Discovery
            </h2>
            <p className='text-blue-100'>
              High-Value B2B Prospect Intelligence - Fortune 500 & Enterprise
              Shippers
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              $
              {(
                shipperData.metrics?.totalPipelineValue || 42000000
              ).toLocaleString()}
            </div>
            <div className='text-sm text-blue-100'>Total Pipeline</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              {shipperData.metrics?.platinumProspects || 2}
            </div>
            <div className='text-sm text-blue-100'>Platinum Prospects</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              $
              {(
                shipperData.metrics?.averageContractValue || 10500000
              ).toLocaleString()}
            </div>
            <div className='text-sm text-blue-100'>Avg Contract Value</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold'>
              {shipperData.metrics?.qualificationRate || 35}%
            </div>
            <div className='text-sm text-blue-100'>Qualification Rate</div>
          </div>
        </div>
      </div>

      {/* Discovery Sources Performance */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='bg-gradient-to-br from-green-500 to-green-600 text-white'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Globe className='h-8 w-8 text-green-200' />
              <div className='text-right'>
                <div className='text-2xl font-bold'>12</div>
                <div className='text-sm text-green-100'>SEC Filings</div>
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold'>
              📊 SEC Filings Analysis
            </h3>
            <p className='text-sm text-green-100'>
              Fortune 500 companies with logistics spend disclosures
            </p>
            <div className='mt-4 text-sm'>
              <div className='flex justify-between'>
                <span>Avg Value:</span>
                <span className='font-semibold'>$15.2M</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-500 to-purple-600 text-white'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Search className='h-8 w-8 text-purple-200' />
              <div className='text-right'>
                <div className='text-2xl font-bold'>8</div>
                <div className='text-sm text-purple-100'>Trade Intel</div>
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold'>
              📰 Trade Publications
            </h3>
            <p className='text-sm text-purple-100'>
              Industry news, expansion announcements, logistics challenges
            </p>
            <div className='mt-4 text-sm'>
              <div className='flex justify-between'>
                <span>Avg Value:</span>
                <span className='font-semibold'>$8.7M</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-500 to-orange-600 text-white'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <BarChart3 className='h-8 w-8 text-orange-200' />
              <div className='text-right'>
                <div className='text-2xl font-bold'>6</div>
                <div className='text-sm text-orange-100'>Import/Export</div>
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold'>
              🚢 Import/Export Data
            </h3>
            <p className='text-sm text-orange-100'>
              Customs data analysis for international shippers
            </p>
            <div className='mt-4 text-sm'>
              <div className='flex justify-between'>
                <span>Avg Value:</span>
                <span className='font-semibold'>$12.3M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High-Value Prospects */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Target className='h-5 w-5 text-purple-600' />
            🎯 High-Value Shipper Prospects - Enterprise Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Tesla - Platinum Prospect */}
            <div className='rounded-lg border-2 border-purple-200 bg-purple-50 p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h4 className='text-xl font-bold text-gray-900'>
                    Tesla Manufacturing Inc
                  </h4>
                  <div className='mt-2 flex gap-2'>
                    <Badge className='border-purple-200 bg-purple-100 text-purple-800'>
                      💎 PLATINUM
                    </Badge>
                    <Badge className='bg-blue-100 text-blue-800'>
                      Fortune 500
                    </Badge>
                    <Badge className='bg-green-100 text-green-800'>
                      Electric Vehicles
                    </Badge>
                    <Badge className={getStatusColor('researching')}>
                      RESEARCHING
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-3xl font-bold text-purple-600'>
                    $12.0M
                  </div>
                  <div className='text-sm text-gray-500'>
                    Annual Contract Potential
                  </div>
                  <div className='text-sm font-medium text-gray-700'>
                    Lead Score: 98/100
                  </div>
                </div>
              </div>

              <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <div className='text-sm text-gray-500'>
                    Current Logistics Spend
                  </div>
                  <div className='text-lg font-bold text-gray-900'>
                    $85M annually
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Estimated Volume</div>
                  <div className='text-lg font-bold text-gray-900'>
                    15,000 loads/year
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Growth Trend</div>
                  <div className='text-lg font-bold text-green-600'>
                    Rapid Growth
                  </div>
                </div>
              </div>

              <div className='mb-4 rounded-lg bg-white p-4'>
                <div className='mb-2 text-sm font-medium text-gray-700'>
                  Key Opportunity Intel
                </div>
                <div className='space-y-2 text-sm text-gray-600'>
                  <div>
                    • Mexico Gigafactory expansion creating massive logistics
                    needs
                  </div>
                  <div>
                    • Q3 2024 delivery targets increased 25% - capacity
                    constraints
                  </div>
                  <div>• Direct-to-consumer model expanding nationwide</div>
                  <div>
                    • Sustainability initiative targeting carbon-neutral supply
                    chain
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='text-sm text-gray-500'>Key Contact</div>
                  <div className='font-medium'>
                    Sarah Chen - VP Global Logistics
                  </div>
                  <div className='text-sm text-gray-600'>
                    sarah.chen@tesla.com
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>
                    Assigned Prospector
                  </div>
                  <div className='font-medium'>David Kim</div>
                  <div className='text-sm text-gray-600'>
                    Senior Enterprise Prospector
                  </div>
                </div>
              </div>

              <div className='mt-4 rounded-lg bg-purple-100 p-3'>
                <div className='text-sm font-medium text-purple-800'>
                  🎯 Next Action: Identify warm introduction through Austin
                  Chamber of Commerce
                </div>
              </div>
            </div>

            {/* P&G - Platinum Prospect */}
            <div className='rounded-lg border-2 border-purple-200 bg-purple-50 p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h4 className='text-xl font-bold text-gray-900'>
                    Procter & Gamble Manufacturing
                  </h4>
                  <div className='mt-2 flex gap-2'>
                    <Badge className='border-purple-200 bg-purple-100 text-purple-800'>
                      💎 PLATINUM
                    </Badge>
                    <Badge className='bg-blue-100 text-blue-800'>
                      Fortune 500
                    </Badge>
                    <Badge className='bg-orange-100 text-orange-800'>
                      Consumer Goods
                    </Badge>
                    <Badge className={getStatusColor('discovered')}>
                      DISCOVERED
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-3xl font-bold text-purple-600'>
                    $18.0M
                  </div>
                  <div className='text-sm text-gray-500'>
                    Annual Contract Potential
                  </div>
                  <div className='text-sm font-medium text-gray-700'>
                    Lead Score: 94/100
                  </div>
                </div>
              </div>

              <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <div className='text-sm text-gray-500'>
                    Current Logistics Spend
                  </div>
                  <div className='text-lg font-bold text-gray-900'>
                    $140M annually
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Estimated Volume</div>
                  <div className='text-lg font-bold text-gray-900'>
                    25,000 loads/year
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>
                    Supply Chain Complexity
                  </div>
                  <div className='text-lg font-bold text-orange-600'>
                    Highly Complex
                  </div>
                </div>
              </div>

              <div className='mb-4 rounded-lg bg-white p-4'>
                <div className='mb-2 text-sm font-medium text-gray-700'>
                  Key Opportunity Intel
                </div>
                <div className='space-y-2 text-sm text-gray-600'>
                  <div>
                    • $2B supply chain modernization initiative announced
                  </div>
                  <div>
                    • New Texas distribution center for Southwest expansion
                  </div>
                  <div>
                    • Q4 earnings highlighted transportation cost pressures
                  </div>
                  <div>
                    • Partnership focus on sustainable packaging solutions
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='text-sm text-gray-500'>Key Contact</div>
                  <div className='font-medium'>
                    Amanda Johnson - VP Transportation
                  </div>
                  <div className='text-sm text-gray-600'>johnson.a@pg.com</div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>
                    Assigned Prospector
                  </div>
                  <div className='font-medium'>Sarah Martinez</div>
                  <div className='text-sm text-gray-600'>
                    Enterprise Prospector
                  </div>
                </div>
              </div>

              <div className='mt-4 rounded-lg bg-purple-100 p-3'>
                <div className='text-sm font-medium text-purple-800'>
                  🎯 Next Action: Deep dive research on current providers and
                  recent RFP activity
                </div>
              </div>
            </div>

            {/* Beyond Meat - Gold Prospect */}
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h4 className='text-xl font-bold text-gray-900'>
                    Beyond Meat Inc
                  </h4>
                  <div className='mt-2 flex gap-2'>
                    <Badge className='border-yellow-200 bg-yellow-100 text-yellow-800'>
                      🥇 GOLD
                    </Badge>
                    <Badge className='bg-green-100 text-green-800'>
                      Alternative Protein
                    </Badge>
                    <Badge className='bg-purple-100 text-purple-800'>
                      Cold Chain
                    </Badge>
                    <Badge className={getStatusColor('discovered')}>
                      DISCOVERED
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-3xl font-bold text-yellow-600'>
                    $3.5M
                  </div>
                  <div className='text-sm text-gray-500'>
                    Annual Contract Potential
                  </div>
                  <div className='text-sm font-medium text-gray-700'>
                    Lead Score: 87/100
                  </div>
                </div>
              </div>

              <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <div className='text-sm text-gray-500'>
                    Current Logistics Spend
                  </div>
                  <div className='text-lg font-bold text-gray-900'>
                    $22M annually
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Estimated Volume</div>
                  <div className='text-lg font-bold text-gray-900'>
                    3,500 loads/year
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Specialization</div>
                  <div className='text-lg font-bold text-blue-600'>
                    Frozen/Refrigerated
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='text-sm text-gray-500'>Key Contact</div>
                  <div className='font-medium'>
                    Lisa Thompson - VP Supply Chain
                  </div>
                  <div className='text-sm text-gray-600'>
                    l.thompson@beyondmeat.com
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>
                    Assigned Prospector
                  </div>
                  <div className='font-medium'>Jennifer Lopez</div>
                  <div className='text-sm text-gray-600'>
                    Food & Beverage Specialist
                  </div>
                </div>
              </div>
            </div>

            {/* Wayfair - Gold Prospect */}
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h4 className='text-xl font-bold text-gray-900'>
                    Wayfair Supply Chain Services
                  </h4>
                  <div className='mt-2 flex gap-2'>
                    <Badge className='border-yellow-200 bg-yellow-100 text-yellow-800'>
                      🥇 GOLD
                    </Badge>
                    <Badge className='bg-teal-100 text-teal-800'>
                      E-commerce
                    </Badge>
                    <Badge className='bg-orange-100 text-orange-800'>
                      Furniture/Home Goods
                    </Badge>
                    <Badge className={getStatusColor('discovered')}>
                      DISCOVERED
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-3xl font-bold text-yellow-600'>
                    $8.5M
                  </div>
                  <div className='text-sm text-gray-500'>
                    Annual Contract Potential
                  </div>
                  <div className='text-sm font-medium text-gray-700'>
                    Lead Score: 91/100
                  </div>
                </div>
              </div>

              <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <div className='text-sm text-gray-500'>
                    Current Logistics Spend
                  </div>
                  <div className='text-lg font-bold text-gray-900'>
                    $55M annually
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Estimated Volume</div>
                  <div className='text-lg font-bold text-gray-900'>
                    12,000 loads/year
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Specialization</div>
                  <div className='text-lg font-bold text-purple-600'>
                    White Glove Delivery
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='text-sm text-gray-500'>Key Contact</div>
                  <div className='font-medium'>
                    Rachel Kim - VP Transportation
                  </div>
                  <div className='text-sm text-gray-600'>rkim@wayfair.com</div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>
                    Assigned Prospector
                  </div>
                  <div className='font-medium'>Carlos Mendez</div>
                  <div className='text-sm text-gray-600'>
                    E-commerce Specialist
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discovery Performance & AI Actions */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-green-600' />
              Discovery Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3'>
                <span className='font-medium'>Total Prospects Discovered</span>
                <div className='text-right'>
                  <div className='text-xl font-bold text-blue-600'>
                    {shipperData.metrics?.totalProspects || 4}
                  </div>
                  <div className='text-sm text-gray-500'>This month</div>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                <span className='font-medium'>Qualified Rate</span>
                <div className='text-xl font-bold text-green-600'>
                  {shipperData.metrics?.qualificationRate || 35}%
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg bg-purple-50 p-3'>
                <span className='font-medium'>Discovery Rate</span>
                <div className='text-xl font-bold text-purple-600'>
                  {shipperData.metrics?.discoveryRate || 3.2}/week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5 text-blue-600' />
              Prospector Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='font-medium'>David Kim</div>
                  <div className='text-sm text-gray-500'>
                    Senior Enterprise • Tesla
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-purple-600'>$12M</div>
                  <div className='text-sm text-gray-500'>Pipeline value</div>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='font-medium'>Sarah Martinez</div>
                  <div className='text-sm text-gray-500'>Enterprise • P&G</div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-purple-600'>$18M</div>
                  <div className='text-sm text-gray-500'>Pipeline value</div>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='font-medium'>Jennifer Lopez</div>
                  <div className='text-sm text-gray-500'>
                    Food & Beverage Specialist
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-yellow-600'>$3.5M</div>
                  <div className='text-sm text-gray-500'>Pipeline value</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Discovery Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Zap className='h-5 w-5 text-yellow-600' />
            🚀 AI-Powered Discovery Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <button className='rounded-lg border-2 border-blue-200 p-4 text-left transition-colors hover:border-blue-400 hover:bg-blue-50'>
              <div className='mb-2 flex items-center gap-3'>
                <Search className='h-6 w-6 text-blue-600' />
                <span className='font-semibold'>Discover New Prospects</span>
              </div>
              <p className='text-sm text-gray-600'>
                AI-powered prospect discovery from SEC filings, trade data, and
                industry intelligence
              </p>
            </button>

            <button className='rounded-lg border-2 border-green-200 p-4 text-left transition-colors hover:border-green-400 hover:bg-green-50'>
              <div className='mb-2 flex items-center gap-3'>
                <Mail className='h-6 w-6 text-green-600' />
                <span className='font-semibold'>Generate Outreach</span>
              </div>
              <p className='text-sm text-gray-600'>
                Personalized outreach emails based on company intelligence and
                pain points
              </p>
            </button>

            <button className='rounded-lg border-2 border-purple-200 p-4 text-left transition-colors hover:border-purple-400 hover:bg-purple-50'>
              <div className='mb-2 flex items-center gap-3'>
                <BarChart3 className='h-6 w-6 text-purple-600' />
                <span className='font-semibold'>Competitive Analysis</span>
              </div>
              <p className='text-sm text-gray-600'>
                Market research and competitive positioning for target prospects
              </p>
            </button>

            <button className='rounded-lg border-2 border-orange-200 p-4 text-left transition-colors hover:border-orange-400 hover:bg-orange-50'>
              <div className='mb-2 flex items-center gap-3'>
                <Phone className='h-6 w-6 text-orange-600' />
                <span className='font-semibold'>Schedule Meetings</span>
              </div>
              <p className='text-sm text-gray-600'>
                Automated meeting scheduling with key decision makers
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
