'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LinkVerificationResult {
  url: string;
  status:
    | 'valid'
    | 'invalid'
    | 'timeout'
    | 'error'
    | 'cors_error'
    | 'browser_limited';
  statusCode?: number;
  responseTime?: number;
  error?: string;
  category: string;
  resourceName?: string;
}

interface InternalLinkResult {
  path: string;
  exists: boolean;
  category: string;
  component: string;
}

interface VerificationSummary {
  totalExternalLinks: number;
  validExternalLinks: number;
  invalidExternalLinks: number;
  totalInternalLinks: number;
  validInternalLinks: number;
  invalidInternalLinks: number;
  brokenLinks: LinkVerificationResult[];
  missingPages: InternalLinkResult[];
  recommendations: string[];
}

interface LinkStatistics {
  totalExternalLinks: number;
  totalInternalLinks: number;
  categories: {
    external: string[];
    internal: string[];
  };
}

export default function LinkVerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'summary' | 'external' | 'internal' | 'checklist'
  >('summary');

  const runVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/link-verification');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVerificationData(data);
      console.log('✅ Link verification completed:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      console.error('❌ Link verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run verification on page load
    runVerification();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-green-600 bg-green-100';
      case 'invalid':
        return 'text-red-600 bg-red-100';
      case 'timeout':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'cors_error':
        return 'text-orange-600 bg-orange-100';
      case 'browser_limited':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return '✅';
      case 'invalid':
        return '❌';
      case 'timeout':
        return '⏰';
      case 'error':
        return '⚠️';
      case 'cors_error':
        return '🌐';
      case 'browser_limited':
        return '🔒';
      default:
        return '❓';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20'>
      {/* Header */}
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='mb-2 text-4xl font-bold text-gray-900'>
              🔗 Link Verification Dashboard
            </h1>
            <p className='text-lg text-gray-600'>
              Comprehensive verification of all external and internal links for
              production readiness
            </p>
          </div>

          <div className='flex gap-4'>
            <Link
              href='/resources'
              className='rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700'
            >
              📚 Back to Resources
            </Link>
            <button
              onClick={runVerification}
              disabled={isLoading}
              className='rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
            >
              {isLoading ? '🔄 Running...' : '🔄 Re-run Verification'}
            </button>
          </div>
        </div>

        {/* Environment Notice */}
        {verificationData?.environment === 'browser' && (
          <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6'>
            <div className='flex items-center'>
              <span className='mr-3 text-2xl text-blue-600'>🔒</span>
              <div>
                <h3 className='text-lg font-semibold text-blue-800'>
                  Browser Environment Detected
                </h3>
                <p className='text-blue-600'>
                  External link verification uses mock data due to CORS
                  restrictions. For full verification, run this on the server
                  side.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='rounded-lg bg-white p-8 text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
            <p className='text-lg text-gray-600'>
              Running comprehensive link verification...
            </p>
            <p className='mt-2 text-sm text-gray-500'>
              This may take a few minutes
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-6'>
            <div className='flex items-center'>
              <span className='mr-3 text-2xl text-red-600'>❌</span>
              <div>
                <h3 className='text-lg font-semibold text-red-800'>
                  Verification Error
                </h3>
                <p className='text-red-600'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {verificationData && !isLoading && (
          <>
            {/* Summary Cards */}
            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      External Links
                    </p>
                    <p className='text-2xl font-bold text-blue-600'>
                      {verificationData.summary.validExternalLinks}/
                      {verificationData.summary.totalExternalLinks}
                    </p>
                  </div>
                  <div className='text-3xl'>🔗</div>
                </div>
                <div className='mt-2'>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                      style={{
                        width: `${(verificationData.summary.validExternalLinks / verificationData.summary.totalExternalLinks) * 100}%`,
                      }}
                     />
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Internal Links
                    </p>
                    <p className='text-2xl font-bold text-green-600'>
                      {verificationData.summary.validInternalLinks}/
                      {verificationData.summary.totalInternalLinks}
                    </p>
                  </div>
                  <div className='text-3xl'>🏠</div>
                </div>
                <div className='mt-2'>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-green-600 transition-all duration-300'
                      style={{
                        width: `${(verificationData.summary.validInternalLinks / verificationData.summary.totalInternalLinks) * 100}%`,
                      }}
                     />
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Broken Links
                    </p>
                    <p className='text-2xl font-bold text-red-600'>
                      {verificationData.summary.brokenLinks.length}
                    </p>
                  </div>
                  <div className='text-3xl'>❌</div>
                </div>
                <p className='mt-1 text-sm text-gray-500'>Need attention</p>
              </div>

              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Missing Pages
                    </p>
                    <p className='text-2xl font-bold text-yellow-600'>
                      {verificationData.summary.missingPages.length}
                    </p>
                  </div>
                  <div className='text-3xl'>⚠️</div>
                </div>
                <p className='mt-1 text-sm text-gray-500'>Need creation</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className='mb-6 rounded-lg border bg-white shadow-sm'>
              <div className='border-b border-gray-200'>
                <nav className='flex space-x-8 px-6'>
                  {[
                    { id: 'summary', label: '📊 Summary', icon: '📊' },
                    { id: 'external', label: '🔗 External Links', icon: '🔗' },
                    { id: 'internal', label: '🏠 Internal Links', icon: '🏠' },
                    {
                      id: 'checklist',
                      label: '✅ Production Checklist',
                      icon: '✅',
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`border-b-2 px-1 py-4 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className='p-6'>
                {activeTab === 'summary' && (
                  <div className='space-y-6'>
                    {/* Recommendations */}
                    {verificationData.summary.recommendations.length > 0 && (
                      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6'>
                        <h3 className='mb-4 text-lg font-semibold text-yellow-800'>
                          🚨 Action Required
                        </h3>
                        <ul className='space-y-2'>
                          {verificationData.summary.recommendations.map(
                            (rec: string, index: number) => (
                              <li key={index} className='flex items-start'>
                                <span className='mr-2 text-yellow-600'>•</span>
                                <span className='text-yellow-700'>{rec}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Statistics */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div>
                        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                          📈 Link Statistics
                        </h3>
                        <div className='space-y-3'>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              Total External Links:
                            </span>
                            <span className='font-medium'>
                              {verificationData.statistics.totalExternalLinks}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              Total Internal Links:
                            </span>
                            <span className='font-medium'>
                              {verificationData.statistics.totalInternalLinks}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              External Categories:
                            </span>
                            <span className='font-medium'>
                              {
                                verificationData.statistics.categories.external
                                  .length
                              }
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              Internal Categories:
                            </span>
                            <span className='font-medium'>
                              {
                                verificationData.statistics.categories.internal
                                  .length
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                          🎯 Success Rates
                        </h3>
                        <div className='space-y-3'>
                          <div>
                            <div className='mb-1 flex justify-between'>
                              <span className='text-sm text-gray-600'>
                                External Links
                              </span>
                              <span className='text-sm font-medium'>
                                {Math.round(
                                  (verificationData.summary.validExternalLinks /
                                    verificationData.summary
                                      .totalExternalLinks) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                            <div className='h-2 w-full rounded-full bg-gray-200'>
                              <div
                                className='h-2 rounded-full bg-blue-600'
                                style={{
                                  width: `${(verificationData.summary.validExternalLinks / verificationData.summary.totalExternalLinks) * 100}%`,
                                }}
                               />
                            </div>
                          </div>
                          <div>
                            <div className='mb-1 flex justify-between'>
                              <span className='text-sm text-gray-600'>
                                Internal Links
                              </span>
                              <span className='text-sm font-medium'>
                                {Math.round(
                                  (verificationData.summary.validInternalLinks /
                                    verificationData.summary
                                      .totalInternalLinks) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                            <div className='h-2 w-full rounded-full bg-gray-200'>
                              <div
                                className='h-2 rounded-full bg-green-600'
                                style={{
                                  width: `${(verificationData.summary.validInternalLinks / verificationData.summary.totalInternalLinks) * 100}%`,
                                }}
                               />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'external' && (
                  <div>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      🔗 External Link Results
                    </h3>
                    <div className='max-h-96 space-y-3 overflow-y-auto'>
                      {verificationData.externalResults.map(
                        (link: LinkVerificationResult, index: number) => (
                          <div
                            key={index}
                            className='rounded-lg border bg-gray-50 p-4'
                          >
                            <div className='mb-2 flex items-center justify-between'>
                              <div className='flex items-center'>
                                <span className='mr-2'>
                                  {getStatusIcon(link.status)}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(link.status)}`}
                                >
                                  {link.status.toUpperCase()}
                                </span>
                              </div>
                              <span className='text-sm text-gray-500'>
                                {link.category}
                              </span>
                            </div>
                            <div className='space-y-1'>
                              <p className='font-medium text-gray-900'>
                                {link.resourceName || 'Unknown Resource'}
                              </p>
                              <p className='text-sm break-all text-blue-600'>
                                {link.url}
                              </p>
                              {link.responseTime && (
                                <p className='text-xs text-gray-500'>
                                  Response time: {link.responseTime}ms
                                </p>
                              )}
                              {link.error && (
                                <p className='text-xs text-red-600'>
                                  Error: {link.error}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'internal' && (
                  <div>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      🏠 Internal Link Results
                    </h3>
                    <div className='max-h-96 space-y-3 overflow-y-auto'>
                      {verificationData.internalResults.map(
                        (link: InternalLinkResult, index: number) => (
                          <div
                            key={index}
                            className='rounded-lg border bg-gray-50 p-4'
                          >
                            <div className='mb-2 flex items-center justify-between'>
                              <div className='flex items-center'>
                                <span className='mr-2'>
                                  {link.exists ? '✅' : '❌'}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    link.exists
                                      ? 'bg-green-100 text-green-600'
                                      : 'bg-red-100 text-red-600'
                                  }`}
                                >
                                  {link.exists ? 'EXISTS' : 'MISSING'}
                                </span>
                              </div>
                              <span className='text-sm text-gray-500'>
                                {link.category}
                              </span>
                            </div>
                            <div className='space-y-1'>
                              <p className='font-medium text-gray-900'>
                                {link.path}
                              </p>
                              <p className='text-xs text-gray-500'>
                                Component: {link.component}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'checklist' && (
                  <div>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      ✅ Production Readiness Checklist
                    </h3>
                    <div className='space-y-3'>
                      {verificationData.productionChecklist.map(
                        (item: string, index: number) => (
                          <div
                            key={index}
                            className='flex items-center rounded-lg bg-gray-50 p-3'
                          >
                            <span className='mr-3 text-lg'>
                              {item.includes('✅')
                                ? '✅'
                                : item.includes('⚠️')
                                  ? '⚠️'
                                  : '⏳'}
                            </span>
                            <span className='text-gray-700'>
                              {item
                                .replace('✅ ', '')
                                .replace('⚠️ ', '')
                                .replace('⏳ ', '')}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
