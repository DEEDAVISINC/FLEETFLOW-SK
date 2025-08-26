'use client';

import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
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
  Truck,
  UserPlus,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
  };
  dispatchStats: {
    driversActive: number;
    routeOptimization: number;
    fuelSavings: number;
  };
  recruitingStats: {
    leadsToday: number;
    conversionRate: number;
    activeRecruiters: number;
  };
}

export default function AIFlowPage() {
  const [activeTab, setActiveTab] = useState('overview');
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
    },
    dispatchStats: {
      driversActive: 89,
      routeOptimization: 96.2,
      fuelSavings: 18.7,
    },
    recruitingStats: {
      leadsToday: 34,
      conversionRate: 23.5,
      activeRecruiters: 6,
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
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-10 border border-gray-200 bg-white/50 backdrop-blur-sm'>
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
              value='strategic-acquisition'
              className='flex items-center gap-2'
            >
              <Target className='h-4 w-4' />
              Acquisition Pipeline
            </TabsTrigger>
          </TabsList>

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

          {/* Keep existing tabs content here - Overview, Call Center, etc. */}
          {/* I'll add them back in the next part... */}
        </Tabs>
      </div>
    </div>
  );
}
