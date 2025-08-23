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
  Warehouse,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
// import AISalesAssistantDashboard from '../components/AISalesAssistantDashboard';
import AISalesIntelligenceHub from '../components/AISalesIntelligenceHub';
import AITaskPrioritizationPanel from '../components/AITaskPrioritizationPanel';
import CRMDashboard from '../components/CRMDashboard';
import UnifiedNotificationBell from '../components/UnifiedNotificationBell';
import WorkingCRMDashboard from '../components/WorkingCRMDashboard';
import fleetFlowNotificationManager from '../services/FleetFlowNotificationManager';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';
import webSocketNotificationService from '../services/WebSocketNotificationService';
// Updated import: 2024-12-21 23:15:00
import AILoadBookingHub from '../components/AILoadBookingHub';
import Advanced3PLDashboard from '../components/Advanced3PLDashboard';
import ServicesSalesDashboard from '../components/ServicesSalesDashboard';
import SmartLoadNetworkDashboard from '../components/SmartLoadNetworkDashboard';
import TruckingPlanetIntelligence from '../components/TruckingPlanetIntelligence';
import WARPSmartBiddingDashboard from '../components/WARPSmartBiddingDashboard';
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

  // Subscription Management State
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  // Load Subscription Management data
  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        // Get subscription data using static methods
        const analytics =
          SubscriptionManagementService.getSubscriptionAnalytics();
        const tiers = SubscriptionManagementService.getSubscriptionTiers();

        setSubscriptionData({
          tiers,
          analytics,
          totalRevenue: analytics.monthlyRecurringRevenue,
          activeUsers: analytics.activeSubscriptions,
          churnRate: 2.3, // Calculate from analytics in production
          growthRate: 15.7, // Calculate from analytics in production
        });
      } catch (error) {
        console.error('Failed to load subscription data:', error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    loadSubscriptionData();

    // Refresh subscription data every 30 seconds
    const subscriptionInterval = setInterval(loadSubscriptionData, 30000);
    return () => clearInterval(subscriptionInterval);
  }, []);

  // Initialize AI Flow Notification System
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Set up real-time notification updates
        const unsubscribe = fleetFlowNotificationManager.subscribe(
          'notification_added',
          (notification: any) => {
            if (
              notification.type === 'system_alert' ||
              notification.type === 'workflow_update'
            ) {
              // Update AI Flow metrics based on notifications
              console.log(
                '🔔 AI Flow notification received:',
                notification.title
              );
            }
          }
        );

        // Monitor WebSocket connection status
        const statusInterval = setInterval(() => {
          const wsStatus = webSocketNotificationService.getConnectionStatus();
          const notificationHealth =
            fleetFlowNotificationManager.getHealthStatus();
          setConnectionStatus({
            websocket: wsStatus,
            notifications: notificationHealth,
          });
        }, 10000);

        // Send AI Flow initialization notification
        await fleetFlowNotificationManager.createNotification({
          type: 'system_alert',
          priority: 'normal',
          title: '🤖 AI Flow Platform Online',
          message:
            'FleetFlow AI Hub has been activated with full operational intelligence capabilities',
          channels: { inApp: true, sms: false, email: false, push: false },
          targetPortals: ['admin'],
          metadata: {
            source: 'ai_flow_platform',
            systemComponent: 'AI Hub',
            status: 'online',
          },
        });

        return () => {
          unsubscribe();
          clearInterval(statusInterval);
        };
      } catch (error) {
        console.error('Failed to initialize AI Flow notifications:', error);
      }
    };

    initializeNotifications();
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
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
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

            {/* Unified Notification Bell & Connection Status */}
            <div className='flex items-center gap-4'>
              {/* Connection Status Indicator */}
              <div className='flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 backdrop-blur-sm'>
                <div
                  className={`h-2 w-2 rounded-full ${
                    connectionStatus?.websocket?.connected
                      ? 'animate-pulse bg-green-400'
                      : 'bg-red-400'
                  }`}
                />
                <span className='text-sm font-medium text-gray-700'>
                  {connectionStatus?.websocket?.connected ? 'Live' : 'Offline'}
                </span>
              </div>

              {/* Unified Notification Bell */}
              <UnifiedNotificationBell
                userId='ai-flow-admin'
                portal='admin'
                position='inline'
                size='lg'
                theme='auto'
                showBadge={true}
                showDropdown={true}
                maxNotifications={25}
              />
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
          <TabsList className='grid w-full grid-cols-19 border border-gray-200 bg-white/50 backdrop-blur-sm'>
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
              value='ai-sales-assistant'
              className='flex items-center gap-2'
            >
              <MessageSquare className='h-4 w-4' />
              Sales AI
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
            <TabsTrigger
              value='sales-intelligence'
              className='flex items-center gap-2'
            >
              🎯 Sales Intelligence
            </TabsTrigger>
            <TabsTrigger
              value='truckingplanet-intel'
              className='flex items-center gap-2'
            >
              🌐 TruckingPlanet Intel
            </TabsTrigger>
            <TabsTrigger
              value='ai-load-booking'
              className='flex items-center gap-2'
            >
              🚛 AI Load Booking
            </TabsTrigger>
            <TabsTrigger
              value='smart-load-network'
              className='flex items-center gap-2'
            >
              <Truck className='h-4 w-4' />
              🚛 Smart Loads
            </TabsTrigger>
            <TabsTrigger
              value='warp-smart-bidding'
              className='flex items-center gap-2'
            >
              <Target className='h-4 w-4' />
              🎯 Smart Bidding
            </TabsTrigger>
            <TabsTrigger
              value='advanced-3pl'
              className='flex items-center gap-2'
            >
              <Warehouse className='h-4 w-4' />
              🏭 Advanced 3PL
            </TabsTrigger>
            <TabsTrigger
              value='subscription-manager'
              className='flex items-center gap-2'
            >
              <DollarSign className='h-4 w-4' />
              💳 Subscription Manager
            </TabsTrigger>
            <TabsTrigger
              value='thomasnet-intelligence'
              className='flex items-center gap-2'
            >
              <Building2 className='h-4 w-4' />
              🏭 ThomasNet Intelligence
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
                <div className='mb-6 flex items-center gap-3'>
                  <Brain className='h-6 w-6 text-blue-400' />
                  <h3 className='text-lg font-semibold text-white'>
                    AI Platform Status
                  </h3>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/10 p-3 backdrop-blur-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-green-400' />
                      <span className='font-medium text-white'>
                        All Systems Operational
                      </span>
                    </div>
                    <div className='inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300'>
                      Live
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-center backdrop-blur-sm'>
                      <div className='text-2xl font-bold text-blue-400'>
                        {aiMetrics.callCenterStats.activeCalls}
                      </div>
                      <div className='text-sm text-white/70'>Active Calls</div>
                    </div>
                    <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 text-center backdrop-blur-sm'>
                      <div className='text-2xl font-bold text-purple-400'>
                        {aiMetrics.freightStats.activeLoads}
                      </div>
                      <div className='text-sm text-white/70'>Active Loads</div>
                    </div>
                    <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center backdrop-blur-sm'>
                      <div className='text-2xl font-bold text-green-400'>
                        {aiMetrics.dispatchStats.driversActive}
                      </div>
                      <div className='text-sm text-white/70'>
                        Drivers Online
                      </div>
                    </div>
                    <div className='rounded-lg border border-orange-500/20 bg-orange-500/10 p-3 text-center backdrop-blur-sm'>
                      <div className='text-2xl font-bold text-orange-400'>
                        {aiMetrics.recruitingStats.leadsToday}
                      </div>
                      <div className='text-sm text-white/70'>Leads Today</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
                <div className='mb-6 flex items-center gap-3'>
                  <TrendingUp className='h-6 w-6 text-green-400' />
                  <h3 className='text-lg font-semibold text-white'>
                    AI Performance Metrics
                  </h3>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-white/80'>
                      Load Matching Accuracy
                    </span>
                    <span className='text-sm font-bold text-green-400'>
                      {aiMetrics.freightStats.loadMatch}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-white/80'>
                      Route Optimization
                    </span>
                    <span className='text-sm font-bold text-blue-400'>
                      {aiMetrics.dispatchStats.routeOptimization}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-white/80'>
                      Lead Qualification Rate
                    </span>
                    <span className='text-sm font-bold text-purple-400'>
                      {aiMetrics.recruitingStats.qualificationRate}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-white/80'>
                      Customer Conversion
                    </span>
                    <span className='text-sm font-bold text-pink-400'>
                      {aiMetrics.customerStats.conversionRate}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-white/80'>
                      On-Time Delivery
                    </span>
                    <span className='text-sm font-bold text-green-400'>
                      {aiMetrics.dispatchStats.deliveryTime}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Call Center Tab */}
          <TabsContent value='call-center' className='space-y-6'>
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='mb-6 flex items-center gap-3'>
                <Phone className='h-6 w-6 text-blue-400' />
                <h3 className='text-lg font-semibold text-white'>
                  AI-Powered Call Center Platform
                </h3>
              </div>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/10 p-3 backdrop-blur-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-green-400' />
                      <span className='font-medium text-white'>
                        FreeSWITCH Active
                      </span>
                    </div>
                    <div className='inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300'>
                      ESL Port 8021
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-center backdrop-blur-sm'>
                      <div className='text-3xl font-bold text-blue-400'>
                        {aiMetrics.callCenterStats.activeCalls}
                      </div>
                      <div className='text-sm text-white/70'>Active Calls</div>
                    </div>
                    <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 text-center backdrop-blur-sm'>
                      <div className='text-3xl font-bold text-purple-400'>
                        {aiMetrics.callCenterStats.totalAgents}
                      </div>
                      <div className='text-sm text-white/70'>Agents Online</div>
                    </div>
                  </div>

                  <div className='rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-center backdrop-blur-sm'>
                    <div className='text-2xl font-bold text-yellow-400'>
                      {aiMetrics.callCenterStats.avgWaitTime}s
                    </div>
                    <div className='text-sm text-white/70'>
                      Average Wait Time
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-white'>
                    AI Features
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 rounded border border-green-500/20 bg-green-500/10 p-2 backdrop-blur-sm'>
                      <Shield className='h-4 w-4 text-green-400' />
                      <span className='text-sm text-white/80'>
                        Real-time Lead Scoring
                      </span>
                    </div>
                    <div className='flex items-center gap-2 rounded border border-blue-500/20 bg-blue-500/10 p-2 backdrop-blur-sm'>
                      <Brain className='h-4 w-4 text-blue-400' />
                      <span className='text-sm text-white/80'>
                        Conversation Intelligence
                      </span>
                    </div>
                    <div className='flex items-center gap-2 rounded border border-purple-500/20 bg-purple-500/10 p-2 backdrop-blur-sm'>
                      <Target className='h-4 w-4 text-purple-400' />
                      <span className='text-sm text-white/80'>
                        Automated Follow-up
                      </span>
                    </div>
                    <div className='flex items-center gap-2 rounded border border-orange-500/20 bg-orange-500/10 p-2 backdrop-blur-sm'>
                      <TrendingUp className='h-4 w-4 text-orange-400' />
                      <span className='text-sm text-white/80'>
                        Performance Analytics
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
                <div className='mb-6 flex items-center gap-3'>
                  <Navigation className='h-6 w-6 text-blue-400' />
                  <h3 className='text-lg font-semibold text-white'>
                    AI Dispatch Control
                  </h3>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-center backdrop-blur-sm'>
                    <div className='text-2xl font-bold text-blue-400'>
                      {aiMetrics.freightStats.activeLoads}
                    </div>
                    <div className='text-sm text-white/70'>Active Loads</div>
                  </div>
                  <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center backdrop-blur-sm'>
                    <div className='text-2xl font-bold text-green-400'>
                      {aiMetrics.freightStats.avgMargin}%
                    </div>
                    <div className='text-sm text-white/70'>Avg Margin</div>
                  </div>
                  <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 text-center backdrop-blur-sm'>
                    <div className='text-2xl font-bold text-purple-400'>
                      {aiMetrics.systemEfficiency}%
                    </div>
                    <div className='text-sm text-white/70'>AI Efficiency</div>
                  </div>
                  <div className='rounded-lg border border-orange-500/20 bg-orange-500/10 p-4 text-center backdrop-blur-sm'>
                    <div className='text-2xl font-bold text-orange-400'>
                      {aiMetrics.totalDecisions}
                    </div>
                    <div className='text-sm text-white/70'>AI Decisions</div>
                  </div>
                </div>

                <div className='mt-6 rounded-lg border border-purple-500/30 bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-4 backdrop-blur-sm'>
                  <div className='mb-2 flex items-center gap-2'>
                    <Zap className='h-4 w-4 text-purple-400' />
                    <span className='font-semibold text-white'>AI Status</span>
                  </div>
                  <p className='text-sm text-white/80'>
                    Smart task prioritization is analyzing{' '}
                    {aiMetrics.activeOperations} operations and optimizing
                    dispatch decisions in real-time.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Recruiting AI Tab */}
          <TabsContent value='recruiting' className='space-y-6'>
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='mb-6 flex items-center gap-3'>
                <UserPlus className='h-6 w-6 text-orange-400' />
                <h3 className='text-lg font-semibold text-white'>
                  AI-Powered Recruiting Platform
                </h3>
              </div>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <div className='rounded-lg border border-orange-500/20 bg-orange-500/10 p-6 text-center backdrop-blur-sm'>
                  <div className='text-3xl font-bold text-orange-400'>
                    {aiMetrics.recruitingStats.leadsToday}
                  </div>
                  <div className='mb-2 text-sm text-white/70'>Leads Today</div>
                  <div className='inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300'>
                    Generated
                  </div>
                </div>
                <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-6 text-center backdrop-blur-sm'>
                  <div className='text-3xl font-bold text-green-400'>
                    {aiMetrics.recruitingStats.qualificationRate.toFixed(1)}%
                  </div>
                  <div className='mb-2 text-sm text-white/70'>
                    Qualification Rate
                  </div>
                  <div className='inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300'>
                    AI Qualified
                  </div>
                </div>
                <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-6 text-center backdrop-blur-sm'>
                  <div className='text-3xl font-bold text-blue-400'>
                    {aiMetrics.recruitingStats.hireRate.toFixed(1)}%
                  </div>
                  <div className='mb-2 text-sm text-white/70'>
                    Hire Success Rate
                  </div>
                  <div className='inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300'>
                    Optimized
                  </div>
                </div>
              </div>

              <div className='mt-6 rounded-lg border border-yellow-500/30 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4 backdrop-blur-sm'>
                <h3 className='mb-3 text-lg font-semibold text-white'>
                  AI Recruiting Intelligence
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Target className='h-4 w-4 text-orange-400' />
                      <span className='text-sm text-white/80'>
                        Automated Lead Generation
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Brain className='h-4 w-4 text-green-400' />
                      <span className='text-sm text-white/80'>
                        Candidate Scoring
                      </span>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4 text-blue-400' />
                      <span className='text-sm text-white/80'>
                        Multi-channel Outreach
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4 text-purple-400' />
                      <span className='text-sm text-white/80'>
                        Performance Tracking
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Customer Success Platform (CRM) Tab */}
          <TabsContent value='customer-success' className='space-y-6'>
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='mb-6 flex items-center gap-3'>
                <Heart className='h-6 w-6 text-pink-400' />
                <h3 className='text-lg font-semibold text-white'>
                  AI Customer Success Platform
                </h3>
              </div>

              <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <div className='rounded-lg border border-pink-500/20 bg-pink-500/10 p-6 text-center backdrop-blur-sm'>
                  <div className='text-3xl font-bold text-pink-400'>
                    {aiMetrics.customerStats.totalContacts}
                  </div>
                  <div className='mb-2 text-sm text-white/70'>
                    Total Contacts
                  </div>
                  <div className='inline-block rounded-full bg-pink-500/20 px-3 py-1 text-xs font-medium text-pink-300'>
                    Active Pipeline
                  </div>
                </div>
                <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-6 text-center backdrop-blur-sm'>
                  <div className='text-3xl font-bold text-green-400'>
                    {formatCurrency(aiMetrics.customerStats.pipelineValue)}
                  </div>
                  <div className='mb-2 text-sm text-white/70'>
                    Pipeline Value
                  </div>
                  <div className='inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300'>
                    Revenue
                  </div>
                </div>
                <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-6 text-center backdrop-blur-sm'>
                  <div className='text-3xl font-bold text-blue-400'>
                    {aiMetrics.customerStats.conversionRate.toFixed(1)}%
                  </div>
                  <div className='mb-2 text-sm text-white/70'>
                    Conversion Rate
                  </div>
                  <div className='inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300'>
                    AI Optimized
                  </div>
                </div>
              </div>

              <div className='mb-6 rounded-lg border border-purple-500/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-4 backdrop-blur-sm'>
                <h3 className='mb-3 text-lg font-semibold text-white'>
                  AI Customer Intelligence
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Brain className='h-4 w-4 text-pink-400' />
                      <span className='text-sm text-white/80'>
                        Relationship Intelligence
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4 text-green-400' />
                      <span className='text-sm text-white/80'>
                        Upselling Opportunities
                      </span>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Shield className='h-4 w-4 text-blue-400' />
                      <span className='text-sm text-white/80'>
                        Churn Prevention
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Target className='h-4 w-4 text-purple-400' />
                      <span className='text-sm text-white/80'>
                        Customer Success Scoring
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated CRM Dashboard */}
            <div className='rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm'>
              <CRMDashboard />
            </div>
          </TabsContent>

          {/* Scheduler AI Tab */}
          <TabsContent value='scheduler' className='space-y-6'>
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='mb-6 flex items-center gap-3'>
                <Calendar className='h-6 w-6 text-green-400' />
                <h3 className='text-lg font-semibold text-white'>
                  AI Scheduler & Appointment Intelligence
                </h3>
              </div>

              <div className='py-12 text-center'>
                <Calendar className='mx-auto mb-4 h-16 w-16 text-green-400' />
                <h3 className='mb-2 text-2xl font-bold text-green-400'>
                  Smart Scheduling Platform
                </h3>
                <p className='mb-4 text-white/70'>
                  AI-powered appointment setting and calendar optimization for
                  freight operations
                </p>
                <div className='mx-auto grid max-w-md grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-3 backdrop-blur-sm'>
                    <div className='font-semibold text-green-400'>
                      Automated Booking
                    </div>
                    <div className='text-sm text-white/70'>
                      AI schedules pickups & deliveries
                    </div>
                  </div>
                  <div className='rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 backdrop-blur-sm'>
                    <div className='font-semibold text-blue-400'>
                      Route Integration
                    </div>
                    <div className='text-sm text-white/70'>
                      Syncs with dispatch operations
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

          {/* AI Sales Assistant Tab - Native SalesAI Features */}
          <TabsContent value='ai-sales-assistant' className='space-y-6'>
            <AISalesAssistantDashboard />
          </TabsContent>

          {/* Services Sales Tab - REVENUE ENGINE */}
          <TabsContent value='services-sales' className='space-y-6'>
            <ServicesSalesDashboard />
          </TabsContent>

          {/* CRM Lead Manager Tab - INTERACTIVE CRM */}
          <TabsContent value='crm-manager' className='space-y-6'>
            <WorkingCRMDashboard />
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

          {/* AI Sales Intelligence Hub Tab */}
          <TabsContent value='sales-intelligence' className='space-y-6'>
            <AISalesIntelligenceHub />
          </TabsContent>

          {/* TruckingPlanet Intelligence Tab */}
          <TabsContent value='truckingplanet-intel' className='space-y-6'>
            <TruckingPlanetIntelligence />
          </TabsContent>

          {/* AI Load Booking Tab */}
          <TabsContent value='ai-load-booking' className='space-y-6'>
            <AILoadBookingHub />
          </TabsContent>

          {/* Smart Load Network Tab */}
          <TabsContent value='smart-load-network' className='space-y-6'>
            <SmartLoadNetworkDashboard />
          </TabsContent>

          {/* WARP Smart Bidding Tab */}
          <TabsContent value='warp-smart-bidding' className='space-y-6'>
            <WARPSmartBiddingDashboard />
          </TabsContent>

          {/* Advanced 3PL Tab */}
          <TabsContent value='advanced-3pl' className='space-y-6'>
            <Advanced3PLDashboard />
          </TabsContent>

          {/* Subscription Manager Tab */}
          <TabsContent value='subscription-manager' className='space-y-6'>
            {subscriptionLoading ? (
              <div className='flex items-center justify-center p-8'>
                <div className='text-center'>
                  <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
                  <p className='text-gray-600'>
                    Loading Subscription Management...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Subscription Overview Cards */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  <Card className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-green-100'>
                            Monthly Recurring Revenue
                          </p>
                          <p className='text-2xl font-bold'>
                            {formatCurrency(
                              subscriptionData?.totalRevenue || 0
                            )}
                          </p>
                        </div>
                        <DollarSign className='h-8 w-8 text-green-200' />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-blue-100'>
                            Active Subscribers
                          </p>
                          <p className='text-2xl font-bold'>
                            {subscriptionData?.activeUsers || 0}
                          </p>
                        </div>
                        <Users className='h-8 w-8 text-blue-200' />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-purple-100'>
                            Growth Rate
                          </p>
                          <p className='text-2xl font-bold'>
                            +{subscriptionData?.growthRate || 0}%
                          </p>
                        </div>
                        <TrendingUp className='h-8 w-8 text-purple-200' />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-orange-100'>
                            Churn Rate
                          </p>
                          <p className='text-2xl font-bold'>
                            {subscriptionData?.churnRate || 0}%
                          </p>
                        </div>
                        <Activity className='h-8 w-8 text-orange-200' />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription Management Dashboard */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  {/* Active Subscriptions */}
                  <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Users className='h-5 w-5 text-blue-600' />
                        Active Subscriptions by Tier
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {subscriptionData?.analytics?.tierDistribution?.map(
                          (tier: any, index: number) => (
                            <div
                              key={index}
                              className='flex items-center justify-between rounded-lg border p-3'
                            >
                              <div className='flex items-center gap-3'>
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    tier.name === 'Enterprise Professional'
                                      ? 'bg-purple-500'
                                      : tier.name === 'Professional Brokerage'
                                        ? 'bg-blue-500'
                                        : tier.name ===
                                            'Professional Dispatcher'
                                          ? 'bg-green-500'
                                          : 'bg-gray-500'
                                  }`}
                                />
                                <div>
                                  <div className='font-medium'>{tier.name}</div>
                                  <div className='text-sm text-gray-600'>
                                    {formatCurrency(tier.monthlyValue)} per user
                                  </div>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='text-xl font-bold text-blue-600'>
                                  {tier.subscribers}
                                </div>
                                <div className='text-sm text-gray-600'>
                                  subscribers
                                </div>
                              </div>
                            </div>
                          )
                        ) || (
                          <div className='py-8 text-center text-gray-500'>
                            Loading subscription data...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI-Powered Subscription Analytics */}
                  <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Brain className='h-5 w-5 text-purple-600' />
                        AI Subscription Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div className='rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
                          <div className='mb-3 flex items-center gap-2'>
                            <Target className='h-4 w-4 text-blue-600' />
                            <span className='font-semibold text-blue-600'>
                              Revenue Optimization
                            </span>
                          </div>
                          <p className='text-sm text-gray-600'>
                            AI analysis shows 23% potential revenue increase
                            through targeted upselling and reduced churn
                            prevention strategies.
                          </p>
                        </div>

                        <div className='rounded-lg bg-gradient-to-r from-green-50 to-teal-50 p-4'>
                          <div className='mb-3 flex items-center gap-2'>
                            <TrendingUp className='h-4 w-4 text-green-600' />
                            <span className='font-semibold text-green-600'>
                              Growth Predictions
                            </span>
                          </div>
                          <p className='text-sm text-gray-600'>
                            Predictive models forecast 187% subscriber growth
                            over next 12 months based on current market trends
                            and platform adoption.
                          </p>
                        </div>

                        <div className='rounded-lg bg-gradient-to-r from-orange-50 to-red-50 p-4'>
                          <div className='mb-3 flex items-center gap-2'>
                            <Shield className='h-4 w-4 text-orange-600' />
                            <span className='font-semibold text-orange-600'>
                              Churn Risk Analysis
                            </span>
                          </div>
                          <p className='text-sm text-gray-600'>
                            12 subscribers identified at high churn risk.
                            Automated retention campaigns scheduled with
                            personalized offers.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Subscription Actions */}
                <Card className='border border-gray-200 bg-white/80 backdrop-blur-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Zap className='h-5 w-5 text-yellow-600' />
                      AI-Powered Subscription Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                      <button
                        className='rounded-lg border p-4 text-left transition-colors hover:bg-blue-50'
                        onClick={async () => {
                          await fleetFlowNotificationManager.createNotification(
                            {
                              type: 'workflow_update',
                              priority: 'high',
                              title: '💰 Automated Upsell Campaign Initiated',
                              message:
                                'AI has identified 34 subscribers eligible for Enterprise upgrade based on usage patterns',
                              channels: {
                                inApp: true,
                                email: true,
                                sms: false,
                                push: false,
                              },
                              targetPortals: ['admin'],
                              metadata: {
                                source: 'subscription_ai',
                                campaign: 'upsell_automation',
                              },
                            }
                          );
                        }}
                      >
                        <div className='mb-2 flex items-center gap-3'>
                          <TrendingUp className='h-5 w-5 text-blue-600' />
                          <span className='font-medium'>
                            Launch Upsell Campaign
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          AI-generated personalized upgrade offers for
                          high-usage customers
                        </p>
                      </button>

                      <button
                        className='rounded-lg border p-4 text-left transition-colors hover:bg-green-50'
                        onClick={async () => {
                          await fleetFlowNotificationManager.createNotification(
                            {
                              type: 'workflow_update',
                              priority: 'high',
                              title: '🛡️ Churn Prevention Activated',
                              message:
                                'AI retention system engaged for 12 at-risk subscribers with personalized retention offers',
                              channels: {
                                inApp: true,
                                email: true,
                                sms: false,
                                push: false,
                              },
                              targetPortals: ['admin'],
                              metadata: {
                                source: 'subscription_ai',
                                campaign: 'churn_prevention',
                              },
                            }
                          );
                        }}
                      >
                        <div className='mb-2 flex items-center gap-3'>
                          <Shield className='h-5 w-5 text-green-600' />
                          <span className='font-medium'>
                            Activate Retention AI
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Automated churn prevention with intelligent
                          intervention strategies
                        </p>
                      </button>

                      <button
                        className='rounded-lg border p-4 text-left transition-colors hover:bg-purple-50'
                        onClick={async () => {
                          await fleetFlowNotificationManager.createNotification(
                            {
                              type: 'payment_alert',
                              priority: 'normal',
                              title: '📊 Subscription Analytics Updated',
                              message:
                                'Monthly subscription performance report generated with AI insights and recommendations',
                              channels: {
                                inApp: true,
                                email: true,
                                sms: false,
                                push: false,
                              },
                              targetPortals: ['admin'],
                              metadata: {
                                source: 'subscription_ai',
                                type: 'monthly_report',
                              },
                            }
                          );
                        }}
                      >
                        <div className='mb-2 flex items-center gap-3'>
                          <BarChart3 className='h-5 w-5 text-purple-600' />
                          <span className='font-medium'>
                            Generate AI Report
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Comprehensive analytics with predictive insights and
                          recommendations
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* ThomasNet Manufacturer Intelligence Tab */}
          <TabsContent value='thomasnet-intelligence' className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* ThomasNet Overview */}
              <Card className='border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-orange-800'>
                    <Building2 className='h-5 w-5' />
                    ThomasNet Manufacturer Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-orange-600'>
                          500K+
                        </div>
                        <div className='text-sm text-gray-600'>
                          Manufacturers
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-orange-600'>
                          67K+
                        </div>
                        <div className='text-sm text-gray-600'>
                          Product Categories
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-orange-100 p-3'>
                      <span className='text-sm font-medium text-orange-800'>
                        AI Freight Scoring
                      </span>
                      <Badge className='bg-green-100 text-green-800'>
                        75+ Threshold
                      </Badge>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-green-500'></div>
                        <span className='text-sm'>
                          AI-Powered Lead Analysis
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                        <span className='text-sm'>
                          Revenue Estimation Engine
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                        <span className='text-sm'>
                          Industry-specific Targeting
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Intelligence Dashboard */}
              <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-blue-800'>
                    <TrendingUp className='h-5 w-5' />
                    Manufacturing Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-3'>
                      {[
                        {
                          industry: 'Automotive',
                          score: 92,
                          volume: '$2.3M',
                          trend: '↗️',
                        },
                        {
                          industry: 'Electronics',
                          score: 88,
                          volume: '$1.8M',
                          trend: '↗️',
                        },
                        {
                          industry: 'Machinery',
                          score: 85,
                          volume: '$1.5M',
                          trend: '→',
                        },
                        {
                          industry: 'Chemicals',
                          score: 79,
                          volume: '$1.2M',
                          trend: '↘️',
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between rounded-lg bg-blue-50 p-3'
                        >
                          <div className='flex items-center gap-3'>
                            <span className='text-2xl'>{item.trend}</span>
                            <div>
                              <div className='font-medium text-blue-900'>
                                {item.industry}
                              </div>
                              <div className='text-sm text-blue-600'>
                                Score: {item.score}/100
                              </div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='font-bold text-blue-800'>
                              {item.volume}
                            </div>
                            <div className='text-sm text-blue-600'>
                              Est. Volume
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Processing Pipeline */}
              <Card className='lg:col-span-2'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Brain className='h-5 w-5 text-purple-600' />
                    AI-Powered ThomasNet Processing Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {[
                      {
                        step: '1',
                        title: 'Data Ingestion',
                        desc: 'CSV import & parsing',
                        icon: '📄',
                        status: 'active',
                      },
                      {
                        step: '2',
                        title: 'AI Analysis',
                        desc: 'Freight scoring & revenue estimation',
                        icon: '🤖',
                        status: 'active',
                      },
                      {
                        step: '3',
                        title: 'Lead Qualification',
                        desc: '75+ score threshold filtering',
                        icon: '🎯',
                        status: 'active',
                      },
                      {
                        step: '4',
                        title: 'Sales Integration',
                        desc: 'CRM & outreach automation',
                        icon: '📞',
                        status: 'ready',
                      },
                    ].map((step, index) => (
                      <div
                        key={index}
                        className='rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4'
                      >
                        <div className='mb-3 flex items-center gap-2'>
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                              step.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {step.step}
                          </div>
                          <span className='text-2xl'>{step.icon}</span>
                        </div>
                        <h4 className='mb-2 font-semibold text-gray-900'>
                          {step.title}
                        </h4>
                        <p className='text-sm text-gray-600'>{step.desc}</p>
                        <div className='mt-2'>
                          <Badge
                            className={
                              step.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {step.status === 'active'
                              ? '✅ Active'
                              : '⚡ Ready'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className='mt-6 flex flex-wrap gap-3'>
                    <button className='flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700'>
                      <Building2 className='h-4 w-4' />
                      Process ThomasNet CSV
                    </button>
                    <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                      <TrendingUp className='h-4 w-4' />
                      Run Market Analysis
                    </button>
                    <button className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'>
                      <Phone className='h-4 w-4' />
                      Start Outreach Campaign
                    </button>
                    <button className='flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'>
                      <Eye className='h-4 w-4' />
                      View Lead Generation
                    </button>
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
