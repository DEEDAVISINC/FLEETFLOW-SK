'use client';

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  Mail,
  MessageSquare,
  Monitor,
  Pause,
  Play,
  Plus,
  Settings,
  Smartphone,
  Target,
  Trash2,
  TrendingUp,
  Webhook,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  NotificationChannel,
  NotificationSummary,
  SmartAlert,
  SmartNotificationRule,
  smartNotificationService,
} from '../services/SmartNotificationService';

interface SmartNotificationPanelProps {
  userId?: string;
  onNotificationAction?: (action: string, data: any) => void;
}

export default function SmartNotificationPanel({
  userId = 'default-user',
  onNotificationAction,
}: SmartNotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<
    'rules' | 'channels' | 'analytics' | 'alerts'
  >('rules');
  const [rules, setRules] = useState<SmartNotificationRule[]>([]);
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [selectedRule, setSelectedRule] =
    useState<SmartNotificationRule | null>(null);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [showChannelEditor, setShowChannelEditor] = useState(false);
  const [selectedChannel, setSelectedChannel] =
    useState<NotificationChannel | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setRules(smartNotificationService.getRules());
    setChannels(smartNotificationService.getChannels());
    setSmartAlerts(smartNotificationService.getSmartAlerts());

    try {
      const summaryData =
        await smartNotificationService.generateSummaryReport('day');
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load summary:', error);
    }
  };

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    await smartNotificationService.updateRule(ruleId, { enabled });
    loadData();
  };

  const deleteRule = async (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      await smartNotificationService.deleteRule(ruleId);
      loadData();
    }
  };

  const resolveAlert = async (alertId: string) => {
    await smartNotificationService.resolveAlert(alertId);
    loadData();
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <MessageSquare className='h-4 w-4' />;
      case 'email':
        return <Mail className='h-4 w-4' />;
      case 'push':
        return <Smartphone className='h-4 w-4' />;
      case 'dashboard':
        return <Monitor className='h-4 w-4' />;
      case 'webhook':
        return <Webhook className='h-4 w-4' />;
      default:
        return <Bell className='h-4 w-4' />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='mx-auto max-w-7xl rounded-lg bg-white shadow-lg'>
      {/* Header */}
      <div className='border-b border-gray-200 p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-blue-100 p-2'>
              <Zap className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                Smart Notification System
              </h2>
              <p className='text-gray-600'>
                Intelligent notification management with AI-powered routing
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2 rounded-full bg-green-100 px-3 py-1'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
              <span className='text-sm font-medium text-green-700'>Active</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='mt-6 flex space-x-1'>
          {[
            { id: 'rules', label: 'Smart Rules', icon: Filter },
            { id: 'channels', label: 'Channels', icon: Settings },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'alerts', label: 'Smart Alerts', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                {tab.id === 'alerts' && smartAlerts.length > 0 && (
                  <span className='min-w-[18px] rounded-full bg-red-500 px-2 py-0.5 text-xs text-white'>
                    {smartAlerts.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className='p-6'>
        {/* Smart Rules Tab */}
        {activeTab === 'rules' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Notification Rules
              </h3>
              <button
                onClick={() => {
                  setSelectedRule(null);
                  setShowRuleEditor(true);
                }}
                className='flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
              >
                <Plus className='h-4 w-4' />
                Create Rule
              </button>
            </div>

            <div className='grid gap-4'>
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className='rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <h4 className='font-semibold text-gray-900'>
                          {rule.name}
                        </h4>
                        <div
                          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            rule.enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rule.enabled ? (
                            <Play className='h-3 w-3' />
                          ) : (
                            <Pause className='h-3 w-3' />
                          )}
                          {rule.enabled ? 'Active' : 'Paused'}
                        </div>
                      </div>
                      <p className='mt-1 text-gray-600'>{rule.description}</p>

                      <div className='mt-3 flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Filter className='h-4 w-4 text-gray-400' />
                          <span className='text-gray-600'>
                            {rule.conditions.type?.length || 0} types,{' '}
                            {rule.conditions.priority?.length || 0} priorities
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Target className='h-4 w-4 text-gray-400' />
                          <span className='text-gray-600'>
                            {rule.actions.route?.length || 0} channels
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => toggleRule(rule.id, !rule.enabled)}
                        className={`rounded-lg p-2 transition-colors ${
                          rule.enabled
                            ? 'bg-gray-100 hover:bg-gray-200'
                            : 'bg-green-100 hover:bg-green-200'
                        }`}
                        title={rule.enabled ? 'Pause rule' : 'Activate rule'}
                      >
                        {rule.enabled ? (
                          <Pause className='h-4 w-4' />
                        ) : (
                          <Play className='h-4 w-4' />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRule(rule);
                          setShowRuleEditor(true);
                        }}
                        className='rounded-lg bg-blue-100 p-2 transition-colors hover:bg-blue-200'
                        title='Edit rule'
                      >
                        <Edit className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className='rounded-lg bg-red-100 p-2 transition-colors hover:bg-red-200'
                        title='Delete rule'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Notification Channels
            </h3>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className='rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md'
                >
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-lg bg-gray-100 p-2'>
                        {getChannelIcon(channel.type)}
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          {channel.name}
                        </h4>
                        <p className='text-sm text-gray-600 capitalize'>
                          {channel.type}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`h-3 w-3 rounded-full ${
                        channel.config.enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Success Rate</span>
                      <span className='font-medium'>
                        {channel.successRate.toFixed(1)}%
                      </span>
                    </div>

                    {channel.config.rateLimiting && (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>Rate Limit</span>
                        <span className='font-medium'>
                          {channel.config.rateLimiting.maxPerMinute}/min
                        </span>
                      </div>
                    )}

                    {channel.lastUsed && (
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>Last Used</span>
                        <span className='font-medium'>
                          {new Date(channel.lastUsed).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowChannelEditor(true);
                    }}
                    className='mt-4 w-full rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200'
                  >
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && summary && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Notification Analytics
            </h3>

            {/* Summary Cards */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-blue-600'>
                      Total Sent
                    </p>
                    <p className='text-2xl font-bold text-blue-900'>
                      {summary.metrics.totalSent.toLocaleString()}
                    </p>
                  </div>
                  <Bell className='h-8 w-8 text-blue-500' />
                </div>
                <div className='mt-2 flex items-center gap-1'>
                  <TrendingUp className='h-4 w-4 text-green-500' />
                  <span className='text-sm text-green-600'>
                    {summary.trends.volumeChange > 0 ? '+' : ''}
                    {summary.trends.volumeChange.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-green-600'>
                      Read Rate
                    </p>
                    <p className='text-2xl font-bold text-green-900'>
                      {(
                        (summary.metrics.totalRead /
                          summary.metrics.totalSent) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <CheckCircle className='h-8 w-8 text-green-500' />
                </div>
                <div className='mt-2 flex items-center gap-1'>
                  <TrendingUp className='h-4 w-4 text-green-500' />
                  <span className='text-sm text-green-600'>
                    {summary.trends.readRateChange > 0 ? '+' : ''}
                    {summary.trends.readRateChange.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className='rounded-lg border border-purple-200 bg-purple-50 p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-purple-600'>
                      Avg Response
                    </p>
                    <p className='text-2xl font-bold text-purple-900'>
                      {summary.metrics.avgResponseTime}m
                    </p>
                  </div>
                  <Clock className='h-8 w-8 text-purple-500' />
                </div>
                <div className='mt-2 flex items-center gap-1'>
                  <Activity className='h-4 w-4 text-purple-500' />
                  <span className='text-sm text-purple-600'>
                    {summary.trends.responseTimeChange > 0 ? '+' : ''}
                    {summary.trends.responseTimeChange.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className='rounded-lg border border-orange-200 bg-orange-50 p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-orange-600'>
                      Snoozed
                    </p>
                    <p className='text-2xl font-bold text-orange-900'>
                      {summary.metrics.totalSnoozed}
                    </p>
                  </div>
                  <Clock className='h-8 w-8 text-orange-500' />
                </div>
                <div className='mt-2 flex items-center gap-1'>
                  <Calendar className='h-4 w-4 text-orange-500' />
                  <span className='text-sm text-orange-600'>This period</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='rounded-lg border border-gray-200 p-4'>
                <h4 className='mb-4 font-semibold text-gray-900'>By Channel</h4>
                <div className='space-y-3'>
                  {Object.entries(summary.metrics.byChannel).map(
                    ([channel, count]) => (
                      <div
                        key={channel}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          {getChannelIcon(channel)}
                          <span className='text-gray-700 capitalize'>
                            {channel}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <div className='h-2 w-24 rounded-full bg-gray-200'>
                            <div
                              className='h-2 rounded-full bg-blue-500'
                              style={{
                                width: `${(count / summary.metrics.totalSent) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className='w-12 text-right font-medium text-gray-900'>
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className='rounded-lg border border-gray-200 p-4'>
                <h4 className='mb-4 font-semibold text-gray-900'>
                  By Priority
                </h4>
                <div className='space-y-3'>
                  {Object.entries(summary.metrics.byPriority).map(
                    ([priority, count]) => (
                      <div
                        key={priority}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <div
                            className={`h-3 w-3 rounded-full ${getPriorityColor(priority).split(' ')[1]}`}
                          ></div>
                          <span className='text-gray-700 capitalize'>
                            {priority}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <div className='h-2 w-24 rounded-full bg-gray-200'>
                            <div
                              className='h-2 rounded-full bg-purple-500'
                              style={{
                                width: `${(count / summary.metrics.totalSent) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className='w-12 text-right font-medium text-gray-900'>
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <h4 className='mb-3 font-semibold text-blue-900'>
                AI Recommendations
              </h4>
              <div className='space-y-2'>
                {summary.recommendations.map((rec, index) => (
                  <div key={index} className='flex items-start gap-2'>
                    <Zap className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500' />
                    <p className='text-sm text-blue-800'>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Smart Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Smart Alerts
            </h3>

            {smartAlerts.length === 0 ? (
              <div className='py-12 text-center'>
                <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-500' />
                <h4 className='text-lg font-semibold text-gray-900'>
                  All Clear!
                </h4>
                <p className='text-gray-600'>
                  No active alerts detected in your notification system.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {smartAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-4 ${getPriorityColor(alert.severity)}`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                          <AlertTriangle className='h-5 w-5' />
                          <h4 className='font-semibold'>{alert.title}</h4>
                          <span className='bg-opacity-50 rounded-full bg-white px-2 py-1 text-xs font-medium'>
                            {alert.type}
                          </span>
                        </div>
                        <p className='mt-2 text-sm'>{alert.message}</p>
                        <p className='mt-1 text-xs opacity-75'>
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className='bg-opacity-50 hover:bg-opacity-75 ml-4 rounded-lg bg-white px-3 py-1 text-sm font-medium transition-colors'
                      >
                        Resolve
                      </button>
                    </div>

                    {alert.actions.length > 0 && (
                      <div className='mt-3 flex gap-2'>
                        {alert.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              onNotificationAction?.(
                                action.action,
                                action.params
                              )
                            }
                            className='bg-opacity-50 hover:bg-opacity-75 rounded bg-white px-3 py-1 text-sm font-medium transition-colors'
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rule Editor Modal */}
      {showRuleEditor && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white'>
            <div className='border-b border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {selectedRule ? 'Edit Rule' : 'Create New Rule'}
              </h3>
            </div>
            <div className='p-6'>
              <p className='mb-4 text-gray-600'>
                Configure conditions and actions for smart notification routing.
              </p>
              {/* Rule editor form would go here */}
              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={() => setShowRuleEditor(false)}
                  className='rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save logic would go here
                    setShowRuleEditor(false);
                    loadData();
                  }}
                  className='rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
                >
                  Save Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Channel Editor Modal */}
      {showChannelEditor && selectedChannel && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='w-full max-w-lg rounded-lg bg-white'>
            <div className='border-b border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Configure {selectedChannel.name}
              </h3>
            </div>
            <div className='p-6'>
              <p className='mb-4 text-gray-600'>
                Adjust settings and rate limiting for this notification channel.
              </p>
              {/* Channel editor form would go here */}
              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={() => setShowChannelEditor(false)}
                  className='rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save logic would go here
                    setShowChannelEditor(false);
                    loadData();
                  }}
                  className='rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


