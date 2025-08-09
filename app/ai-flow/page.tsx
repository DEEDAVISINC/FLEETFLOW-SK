'use client';

import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  Calendar as CalendarIcon,
  CheckCircle,
  DollarSign,
  Eye,
  Gauge,
  Globe,
  Headphones,
  Heart,
  Mail,
  MessageSquare,
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
import CRMLeadManager from '../components/CRMLeadManager';
import ServicesSalesDashboard from '../components/ServicesSalesDashboard';
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

// Strategic Acquisition Pipeline interfaces
interface StrategicBuyer {
  id: string;
  companyName: string;
  type: 'Primary' | 'Secondary' | 'Opportunistic';
  acquisitionBudget: string;
  keyDecisionMakers: {
    name: string;
    title: string;
    email: string;
    linkedIn: string;
    lastContact?: string;
  }[];
  strategicFit: number;
  acquisitionLikelihood: number;
  status:
    | 'prospecting'
    | 'contacted'
    | 'engaged'
    | 'demo_scheduled'
    | 'evaluating'
    | 'negotiating'
    | 'closed';
  lastActivity: string;
  nextAction: string;
  notes: string;
}

interface OutreachCampaign {
  id: string;
  name: string;
  targetCompany: string;
  type: 'email' | 'linkedin' | 'direct_mail' | 'phone';
  status: 'draft' | 'active' | 'paused' | 'completed';
  sentCount: number;
  responseRate: number;
  meetingsScheduled: number;
  lastSent: string;
  nextScheduled?: string;
}

interface DemoEnvironment {
  id: string;
  companyName: string;
  environmentType:
    | 'Strategic Buyer Sandbox'
    | 'Executive Demo'
    | 'Technical Evaluation';
  accessUrl: string;
  createdDate: string;
  expiryDate: string;
  usageStats: {
    logins: number;
    timeSpent: number;
    featuresExplored: string[];
    lastAccess: string;
  };
  status: 'active' | 'expired' | 'suspended';
}

interface AcquisitionMetrics {
  totalTargets: number;
  activeOutreach: number;
  responseRate: number;
  meetingsScheduled: number;
  demosDeployed: number;
  pipelineValue: string;
  avgDealSize: string;
  timeToClose: number;
}

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
    avgRate: number;
    efficiency: number;
    avgMargin: number;
    loadMatch: number;
  };
  dispatchStats: {
    driversActive: number;
    routeOptimization: number;
    fuelSavings: number;
    deliveryTime: number;
  };
  recruitingStats: {
    leadsToday: number;
    conversionRate: number;
    activeRecruiters: number;
    qualificationRate: number;
    hireRate: number;
  };
  customerStats: {
    totalContacts: number;
    pipelineValue: number;
    conversionRate: number;
  };
}

