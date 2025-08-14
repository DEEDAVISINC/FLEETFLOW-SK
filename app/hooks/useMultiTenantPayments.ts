import { useCallback, useEffect, useState } from 'react';
import {
  PaymentProvider,
  TenantPaymentConfig,
  UnifiedInvoiceRequest,
  UnifiedInvoiceResponse,
} from '../services/MultiTenantPaymentService';

interface UseMultiTenantPaymentsReturn {
  // Configuration state
  config: TenantPaymentConfig | null;
  availableProviders: PaymentProvider[];
  activeProviders: string[];
  primaryProvider: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  createInvoice: (
    request: UnifiedInvoiceRequest
  ) => Promise<UnifiedInvoiceResponse>;
  testConnection: (
    provider: string
  ) => Promise<{ success: boolean; error?: string }>;
  enableProvider: (
    provider: string,
    credentials: any
  ) => Promise<{ success: boolean; connected?: boolean; message?: string }>;
  disableProvider: (
    provider: string
  ) => Promise<{ success: boolean; message?: string }>;
  setPrimaryProvider: (
    provider: string
  ) => Promise<{ success: boolean; message?: string }>;
  updatePreferences: (
    preferences: any
  ) => Promise<{ success: boolean; message?: string }>;
  refreshConfig: () => Promise<void>;
}

export function useMultiTenantPayments(
  tenantId: string
): UseMultiTenantPaymentsReturn {
  const [config, setConfig] = useState<TenantPaymentConfig | null>(null);
  const [availableProviders, setAvailableProviders] = useState<
    PaymentProvider[]
  >([]);
  const [activeProviders, setActiveProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get primary provider
  const primaryProvider = config?.primaryProvider || null;

  // Load initial data
  const loadData = useCallback(async () => {
    if (!tenantId) return;

    setLoading(true);
    setError(null);

    try {
      // Load available providers
      const providersResponse = await fetch(
        `/api/payments/multitenant?tenantId=${tenantId}&action=providers`
      );
      const providersData = await providersResponse.json();

      if (providersData.success) {
        setAvailableProviders(providersData.providers);
      }

      // Load tenant configuration
      const configResponse = await fetch(
        `/api/payments/multitenant?tenantId=${tenantId}&action=config`
      );
      const configData = await configResponse.json();

      if (configData.success) {
        setConfig(configData.config);
      } else {
        setError(configData.error || 'Failed to load configuration');
      }

      // Load active providers
      const activeResponse = await fetch(
        `/api/payments/multitenant?tenantId=${tenantId}&action=active-providers`
      );
      const activeData = await activeResponse.json();

      if (activeData.success) {
        setActiveProviders(activeData.activeProviders);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create unified invoice
  const createInvoice = useCallback(
    async (request: UnifiedInvoiceRequest): Promise<UnifiedInvoiceResponse> => {
      setError(null);

      try {
        const response = await fetch('/api/payments/multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'create-invoice',
            tenantId,
            invoice: { ...request, tenantId },
          }),
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.error || 'Failed to create invoice');
        }

        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : 'Failed to create invoice';
        setError(error);
        return {
          success: false,
          provider: request.provider,
          tenantId,
          error,
        };
      }
    },
    [tenantId]
  );

  // Test provider connection
  const testConnection = useCallback(
    async (provider: string): Promise<{ success: boolean; error?: string }> => {
      setError(null);

      try {
        const response = await fetch('/api/payments/multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'test-connection',
            tenantId,
            provider,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.error || 'Connection test failed');
        }

        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : 'Connection test failed';
        setError(error);
        return { success: false, error };
      }
    },
    [tenantId]
  );

  // Enable provider
  const enableProvider = useCallback(
    async (
      provider: string,
      credentials: any
    ): Promise<{ success: boolean; connected?: boolean; message?: string }> => {
      setError(null);

      try {
        const response = await fetch('/api/payments/multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'enable-provider',
            tenantId,
            provider,
            credentials,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh configuration to reflect changes
          await loadData();
        } else {
          setError(data.message || 'Failed to enable provider');
        }

        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : 'Failed to enable provider';
        setError(error);
        return { success: false, message: error };
      }
    },
    [tenantId, loadData]
  );

  // Disable provider
  const disableProvider = useCallback(
    async (
      provider: string
    ): Promise<{ success: boolean; message?: string }> => {
      setError(null);

      try {
        const response = await fetch('/api/payments/multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'disable-provider',
            tenantId,
            provider,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh configuration to reflect changes
          await loadData();
        } else {
          setError(data.message || 'Failed to disable provider');
        }

        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : 'Failed to disable provider';
        setError(error);
        return { success: false, message: error };
      }
    },
    [tenantId, loadData]
  );

  // Set primary provider
  const setPrimaryProvider = useCallback(
    async (
      provider: string
    ): Promise<{ success: boolean; message?: string }> => {
      setError(null);

      try {
        const response = await fetch('/api/payments/multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'set-primary-provider',
            tenantId,
            provider,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh configuration to reflect changes
          await loadData();
        } else {
          setError(data.message || 'Failed to set primary provider');
        }

        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : 'Failed to set primary provider';
        setError(error);
        return { success: false, message: error };
      }
    },
    [tenantId, loadData]
  );

  // Update preferences
  const updatePreferences = useCallback(
    async (
      preferences: any
    ): Promise<{ success: boolean; message?: string }> => {
      setError(null);

      try {
        const updatedConfig = {
          ...config,
          preferences: {
            ...config?.preferences,
            ...preferences,
          },
        };

        const response = await fetch('/api/payments/multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update-config',
            tenantId,
            config: updatedConfig,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh configuration to reflect changes
          await loadData();
        } else {
          setError(data.message || 'Failed to update preferences');
        }

        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : 'Failed to update preferences';
        setError(error);
        return { success: false, message: error };
      }
    },
    [tenantId, config, loadData]
  );

  // Refresh configuration
  const refreshConfig = useCallback(async (): Promise<void> => {
    await loadData();
  }, [loadData]);

  return {
    // State
    config,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading,
    error,

    // Actions
    createInvoice,
    testConnection,
    enableProvider,
    disableProvider,
    setPrimaryProvider,
    updatePreferences,
    refreshConfig,
  };
}

export default useMultiTenantPayments;




































