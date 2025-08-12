/**
 * Multi-Tenant Square Integration Hook
 * Provides tenant-aware Square functionality for FleetFlow components
 */

import { useCallback, useEffect, useState } from 'react';

interface SquareConfig {
  configured: boolean;
  enabled: boolean;
  connected: boolean;
  environment?: 'sandbox' | 'production';
  applicationId?: string;
  locationId?: string;
  lastSync?: string;
}

interface SquareCredentials {
  applicationId: string;
  accessToken: string;
  locationId: string;
  environment: 'sandbox' | 'production';
}

interface InvoiceData {
  customerId?: string;
  customerName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  title: string;
  description: string;
  lineItems: Array<{
    name: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  dueDate?: string;
  customFields?: Array<{
    label: string;
    value: string;
  }>;
}

interface PaymentData {
  amount: number;
  currency?: string;
  sourceId: string;
  description?: string;
  metadata?: Record<string, string>;
}

export function useMultiTenantSquare(tenantId: string) {
  const [config, setConfig] = useState<SquareConfig>({
    configured: false,
    enabled: false,
    connected: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current tenant's Square configuration status
  const loadSquareConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/payments/square-multitenant?action=get-status&tenantId=${tenantId}`,
        {
          headers: {
            'x-tenant-id': tenantId,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setConfig(data.status);
      } else {
        throw new Error(data.error || 'Failed to load Square configuration');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading Square config:', err);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  // Load configuration on mount and tenant change
  useEffect(() => {
    if (tenantId) {
      loadSquareConfig();
    }
  }, [tenantId, loadSquareConfig]);

  // Enable Square for the current tenant
  const enableSquare = useCallback(
    async (
      credentials: SquareCredentials
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/payments/square-multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
          },
          body: JSON.stringify({
            action: 'enable-square',
            tenantId,
            ...credentials,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Reload configuration to get updated status
          await loadSquareConfig();
          return { success: true };
        } else {
          const errorMsg = data.error || 'Failed to enable Square';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [tenantId, loadSquareConfig]
  );

  // Disable Square for the current tenant
  const disableSquare = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/payments/square-multitenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({
          action: 'disable-square',
          tenantId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reload configuration to get updated status
        await loadSquareConfig();
        return { success: true };
      } else {
        const errorMsg = data.error || 'Failed to disable Square';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [tenantId, loadSquareConfig]);

  // Create and send Square invoice
  const createInvoice = useCallback(
    async (
      invoiceData: InvoiceData
    ): Promise<{
      success: boolean;
      invoiceId?: string;
      invoiceNumber?: string;
      publicUrl?: string;
      error?: string;
    }> => {
      try {
        setError(null);

        if (!config.connected) {
          return {
            success: false,
            error: 'Square is not connected for this tenant',
          };
        }

        const response = await fetch('/api/payments/square-multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
          },
          body: JSON.stringify({
            action: 'create-fleetflow-invoice',
            tenantId,
            ...invoiceData,
          }),
        });

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            invoiceId: data.invoiceId,
            invoiceNumber: data.invoiceNumber,
            publicUrl: data.publicUrl,
          };
        } else {
          const errorMsg = data.error || 'Failed to create invoice';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [tenantId, config.connected]
  );

  // Process Square payment
  const processPayment = useCallback(
    async (
      paymentData: PaymentData
    ): Promise<{
      success: boolean;
      paymentId?: string;
      transactionId?: string;
      amount?: number;
      receiptUrl?: string;
      error?: string;
    }> => {
      try {
        setError(null);

        if (!config.connected) {
          return {
            success: false,
            error: 'Square is not connected for this tenant',
          };
        }

        const response = await fetch('/api/payments/square-multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
          },
          body: JSON.stringify({
            action: 'process-payment',
            tenantId,
            ...paymentData,
          }),
        });

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            paymentId: data.paymentId,
            transactionId: data.transactionId,
            amount: data.amount,
            receiptUrl: data.receiptUrl,
          };
        } else {
          const errorMsg = data.error || 'Failed to process payment';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [tenantId, config.connected]
  );

  // Create Square customer
  const createCustomer = useCallback(
    async (customerData: {
      givenName?: string;
      familyName?: string;
      companyName?: string;
      emailAddress?: string;
      phoneNumber?: string;
      address?: any;
    }): Promise<{
      success: boolean;
      customerId?: string;
      error?: string;
    }> => {
      try {
        setError(null);

        if (!config.connected) {
          return {
            success: false,
            error: 'Square is not connected for this tenant',
          };
        }

        const response = await fetch('/api/payments/square-multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
          },
          body: JSON.stringify({
            action: 'create-customer',
            tenantId,
            customer: customerData,
          }),
        });

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            customerId: data.customerId,
          };
        } else {
          const errorMsg = data.error || 'Failed to create customer';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [tenantId, config.connected]
  );

  // List tenant's invoices
  const listInvoices = useCallback(
    async (filters?: {
      status?: string;
      limit?: number;
      cursor?: string;
    }): Promise<{
      success: boolean;
      invoices?: any[];
      cursor?: string;
      error?: string;
    }> => {
      try {
        setError(null);

        if (!config.connected) {
          return {
            success: false,
            error: 'Square is not connected for this tenant',
          };
        }

        const query = new URLSearchParams({
          action: 'list-invoices',
          tenantId,
        });

        if (filters?.status) query.append('status', filters.status);
        if (filters?.limit) query.append('limit', filters.limit.toString());
        if (filters?.cursor) query.append('cursor', filters.cursor);

        const response = await fetch(
          `/api/payments/square-multitenant?${query.toString()}`,
          {
            headers: {
              'x-tenant-id': tenantId,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            invoices: data.invoices,
            cursor: data.cursor,
          };
        } else {
          const errorMsg = data.error || 'Failed to list invoices';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [tenantId, config.connected]
  );

  // Get invoice details
  const getInvoice = useCallback(
    async (
      invoiceId: string
    ): Promise<{
      success: boolean;
      invoice?: any;
      error?: string;
    }> => {
      try {
        setError(null);

        if (!config.connected) {
          return {
            success: false,
            error: 'Square is not connected for this tenant',
          };
        }

        const response = await fetch('/api/payments/square-multitenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
          },
          body: JSON.stringify({
            action: 'get-invoice',
            tenantId,
            invoiceId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            invoice: data.invoice,
          };
        } else {
          const errorMsg = data.error || 'Failed to get invoice';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [tenantId, config.connected]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh configuration
  const refreshConfig = useCallback(async () => {
    await loadSquareConfig();
  }, [loadSquareConfig]);

  return {
    // State
    config,
    loading,
    error,

    // Actions
    enableSquare,
    disableSquare,
    createInvoice,
    processPayment,
    createCustomer,
    listInvoices,
    getInvoice,
    refreshConfig,
    clearError,
  };
}

export default useMultiTenantSquare;





















