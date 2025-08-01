// AI Review Dashboard Component
// Centralized AI review interface for all FleetFlow processes
// Located in AI Flow platform

'use client';

import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface ReviewResult {
  isValid: boolean;
  confidence: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  crossReferences: CrossReference[];
  recommendations: string[];
  requiresHumanReview: boolean;
  autoApproved: boolean;
}

interface CrossReference {
  field: string;
  expectedValue: any;
  actualValue: any;
  source: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

interface AIReviewMetrics {
  totalReviews: number;
  autoApproved: number;
  humanReviewRequired: number;
  averageConfidence: number;
  errorRate: number;
  processingTime: number;
  accuracyRate: number;
}

interface AIReviewDashboardProps {
  processType?: string;
  onReviewComplete?: (result: ReviewResult) => void;
  showMetrics?: boolean;
}

export default function AIReviewDashboard({
  processType,
  onReviewComplete,
  showMetrics = true,
}: AIReviewDashboardProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'metrics' | 'settings'>(
    'review'
  );
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [metrics, setMetrics] = useState<AIReviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProcessType, setSelectedProcessType] = useState(
    processType || 'dispatch_invoice'
  );
  const [reviewData, setReviewData] = useState<any>({});
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Process type options
  const processTypes = [
    { value: 'dispatch_invoice', label: 'Dispatch Invoice', icon: '📄' },
    { value: 'load_assignment', label: 'Load Assignment', icon: '🚛' },
    { value: 'carrier_onboarding', label: 'Carrier Onboarding', icon: '👤' },
    { value: 'payment_processing', label: 'Payment Processing', icon: '💳' },
    {
      value: 'document_verification',
      label: 'Document Verification',
      icon: '📋',
    },
    { value: 'compliance_check', label: 'Compliance Check', icon: '✅' },
  ];

