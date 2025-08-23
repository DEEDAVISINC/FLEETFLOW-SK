'use client';

import { useEffect, useState } from 'react';
import { platformAIManager } from '../services/PlatformAIManager';

interface PlatformReport {
  summary: string;
  metrics: {
    cost: {
      dailySpend: number;
      monthlySavings: number;
      efficiency: number;
      servicesOptimized: string[];
    };
    quality: {
      overallGrade: string;
      issuesDetected: number;
      autoCorrections: number;
      humanEscalations: number;
    };
    services: number;
  };
  recommendations: string[];
}

export function PlatformAIMonitor() {
  const [report, setReport] = useState<PlatformReport | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        const platformReport = await platformAIManager.generatePlatformReport();
        setReport(platformReport);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error loading Platform AI report:', error);
      }
    };

    loadReport();
    const interval = setInterval(loadReport, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!report) {
    return (
      <div className='animate-pulse rounded-lg border bg-white p-4 shadow-sm'>
        <div className='mb-2 h-4 w-32 rounded bg-gray-200'></div>
        <div className='h-6 w-24 rounded bg-gray-200'></div>
      </div>
    );
  }

  const getStatusColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return '#22c55e';
      case 'B':
        return '#3b82f6';
      case 'C':
        return '#f59e0b';
      case 'D':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSavingsColor = (savings: number) => {
    if (savings > 1000) return '#22c55e'; // Green for good savings
    if (savings > 500) return '#f59e0b'; // Yellow for moderate
    return '#ef4444'; // Red for low savings
  };

  return (
    <div className='overflow-hidden rounded-lg border bg-white shadow-sm'>
      {/* Compact Header */}
      <div
        className='cursor-pointer p-4 transition-colors hover:bg-gray-50'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-sm font-semibold text-gray-900'>
              Platform AI Status
            </h3>
            <p className='text-xs text-gray-600'>{report.summary}</p>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1'>
              <div
                className='h-3 w-3 rounded-full'
                style={{
                  backgroundColor: getStatusColor(
                    report.metrics.quality.overallGrade
                  ),
                }}
                title={`Quality Grade: ${report.metrics.quality.overallGrade}`}
              ></div>
              <span className='text-xs text-gray-600'>
                Grade: {report.metrics.quality.overallGrade}
              </span>
            </div>
            <div className='text-xs text-gray-600'>
              ${report.metrics.cost.dailySpend.toFixed(2)}/day
            </div>
            <div
              className='text-xs font-medium'
              style={{
                color: getSavingsColor(report.metrics.cost.monthlySavings),
              }}
            >
              ${report.metrics.cost.monthlySavings}/mo saved
            </div>
            <div className='text-gray-400'>{isExpanded ? '▼' : '▶'}</div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className='space-y-4 border-t bg-gray-50 p-4'>
          {/* Cost Metrics */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='rounded bg-white p-3'>
              <h4 className='text-sm font-medium text-gray-800'>
                Cost Optimization
              </h4>
              <div className='mt-1 text-xs text-gray-600'>
                Daily: ${report.metrics.cost.dailySpend.toFixed(2)} | Monthly
                Savings: ${report.metrics.cost.monthlySavings}
              </div>
              <div className='mt-1 text-xs font-medium text-green-600'>
                {report.metrics.cost.efficiency}% efficient
              </div>
            </div>

            <div className='rounded bg-white p-3'>
              <h4 className='text-sm font-medium text-gray-800'>
                Quality Control
              </h4>
              <div className='mt-1 text-xs text-gray-600'>
                Grade: {report.metrics.quality.overallGrade} | Auto-fixes:{' '}
                {report.metrics.quality.autoCorrections}
              </div>
              <div className='mt-1 text-xs text-blue-600'>
                {report.metrics.quality.humanEscalations} human escalations
              </div>
            </div>
          </div>

          {/* Service Status */}
          <div className='rounded bg-white p-3'>
            <h4 className='text-sm font-medium text-gray-800'>
              Active Services
            </h4>
            <div className='mt-1 text-xs text-gray-600'>
              {report.metrics.services} AI services integrated and monitored
            </div>
            <div className='mt-1 text-xs text-gray-500'>
              Services optimized: {report.metrics.cost.servicesOptimized.length}
            </div>
          </div>

          {/* Performance Indicators */}
          <div className='grid grid-cols-3 gap-2'>
            <div className='rounded bg-green-50 p-2 text-center'>
              <div className='text-xs font-medium text-green-800'>
                Cost Savings
              </div>
              <div className='text-lg font-bold text-green-600'>
                ${((report.metrics.cost.monthlySavings * 12) / 1000).toFixed(0)}
                K/yr
              </div>
            </div>
            <div className='rounded bg-blue-50 p-2 text-center'>
              <div className='text-xs font-medium text-blue-800'>Quality</div>
              <div className='text-lg font-bold text-blue-600'>
                {report.metrics.quality.overallGrade}
              </div>
            </div>
            <div className='rounded bg-purple-50 p-2 text-center'>
              <div className='text-xs font-medium text-purple-800'>
                Services
              </div>
              <div className='text-lg font-bold text-purple-600'>
                {report.metrics.services}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div className='rounded bg-blue-50 p-3'>
              <h4 className='text-sm font-medium text-blue-800'>
                Recommendations
              </h4>
              <ul className='mt-1 list-inside list-disc text-xs text-blue-700'>
                {report.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* System Health */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='rounded bg-white p-2'>
              <div className='text-xs text-gray-600'>Issues Detected</div>
              <div className='text-sm font-medium text-gray-800'>
                {report.metrics.quality.issuesDetected}
                <span className='ml-1 text-xs text-gray-500'>
                  (auto-resolved)
                </span>
              </div>
            </div>
            <div className='rounded bg-white p-2'>
              <div className='text-xs text-gray-600'>Last Update</div>
              <div className='text-sm font-medium text-gray-800'>
                {lastUpdate}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='flex space-x-2 pt-2'>
            <button
              className='rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700'
              onClick={() => {
                console.log('🔧 Platform AI configuration requested');
                alert('Platform AI configuration panel would open here');
              }}
            >
              Configure
            </button>
            <button
              className='rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700'
              onClick={() => {
                window.open('/ai-company-dashboard', '_blank');
              }}
            >
              View Details
            </button>
            <button
              className='rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700'
              onClick={async () => {
                console.log('🧪 Testing Platform AI...');
                const { testPlatformAI } = await import('../config/ai-config');
                const result = await testPlatformAI();
                alert(
                  result.success
                    ? '✅ Platform AI test passed!'
                    : `❌ Test failed: ${result.error}`
                );
              }}
            >
              Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for sidebars
export function PlatformAIStatusBadge() {
  const [status, setStatus] = useState<{
    grade: string;
    dailySpend: number;
  } | null>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const costSummary = await platformAIManager.getCostSummary();
        const qualityStatus = await platformAIManager.getQualityStatus();
        setStatus({
          grade: qualityStatus.overallGrade,
          dailySpend: costSummary.dailySpend,
        });
      } catch (error) {
        console.error('Error loading Platform AI status:', error);
      }
    };

    loadStatus();
    const interval = setInterval(loadStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return <div className='h-6 w-16 animate-pulse rounded bg-gray-200'></div>;
  }

  return (
    <div className='flex items-center space-x-2 rounded bg-white px-2 py-1 shadow-sm'>
      <div
        className='h-2 w-2 rounded-full'
        style={{ backgroundColor: getStatusColor(status.grade) }}
      ></div>
      <span className='text-xs text-gray-700'>
        AI: {status.grade} | ${status.dailySpend.toFixed(2)}
      </span>
    </div>
  );
}

function getStatusColor(grade: string) {
  switch (grade) {
    case 'A':
      return '#22c55e';
    case 'B':
      return '#3b82f6';
    case 'C':
      return '#f59e0b';
    case 'D':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

