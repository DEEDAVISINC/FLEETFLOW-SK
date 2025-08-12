import { NextRequest, NextResponse } from 'next/server';
import MultiTenantPaymentService, {
  UnifiedInvoiceRequest,
} from '../../../services/MultiTenantPaymentService';

const paymentService = new MultiTenantPaymentService();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const action = url.searchParams.get('action');

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'providers':
        // Get available payment providers
        const providers = paymentService.getAvailableProviders();
        return NextResponse.json({
          success: true,
          providers,
        });

      case 'config':
        // Get tenant configuration
        const config = paymentService.getTenantConfig(tenantId);
        if (!config) {
          return NextResponse.json(
            { success: false, error: 'Tenant configuration not found' },
            { status: 404 }
          );
        }

        // Remove sensitive data before sending to client
        const sanitizedConfig = {
          ...config,
          providers: Object.fromEntries(
            Object.entries(config.providers).map(([key, value]) => [
              key,
              {
                enabled: value?.enabled,
                connected: value?.connected,
                environment: value?.environment,
              },
            ])
          ),
        };

        return NextResponse.json({
          success: true,
          config: sanitizedConfig,
        });

      case 'active-providers':
        // Get tenant's active providers
        const activeProviders =
          paymentService.getTenantActiveProviders(tenantId);
        return NextResponse.json({
          success: true,
          activeProviders,
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tenantId } = body;

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create-invoice':
        // Create unified invoice
        const invoiceRequest: UnifiedInvoiceRequest = body.invoice;
        if (!invoiceRequest) {
          return NextResponse.json(
            { success: false, error: 'Invoice data is required' },
            { status: 400 }
          );
        }

        const result = await paymentService.createInvoice(invoiceRequest);
        return NextResponse.json(result);

      case 'test-connection':
        // Test provider connection
        const { provider } = body;
        if (!provider) {
          return NextResponse.json(
            { success: false, error: 'Provider is required' },
            { status: 400 }
          );
        }

        const testResult = await paymentService.testProviderConnection(
          tenantId,
          provider
        );
        return NextResponse.json(testResult);

      case 'update-config':
        // Update tenant configuration
        const { config } = body;
        if (!config) {
          return NextResponse.json(
            { success: false, error: 'Configuration is required' },
            { status: 400 }
          );
        }

        const updateResult = await paymentService.updateTenantConfig(config);
        return NextResponse.json({
          success: updateResult,
          message: updateResult
            ? 'Configuration updated successfully'
            : 'Failed to update configuration',
        });

      case 'set-primary-provider':
        // Set primary payment provider for tenant
        const { provider: primaryProvider } = body;
        if (!primaryProvider) {
          return NextResponse.json(
            { success: false, error: 'Provider is required' },
            { status: 400 }
          );
        }

        const tenantConfig = paymentService.getTenantConfig(tenantId);
        if (!tenantConfig) {
          return NextResponse.json(
            { success: false, error: 'Tenant configuration not found' },
            { status: 404 }
          );
        }

        tenantConfig.primaryProvider = primaryProvider;
        tenantConfig.preferences.defaultProvider = primaryProvider;

        const setPrimaryResult =
          await paymentService.updateTenantConfig(tenantConfig);
        return NextResponse.json({
          success: setPrimaryResult,
          message: setPrimaryResult
            ? `${primaryProvider} set as primary provider`
            : 'Failed to set primary provider',
        });

      case 'enable-provider':
        // Enable a specific provider for tenant
        const { provider: enableProvider, credentials } = body;
        if (!enableProvider || !credentials) {
          return NextResponse.json(
            { success: false, error: 'Provider and credentials are required' },
            { status: 400 }
          );
        }

        const enableConfig = paymentService.getTenantConfig(tenantId);
        if (!enableConfig) {
          return NextResponse.json(
            { success: false, error: 'Tenant configuration not found' },
            { status: 404 }
          );
        }

        // Add the new provider configuration
        enableConfig.providers[
          enableProvider as keyof typeof enableConfig.providers
        ] = {
          ...credentials,
          enabled: true,
          connected: false,
        } as any;

        const enableResult =
          await paymentService.updateTenantConfig(enableConfig);

        if (enableResult) {
          // Test the connection
          const connectionTest = await paymentService.testProviderConnection(
            tenantId,
            enableProvider
          );
          if (connectionTest.success) {
            enableConfig.providers[
              enableProvider as keyof typeof enableConfig.providers
            ]!.connected = true;
            await paymentService.updateTenantConfig(enableConfig);
          }

          return NextResponse.json({
            success: true,
            connected: connectionTest.success,
            message: connectionTest.success
              ? `${enableProvider} enabled and connected successfully`
              : `${enableProvider} enabled but connection failed: ${connectionTest.error}`,
          });
        } else {
          return NextResponse.json({
            success: false,
            message: `Failed to enable ${enableProvider}`,
          });
        }

      case 'disable-provider':
        // Disable a specific provider for tenant
        const { provider: disableProvider } = body;
        if (!disableProvider) {
          return NextResponse.json(
            { success: false, error: 'Provider is required' },
            { status: 400 }
          );
        }

        const disableConfig = paymentService.getTenantConfig(tenantId);
        if (!disableConfig) {
          return NextResponse.json(
            { success: false, error: 'Tenant configuration not found' },
            { status: 404 }
          );
        }

        if (
          disableConfig.providers[
            disableProvider as keyof typeof disableConfig.providers
          ]
        ) {
          disableConfig.providers[
            disableProvider as keyof typeof disableConfig.providers
          ]!.enabled = false;
          disableConfig.providers[
            disableProvider as keyof typeof disableConfig.providers
          ]!.connected = false;

          // If this was the primary provider, switch to another active one
          if (disableConfig.primaryProvider === disableProvider) {
            const activeProviders =
              paymentService.getTenantActiveProviders(tenantId);
            if (activeProviders.length > 0) {
              disableConfig.primaryProvider = activeProviders[0] as any;
              disableConfig.preferences.defaultProvider =
                activeProviders[0] as any;
            }
          }

          const disableResult =
            await paymentService.updateTenantConfig(disableConfig);
          return NextResponse.json({
            success: disableResult,
            message: disableResult
              ? `${disableProvider} disabled successfully`
              : `Failed to disable ${disableProvider}`,
          });
        } else {
          return NextResponse.json({
            success: false,
            message: `Provider ${disableProvider} not found`,
          });
        }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle PATCH requests for partial updates
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, provider, field, value } = body;

    if (!tenantId || !provider || !field) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tenant ID, provider, and field are required',
        },
        { status: 400 }
      );
    }

    const config = paymentService.getTenantConfig(tenantId);
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Tenant configuration not found' },
        { status: 404 }
      );
    }

    if (config.providers[provider as keyof typeof config.providers]) {
      // Update specific field in provider configuration
      (config.providers[provider as keyof typeof config.providers] as any)[
        field
      ] = value;

      const updateResult = await paymentService.updateTenantConfig(config);
      return NextResponse.json({
        success: updateResult,
        message: updateResult
          ? `${provider} ${field} updated successfully`
          : `Failed to update ${provider} ${field}`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Provider ${provider} not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to remove provider configurations
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const provider = url.searchParams.get('provider');

    if (!tenantId || !provider) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID and provider are required' },
        { status: 400 }
      );
    }

    const config = paymentService.getTenantConfig(tenantId);
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Tenant configuration not found' },
        { status: 404 }
      );
    }

    if (config.providers[provider as keyof typeof config.providers]) {
      // Remove provider configuration
      delete config.providers[provider as keyof typeof config.providers];

      // If this was the primary provider, switch to another active one
      if (config.primaryProvider === provider) {
        const activeProviders =
          paymentService.getTenantActiveProviders(tenantId);
        if (activeProviders.length > 0) {
          config.primaryProvider = activeProviders[0] as any;
          config.preferences.defaultProvider = activeProviders[0] as any;
        } else {
          // No active providers left
          return NextResponse.json(
            {
              success: false,
              error: 'Cannot remove the last payment provider',
            },
            { status: 400 }
          );
        }
      }

      const deleteResult = await paymentService.updateTenantConfig(config);
      return NextResponse.json({
        success: deleteResult,
        message: deleteResult
          ? `${provider} configuration removed successfully`
          : `Failed to remove ${provider} configuration`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Provider ${provider} not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}



















