'use client';

import { useState, useEffect } from 'react';

interface ApiStatus {
  name: string;
  endpoint: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  responseTime?: number;
  lastChecked: string;
  details?: any;
}

export default function ApiStatusPage() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const apiEndpoints = [
    { name: 'Health Check', endpoint: '/api/health' },
    { name: 'Supabase Test', endpoint: '/api/supabase-test' },
    { name: 'Deployment Status', endpoint: '/api/deployment-status' },
    { name: 'Loads API', endpoint: '/api/loads' },
    { name: 'Test Supabase', endpoint: '/api/test-supabase' },
    { name: 'Vendor Login', endpoint: '/vendor-login' },
    { name: 'Vendor Portal', endpoint: '/vendor-portal' }
  ];

  const checkApiStatus = async (endpoint: string): Promise<ApiStatus> => {
    const startTime = Date.now();
    const status: ApiStatus = {
      name: apiEndpoints.find(api => api.endpoint === endpoint)?.name || endpoint,
      endpoint,
      status: 'unknown',
      lastChecked: new Date().toISOString()
    };

    try {
      const response = await fetch(endpoint);
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        status.status = 'healthy';
        status.responseTime = responseTime;
        const data = await response.json();
        status.details = data;
      } else {
        status.status = 'error';
        status.responseTime = responseTime;
        status.details = { error: `HTTP ${response.status}` };
      }
    } catch (error: any) {
      status.status = 'error';
      status.responseTime = Date.now() - startTime;
      status.details = { error: error.message };
    }

    return status;
  };

  const refreshAllApis = async () => {
    setLoading(true);
    const results = await Promise.all(
      apiEndpoints.map(api => checkApiStatus(api.endpoint))
    );
    setApiStatuses(results);
    setLastRefresh(new Date().toISOString());
    setLoading(false);
  };

  useEffect(() => {
    refreshAllApis();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🔍 FleetFlow API Status Dashboard</h1>
      <p>Comprehensive monitoring of all API endpoints and services</p>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={refreshAllApis}
          disabled={loading}
          style={{
            background: loading ? '#6b7280' : '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Refreshing...' : '🔄 Refresh All APIs'}
        </button>
        
        <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
          Last updated: {lastRefresh ? new Date(lastRefresh).toLocaleString() : 'Never'}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {apiStatuses.map((api, index) => (
          <div 
            key={index}
            style={{
              background: 'white',
              border: `2px solid ${getStatusColor(api.status)}`,
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                {getStatusIcon(api.status)} {api.name}
              </h3>
              <span style={{ 
                color: getStatusColor(api.status), 
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {api.status}
              </span>
            </div>
            
            <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>
              <strong>Endpoint:</strong> {api.endpoint}
            </div>
            
            {api.responseTime && (
              <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>
                <strong>Response Time:</strong> {api.responseTime}ms
              </div>
            )}
            
            <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>
              <strong>Last Checked:</strong> {new Date(api.lastChecked).toLocaleString()}
            </div>

            {api.details && (
              <details style={{ marginTop: '12px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#374151' }}>
                  View Details
                </summary>
                <pre style={{ 
                  background: '#f9fafb', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  marginTop: '8px'
                }}>
                  {JSON.stringify(api.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#fef3c7', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '30px' 
      }}>
        <h3>📊 API Health Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {apiStatuses.filter(api => api.status === 'healthy').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Healthy APIs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {apiStatuses.filter(api => api.status === 'degraded').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Degraded APIs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
              {apiStatuses.filter(api => api.status === 'error').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Error APIs</div>
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#dbeafe', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px' 
      }}>
        <h3>🚀 Deployment Readiness</h3>
        <p>All APIs should show "healthy" status for production deployment.</p>
        <ul style={{ marginTop: '12px' }}>
          <li><strong>Health Check:</strong> Tests overall system health</li>
          <li><strong>Supabase Test:</strong> Validates database connectivity</li>
          <li><strong>Deployment Status:</strong> Checks production readiness</li>
          <li><strong>Loads API:</strong> Core business functionality</li>
          <li><strong>Vendor Portal:</strong> Customer-facing features</li>
        </ul>
      </div>
    </div>
  );
} 