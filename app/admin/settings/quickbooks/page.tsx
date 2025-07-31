// File: app/admin/settings/quickbooks/page.tsx
// Admin QuickBooks Integration Settings Page

'use client';
import { useState, useEffect } from 'react';
import { quickBooksService } from '@/app/services/quickbooksService';

interface QuickBooksSettings {
  tenantId: string;
  isConnected: boolean;
  companyName?: string;
  environment: 'sandbox' | 'production';
  features: {
    payroll: boolean;
    ach: boolean;
    invoicing: boolean;
    autoWithdrawal: boolean;
  };
  lastSyncAt?: Date;
  errorMessage?: string;
}

export default function AdminQuickBooksSettings() {
  const [settings, setSettings] = useState<QuickBooksSettings>({
    tenantId: 'fleetflow-tenant-001', // Default tenant ID
    isConnected: false,
    environment: 'sandbox',
    features: {
      payroll: true,
      ach: true,
      invoicing: true,
      autoWithdrawal: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Check URL parameters for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const tenantId = urlParams.get('tenantId');
    const companyName = urlParams.get('companyName');
    const errorMessage = urlParams.get('message');

    if (success === 'true' && tenantId) {
      setSettings(prev => ({
        ...prev,
        tenantId,
        isConnected: true,
        companyName: companyName || undefined
      }));
      setMessage({ type: 'success', text: 'QuickBooks connected successfully!' });
    }

    if (error && errorMessage) {
      setMessage({ type: 'error', text: `Connection failed: ${errorMessage}` });
    }

    // Check existing connection status
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = () => {
    const connection = quickBooksService.getConnectionStatus(settings.tenantId);
    if (connection) {
      setSettings(prev => ({
        ...prev,
        isConnected: connection.isConnected,
        companyName: connection.companyName,
        lastSyncAt: connection.lastSyncAt,
        errorMessage: connection.errorMessage
      }));
    }
  };

  const connectToQuickBooks = () => {
    const clientId = process.env.NEXT_PUBLIC_QUICKBOOKS_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_QUICKBOOKS_REDIRECT_URI || 'http://localhost:3000/api/quickbooks/auth';
    const scope = 'com.intuit.quickbooks.accounting';
    
    const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${settings.tenantId}`;
    
    window.location.href = authUrl;
  };

  const disconnectQuickBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/quickbooks/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: settings.tenantId, action: 'disconnect' })
      });

      const result = await response.json();
      
      if (result.success) {
        setSettings(prev => ({
          ...prev,
          isConnected: false,
          companyName: undefined,
          lastSyncAt: undefined,
          errorMessage: undefined
        }));
        setMessage({ type: 'success', text: 'QuickBooks disconnected successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to disconnect QuickBooks' });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/quickbooks/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: settings.tenantId, action: 'refresh' })
      });

      const result = await response.json();
      
      if (result.success) {
        checkConnectionStatus();
        setMessage({ type: 'success', text: 'Token refreshed successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to refresh token' });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const connection = quickBooksService.getConnectionStatus(settings.tenantId);
      if (connection && connection.isConnected) {
        setMessage({ type: 'success', text: 'Connection test successful!' });
      } else {
        setMessage({ type: 'error', text: 'Connection test failed - not connected' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection test failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#10b981', marginBottom: '30px', fontSize: '28px', fontWeight: '600' }}>
        🧾 QuickBooks Integration Settings
      </h1>

      {/* Status Message */}
      {message && (
        <div style={{
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fef2f2',
          color: message.type === 'success' ? '#166534' : '#dc2626',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
        }}>
          {message.text}
          <button
            onClick={() => setMessage(null)}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Connection Status */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <h2 style={{ color: '#065f46', marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
          🔗 Connection Status
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <strong>Status:</strong>
            <span style={{
              color: settings.isConnected ? '#10b981' : '#dc2626',
              marginLeft: '10px',
              fontWeight: '600'
            }}>
              {settings.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>

          {settings.companyName && (
            <div>
              <strong>Company:</strong>
              <span style={{ marginLeft: '10px' }}>{settings.companyName}</span>
            </div>
          )}

          <div>
            <strong>Environment:</strong>
            <span style={{ marginLeft: '10px' }}>{settings.environment}</span>
          </div>

          {settings.lastSyncAt && (
            <div>
              <strong>Last Sync:</strong>
              <span style={{ marginLeft: '10px' }}>
                {new Date(settings.lastSyncAt).toLocaleString()}
              </span>
            </div>
          )}

          {settings.errorMessage && (
            <div style={{ gridColumn: '1 / -1' }}>
              <strong style={{ color: '#dc2626' }}>Error:</strong>
              <span style={{ marginLeft: '10px', color: '#dc2626' }}>{settings.errorMessage}</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!settings.isConnected ? (
            <button
              onClick={connectToQuickBooks}
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'Connecting...' : '🔗 Connect to QuickBooks'}
            </button>
          ) : (
            <>
              <button
                onClick={testConnection}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Testing...' : '🧪 Test Connection'}
              </button>

              <button
                onClick={refreshToken}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Refreshing...' : '🔄 Refresh Token'}
              </button>

              <button
                onClick={disconnectQuickBooks}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Disconnecting...' : '❌ Disconnect'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Feature Configuration */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <h2 style={{ color: '#1e40af', marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
          ⚙️ Feature Configuration
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
              💰 Payroll Integration
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={settings.features.payroll}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  features: { ...prev.features, payroll: e.target.checked }
                }))}
              />
              Enable payroll sync and processing
            </label>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
              Sync employee data, process payroll, and generate pay stubs
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
              🏦 ACH Payment Processing
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={settings.features.ach}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  features: { ...prev.features, ach: e.target.checked }
                }))}
              />
              Enable ACH payment processing
            </label>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
              Process ACH payments and automatic withdrawals
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
              🧾 Invoicing Integration
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={settings.features.invoicing}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  features: { ...prev.features, invoicing: e.target.checked }
                }))}
              />
              Enable invoice creation and sync
            </label>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
              Create invoices, generate PDFs, and track payments
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
              🔄 Auto Withdrawal
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={settings.features.autoWithdrawal}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  features: { ...prev.features, autoWithdrawal: e.target.checked }
                }))}
              />
              Enable automatic withdrawal setup
            </label>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
              Set up recurring automatic withdrawals
            </p>
          </div>
        </div>
      </div>

      {/* Environment Configuration */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <h2 style={{ color: '#92400e', marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
          🌍 Environment Configuration
        </h2>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="radio"
              name="environment"
              value="sandbox"
              checked={settings.environment === 'sandbox'}
              onChange={(e) => setSettings(prev => ({ ...prev, environment: e.target.value as 'sandbox' | 'production' }))}
            />
            Sandbox (Testing)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="radio"
              name="environment"
              value="production"
              checked={settings.environment === 'production'}
              onChange={(e) => setSettings(prev => ({ ...prev, environment: e.target.value as 'sandbox' | 'production' }))}
            />
            Production (Live)
          </label>
        </div>

        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '15px' }}>
          <strong>Note:</strong> Sandbox environment is recommended for testing. Production environment should only be used for live data.
        </p>
      </div>

      {/* Save Settings */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => setMessage({ type: 'success', text: 'Settings saved successfully!' })}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
} 