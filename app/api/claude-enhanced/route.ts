import { NextRequest, NextResponse } from 'next/server';
import { enhancedClaudeAIService } from '../../services/EnhancedClaudeAIService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        // Get comprehensive system status
        const status = enhancedClaudeAIService.getSystemStatus();
        return NextResponse.json({
          success: true,
          data: status,
          message: `Claude Enhanced Service: ${status.status}`,
        });

      case 'health':
        // Health check with connection test
        const health = await enhancedClaudeAIService.healthCheck();

        return NextResponse.json(
          {
            success: health.healthy,
            data: {
              healthy: health.healthy,
              status: health.details.status || 'UNKNOWN',
              configured: health.details.configured,
              connectionTest: health.details.connectionTest || false,
              fallbackAvailable: health.details.fallbackAvailable || false,
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
              fallbackRate:
                health.details.metrics?.totalRequests > 0
                  ? (
                      (health.details.metrics.fallbackRequests /
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
              : 'Service has issues (fallback available)',
          },
          { status: health.healthy ? 200 : 503 }
        );

      case 'cost-analysis':
        // Get cost analysis and recommendations
        const costAnalysis = enhancedClaudeAIService.getCostAnalysis();
        return NextResponse.json({
          success: true,
          data: costAnalysis,
          message: 'Cost analysis retrieved successfully',
        });

      case 'cache-stats':
        // Get cache statistics
        const cacheStats = enhancedClaudeAIService.getCacheStats();
        return NextResponse.json({
          success: true,
          data: cacheStats,
          message: 'Cache statistics retrieved successfully',
        });

      case 'test-ai':
        // Test AI response
        const testPrompt =
          searchParams.get('prompt') ||
          'Generate a brief test response for FleetFlow logistics operations.';
        const fallbackEnabled = searchParams.get('fallback') !== 'false';

        const testResult =
          await enhancedClaudeAIService.generateResponseWithRetry({
            prompt: testPrompt,
            maxTokens: 200,
            temperature: 0.7,
            fallbackEnabled,
          });

        return NextResponse.json({
          success: testResult.success,
          data: testResult,
          message: testResult.success
            ? `AI response generated (${testResult.source})`
            : `AI request failed: ${testResult.error}`,
        });

      case 'clear-cache':
        // Clear cache
        enhancedClaudeAIService.clearCache();
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully',
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'Claude Enhanced AI Service',
            version: '2.0.0',
            features: [
              'Intelligent fallback mechanisms',
              'Cost monitoring and optimization',
              'Response caching (30min TTL)',
              'Rate limiting (50/min, 1K/hour, 10K/day)',
              'Automatic retry with exponential backoff',
              'Token usage tracking',
              'Performance metrics',
              'Error recovery and resilience',
              'Production-grade reliability',
            ],
            endpoints: {
              'GET ?action=status': 'Get comprehensive system status',
              'GET ?action=health': 'Health check with connection test',
              'GET ?action=cost-analysis':
                'Get cost analysis and recommendations',
              'GET ?action=cache-stats': 'Get cache statistics',
              'GET ?action=test-ai&prompt=text&fallback=true':
                'Test AI response generation',
              'GET ?action=clear-cache': 'Clear response cache',
              'POST ?action=generate': 'Generate AI response',
              'POST ?action=batch-generate': 'Batch AI response generation',
            },
          },
          message: 'Claude Enhanced AI service is online',
        });
    }
  } catch (error) {
    console.error('Claude Enhanced API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          service: 'claude-enhanced',
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
      case 'generate':
        // Generate single AI response
        const {
          prompt,
          context,
          maxTokens,
          temperature,
          urgency,
          fallbackEnabled,
        } = body;

        if (!prompt) {
          return NextResponse.json(
            {
              success: false,
              message: 'Prompt is required in request body',
            },
            { status: 400 }
          );
        }

        const result = await enhancedClaudeAIService.generateResponseWithRetry({
          prompt,
          context,
          maxTokens: maxTokens || 1000,
          temperature: temperature || 0.7,
          urgency: urgency || 'normal',
          fallbackEnabled: fallbackEnabled !== false,
        });

        return NextResponse.json({
          success: result.success,
          data: result,
          message: result.success
            ? `Response generated successfully (${result.source})`
            : `Generation failed: ${result.error}`,
        });

      case 'batch-generate':
        // Batch generate multiple AI responses
        const { requests } = body;

        if (!Array.isArray(requests) || requests.length === 0) {
          return NextResponse.json(
            {
              success: false,
              message: 'Requests array is required with at least one entry',
            },
            { status: 400 }
          );
        }

        const batchResults = [];
        let successCount = 0;
        let fallbackCount = 0;
        let failureCount = 0;
        let totalCost = 0;

        // Process requests with concurrency control (max 3 at a time to respect rate limits)
        const concurrency = 3;
        for (let i = 0; i < requests.length; i += concurrency) {
          const batch = requests.slice(i, i + concurrency);

          const batchPromises = batch.map(async (req: any) => {
            try {
              const result =
                await enhancedClaudeAIService.generateResponseWithRetry({
                  prompt: req.prompt,
                  context: req.context,
                  maxTokens: req.maxTokens || 1000,
                  temperature: req.temperature || 0.7,
                  urgency: req.urgency || 'normal',
                  fallbackEnabled: req.fallbackEnabled !== false,
                });

              if (result.success) {
                successCount++;
                if (result.source === 'FALLBACK') fallbackCount++;
                totalCost += result.cost || 0;
              } else {
                failureCount++;
              }

              return {
                input: req,
                result,
              };
            } catch (error) {
              failureCount++;
              return {
                input: req,
                result: {
                  success: false,
                  error:
                    error instanceof Error ? error.message : 'Unknown error',
                  source: 'ERROR',
                },
              };
            }
          });

          const batchResults_chunk = await Promise.all(batchPromises);
          batchResults.push(...batchResults_chunk);

          // Small delay between batches to respect rate limits
          if (i + concurrency < requests.length) {
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            results: batchResults,
            summary: {
              total: requests.length,
              successful: successCount,
              fallback: fallbackCount,
              failed: failureCount,
              totalCost,
              successRate:
                ((successCount / requests.length) * 100).toFixed(1) + '%',
              fallbackRate:
                ((fallbackCount / requests.length) * 100).toFixed(1) + '%',
            },
          },
          message: `Batch generation completed: ${successCount}/${requests.length} successful`,
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
    console.error('Claude Enhanced POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

