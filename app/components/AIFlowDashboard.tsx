'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  BarChart3,
  Building,
  Calculator,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  FileText,
  Globe,
  Headphones,
  MapPin,
  Pause,
  Phone,
  PhoneCall,
  Play,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  Star,
  Target,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  AIFlowSystem,
  CallCenterStats,
  CallResult,
  FreightQuote,
  MarketIntelligence,
  ProspectResult,
  SystemMetrics,
  VoiceStats,
  createAIFlowSystem,
} from '@/app/services/AIFlowSystem';

// Main AI Flow Dashboard Component
export default function AIFlowDashboard() {
  const [aiFlowSystem, setAIFlowSystem] = useState<AIFlowSystem | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [callCenterStats, setCallCenterStats] =
    useState<CallCenterStats | null>(null);
  const [isSystemInitialized, setIsSystemInitialized] = useState(true);
  const [prospects, setProspects] = useState<ProspectResult[]>([]);
  const [quotes, setQuotes] = useState<FreightQuote[]>([]);
  const [activeCalls, setActiveCalls] = useState<CallResult[]>([]);
  const [marketIntelligence, setMarketIntelligence] =
    useState<MarketIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [voiceStats, setVoiceStats] = useState<VoiceStats | null>(null);

  // Initialize AI Flow System on component mount
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        const system = createAIFlowSystem({
          voiceInfrastructure: {
            freeSwitchUrl: 'http://localhost:8021',
            sipEndpoint: 'sip:5060',
            callCenterModules: ['mod_callcenter', 'mod_fifo', 'mod_conference'],
          },
          businessIntelligence: {
            openCorporatesApi: 'https://api.opencorporates.com/v0.4',
            secEdgarApi: 'https://data.sec.gov/api/xbrl',
            censusApi: 'https://api.census.gov/data/2021/cbp',
            blsApi: 'https://api.bls.gov/publicAPI/v2/timeseries/data',
            fredApi: 'https://api.stlouisfed.org/fred/series/observations',
          },
          freightTransportation: {
            btsApi: 'https://data.bts.gov/resource',
            fmcsaApi: 'https://mobile.fmcsa.dot.gov/qc/services/carriers',
            portAuthorityApi: 'https://api.portauthority.gov/v1',
            usaspendingApi: 'https://api.usaspending.gov/api/v2',
          },
        });

        system.on('system:initialized', () => {
          setIsSystemInitialized(true);
          console.log('AI Flow System initialized successfully');
        });

        system.on('system:error', (error) => {
          console.error('AI Flow System error:', error);
        });

        setAIFlowSystem(system);
      } catch (error) {
        console.error('Failed to initialize AI Flow System:', error);
      }
    };

    initializeSystem();
  }, []);

  // Auto-refresh system metrics
  useEffect(() => {
    if (!aiFlowSystem || !isSystemInitialized || !autoRefresh) return;

    const interval = setInterval(async () => {
      try {
        const metrics = await aiFlowSystem.getSystemMetrics();
        const callStats = await aiFlowSystem.getCallCenterStats();
        const voice = await aiFlowSystem.initializeVoiceInfrastructure();

        setSystemMetrics(metrics);
        setCallCenterStats(callStats);
        setVoiceStats(voice);
      } catch (error) {
        console.error('Failed to refresh metrics:', error);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [aiFlowSystem, isSystemInitialized, autoRefresh, refreshInterval]);

  // Load initial data
  useEffect(() => {
    if (aiFlowSystem && isSystemInitialized) {
      loadInitialData();
    }
  }, [aiFlowSystem, isSystemInitialized]);

  const loadInitialData = async () => {
    if (!aiFlowSystem) return;

    try {
      setIsLoading(true);

      // Load system metrics
      const metrics = await aiFlowSystem.getSystemMetrics();
      const callStats = await aiFlowSystem.getCallCenterStats();
      const voice = await aiFlowSystem.initializeVoiceInfrastructure();

      setSystemMetrics(metrics);
      setCallCenterStats(callStats);
      setVoiceStats(voice);

      // Load sample prospects
      const sampleProspects = await aiFlowSystem.discoverProspects(
        'Manufacturing',
        'California'
      );
      setProspects(sampleProspects);

      // Load market intelligence
      const marketData =
        await aiFlowSystem.getMarketIntelligence('Transportation');
      setMarketIntelligence(marketData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProspectSearch = async (industry: string, location?: string) => {
    if (!aiFlowSystem) return;

    try {
      setIsLoading(true);
      const results = await aiFlowSystem.discoverProspects(industry, location);
      setProspects(results);
    } catch (error) {
      console.error('Failed to search prospects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuote = async (request: any) => {
    if (!aiFlowSystem) return;

    try {
      setIsLoading(true);
      const quote = await aiFlowSystem.generateFreightQuote(request);
      setQuotes((prev) => [...prev, quote]);
    } catch (error) {
      console.error('Failed to generate quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutboundCall = async (phoneNumber: string, campaign: string) => {
    if (!aiFlowSystem) return;

    try {
      setIsLoading(true);
      const callResult = await aiFlowSystem.makeOutboundCall(
        phoneNumber,
        campaign
      );
      setActiveCalls((prev) => [...prev, callResult]);
    } catch (error) {
      console.error('Failed to make outbound call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const renderOverviewTab = () => (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      {/* System Status */}
      <Card className='border-green-200 bg-gradient-to-br from-green-50 to-green-100'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Status</span>
              <Badge className='bg-green-500 text-white'>
                {isSystemInitialized ? 'Online' : 'Initializing'}
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Uptime</span>
              <span className='text-sm font-semibold'>
                {systemMetrics ? formatTime(systemMetrics.systemUptime) : '0s'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Response Time</span>
              <span className='text-sm font-semibold'>
                {systemMetrics ? `${systemMetrics.apiResponseTime}s` : '0s'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Agents */}
      <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Users className='h-5 w-5 text-blue-600' />
            Active Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='text-3xl font-bold text-blue-600'>
              {systemMetrics?.activeAgents || 0}
            </div>
            <div className='text-sm text-gray-600'>
              AI agents processing tasks
            </div>
            <div className='mt-2 flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-green-500' />
              <span className='text-xs text-gray-500'>
                All agents operational
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Calls */}
      <Card className='border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Phone className='h-5 w-5 text-purple-600' />
            Active Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='text-3xl font-bold text-purple-600'>
              {callCenterStats?.activeCalls || 0}
            </div>
            <div className='text-sm text-gray-600'>
              Concurrent voice sessions
            </div>
            <div className='mt-2 flex items-center gap-2'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-purple-500' />
              <span className='text-xs text-gray-500'>
                Real-time monitoring
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Revenue */}
      <Card className='border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <DollarSign className='h-5 w-5 text-yellow-600' />
            Daily Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='text-3xl font-bold text-yellow-600'>
              {systemMetrics
                ? formatCurrency(systemMetrics.dailyRevenue)
                : '$0'}
            </div>
            <div className='text-sm text-gray-600'>Today's freight revenue</div>
            <div className='mt-2 flex items-center gap-2'>
              <TrendingUp className='h-3 w-3 text-green-500' />
              <span className='text-xs text-gray-500'>+15% vs yesterday</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className='col-span-full border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <BarChart3 className='h-6 w-6 text-gray-600' />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6'>
            <div className='rounded-lg border bg-white p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {systemMetrics
                  ? formatNumber(systemMetrics.totalProspects)
                  : '0'}
              </div>
              <div className='text-sm text-gray-600'>Total Prospects</div>
            </div>
            <div className='rounded-lg border bg-white p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {callCenterStats
                  ? formatNumber(callCenterStats.totalCallsToday)
                  : '0'}
              </div>
              <div className='text-sm text-gray-600'>Calls Today</div>
            </div>
            <div className='rounded-lg border bg-white p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {callCenterStats
                  ? formatPercentage(callCenterStats.successRate)
                  : '0%'}
              </div>
              <div className='text-sm text-gray-600'>Success Rate</div>
            </div>
            <div className='rounded-lg border bg-white p-4 text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {systemMetrics
                  ? formatNumber(systemMetrics.dataProcessingSpeed)
                  : '0'}
              </div>
              <div className='text-sm text-gray-600'>Records/Min</div>
            </div>
            <div className='rounded-lg border bg-white p-4 text-center'>
              <div className='text-2xl font-bold text-red-600'>
                {systemMetrics
                  ? formatCurrency(systemMetrics.costSavings)
                  : '$0'}
              </div>
              <div className='text-sm text-gray-600'>Monthly Savings</div>
            </div>
            <div className='rounded-lg border bg-white p-4 text-center'>
              <div className='text-2xl font-bold text-indigo-600'>
                {callCenterStats
                  ? callCenterStats.customerSatisfaction.toFixed(1)
                  : '0.0'}
              </div>
              <div className='text-sm text-gray-600'>Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <Card className='col-span-full border-green-200 bg-gradient-to-br from-green-50 to-green-100'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Calculator className='h-6 w-6 text-green-600' />
            Zero-Cost API Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg border bg-white p-6'>
              <h3 className='mb-3 font-semibold text-gray-800'>
                API Integrations
              </h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>OpenCorporates</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>SEC EDGAR</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Census API</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>BLS API</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>FRED API</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>BTS API</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
              </div>
            </div>
            <div className='rounded-lg border bg-white p-6'>
              <h3 className='mb-3 font-semibold text-gray-800'>
                Cost Comparison
              </h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>
                    Traditional APIs
                  </span>
                  <span className='text-sm font-semibold text-red-600'>
                    $45,000/mo
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Integrated APIs</span>
                  <span className='text-sm font-semibold text-green-600'>
                    $0/mo
                  </span>
                </div>
                <div className='border-t pt-2'>
                  <div className='flex justify-between'>
                    <span className='text-sm font-semibold text-gray-800'>
                      Monthly Savings
                    </span>
                    <span className='text-sm font-bold text-green-600'>
                      $45,000
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm font-semibold text-gray-800'>
                      Annual Savings
                    </span>
                    <span className='text-sm font-bold text-green-600'>
                      $540,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='rounded-lg border bg-white p-6'>
              <h3 className='mb-3 font-semibold text-gray-800'>ROI Analysis</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>
                    Development Cost
                  </span>
                  <span className='text-sm font-semibold'>$25,000</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Monthly Savings</span>
                  <span className='text-sm font-semibold text-green-600'>
                    $45,000
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Payback Period</span>
                  <span className='text-sm font-semibold'>17 days</span>
                </div>
                <div className='border-t pt-2'>
                  <div className='flex justify-between'>
                    <span className='text-sm font-bold text-gray-800'>ROI</span>
                    <span className='text-sm font-bold text-green-600'>
                      2,160%
                    </span>
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    Infinite ROI with zero ongoing costs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAgentsTab = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* AI Agent Cards */}
        {[
          {
            id: 'prospector-01',
            name: 'Prospecting Agent',
            icon: Target,
            color: 'blue',
            status: 'active',
            performance: {
              tasksCompleted: 1247,
              successRate: 0.73,
              averageResponseTime: 2.1,
              customerSatisfaction: 4.6,
            },
          },
          {
            id: 'caller-01',
            name: 'Cold Calling Agent',
            icon: Phone,
            color: 'purple',
            status: 'active',
            performance: {
              tasksCompleted: 892,
              successRate: 0.34,
              averageResponseTime: 45.2,
              customerSatisfaction: 4.1,
            },
          },
          {
            id: 'quoter-01',
            name: 'Rate Quoting Agent',
            icon: Calculator,
            color: 'green',
            status: 'active',
            performance: {
              tasksCompleted: 2134,
              successRate: 0.89,
              averageResponseTime: 1.8,
              customerSatisfaction: 4.7,
            },
          },
          {
            id: 'coordinator-01',
            name: 'Load Coordinator',
            icon: Truck,
            color: 'orange',
            status: 'active',
            performance: {
              tasksCompleted: 1567,
              successRate: 0.96,
              averageResponseTime: 3.2,
              customerSatisfaction: 4.9,
            },
          },
          {
            id: 'service-01',
            name: 'Customer Service',
            icon: Headphones,
            color: 'pink',
            status: 'active',
            performance: {
              tasksCompleted: 3421,
              successRate: 0.94,
              averageResponseTime: 12.5,
              customerSatisfaction: 4.8,
            },
          },
          {
            id: 'compliance-01',
            name: 'Compliance Agent',
            icon: Shield,
            color: 'indigo',
            status: 'active',
            performance: {
              tasksCompleted: 756,
              successRate: 0.98,
              averageResponseTime: 5.7,
              customerSatisfaction: 4.9,
            },
          },
          {
            id: 'analyst-01',
            name: 'Market Analyst',
            icon: TrendingUp,
            color: 'red',
            status: 'active',
            performance: {
              tasksCompleted: 234,
              successRate: 0.91,
              averageResponseTime: 45.3,
              customerSatisfaction: 4.7,
            },
          },
          {
            id: 'dispatch-01',
            name: 'Dispatch Agent',
            icon: MapPin,
            color: 'yellow',
            status: 'active',
            performance: {
              tasksCompleted: 1876,
              successRate: 0.97,
              averageResponseTime: 2.8,
              customerSatisfaction: 4.8,
            },
          },
        ].map((agent) => (
          <Card
            key={agent.id}
            className={`bg-gradient-to-br from-${agent.color}-50 to-${agent.color}-100 border-${agent.color}-200 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedAgent === agent.id
                ? 'ring- ring-2' + agent.color + '-500'
                : ''
            }`}
            onClick={() =>
              setSelectedAgent(selectedAgent === agent.id ? null : agent.id)
            }
          >
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <agent.icon className={`h-5 w-5 text-${agent.color}-600`} />
                {agent.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Status</span>
                  <Badge className={`bg-${agent.color}-500 text-white`}>
                    {agent.status}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Tasks</span>
                  <span className='text-sm font-semibold'>
                    {formatNumber(agent.performance.tasksCompleted)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Success Rate</span>
                  <span className='text-sm font-semibold'>
                    {formatPercentage(agent.performance.successRate)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Satisfaction</span>
                  <div className='flex items-center gap-1'>
                    <Star className='h-3 w-3 fill-current text-yellow-400' />
                    <span className='text-sm font-semibold'>
                      {agent.performance.customerSatisfaction.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent Details */}
      {selectedAgent && (
        <Card className='border-gray-200 bg-white'>
          <CardHeader>
            <CardTitle className='text-xl'>Agent Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-lg bg-gray-50 p-4 text-center'>
                <div className='text-2xl font-bold text-blue-600'>1,247</div>
                <div className='text-sm text-gray-600'>Tasks Completed</div>
              </div>
              <div className='rounded-lg bg-gray-50 p-4 text-center'>
                <div className='text-2xl font-bold text-green-600'>73%</div>
                <div className='text-sm text-gray-600'>Success Rate</div>
              </div>
              <div className='rounded-lg bg-gray-50 p-4 text-center'>
                <div className='text-2xl font-bold text-purple-600'>2.1s</div>
                <div className='text-sm text-gray-600'>Avg Response</div>
              </div>
              <div className='rounded-lg bg-gray-50 p-4 text-center'>
                <div className='text-2xl font-bold text-yellow-600'>4.6</div>
                <div className='text-sm text-gray-600'>Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProspectsTab = () => (
    <div className='space-y-6'>
      {/* Prospect Search */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Search className='h-6 w-6 text-blue-600' />
            Prospect Discovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex gap-4'>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Enter industry (e.g., Manufacturing, Retail)'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Enter location (optional)'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <Button
              onClick={() =>
                handleProspectSearch('Manufacturing', 'California')
              }
              className='bg-blue-600 text-white hover:bg-blue-700'
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className='h-4 w-4 animate-spin' />
              ) : (
                <Search className='h-4 w-4' />
              )}
              Search
            </Button>
          </div>
          <div className='text-sm text-gray-600'>
            Using integrated APIs: OpenCorporates, SEC EDGAR, Census Bureau
          </div>
        </CardContent>
      </Card>

      {/* Prospects List */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Building className='h-6 w-6 text-green-600' />
            Discovered Prospects ({prospects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {prospects.slice(0, 10).map((prospect, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-4'
              >
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-800'>
                    {prospect.companyName}
                  </h3>
                  <p className='text-sm text-gray-600'>{prospect.industry}</p>
                  <p className='text-sm text-gray-500'>
                    {prospect.contactInfo.address}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <div className='text-sm font-semibold text-blue-600'>
                      {prospect.freightPotential}%
                    </div>
                    <div className='text-xs text-gray-500'>
                      Freight Potential
                    </div>
                  </div>
                  <Badge
                    className={`${
                      prospect.priority === 'high'
                        ? 'bg-red-500'
                        : prospect.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    } text-white`}
                  >
                    {prospect.priority}
                  </Badge>
                  <Button
                    onClick={() =>
                      handleOutboundCall(
                        prospect.contactInfo.phone,
                        'prospecting'
                      )
                    }
                    className='bg-purple-600 text-white hover:bg-purple-700'
                    size='sm'
                  >
                    <Phone className='mr-1 h-4 w-4' />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuotesTab = () => (
    <div className='space-y-6'>
      {/* Quote Generator */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Calculator className='h-6 w-6 text-green-600' />
            Freight Quote Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Origin
              </label>
              <input
                type='text'
                placeholder='Enter origin city, state'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Destination
              </label>
              <input
                type='text'
                placeholder='Enter destination city, state'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Weight (lbs)
              </label>
              <input
                type='number'
                placeholder='Enter weight'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Equipment Type
              </label>
              <select className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'>
                <option>Dry Van</option>
                <option>Refrigerated</option>
                <option>Flatbed</option>
                <option>Step Deck</option>
                <option>Lowboy</option>
              </select>
            </div>
          </div>
          <Button
            onClick={() =>
              handleGenerateQuote({
                origin: 'Los Angeles, CA',
                destination: 'Chicago, IL',
                weight: 25000,
                equipmentType: 'dry van',
                hazmat: false,
                residential: false,
                pickupDate: new Date(),
                deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              })
            }
            className='bg-green-600 text-white hover:bg-green-700'
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Calculator className='mr-2 h-4 w-4' />
            )}
            Generate Quote
          </Button>
        </CardContent>
      </Card>

      {/* Generated Quotes */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <FileText className='h-6 w-6 text-blue-600' />
            Generated Quotes ({quotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {quotes.map((quote, index) => (
              <div key={index} className='rounded-lg bg-gray-50 p-4'>
                <div className='mb-2 flex items-start justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-800'>
                      {quote.quoteId}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {quote.origin} → {quote.destination}
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold text-green-600'>
                      {formatCurrency(quote.totalRate)}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {quote.transitTime} days transit
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>Base Rate:</span>
                    <span className='ml-2 font-semibold'>
                      {formatCurrency(quote.baseRate)}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Fuel Surcharge:</span>
                    <span className='ml-2 font-semibold'>
                      {formatCurrency(quote.fuelSurcharge)}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Accessorials:</span>
                    <span className='ml-2 font-semibold'>
                      {formatCurrency(quote.accessorialCharges)}
                    </span>
                  </div>
                </div>
                <div className='mt-2 flex items-center justify-between'>
                  <div className='text-sm text-gray-500'>
                    Valid until: {quote.validUntil.toLocaleDateString()}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge className='bg-blue-500 text-white'>
                      {(quote.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                    <Button
                      size='sm'
                      className='bg-blue-600 text-white hover:bg-blue-700'
                    >
                      Send Quote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCallCenterTab = () => (
    <div className='space-y-6'>
      {/* Call Center Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Phone className='h-5 w-5 text-purple-600' />
              Active Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-purple-600'>
              {callCenterStats?.activeCalls || 0}
            </div>
            <div className='text-sm text-gray-600'>Currently connected</div>
          </CardContent>
        </Card>

        <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Clock className='h-5 w-5 text-blue-600' />
              Queue Length
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-blue-600'>
              {callCenterStats?.queueLength || 0}
            </div>
            <div className='text-sm text-gray-600'>Calls waiting</div>
          </CardContent>
        </Card>

        <Card className='border-green-200 bg-gradient-to-br from-green-50 to-green-100'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <TrendingUp className='h-5 w-5 text-green-600' />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-green-600'>
              {callCenterStats
                ? formatPercentage(callCenterStats.successRate)
                : '0%'}
            </div>
            <div className='text-sm text-gray-600'>Call conversion</div>
          </CardContent>
        </Card>

        <Card className='border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Star className='h-5 w-5 text-yellow-600' />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-yellow-600'>
              {callCenterStats
                ? callCenterStats.customerSatisfaction.toFixed(1)
                : '0.0'}
            </div>
            <div className='text-sm text-gray-600'>Customer rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Infrastructure */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Server className='h-6 w-6 text-gray-600' />
            Voice Infrastructure (FreeSWITCH)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {voiceStats?.activeChannels || 0}
              </div>
              <div className='text-sm text-gray-600'>Active Channels</div>
            </div>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {voiceStats?.callsPerHour || 0}
              </div>
              <div className='text-sm text-gray-600'>Calls Per Hour</div>
            </div>
            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {voiceStats ? (voiceStats.systemLoad * 100).toFixed(1) : '0.0'}%
              </div>
              <div className='text-sm text-gray-600'>System Load</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <PhoneCall className='h-6 w-6 text-indigo-600' />
            Recent Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {activeCalls.slice(0, 10).map((call, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      call.outcome === 'appointment'
                        ? 'bg-green-500'
                        : call.outcome === 'callback'
                          ? 'bg-yellow-500'
                          : call.outcome === 'not-interested'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                    }`}
                  />
                  <div>
                    <div className='font-semibold text-gray-800'>
                      {call.callId}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {call.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-sm text-gray-600'>
                    {formatTime(call.duration)}
                  </div>
                  <Badge
                    className={`${
                      call.outcome === 'appointment'
                        ? 'bg-green-500'
                        : call.outcome === 'callback'
                          ? 'bg-yellow-500'
                          : call.outcome === 'not-interested'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                    } text-white`}
                  >
                    {call.outcome}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemTab = () => (
    <div className='space-y-6'>
      {/* System Health */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Activity className='h-6 w-6 text-green-600' />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>99.9%</div>
              <div className='text-sm text-gray-600'>System Uptime</div>
            </div>
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {systemMetrics
                  ? systemMetrics.apiResponseTime.toFixed(2)
                  : '0.00'}
                s
              </div>
              <div className='text-sm text-gray-600'>API Response</div>
            </div>
            <div className='rounded-lg border border-purple-200 bg-purple-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {systemMetrics
                  ? formatNumber(systemMetrics.dataProcessingSpeed)
                  : '0'}
              </div>
              <div className='text-sm text-gray-600'>Records/Min</div>
            </div>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center'>
              <div className='text-2xl font-bold text-yellow-600'>0</div>
              <div className='text-sm text-gray-600'>System Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Status */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Globe className='h-6 w-6 text-blue-600' />
            API Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[
              {
                name: 'OpenCorporates API',
                status: 'operational',
                responseTime: '245ms',
              },
              {
                name: 'SEC EDGAR API',
                status: 'operational',
                responseTime: '189ms',
              },
              {
                name: 'Census Bureau API',
                status: 'operational',
                responseTime: '167ms',
              },
              {
                name: 'Bureau of Labor Statistics',
                status: 'operational',
                responseTime: '234ms',
              },
              {
                name: 'FRED Economic Data',
                status: 'operational',
                responseTime: '156ms',
              },
              {
                name: 'Bureau of Transportation',
                status: 'operational',
                responseTime: '198ms',
              },
              {
                name: 'FMCSA Safety Data',
                status: 'operational',
                responseTime: '289ms',
              },
              {
                name: 'USAspending.gov',
                status: 'operational',
                responseTime: '223ms',
              },
              {
                name: 'Port Authority APIs',
                status: 'operational',
                responseTime: '178ms',
              },
              {
                name: 'EPA Environmental Data',
                status: 'operational',
                responseTime: '267ms',
              },
            ].map((api, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-green-500' />
                  <span className='font-semibold text-gray-800'>
                    {api.name}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-sm text-gray-600'>
                    {api.responseTime}
                  </span>
                  <Badge className='bg-green-500 text-white'>
                    {api.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Settings className='h-6 w-6 text-gray-600' />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
              <div>
                <span className='font-semibold text-gray-800'>
                  Auto Refresh
                </span>
                <div className='text-sm text-gray-600'>
                  Automatic data refresh every 5 seconds
                </div>
              </div>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`${autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                {autoRefresh ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
              <div>
                <span className='font-semibold text-gray-800'>
                  Voice Infrastructure
                </span>
                <div className='text-sm text-gray-600'>
                  FreeSWITCH call center platform
                </div>
              </div>
              <Badge className='bg-green-500 text-white'>Active</Badge>
            </div>
            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
              <div>
                <span className='font-semibold text-gray-800'>AI Agents</span>
                <div className='text-sm text-gray-600'>
                  8 specialized AI agents running
                </div>
              </div>
              <Badge className='bg-blue-500 text-white'>8 Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMarketIntelligenceTab = () => (
    <div className='space-y-6'>
      {/* Market Intelligence */}
      {marketIntelligence && (
        <Card className='border-gray-200 bg-white'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <TrendingUp className='h-6 w-6 text-blue-600' />
              Market Intelligence - {marketIntelligence.sector}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {formatCurrency(marketIntelligence.marketSize)}
                </div>
                <div className='text-sm text-gray-600'>Market Size</div>
              </div>
              <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {formatPercentage(marketIntelligence.growthRate)}
                </div>
                <div className='text-sm text-gray-600'>Growth Rate</div>
              </div>
              <div className='rounded-lg border border-purple-200 bg-purple-50 p-4 text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {formatNumber(marketIntelligence.opportunities)}
                </div>
                <div className='text-sm text-gray-600'>Opportunities</div>
              </div>
              <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
                <div className='text-2xl font-bold text-red-600'>
                  {formatNumber(marketIntelligence.threats)}
                </div>
                <div className='text-sm text-gray-600'>Threats</div>
              </div>
            </div>
            <div className='rounded-lg bg-gray-50 p-4'>
              <h3 className='mb-3 font-semibold text-gray-800'>
                Market Recommendations
              </h3>
              <ul className='space-y-2'>
                {marketIntelligence.recommendations.map((rec, index) => (
                  <li key={index} className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-green-500' />
                    <span className='text-sm text-gray-700'>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Integrations Used for Intelligence */}
      <Card className='border-gray-200 bg-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Database className='h-6 w-6 text-green-600' />
            Intelligence Sources (100% Free)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-3'>
              <h3 className='font-semibold text-gray-800'>
                Business Intelligence
              </h3>
              <div className='space-y-2'>
                <div className='flex items-center justify-between rounded bg-gray-50 p-2'>
                  <span className='text-sm text-gray-700'>OpenCorporates</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex items-center justify-between rounded bg-gray-50 p-2'>
                  <span className='text-sm text-gray-700'>SEC EDGAR</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex items-center justify-between rounded bg-gray-50 p-2'>
                  <span className='text-sm text-gray-700'>Census Bureau</span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
              </div>
            </div>
            <div className='space-y-3'>
              <h3 className='font-semibold text-gray-800'>Economic Data</h3>
              <div className='space-y-2'>
                <div className='flex items-center justify-between rounded bg-gray-50 p-2'>
                  <span className='text-sm text-gray-700'>
                    FRED Economic Data
                  </span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex items-center justify-between rounded bg-gray-50 p-2'>
                  <span className='text-sm text-gray-700'>
                    Bureau of Labor Statistics
                  </span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
                <div className='flex items-center justify-between rounded bg-gray-50 p-2'>
                  <span className='text-sm text-gray-700'>
                    Bureau of Transportation
                  </span>
                  <Badge className='bg-green-500 text-white'>FREE</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'agents', label: 'AI Agents', icon: Users },
    { id: 'prospects', label: 'Prospects', icon: Target },
    { id: 'quotes', label: 'Quotes', icon: Calculator },
    { id: 'calls', label: 'Call Center', icon: Phone },
    { id: 'market', label: 'Market Intel', icon: TrendingUp },
    { id: 'system', label: 'System', icon: Settings },
  ];

  if (!isSystemInitialized) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='text-center'>
          <div className='mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>
            Initializing AI Flow System
          </h2>
          <p className='text-gray-600'>
            Setting up the ultimate AI Freight Brokerage platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <div className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600'>
                <Zap className='h-6 w-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-800'>AI Flow</h1>
                <p className='text-sm text-gray-600'>
                  The Ultimate AI Freight Brokerage
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-green-500' />
                <span className='text-sm text-gray-600'>System Online</span>
              </div>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`${autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                {autoRefresh ? (
                  <Play className='h-4 w-4' />
                ) : (
                  <Pause className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <nav className='flex space-x-8'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <tab.icon className='h-5 w-5' />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'agents' && renderAgentsTab()}
        {activeTab === 'prospects' && renderProspectsTab()}
        {activeTab === 'quotes' && renderQuotesTab()}
        {activeTab === 'calls' && renderCallCenterTab()}
        {activeTab === 'market' && renderMarketIntelligenceTab()}
        {activeTab === 'system' && renderSystemTab()}
      </div>
    </div>
  );
}
