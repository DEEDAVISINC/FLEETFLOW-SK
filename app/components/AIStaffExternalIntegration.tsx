'use client';

import {
  Activity,
  Api,
  BarChart3,
  ExternalLink,
  Link,
  Mail,
  Play,
  Settings,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AutomatedOutreachSequence,
  ExternalAPIConnection,
  LeadGenerationCampaign,
  aiStaffExternalIntegrationService,
} from '../services/AIStaffExternalIntegrationService';

export default function AIStaffExternalIntegration() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'connections' | 'campaigns' | 'sequences' | 'analytics'
  >('overview');
  const [apiConnections, setApiConnections] = useState<ExternalAPIConnection[]>(
    []
  );
  const [leadCampaigns, setLeadCampaigns] = useState<LeadGenerationCampaign[]>(
    []
  );
  const [outreachSequences, setOutreachSequences] = useState<
    AutomatedOutreachSequence[]
  >([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const connections = aiStaffExternalIntegrationService.getAPIConnections();
      setApiConnections(connections);

      const campaigns = aiStaffExternalIntegrationService.getLeadCampaigns();
      setLeadCampaigns(campaigns);

      const sequences =
        aiStaffExternalIntegrationService.getOutreachSequences();
      setOutreachSequences(sequences);

      const analyticsData =
        aiStaffExternalIntegrationService.getIntegrationAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load integration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (connectionId: string) => {
    try {
      const success =
        await aiStaffExternalIntegrationService.testConnection(connectionId);
      if (success) {
        alert('Connection test successful!');
      } else {
        alert('Connection test failed. Please check your configuration.');
      }
      loadData();
    } catch (error) {
      alert('Connection test failed: ' + error.message);
    }
  };

  const handleRunCampaign = async (campaignId: string) => {
    try {
      // Check if this is a healthcare campaign and use the real DEPOINTE lead generation
      const campaign = leadCampaigns.find((c) => c.id === campaignId);
      if (campaign && campaign.name.toLowerCase().includes('healthcare')) {
        // Use real DEPOINTE lead generation system
        console.log('🚀 Using DEPOINTE AI Lead Generation System...');

        // Import the task execution service
        const { taskExecutionService } = await import(
          '../services/DEPOINTETaskExecutionService'
        );

        // Create and execute a healthcare task
        const healthcareTask = {
          id: `healthcare-campaign-${Date.now()}`,
          title: 'Healthcare Logistics Lead Generation',
          description:
            'Generate healthcare-focused leads from FMCSA, ThomasNet, and TruckingPlanet',
          type: 'healthcare',
          priority: 'high',
          assignedTo: ['ai-staff-1', 'ai-staff-2'],
          status: 'in_progress',
          targetQuantity: 30,
          progress: 0,
          createdAt: new Date().toISOString(),
          estimatedRevenue: 500000,
          actualRevenue: 0,
        };

        // Start the task execution
        taskExecutionService.start();
        console.log('✅ DEPOINTE Task Execution Service started');

        alert(
          `Healthcare campaign launched! Check console for lead generation progress and refresh CRM to see results.`
        );
        return;
      }

      // For other campaigns, use the existing internal system
      const leads =
        await aiStaffExternalIntegrationService.generateLeadsFromCampaign(
          campaignId
        );
      alert(
        `Campaign executed successfully! Generated ${leads.length} internal leads.`
      );
      loadData();
    } catch (error) {
      alert('Campaign execution failed: ' + error.message);
    }
  };

  const getConnectionStatusColor = (
    status: ExternalAPIConnection['status']
  ) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCampaignStatusColor = (status: LeadGenerationCampaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSequenceStatusColor = (
    status: AutomatedOutreachSequence['status']
  ) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <Zap className='mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500' />
          <p className='text-gray-500'>Loading External Integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='flex items-center gap-3 text-3xl font-bold text-white'>
        <Link className='h-8 w-8 text-purple-400' /> AI Staff External
        Integration
      </h2>
      <p className='text-slate-300'>
        Connect to FleetFlow CRM to automate lead generation, qualification, and
        client acquisition workflows.
      </p>

      {/* Navigation Tabs */}
      <div className='flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('overview')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className='mr-2 inline h-4 w-4' />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'connections'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Api className='mr-2 inline h-4 w-4' />
          API Connections ({apiConnections.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Target className='mr-2 inline h-4 w-4' />
          Lead Campaigns ({leadCampaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('sequences')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'sequences'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Mail className='mr-2 inline h-4 w-4' />
          Outreach ({outreachSequences.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className='mr-2 inline h-4 w-4' />
          Analytics
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Integration Status */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Integration Status
              </h3>
              <Activity className='h-6 w-6 text-blue-500' />
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Total Connections:
                </span>
                <span className='font-semibold text-blue-600'>
                  {analytics?.totalConnections || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Active Connections:
                </span>
                <span className='font-semibold text-green-600'>
                  {analytics?.activeConnections || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Active Campaigns:</span>
                <span className='font-semibold text-purple-600'>
                  {analytics?.activeCampaigns || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>API Usage Today:</span>
                <span className='font-semibold text-orange-600'>
                  {analytics?.apiUsageToday || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Lead Generation Performance */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Lead Generation
              </h3>
              <Users className='h-6 w-6 text-green-500' />
            </div>
            <div className='space-y-3'>
              <div className='rounded bg-green-50 p-3 text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {analytics?.totalLeadsGenerated || 0}
                </div>
                <div className='text-sm text-green-600'>
                  Total Leads Generated
                </div>
              </div>
              <div className='rounded bg-blue-50 p-3 text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {leadCampaigns.length}
                </div>
                <div className='text-sm text-blue-600'>Total Campaigns</div>
              </div>
            </div>
          </div>

          {/* Top Performing Sources */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Top Sources
              </h3>
              <Zap className='h-6 w-6 text-purple-500' />
            </div>
            <div className='space-y-2'>
              {analytics?.topPerformingSources
                ?.slice(0, 3)
                .map((source: any, index: number) => (
                  <div
                    key={source.id}
                    className='flex items-center justify-between rounded bg-gray-50 p-2'
                  >
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium text-gray-600'>
                        #{index + 1}
                      </span>
                      <span className='text-sm text-gray-800'>
                        {source.name}
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-purple-600'>
                      {source.usageToday}
                    </span>
                  </div>
                )) || (
                <p className='text-sm text-gray-500'>No usage data yet</p>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-3'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                System Status
              </h3>
              <Activity className='h-6 w-6 text-blue-500' />
            </div>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
              <div className='rounded-lg bg-blue-50 p-4 text-center'>
                <div className='text-lg font-bold text-blue-600'>
                  {
                    apiConnections.filter((c) => c.status === 'connected')
                      .length
                  }
                  /{apiConnections.length}
                </div>
                <div className='text-sm text-blue-600'>CRM Connections</div>
              </div>
              <div className='rounded-lg bg-green-50 p-4 text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {leadCampaigns.length}
                </div>
                <div className='text-sm text-green-600'>Active Campaigns</div>
              </div>
              <div className='rounded-lg bg-purple-50 p-4 text-center'>
                <div className='text-lg font-bold text-purple-600'>
                  {outreachSequences.length}
                </div>
                <div className='text-sm text-purple-600'>
                  Outreach Sequences
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'connections' && (
        <div className='space-y-4'>
          {apiConnections.map((connection) => (
            <div
              key={connection.id}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h3 className='text-xl font-semibold text-gray-800'>
                      {connection.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getConnectionStatusColor(connection.status)}`}
                    >
                      {connection.status}
                    </span>
                    <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'>
                      {connection.type}
                    </span>
                  </div>
                  <p className='mb-3 text-gray-600'>{connection.provider}</p>
                  <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                    <div>
                      <span className='font-medium'>Daily Limit:</span>{' '}
                      {connection.dailyLimit}
                    </div>
                    <div>
                      <span className='font-medium'>Usage Today:</span>{' '}
                      {connection.usageToday}
                    </div>
                    <div>
                      <span className='font-medium'>Last Sync:</span>{' '}
                      {connection.lastSync.toLocaleDateString()}
                    </div>
                    <div>
                      <span className='font-medium'>Status:</span>{' '}
                      <span className='capitalize'>{connection.status}</span>
                    </div>
                  </div>
                </div>
                <div className='ml-4 flex flex-col gap-2'>
                  <button
                    onClick={() => handleTestConnection(connection.id)}
                    className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
                  >
                    Test Connection
                  </button>
                  <button className='rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700'>
                    <Settings className='mr-2 inline h-4 w-4' />
                    Configure
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className='space-y-4'>
          {leadCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h3 className='text-xl font-semibold text-gray-800'>
                      {campaign.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getCampaignStatusColor(campaign.status)}`}
                    >
                      {campaign.status}
                    </span>
                    <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700'>
                      {campaign.schedule}
                    </span>
                  </div>
                  <div className='mb-3 grid grid-cols-2 gap-4 text-sm text-gray-600'>
                    <div>
                      <span className='font-medium'>Leads Generated:</span>{' '}
                      {campaign.leadsGenerated}
                    </div>
                    <div>
                      <span className='font-medium'>Last Run:</span>{' '}
                      {campaign.lastRun.toLocaleDateString()}
                    </div>
                  </div>
                  <div className='mb-3'>
                    <h4 className='mb-2 font-medium text-gray-700'>
                      Target Criteria:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {campaign.targetCriteria.industry?.map((ind) => (
                        <span
                          key={ind}
                          className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'
                        >
                          {ind}
                        </span>
                      ))}
                      {campaign.targetCriteria.location?.map((loc) => (
                        <span
                          key={loc}
                          className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className='mb-2 font-medium text-gray-700'>Sources:</h4>
                    <div className='flex flex-wrap gap-2'>
                      {campaign.sources.map((sourceId) => {
                        const source = apiConnections.find(
                          (c) => c.id === sourceId
                        );
                        return source ? (
                          <span
                            key={sourceId}
                            className='rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800'
                          >
                            {source.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                <div className='ml-4 flex flex-col gap-2'>
                  <button
                    onClick={() => handleRunCampaign(campaign.id)}
                    className='rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700'
                  >
                    <Play className='mr-2 inline h-4 w-4' />
                    Run Campaign
                  </button>
                  <button className='rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700'>
                    <Settings className='mr-2 inline h-4 w-4' />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}

          {leadCampaigns.length === 0 && (
            <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center'>
              <Target className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                Ready for Lead Campaigns
              </h3>
              <p className='mb-4 text-gray-500'>
                Campaigns will appear here once configured to pull from
                FleetFlow CRM.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sequences' && (
        <div className='space-y-4'>
          {outreachSequences.map((sequence) => (
            <div
              key={sequence.id}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h3 className='text-xl font-semibold text-gray-800'>
                      {sequence.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getSequenceStatusColor(sequence.status)}`}
                    >
                      {sequence.status}
                    </span>
                  </div>
                  <p className='mb-3 text-gray-600'>
                    Target: {sequence.targetSegment}
                  </p>
                  <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                    <div>
                      <span className='font-medium'>Steps:</span>{' '}
                      {sequence.steps.length}
                    </div>
                    <div>
                      <span className='font-medium'>Conversion Rate:</span>{' '}
                      {sequence.conversionRate}%
                    </div>
                    <div>
                      <span className='font-medium'>Total Contacts:</span>{' '}
                      {sequence.totalContacts}
                    </div>
                  </div>
                </div>
                <div className='ml-4 flex flex-col gap-2'>
                  <button className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'>
                    <Settings className='mr-2 inline h-4 w-4' />
                    Configure
                  </button>
                  <button className='rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700'>
                    <ExternalLink className='mr-2 inline h-4 w-4' />
                    View Sequence
                  </button>
                </div>
              </div>
            </div>
          ))}

          {outreachSequences.length === 0 && (
            <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center'>
              <Mail className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                Ready for Outreach Sequences
              </h3>
              <p className='mb-4 text-gray-500'>
                Automated outreach sequences will appear here once configured
                for CRM leads.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Performance Metrics */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              Integration Performance
            </h3>
            <div className='space-y-4'>
              <div className='rounded bg-blue-50 p-3 text-center'>
                <div className='text-3xl font-bold text-blue-600'>
                  {Math.round(
                    (analytics.activeConnections / analytics.totalConnections) *
                      100
                  ) || 0}
                  %
                </div>
                <div className='text-sm text-blue-600'>
                  Connection Success Rate
                </div>
              </div>
              <div className='rounded bg-green-50 p-3 text-center'>
                <div className='text-3xl font-bold text-green-600'>
                  {analytics.totalLeadsGenerated || 0}
                </div>
                <div className='text-sm text-green-600'>
                  Total Leads Generated
                </div>
              </div>
              <div className='rounded bg-purple-50 p-3 text-center'>
                <div className='text-3xl font-bold text-purple-600'>
                  {analytics.apiUsageToday || 0}
                </div>
                <div className='text-sm text-purple-600'>API Calls Today</div>
              </div>
            </div>
          </div>

          {/* Source Performance */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              Source Performance
            </h3>
            <div className='space-y-2'>
              {analytics.topPerformingSources?.map(
                (source: any, index: number) => (
                  <div
                    key={source.id}
                    className='flex items-center justify-between rounded bg-gray-50 p-3'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-sm font-medium text-gray-600'>
                        #{index + 1}
                      </span>
                      <span className='text-sm text-gray-800'>
                        {source.name}
                      </span>
                      <span className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'>
                        {source.status}
                      </span>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-semibold text-blue-600'>
                        {source.usageToday}
                      </div>
                      <div className='text-xs text-gray-500'>calls today</div>
                    </div>
                  </div>
                )
              ) || (
                <p className='text-sm text-gray-500'>No usage data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