export default function AIFlowPage() {
  const [aiMetrics, setAiMetrics] = useState<AIMetrics>({
    totalDecisions: 15247,
    systemEfficiency: 94.7,
    dailyRevenue: 47350,
    activeOperations: 'Online',
    callCenterStats: {
      activeCalls: 23,
      totalAgents: 12,
      avgWaitTime: 1.2,
    },
    freightStats: {
      activeLoads: 156,
      avgRate: 2.85,
      efficiency: 91.3,
      avgMargin: 18.5,
      loadMatch: 94.2,
    },
    dispatchStats: {
      driversActive: 89,
      routeOptimization: 96.2,
      fuelSavings: 18.7,
      deliveryTime: 95.8,
    },
    recruitingStats: {
      leadsToday: 34,
      conversionRate: 23.5,
      activeRecruiters: 6,
      qualificationRate: 78.3,
      hireRate: 15.2,
    },
    customerStats: {
      totalContacts: 2847,
      pipelineValue: 1250000,
      conversionRate: 28.4,
    },
  });

  // Strategic Acquisition Pipeline State
  const [acquisitionData, setAcquisitionData] = useState<{
    buyers: StrategicBuyer[];
    campaigns: OutreachCampaign[];
    demos: DemoEnvironment[];
    metrics: AcquisitionMetrics;
  } | null>(null);
  const [acquisitionLoading, setAcquisitionLoading] = useState(true);
  const [servicesData, setServicesData] = useState<any>(null);
  const [servicesLoading, setServicesLoading] = useState(true);

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

  // Load Strategic Acquisition Pipeline data
  useEffect(() => {
    const loadAcquisitionData = async () => {
      try {
        const response = await fetch('/api/ai-flow/strategic-acquisition');
        if (response.ok) {
          const data = await response.json();
          setAcquisitionData(data);
        }
      } catch (error) {
        console.error('Failed to load acquisition data:', error);
      } finally {
        setAcquisitionLoading(false);
      }
    };

    loadAcquisitionData();
  }, []);

  // Load Services Sales data
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
        setServicesLoading(false);
      }
    };

    loadServicesData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospecting':
        return 'bg-gray-100 text-gray-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'engaged':
        return 'bg-yellow-100 text-yellow-800';
      case 'demo_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'evaluating':
        return 'bg-orange-100 text-orange-800';
      case 'negotiating':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBuyerTypeColor = (type: string) => {
    switch (type) {
      case 'Primary':
        return 'bg-red-100 text-red-800';
      case 'Secondary':
        return 'bg-blue-100 text-blue-800';
      case 'Opportunistic':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                Complete AI-Powered Transportation & Strategic Acquisition
                Center
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
                      Active Calls
                    </p>
                    <p className='text-2xl font-bold'>
                      {aiMetrics.callCenterStats.activeCalls}
                    </p>
                  </div>
                  <Phone className='h-8 w-8 text-orange-200' />
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-r from-teal-500 to-teal-600 text-white'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-teal-100'>
                      AI Decisions
                    </p>
                    <p className='text-2xl font-bold'>
                      {aiMetrics.totalDecisions.toLocaleString()}
                    </p>
                  </div>
                  <Brain className='h-8 w-8 text-teal-200' />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value='overview' onValueChange={() => {}} className='space-y-6'>
          <TabsList className='grid w-full grid-cols-12 border border-gray-200 bg-white/50 backdrop-blur-sm'>
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
            <TabsTrigger
              value='services-sales'
              className='flex items-center gap-2'
            >
              <Briefcase className='h-4 w-4' />
              Services Sales
            </TabsTrigger>
            <TabsTrigger
              value='crm-manager'
              className='flex items-center gap-2'
            >
              <Building2 className='h-4 w-4' />
              CRM Manager
            </TabsTrigger>
            <TabsTrigger
              value='pharmaceutical-leads'
              className='flex items-center gap-2'
            >
              💊 Pharmaceutical Leads
            </TabsTrigger>
            <TabsTrigger
              value='medical-courier-leads'
              className='flex items-center gap-2'
            >
              🏥 Medical Courier Leads
            </TabsTrigger>
            <TabsTrigger
              value='strategic-acquisition'
              className='flex items-center gap-2'
            >
              <Target className='h-4 w-4' />
              Acquisition Pipeline
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

          {/* Services Sales Tab - REVENUE ENGINE */}
          <TabsContent value='services-sales' className='space-y-6'>
            <ServicesSalesDashboard />
          </TabsContent>

          {/* CRM Lead Manager Tab - INTERACTIVE CRM */}
          <TabsContent value='crm-manager' className='space-y-6'>
            <CRMLeadManager />
          </TabsContent>

          {/* Pharmaceutical Leads Tab */}
          <TabsContent value='pharmaceutical-leads' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Pharmaceutical Lead Discovery */}
              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    💊 Pharmaceutical Lead Discovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-600'>
                          47
                        </div>
                        <div className='text-sm text-gray-600'>
                          Active Pharma Leads
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-green-600'>
                          12
                        </div>
                        <div className='text-sm text-gray-600'>
                          Converted This Month
                        </div>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='text-sm font-medium'>Lead Sources:</div>
                      <div className='space-y-1 text-xs'>
                        <div className='flex justify-between'>
                          <span>🏥 Hospital Networks</span>
                          <span className='font-medium'>18 leads</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>🧪 Pharmaceutical Manufacturers</span>
                          <span className='font-medium'>15 leads</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>💊 Pharmacy Chains</span>
                          <span className='font-medium'>9 leads</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>🔬 Clinical Research Organizations</span>
                          <span className='font-medium'>5 leads</span>
                        </div>
                      </div>
                    </div>

                    <button className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                      🔍 Discover New Pharma Leads
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Lead Conversion Pipeline */}
              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    🎯 Pharmaceutical Conversion Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Cold Chain Prospects</span>
                        <Badge className='bg-blue-100 text-blue-800'>
                          23 active
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-blue-600'
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Temperature Controlled</span>
                        <Badge className='bg-green-100 text-green-800'>
                          18 qualified
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-green-600'
                          style={{ width: '78%' }}
                        ></div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>FDA Compliance</span>
                        <Badge className='bg-purple-100 text-purple-800'>
                          12 negotiating
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-purple-600'
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>
                          Clinical Trial Logistics
                        </span>
                        <Badge className='bg-orange-100 text-orange-800'>
                          8 closing
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-orange-600'
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Pharmaceutical Leads Table */}
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  📋 Active Pharmaceutical Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Header */}
                  <div className='grid grid-cols-6 gap-4 text-xs font-medium tracking-wide text-gray-600 uppercase'>
                    <div>Company</div>
                    <div>Service Type</div>
                    <div>Temperature Req.</div>
                    <div>Compliance</div>
                    <div>Value</div>
                    <div>Status</div>
                  </div>

                  {/* Lead Rows */}
                  {[
                    {
                      company: 'Pfizer Global Supply',
                      service: 'Cold Chain Distribution',
                      temperature: '2-8°C',
                      compliance: 'FDA, GMP',
                      value: '$2.4M',
                      status: 'qualified',
                      urgency: 'high',
                    },
                    {
                      company: 'Johnson & Johnson',
                      service: 'Clinical Trial Transport',
                      temperature: '-20°C',
                      compliance: 'FDA, GCP',
                      value: '$1.8M',
                      status: 'negotiating',
                      urgency: 'medium',
                    },
                    {
                      company: 'Moderna Logistics',
                      service: 'Vaccine Distribution',
                      temperature: '-70°C',
                      compliance: 'FDA, CDC',
                      value: '$3.2M',
                      status: 'proposal',
                      urgency: 'critical',
                    },
                    {
                      company: 'Merck Sharp & Dohme',
                      service: 'Hospital Direct Delivery',
                      temperature: '15-25°C',
                      compliance: 'FDA, USP',
                      value: '$950K',
                      status: 'discovery',
                      urgency: 'low',
                    },
                  ].map((lead, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-6 items-center gap-4 rounded-lg border border-gray-100 p-3 hover:bg-gray-50'
                    >
                      <div className='font-medium'>{lead.company}</div>
                      <div className='text-sm text-gray-600'>
                        {lead.service}
                      </div>
                      <div>
                        <Badge className='bg-blue-100 text-xs text-blue-800'>
                          {lead.temperature}
                        </Badge>
                      </div>
                      <div>
                        <Badge className='bg-green-100 text-xs text-green-800'>
                          {lead.compliance}
                        </Badge>
                      </div>
                      <div className='font-medium text-green-600'>
                        {lead.value}
                      </div>
                      <div>
                        <Badge
                          className={
                            lead.status === 'qualified'
                              ? 'bg-green-100 text-green-800'
                              : lead.status === 'negotiating'
                                ? 'bg-blue-100 text-blue-800'
                                : lead.status === 'proposal'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {lead.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Courier Leads Tab */}
          <TabsContent value='medical-courier-leads' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Medical Courier Lead Discovery */}
              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    🏥 Medical Courier Lead Discovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-red-600'>
                          32
                        </div>
                        <div className='text-sm text-gray-600'>
                          Active Medical Leads
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-green-600'>
                          8
                        </div>
                        <div className='text-sm text-gray-600'>
                          Converted This Month
                        </div>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='text-sm font-medium'>Lead Sources:</div>
                      <div className='space-y-1 text-xs'>
                        <div className='flex justify-between'>
                          <span>🏥 Hospitals & Medical Centers</span>
                          <span className='font-medium'>14 leads</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>🧪 Clinical Laboratories</span>
                          <span className='font-medium'>8 leads</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>💊 Pharmacy Chains</span>
                          <span className='font-medium'>6 leads</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>🔬 Research Facilities</span>
                          <span className='font-medium'>4 leads</span>
                        </div>
                      </div>
                    </div>

                    <button className='w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700'>
                      🔍 Discover New Medical Courier Leads
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Courier Conversion Pipeline */}
              <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    🎯 Medical Courier Conversion Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>STAT Delivery Prospects</span>
                        <Badge className='bg-red-100 text-red-800'>
                          16 active
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-red-600'
                          style={{ width: '72%' }}
                        ></div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>
                          Medical Equipment Transport
                        </span>
                        <Badge className='bg-blue-100 text-blue-800'>
                          12 qualified
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-blue-600'
                          style={{ width: '68%' }}
                        ></div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>
                          Clinical Trial Logistics
                        </span>
                        <Badge className='bg-purple-100 text-purple-800'>
                          9 negotiating
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-purple-600'
                          style={{ width: '55%' }}
                        ></div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>
                          Emergency Medical Transport
                        </span>
                        <Badge className='bg-orange-100 text-orange-800'>
                          6 closing
                        </Badge>
                      </div>
                      <div className='h-2 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-orange-600'
                          style={{ width: '88%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Medical Courier Leads Table */}
            <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  📋 Active Medical Courier Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Header */}
                  <div className='grid grid-cols-6 gap-4 text-xs font-medium tracking-wide text-gray-600 uppercase'>
                    <div>Medical Facility</div>
                    <div>Service Type</div>
                    <div>Urgency Level</div>
                    <div>Compliance</div>
                    <div>Value</div>
                    <div>Status</div>
                  </div>

                  {/* Lead Rows */}
                  {[
                    {
                      facility: 'Mayo Clinic',
                      service: 'STAT Lab Transport',
                      urgency: 'Critical',
                      compliance: 'HIPAA, DOT',
                      value: '$850K',
                      status: 'qualified',
                      urgencyLevel: 'critical',
                    },
                    {
                      facility: 'Johns Hopkins Hospital',
                      service: 'Medical Equipment Delivery',
                      urgency: 'High',
                      compliance: 'HIPAA, OSHA',
                      value: '$640K',
                      status: 'negotiating',
                      urgencyLevel: 'high',
                    },
                    {
                      facility: 'Cleveland Clinic',
                      service: 'Clinical Trial Logistics',
                      urgency: 'Medium',
                      compliance: 'FDA, GCP',
                      value: '$1.2M',
                      status: 'proposal',
                      urgencyLevel: 'medium',
                    },
                    {
                      facility: 'Mass General Hospital',
                      service: 'Emergency Organ Transport',
                      urgency: 'Critical',
                      compliance: 'HIPAA, UNOS',
                      value: '$2.1M',
                      status: 'discovery',
                      urgencyLevel: 'critical',
                    },
                  ].map((lead, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-6 items-center gap-4 rounded-lg border border-gray-100 p-3 hover:bg-gray-50'
                    >
                      <div className='font-medium'>{lead.facility}</div>
                      <div className='text-sm text-gray-600'>
                        {lead.service}
                      </div>
                      <div>
                        <Badge
                          className={
                            lead.urgencyLevel === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : lead.urgencyLevel === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {lead.urgency}
                        </Badge>
                      </div>
                      <div>
                        <Badge className='bg-blue-100 text-xs text-blue-800'>
                          {lead.compliance}
                        </Badge>
                      </div>
                      <div className='font-medium text-green-600'>
                        {lead.value}
                      </div>
                      <div>
                        <Badge
                          className={
                            lead.status === 'qualified'
                              ? 'bg-green-100 text-green-800'
                              : lead.status === 'negotiating'
                                ? 'bg-blue-100 text-blue-800'
                                : lead.status === 'proposal'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {lead.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategic Acquisition Pipeline Tab */}
          <TabsContent value='strategic-acquisition' className='space-y-6'>
            {acquisitionLoading ? (
              <div className='flex items-center justify-center p-8'>
                <div className='text-center'>
                  <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
                  <p className='text-gray-600'>
                    Loading Strategic Acquisition Pipeline...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Developer-Only Header */}
                <div className='mb-6 rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-4 text-white'>
                  <div className='flex items-center gap-3'>
                    <Shield className='h-6 w-6' />
                    <div>
                      <h3 className='text-lg font-bold'>
                        🔒 Developer-Only System
                      </h3>
                      <p className='text-sm text-red-100'>
                        Strategic Acquisition Pipeline Automation - Private
                        Internal Tool
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acquisition Metrics */}
                {acquisitionData && (
                  <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <Card className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
                      <CardContent className='p-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='text-sm font-medium text-blue-100'>
                              Target Companies
                            </p>
                            <p className='text-2xl font-bold'>
                              {acquisitionData.metrics.totalTargets}
                            </p>
                          </div>
                          <Building2 className='h-8 w-8 text-blue-200' />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
                      <CardContent className='p-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='text-sm font-medium text-green-100'>
                              Active Outreach
                            </p>
                            <p className='text-2xl font-bold'>
                              {acquisitionData.metrics.activeOutreach}
                            </p>
                          </div>
                          <Mail className='h-8 w-8 text-green-200' />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
                      <CardContent className='p-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='text-sm font-medium text-purple-100'>
                              Response Rate
                            </p>
                            <p className='text-2xl font-bold'>
                              {acquisitionData.metrics.responseRate.toFixed(1)}%
                            </p>
                          </div>
                          <MessageSquare className='h-8 w-8 text-purple-200' />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
                      <CardContent className='p-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='text-sm font-medium text-orange-100'>
                              Pipeline Value
                            </p>
                            <p className='text-2xl font-bold'>
                              {acquisitionData.metrics.pipelineValue}
                            </p>
                          </div>
                          <DollarSign className='h-8 w-8 text-orange-200' />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Strategic Buyers Dashboard */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  {/* Strategic Buyers List */}
                  <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Target className='h-5 w-5 text-blue-600' />
                        Strategic Buyers Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {acquisitionData?.buyers.map((buyer) => (
                          <div
                            key={buyer.id}
                            className='rounded-lg border p-4 transition-colors hover:bg-gray-50'
                          >
                            <div className='mb-3 flex items-start justify-between'>
                              <div>
                                <h4 className='text-lg font-semibold'>
                                  {buyer.companyName}
                                </h4>
                                <div className='mt-1 flex items-center gap-2'>
                                  <Badge
                                    className={getBuyerTypeColor(buyer.type)}
                                  >
                                    {buyer.type}
                                  </Badge>
                                  <Badge
                                    className={getStatusColor(buyer.status)}
                                  >
                                    {buyer.status
                                      .replace('_', ' ')
                                      .toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='text-sm text-gray-600'>
                                  Strategic Fit
                                </div>
                                <div className='text-lg font-bold text-blue-600'>
                                  {buyer.strategicFit}%
                                </div>
                              </div>
                            </div>

                            <div className='mb-3 grid grid-cols-2 gap-4'>
                              <div>
                                <div className='text-sm text-gray-600'>
                                  Acquisition Budget
                                </div>
                                <div className='font-medium'>
                                  {buyer.acquisitionBudget}
                                </div>
                              </div>
                              <div>
                                <div className='text-sm text-gray-600'>
                                  Likelihood
                                </div>
                                <div className='font-medium text-green-600'>
                                  {buyer.acquisitionLikelihood}%
                                </div>
                              </div>
                            </div>

                            <div className='mb-3'>
                              <div className='mb-1 text-sm text-gray-600'>
                                Key Decision Maker
                              </div>
                              <div className='font-medium'>
                                {buyer.keyDecisionMakers[0]?.name} -{' '}
                                {buyer.keyDecisionMakers[0]?.title}
                              </div>
                            </div>

                            <div className='mb-3'>
                              <div className='mb-1 text-sm text-gray-600'>
                                Next Action
                              </div>
                              <div className='text-sm'>{buyer.nextAction}</div>
                            </div>

                            <div className='flex items-center justify-between text-xs text-gray-500'>
                              <span>
                                Last Activity:{' '}
                                {new Date(
                                  buyer.lastActivity
                                ).toLocaleDateString()}
                              </span>
                              <ArrowRight className='h-4 w-4' />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Outreach Campaigns & Demo Environments */}
                  <div className='space-y-6'>
                    {/* Active Outreach Campaigns */}
                    <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Mail className='h-5 w-5 text-green-600' />
                          Active Outreach Campaigns
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          {acquisitionData?.campaigns.map((campaign) => (
                            <div
                              key={campaign.id}
                              className='rounded-lg border p-3'
                            >
                              <div className='mb-2 flex items-start justify-between'>
                                <div>
                                  <h5 className='font-medium'>
                                    {campaign.name}
                                  </h5>
                                  <p className='text-sm text-gray-600'>
                                    {campaign.targetCompany}
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    campaign.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {campaign.status}
                                </Badge>
                              </div>

                              <div className='grid grid-cols-3 gap-3 text-sm'>
                                <div>
                                  <div className='text-gray-600'>Sent</div>
                                  <div className='font-medium'>
                                    {campaign.sentCount}
                                  </div>
                                </div>
                                <div>
                                  <div className='text-gray-600'>Response</div>
                                  <div className='font-medium text-blue-600'>
                                    {campaign.responseRate}%
                                  </div>
                                </div>
                                <div>
                                  <div className='text-gray-600'>Meetings</div>
                                  <div className='font-medium text-green-600'>
                                    {campaign.meetingsScheduled}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Demo Environments */}
                    <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Globe className='h-5 w-5 text-purple-600' />
                          Strategic Demo Environments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          {acquisitionData?.demos.map((demo) => (
                            <div
                              key={demo.id}
                              className='rounded-lg border p-3'
                            >
                              <div className='mb-2 flex items-start justify-between'>
                                <div>
                                  <h5 className='font-medium'>
                                    {demo.companyName}
                                  </h5>
                                  <p className='text-sm text-gray-600'>
                                    {demo.environmentType}
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    demo.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }
                                >
                                  {demo.status}
                                </Badge>
                              </div>

                              <div className='mb-2 grid grid-cols-2 gap-3 text-sm'>
                                <div>
                                  <div className='text-gray-600'>Logins</div>
                                  <div className='font-medium'>
                                    {demo.usageStats.logins}
                                  </div>
                                </div>
                                <div>
                                  <div className='text-gray-600'>
                                    Time Spent
                                  </div>
                                  <div className='font-medium'>
                                    {demo.usageStats.timeSpent}h
                                  </div>
                                </div>
                              </div>

                              <div className='flex items-center justify-between text-xs text-gray-500'>
                                <span>
                                  Last Access:{' '}
                                  {demo.usageStats.lastAccess
                                    ? new Date(
                                        demo.usageStats.lastAccess
                                      ).toLocaleDateString()
                                    : 'Never'}
                                </span>
                                <Eye className='h-4 w-4' />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* AI-Powered Actions */}
                <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Brain className='h-5 w-5 text-blue-600' />
                      AI-Powered Acquisition Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                      <button className='rounded-lg border p-4 text-left transition-colors hover:bg-blue-50'>
                        <div className='mb-2 flex items-center gap-3'>
                          <MessageSquare className='h-5 w-5 text-blue-600' />
                          <span className='font-medium'>Generate Outreach</span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          AI-generated personalized emails and LinkedIn messages
                          for strategic buyers
                        </p>
                      </button>

                      <button className='rounded-lg border p-4 text-left transition-colors hover:bg-green-50'>
                        <div className='mb-2 flex items-center gap-3'>
                          <BarChart3 className='h-5 w-5 text-green-600' />
                          <span className='font-medium'>Analyze Buyers</span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Deep AI analysis of strategic fit, timing, and
                          approach recommendations
                        </p>
                      </button>

                      <button className='rounded-lg border p-4 text-left transition-colors hover:bg-purple-50'>
                        <div className='mb-2 flex items-center gap-3'>
                          <CalendarIcon className='h-5 w-5 text-purple-600' />
                          <span className='font-medium'>Schedule Demos</span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Automated demo environment creation and meeting
                          scheduling
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
