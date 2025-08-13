'use client';

import { useState } from 'react';
import { useMultiTenantPayments } from '../hooks/useMultiTenantPayments';

interface MultiTenantPaymentProvidersProps {
  tenantId: string;
  userRole: string;
}

interface ProviderCredentials {
  square?: {
    applicationId: string;
    accessToken: string;
    locationId: string;
    environment: 'sandbox' | 'production';
  };
  billcom?: {
    apiKey: string;
    username: string;
    password: string;
    orgId: string;
    environment: 'sandbox' | 'production';
  };
  quickbooks?: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
    companyId: string;
    environment: 'sandbox' | 'production';
  };
  stripe?: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    environment: 'test' | 'live';
  };
}

export default function MultiTenantPaymentProviders({
  tenantId,
  userRole,
}: MultiTenantPaymentProvidersProps) {
  const {
    config,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading,
    error,
    enableProvider,
    disableProvider,
    setPrimaryProvider,
    testConnection,
    updatePreferences,
  } = useMultiTenantPayments(tenantId);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'configure' | 'preferences'
  >('overview');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<ProviderCredentials>({});
  const [processingProvider, setProcessingProvider] = useState<string | null>(
    null
  );
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; error?: string }>
  >({});

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          color: '#6b7280',
        }}
      >
        <div style={{ marginRight: '8px' }}>⏳</div>
        Loading payment providers...
      </div>
    );
  }

  // Handle provider enable/disable
  const handleToggleProvider = async (provider: string, enabled: boolean) => {
    setProcessingProvider(provider);

    try {
      if (enabled) {
        // Enable provider - need credentials
        setSelectedProvider(provider);
        setActiveTab('configure');
      } else {
        // Disable provider
        const result = await disableProvider(provider);
        if (result.success) {
          alert(`✅ ${provider} disabled successfully`);
        } else {
          alert(`❌ Failed to disable ${provider}: ${result.message}`);
        }
      }
    } catch (error) {
      alert(
        `❌ Error toggling ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setProcessingProvider(null);
    }
  };

  // Handle setting primary provider
  const handleSetPrimary = async (provider: string) => {
    setProcessingProvider(provider);

    try {
      const result = await setPrimaryProvider(provider);
      if (result.success) {
        alert(`✅ ${provider} set as primary provider`);
      } else {
        alert(`❌ Failed to set ${provider} as primary: ${result.message}`);
      }
    } catch (error) {
      alert(
        `❌ Error setting primary provider: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setProcessingProvider(null);
    }
  };

  // Handle provider configuration
  const handleConfigureProvider = async (provider: string) => {
    const providerCredentials =
      credentials[provider as keyof ProviderCredentials];
    if (!providerCredentials) {
      alert('Please fill in all required credentials');
      return;
    }

    setProcessingProvider(provider);

    try {
      const result = await enableProvider(provider, providerCredentials);
      if (result.success) {
        alert(
          `✅ ${provider} enabled successfully${result.connected ? ' and connected' : ' but connection failed'}`
        );
        setSelectedProvider(null);
        setActiveTab('overview');
        setCredentials((prev) => ({ ...prev, [provider]: undefined }));
      } else {
        alert(`❌ Failed to enable ${provider}: ${result.message}`);
      }
    } catch (error) {
      alert(
        `❌ Error configuring ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setProcessingProvider(null);
    }
  };

  // Handle connection test
  const handleTestConnection = async (provider: string) => {
    setProcessingProvider(provider);

    try {
      const result = await testConnection(provider);
      setTestResults((prev) => ({ ...prev, [provider]: result }));

      if (result.success) {
        alert(`✅ ${provider} connection test successful`);
      } else {
        alert(`❌ ${provider} connection test failed: ${result.error}`);
      }
    } catch (error) {
      alert(
        `❌ Connection test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setProcessingProvider(null);
    }
  };

  // Get provider icon
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'square':
        return '🟨';
      case 'billcom':
        return '💸';
      case 'quickbooks':
        return '📊';
      case 'stripe':
        return '💳';
      default:
        return '💰';
    }
  };

  // Get provider color
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'square':
        return '#3b82f6';
      case 'billcom':
        return '#10b981';
      case 'quickbooks':
        return '#f59e0b';
      case 'stripe':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          💳 Payment Providers
          <span
            style={{
              background: primaryProvider
                ? getProviderColor(primaryProvider)
                : '#6b7280',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '500',
            }}
          >
            {primaryProvider ? primaryProvider.toUpperCase() : 'NO PRIMARY'}
          </span>
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          <span>
            Tenant: <strong>{tenantId}</strong>
          </span>
          <span>
            Active Providers: <strong>{activeProviders.length}</strong>
          </span>
          <span>
            Role: <strong>{userRole}</strong>
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#dc2626',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {[
          { key: 'overview', label: '📊 Overview', icon: '📊' },
          { key: 'configure', label: '⚙️ Configure', icon: '⚙️' },
          { key: 'preferences', label: '🎛️ Preferences', icon: '🎛️' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
              border: 'none',
              borderBottom:
                activeTab === tab.key
                  ? '2px solid #3b82f6'
                  : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>
            Available Payment Providers
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {availableProviders.map((provider) => {
              const isActive = activeProviders.includes(provider.name);
              const isPrimary = primaryProvider === provider.name;
              const isProcessing = processingProvider === provider.name;

              return (
                <div
                  key={provider.name}
                  style={{
                    background: 'white',
                    border: `2px solid ${isPrimary ? getProviderColor(provider.name) : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    position: 'relative',
                  }}
                >
                  {/* Provider Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>
                        {getProviderIcon(provider.name)}
                      </span>
                      <h4 style={{ margin: 0, color: '#1f2937' }}>
                        {provider.displayName}
                      </h4>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {isPrimary && (
                        <span
                          style={{
                            background: getProviderColor(provider.name),
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '500',
                          }}
                        >
                          PRIMARY
                        </span>
                      )}
                      <span
                        style={{
                          background: isActive ? '#dcfce7' : '#fee2e2',
                          color: isActive ? '#166534' : '#dc2626',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500',
                        }}
                      >
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '4px',
                      }}
                    >
                      Features:
                    </div>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
                    >
                      {provider.supportedFeatures.map((feature, index) => (
                        <span
                          key={index}
                          style={{
                            background: feature.available
                              ? '#f0f9ff'
                              : '#f3f4f6',
                            color: feature.available ? '#0369a1' : '#6b7280',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                          }}
                        >
                          {feature.available ? '✅' : '❌'} {feature.type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connection Status */}
                  {isActive && testResults[provider.name] && (
                    <div
                      style={{
                        background: testResults[provider.name].success
                          ? '#f0fdf4'
                          : '#fef2f2',
                        border: `1px solid ${testResults[provider.name].success ? '#bbf7d0' : '#fecaca'}`,
                        borderRadius: '6px',
                        padding: '8px',
                        marginBottom: '12px',
                        fontSize: '12px',
                        color: testResults[provider.name].success
                          ? '#166534'
                          : '#dc2626',
                      }}
                    >
                      {testResults[provider.name].success
                        ? '✅ Connected'
                        : `❌ ${testResults[provider.name].error}`}
                    </div>
                  )}

                  {/* Actions */}
                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    <button
                      onClick={() =>
                        handleToggleProvider(provider.name, !isActive)
                      }
                      disabled={isProcessing}
                      style={{
                        padding: '6px 12px',
                        background: isActive ? '#ef4444' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        opacity: isProcessing ? 0.6 : 1,
                      }}
                    >
                      {isProcessing
                        ? '⏳ Processing...'
                        : isActive
                          ? 'Disable'
                          : 'Enable'}
                    </button>

                    {isActive && !isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(provider.name)}
                        disabled={isProcessing}
                        style={{
                          padding: '6px 12px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: isProcessing ? 'not-allowed' : 'pointer',
                          opacity: isProcessing ? 0.6 : 1,
                        }}
                      >
                        Set Primary
                      </button>
                    )}

                    {isActive && (
                      <button
                        onClick={() => handleTestConnection(provider.name)}
                        disabled={isProcessing}
                        style={{
                          padding: '6px 12px',
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: isProcessing ? 'not-allowed' : 'pointer',
                          opacity: isProcessing ? 0.6 : 1,
                        }}
                      >
                        Test Connection
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Configure Tab */}
      {activeTab === 'configure' && (
        <div>
          <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>
            Configure Payment Provider
          </h3>

          {!selectedProvider ? (
            <div>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Select a provider to configure:
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {availableProviders
                  .filter((p) => !activeProviders.includes(p.name))
                  .map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => setSelectedProvider(provider.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        background: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = getProviderColor(
                          provider.name
                        ))
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = '#e5e7eb')
                      }
                    >
                      <span style={{ fontSize: '20px' }}>
                        {getProviderIcon(provider.name)}
                      </span>
                      <span>{provider.displayName}</span>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '24px' }}>
                  {getProviderIcon(selectedProvider)}
                </span>
                <h4 style={{ margin: 0, color: '#1f2937' }}>
                  Configure{' '}
                  {
                    availableProviders.find((p) => p.name === selectedProvider)
                      ?.displayName
                  }
                </h4>
              </div>

              {/* Provider-specific configuration forms */}
              {selectedProvider === 'square' && (
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      Application ID
                    </label>
                    <input
                      type='text'
                      placeholder='sq0idb-...'
                      value={credentials.square?.applicationId || ''}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          square: {
                            ...prev.square!,
                            applicationId: e.target.value,
                          },
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      Access Token
                    </label>
                    <input
                      type='password'
                      placeholder='EAAAlyx...'
                      value={credentials.square?.accessToken || ''}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          square: {
                            ...prev.square!,
                            accessToken: e.target.value,
                          },
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      Location ID
                    </label>
                    <input
                      type='text'
                      placeholder='LOCATION_ID'
                      value={credentials.square?.locationId || ''}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          square: {
                            ...prev.square!,
                            locationId: e.target.value,
                          },
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      Environment
                    </label>
                    <select
                      value={credentials.square?.environment || 'sandbox'}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          square: {
                            ...prev.square!,
                            environment: e.target.value as
                              | 'sandbox'
                              | 'production',
                          },
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <option value='sandbox'>Sandbox</option>
                      <option value='production'>Production</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Add similar forms for other providers... */}

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <button
                  onClick={() => handleConfigureProvider(selectedProvider)}
                  disabled={processingProvider === selectedProvider}
                  style={{
                    padding: '10px 20px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor:
                      processingProvider === selectedProvider
                        ? 'not-allowed'
                        : 'pointer',
                    opacity: processingProvider === selectedProvider ? 0.6 : 1,
                  }}
                >
                  {processingProvider === selectedProvider
                    ? '⏳ Configuring...'
                    : '✅ Save & Test Connection'}
                </button>
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    setCredentials({});
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div>
          <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>
            Payment Preferences
          </h3>

          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Default Provider
                </label>
                <select
                  value={config?.preferences.defaultProvider || ''}
                  onChange={(e) =>
                    updatePreferences({ defaultProvider: e.target.value })
                  }
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  {activeProviders.map((provider) => (
                    <option key={provider} value={provider}>
                      {
                        availableProviders.find((p) => p.name === provider)
                          ?.displayName
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Fallback Provider (Optional)
                </label>
                <select
                  value={config?.preferences.fallbackProvider || ''}
                  onChange={(e) =>
                    updatePreferences({
                      fallbackProvider: e.target.value || null,
                    })
                  }
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <option value=''>No Fallback</option>
                  {activeProviders
                    .filter((p) => p !== config?.preferences.defaultProvider)
                    .map((provider) => (
                      <option key={provider} value={provider}>
                        {
                          availableProviders.find((p) => p.name === provider)
                            ?.displayName
                        }
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={config?.preferences.autoSwitchOnFailure || false}
                    onChange={(e) =>
                      updatePreferences({
                        autoSwitchOnFailure: e.target.checked,
                      })
                    }
                  />
                  Auto-switch to fallback provider on failure
                </label>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '4px 0 0 20px',
                  }}
                >
                  Automatically use the fallback provider if the primary
                  provider fails
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px',
              fontSize: '12px',
              color: '#0369a1',
            }}
          >
            <strong>💡 Multi-Provider Benefits:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
              <li>✅ Provider redundancy ensures business continuity</li>
              <li>✅ Choose the best provider for each transaction</li>
              <li>✅ Compare rates and features across providers</li>
              <li>✅ Reduce dependency on a single payment processor</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}























