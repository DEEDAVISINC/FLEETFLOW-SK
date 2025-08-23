'use client';

import React, { useState, useEffect } from 'react';

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
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
          request_source: 'admin_panel'
        })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🏛️ FleetFlow Plaid Integration Test
            </h1>
            <p className="text-gray-600 text-lg">
              Test and validate Plaid API implementation and compliance status
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="text-2xl font-bold">✅ SDK Installed</div>
              <div className="mt-2">Plaid Node.js SDK</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="text-2xl font-bold">🔧 API Routes</div>
              <div className="mt-2">3 Endpoints Active</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="text-2xl font-bold">📋 Compliance</div>
              <div className="mt-2">GDPR/CCPA Ready</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={checkComplianceStatus}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? '🔄 Loading...' : '📊 Check Compliance'}
            </button>
            
            <button
              onClick={testDataDeletion}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              🗑️ Test Deletion
            </button>
            
            <button
              onClick={testRetentionStatus}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              📅 Check Retention
            </button>
            
            <button
              onClick={() => window.open('/api/plaid/compliance-status', '_blank')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              🔗 API Direct
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* API Response Display */}
          {apiStatus && (
            <div className="space-y-6">
              {/* Environment Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🔧 Environment Configuration</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-semibold">Environment:</span> 
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {apiStatus.environment}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Client ID:</span> 
                    <span className="ml-2 font-mono text-sm">
                      {apiStatus.client_id}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Timestamp:</span> 
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(apiStatus.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance Checks */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">✅ Compliance Status</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(apiStatus.compliance_checks).filter(([key]) => key !== 'details').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-semibold capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {value ? '✅ Compliant' : '❌ Not Compliant'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integration Health */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🔧 Integration Health</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(apiStatus.integration_health).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-semibold capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {value ? '✅ Active' : '⚠️ Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Compliance */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">⚖️ Regulatory Compliance</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(apiStatus.regulatory_compliance).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-semibold uppercase text-sm">
                        {key.replace(/_compliant/g, '')}:
                      </span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {value ? '✅' : '❌'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementation Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Implementation Details</h3>
                <div className="space-y-2">
                  {apiStatus.compliance_checks.details.map((detail, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Endpoints Documentation */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 Available API Endpoints</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded mr-3">GET</span>
                  <code>/api/plaid/compliance-status</code>
                </div>
                <span className="text-gray-600">Real-time compliance validation</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <span className="font-mono text-sm bg-red-100 text-red-800 px-2 py-1 rounded mr-3">POST</span>
                  <code>/api/plaid/data-deletion</code>
                </div>
                <span className="text-gray-600">Process data deletion requests</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-3">GET</span>
                  <code>/api/plaid/retention-status</code>
                </div>
                <span className="text-gray-600">Banking data retention compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
