'use client';

import {
  Activity,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  DollarSign,
  Gauge,
  Headphones,
  Heart,
  Navigation,
  Phone,
  Shield,
  Target,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AITaskPrioritizationPanel from '../components/AITaskPrioritizationPanel';
import CRMDashboard from '../components/CRMDashboard';
// import AIReviewDashboard from '../components/ai-review/AIReviewDashboard';
import { Badge } from '../components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

interface AIMetrics {
  totalDecisions: number;
  systemEfficiency: number;
  dailyRevenue: number;
  activeOperations: string;
  callCenterStats: {
    activeCalls: number;
    totalAgents: number;
    avgWaitTime: number;
  };
  freightStats: {
    activeLoads: number;
    avgMargin: number;
    loadMatch: number;
  };
  dispatchStats: {
    driversActive: number;
    routeOptimization: number;
    deliveryTime: number;
  };
  recruitingStats: {
    leadsToday: number;
    qualificationRate: number;
    hireRate: number;
  };
  customerStats: {
    totalContacts: number;
    pipelineValue: number;
    conversionRate: number;
  };
}

export default function FleetFlowAIPlatform() {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiMetrics, setAiMetrics] = useState<AIMetrics>({
    totalDecisions: 1247,
    systemEfficiency: 97.3,
    dailyRevenue: 47200,
    activeOperations: '24/7',
    callCenterStats: { activeCalls: 12, totalAgents: 8, avgWaitTime: 1.2 },
    freightStats: { activeLoads: 156, avgMargin: 18.5, loadMatch: 94.2 },
    dispatchStats: {
      driversActive: 89,
      routeOptimization: 92.8,
      deliveryTime: 98.1,
    },
    recruitingStats: {
      leadsToday: 23,
      qualificationRate: 67.4,
      hireRate: 24.8,
    },
    customerStats: {
      totalContacts: 847,
      pipelineValue: 2400000,
      conversionRate: 15.8,
    },
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAiMetrics((prev) => ({
        ...prev,
        totalDecisions: prev.totalDecisions + Math.floor(Math.random() * 5),
        systemEfficiency: Math.min(
          99.9,
          prev.systemEfficiency + (Math.random() - 0.5) * 0.1
        ),
        dailyRevenue: prev.dailyRevenue + Math.floor(Math.random() * 500),
        callCenterStats: {
          ...prev.callCenterStats,
          activeCalls: Math.max(
            0,
            prev.callCenterStats.activeCalls + Math.floor(Math.random() * 3 - 1)
          ),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='container mx-auto p-6'>
        {/* Header */}
        <div className='mb-8'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 shadow-lg'>
              <Zap className='h-8 w-8 text-white' />
            </div>
            <div>
              <h1 className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent'>
                FleetFlow™ AI Flow Platform
              </h1>
              <p className='text-xl text-gray-600'>
                Complete AI-Powered Transportation & Customer Management Center
              </p>
            </div>
          </div>

          {/* Real-time Metrics Dashboard */}
          <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
            <Card className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-green-100'>
                      System Status
                    </p>
                    <p className='text-2xl font-bold'>
                      {aiMetrics.activeOperations}
                    </p>
                  </div>
                  <Activity className='h-8 w-8 text-green-200' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-blue-100'>
                      AI Efficiency
                    </p>
                    <p className='text-2xl font-bold'>
                      {aiMetrics.systemEfficiency.toFixed(1)}%
                    </p>
                  </div>
                  <Gauge className='h-8 w-8 text-blue-200' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-purple-100'>
                      Revenue Today
                    </p>
                    <p className='text-2xl font-bold'>
                      {formatCurrency(aiMetrics.dailyRevenue)}
                    </p>
                  </div>
                  <DollarSign className='h-8 w-8 text-purple-200' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-orange-100'>
                      AI Decisions
                    </p>
                    <p className='text-2xl font-bold'>
                      {aiMetrics.totalDecisions.toLocaleString()}
                    </p>
                  </div>
                  <Target className='h-8 w-8 text-orange-200' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-r from-pink-500 to-pink-600 text-white'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-pink-100'>
                      CRM Pipeline
                    </p>
                    <p className='text-2xl font-bold'>
                      {formatCurrency(aiMetrics.customerStats.pipelineValue)}
                    </p>
                  </div>
                  <Heart className='h-8 w-8 text-pink-200' />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-9 border border-gray-200 bg-white/50 backdrop-blur-sm'>
            <TabsTrigger value='overview' className='flex items-center gap-2'>
              <Brain className='h-4 w-4' />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='call-center'
              className='flex items-center gap-2'
            >
              <Headphones className='h-4 w-4' />
              Call Center
            </TabsTrigger>
            <TabsTrigger
              value='freight-broker'
              className='flex items-center gap-2'
            >
              <Truck className='h-4 w-4' />
              Freight AI
            </TabsTrigger>
            <TabsTrigger value='dispatch' className='flex items-center gap-2'>
              <Navigation className='h-4 w-4' />
              AI Dispatch
            </TabsTrigger>
            <TabsTrigger value='recruiting' className='flex items-center gap-2'>
              <UserPlus className='h-4 w-4' />
              Recruiting AI
            </TabsTrigger>
            <TabsTrigger
              value='customer-success'
              className='flex items-center gap-2'
            >
              <Heart className='h-4 w-4' />
              Customer Success
            </TabsTrigger>
            <TabsTrigger value='scheduler' className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              Scheduler AI
            </TabsTrigger>
            <TabsTrigger value='analytics' className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4' />
              AI Analytics
            </TabsTrigger>
            <TabsTrigger value='ai-review' className='flex items-center gap-2'>
              <CheckCircle className='h-4 w-4' />
              AI Review
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Brain className='h-5 w-5 text-blue-600' />
                    AI Platform Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                        <span className='font-medium'>
                          All Systems Operational
                        </span>
                      </div>
                      <Badge className='bg-green-100 text-green-800'>
                        Live
                      </Badge>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='rounded-lg bg-blue-50 p-3 text-center'>
                        <div className='text-2xl font-bold text-blue-600'>
                          {aiMetrics.callCenterStats.activeCalls}
                        </div>
                        <div className='text-sm text-gray-600'>
                          Active Calls
                        </div>
                      </div>
                      <div className='rounded-lg bg-purple-50 p-3 text-center'>
                        <div className='text-2xl font-bold text-purple-600'>
                          {aiMetrics.freightStats.activeLoads}
                        </div>
                        <div className='text-sm text-gray-600'>
                          Active Loads
                        </div>
                      </div>
                      <div className='rounded-lg bg-green-50 p-3 text-center'>
                        <div className='text-2xl font-bold text-green-600'>
                          {aiMetrics.dispatchStats.driversActive}
                        </div>
                        <div className='text-sm text-gray-600'>
                          Drivers Online
                        </div>
                      </div>
                      <div className='rounded-lg bg-orange-50 p-3 text-center'>
                        <div className='text-2xl font-bold text-orange-600'>
                          {aiMetrics.recruitingStats.leadsToday}
                        </div>
                        <div className='text-sm text-gray-600'>Leads Today</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <TrendingUp className='h-5 w-5 text-green-600' />
                    AI Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Load Matching Accuracy
                      </span>
                      <span className='text-sm font-bold text-green-600'>
                        {aiMetrics.freightStats.loadMatch}%
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Route Optimization
                      </span>
                      <span className='text-sm font-bold text-blue-600'>
                        {aiMetrics.dispatchStats.routeOptimization}%
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Lead Qualification Rate
                      </span>
                      <span className='text-sm font-bold text-purple-600'>
                        {aiMetrics.recruitingStats.qualificationRate}%
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Customer Conversion
                      </span>
                      <span className='text-sm font-bold text-pink-600'>
                        {aiMetrics.customerStats.conversionRate}%
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        On-Time Delivery
                      </span>
                      <span className='text-sm font-bold text-green-600'>
                        {aiMetrics.dispatchStats.deliveryTime}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Call Center Tab */}
          <TabsContent value='call-center' className='space-y-6'>
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Phone className='h-5 w-5' />
                  AI-Powered Call Center Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                        <span className='font-medium'>FreeSWITCH Active</span>
                      </div>
                      <Badge className='bg-green-100 text-green-800'>
                        ESL Port 8021
                      </Badge>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='rounded-lg bg-blue-50 p-4 text-center'>
                        <div className='text-3xl font-bold text-blue-600'>
                          {aiMetrics.callCenterStats.activeCalls}
                        </div>
                        <div className='text-sm text-gray-600'>
                          Active Calls
                        </div>
                      </div>
                      <div className='rounded-lg bg-purple-50 p-4 text-center'>
                        <div className='text-3xl font-bold text-purple-600'>
                          {aiMetrics.callCenterStats.totalAgents}
                        </div>
                        <div className='text-sm text-gray-600'>
                          Agents Online
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg bg-yellow-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-yellow-600'>
                        {aiMetrics.callCenterStats.avgWaitTime}s
                      </div>
                      <div className='text-sm text-gray-600'>
                        Average Wait Time
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>AI Features</h3>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                        <Shield className='h-4 w-4 text-green-600' />
                        <span className='text-sm'>Real-time Lead Scoring</span>
                      </div>
                      <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                        <Brain className='h-4 w-4 text-blue-600' />
                        <span className='text-sm'>
                          Conversation Intelligence
                        </span>
                      </div>
                      <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                        <Target className='h-4 w-4 text-purple-600' />
                        <span className='text-sm'>Automated Follow-up</span>
                      </div>
                      <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                        <TrendingUp className='h-4 w-4 text-orange-600' />
                        <span className='text-sm'>Performance Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Freight Broker AI Tab */}
          <TabsContent value='freight-broker' className='space-y-6'>
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Truck className='h-5 w-5' />
                  AI Freight Brokerage Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                  <div className='rounded-lg bg-blue-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-blue-600'>
                      {aiMetrics.freightStats.activeLoads}
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Active Loads
                    </div>
                    <Badge className='bg-blue-100 text-blue-800'>
                      AI Matched
                    </Badge>
                  </div>
                  <div className='rounded-lg bg-green-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-green-600'>
                      {aiMetrics.freightStats.avgMargin.toFixed(1)}%
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Average Margin
                    </div>
                    <Badge className='bg-green-100 text-green-800'>
                      Optimized
                    </Badge>
                  </div>
                  <div className='rounded-lg bg-purple-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-purple-600'>
                      {aiMetrics.freightStats.loadMatch.toFixed(1)}%
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Match Accuracy
                    </div>
                    <Badge className='bg-purple-100 text-purple-800'>
                      AI Powered
                    </Badge>
                  </div>
                </div>

                <div className='mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
                  <h3 className='mb-3 text-lg font-semibold'>
                    AI Freight Intelligence
                  </h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Brain className='h-4 w-4 text-blue-600' />
                        <span className='text-sm'>
                          Dynamic Pricing Optimization
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Target className='h-4 w-4 text-green-600' />
                        <span className='text-sm'>Load-Carrier Matching</span>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <TrendingUp className='h-4 w-4 text-purple-600' />
                        <span className='text-sm'>Market Trend Analysis</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Shield className='h-4 w-4 text-orange-600' />
                        <span className='text-sm'>Risk Assessment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Dispatch Tab */}
          <TabsContent value='dispatch' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* AI Task Prioritization Panel */}
              <AITaskPrioritizationPanel mode='dispatch' />

              {/* Dispatch Metrics */}
              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Navigation className='h-5 w-5' />
                    AI Dispatch Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='rounded-lg bg-blue-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-blue-600'>
                        {aiMetrics.freightStats.activeLoads}
                      </div>
                      <div className='text-sm text-gray-600'>Active Loads</div>
                    </div>
                    <div className='rounded-lg bg-green-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-green-600'>
                        {aiMetrics.freightStats.avgMargin}%
                      </div>
                      <div className='text-sm text-gray-600'>Avg Margin</div>
                    </div>
                    <div className='rounded-lg bg-purple-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-purple-600'>
                        {aiMetrics.systemEfficiency}%
                      </div>
                      <div className='text-sm text-gray-600'>AI Efficiency</div>
                    </div>
                    <div className='rounded-lg bg-orange-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-orange-600'>
                        {aiMetrics.totalDecisions}
                      </div>
                      <div className='text-sm text-gray-600'>AI Decisions</div>
                    </div>
                  </div>

                  <div className='mt-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Zap className='h-4 w-4' />
                      <span className='font-semibold'>AI Status</span>
                    </div>
                    <p className='text-sm opacity-90'>
                      Smart task prioritization is analyzing{' '}
                      {aiMetrics.activeOperations} operations and optimizing
                      dispatch decisions in real-time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Recruiting AI Tab */}
          <TabsContent value='recruiting' className='space-y-6'>
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <UserPlus className='h-5 w-5' />
                  AI-Powered Recruiting Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                  <div className='rounded-lg bg-orange-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-orange-600'>
                      {aiMetrics.recruitingStats.leadsToday}
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Leads Today
                    </div>
                    <Badge className='bg-orange-100 text-orange-800'>
                      Generated
                    </Badge>
                  </div>
                  <div className='rounded-lg bg-green-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-green-600'>
                      {aiMetrics.recruitingStats.qualificationRate.toFixed(1)}%
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Qualification Rate
                    </div>
                    <Badge className='bg-green-100 text-green-800'>
                      AI Qualified
                    </Badge>
                  </div>
                  <div className='rounded-lg bg-blue-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-blue-600'>
                      {aiMetrics.recruitingStats.hireRate.toFixed(1)}%
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Hire Success Rate
                    </div>
                    <Badge className='bg-blue-100 text-blue-800'>
                      Optimized
                    </Badge>
                  </div>
                </div>

                <div className='mt-6 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 p-4'>
                  <h3 className='mb-3 text-lg font-semibold'>
                    AI Recruiting Intelligence
                  </h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Target className='h-4 w-4 text-orange-600' />
                        <span className='text-sm'>
                          Automated Lead Generation
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Brain className='h-4 w-4 text-green-600' />
                        <span className='text-sm'>Candidate Scoring</span>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Users className='h-4 w-4 text-blue-600' />
                        <span className='text-sm'>Multi-channel Outreach</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <TrendingUp className='h-4 w-4 text-purple-600' />
                        <span className='text-sm'>Performance Tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Success Platform (CRM) Tab */}
          <TabsContent value='customer-success' className='space-y-6'>
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Heart className='h-5 w-5' />
                  AI Customer Success Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
                  <div className='rounded-lg bg-pink-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-pink-600'>
                      {aiMetrics.customerStats.totalContacts}
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Total Contacts
                    </div>
                    <Badge className='bg-pink-100 text-pink-800'>
                      Active Pipeline
                    </Badge>
                  </div>
                  <div className='rounded-lg bg-green-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-green-600'>
                      {formatCurrency(aiMetrics.customerStats.pipelineValue)}
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Pipeline Value
                    </div>
                    <Badge className='bg-green-100 text-green-800'>
                      Revenue
                    </Badge>
                  </div>
                  <div className='rounded-lg bg-blue-50 p-6 text-center'>
                    <div className='text-3xl font-bold text-blue-600'>
                      {aiMetrics.customerStats.conversionRate.toFixed(1)}%
                    </div>
                    <div className='mb-2 text-sm text-gray-600'>
                      Conversion Rate
                    </div>
                    <Badge className='bg-blue-100 text-blue-800'>
                      AI Optimized
                    </Badge>
                  </div>
                </div>

                <div className='mb-6 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 p-4'>
                  <h3 className='mb-3 text-lg font-semibold'>
                    AI Customer Intelligence
                  </h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Brain className='h-4 w-4 text-pink-600' />
                        <span className='text-sm'>
                          Relationship Intelligence
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <TrendingUp className='h-4 w-4 text-green-600' />
                        <span className='text-sm'>Upselling Opportunities</span>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Shield className='h-4 w-4 text-blue-600' />
                        <span className='text-sm'>Churn Prevention</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Target className='h-4 w-4 text-purple-600' />
                        <span className='text-sm'>
                          Customer Success Scoring
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integrated CRM Dashboard */}
            <div className='rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CRMDashboard />
            </div>
          </TabsContent>

          {/* Scheduler AI Tab */}
          <TabsContent value='scheduler' className='space-y-6'>
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5' />
                  AI Scheduler & Appointment Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='py-12 text-center'>
                  <Calendar className='mx-auto mb-4 h-16 w-16 text-green-600' />
                  <h3 className='mb-2 text-2xl font-bold text-green-600'>
                    Smart Scheduling Platform
                  </h3>
                  <p className='mb-4 text-gray-600'>
                    AI-powered appointment setting and calendar optimization for
                    freight operations
                  </p>
                  <div className='mx-auto grid max-w-md grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='rounded-lg bg-green-50 p-3'>
                      <div className='font-semibold text-green-600'>
                        Automated Booking
                      </div>
                      <div className='text-sm text-gray-600'>
                        AI schedules pickups & deliveries
                      </div>
                    </div>
                    <div className='rounded-lg bg-blue-50 p-3'>
                      <div className='font-semibold text-blue-600'>
                        Route Integration
                      </div>
                      <div className='text-sm text-gray-600'>
                        Syncs with dispatch operations
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Analytics Tab */}
          <TabsContent value='analytics' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* AI Task Analytics Panel */}
              <AITaskPrioritizationPanel mode='analytics' />

              {/* Analytics Metrics */}
              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    AI Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='mb-6 grid grid-cols-2 gap-4'>
                    <div className='rounded-lg bg-indigo-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-indigo-600'>
                        {aiMetrics.systemEfficiency}%
                      </div>
                      <div className='text-sm text-gray-600'>
                        System Efficiency
                      </div>
                    </div>
                    <div className='rounded-lg bg-green-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-green-600'>
                        ${(aiMetrics.dailyRevenue / 1000).toFixed(1)}K
                      </div>
                      <div className='text-sm text-gray-600'>Daily Revenue</div>
                    </div>
                    <div className='rounded-lg bg-purple-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-purple-600'>
                        {aiMetrics.totalDecisions}
                      </div>
                      <div className='text-sm text-gray-600'>AI Decisions</div>
                    </div>
                    <div className='rounded-lg bg-orange-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-orange-600'>
                        {aiMetrics.activeOperations}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Active Operations
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='rounded-lg bg-indigo-50 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Target className='h-4 w-4 text-indigo-600' />
                        <span className='font-semibold text-indigo-600'>
                          Predictive Analytics
                        </span>
                      </div>
                      <div className='text-sm text-gray-600'>
                        AI forecasts market trends and optimizes resource
                        allocation
                      </div>
                    </div>
                    <div className='rounded-lg bg-purple-50 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Shield className='h-4 w-4 text-purple-600' />
                        <span className='font-semibold text-purple-600'>
                          Government APIs
                        </span>
                      </div>
                      <div className='text-sm text-gray-600'>
                        Real-time regulatory data and compliance monitoring
                      </div>
                    </div>
                    <div className='rounded-lg bg-blue-50 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Gauge className='h-4 w-4 text-blue-600' />
                        <span className='font-semibold text-blue-600'>
                          Performance AI
                        </span>
                      </div>
                      <div className='text-sm text-gray-600'>
                        Operational optimization and efficiency monitoring
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Review System Tab */}
          <TabsContent value='ai-review' className='space-y-6'>
            <div className='p-8 text-center'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                AI Review System
              </h2>
              <p className='text-gray-600'>
                AI Review Dashboard temporarily disabled for debugging
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