  useEffect(() => {
    if (showMetrics) {
      loadMetrics();
    }
  }, [showMetrics]);

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/ai-review?action=metrics');
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const performReview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'review_process',
          data: {
            processType: selectedProcessType,
            reviewData,
            userId: 'current_user', // In production, get from auth
            priority: 'high',
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReviewResult(data.data);
        onReviewComplete?.(data.data);
      }
    } catch (error) {
      console.error('Error performing review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (result: ReviewResult) => {
    if (result.isValid && result.autoApproved) {
      return <CheckCircleIcon className='h-8 w-8 text-green-500' />;
    } else if (result.isValid && !result.requiresHumanReview) {
      return <CheckCircleIcon className='h-8 w-8 text-blue-500' />;
    } else if (result.requiresHumanReview) {
      return <ExclamationTriangleIcon className='h-8 w-8 text-yellow-500' />;
    } else {
      return <XCircleIcon className='h-8 w-8 text-red-500' />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className='rounded-lg bg-white shadow-lg'>
      {/* Header */}
      <div className='border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              AI Review System
            </h2>
            <p className='text-gray-600'>
              Comprehensive validation and cross-reference for all FleetFlow
              processes
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <CogIcon className='h-6 w-6 text-gray-400' />
            <span className='text-sm text-gray-500'>AI Flow Platform</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='flex space-x-8 px-6'>
          <button
            onClick={() => setActiveTab('review')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'review'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Review Process
          </button>
          {showMetrics && (
            <button
              onClick={() => setActiveTab('metrics')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'metrics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Metrics & Analytics
            </button>
          )}
          <button
            onClick={() => setActiveTab('settings')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className='p-6'>
        {activeTab === 'review' && (
          <div className='space-y-6'>
            {/* Process Selection */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Process Type
              </label>
              <select
                value={selectedProcessType}
                onChange={(e) => setSelectedProcessType(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none'
              >
                {processTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Review Data Input */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='block text-sm font-medium text-gray-700'>
                  Review Data
                </label>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className='flex items-center text-sm text-blue-600 hover:text-blue-800'
                >
                  {showReviewForm ? (
                    <EyeSlashIcon className='mr-1 h-4 w-4' />
                  ) : (
                    <EyeIcon className='mr-1 h-4 w-4' />
                  )}
                  {showReviewForm ? 'Hide' : 'Show'} Form
                </button>
              </div>

              {showReviewForm ? (
                <textarea
                  value={JSON.stringify(reviewData, null, 2)}
                  onChange={(e) => {
                    try {
                      setReviewData(JSON.parse(e.target.value));
                    } catch (error) {
                      // Invalid JSON, keep current data
                    }
                  }}
                  className='h-32 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none'
                  placeholder='Enter JSON data for review...'
                />
              ) : (
                <div className='flex h-32 w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2'>
                  <span className='text-gray-500'>
                    Click "Show Form" to enter review data
                  </span>
                </div>
              )}
            </div>

            {/* Review Button */}
            <div className='flex justify-center'>
              <button
                onClick={performReview}
                disabled={isLoading}
                className='flex items-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading ? (
                  <>
                    <ClockIcon className='mr-2 h-5 w-5 animate-spin' />
                    Reviewing...
                  </>
                ) : (
                  <>
                    <ChartBarIcon className='mr-2 h-5 w-5' />
                    Perform AI Review
                  </>
                )}
              </button>
            </div>

            {/* Review Results */}
            {reviewResult && (
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Review Results
                  </h3>
                  {getStatusIcon(reviewResult)}
                </div>

                {/* Status Summary */}
                <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='rounded-lg border bg-white p-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-500'>
                        Confidence
                      </span>
                      <span
                        className={`text-lg font-bold ${getConfidenceColor(reviewResult.confidence)}`}
                      >
                        {reviewResult.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className='rounded-lg border bg-white p-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-500'>
                        Status
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          reviewResult.autoApproved
                            ? 'text-green-600'
                            : reviewResult.requiresHumanReview
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {reviewResult.autoApproved
                          ? 'Auto-Approved'
                          : reviewResult.requiresHumanReview
                            ? 'Human Review Required'
                            : 'Failed'}
                      </span>
                    </div>
                  </div>
                  <div className='rounded-lg border bg-white p-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-500'>
                        Issues
                      </span>
                      <span className='text-lg font-bold text-red-600'>
                        {reviewResult.errors.length +
                          reviewResult.warnings.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {reviewResult.errors.length > 0 && (
                  <div className='mb-4'>
                    <h4 className='mb-2 text-sm font-medium text-red-600'>
                      Errors
                    </h4>
                    <div className='space-y-2'>
                      {reviewResult.errors.map((error, index) => (
                        <div key={index} className='flex items-start'>
                          <XCircleIcon className='mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-red-500' />
                          <span className='text-sm text-red-700'>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {reviewResult.warnings.length > 0 && (
                  <div className='mb-4'>
                    <h4 className='mb-2 text-sm font-medium text-yellow-600'>
                      Warnings
                    </h4>
                    <div className='space-y-2'>
                      {reviewResult.warnings.map((warning, index) => (
                        <div key={index} className='flex items-start'>
                          <ExclamationTriangleIcon className='mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-yellow-500' />
                          <span className='text-sm text-yellow-700'>
                            {warning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross References */}
                {reviewResult.crossReferences.length > 0 && (
                  <div className='mb-4'>
                    <h4 className='mb-2 text-sm font-medium text-gray-700'>
                      Cross References
                    </h4>
                    <div className='space-y-2'>
                      {reviewResult.crossReferences.map((ref, index) => (
                        <div
                          key={index}
                          className={`rounded-md p-3 ${getSeverityColor(ref.severity)}`}
                        >
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>
                              {ref.field}
                            </span>
                            <span className='text-xs font-medium uppercase'>
                              {ref.severity}
                            </span>
                          </div>
                          <div className='mt-1 text-sm'>
                            <span className='text-gray-600'>Expected:</span>{' '}
                            {String(ref.expectedValue)}
                          </div>
                          <div className='text-sm'>
                            <span className='text-gray-600'>Actual:</span>{' '}
                            {String(ref.actualValue)}
                          </div>
                          <div className='mt-1 text-xs text-gray-500'>
                            Source: {ref.source}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {reviewResult.suggestions.length > 0 && (
                  <div className='mb-4'>
                    <h4 className='mb-2 text-sm font-medium text-blue-600'>
                      Suggestions
                    </h4>
                    <div className='space-y-2'>
                      {reviewResult.suggestions.map((suggestion, index) => (
                        <div key={index} className='flex items-start'>
                          <InformationCircleIcon className='mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-blue-500' />
                          <span className='text-sm text-blue-700'>
                            {suggestion}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {reviewResult.recommendations.length > 0 && (
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-gray-700'>
                      Recommendations
                    </h4>
                    <div className='space-y-2'>
                      {reviewResult.recommendations.map(
                        (recommendation, index) => (
                          <div key={index} className='flex items-start'>
                            <CheckCircleIcon className='mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                            <span className='text-sm text-gray-700'>
                              {recommendation}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'metrics' && metrics && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              AI Review Metrics
            </h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-lg border bg-white p-4'>
                <div className='flex items-center'>
                  <ChartBarIcon className='h-8 w-8 text-blue-500' />
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-500'>
                      Total Reviews
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {metrics.totalReviews}
                    </p>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-white p-4'>
                <div className='flex items-center'>
                  <CheckCircleIcon className='h-8 w-8 text-green-500' />
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-500'>
                      Auto-Approved
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {metrics.autoApproved}
                    </p>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-white p-4'>
                <div className='flex items-center'>
                  <ExclamationTriangleIcon className='h-8 w-8 text-yellow-500' />
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-500'>
                      Human Review
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {metrics.humanReviewRequired}
                    </p>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-white p-4'>
                <div className='flex items-center'>
                  <CogIcon className='h-8 w-8 text-purple-500' />
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-500'>
                      Avg Confidence
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {metrics.averageConfidence}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='rounded-lg border bg-white p-4'>
                <h4 className='mb-2 text-sm font-medium text-gray-500'>
                  Error Rate
                </h4>
                <p className='text-2xl font-bold text-red-600'>
                  {metrics.errorRate}%
                </p>
              </div>

              <div className='rounded-lg border bg-white p-4'>
                <h4 className='mb-2 text-sm font-medium text-gray-500'>
                  Processing Time
                </h4>
                <p className='text-2xl font-bold text-gray-900'>
                  {metrics.processingTime}ms
                </p>
              </div>

              <div className='rounded-lg border bg-white p-4'>
                <h4 className='mb-2 text-sm font-medium text-gray-500'>
                  Accuracy Rate
                </h4>
                <p className='text-2xl font-bold text-green-600'>
                  {metrics.accuracyRate}%
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              AI Review Settings
            </h3>

            <div className='rounded-lg border bg-white p-6'>
              <h4 className='text-md mb-4 font-medium text-gray-700'>
                Validation Rules
              </h4>
              <p className='mb-4 text-sm text-gray-600'>
                Configure validation rules for different process types. Rules
                can be enabled/disabled and customized based on business
                requirements.
              </p>

              <div className='space-y-4'>
                {processTypes.map((type) => (
                  <div
                    key={type.value}
                    className='flex items-center justify-between rounded-lg border p-3'
                  >
                    <div className='flex items-center'>
                      <span className='mr-3 text-lg'>{type.icon}</span>
                      <span className='font-medium'>{type.label}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <button className='rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'>
                        Configure
                      </button>
                      <button className='rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700'>
                        View Rules
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-lg border bg-white p-6'>
              <h4 className='text-md mb-4 font-medium text-gray-700'>
                Review Thresholds
              </h4>
              <p className='mb-4 text-sm text-gray-600'>
                Set confidence thresholds and review criteria for automatic
                approval.
              </p>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Auto-Approval Confidence Threshold
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    defaultValue='90'
                    className='w-full rounded-md border border-gray-300 px-3 py-2'
                  />
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Human Review Warning Threshold
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    defaultValue='80'
                    className='w-full rounded-md border border-gray-300 px-3 py-2'
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
