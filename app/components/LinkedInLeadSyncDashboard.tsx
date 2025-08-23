'use client';

import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  linkedInLeadSyncService,
  type LeadSyncMetrics,
  type LinkedInCampaign,
  type LinkedInLead,
} from '../services/LinkedInLeadSyncService';

export default function LinkedInLeadSyncDashboard() {
  const [leads, setLeads] = useState<LinkedInLead[]>([]);
  const [metrics, setMetrics] = useState<LeadSyncMetrics>({
    totalLeads: 0,
    newLeadsToday: 0,
    conversionRate: 0,
    averageLeadScore: 0,
    topPerformingCampaigns: [],
    leadsBySource: {},
    leadQualityDistribution: { high: 0, medium: 0, low: 0 },
    monthlyTrends: [],
  });
  const [campaigns, setCampaigns] = useState<LinkedInCampaign[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<any>({});
  const [selectedLead, setSelectedLead] = useState<LinkedInLead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [realtimeActivity, setRealtimeActivity] = useState<string[]>([]);

  useEffect(() => {
    // Load initial data
    loadDashboardData();

    // Set up real-time event listeners
    const handleNewLead = (lead: LinkedInLead) => {
      setRealtimeActivity((prev) => [
        `📧 New LinkedIn Lead: ${lead.firstName} ${lead.lastName} (${lead.company}) - Score: ${lead.leadScore}`,
        ...prev.slice(0, 9),
      ]);
      loadDashboardData();
    };

    const handleLeadStatusUpdated = (data: {
      leadId: string;
      status: string;
    }) => {
      setRealtimeActivity((prev) => [
        `📝 Lead ${data.leadId} status updated to: ${data.status}`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleMetricsUpdated = (newMetrics: LeadSyncMetrics) => {
      setMetrics(newMetrics);
    };

    const handleSyncError = (error: any) => {
      setRealtimeActivity((prev) => [
        `❌ LinkedIn sync error: ${error.message || 'Connection failed'}`,
        ...prev.slice(0, 9),
      ]);
    };

    // Subscribe to events
    linkedInLeadSyncService.on('newLead', handleNewLead);
    linkedInLeadSyncService.on('leadStatusUpdated', handleLeadStatusUpdated);
    linkedInLeadSyncService.on('metricsUpdated', handleMetricsUpdated);
    linkedInLeadSyncService.on('syncError', handleSyncError);

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);

    return () => {
      linkedInLeadSyncService.removeListener('newLead', handleNewLead);
      linkedInLeadSyncService.removeListener(
        'leadStatusUpdated',
        handleLeadStatusUpdated
      );
      linkedInLeadSyncService.removeListener(
        'metricsUpdated',
        handleMetricsUpdated
      );
      linkedInLeadSyncService.removeListener('syncError', handleSyncError);
      clearInterval(interval);
    };
  }, []);

  const loadDashboardData = () => {
    setLeads(linkedInLeadSyncService.getLeads());
    setMetrics(linkedInLeadSyncService.getMetrics());
    setCampaigns(linkedInLeadSyncService.getCampaigns());
    setConnectionStatus(linkedInLeadSyncService.getConnectionStatus());
  };

  const handleLeadStatusChange = (
    leadId: string,
    newStatus: LinkedInLead['leadStatus']
  ) => {
    linkedInLeadSyncService.updateLeadStatus(leadId, newStatus);
    loadDashboardData();
  };

  const handleSyncToCRM = async (leadId: string) => {
    const success = await linkedInLeadSyncService.syncToCRM(leadId);
    if (success) {
      setRealtimeActivity((prev) => [
        `🔄 Lead ${leadId} synced to FleetFlow CRM`,
        ...prev.slice(0, 9),
      ]);
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLeadScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getStatusColor = (status: LinkedInLead['leadStatus']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-600';
      case 'qualified':
        return 'bg-green-600';
      case 'contacted':
        return 'bg-purple-600';
      case 'converted':
        return 'bg-emerald-600';
      case 'disqualified':
        return 'bg-gray-600';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredLeads = leads.filter(
    (lead) => filterStatus === 'all' || lead.leadStatus === filterStatus
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-2 text-3xl font-bold text-white'>
          🔗 LinkedIn Lead Sync Dashboard
        </h2>
        <p className='text-gray-300'>
          Real-time LinkedIn lead generation and CRM integration
        </p>

        {/* Connection Status */}
        <div className='mt-4 flex items-center justify-center gap-4'>
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 ${
              connectionStatus.connected
                ? 'bg-green-600/20 text-green-400'
                : connectionStatus.hasCredentials
                  ? 'bg-yellow-600/20 text-yellow-400'
                  : 'bg-red-600/20 text-red-400'
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                connectionStatus.connected ? 'bg-green-400' : 'bg-yellow-400'
              }`}
            />
            <span className='text-sm font-medium'>
              {connectionStatus.connected
                ? 'API Connected'
                : 'Waiting for API credentials'}
            </span>
          </div>
          <div className='text-sm text-gray-400'>
            Case: {connectionStatus.caseId}
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Total Leads</p>
                <p className='text-2xl font-bold text-white'>
                  {metrics.totalLeads}
                </p>
              </div>
              <Users className='h-8 w-8 text-blue-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>New Today</p>
                <p className='text-2xl font-bold text-white'>
                  {metrics.newLeadsToday}
                </p>
              </div>
              <Zap className='h-8 w-8 text-green-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Conversion Rate</p>
                <p className='text-2xl font-bold text-white'>
                  {metrics.conversionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className='h-8 w-8 text-purple-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Avg Lead Score</p>
                <p
                  className={`text-2xl font-bold ${getLeadScoreColor(metrics.averageLeadScore)}`}
                >
                  {metrics.averageLeadScore.toFixed(0)}
                </p>
              </div>
              <Star className='h-8 w-8 text-yellow-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>High Quality</p>
                <p className='text-2xl font-bold text-white'>
                  {metrics.leadQualityDistribution.high}
                </p>
              </div>
              <CheckCircle2 className='h-8 w-8 text-emerald-400' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* LinkedIn Leads List */}
        <div className='xl:col-span-2'>
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Mail className='h-5 w-5 text-blue-400' />
                  LinkedIn Leads
                  <Badge className='ml-2 bg-blue-600'>
                    {filteredLeads.length}
                  </Badge>
                </CardTitle>

                {/* Filter Dropdown */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='rounded border border-white/20 bg-white/10 px-3 py-1 text-sm text-white'
                >
                  <option value='all'>All Leads</option>
                  <option value='new'>New</option>
                  <option value='qualified'>Qualified</option>
                  <option value='contacted'>Contacted</option>
                  <option value='converted'>Converted</option>
                  <option value='disqualified'>Disqualified</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className='max-h-96 space-y-3 overflow-y-auto'>
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className='cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10'
                  >
                    <div className='mb-3 flex items-start justify-between'>
                      <div>
                        <h4 className='font-semibold text-white'>
                          {lead.firstName} {lead.lastName}
                        </h4>
                        <p className='text-sm text-gray-300'>
                          {lead.jobTitle} at {lead.company}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {lead.email} {lead.phone && `• ${lead.phone}`}
                        </p>
                      </div>
                      <div className='text-right'>
                        <Badge
                          className={getLeadScoreBadgeColor(lead.leadScore)}
                        >
                          Score: {lead.leadScore}
                        </Badge>
                        <div className='mt-1'>
                          <Badge className={getStatusColor(lead.leadStatus)}>
                            {lead.leadStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className='mb-3 grid grid-cols-2 gap-3 text-sm'>
                      <div>
                        <div className='text-gray-300'>Campaign</div>
                        <div className='font-medium text-white'>
                          {lead.leadSource.campaign}
                        </div>
                      </div>
                      <div>
                        <div className='text-gray-300'>Submitted</div>
                        <div className='font-medium text-white'>
                          {new Date(
                            lead.leadData.submittedAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Custom Fields Preview */}
                    {lead.leadData.customFields &&
                      Object.keys(lead.leadData.customFields).length > 0 && (
                        <div className='mb-3'>
                          <div className='mb-1 text-xs text-gray-300'>
                            Key Details:
                          </div>
                          <div className='flex flex-wrap gap-1'>
                            {Object.entries(lead.leadData.customFields)
                              .slice(0, 3)
                              .map(([key, value]) => (
                                <Badge
                                  key={key}
                                  className='bg-gray-700 text-xs'
                                >
                                  {key}: {value}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Tags */}
                    <div className='mb-2 flex flex-wrap gap-1'>
                      {lead.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} className='bg-purple-700 text-xs'>
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className='flex gap-2'>
                      <select
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleLeadStatusChange(
                              lead.id,
                              e.target.value as LinkedInLead['leadStatus']
                            );
                          }
                        }}
                        value=''
                        className='flex-1 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700'
                      >
                        <option value=''>Update Status</option>
                        <option value='qualified'>Mark Qualified</option>
                        <option value='contacted'>Mark Contacted</option>
                        <option value='converted'>Mark Converted</option>
                        <option value='disqualified'>Mark Disqualified</option>
                      </select>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncToCRM(lead.id);
                        }}
                        className='rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700'
                      >
                        Sync to CRM
                      </button>

                      {lead.linkedInProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(lead.linkedInProfile, '_blank');
                          }}
                          className='rounded bg-gray-600 px-2 py-1 text-xs font-medium text-white hover:bg-gray-700'
                        >
                          <ExternalLink className='h-3 w-3' />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredLeads.length === 0 && (
                  <div className='py-8 text-center text-gray-400'>
                    <Mail className='mx-auto mb-3 h-12 w-12 opacity-50' />
                    <p>No leads match the current filter</p>
                    <p className='text-sm'>
                      LinkedIn leads will appear here when API is connected
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Campaign Performance & Activity */}
        <div className='space-y-6'>
          {/* Campaign Performance */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <BarChart3 className='h-5 w-5 text-green-400' />
                Campaign Performance
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className='rounded bg-white/5 p-3'>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='font-semibold text-white'>
                      {campaign.name}
                    </span>
                    <Badge
                      className={
                        campaign.status === 'active'
                          ? 'bg-green-600'
                          : 'bg-gray-600'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>

                  <div className='mb-3 grid grid-cols-2 gap-2 text-xs'>
                    <div>
                      <div className='text-gray-300'>Leads</div>
                      <div className='font-semibold text-white'>
                        {campaign.leads}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-300'>CPL</div>
                      <div className='font-semibold text-white'>
                        ${campaign.costPerLead.toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-300'>CTR</div>
                      <div className='font-semibold text-white'>
                        {campaign.performance.ctr}%
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-300'>Quality</div>
                      <div
                        className={`font-semibold ${getLeadScoreColor(campaign.performance.leadQuality)}`}
                      >
                        {campaign.performance.leadQuality.toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <div className='mb-2'>
                    <div className='mb-1 flex justify-between text-xs'>
                      <span className='text-gray-300'>Budget</span>
                      <span className='text-white'>
                        ${campaign.spent.toLocaleString()}/$
                        {campaign.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={(campaign.spent / campaign.budget) * 100}
                      className='h-2'
                    />
                  </div>

                  <div className='text-xs text-gray-400'>
                    Target:{' '}
                    {campaign.targetAudience.jobTitles.slice(0, 2).join(', ')}
                    {campaign.targetAudience.jobTitles.length > 2 &&
                      ` +${campaign.targetAudience.jobTitles.length - 2} more`}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Lead Quality Distribution */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Star className='h-5 w-5 text-yellow-400' />
                Lead Quality Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-green-500' />
                    <span className='text-sm text-white'>
                      High Quality (80-100)
                    </span>
                  </div>
                  <span className='font-semibold text-white'>
                    {metrics.leadQualityDistribution.high}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-yellow-500' />
                    <span className='text-sm text-white'>
                      Medium Quality (60-79)
                    </span>
                  </div>
                  <span className='font-semibold text-white'>
                    {metrics.leadQualityDistribution.medium}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-red-500' />
                    <span className='text-sm text-white'>
                      Low Quality (1-59)
                    </span>
                  </div>
                  <span className='font-semibold text-white'>
                    {metrics.leadQualityDistribution.low}
                  </span>
                </div>
              </div>

              <div className='rounded bg-green-600/20 p-3 text-sm'>
                <div className='text-green-400'>
                  Quality Score: {metrics.averageLeadScore.toFixed(1)}/100
                </div>
                <div className='text-white'>
                  {(
                    (metrics.leadQualityDistribution.high /
                      metrics.totalLeads) *
                    100
                  ).toFixed(0)}
                  % high-quality leads
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Clock className='h-5 w-5 text-blue-400' />
                Live LinkedIn Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-48 space-y-2 overflow-y-auto'>
                {realtimeActivity.map((activity, index) => (
                  <div
                    key={index}
                    className='rounded border-l-2 border-blue-400 bg-white/5 p-2 text-xs text-gray-300'
                  >
                    {activity}
                  </div>
                ))}

                {realtimeActivity.length === 0 && (
                  <div className='py-4 text-center text-sm text-gray-400'>
                    <Clock className='mx-auto mb-2 h-8 w-8 opacity-50' />
                    <p>Monitoring LinkedIn lead activity...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
