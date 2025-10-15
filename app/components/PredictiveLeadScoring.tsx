'use client';

import {
  Activity,
  AlertTriangle,
  BarChart3,
  DollarSign,
  PieChart,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
  LeadData,
  LeadInsights,
  LeadScore,
} from '../services/PredictiveLeadScoringService';
import { predictiveLeadScoringService } from '../services/PredictiveLeadScoringService';

export default function PredictiveLeadScoring() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'leads' | 'insights' | 'analytics'
  >('overview');
  const [leadsWithScores, setLeadsWithScores] = useState<
    Array<{ lead: LeadData; score: LeadScore }>
  >([]);
  const [insights, setInsights] = useState<LeadInsights | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const leads = predictiveLeadScoringService.getAllLeadsWithScores();
      setLeadsWithScores(leads);

      const insightsData = predictiveLeadScoringService.getLeadInsights();
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load lead scoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'A':
        return 'bg-red-500';
      case 'B':
        return 'bg-orange-500';
      case 'C':
        return 'bg-yellow-500';
      case 'D':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'A':
        return 'bg-red-100 text-red-800';
      case 'B':
        return 'bg-orange-100 text-orange-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredLeads = leadsWithScores.filter(({ lead, score }) => {
    const matchesPriority =
      selectedPriority === 'all' || score.priorityLevel === selectedPriority;
    const matchesSearch =
      !searchTerm ||
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.industry.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPriority && matchesSearch;
  });

  const priorityStats = {
    A: leadsWithScores.filter(({ score }) => score.priorityLevel === 'A')
      .length,
    B: leadsWithScores.filter(({ score }) => score.priorityLevel === 'B')
      .length,
    C: leadsWithScores.filter(({ score }) => score.priorityLevel === 'C')
      .length,
    D: leadsWithScores.filter(({ score }) => score.priorityLevel === 'D')
      .length,
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <Target className='mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500' />
          <p className='text-gray-500'>Loading Lead Intelligence...</p>
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
              <Target className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>
                🎯 Predictive Lead Intelligence
              </h1>
              <p className='text-blue-100'>
                AI-powered lead scoring and conversion optimization
              </p>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold'>{leadsWithScores.length}</div>
            <div className='text-sm text-blue-100'>Total Leads</div>
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
          onClick={() => setActiveTab('leads')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'leads'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className='mr-2 inline h-4 w-4' />
          Leads ({filteredLeads.length})
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'insights'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className='mr-2 inline h-4 w-4' />
          Insights
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PieChart className='mr-2 inline h-4 w-4' />
          Analytics
        </button>
      </div>

      {/* Search and Filter Bar (for leads tab) */}
      {activeTab === 'leads' && (
        <div className='flex items-center gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <input
              type='text'
              placeholder='Search leads by company, contact, or industry...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className='rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Priorities</option>
            <option value='A'>Priority A (Hot)</option>
            <option value='B'>Priority B</option>
            <option value='C'>Priority C</option>
            <option value='D'>Priority D (Cold)</option>
          </select>
        </div>
      )}

      {/* Content */}
      {activeTab === 'overview' && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Priority Distribution */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Lead Priority Distribution
              </h3>
              <Target className='h-6 w-6 text-blue-500' />
            </div>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full bg-red-500'></div>
                  <span className='text-sm font-medium'>Priority A (Hot)</span>
                </div>
                <span className='font-bold text-red-600'>
                  {priorityStats.A}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full bg-orange-500'></div>
                  <span className='text-sm font-medium'>Priority B</span>
                </div>
                <span className='font-bold text-orange-600'>
                  {priorityStats.B}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
                  <span className='text-sm font-medium'>Priority C</span>
                </div>
                <span className='font-bold text-yellow-600'>
                  {priorityStats.C}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full bg-gray-500'></div>
                  <span className='text-sm font-medium'>Priority D (Cold)</span>
                </div>
                <span className='font-bold text-gray-600'>
                  {priorityStats.D}
                </span>
              </div>
            </div>
          </div>

          {/* Top Opportunities */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Top Opportunities
              </h3>
              <DollarSign className='h-6 w-6 text-green-500' />
            </div>
            <div className='space-y-3'>
              {leadsWithScores
                .sort(
                  (a, b) => b.score.opportunityValue - a.score.opportunityValue
                )
                .slice(0, 5)
                .map(({ lead, score }) => (
                  <div
                    key={lead.id}
                    className='flex items-center justify-between rounded bg-gray-50 p-2'
                  >
                    <div>
                      <div className='text-sm font-medium text-gray-800'>
                        {lead.companyName}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {score.priorityLevel} Priority
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-bold text-green-600'>
                        ${score.opportunityValue.toLocaleString()}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {score.conversionProbability}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Conversion Metrics */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Conversion Intelligence
              </h3>
              <TrendingUp className='h-6 w-6 text-purple-500' />
            </div>
            <div className='space-y-3'>
              <div className='rounded bg-purple-50 p-3 text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {Math.round(
                    leadsWithScores.reduce(
                      (sum, { score }) => sum + score.conversionProbability,
                      0
                    ) / leadsWithScores.length
                  ) || 0}
                  %
                </div>
                <div className='text-sm text-purple-600'>
                  Average Conversion Probability
                </div>
              </div>
              <div className='rounded bg-blue-50 p-3 text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  $
                  {Math.round(
                    leadsWithScores.reduce(
                      (sum, { score }) => sum + score.opportunityValue,
                      0
                    ) / leadsWithScores.length
                  ).toLocaleString()}
                </div>
                <div className='text-sm text-blue-600'>
                  Average Opportunity Value
                </div>
              </div>
              <div className='rounded bg-green-50 p-3 text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {Math.round(
                    leadsWithScores.reduce(
                      (sum, { score }) => sum + score.overallScore,
                      0
                    ) / leadsWithScores.length
                  )}
                </div>
                <div className='text-sm text-green-600'>Average Lead Score</div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          {insights && (
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-3'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Market Intelligence
                </h3>
                <Activity className='h-6 w-6 text-indigo-500' />
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <h4 className='mb-2 font-medium text-gray-700'>
                    Hot Industries
                  </h4>
                  <div className='space-y-1'>
                    {insights.marketTrends.hotIndustries
                      .slice(0, 3)
                      .map((industry, index) => (
                        <div
                          key={index}
                          className='flex justify-between text-sm'
                        >
                          <span>{industry.industry}</span>
                          <span className='font-medium text-green-600'>
                            {Math.round(industry.opportunity)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className='mb-2 font-medium text-gray-700'>
                    Emerging Pain Points
                  </h4>
                  <div className='space-y-1'>
                    {insights.marketTrends.emergingPainPoints
                      .slice(0, 3)
                      .map((pain, index) => (
                        <div key={index} className='text-sm text-gray-600'>
                          • {pain}
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className='mb-2 font-medium text-gray-700'>
                    Competitive Landscape
                  </h4>
                  <div className='space-y-1'>
                    {Object.entries(insights.marketTrends.competitiveLandscape)
                      .slice(0, 3)
                      .map(([competitor, mentions]) => (
                        <div
                          key={competitor}
                          className='flex justify-between text-sm'
                        >
                          <span>{competitor}</span>
                          <span className='font-medium text-orange-600'>
                            {mentions}x
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'leads' && (
        <div className='space-y-4'>
          {filteredLeads.map(({ lead, score }) => (
            <div
              key={lead.id}
              className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h3 className='text-xl font-semibold text-gray-800'>
                      {lead.companyName}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getPriorityBadgeColor(score.priorityLevel)}`}
                    >
                      Priority {score.priorityLevel}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${lead.qualificationStatus === 'qualified' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {lead.qualificationStatus}
                    </span>
                  </div>
                  <div className='mb-3 grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4'>
                    <div>
                      <span className='font-medium'>Contact:</span>{' '}
                      {lead.contactName || 'N/A'}
                    </div>
                    <div>
                      <span className='font-medium'>Industry:</span>{' '}
                      {lead.industry}
                    </div>
                    <div>
                      <span className='font-medium'>Size:</span>{' '}
                      {lead.companySize}
                    </div>
                    <div>
                      <span className='font-medium'>Location:</span>{' '}
                      {lead.location.city}, {lead.location.state}
                    </div>
                  </div>
                </div>
                <div className='ml-4 text-right'>
                  <div className='text-3xl font-bold text-blue-600'>
                    {score.overallScore}
                  </div>
                  <div className='text-sm text-gray-500'>Lead Score</div>
                  <div className='mt-1 text-lg font-semibold text-green-600'>
                    ${score.opportunityValue.toLocaleString()}
                  </div>
                  <div className='text-sm text-gray-500'>Opportunity Value</div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className='mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-5'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-blue-600'>
                    {score.scoreBreakdown.demographicFit}
                  </div>
                  <div className='text-xs text-gray-600'>Demographic Fit</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-green-600'>
                    {score.scoreBreakdown.behavioralEngagement}
                  </div>
                  <div className='text-xs text-gray-600'>Engagement</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-purple-600'>
                    {score.scoreBreakdown.budgetAlignment}
                  </div>
                  <div className='text-xs text-gray-600'>Budget Fit</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-orange-600'>
                    {score.scoreBreakdown.urgencyTiming}
                  </div>
                  <div className='text-xs text-gray-600'>Urgency</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-red-600'>
                    {score.scoreBreakdown.competitivePosition}
                  </div>
                  <div className='text-xs text-gray-600'>Competition</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className='mb-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded bg-blue-50 p-3 text-center'>
                  <div className='text-xl font-bold text-blue-600'>
                    {score.conversionProbability}%
                  </div>
                  <div className='text-sm text-blue-600'>
                    Conversion Probability
                  </div>
                </div>
                <div className='rounded bg-green-50 p-3 text-center'>
                  <div className='text-xl font-bold text-green-600'>
                    {lead.engagementHistory.contactCount}
                  </div>
                  <div className='text-sm text-green-600'>Total Contacts</div>
                </div>
                <div className='rounded bg-purple-50 p-3 text-center'>
                  <div className='text-xl font-bold text-purple-600'>
                    {Math.round(lead.engagementHistory.responseRate)}%
                  </div>
                  <div className='text-sm text-purple-600'>Response Rate</div>
                </div>
                <div className='rounded bg-orange-50 p-3 text-center'>
                  <div className='text-xl font-bold text-orange-600'>
                    {lead.behavioralSignals.urgencyLevel}
                  </div>
                  <div className='text-sm text-orange-600'>Urgency Level</div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className='border-t border-gray-200 pt-4'>
                <h4 className='mb-3 font-semibold text-gray-800'>
                  Recommended Actions
                </h4>
                <div className='space-y-2'>
                  {score.recommendedActions.slice(0, 2).map((action, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded bg-blue-50 p-3'
                    >
                      <div>
                        <div className='font-medium text-gray-800'>
                          {action.action}
                        </div>
                        <div className='text-sm text-gray-600'>
                          Expected Value: $
                          {action.expectedValue.toLocaleString()}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm font-medium text-blue-600'>
                          {action.timeframe}
                        </div>
                        <div
                          className={`rounded-full px-2 py-1 text-xs ${
                            action.priority === 'immediate'
                              ? 'bg-red-100 text-red-800'
                              : action.priority === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {action.priority}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {score.riskFactors.length > 0 && (
                <div className='mt-4 border-t border-gray-200 pt-4'>
                  <h4 className='mb-3 flex items-center gap-2 font-semibold text-gray-800'>
                    <AlertTriangle className='h-4 w-4 text-yellow-500' />
                    Risk Factors
                  </h4>
                  <div className='space-y-1'>
                    {score.riskFactors.map((risk, index) => (
                      <div
                        key={index}
                        className='rounded bg-yellow-50 p-2 text-sm text-yellow-700'
                      >
                        • {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center'>
              <Users className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                No Leads Found
              </h3>
              <p className='mb-4 text-gray-500'>
                {selectedPriority !== 'all' || searchTerm
                  ? 'Try adjusting your filters or search terms.'
                  : 'Lead scoring data will appear here once leads are processed.'}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'insights' && insights && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Actionable Recommendations */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Actionable Recommendations
              </h3>
              <Lightbulb className='h-6 w-6 text-yellow-500' />
            </div>
            <div className='space-y-4'>
              {insights.actionableRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 p-4'
                >
                  <div className='mb-2 flex items-start justify-between'>
                    <h4 className='font-semibold text-gray-800'>{rec.title}</h4>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        rec.implementationEffort === 'low'
                          ? 'bg-green-100 text-green-800'
                          : rec.implementationEffort === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {rec.implementationEffort} effort
                    </span>
                  </div>
                  <p className='mb-3 text-sm text-gray-600'>
                    {rec.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>
                      Expected Impact:
                    </span>
                    <span className='font-semibold text-green-600'>
                      +{rec.expectedImpact}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Insights */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Scoring Performance
              </h3>
              <TrendingUp className='h-6 w-6 text-blue-500' />
            </div>
            <div className='space-y-4'>
              <div>
                <h4 className='mb-2 font-medium text-gray-700'>
                  Average Score by Source
                </h4>
                <div className='space-y-2'>
                  {Object.entries(
                    insights.scoringInsights.averageScoreBySource
                  ).map(([source, score]) => (
                    <div key={source} className='flex justify-between text-sm'>
                      <span className='capitalize'>
                        {source.replace('_', ' ')}
                      </span>
                      <span className='font-medium text-blue-600'>
                        {score}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className='mb-2 font-medium text-gray-700'>
                  Conversion Rate by Priority
                </h4>
                <div className='space-y-2'>
                  {Object.entries(
                    insights.scoringInsights.conversionRateByPriority
                  ).map(([priority, rate]) => (
                    <div
                      key={priority}
                      className='flex justify-between text-sm'
                    >
                      <span>Priority {priority}</span>
                      <span className='font-medium text-green-600'>
                        {rate}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Segments */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-2'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Top Performing Segments
              </h3>
              <Star className='h-6 w-6 text-purple-500' />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {insights.scoringInsights.topPerformingSegments.map(
                (segment, index) => (
                  <div key={index} className='rounded-lg bg-purple-50 p-4'>
                    <h4 className='mb-2 font-semibold text-purple-800'>
                      {segment.segment}
                    </h4>
                    <div className='space-y-1 text-sm'>
                      <div className='flex justify-between'>
                        <span>Avg Score:</span>
                        <span className='font-medium'>
                          {segment.avgScore}/100
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Conversion Rate:</span>
                        <span className='font-medium text-green-600'>
                          {segment.conversionRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Lead Quality Distribution */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              Lead Quality Distribution
            </h3>
            <div className='space-y-3'>
              {['A', 'B', 'C', 'D'].map((priority) => {
                const count =
                  priorityStats[priority as keyof typeof priorityStats];
                const percentage =
                  leadsWithScores.length > 0
                    ? (count / leadsWithScores.length) * 100
                    : 0;
                return (
                  <div
                    key={priority}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`h-4 w-4 rounded-full ${getPriorityColor(priority)}`}
                      ></div>
                      <span className='font-medium'>Priority {priority}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-24 rounded-full bg-gray-200'>
                        <div
                          className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className='w-12 text-right text-sm font-medium'>
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opportunity Pipeline */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              Opportunity Pipeline
            </h3>
            <div className='space-y-3'>
              {[
                {
                  label: 'Hot Leads (A)',
                  value: priorityStats.A,
                  color: 'bg-red-500',
                },
                {
                  label: 'Warm Leads (B)',
                  value: priorityStats.B,
                  color: 'bg-orange-500',
                },
                {
                  label: 'Cool Leads (C)',
                  value: priorityStats.C,
                  color: 'bg-yellow-500',
                },
                {
                  label: 'Cold Leads (D)',
                  value: priorityStats.D,
                  color: 'bg-gray-500',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm text-gray-600'>{item.label}</span>
                  <div className='flex items-center gap-2'>
                    <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                    <span className='font-medium'>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Model Performance */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-2'>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              AI Model Performance
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='text-center'>
                <div className='mb-2 text-3xl font-bold text-blue-600'>
                  {leadsWithScores.length > 0
                    ? Math.round(
                        leadsWithScores.reduce(
                          (sum, { score }) => sum + score.confidenceLevel,
                          0
                        ) / leadsWithScores.length
                      )
                    : 0}
                  %
                </div>
                <div className='text-sm text-gray-600'>Average Confidence</div>
                <div className='mt-1 text-xs text-gray-500'>
                  Model reliability score
                </div>
              </div>
              <div className='text-center'>
                <div className='mb-2 text-3xl font-bold text-green-600'>
                  {insights?.scoringInsights.topPerformingSegments[0]
                    ?.conversionRate || 0}
                  %
                </div>
                <div className='text-sm text-gray-600'>
                  Best Segment Conversion
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  Highest performing segment
                </div>
              </div>
              <div className='text-center'>
                <div className='mb-2 text-3xl font-bold text-purple-600'>
                  {Math.round(
                    leadsWithScores.reduce(
                      (sum, { score }) => sum + score.opportunityValue,
                      0
                    ) / 1000000
                  ) || 0}
                  M
                </div>
                <div className='text-sm text-gray-600'>
                  Total Pipeline Value
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  Estimated opportunity value
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

