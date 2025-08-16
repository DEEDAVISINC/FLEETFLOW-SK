'use client';

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Info,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
  Upload,
  XCircle,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BrokerWorkflowAutomationService } from '../services/BrokerWorkflowAutomationService';

interface BrokerWorkflowAutomationEngineProps {
  brokerId: string;
}

const BrokerWorkflowAutomationEngine: React.FC<
  BrokerWorkflowAutomationEngineProps
> = ({ brokerId }) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'rules'
    | 'tasks'
    | 'documents'
    | 'payments'
    | 'compliance'
    | 'alerts'
  >('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const automationService = BrokerWorkflowAutomationService.getInstance();

  useEffect(() => {
    loadDashboardData();
  }, [brokerId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [rules, tasks, documents, payments, compliance, alerts] =
        await Promise.all([
          automationService.getWorkflowRules(brokerId),
          automationService.getAutomatedTasks(brokerId),
          automationService.getDocumentPipeline(brokerId),
          automationService.getPaymentWorkflows(brokerId),
          automationService.runComplianceChecks(brokerId),
          automationService.getPerformanceAlerts(brokerId),
        ]);

      setDashboardData({
        rules,
        tasks,
        documents,
        payments,
        compliance,
        alerts,
      });
    } catch (error) {
      console.error('Error loading workflow automation data:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'in_progress':
        return <Clock className='h-4 w-4 text-blue-500' />;
      case 'pending':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'failed':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'cancelled':
        return <XCircle className='h-4 w-4 text-gray-500' />;
      default:
        return <Activity className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      case 'urgent':
        return <AlertCircle className='h-4 w-4 text-red-500' />;
      case 'warning':
        return <AlertTriangle className='h-4 w-4 text-yellow-500' />;
      case 'info':
        return <Info className='h-4 w-4 text-blue-500' />;
      default:
        return <Info className='h-4 w-4 text-gray-500' />;
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
      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Active Rules</p>
              <p className='text-2xl font-bold text-gray-900'>
                {dashboardData.rules.stats.activeRules}
              </p>
            </div>
            <Settings className='h-8 w-8 text-blue-500' />
          </div>
          <div className='mt-2 flex items-center text-sm text-blue-600'>
            <Zap className='mr-1 h-4 w-4' />
            <span>
              {dashboardData.rules.stats.executedToday} executed today
            </span>
          </div>
        </div>

        <div className='rounded-lg border-l-4 border-green-500 bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Automation Rate
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatPercent(dashboardData.documents.metrics.automationRate)}
              </p>
            </div>
            <Activity className='h-8 w-8 text-green-500' />
          </div>
          <div className='mt-2 flex items-center text-sm text-green-600'>
            <TrendingUp className='mr-1 h-4 w-4' />
            <span>+5.2% vs last month</span>
          </div>
        </div>

        <div className='rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Avg Processing Time
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {dashboardData.tasks.summary.avgProcessingTime}h
              </p>
            </div>
            <Clock className='h-8 w-8 text-purple-500' />
          </div>
          <div className='mt-2 flex items-center text-sm text-purple-600'>
            <TrendingDown className='mr-1 h-4 w-4' />
            <span>-15% improvement</span>
          </div>
        </div>

        <div className='rounded-lg border-l-4 border-orange-500 bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Tasks Pending</p>
              <p className='text-2xl font-bold text-gray-900'>
                {dashboardData.tasks.summary.pending}
              </p>
            </div>
            <Bell className='h-8 w-8 text-orange-500' />
          </div>
          <div className='mt-2 flex items-center text-sm text-orange-600'>
            <ArrowRight className='mr-1 h-4 w-4' />
            <span>{dashboardData.tasks.summary.inProgress} in progress</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
          <Zap className='mr-2 h-5 w-5 text-blue-500' />
          Quick Actions
        </h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <button className='rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50'>
            <Plus className='mb-2 h-5 w-5 text-blue-500' />
            <p className='font-medium text-gray-900'>Create Rule</p>
            <p className='text-sm text-gray-600'>Add new automation rule</p>
          </button>
          <button className='rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50'>
            <Play className='mb-2 h-5 w-5 text-green-500' />
            <p className='font-medium text-gray-900'>Run Compliance</p>
            <p className='text-sm text-gray-600'>Execute compliance checks</p>
          </button>
          <button className='rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50'>
            <RefreshCw className='mb-2 h-5 w-5 text-purple-500' />
            <p className='font-medium text-gray-900'>Sync Documents</p>
            <p className='text-sm text-gray-600'>Update document pipeline</p>
          </button>
          <button className='rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50'>
            <Download className='mb-2 h-5 w-5 text-orange-500' />
            <p className='font-medium text-gray-900'>Export Report</p>
            <p className='text-sm text-gray-600'>Download automation report</p>
          </button>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
          <Bell className='mr-2 h-5 w-5 text-red-500' />
          Recent Performance Alerts
        </h3>
        <div className='space-y-3'>
          {dashboardData.alerts.alerts
            .slice(0, 3)
            .map((alert: any, index: number) => (
              <div
                key={index}
                className='flex items-start rounded-lg border p-4'
              >
                {getSeverityIcon(alert.severity)}
                <div className='ml-3 flex-1'>
                  <h4 className='text-sm font-medium text-gray-900'>
                    {alert.title}
                  </h4>
                  <p className='mt-1 text-sm text-gray-600'>
                    {alert.description}
                  </p>
                  <div className='mt-2 flex items-center space-x-4 text-xs text-gray-500'>
                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                    <span
                      className={`rounded-full px-2 py-1 ${getPriorityColor(alert.severity)}`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>Workflow Rules</h3>
        <div className='flex items-center space-x-3'>
          <button className='flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
            <Plus className='mr-2 h-4 w-4' />
            Create Rule
          </button>
          <button className='flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'>
            <Filter className='mr-2 h-4 w-4' />
            Filter
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        {dashboardData.rules.rules.map((rule: any, index: number) => (
          <div key={index} className='rounded-lg border bg-white shadow'>
            <div className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <button
                    onClick={() => toggleExpanded(rule.id)}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    {expandedItems.has(rule.id) ? (
                      <ChevronDown className='h-5 w-5' />
                    ) : (
                      <ChevronRight className='h-5 w-5' />
                    )}
                  </button>
                  <div>
                    <h4 className='font-medium text-gray-900'>{rule.name}</h4>
                    <p className='text-sm text-gray-600'>{rule.description}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-4'>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(rule.priority)}`}
                  >
                    {rule.priority}
                  </span>
                  <div className='flex items-center space-x-2'>
                    {rule.enabled ? (
                      <span className='text-sm font-medium text-green-600'>
                        Active
                      </span>
                    ) : (
                      <span className='text-sm font-medium text-gray-500'>
                        Inactive
                      </span>
                    )}
                    <button className='text-gray-400 hover:text-gray-600'>
                      <Edit className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>

              {expandedItems.has(rule.id) && (
                <div className='mt-4 border-t border-gray-200 pt-4'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <h5 className='mb-2 font-medium text-gray-900'>
                        Trigger
                      </h5>
                      <div className='rounded-lg bg-gray-50 p-3'>
                        <p className='text-sm text-gray-600'>
                          <span className='font-medium'>Type:</span>{' '}
                          {rule.trigger.type}
                        </p>
                        <p className='text-sm text-gray-600'>
                          <span className='font-medium'>Condition:</span>{' '}
                          {rule.trigger.condition}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 className='mb-2 font-medium text-gray-900'>
                        Actions ({rule.actions.length})
                      </h5>
                      <div className='space-y-2'>
                        {rule.actions.map(
                          (action: any, actionIndex: number) => (
                            <div
                              key={actionIndex}
                              className='rounded-lg bg-blue-50 p-3'
                            >
                              <p className='text-sm font-medium text-gray-900'>
                                {action.type}
                              </p>
                              <p className='text-sm text-gray-600'>
                                Target: {action.target}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 flex items-center justify-between text-sm text-gray-500'>
                    <span>Executed {rule.executionCount} times</span>
                    <span>
                      Last run:{' '}
                      {rule.lastExecuted
                        ? new Date(rule.lastExecuted).toLocaleString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>Automated Tasks</h3>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center space-x-2 text-sm text-gray-600'>
            <span>
              Avg processing: {dashboardData.tasks.summary.avgProcessingTime}h
            </span>
          </div>
          <button className='flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </button>
        </div>
      </div>

      {/* Task Summary Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
          <div className='flex items-center'>
            <Clock className='mr-2 h-5 w-5 text-yellow-600' />
            <div>
              <p className='text-sm font-medium text-yellow-600'>Pending</p>
              <p className='text-xl font-bold text-yellow-900'>
                {dashboardData.tasks.summary.pending}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <div className='flex items-center'>
            <Activity className='mr-2 h-5 w-5 text-blue-600' />
            <div>
              <p className='text-sm font-medium text-blue-600'>In Progress</p>
              <p className='text-xl font-bold text-blue-900'>
                {dashboardData.tasks.summary.inProgress}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
          <div className='flex items-center'>
            <CheckCircle className='mr-2 h-5 w-5 text-green-600' />
            <div>
              <p className='text-sm font-medium text-green-600'>Completed</p>
              <p className='text-xl font-bold text-green-900'>
                {dashboardData.tasks.summary.completed}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <div className='flex items-center'>
            <XCircle className='mr-2 h-5 w-5 text-red-600' />
            <div>
              <p className='text-sm font-medium text-red-600'>Failed</p>
              <p className='text-xl font-bold text-red-900'>
                {dashboardData.tasks.summary.failed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className='rounded-lg bg-white shadow'>
        <div className='p-6'>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Task
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Type
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Priority
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Created
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.tasks.tasks.map((task: any, index: number) => (
                  <tr
                    key={index}
                    className='border-b border-gray-100 hover:bg-gray-50'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center'>
                        {getStatusIcon(task.status)}
                        <span className='ml-2 text-sm text-gray-900 capitalize'>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          {task.title}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {task.description}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <span className='text-sm text-gray-900 capitalize'>
                        {task.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-600'>
                      {new Date(task.createdAt).toLocaleString()}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center space-x-2'>
                        <button className='text-blue-600 hover:text-blue-800'>
                          <Eye className='h-4 w-4' />
                        </button>
                        {task.status === 'failed' && (
                          <button className='text-green-600 hover:text-green-800'>
                            <RefreshCw className='h-4 w-4' />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Document Pipeline
        </h3>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-600'>
            {formatPercent(dashboardData.documents.metrics.automationRate)}{' '}
            automated
          </div>
          <button className='flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
            <Upload className='mr-2 h-4 w-4' />
            Upload Documents
          </button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <FileText className='mr-2 h-5 w-5 text-blue-500' />
            <div>
              <p className='text-sm text-gray-600'>Total Documents</p>
              <p className='text-xl font-bold text-gray-900'>
                {dashboardData.documents.metrics.totalDocuments}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <Clock className='mr-2 h-5 w-5 text-green-500' />
            <div>
              <p className='text-sm text-gray-600'>Avg Processing</p>
              <p className='text-xl font-bold text-gray-900'>
                {dashboardData.documents.metrics.processingTime}h
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <Activity className='mr-2 h-5 w-5 text-purple-500' />
            <div>
              <p className='text-sm text-gray-600'>Automation Rate</p>
              <p className='text-xl font-bold text-gray-900'>
                {formatPercent(dashboardData.documents.metrics.automationRate)}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <AlertTriangle className='mr-2 h-5 w-5 text-red-500' />
            <div>
              <p className='text-sm text-gray-600'>Error Rate</p>
              <p className='text-xl font-bold text-gray-900'>
                {formatPercent(dashboardData.documents.metrics.errorRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pipelines */}
      <div className='space-y-4'>
        {dashboardData.documents.pipelines.map(
          (pipeline: any, index: number) => (
            <div key={index} className='rounded-lg border bg-white shadow'>
              <div className='p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      {pipeline.name}
                    </h4>
                    <p className='text-sm text-gray-600 capitalize'>
                      {pipeline.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Progress</p>
                    <p className='text-xl font-bold text-blue-600'>
                      {pipeline.progress}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='mb-4 h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-500'
                    style={{ width: `${pipeline.progress}%` }}
                  ></div>
                </div>

                {/* Pipeline Steps */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {pipeline.steps.map((step: any, stepIndex: number) => (
                    <div
                      key={stepIndex}
                      className={`rounded-lg border p-3 ${getStatusBg(step.status)}`}
                    >
                      <div className='mb-2 flex items-center justify-between'>
                        <h5 className='text-sm font-medium text-gray-900'>
                          {step.name}
                        </h5>
                        {getStatusIcon(step.status)}
                      </div>
                      <p className='mb-2 text-xs text-gray-600 capitalize'>
                        {step.type}
                      </p>
                      {step.documents.length > 0 && (
                        <div className='text-xs text-gray-500'>
                          {step.documents.length} document(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Blockers */}
                {pipeline.blockers.length > 0 && (
                  <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3'>
                    <h5 className='mb-2 text-sm font-medium text-red-900'>
                      Blockers
                    </h5>
                    <ul className='space-y-1 text-sm text-red-700'>
                      {pipeline.blockers.map(
                        (blocker: string, blockerIndex: number) => (
                          <li key={blockerIndex} className='flex items-center'>
                            <AlertTriangle className='mr-2 h-3 w-3' />
                            {blocker}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Payment Workflows
        </h3>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-600'>
            {formatPercent(dashboardData.payments.summary.automationEfficiency)}{' '}
            automated
          </div>
          <button className='flex items-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600'>
            <CreditCard className='mr-2 h-4 w-4' />
            Process Payments
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Total Outstanding</p>
          <p className='text-xl font-bold text-gray-900'>
            {formatCurrency(dashboardData.payments.summary.totalOutstanding)}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-red-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Overdue Amount</p>
          <p className='text-xl font-bold text-gray-900'>
            {formatCurrency(dashboardData.payments.summary.overdueAmount)}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-green-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Avg Payment Time</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.payments.summary.avgPaymentTime} days
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-purple-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Automation Rate</p>
          <p className='text-xl font-bold text-gray-900'>
            {formatPercent(dashboardData.payments.summary.automationEfficiency)}
          </p>
        </div>
      </div>

      {/* Upcoming Actions */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h4 className='mb-4 text-lg font-semibold text-gray-900'>
          Upcoming Automated Actions
        </h4>
        <div className='space-y-3'>
          {dashboardData.payments.upcomingActions.map(
            (action: any, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div className='flex items-center'>
                  <div
                    className={`mr-3 h-3 w-3 rounded-full ${
                      action.priority === 'high'
                        ? 'bg-red-500'
                        : action.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                  ></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      {action.description}
                    </p>
                    <p className='text-sm text-gray-600 capitalize'>
                      {action.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-900'>
                    {new Date(action.scheduledFor).toLocaleDateString()}
                  </p>
                  <p className='text-xs text-gray-600'>
                    {new Date(action.scheduledFor).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Payment Workflows Table */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='p-6'>
          <h4 className='mb-4 text-lg font-semibold text-gray-900'>
            Active Payment Workflows
          </h4>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Invoice ID
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Amount
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Due Date
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Reminders
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-900'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.payments.workflows.map(
                  (workflow: any, index: number) => (
                    <tr
                      key={index}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {workflow.invoiceId}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {formatCurrency(workflow.amount)}
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {new Date(workflow.dueDate).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-3'>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            workflow.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : workflow.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : workflow.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {workflow.status}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {workflow.remindersSent}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center space-x-2'>
                          <button className='text-blue-600 hover:text-blue-800'>
                            <Eye className='h-4 w-4' />
                          </button>
                          <button className='text-green-600 hover:text-green-800'>
                            <Play className='h-4 w-4' />
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

  const renderCompliance = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Compliance Monitoring
        </h3>
        <div className='flex items-center space-x-3'>
          <button className='flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
            <Play className='mr-2 h-4 w-4' />
            Run All Checks
          </button>
          <button className='flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'>
            <Download className='mr-2 h-4 w-4' />
            Export Report
          </button>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border-l-4 border-green-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Compliant</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.compliance.summary.compliant}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-yellow-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Warnings</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.compliance.summary.warnings}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-red-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Non-Compliant</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.compliance.summary.nonCompliant}
          </p>
        </div>
        <div className='rounded-lg border-l-4 border-purple-500 bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Critical Issues</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.compliance.summary.criticalIssues}
          </p>
        </div>
      </div>

      {/* Compliance Results */}
      <div className='rounded-lg bg-white shadow'>
        <div className='p-6'>
          <h4 className='mb-4 text-lg font-semibold text-gray-900'>
            Compliance Check Results
          </h4>
          <div className='space-y-4'>
            {dashboardData.compliance.results.map(
              (result: any, index: number) => (
                <div key={index} className='rounded-lg border p-4'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div>
                      <h5 className='font-medium text-gray-900 capitalize'>
                        {result.type.replace('_', ' ')}
                      </h5>
                      <p className='text-sm text-gray-600'>
                        {result.entityType}: {result.entityId}
                      </p>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <span className='text-sm font-medium'>
                        Score: {result.score}/100
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          result.status === 'compliant'
                            ? 'bg-green-100 text-green-800'
                            : result.status === 'warning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : result.status === 'non_compliant'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {result.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {result.issues.length > 0 && (
                    <div className='space-y-2'>
                      {result.issues.map((issue: any, issueIndex: number) => (
                        <div
                          key={issueIndex}
                          className={`rounded-lg p-3 ${
                            issue.severity === 'critical'
                              ? 'border border-red-200 bg-red-50'
                              : issue.severity === 'high'
                                ? 'border border-orange-200 bg-orange-50'
                                : issue.severity === 'medium'
                                  ? 'border border-yellow-200 bg-yellow-50'
                                  : 'border border-blue-200 bg-blue-50'
                          }`}
                        >
                          <div className='flex items-start'>
                            <div
                              className={`mt-2 mr-3 h-2 w-2 rounded-full ${
                                issue.severity === 'critical'
                                  ? 'bg-red-500'
                                  : issue.severity === 'high'
                                    ? 'bg-orange-500'
                                    : issue.severity === 'medium'
                                      ? 'bg-yellow-500'
                                      : 'bg-blue-500'
                              }`}
                            ></div>
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-gray-900'>
                                {issue.description}
                              </p>
                              <p className='mt-1 text-sm text-gray-600'>
                                {issue.recommendation}
                              </p>
                              {issue.dueDate && (
                                <p className='mt-1 text-xs text-gray-500'>
                                  Due:{' '}
                                  {new Date(issue.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h4 className='mb-4 text-lg font-semibold text-gray-900'>
          Recommended Actions
        </h4>
        <div className='space-y-3'>
          {dashboardData.compliance.recommendations.map(
            (rec: any, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {rec.action}
                  </p>
                  <p className='text-sm text-gray-600'>{rec.impact}</p>
                </div>
                <div className='text-right'>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(rec.priority)}`}
                  >
                    {rec.priority}
                  </span>
                  <p className='mt-1 text-xs text-gray-500'>
                    {rec.estimatedTime}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Performance Alerts
        </h3>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-600'>
            {formatPercent(dashboardData.alerts.trends.autoResolutionRate)}{' '}
            auto-resolved
          </div>
          <button className='flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'>
            <Settings className='mr-2 h-4 w-4' />
            Configure Alerts
          </button>
        </div>
      </div>

      {/* Alert Trends */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Alert Frequency</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.alerts.trends.alertFrequency}/day
          </p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Avg Resolution Time</p>
          <p className='text-xl font-bold text-gray-900'>
            {dashboardData.alerts.trends.resolutionTime}h
          </p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Auto Resolution Rate</p>
          <p className='text-xl font-bold text-gray-900'>
            {formatPercent(dashboardData.alerts.trends.autoResolutionRate)}
          </p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <p className='text-sm text-gray-600'>Critical Alert Trend</p>
          <p className='text-xl font-bold text-gray-900 capitalize'>
            {dashboardData.alerts.trends.criticalAlertTrend}
          </p>
        </div>
      </div>

      {/* Active Alerts */}
      <div className='rounded-lg bg-white shadow'>
        <div className='p-6'>
          <h4 className='mb-4 text-lg font-semibold text-gray-900'>
            Active Alerts
          </h4>
          <div className='space-y-4'>
            {dashboardData.alerts.alerts.map((alert: any, index: number) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  alert.severity === 'critical' || alert.severity === 'urgent'
                    ? 'border-red-300 bg-red-50'
                    : alert.severity === 'warning'
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-blue-300 bg-blue-50'
                }`}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-start'>
                    {getSeverityIcon(alert.severity)}
                    <div className='ml-3 flex-1'>
                      <h5 className='font-medium text-gray-900'>
                        {alert.title}
                      </h5>
                      <p className='mt-1 text-sm text-gray-600'>
                        {alert.description}
                      </p>

                      <div className='mt-3 grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                          <p className='text-xs font-medium text-gray-500'>
                            Current Value
                          </p>
                          <p className='text-sm text-gray-900'>
                            {alert.currentValue}
                            {alert.metric.includes('percentage') ? '%' : ''}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs font-medium text-gray-500'>
                            Threshold
                          </p>
                          <p className='text-sm text-gray-900'>
                            {alert.thresholdValue}
                            {alert.metric.includes('percentage') ? '%' : ''}
                          </p>
                        </div>
                      </div>

                      {alert.recommendedActions.length > 0 && (
                        <div className='mt-3'>
                          <p className='mb-2 text-xs font-medium text-gray-500'>
                            Recommended Actions
                          </p>
                          <ul className='space-y-1 text-sm text-gray-700'>
                            {alert.recommendedActions.map(
                              (action: string, actionIndex: number) => (
                                <li
                                  key={actionIndex}
                                  className='flex items-center'
                                >
                                  <div className='mr-2 h-1 w-1 rounded-full bg-gray-400'></div>
                                  {action}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {alert.autoResolution?.possible && (
                        <div className='mt-3 rounded border border-green-200 bg-green-50 p-2'>
                          <p className='text-xs font-medium text-green-700'>
                            Auto-resolution available
                          </p>
                          <p className='text-xs text-green-600'>
                            Estimated time: {alert.autoResolution.estimatedTime}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='ml-4 flex items-center space-x-2'>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        alert.severity === 'critical' ||
                        alert.severity === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : alert.severity === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    {!alert.acknowledged && (
                      <button className='text-xs font-medium text-blue-600 hover:text-blue-800'>
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h4 className='mb-4 text-lg font-semibold text-gray-900'>
          AI Optimization Recommendations
        </h4>
        <div className='space-y-3'>
          {dashboardData.alerts.aiRecommendations.map(
            (rec: any, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4'
              >
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {rec.description}
                  </p>
                  <p className='text-sm text-gray-600'>{rec.expectedImpact}</p>
                  <p className='mt-1 text-xs text-gray-500 capitalize'>
                    {rec.type.replace('_', ' ')}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-purple-600'>
                    {rec.implementationTime}
                  </p>
                  <button className='mt-1 text-xs font-medium text-purple-600 hover:text-purple-800'>
                    Implement
                  </button>
                </div>
              </div>
            )
          )}
        </div>
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
                <Settings className='mr-3 h-8 w-8 text-blue-500' />
                Workflow Automation Engine
              </h1>
              <p className='mt-1 text-gray-600'>
                🔄 Automated status updates, document pipeline, payment
                processing, compliance checking & performance alerts
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-sm text-gray-600'>System Status</p>
                <p className='text-sm font-medium text-green-600'>
                  ✅ All Automations Active
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
              { id: 'rules', label: '⚙️ Rules', icon: Settings },
              { id: 'tasks', label: '📋 Tasks', icon: Activity },
              { id: 'documents', label: '📄 Documents', icon: FileText },
              { id: 'payments', label: '💳 Payments', icon: CreditCard },
              { id: 'compliance', label: '🛡️ Compliance', icon: Shield },
              { id: 'alerts', label: '🚨 Alerts', icon: Bell },
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
        {activeTab === 'rules' && renderRules()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'compliance' && renderCompliance()}
        {activeTab === 'alerts' && renderAlerts()}
      </div>
    </div>
  );
};

export default BrokerWorkflowAutomationEngine;


