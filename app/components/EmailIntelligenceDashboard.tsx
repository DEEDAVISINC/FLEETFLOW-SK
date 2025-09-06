'use client';

import { useEffect, useState } from 'react';

interface EmailIntelligenceAnalytics {
  emailsProcessedToday: number;
  loadInquiries: number;
  carrierInvitationsSent: number;
  existingCarrierResponses: number;
  conversionRate: number;
  averageResponseTime: string;
  topInquiredLoads: Array<{ loadId: string; inquiries: number }>;
  newCarrierLeads: number;
}

export default function EmailIntelligenceDashboard() {
  const [analytics, setAnalytics] = useState<EmailIntelligenceAnalytics | null>(
    null
  );
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [testBody, setTestBody] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchSystemStatus();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        '/api/automation/email-intelligence?action=analytics'
      );
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/automation/email-intelligence');
      const data = await response.json();
      if (data.success) {
        setSystemStatus(data.systemStatus);
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  const testEmailIntelligence = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/automation/email-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_system',
          data: {
            testEmail: testEmail || 'test@carrier.com',
            testSubject: testSubject || 'Inquiry about Load FL-001',
            testBody:
              testBody ||
              'Hi, I am interested in your load FL-001 from Miami to Atlanta. Please send details. Thanks, John from ABC Trucking.',
          },
        }),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            🧠 Email Intelligence Dashboard
          </h1>
          <p className='text-gray-600'>
            Automated load inquiry processing and carrier engagement system
          </p>
        </div>

        {/* System Status */}
        <div className='mb-8 grid gap-4 md:grid-cols-5'>
          {systemStatus &&
            Object.entries(systemStatus).map(([key, status]) => (
              <div
                key={key}
                className='rounded-lg border bg-white p-4 shadow-sm'
              >
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-gray-600 capitalize'>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      status === 'online' ||
                      status === 'connected' ||
                      status === 'active' ||
                      status === 'listening'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {status as string}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Analytics Grid */}
        {analytics && (
          <div className='mb-8 grid gap-6 md:grid-cols-4'>
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500'>
                    <span className='text-sm font-bold text-white'>📧</span>
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>
                    Emails Processed Today
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {analytics.emailsProcessedToday}
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-500'>
                    <span className='text-sm font-bold text-white'>🚛</span>
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>
                    Load Inquiries
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {analytics.loadInquiries}
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500'>
                    <span className='text-sm font-bold text-white'>🎯</span>
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>
                    Conversion Rate
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {analytics.conversionRate}%
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500'>
                    <span className='text-sm font-bold text-white'>⚡</span>
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>
                    Avg Response Time
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {analytics.averageResponseTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Test Email Intelligence */}
          <div className='rounded-lg border bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              🧪 Test Email Intelligence System
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Test Email Address
                </label>
                <input
                  type='email'
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder='carrier@trucking.com'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Subject Line
                </label>
                <input
                  type='text'
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  placeholder='Inquiry about Load FL-001'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Email Body
                </label>
                <textarea
                  value={testBody}
                  onChange={(e) => setTestBody(e.target.value)}
                  placeholder='Hi, I am interested in your load FL-001...'
                  rows={4}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <button
                onClick={testEmailIntelligence}
                disabled={loading}
                className={`w-full rounded-lg px-4 py-2 font-medium ${
                  loading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {loading ? 'Processing...' : 'Test Email Intelligence'}
              </button>
            </div>

            {/* Test Results */}
            {testResult && (
              <div className='mt-6 rounded-lg bg-gray-50 p-4'>
                <h4 className='mb-2 font-medium text-gray-900'>
                  Test Results:
                </h4>
                <div className='text-sm'>
                  <div className='mb-2'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        testResult.success
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {testResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>

                  {testResult.result && (
                    <div className='space-y-2'>
                      <div>
                        <strong>Action:</strong> {testResult.result.action}
                      </div>
                      {testResult.result.carrierId && (
                        <div>
                          <strong>Carrier ID:</strong>{' '}
                          {testResult.result.carrierId}
                        </div>
                      )}
                      {testResult.result.loadId && (
                        <div>
                          <strong>Load ID:</strong> {testResult.result.loadId}
                        </div>
                      )}
                      {testResult.result.leadCreated && (
                        <div className='text-green-600'>
                          ✅ New carrier lead created
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Top Inquired Loads */}
          {analytics && (
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                📊 Most Inquired Loads Today
              </h3>

              <div className='space-y-3'>
                {analytics.topInquiredLoads.map((load, index) => (
                  <div
                    key={load.loadId}
                    className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                  >
                    <div className='flex items-center'>
                      <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                        <span className='text-sm font-bold text-blue-600'>
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {load.loadId}
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-gray-900'>
                        {load.inquiries}
                      </div>
                      <div className='text-sm text-gray-500'>inquiries</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-6 grid grid-cols-2 gap-4'>
                <div className='rounded-lg bg-green-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {analytics.carrierInvitationsSent}
                  </div>
                  <div className='text-sm text-green-700'>Invitations Sent</div>
                </div>
                <div className='rounded-lg bg-blue-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {analytics.newCarrierLeads}
                  </div>
                  <div className='text-sm text-blue-700'>New Leads</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}























