'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Bot,
  Calculator,
  CheckCircle,
  CheckSquare,
  Clock,
  Database,
  DollarSign,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  MapPin,
  Mic,
  Network,
  Phone,
  PieChart,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function AIFlowTrainingPage() {
  const [activeModule, setActiveModule] = useState('overview');
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'overview',
  ]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const markModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules((prev) => [...prev, moduleId]);
    }
  };

  const trainingModules = [
    {
      id: 'overview',
      title: 'AI Flow System Overview',
      icon: Activity,
      duration: '15 min',
      difficulty: 'Beginner',
      description: 'Introduction to the ultimate AI freight brokerage platform',
      lessons: [
        'What is AI Flow?',
        'System Architecture',
        'Key Benefits',
        'ROI Analysis',
        'Success Stories',
      ],
    },
    {
      id: 'agents',
      title: 'AI Agent Management',
      icon: Bot,
      duration: '25 min',
      difficulty: 'Intermediate',
      description: 'Managing and monitoring the 8 specialized AI agents',
      lessons: [
        'Agent Overview',
        'Prospecting Agent',
        'Cold Calling Agent',
        'Rate Quoting Agent',
        'Load Coordinator',
        'Customer Service Agent',
        'Compliance Agent',
        'Market Analyst',
        'Dispatch Agent',
      ],
    },
    {
      id: 'voice-infrastructure',
      title: 'Voice Infrastructure & Call Center',
      icon: Phone,
      duration: '30 min',
      difficulty: 'Advanced',
      description: 'FreeSWITCH call center operations and AI voice integration',
      lessons: [
        'FreeSWITCH Setup',
        'Call Center Configuration',
        'AI Voice Integration',
        'Real-time Monitoring',
        'Performance Optimization',
      ],
    },
    {
      id: 'business-intelligence',
      title: 'Business Intelligence & Lead Generation',
      icon: TrendingUp,
      duration: '20 min',
      difficulty: 'Intermediate',
      description:
        'Leveraging integrated APIs for business intelligence and prospecting',
      lessons: [
        'OpenCorporates API',
        'SEC EDGAR Integration',
        'Census Data Analysis',
        'Lead Scoring',
        'Prospect Management',
      ],
    },
    {
      id: 'freight-operations',
      title: 'Freight Operations Management',
      icon: Truck,
      duration: '25 min',
      difficulty: 'Intermediate',
      description: 'Load coordination, dispatch, and tracking operations',
      lessons: [
        'Load Management',
        'Carrier Coordination',
        'Route Optimization',
        'Dispatch Operations',
        'Tracking & Monitoring',
      ],
    },
    {
      id: 'pricing-quoting',
      title: 'Dynamic Pricing & Quoting',
      icon: Calculator,
      duration: '20 min',
      difficulty: 'Intermediate',
      description: 'AI-powered freight rate calculation and quote generation',
      lessons: [
        'Market Rate Analysis',
        'Dynamic Pricing Engine',
        'Quote Generation',
        'Competitive Analysis',
        'Margin Optimization',
      ],
    },
    {
      id: 'api-integration',
      title: 'API Integration',
      icon: Globe,
      duration: '35 min',
      difficulty: 'Advanced',
      description: 'Complete guide to all 14 API integrations',
      lessons: [
        'API Overview',
        'Authentication Setup',
        'Data Processing',
        'Error Handling',
        'Performance Monitoring',
      ],
    },
    {
      id: 'analytics-reporting',
      title: 'Analytics & Reporting',
      icon: BarChart3,
      duration: '18 min',
      difficulty: 'Beginner',
      description:
        'System metrics, performance tracking, and business analytics',
      lessons: [
        'Performance Metrics',
        'Business Analytics',
        'Custom Reports',
        'Data Visualization',
        'Trend Analysis',
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting & Support',
      icon: Shield,
      duration: '22 min',
      difficulty: 'Advanced',
      description: 'Common issues, solutions, and system maintenance',
      lessons: [
        'Common Issues',
        'Error Diagnostics',
        'Performance Tuning',
        'System Maintenance',
        'Support Resources',
      ],
    },
    {
      id: 'certification',
      title: 'AI Flow Certification',
      icon: Award,
      duration: '10 min',
      difficulty: 'All Levels',
      description:
        'Complete certification exam and earn your AI Flow certificate',
      lessons: [
        'Review Materials',
        'Practice Questions',
        'Certification Exam',
        'Certificate Download',
        'Continuing Education',
      ],
    },
  ];

  const renderModuleContent = (moduleId: string) => {
    const trainingModule = trainingModules.find((m) => m.id === moduleId);
    if (!trainingModule) return null;

    return (
      <div className='space-y-6'>
        {/* Module Header */}
        <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6'>
          <div className='mb-4 flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600'>
              <trainingModule.icon className='h-6 w-6 text-white' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {trainingModule.title}
              </h2>
              <p className='text-gray-600'>{trainingModule.description}</p>
            </div>
          </div>
          <div className='flex items-center gap-4 text-sm text-gray-600'>
            <span className='flex items-center gap-1'>
              <Clock className='h-4 w-4' />
              {trainingModule.duration}
            </span>
            <Badge
              className={`${
                trainingModule.difficulty === 'Beginner'
                  ? 'bg-green-100 text-green-800'
                  : trainingModule.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {trainingModule.difficulty}
            </Badge>
            {completedModules.includes(moduleId) && (
              <Badge className='bg-green-100 text-green-800'>
                <CheckCircle className='mr-1 h-3 w-3' />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Module Content */}
        {moduleId === 'overview' && renderOverviewModule()}
        {moduleId === 'agents' && renderAgentsModule()}
        {moduleId === 'voice-infrastructure' &&
          renderVoiceInfrastructureModule()}
        {moduleId === 'business-intelligence' &&
          renderBusinessIntelligenceModule()}
        {moduleId === 'freight-operations' && renderFreightOperationsModule()}
        {moduleId === 'pricing-quoting' && renderPricingQuotingModule()}
        {moduleId === 'api-integration' && renderAPIIntegrationModule()}
        {moduleId === 'analytics-reporting' && renderAnalyticsReportingModule()}
        {moduleId === 'troubleshooting' && renderTroubleshootingModule()}
        {moduleId === 'certification' && renderCertificationModule()}

        {/* Complete Module Button */}
        <div className='flex justify-center'>
          <Button
            onClick={() => markModuleComplete(moduleId)}
            className='bg-green-600 px-8 py-3 text-lg text-white hover:bg-green-700'
            disabled={completedModules.includes(moduleId)}
          >
            {completedModules.includes(moduleId) ? (
              <>
                <CheckCircle className='mr-2 h-5 w-5' />
                Module Completed
              </>
            ) : (
              <>
                <CheckSquare className='mr-2 h-5 w-5' />
                Mark as Complete
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderOverviewModule = () => (
    <div className='space-y-6'>
      {/* What is AI Flow? */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Zap className='h-5 w-5 text-blue-600' />
            What is AI Flow?
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            AI Flow is the ultimate AI freight brokerage platform that
            revolutionizes transportation logistics through intelligent
            automation. It combines 8 specialized AI agents with 14 integrated
            API integrations to create a comprehensive, zero-cost solution for
            freight operations.
          </p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-lg bg-blue-50 p-4'>
              <h4 className='mb-2 font-semibold text-blue-800'>
                Key Components
              </h4>
              <ul className='space-y-1 text-sm text-blue-700'>
                <li>• 8 Specialized AI Agents</li>
                <li>• 14 API Integrations</li>
                <li>• FreeSWITCH Call Center</li>
                <li>• Real-time Analytics</li>
                <li>• Voice Infrastructure</li>
              </ul>
            </div>
            <div className='rounded-lg bg-green-50 p-4'>
              <h4 className='mb-2 font-semibold text-green-800'>
                Business Benefits
              </h4>
              <ul className='space-y-1 text-sm text-green-700'>
                <li>• $540,000 Annual Savings</li>
                <li>• Infinite ROI (Zero API Costs)</li>
                <li>• 24/7 Automated Operations</li>
                <li>• 94% System Accuracy</li>
                <li>• Complete Automation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Network className='h-5 w-5 text-purple-600' />
            System Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-6'>
            <div className='mb-4 text-center'>
              <div className='inline-block rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white'>
                AI Flow Core System
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='text-center'>
                <div className='mb-2 rounded-lg bg-white p-4 shadow-sm'>
                  <Bot className='mx-auto mb-2 h-8 w-8 text-blue-600' />
                  <div className='font-semibold text-gray-800'>
                    AI Agents Layer
                  </div>
                  <div className='text-sm text-gray-600'>
                    8 Specialized Agents
                  </div>
                </div>
                <div className='text-xs text-gray-500'>
                  Processing & Intelligence
                </div>
              </div>
              <div className='text-center'>
                <div className='mb-2 rounded-lg bg-white p-4 shadow-sm'>
                  <Globe className='mx-auto mb-2 h-8 w-8 text-green-600' />
                  <div className='font-semibold text-gray-800'>
                    API Integration Layer
                  </div>
                  <div className='text-sm text-gray-600'>
                    14 API Integrations
                  </div>
                </div>
                <div className='text-xs text-gray-500'>
                  Data & Communication
                </div>
              </div>
              <div className='text-center'>
                <div className='mb-2 rounded-lg bg-white p-4 shadow-sm'>
                  <Phone className='mx-auto mb-2 h-8 w-8 text-purple-600' />
                  <div className='font-semibold text-gray-800'>
                    Voice Infrastructure
                  </div>
                  <div className='text-sm text-gray-600'>
                    FreeSWITCH Platform
                  </div>
                </div>
                <div className='text-xs text-gray-500'>
                  Communication & Support
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5 text-green-600' />
            ROI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-lg bg-red-50 p-4 text-center'>
              <div className='text-2xl font-bold text-red-600'>$45,000</div>
              <div className='text-sm text-gray-600'>
                Traditional Monthly API Costs
              </div>
            </div>
            <div className='rounded-lg bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>$0</div>
              <div className='text-sm text-gray-600'>AI Flow Monthly Costs</div>
            </div>
            <div className='rounded-lg bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>$540,000</div>
              <div className='text-sm text-gray-600'>Annual Savings</div>
            </div>
            <div className='rounded-lg bg-purple-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>∞%</div>
              <div className='text-sm text-gray-600'>ROI (Infinite)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAgentsModule = () => (
    <div className='space-y-6'>
      {/* Agent Overview */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-blue-600' />
            AI Agent Overview
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            AI Flow employs 8 specialized AI agents, each designed for specific
            freight brokerage functions. These agents work collaboratively to
            automate the entire freight process from lead generation to delivery
            completion.
          </p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {[
              {
                name: 'Prospecting Agent',
                icon: Target,
                tasks: 1247,
                success: 73,
                color: 'blue',
              },
              {
                name: 'Cold Calling Agent',
                icon: Phone,
                tasks: 892,
                success: 34,
                color: 'purple',
              },
              {
                name: 'Rate Quoting Agent',
                icon: Calculator,
                tasks: 2134,
                success: 89,
                color: 'green',
              },
              {
                name: 'Load Coordinator',
                icon: Truck,
                tasks: 1567,
                success: 96,
                color: 'orange',
              },
              {
                name: 'Customer Service',
                icon: Headphones,
                tasks: 3421,
                success: 94,
                color: 'pink',
              },
              {
                name: 'Compliance Agent',
                icon: Shield,
                tasks: 756,
                success: 98,
                color: 'indigo',
              },
              {
                name: 'Market Analyst',
                icon: TrendingUp,
                tasks: 234,
                success: 91,
                color: 'red',
              },
              {
                name: 'Dispatch Agent',
                icon: MapPin,
                tasks: 1876,
                success: 97,
                color: 'yellow',
              },
            ].map((agent, index) => (
              <div
                key={index}
                className={`bg-${agent.color}-50 rounded-lg border p-4 border-${agent.color}-200`}
              >
                <div className='mb-2 flex items-center gap-3'>
                  <agent.icon className={`h-5 w-5 text-${agent.color}-600`} />
                  <span className='font-semibold text-gray-800'>
                    {agent.name}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Tasks: {agent.tasks}</span>
                  <span>Success: {agent.success}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Management */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5 text-gray-600' />
            Agent Management
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-gray-50 p-4'>
            <h4 className='mb-2 font-semibold text-gray-800'>
              Agent Monitoring
            </h4>
            <ul className='space-y-1 text-sm text-gray-700'>
              <li>• Real-time performance tracking</li>
              <li>• Task completion monitoring</li>
              <li>• Success rate analytics</li>
              <li>• Customer satisfaction metrics</li>
              <li>• Response time optimization</li>
            </ul>
          </div>
          <div className='rounded-lg bg-blue-50 p-4'>
            <h4 className='mb-2 font-semibold text-blue-800'>
              Agent Configuration
            </h4>
            <ul className='space-y-1 text-sm text-blue-700'>
              <li>• Performance thresholds</li>
              <li>• Workload distribution</li>
              <li>• Priority assignment</li>
              <li>• Escalation rules</li>
              <li>• Learning parameters</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVoiceInfrastructureModule = () => (
    <div className='space-y-6'>
      {/* FreeSWITCH Overview */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Phone className='h-5 w-5 text-purple-600' />
            FreeSWITCH Call Center Platform
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            FreeSWITCH powers our voice infrastructure, providing
            enterprise-grade telephony capabilities completely free. This
            open-source platform handles all voice communications for AI agents
            and human operators.
          </p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-lg bg-purple-50 p-4'>
              <h4 className='mb-2 font-semibold text-purple-800'>
                Core Features
              </h4>
              <ul className='space-y-1 text-sm text-purple-700'>
                <li>• Call routing and queuing</li>
                <li>• Conference calling</li>
                <li>• Call recording</li>
                <li>• IVR systems</li>
                <li>• SIP integration</li>
              </ul>
            </div>
            <div className='rounded-lg bg-green-50 p-4'>
              <h4 className='mb-2 font-semibold text-green-800'>
                AI Integration
              </h4>
              <ul className='space-y-1 text-sm text-green-700'>
                <li>• Voice recognition</li>
                <li>• Speech synthesis</li>
                <li>• Natural language processing</li>
                <li>• Sentiment analysis</li>
                <li>• Automated responses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Center Operations */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Headphones className='h-5 w-5 text-blue-600' />
            Call Center Operations
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <h4 className='mb-2 font-semibold text-blue-800'>
              Real-time Monitoring
            </h4>
            <div className='grid grid-cols-2 gap-4 text-center md:grid-cols-4'>
              <div>
                <div className='text-2xl font-bold text-blue-600'>25</div>
                <div className='text-xs text-gray-600'>Active Calls</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-600'>145</div>
                <div className='text-xs text-gray-600'>Calls/Hour</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-purple-600'>3</div>
                <div className='text-xs text-gray-600'>Queue Length</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-orange-600'>87%</div>
                <div className='text-xs text-gray-600'>Agent Utilization</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBusinessIntelligenceModule = () => (
    <div className='space-y-6'>
      {/* API Integrations Overview */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Globe className='h-5 w-5 text-green-600' />
            Business Intelligence API Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            Our business intelligence system leverages completely free
            government and public APIs to provide comprehensive market data,
            company information, and economic indicators without any ongoing
            costs.
          </p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {[
              {
                name: 'OpenCorporates',
                desc: 'Company registration data',
                status: 'FREE',
              },
              {
                name: 'SEC EDGAR',
                desc: 'Public company filings',
                status: 'FREE',
              },
              {
                name: 'Census Bureau',
                desc: 'Business patterns data',
                status: 'FREE',
              },
              {
                name: 'Bureau of Labor Statistics',
                desc: 'Employment data',
                status: 'FREE',
              },
              {
                name: 'FRED Economic Data',
                desc: 'Economic indicators',
                status: 'FREE',
              },
              {
                name: 'Bureau of Transportation',
                desc: 'Transportation statistics',
                status: 'FREE',
              },
            ].map((api, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-green-50 p-3'
              >
                <div>
                  <div className='font-semibold text-gray-800'>{api.name}</div>
                  <div className='text-sm text-gray-600'>{api.desc}</div>
                </div>
                <Badge className='bg-green-500 text-white'>{api.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Generation Process */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Target className='h-5 w-5 text-blue-600' />
            Lead Generation Process
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <h4 className='mb-3 font-semibold text-blue-800'>
              5-Step Lead Discovery
            </h4>
            <div className='space-y-2'>
              {[
                'Company Discovery via OpenCorporates',
                'Financial Analysis via SEC EDGAR',
                'Market Position via Census Data',
                'Contact Information Gathering',
                'Lead Scoring and Prioritization',
              ].map((step, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white'>
                    {index + 1}
                  </div>
                  <span className='text-sm text-blue-700'>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFreightOperationsModule = () => (
    <div className='space-y-6'>
      {/* Load Management */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Truck className='h-5 w-5 text-orange-600' />
            Load Management System
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            The load management system coordinates all freight operations from
            initial booking through delivery completion, utilizing AI agents for
            optimal carrier matching and route planning.
          </p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='rounded-lg bg-orange-50 p-4 text-center'>
              <div className='text-2xl font-bold text-orange-600'>1,567</div>
              <div className='text-sm text-gray-600'>Loads Coordinated</div>
            </div>
            <div className='rounded-lg bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>96%</div>
              <div className='text-sm text-gray-600'>On-time Delivery</div>
            </div>
            <div className='rounded-lg bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>1,234</div>
              <div className='text-sm text-gray-600'>Active Carriers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carrier Network */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Network className='h-5 w-5 text-purple-600' />
            Carrier Network Management
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-purple-50 p-4'>
            <h4 className='mb-2 font-semibold text-purple-800'>
              Network Optimization
            </h4>
            <ul className='space-y-1 text-sm text-purple-700'>
              <li>• Performance tracking</li>
              <li>• Rate negotiations</li>
              <li>• Capacity planning</li>
              <li>• Relationship management</li>
              <li>• Quality scoring</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPricingQuotingModule = () => (
    <div className='space-y-6'>
      {/* Dynamic Pricing Engine */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calculator className='h-5 w-5 text-green-600' />
            Dynamic Pricing Engine
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            Our AI-powered pricing engine analyzes market conditions, fuel
            costs, and demand patterns to generate competitive quotes that
            maximize profitability while maintaining market competitiveness.
          </p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-lg bg-green-50 p-4'>
              <h4 className='mb-2 font-semibold text-green-800'>
                Pricing Factors
              </h4>
              <ul className='space-y-1 text-sm text-green-700'>
                <li>• Current market rates</li>
                <li>• Fuel surcharges</li>
                <li>• Equipment availability</li>
                <li>• Seasonal demand</li>
                <li>• Competitive analysis</li>
              </ul>
            </div>
            <div className='rounded-lg bg-blue-50 p-4'>
              <h4 className='mb-2 font-semibold text-blue-800'>
                Quote Generation
              </h4>
              <ul className='space-y-1 text-sm text-blue-700'>
                <li>• Instant rate calculation</li>
                <li>• Margin optimization</li>
                <li>• Confidence scoring</li>
                <li>• Automated delivery</li>
                <li>• Follow-up tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5 text-blue-600' />
            Pricing Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='rounded-lg bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>2,134</div>
              <div className='text-sm text-gray-600'>Quotes Generated</div>
            </div>
            <div className='rounded-lg bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>89%</div>
              <div className='text-sm text-gray-600'>Accuracy Rate</div>
            </div>
            <div className='rounded-lg bg-purple-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>1.8s</div>
              <div className='text-sm text-gray-600'>Avg Response Time</div>
            </div>
            <div className='rounded-lg bg-orange-50 p-4 text-center'>
              <div className='text-2xl font-bold text-orange-600'>28%</div>
              <div className='text-sm text-gray-600'>Margin Increase</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAPIIntegrationModule = () => (
    <div className='space-y-6'>
      {/* API Categories */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Database className='h-5 w-5 text-purple-600' />
            14 API Integration Categories
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {[
              {
                category: 'Voice Infrastructure',
                apis: ['FreeSWITCH'],
                icon: Phone,
              },
              {
                category: 'Business Intelligence',
                apis: ['OpenCorporates', 'SEC EDGAR'],
                icon: TrendingUp,
              },
              {
                category: 'Speech Processing',
                apis: ['OpenAI Whisper'],
                icon: Mic,
              },
              {
                category: 'Economic Data',
                apis: ['FRED', 'BLS'],
                icon: BarChart3,
              },
              {
                category: 'Transportation',
                apis: ['BTS', 'FMCSA'],
                icon: Truck,
              },
              {
                category: 'Document Management',
                apis: ['PDF Processing'],
                icon: FileText,
              },
              {
                category: 'Mapping & Routing',
                apis: ['OpenStreetMap'],
                icon: MapPin,
              },
              {
                category: 'Market Intelligence',
                apis: ['Multiple Sources'],
                icon: Globe,
              },
            ].map((category, index) => (
              <div key={index} className='rounded-lg bg-gray-50 p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <category.icon className='h-5 w-5 text-gray-600' />
                  <span className='font-semibold text-gray-800'>
                    {category.category}
                  </span>
                </div>
                <div className='text-sm text-gray-600'>
                  {category.apis.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5 text-green-600' />
            Integration Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-lg bg-green-50 p-4'>
              <h4 className='mb-2 font-semibold text-green-800'>Security</h4>
              <ul className='space-y-1 text-sm text-green-700'>
                <li>• API key management</li>
                <li>• Rate limiting</li>
                <li>• Error handling</li>
                <li>• Data encryption</li>
                <li>• Access controls</li>
              </ul>
            </div>
            <div className='rounded-lg bg-blue-50 p-4'>
              <h4 className='mb-2 font-semibold text-blue-800'>Performance</h4>
              <ul className='space-y-1 text-sm text-blue-700'>
                <li>• Response caching</li>
                <li>• Connection pooling</li>
                <li>• Async processing</li>
                <li>• Monitoring alerts</li>
                <li>• Failover strategies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsReportingModule = () => (
    <div className='space-y-6'>
      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5 text-blue-600' />
            System Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-lg bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>99.9%</div>
              <div className='text-sm text-gray-600'>System Uptime</div>
            </div>
            <div className='rounded-lg bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>0.85s</div>
              <div className='text-sm text-gray-600'>API Response Time</div>
            </div>
            <div className='rounded-lg bg-purple-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>15,000</div>
              <div className='text-sm text-gray-600'>Records/Min</div>
            </div>
            <div className='rounded-lg bg-orange-50 p-4 text-center'>
              <div className='text-2xl font-bold text-orange-600'>$45,000</div>
              <div className='text-sm text-gray-600'>Monthly Savings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <PieChart className='h-5 w-5 text-purple-600' />
            Business Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-purple-50 p-4'>
            <h4 className='mb-2 font-semibold text-purple-800'>
              Key Performance Indicators
            </h4>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='text-center'>
                <div className='text-xl font-bold text-purple-600'>73%</div>
                <div className='text-sm text-gray-600'>Lead Conversion</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-purple-600'>96%</div>
                <div className='text-sm text-gray-600'>On-time Delivery</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-purple-600'>4.8/5</div>
                <div className='text-sm text-gray-600'>
                  Customer Satisfaction
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTroubleshootingModule = () => (
    <div className='space-y-6'>
      {/* Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-yellow-600' />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            {[
              {
                issue: 'API Connection Timeout',
                solution: 'Check network connectivity and API endpoint status',
                severity: 'Medium',
              },
              {
                issue: 'Agent Performance Degradation',
                solution:
                  'Review system resources and optimize agent workloads',
                severity: 'High',
              },
              {
                issue: 'Voice Quality Issues',
                solution:
                  'Verify FreeSWITCH configuration and network bandwidth',
                severity: 'Medium',
              },
              {
                issue: 'Data Synchronization Errors',
                solution: 'Check database connections and run sync validation',
                severity: 'Low',
              },
            ].map((item, index) => (
              <div key={index} className='rounded-lg bg-gray-50 p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='font-semibold text-gray-800'>
                    {item.issue}
                  </span>
                  <Badge
                    className={`${
                      item.severity === 'High'
                        ? 'bg-red-100 text-red-800'
                        : item.severity === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.severity}
                  </Badge>
                </div>
                <p className='text-sm text-gray-600'>{item.solution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5 text-blue-600' />
            System Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <h4 className='mb-2 font-semibold text-blue-800'>
              Regular Maintenance Tasks
            </h4>
            <ul className='space-y-1 text-sm text-blue-700'>
              <li>• Database optimization</li>
              <li>• Log file rotation</li>
              <li>• Performance monitoring</li>
              <li>• Security updates</li>
              <li>• Backup verification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCertificationModule = () => (
    <div className='space-y-6'>
      {/* Certification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Award className='text-gold-600 h-5 w-5' />
            AI Flow Certification Program
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-gray-700'>
            Complete your AI Flow certification to demonstrate mastery of the
            ultimate AI freight brokerage platform. This certification validates
            your ability to operate, manage, and optimize the AI Flow system.
          </p>
          <div className='bg-gold-50 rounded-lg p-4'>
            <h4 className='text-gold-800 mb-2 font-semibold'>
              Certification Requirements
            </h4>
            <ul className='text-gold-700 space-y-1 text-sm'>
              <li>• Complete all 9 training modules</li>
              <li>• Pass certification exam (80% minimum)</li>
              <li>• Demonstrate practical skills</li>
              <li>• Submit case study project</li>
              <li>• Maintain continuing education</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Certification Status */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <GraduationCap className='h-5 w-5 text-blue-600' />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='font-semibold text-blue-800'>
                Modules Completed
              </span>
              <span className='font-bold text-blue-600'>
                {completedModules.length}/10
              </span>
            </div>
            <div className='h-2 w-full rounded-full bg-blue-200'>
              <div
                className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                style={{ width: `${(completedModules.length / 10) * 100}%` }}
              />
            </div>
          </div>
          {completedModules.length >= 9 && (
            <Button className='bg-gold-600 hover:bg-gold-700 w-full text-white'>
              <FileCheck className='mr-2 h-4 w-4' />
              Take Certification Exam
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50'>
      {/* Header */}
      <div className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600'>
                <GraduationCap className='h-6 w-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-800'>
                  AI Flow Training
                </h1>
                <p className='text-sm text-gray-600'>
                  Master the Ultimate AI Freight Brokerage
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-sm text-gray-600'>
                Progress: {completedModules.length}/{trainingModules.length}{' '}
                modules
              </div>
              <div className='h-2 w-32 rounded-full bg-gray-200'>
                <div
                  className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                  style={{
                    width: `${(completedModules.length / trainingModules.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Training Modules Sidebar */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-4 border-gray-200 bg-white'>
              <CardHeader>
                <CardTitle className='text-lg'>Training Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {trainingModules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full rounded-lg p-3 text-left transition-all duration-200 ${
                        activeModule === module.id
                          ? 'border-2 border-blue-500 bg-blue-100'
                          : 'border-2 border-transparent bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            completedModules.includes(module.id)
                              ? 'bg-green-500 text-white'
                              : activeModule === module.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {completedModules.includes(module.id) ? (
                            <CheckCircle className='h-4 w-4' />
                          ) : (
                            <module.icon className='h-4 w-4' />
                          )}
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-gray-800'>
                            {module.title}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {module.duration}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            {renderModuleContent(activeModule)}
          </div>
        </div>
      </div>
    </div>
  );
}
