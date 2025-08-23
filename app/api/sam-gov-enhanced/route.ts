import { NextRequest, NextResponse } from 'next/server';
import { enhancedSAMGovMonitor } from '../../services/EnhancedSAMGovMonitor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        // Get comprehensive system status
        const status = enhancedSAMGovMonitor.getSystemStatus();
        return NextResponse.json({
          success: true,
          data: status,
          message: `SAM.gov Enhanced Monitor: ${status.status}`
        });

      case 'check':
        // Check for new opportunities with full monitoring
        const result = await enhancedSAMGovMonitor.checkForNewOpportunities();
        return NextResponse.json({
          success: result.success,
          data: {
            opportunities: result.newOpportunities,
            count: result.totalOpportunities,
            metrics: result.metrics,
            rateLimit: result.rateLimitStatus,
            circuitBreaker: result.circuitBreakerStatus
          },
          message: result.success ? 
            `Found ${result.totalOpportunities} opportunities` : 
            'Request failed - check system status'
        });

      case 'health':
        // Health check endpoint
        const health = enhancedSAMGovMonitor.getSystemStatus();
        const isHealthy = health.status === 'HEALTHY';
        
        return NextResponse.json({
          success: isHealthy,
          data: {
            status: health.status,
            healthy: isHealthy,
            uptime: health.uptime,
            lastSuccess: health.metrics.lastSuccessTime ? 
              new Date(health.metrics.lastSuccessTime).toISOString() : null,
            lastError: health.metrics.lastErrorTime ? 
              new Date(health.metrics.lastErrorTime).toISOString() : null,
            successRate: health.metrics.totalRequests > 0 ? 
              (health.metrics.successfulRequests / health.metrics.totalRequests * 100).toFixed(2) + '%' : 'N/A',
            avgResponseTime: health.metrics.avgResponseTime.toFixed(0) + 'ms'
          },
          message: isHealthy ? 'Service is healthy' : `Service status: ${health.status}`
        }, { status: isHealthy ? 200 : 503 });

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'SAM.gov Enhanced Opportunity Monitor',
            version: '2.0.0',
            features: [
              'Rate limiting (900 requests/hour)',
              'Circuit breaker pattern',
              'Exponential backoff retry',
              'Comprehensive error handling',
              'Real-time metrics tracking',
              'Production-grade monitoring'
            ],
            endpoints: {
              'GET ?action=status': 'Get comprehensive system status',
              'GET ?action=check': 'Check for new opportunities with monitoring',
              'GET ?action=health': 'Health check endpoint',
              'POST': 'Update monitoring configuration (future)'
            }
          },
          message: 'SAM.gov Enhanced monitoring service is online'
        });
    }
  } catch (error) {
    console.error('SAM.gov Enhanced Monitor API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        service: 'sam-gov-enhanced'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Future: Update monitoring configuration
    return NextResponse.json({
      success: false,
      message: 'Configuration updates not yet implemented'
    }, { status: 501 });
  } catch (error) {
    console.error('SAM.gov Enhanced Monitor POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

