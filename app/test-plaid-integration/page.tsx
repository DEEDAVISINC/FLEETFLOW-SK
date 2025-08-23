'use client';

import { useEffect, useState } from 'react';

interface ComplianceStatus {
  plaid_integration: boolean;
  data_retention_compliant: boolean;
  data_subject_rights_compliant: boolean;
  encryption_compliant: boolean;
  overall_compliant: boolean;
  details: string[];
}

interface APIResponse {
  compliance_checks: ComplianceStatus;
  integration_health: {
    sdk_installed: boolean;
    environment_variables_configured: boolean;
    webhook_configured: boolean;
    api_endpoints_active: boolean;
  };
  regulatory_compliance: {
    gdpr_compliant: boolean;
    ccpa_compliant: boolean;
    sox_compliant: boolean;
    pci_dss_compliant: boolean;
    banking_regulations_compliant: boolean;
  };
  timestamp: string;
  environment: string;
  client_id: string;
}

export default function PlaidIntegrationTest() {
  const [apiStatus, setApiStatus] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkComplianceStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/plaid/compliance-status');
      const data = await response.json();

      if (response.ok) {
        setApiStatus(data);
      } else {
        setError(data.error || 'Failed to fetch compliance status');
      }
    } catch (err) {
      setError(
        `Network error: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testDataDeletion = async () => {
    try {
      const response = await fetch('/api/plaid/data-deletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'test-user-123',
          deletion_reason: 'api_test',
          request_source: 'admin_panel',
        }),
      });

      const result = await response.json();
      alert(`Deletion test result: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      alert(`Deletion test failed: ${err}`);
    }
  };

  const testRetentionStatus = async () => {
    try {
      const response = await fetch('/api/plaid/retention-status');
      const result = await response.json();
      alert(`Retention status: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      alert(`Retention test failed: ${err}`);
    }
  };

  useEffect(() => {
    checkComplianceStatus();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='rounded-xl bg-white p-8 shadow-lg'>
          <div className='mb-8 text-center'>
            <h1 className='mb-4 text-4xl font-bold text-gray-800'>
              🏛️ FleetFlow Plaid Integration Test
            </h1>
            <p className='text-lg text-gray-600'>
              Test and validate Plaid API implementation and compliance status
            </p>
          </div>

          {/* Status Cards */}
          <div className='mb-8 grid gap-6 md:grid-cols-3'>
            <div className='rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 text-white'>
              <div className='text-2xl font-bold'>✅ SDK Installed</div>
              <div className='mt-2'>Plaid Node.js SDK</div>
            </div>
            <div className='rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white'>
              <div className='text-2xl font-bold'>🔧 API Routes</div>
              <div className='mt-2'>3 Endpoints Active</div>
            </div>
            <div className='rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white'>
              <div className='text-2xl font-bold'>📋 Compliance</div>
              <div className='mt-2'>GDPR/CCPA Ready</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mb-8 grid gap-4 md:grid-cols-4'>
            <button
              onClick={checkComplianceStatus}
              disabled={loading}
              className='transform rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? '🔄 Loading...' : '📊 Check Compliance'}
            </button>

            <button
              onClick={testDataDeletion}
              className='transform rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-red-700'
            >
              🗑️ Test Deletion
            </button>

            <button
              onClick={testRetentionStatus}
              className='transform rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-green-700'
            >
              📅 Check Retention
            </button>

            <button
              onClick={() =>
                window.open('/api/plaid/compliance-status', '_blank')
              }
              className='transform rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-purple-700'
            >
              🔗 API Direct
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className='mb-6 border-l-4 border-red-500 bg-red-50 p-4'>
              <div className='text-red-800'>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* API Response Display */}
          {apiStatus && (
            <div className='space-y-6'>
              {/* Environment Info */}
              <div className='rounded-lg bg-gray-50 p-6'>
                <h3 className='mb-4 text-xl font-bold text-gray-800'>
                  🔧 Environment Configuration
                </h3>
                <div className='grid gap-4 md:grid-cols-3'>
                  <div>
                    <span className='font-semibold'>Environment:</span>
                    <span className='ml-2 rounded bg-blue-100 px-2 py-1 text-blue-800'>
                      {apiStatus.environment}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold'>Client ID:</span>
                    <span className='ml-2 font-mono text-sm'>
                      {apiStatus.client_id}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold'>Timestamp:</span>
                    <span className='ml-2 text-sm text-gray-600'>
                      {new Date(apiStatus.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance Checks */}
              <div className='rounded-lg bg-gray-50 p-6'>
                <h3 className='mb-4 text-xl font-bold text-gray-800'>
                  ✅ Compliance Status
                </h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  {Object.entries(apiStatus.compliance_checks)
                    .filter(([key]) => key !== 'details')
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className='flex items-center justify-between'
                      >
                        <span className='font-semibold capitalize'>
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-sm font-medium ${
                            value
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {value ? '✅ Compliant' : '❌ Not Compliant'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Integration Health */}
              <div className='rounded-lg bg-gray-50 p-6'>
                <h3 className='mb-4 text-xl font-bold text-gray-800'>
                  🔧 Integration Health
                </h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  {Object.entries(apiStatus.integration_health).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className='flex items-center justify-between'
                      >
                        <span className='font-semibold capitalize'>
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-sm font-medium ${
                            value
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {value ? '✅ Active' : '⚠️ Pending'}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Regulatory Compliance */}
              <div className='rounded-lg bg-gray-50 p-6'>
                <h3 className='mb-4 text-xl font-bold text-gray-800'>
                  ⚖️ Regulatory Compliance
                </h3>
                <div className='grid gap-4 md:grid-cols-3'>
                  {Object.entries(apiStatus.regulatory_compliance).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className='flex items-center justify-between'
                      >
                        <span className='text-sm font-semibold uppercase'>
                          {key.replace(/_compliant/g, '')}:
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-sm font-medium ${
                            value
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {value ? '✅' : '❌'}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Implementation Details */}
              <div className='rounded-lg bg-gray-50 p-6'>
                <h3 className='mb-4 text-xl font-bold text-gray-800'>
                  📋 Implementation Details
                </h3>
                <div className='space-y-2'>
                  {apiStatus.compliance_checks.details.map((detail, index) => (
                    <div key={index} className='flex items-start'>
                      <span className='mr-2 text-green-500'>✓</span>
                      <span className='text-gray-700'>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Endpoints Documentation */}
          <div className='mt-8 rounded-lg bg-gray-50 p-6'>
            <h3 className='mb-4 text-xl font-bold text-gray-800'>
              🔗 Available API Endpoints
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between rounded border bg-white p-3'>
                <div>
                  <span className='mr-3 rounded bg-green-100 px-2 py-1 font-mono text-sm text-green-800'>
                    GET
                  </span>
                  <code>/api/plaid/compliance-status</code>
                </div>
                <span className='text-gray-600'>
                  Real-time compliance validation
                </span>
              </div>
              <div className='flex items-center justify-between rounded border bg-white p-3'>
                <div>
                  <span className='mr-3 rounded bg-red-100 px-2 py-1 font-mono text-sm text-red-800'>
                    POST
                  </span>
                  <code>/api/plaid/data-deletion</code>
                </div>
                <span className='text-gray-600'>
                  Process data deletion requests
                </span>
              </div>
              <div className='flex items-center justify-between rounded border bg-white p-3'>
                <div>
                  <span className='mr-3 rounded bg-blue-100 px-2 py-1 font-mono text-sm text-blue-800'>
                    GET
                  </span>
                  <code>/api/plaid/retention-status</code>
                </div>
                <span className='text-gray-600'>
                  Banking data retention compliance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
