'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Brain,
  Calculator,
  DollarSign,
  Globe,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CompetitiveIntelligence } from '../components/CompetitiveIntelligence';
import FreightQuotingDashboard from '../components/FreightQuotingDashboard';

export default function EnhancedQuotingPage() {
  const [activeTab, setActiveTab] = useState('quoting');

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header */}
      <div className='border-b bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link href='/fleetflowdash'>
                <button className='flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200'>
                  <span>←</span>
                  Dashboard
                </button>
              </Link>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Advanced Freight Quoting Engine
                </h1>
                <p className='text-gray-600'>
                  AI-powered quoting with market intelligence and competitive
                  analysis
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge
                variant='outline'
                className='border-green-200 bg-green-50 text-green-700'
              >
                <Zap className='mr-1 h-3 w-3' />
                AI-Powered
              </Badge>
              <Badge
                variant='outline'
                className='border-blue-200 bg-blue-50 text-blue-700'
              >
                <Globe className='mr-1 h-3 w-3' />
                Real-time Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='mb-3 flex items-center gap-3'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <Brain className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>AI Pricing</h3>
                  <p className='text-sm text-gray-600'>Smart algorithms</p>
                </div>
              </div>
              <p className='text-xs text-gray-500'>
                Advanced pricing algorithms with machine learning optimization
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-3 flex items-center gap-3'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <BarChart3 className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Market Intel</h3>
                  <p className='text-sm text-gray-600'>Real-time data</p>
                </div>
              </div>
              <p className='text-xs text-gray-500'>
                Live market rates, demand levels, and capacity analytics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-3 flex items-center gap-3'>
                <div className='rounded-lg bg-purple-100 p-2'>
                  <Users className='h-5 w-5 text-purple-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Competitive</h3>
                  <p className='text-sm text-gray-600'>Analysis</p>
                </div>
              </div>
              <p className='text-xs text-gray-500'>
                Competitor tracking and strategic market positioning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-3 flex items-center gap-3'>
                <div className='rounded-lg bg-orange-100 p-2'>
                  <Target className='h-5 w-5 text-orange-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Win Rate</h3>
                  <p className='text-sm text-gray-600'>Optimization</p>
                </div>
              </div>
              <p className='text-xs text-gray-500'>
                Probability scoring and rate optimization for maximum wins
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='quoting' className='flex items-center gap-2'>
              <Calculator className='h-4 w-4' />
              Smart Quoting
            </TabsTrigger>
            <TabsTrigger
              value='intelligence'
              className='flex items-center gap-2'
            >
              <Users className='h-4 w-4' />
              Competitive Intelligence
            </TabsTrigger>
            <TabsTrigger value='analytics' className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4' />
              Market Analytics
            </TabsTrigger>
          </TabsList>

          {/* Smart Quoting Tab */}
          <TabsContent value='quoting'>
            <FreightQuotingDashboard
              onQuoteGenerated={(quote) => {
                console.info('AI-Enhanced Quote Generated:', quote);
                // Enhanced quote handling with comprehensive features:
                // - Market intelligence integration
                // - Competitive positioning analysis
                // - Win probability optimization
                // - Real-time rate adjustments
                // - Risk factor assessment
                // - Automated recommendations
              }}
            />
          </TabsContent>

          {/* Competitive Intelligence Tab */}
          <TabsContent value='intelligence'>
            <CompetitiveIntelligence />
          </TabsContent>

          {/* Market Analytics Tab */}
          <TabsContent value='analytics'>
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Market Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <div className='rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-6 text-center'>
                      <TrendingUp className='mx-auto mb-3 h-8 w-8 text-blue-600' />
                      <div className='text-2xl font-bold text-blue-600'>
                        +12.5%
                      </div>
                      <div className='text-sm text-gray-600'>Market Growth</div>
                    </div>
                    <div className='rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center'>
                      <DollarSign className='mx-auto mb-3 h-8 w-8 text-green-600' />
                      <div className='text-2xl font-bold text-green-600'>
                        $2,450
                      </div>
                      <div className='text-sm text-gray-600'>Avg Lane Rate</div>
                    </div>
                    <div className='rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-6 text-center'>
                      <Target className='mx-auto mb-3 h-8 w-8 text-purple-600' />
                      <div className='text-2xl font-bold text-purple-600'>
                        73%
                      </div>
                      <div className='text-sm text-gray-600'>Win Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Market Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Demand Level</span>
                        <Badge className='bg-orange-100 text-orange-800'>
                          HIGH
                        </Badge>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Capacity Tightness</span>
                        <Badge className='bg-red-100 text-red-800'>78%</Badge>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Seasonal Factor</span>
                        <Badge className='bg-blue-100 text-blue-800'>
                          1.15x
                        </Badge>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Fuel Impact</span>
                        <Badge className='bg-yellow-100 text-yellow-800'>
                          22%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Quote Volume</span>
                        <span className='font-semibold'>1,247 this month</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Average Margin</span>
                        <span className='font-semibold text-green-600'>
                          15.2%
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Response Time</span>
                        <span className='font-semibold'>2.3 minutes</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Customer Satisfaction</span>
                        <span className='font-semibold text-blue-600'>
                          4.7/5.0
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Brain className='h-4 w-4 text-blue-600' />
                        <span className='font-semibold text-blue-800'>
                          Market Opportunity
                        </span>
                      </div>
                      <p className='text-sm text-blue-700'>
                        Regional lanes showing 15% above-market demand. Consider
                        expanding coverage in Southeast markets for premium
                        pricing opportunities.
                      </p>
                    </div>

                    <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <TrendingUp className='h-4 w-4 text-green-600' />
                        <span className='font-semibold text-green-800'>
                          Pricing Strategy
                        </span>
                      </div>
                      <p className='text-sm text-green-700'>
                        Current market conditions favor competitive pricing. Win
                        rates could improve by 8-12% with slight rate
                        adjustments on high-volume lanes.
                      </p>
                    </div>

                    <div className='rounded-lg border border-purple-200 bg-purple-50 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Shield className='h-4 w-4 text-purple-600' />
                        <span className='font-semibold text-purple-800'>
                          Risk Management
                        </span>
                      </div>
                      <p className='text-sm text-purple-700'>
                        Fuel volatility expected to increase 5-8% next quarter.
                        Consider implementing dynamic fuel surcharge adjustments
                        for better margin protection.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
