'use client';

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUp,
  Award,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Crown,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Heart,
  Info,
  Mail,
  MessageSquare,
  Percent,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BrokerCRMService } from '../services/BrokerCRMService';

interface BrokerEnhancedCRMProps {
  brokerId: string;
}

const BrokerEnhancedCRM: React.FC<BrokerEnhancedCRMProps> = ({ brokerId }) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'relationships'
    | 'opportunities'
    | 'contracts'
    | 'preferences'
    | 'intelligence'
  >('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const crmService = BrokerCRMService.getInstance();

  useEffect(() => {
    loadDashboardData();
  }, [brokerId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, relationships, opportunities, contracts] =
        await Promise.all([
          crmService.getCRMDashboard(brokerId),
          crmService.getCustomerRelationshipScores(brokerId),
          crmService.getUpsellOpportunities(brokerId),
          crmService.getContractTracking(brokerId),
        ]);

      setDashboardData({
        dashboard,
        relationships,
        opportunities,
        contracts,
      });
    } catch (error) {
      console.error('Error loading CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRelationshipStageColor = (stage: string) => {
    switch (stage) {
      case 'strategic':
        return 'text-purple-600 bg-purple-100';
      case 'established':
        return 'text-blue-600 bg-blue-100';
      case 'new':
        return 'text-green-600 bg-green-100';
      case 'at_risk':
        return 'text-red-600 bg-red-100';
      case 'prospect':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      case 'high':
        return <AlertCircle className='h-4 w-4 text-orange-500' />;
      case 'medium':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'low':
        return <Info className='h-4 w-4 text-blue-500' />;
      default:
        return <Info className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'closed_won':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'closed_lost':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'negotiating':
        return <MessageSquare className='h-4 w-4 text-blue-500' />;
      case 'proposal_sent':
        return <FileText className='h-4 w-4 text-purple-500' />;
      case 'qualified':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'identified':
        return <Eye className='h-4 w-4 text-yellow-500' />;
      default:
        return <Activity className='h-4 w-4 text-gray-500' />;
    }
  };

  if (loading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500'></div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className='space-y-6'>
      {/* Customer Metrics */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Total Customers
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {dashboardData.dashboard.customerMetrics.totalCustomers}
              </p>
            </div>
            <Users className='h-8 w-8 text-blue-500' />
          </div>
          <div className='mt-2 flex items-center text-sm text-blue-600'>
            <ArrowUp className='mr-1 h-4 w-4' />
            <span>
              {dashboardData.dashboard.customerMetrics.newCustomersThisMonth}{' '}
              new this month
            </span>
          </div>
        </div>

        <div className='rounded-lg border-l-4 border-green-500 bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Avg Customer Value
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(
                  dashboardData.dashboard.customerMetrics.averageCustomerValue
                )}
              </p>
            </div>
            <DollarSign className='h-8 w-8 text-green-500' />
          </div>
          <div className='mt-2 flex items-center text-sm text-green-600'>
            <TrendingUp className='mr-1 h-4 w-4' />
            <span>
              LTV:{' '}
              {formatCurrency(
                dashboardData.dashboard.customerMetrics.lifetimeValue
              )}
            </span>
          </div>
        </div>

        <div className='rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Pipeline Value
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(dashboardData.dashboard.pipeline.pipelineValue)}
              </p>
            </div>
            <Target className='h-8 w-8 text-purple-500' />
          </div>
          <div className='mt-2 flex items-center text-sm text-purple-600'>
            <Percent className='mr-1 h-4 w-4' />
            <span>
              {formatPercent(dashboardData.dashboard.pipeline.winRate)} win rate
            </span>
          </div>
        </div>
      </div>

      {/* Relationship Health Distribution */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
          <Heart className='mr-2 h-5 w-5 text-red-500' />
          Relationship Health Distribution
        </h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
          <div className='text-center'>
            <div className='mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
              <Crown className='h-8 w-8 text-purple-600' />
            </div>
            <p className='text-2xl font-bold text-purple-600'>
              {dashboardData.dashboard.relationshipHealth.strategic}
            </p>
            <p className='text-sm text-gray-600'>Strategic</p>
          </div>
          <div className='text-center'>
            <div className='mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
              <Award className='h-8 w-8 text-blue-600' />
            </div>
            <p className='text-2xl font-bold text-blue-600'>
              {dashboardData.dashboard.relationshipHealth.established}
            </p>
            <p className='text-sm text-gray-600'>Established</p>
          </div>
          <div className='text-center'>
            <div className='mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
              <Star className='h-8 w-8 text-green-600' />
            </div>
            <p className='text-2xl font-bold text-green-600'>
              {dashboardData.dashboard.relationshipHealth.new}
            </p>
            <p className='text-sm text-gray-600'>New</p>
          </div>
          <div className='text-center'>
            <div className='mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-8 w-8 text-red-600' />
            </div>
            <p className='text-2xl font-bold text-red-600'>
              {dashboardData.dashboard.relationshipHealth.at_risk}
            </p>
            <p className='text-sm text-gray-600'>At Risk</p>
          </div>
          <div className='text-center'>
            <div className='mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
              <User className='h-8 w-8 text-gray-600' />
            </div>
            <p className='text-2xl font-bold text-gray-600'>
              {dashboardData.dashboard.relationshipHealth.prospect}
            </p>
            <p className='text-sm text-gray-600'>Prospects</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            <Activity className='mr-2 h-5 w-5 text-blue-500' />
            Priority Actions
          </h3>
          <div className='space-y-3'>
            {dashboardData.relationships.recommendations.map(
              (rec: any, index: number) => (
                <div
                  key={index}
                  className='flex items-start rounded-lg border p-3'
                >
                  <div
                    className={`mt-2 mr-3 h-2 w-2 rounded-full ${
                      rec.priority === 'critical'
                        ? 'bg-red-500'
                        : rec.priority === 'high'
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                    }`}
                  ></div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium text-gray-900'>
                      {rec.customerName}
                    </h4>
                    <p className='text-sm text-gray-600'>{rec.action}</p>
                    <p className='mt-1 text-xs text-gray-500'>
                      {rec.expectedImpact}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            <Target className='mr-2 h-5 w-5 text-green-500' />
            Top Opportunities
          </h3>
          <div className='space-y-3'>
            {dashboardData.opportunities.opportunities
              .slice(0, 3)
              .map((opp: any, index: number) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div className='flex items-center'>
                    {getUrgencyIcon(opp.urgency)}
                    <div className='ml-3'>
                      <h4 className='text-sm font-medium text-gray-900'>
                        {opp.title}
                      </h4>
                      <p className='text-xs text-gray-600'>
                        {opp.customerName}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-green-600'>
                      {formatCurrency(opp.estimatedValue)}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {opp.probability}% prob
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRelationships = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Customer Relationship Scores
        </h3>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-600'>
            Avg Score: {dashboardData.relationships.summary.averageScore}
          </div>
          <button className='flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
            <Plus className='mr-2 h-4 w-4' />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className='rounded-lg bg-white p-4 shadow'>
        <div className='flex items-center space-x-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
              <input
                type='text'
                placeholder='Search customers...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
          <button className='flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'>
            <Filter className='mr-2 h-4 w-4' />
            Filter
          </button>
          <button className='flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'>
            <Download className='mr-2 h-4 w-4' />
            Export
          </button>
        </div>
      </div>

      {/* Relationship Scores */}
      <div className='space-y-4'>
        {dashboardData.relationships.scores.map(
          (customer: any, index: number) => (
            <div key={index} className='rounded-lg border bg-white shadow'>
              <div className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <button
                      onClick={() => toggleExpanded(customer.customerId)}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      {expandedItems.has(customer.customerId) ? (
                        <ChevronDown className='h-5 w-5' />
                      ) : (
                        <ChevronRight className='h-5 w-5' />
                      )}
                    </button>
                    <div>
                      <h4 className='font-medium text-gray-900'>
                        {customer.customerName}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {customer.accountManager}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='text-center'>
                      <div
                        className={`rounded-lg px-3 py-1 text-2xl font-bold ${getScoreColor(customer.overallScore)}`}
                      >
                        {customer.overallScore}
                      </div>
                      <p className='mt-1 text-xs text-gray-500'>
                        Overall Score
                      </p>
                    </div>

                    <div className='text-center'>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getRelationshipStageColor(customer.relationshipStage)}`}
                      >
                        {customer.relationshipStage.replace('_', ' ')}
                      </span>
                      <p className='mt-1 text-xs text-gray-500'>Stage</p>
                    </div>

                    <div className='text-center'>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getRiskColor(customer.riskLevel)}`}
                      >
                        {customer.riskLevel}
                      </span>
                      <p className='mt-1 text-xs text-gray-500'>Risk</p>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <button className='text-blue-600 hover:text-blue-800'>
                        <Eye className='h-4 w-4' />
                      </button>
                      <button className='text-gray-600 hover:text-gray-800'>
                        <Edit className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                </div>

                {expandedItems.has(customer.customerId) && (
                  <div className='mt-6 border-t border-gray-200 pt-6'>
                    {/* Score Breakdown */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                      <div>
                        <h5 className='mb-3 font-medium text-gray-900'>
                          Score Breakdown
                        </h5>
                        <div className='space-y-2'>
                          {Object.entries(customer.scoreBreakdown).map(
                            ([key, value]: [string, any]) => (
                              <div
                                key={key}
                                className='flex items-center justify-between'
                              >
                                <span className='text-sm text-gray-600 capitalize'>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <div className='flex items-center space-x-2'>
                                  <div className='h-2 w-16 rounded-full bg-gray-200'>
                                    <div
                                      className='h-2 rounded-full bg-blue-500'
                                      style={{ width: `${value}%` }}
                                    ></div>
                                  </div>
                                  <span className='text-sm font-medium text-gray-900'>
                                    {value}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className='mb-3 font-medium text-gray-900'>
                          Recent Activity
                        </h5>
                        <div className='space-y-2'>
                          <p className='text-sm text-gray-600'>
                            <span className='font-medium'>
                              Last Interaction:
                            </span>
                            <br />
                            {new Date(
                              customer.lastInteraction
                            ).toLocaleDateString()}
                          </p>
                          <p className='text-sm text-gray-600'>
                            <span className='font-medium'>Next Action:</span>
                            <br />
                            {customer.nextActionRecommended}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h5 className='mb-3 font-medium text-gray-900'>
                          Quick Actions
                        </h5>
                        <div className='space-y-2'>
                          <button className='flex w-full items-center rounded border bg-blue-50 p-2 text-left hover:bg-blue-100'>
                            <Phone className='mr-2 h-4 w-4 text-blue-600' />
                            <span className='text-sm text-blue-700'>
                              Schedule Call
                            </span>
                          </button>
                          <button className='flex w-full items-center rounded border bg-green-50 p-2 text-left hover:bg-green-100'>
                            <Mail className='mr-2 h-4 w-4 text-green-600' />
                            <span className='text-sm text-green-700'>
                              Send Email
                            </span>
                          </button>
                          <button className='flex w-full items-center rounded border bg-purple-50 p-2 text-left hover:bg-purple-100'>
                            <FileText className='mr-2 h-4 w-4 text-purple-600' />
                            <span className='text-sm text-purple-700'>
                              Create Proposal
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Upsell Opportunities
        </h3>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-600'>
            Expected Revenue:{' '}
            {formatCurrency(
              dashboardData.opportunities.summary.expectedRevenue
            )}
          </div>
          <button className='flex items-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600'>
            <Plus className='mr-2 h-4 w-4' />
            New Opportunity
          </button>
        </div>
      </div>

      {/* Opportunity Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <Target className='mr-2 h-5 w-5 text-blue-500' />
            <div>
              <p className='text-sm text-gray-600'>Total Opportunities</p>
              <p className='text-xl font-bold text-gray-900'>
                {dashboardData.opportunities.opportunities.length}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <DollarSign className='mr-2 h-5 w-5 text-green-500' />
            <div>
              <p className='text-sm text-gray-600'>Pipeline Value</p>
              <p className='text-xl font-bold text-gray-900'>
                {formatCurrency(dashboardData.opportunities.summary.totalValue)}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <CheckCircle className='mr-2 h-5 w-5 text-purple-500' />
            <div>
              <p className='text-sm text-gray-600'>Qualified</p>
              <p className='text-xl font-bold text-gray-900'>
                {dashboardData.opportunities.summary.qualifiedOpportunities}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <BarChart3 className='mr-2 h-5 w-5 text-orange-500' />
            <div>
              <p className='text-sm text-gray-600'>Avg Deal Size</p>
              <p className='text-xl font-bold text-gray-900'>
                {formatCurrency(
                  dashboardData.opportunities.summary.averageValue
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Alerts */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h4 className='mb-4 text-lg font-semibold text-gray-900'>
          Priority Alerts
        </h4>
        <div className='space-y-3'>
          {dashboardData.opportunities.alerts.map(
            (alert: any, index: number) => (
              <div
                key={index}
                className={`flex items-center rounded-lg border p-4 ${
                  alert.urgency === 'critical'
                    ? 'border-red-300 bg-red-50'
                    : alert.urgency === 'high'
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-yellow-300 bg-yellow-50'
                }`}
              >
                {getUrgencyIcon(alert.urgency)}
                <div className='ml-3 flex-1'>
                  <p className='text-sm font-medium text-gray-900'>
                    {alert.message}
                  </p>
                  <p className='text-xs text-gray-600 capitalize'>
                    {alert.type.replace('_', ' ')}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    alert.urgency === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : alert.urgency === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {alert.urgency}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Opportunities List */}
      <div className='rounded-lg bg-white shadow'>
        <div className='p-6'>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Opportunity
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Customer
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Value
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Probability
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Urgency
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.opportunities.opportunities.map(
                  (opp: any, index: number) => (
                    <tr
                      key={index}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='px-4 py-3'>
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {opp.title}
                          </p>
                          <p className='text-sm text-gray-600 capitalize'>
                            {opp.opportunityType.replace('_', ' ')}
                          </p>
                        </div>
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {opp.customerName}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {formatCurrency(opp.estimatedValue)}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center'>
                          <div className='mr-2 h-2 w-16 rounded-full bg-gray-200'>
                            <div
                              className='h-2 rounded-full bg-blue-500'
                              style={{ width: `${opp.probability}%` }}
                            ></div>
                          </div>
                          <span className='text-sm font-medium text-gray-900'>
                            {opp.probability}%
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center'>
                          {getStatusIcon(opp.status)}
                          <span className='ml-2 text-sm text-gray-900 capitalize'>
                            {opp.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center'>
                          {getUrgencyIcon(opp.urgency)}
                          <span className='ml-2 text-sm text-gray-900 capitalize'>
                            {opp.urgency}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center space-x-2'>
                          <button className='text-blue-600 hover:text-blue-800'>
                            <Eye className='h-4 w-4' />
                          </button>
                          <button className='text-gray-600 hover:text-gray-800'>
                            <Edit className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContracts = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Contract Tracking
        </h3>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-600'>
            Performance Score:{' '}
            {dashboardData.contracts.summary.performanceScore}%
          </div>
          <button className='flex items-center rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600'>
            <FileText className='mr-2 h-4 w-4' />
            New Contract
          </button>
        </div>
      </div>

      {/* Contract Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Total Value</p>
          <p className='text-xl font-bold text-gray-900'>
            {formatCurrency(dashboardData.contracts.summary.totalValue)}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-yellow-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Renewals (90 days)</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.contracts.summary.renewalsNext90Days}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-red-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>At Risk</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.contracts.summary.atRiskContracts}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-green-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Performance</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.contracts.summary.performanceScore}%
          </p>
        </div>
      </div>

      {/* Renewal Pipeline */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h4 className='mb-4 text-lg font-semibold text-gray-900'>
          Renewal Pipeline
        </h4>
        <div className='space-y-3'>
          {dashboardData.contracts.renewalPipeline.map(
            (renewal: any, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div>
                  <h5 className='font-medium text-gray-900'>
                    {renewal.customerName}
                  </h5>
                  <p className='text-sm text-gray-600'>
                    Contract: {renewal.contractId}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Renewal:{' '}
                    {new Date(renewal.renewalDate).toLocaleDateString()}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold text-gray-900'>
                    {formatCurrency(renewal.value)}
                  </p>
                  <div className='flex items-center'>
                    <div className='mr-2 h-2 w-16 rounded-full bg-gray-200'>
                      <div
                        className={`h-2 rounded-full ${
                          renewal.probability >= 70
                            ? 'bg-green-500'
                            : renewal.probability >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${renewal.probability}%` }}
                      ></div>
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      {renewal.probability}%
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Contracts Table */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='p-6'>
          <h4 className='mb-4 text-lg font-semibold text-gray-900'>
            Active Contracts
          </h4>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Contract
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Customer
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Type
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Value
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Performance
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Renewal
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.contracts.contracts.map(
                  (contract: any, index: number) => (
                    <tr
                      key={index}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {contract.contractId}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {contract.customerName}
                      </td>
                      <td className='px-4 py-3'>
                        <span className='text-sm text-gray-900 capitalize'>
                          {contract.contractType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {formatCurrency(contract.totalValue)}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='space-y-1'>
                          <div className='flex items-center text-xs'>
                            <span className='w-16'>OTD:</span>
                            <div className='mr-1 h-1 w-12 rounded-full bg-gray-200'>
                              <div
                                className='h-1 rounded-full bg-green-500'
                                style={{
                                  width: `${contract.performance.onTimeDelivery}%`,
                                }}
                              ></div>
                            </div>
                            <span>
                              {formatPercent(
                                contract.performance.onTimeDelivery
                              )}
                            </span>
                          </div>
                          <div className='flex items-center text-xs'>
                            <span className='w-16'>CSAT:</span>
                            <div className='flex text-yellow-400'>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i <
                                    Math.floor(
                                      contract.performance.customerSatisfaction
                                    )
                                      ? 'fill-current'
                                      : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <span className='ml-1'>
                              {contract.performance.customerSatisfaction}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <div>
                          <p className='text-sm text-gray-900'>
                            {new Date(
                              contract.renewalDate
                            ).toLocaleDateString()}
                          </p>
                          <div className='flex items-center'>
                            <div className='mr-2 h-2 w-12 rounded-full bg-gray-200'>
                              <div
                                className={`h-2 rounded-full ${
                                  contract.renewalProbability >= 70
                                    ? 'bg-green-500'
                                    : contract.renewalProbability >= 50
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                }`}
                                style={{
                                  width: `${contract.renewalProbability}%`,
                                }}
                              ></div>
                            </div>
                            <span className='text-xs'>
                              {contract.renewalProbability}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center space-x-2'>
                          <button className='text-blue-600 hover:text-blue-800'>
                            <Eye className='h-4 w-4' />
                          </button>
                          <button className='text-gray-600 hover:text-gray-800'>
                            <Edit className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Coming Soon: Shipper Preferences
        </h3>
        <p className='text-gray-600'>
          Detailed customer preference management including communication
          methods, service requirements, restrictions, and contact preferences
          will be available here.
        </p>
      </div>
    </div>
  );

  const renderIntelligence = () => (
    <div className='space-y-6'>
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Coming Soon: Competitive Intelligence
        </h3>
        <p className='text-gray-600'>
          Market position analysis, competitor tracking, threat assessment, and
          strategic opportunity identification will be available here.
        </p>
      </div>
    </div>
  );

  return (
    <div className='h-full bg-gray-50'>
      {/* Header */}
      <div className='border-b bg-white shadow'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='flex items-center text-2xl font-bold text-gray-900'>
                <Users className='mr-3 h-8 w-8 text-blue-500' />
                Enhanced CRM System
              </h1>
              <p className='mt-1 text-gray-600'>
                🏢 Relationship scoring, upselling alerts, contract tracking,
                shipper preferences & competitive intelligence
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-sm text-gray-600'>Customer Health</p>
                <p className='text-sm font-medium text-green-600'>
                  {dashboardData?.relationships?.summary?.averageScore || 78.5}
                  /100
                </p>
              </div>
              <button
                onClick={loadDashboardData}
                className='flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='px-6'>
          <div className='flex space-x-8 border-b'>
            {[
              { id: 'overview', label: '📊 Overview', icon: BarChart3 },
              { id: 'relationships', label: '💖 Relationships', icon: Heart },
              { id: 'opportunities', label: '🎯 Opportunities', icon: Target },
              { id: 'contracts', label: '📋 Contracts', icon: FileText },
              { id: 'preferences', label: '⚙️ Preferences', icon: Settings },
              { id: 'intelligence', label: '🕵️ Intelligence', icon: Eye },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center border-b-2 px-2 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className='mr-2 h-4 w-4' />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'relationships' && renderRelationships()}
        {activeTab === 'opportunities' && renderOpportunities()}
        {activeTab === 'contracts' && renderContracts()}
        {activeTab === 'preferences' && renderPreferences()}
        {activeTab === 'intelligence' && renderIntelligence()}
      </div>
    </div>
  );
};

export default BrokerEnhancedCRM;
