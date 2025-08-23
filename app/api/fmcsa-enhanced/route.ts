import { NextRequest, NextResponse } from 'next/server';
import { enhancedFMCSAService } from '../../services/EnhancedFMCSAService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        // Get comprehensive system status
        const status = enhancedFMCSAService.getSystemStatus();
        return NextResponse.json({
          success: true,
          data: status,
          message: `FMCSA Enhanced Service: ${status.status}`,
        });

      case 'health':
        // Health check with connection test
        const health = await enhancedFMCSAService.healthCheck();

        return NextResponse.json(
          {
            success: health.healthy,
            data: {
              healthy: health.healthy,
              status: health.details.status || 'UNKNOWN',
              configured: health.details.configured,
              connectionTest: health.details.connectionTest || false,
              apiKey: health.details.apiKey,
              uptime: process.uptime(),
              lastRequest: health.details.metrics?.lastRequestTime
                ? new Date(health.details.metrics.lastRequestTime).toISOString()
                : null,
              lastError: health.details.metrics?.lastErrorTime
                ? new Date(health.details.metrics.lastErrorTime).toISOString()
                : null,
              successRate:
                health.details.metrics?.totalRequests > 0
                  ? (
                      (health.details.metrics.successfulRequests /
                        health.details.metrics.totalRequests) *
                      100
                    ).toFixed(2) + '%'
                  : 'N/A',
              avgResponseTime: health.details.metrics?.avgResponseTime
                ? health.details.metrics.avgResponseTime.toFixed(0) + 'ms'
                : 'N/A',
              cacheHitRate: health.details.cacheStatus?.hitRate || 'N/A',
            },
            message: health.healthy
              ? 'Service is healthy'
              : 'Service has issues',
          },
          { status: health.healthy ? 200 : 503 }
        );

      case 'cache-stats':
        // Get cache statistics
        const cacheStats = enhancedFMCSAService.getCacheStats();
        return NextResponse.json({
          success: true,
          data: cacheStats,
          message: 'Cache statistics retrieved successfully',
        });

      case 'search-dot':
        // Search by DOT number
        const dotNumber = searchParams.get('dot');
        if (!dotNumber) {
          return NextResponse.json(
            {
              success: false,
              message: 'DOT number is required: ?action=search-dot&dot=123456',
            },
            { status: 400 }
          );
        }

        const dotResult =
          await enhancedFMCSAService.searchByDOTWithRetry(dotNumber);
        return NextResponse.json({
          success: dotResult.success,
          data: dotResult,
          message: dotResult.success
            ? `Carrier found for DOT ${dotNumber}`
            : `DOT search failed: ${dotResult.error}`,
        });

      case 'search-mc':
        // Search by MC number
        const mcNumber = searchParams.get('mc');
        if (!mcNumber) {
          return NextResponse.json(
            {
              success: false,
              message: 'MC number is required: ?action=search-mc&mc=123456',
            },
            { status: 400 }
          );
        }

        const mcResult =
          await enhancedFMCSAService.searchByMCWithRetry(mcNumber);
        return NextResponse.json({
          success: mcResult.success,
          data: mcResult,
          message: mcResult.success
            ? `Carrier found for MC ${mcNumber}`
            : `MC search failed: ${mcResult.error}`,
        });

      case 'clear-cache':
        // Clear cache
        enhancedFMCSAService.clearCache();
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully',
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'FMCSA Enhanced Carrier Verification Service',
            version: '2.0.0',
            features: [
              'Rate limiting (60/min, 1K/hour, 10K/day)',
              'Intelligent caching (1 hour TTL)',
              'Automatic retry with exponential backoff',
              'Comprehensive safety risk assessment',
              'Real-time carrier verification',
              'Safety rating analysis',
              'Crash and inspection history',
              'Risk scoring and recommendations',
              'Performance metrics tracking',
            ],
            endpoints: {
              'GET ?action=status': 'Get comprehensive system status',
              'GET ?action=health': 'Health check with connection test',
              'GET ?action=cache-stats': 'Get cache statistics',
              'GET ?action=search-dot&dot=123456':
                'Search carrier by DOT number',
              'GET ?action=search-mc&mc=123456': 'Search carrier by MC number',
              'GET ?action=clear-cache': 'Clear cache manually',
              'POST ?action=batch-search': 'Batch search multiple carriers',
            },
          },
          message: 'FMCSA Enhanced service is online',
        });
    }
  } catch (error) {
    console.error('FMCSA Enhanced API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          service: 'fmcsa-enhanced',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();

    switch (action) {
      case 'search-dot':
        // Search single carrier by DOT
        const { dotNumber } = body;
        if (!dotNumber) {
          return NextResponse.json(
            {
              success: false,
              message: 'DOT number is required in request body',
            },
            { status: 400 }
          );
        }

        const dotResult =
          await enhancedFMCSAService.searchByDOTWithRetry(dotNumber);
        return NextResponse.json({
          success: dotResult.success,
          data: dotResult,
          message: dotResult.success
            ? 'Carrier found'
            : `Search failed: ${dotResult.error}`,
        });

      case 'search-mc':
        // Search single carrier by MC
        const { mcNumber } = body;
        if (!mcNumber) {
          return NextResponse.json(
            {
              success: false,
              message: 'MC number is required in request body',
            },
            { status: 400 }
          );
        }

        const mcResult =
          await enhancedFMCSAService.searchByMCWithRetry(mcNumber);
        return NextResponse.json({
          success: mcResult.success,
          data: mcResult,
          message: mcResult.success
            ? 'Carrier found'
            : `Search failed: ${mcResult.error}`,
        });

      case 'batch-search':
        // Batch search multiple carriers
        const { carriers } = body;
        if (!Array.isArray(carriers) || carriers.length === 0) {
          return NextResponse.json(
            {
              success: false,
              message: 'Carriers array is required with at least one entry',
            },
            { status: 400 }
          );
        }

        const batchResults = [];
        let successCount = 0;
        let failureCount = 0;

        // Process carriers with concurrency control (max 5 at a time)
        const concurrency = 5;
        for (let i = 0; i < carriers.length; i += concurrency) {
          const batch = carriers.slice(i, i + concurrency);

          const batchPromises = batch.map(async (carrier: any) => {
            try {
              let result;
              if (carrier.dotNumber) {
                result = await enhancedFMCSAService.searchByDOTWithRetry(
                  carrier.dotNumber
                );
              } else if (carrier.mcNumber) {
                result = await enhancedFMCSAService.searchByMCWithRetry(
                  carrier.mcNumber
                );
              } else {
                result = {
                  success: false,
                  error: 'Either DOT or MC number is required',
                  dataSource: 'VALIDATION',
                };
              }

              if (result.success) successCount++;
              else failureCount++;

              return {
                input: carrier,
                result,
              };
            } catch (error) {
              failureCount++;
              return {
                input: carrier,
                result: {
                  success: false,
                  error:
                    error instanceof Error ? error.message : 'Unknown error',
                  dataSource: 'ERROR',
                },
              };
            }
          });

          const batchResults_chunk = await Promise.all(batchPromises);
          batchResults.push(...batchResults_chunk);

          // Small delay between batches to respect rate limits
          if (i + concurrency < carriers.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            results: batchResults,
            summary: {
              total: carriers.length,
              successful: successCount,
              failed: failureCount,
              successRate:
                ((successCount / carriers.length) * 100).toFixed(1) + '%',
            },
          },
          message: `Batch search completed: ${successCount}/${carriers.length} successful`,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('FMCSA Enhanced POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

