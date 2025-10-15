'use client';

import {
  Activity,
  BarChart3,
  CheckCircle,
  Lightbulb,
  Play,
  Settings,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CampaignMetrics } from '../services/DynamicCampaignOptimizationService';
import { dynamicCampaignOptimizationService } from '../services/DynamicCampaignOptimizationService';

export default function DynamicCampaignOptimization() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'campaigns' | 'optimizations' | 'market'
  >('overview');
  const [activeCampaigns, setActiveCampaigns] = useState<CampaignMetrics[]>([]);
  const [performanceSummary, setPerformanceSummary] = useState<any>(null);
  const [marketIntelligence, setMarketIntelligence] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const campaigns = dynamicCampaignOptimizationService.getActiveCampaigns();
      setActiveCampaigns(campaigns);

      const summary =
        dynamicCampaignOptimizationService.getCampaignPerformanceSummary();
      setPerformanceSummary(summary);

      const market = dynamicCampaignOptimizationService.getMarketIntelligence();
      setMarketIntelligence(market);
    } catch (error) {
      console.error('Failed to load optimization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyOptimization = async (
    campaignId: string,
    recommendationId: string
  ) => {
    try {
      const success =
        await dynamicCampaignOptimizationService.applyOptimizationRecommendation(
          campaignId,
          recommendationId
        );
      if (success) {
        loadData();
        alert('✅ Optimization applied successfully!');
      } else {
        alert('❌ Failed to apply optimization');
      }
    } catch (error) {
      console.error('Failed to apply optimization:', error);
      alert('❌ Error applying optimization');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className='h-4 w-4 text-green-500' />;
    if (value < 0) return <TrendingDown className='h-4 w-4 text-red-500' />;
    return <Activity className='h-4 w-4 text-gray-500' />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <Zap className='mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500' />
          <p className='text-gray-500'>Loading Campaign Optimization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-xl bg-gradient-to-r from-blue-500 to-green-600 p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-white/20'>
              <Zap className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>
                🎯 Dynamic Campaign Optimization
              </h1>
              <p className='text-blue-100'>
                AI-powered real-time campaign adjustment and market adaptation
              </p>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold'>
              {performanceSummary?.totalActiveCampaigns || 0}
            </div>
            <div className='text-sm text-blue-100'>Active Campaigns</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 className='mr-2 inline h-4 w-4' />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'campaigns'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Target className='mr-2 inline h-4 w-4' />
          Campaigns ({activeCampaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('optimizations')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'optimizations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Lightbulb className='mr-2 inline h-4 w-4' />
          Optimizations
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'market'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className='mr-2 inline h-4 w-4' />
          Market Intel
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Performance Summary */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Campaign Performance
              </h3>
              <BarChart3 className='h-6 w-6 text-blue-500' />
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Total Revenue:</span>
                <span className='font-semibold text-green-600'>
                  ${performanceSummary?.totalRevenue?.toLocaleString() || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Avg Conversion:</span>
                <span className='font-semibold text-blue-600'>
                  {Math.round(performanceSummary?.averageConversionRate || 0)}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Optimizations Applied:
                </span>
                <span className='font-semibold text-purple-600'>
                  {performanceSummary?.totalOptimizationsApplied || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Market Conditions */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Market Conditions
              </h3>
              <TrendingUp className='h-6 w-6 text-green-500' />
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Fuel Price:</span>
                <span className='font-semibold text-gray-800'>
                  ${marketIntelligence?.fuelPrice || 0}/gal
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Fuel Trend:</span>
                <span className='font-semibold text-blue-600 capitalize'>
                  {marketIntelligence?.fuelPriceTrend || 'Stable'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Demand Index:</span>
                <span className='font-semibold text-green-600'>
                  {marketIntelligence?.demandIndex || 0}/100
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Competition:</span>
                <span className='font-semibold text-orange-600 capitalize'>
                  {marketIntelligence?.competitionLevel || 'Medium'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Active Campaigns
              </h3>
              <Target className='h-6 w-6 text-purple-500' />
            </div>
            <div className='space-y-2'>
              {activeCampaigns.slice(0, 3).map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className='flex items-center justify-between rounded bg-gray-50 p-2'
                >
                  <div>
                    <div className='text-sm font-medium text-gray-800'>
                      {campaign.campaignName}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {campaign.currentMetrics.leadsGenerated} leads
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-semibold text-green-600'>
                      $
                      {campaign.currentMetrics.revenueGenerated.toLocaleString()}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {Math.round(campaign.currentMetrics.conversionRate)}% conv
                    </div>
                  </div>
                </div>
              ))}
              {activeCampaigns.length > 3 && (
                <div className='text-center text-sm text-gray-500'>
                  +{activeCampaigns.length - 3} more campaigns
                </div>
              )}
            </div>
          </div>

          {/* Optimization Opportunities */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-3'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Optimization Opportunities
              </h3>
              <Lightbulb className='h-6 w-6 text-yellow-500' />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {activeCampaigns.slice(0, 3).map((campaign) => {
                const criticalOpts =
                  campaign.optimizationRecommendations.filter(
                    (r) => r.priority === 'critical'
                  );
                const highOpts = campaign.optimizationRecommendations.filter(
                  (r) => r.priority === 'high'
                );

                return (
                  <div
                    key={campaign.campaignId}
                    className='rounded-lg bg-gray-50 p-4'
                  >
                    <h4 className='mb-2 font-medium text-gray-800'>
                      {campaign.campaignName}
                    </h4>
                    <div className='space-y-1 text-sm'>
                      {criticalOpts.length > 0 && (
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-red-500'></div>
                          <span className='text-red-600'>
                            {criticalOpts.length} Critical
                          </span>
                        </div>
                      )}
                      {highOpts.length > 0 && (
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-orange-500'></div>
                          <span className='text-orange-600'>
                            {highOpts.length} High Priority
                          </span>
                        </div>
                      )}
                      {criticalOpts.length === 0 && highOpts.length === 0 && (
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 rounded-full bg-green-500'></div>
                          <span className='text-green-600'>Optimized</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className='space-y-4'>
          {activeCampaigns.map((campaign) => (
            <div
              key={campaign.campaignId}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h3 className='mb-1 text-xl font-semibold text-gray-800'>
                    {campaign.campaignName}
                  </h3>
                  <p className='mb-2 text-gray-600'>
                    Target: {campaign.targetType.replace('_', ' ')}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    <span>
                      Started: {campaign.startDate.toLocaleDateString()}
                    </span>
                    <span>
                      Last Optimized:{' '}
                      {campaign.lastOptimized.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-600'>
                    ${campaign.currentMetrics.revenueGenerated.toLocaleString()}
                  </div>
                  <div className='text-sm text-gray-500'>Revenue Generated</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded bg-blue-50 p-3 text-center'>
                  <div className='text-lg font-bold text-blue-600'>
                    {campaign.currentMetrics.leadsGenerated}
                  </div>
                  <div className='text-xs text-blue-600'>Leads Generated</div>
                </div>
                <div className='rounded bg-green-50 p-3 text-center'>
                  <div className='text-lg font-bold text-green-600'>
                    {Math.round(campaign.currentMetrics.conversionRate)}%
                  </div>
                  <div className='text-xs text-green-600'>Conversion Rate</div>
                </div>
                <div className='rounded bg-purple-50 p-3 text-center'>
                  <div className='text-lg font-bold text-purple-600'>
                    ${campaign.currentMetrics.costPerLead}
                  </div>
                  <div className='text-xs text-purple-600'>Cost per Lead</div>
                </div>
                <div className='rounded bg-orange-50 p-3 text-center'>
                  <div className='text-lg font-bold text-orange-600'>
                    {campaign.currentMetrics.aiStaffUtilized}
                  </div>
                  <div className='text-xs text-orange-600'>AI Staff Used</div>
                </div>
              </div>

              {/* Performance Trends */}
              <div className='mb-6'>
                <h4 className='mb-3 font-semibold text-gray-800'>
                  Performance Trends
                </h4>
                <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                  <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                    {getTrendIcon(campaign.performanceTrends.dailyLeadGrowth)}
                    <div>
                      <div className='text-sm font-medium'>Lead Growth</div>
                      <div className='text-xs text-gray-600'>
                        {campaign.performanceTrends.dailyLeadGrowth.toFixed(1)}
                        /day
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                    {getTrendIcon(campaign.performanceTrends.conversionTrend)}
                    <div>
                      <div className='text-sm font-medium'>Conversion</div>
                      <div className='text-xs text-gray-600'>
                        {campaign.performanceTrends.conversionTrend > 0
                          ? '+'
                          : ''}
                        {campaign.performanceTrends.conversionTrend.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                    {getTrendIcon(-campaign.performanceTrends.costTrend)}
                    <div>
                      <div className='text-sm font-medium'>Cost Trend</div>
                      <div className='text-xs text-gray-600'>
                        ${campaign.performanceTrends.costTrend > 0 ? '+' : ''}
                        {campaign.performanceTrends.costTrend.toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                    {getTrendIcon(campaign.performanceTrends.efficiencyTrend)}
                    <div>
                      <div className='text-sm font-medium'>Efficiency</div>
                      <div className='text-xs text-gray-600'>
                        {campaign.performanceTrends.efficiencyTrend.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Conditions */}
              <div className='mb-6'>
                <h4 className='mb-3 font-semibold text-gray-800'>
                  Current Market Conditions
                </h4>
                <div className='flex flex-wrap gap-2'>
                  <span className='rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'>
                    Fuel: ${campaign.marketConditions.fuelPrice}/gal (
                    {campaign.marketConditions.fuelTrend})
                  </span>
                  <span className='rounded-full bg-green-100 px-3 py-1 text-sm text-green-800'>
                    Demand: {campaign.marketConditions.demandIndex}/100
                  </span>
                  <span className='rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800'>
                    Competition: {campaign.marketConditions.competitionLevel}
                  </span>
                  <span className='rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800'>
                    Seasonal:{' '}
                    {(campaign.marketConditions.seasonalFactor * 100).toFixed(
                      0
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          ))}

          {activeCampaigns.length === 0 && (
            <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center'>
              <Target className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                No Active Campaigns
              </h3>
              <p className='mb-4 text-gray-500'>
                Start a campaign from the overview to begin optimization
                monitoring.
              </p>
              <button className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
                Start First Campaign
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'optimizations' && (
        <div className='space-y-4'>
          {activeCampaigns.map((campaign) => (
            <div
              key={campaign.campaignId}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
            >
              <div className='mb-4'>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {campaign.campaignName}
                </h3>
                <p className='text-gray-600'>
                  {campaign.optimizationRecommendations.length} optimization
                  recommendations
                </p>
              </div>

              <div className='space-y-3'>
                {campaign.optimizationRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className='rounded-lg border border-gray-200 p-4'
                  >
                    <div className='mb-3 flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='mb-1 flex items-center gap-2'>
                          <h4 className='font-semibold text-gray-800'>
                            {rec.title}
                          </h4>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(rec.priority)} text-white`}
                          >
                            {rec.priority}
                          </span>
                          {rec.applied && (
                            <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                              Applied
                            </span>
                          )}
                        </div>
                        <p className='mb-2 text-sm text-gray-600'>
                          {rec.description}
                        </p>

                        <div className='grid grid-cols-3 gap-4 text-sm'>
                          <div>
                            <span className='text-gray-500'>
                              Revenue Impact:
                            </span>
                            <div className='font-semibold text-green-600'>
                              +$
                              {rec.expectedImpact.revenueIncrease.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className='text-gray-500'>Cost Savings:</span>
                            <div className='font-semibold text-blue-600'>
                              -$
                              {rec.expectedImpact.costReduction.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className='text-gray-500'>
                              Time Estimate:
                            </span>
                            <div className='font-semibold text-purple-600'>
                              {rec.implementation.estimatedTime} min
                            </div>
                          </div>
                        </div>
                      </div>

                      {!rec.applied && (
                        <button
                          onClick={() =>
                            applyOptimization(campaign.campaignId, rec.id)
                          }
                          className='ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
                        >
                          <Play className='mr-2 inline h-4 w-4' />
                          Apply
                        </button>
                      )}
                    </div>

                    {!rec.applied && (
                      <div className='mt-3 border-t border-gray-100 pt-3'>
                        <div className='mb-2 text-sm text-gray-600'>
                          <strong>Risk Level:</strong>
                          <span
                            className={`ml-2 font-medium ${getRiskColor(rec.implementation.riskLevel)}`}
                          >
                            {rec.implementation.riskLevel}
                          </span>
                        </div>
                        <div>
                          <strong className='text-sm text-gray-700'>
                            Implementation Steps:
                          </strong>
                          <ol className='mt-1 ml-4 list-decimal text-sm text-gray-600'>
                            {rec.implementation.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {campaign.optimizationRecommendations.length === 0 && (
                  <div className='py-8 text-center text-gray-500'>
                    <CheckCircle className='mx-auto mb-2 h-8 w-8' />
                    <p>
                      This campaign is currently optimized. No recommendations
                      available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'market' && marketIntelligence && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Market Overview */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Market Intelligence
              </h3>
              <TrendingUp className='h-6 w-6 text-green-500' />
            </div>
            <div className='space-y-4'>
              <div>
                <div className='mb-1 text-sm text-gray-600'>
                  Fuel Price Trend
                </div>
                <div className='font-semibold text-blue-600'>
                  {marketIntelligence.fuelPriceTrend}
                </div>
              </div>
              <div>
                <div className='mb-1 text-sm text-gray-600'>Demand Index</div>
                <div className='font-semibold text-green-600'>
                  {marketIntelligence.demandIndex}/100
                </div>
              </div>
              <div>
                <div className='mb-1 text-sm text-gray-600'>
                  Competition Level
                </div>
                <div className='font-semibold text-orange-600 capitalize'>
                  {marketIntelligence.competitionLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Campaigns */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Recommended Campaigns
              </h3>
              <Target className='h-6 w-6 text-purple-500' />
            </div>
            <div className='space-y-2'>
              {marketIntelligence.recommendedCampaigns.map(
                (campaignId: string, index: number) => (
                  <div
                    key={campaignId}
                    className='flex items-center gap-3 rounded bg-purple-50 p-3'
                  >
                    <span className='font-medium text-purple-600'>
                      #{index + 1}
                    </span>
                    <span className='text-gray-800 capitalize'>
                      {campaignId.replace('_', ' ')}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Market Opportunities */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-2'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Market Opportunities
              </h3>
              <Lightbulb className='h-6 w-6 text-yellow-500' />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {marketIntelligence.marketOpportunities.map(
                (opportunity: string, index: number) => (
                  <div key={index} className='rounded-lg bg-yellow-50 p-3'>
                    <div className='flex items-start gap-3'>
                      <Lightbulb className='mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600' />
                      <p className='text-sm text-gray-800'>{opportunity}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='font-semibold text-gray-800'>Quick Actions</h3>
            <p className='text-sm text-gray-600'>
              Apply optimizations across all campaigns
            </p>
          </div>
          <div className='flex gap-2'>
            <button className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'>
              <Zap className='mr-2 inline h-4 w-4' />
              Optimize All
            </button>
            <button className='rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700'>
              <Settings className='mr-2 inline h-4 w-4' />
              Auto-Optimize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

