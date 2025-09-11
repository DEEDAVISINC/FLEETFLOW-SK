import { NextRequest, NextResponse } from 'next/server';
import { enhancedBillComService } from '../../services/billing/EnhancedBillComService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        // Get comprehensive system status
        const status = enhancedBillComService.getSystemStatus();
        return NextResponse.json({
          success: true,
          data: status,
          message: `Bill.com Enhanced Service: ${status.status}`
        });

      case 'health':
        // Health check with authentication test
        const health = await enhancedBillComService.healthCheck();
        
        return NextResponse.json({
          success: health.healthy,
          data: {
            healthy: health.healthy,
            status: health.details.status || 'UNKNOWN',
            environment: health.details.environment,
            authenticated: health.details.authenticationWorking || false,
            uptime: process.uptime(),
            lastSuccess: health.details.metrics?.lastSuccessTime ? 
              new Date(health.details.metrics.lastSuccessTime).toISOString() : null,
            lastError: health.details.metrics?.lastErrorTime ? 
              new Date(health.details.metrics.lastErrorTime).toISOString() : null,
            successRate: health.details.metrics?.totalRequests > 0 ? 
              (health.details.metrics.successfulRequests / health.details.metrics.totalRequests * 100).toFixed(2) + '%' : 'N/A',
            avgResponseTime: health.details.metrics?.avgResponseTime ? 
              health.details.metrics.avgResponseTime.toFixed(0) + 'ms' : 'N/A'
          },
          message: health.healthy ? 'Service is healthy' : 'Service has issues'
        }, { status: health.healthy ? 200 : 503 });

      case 'test-auth':
        // Test authentication
        const authResult = await enhancedBillComService.authenticateWithRetry();
        return NextResponse.json({
          success: authResult.success,
          data: {
            authenticated: authResult.success,
            sessionId: authResult.sessionId ? `${authResult.sessionId.substring(0, 10)}...` : null,
            error: authResult.error
          },
          message: authResult.success ? 'Authentication successful' : `Authentication failed: ${authResult.error}`
        });

      case 'test-customer':
        // Test customer creation
        const testCustomer = {
          id: 'test-001',
          name: 'Test Customer',
          email: 'test@fleetflowapp.com',
          companyName: 'Test Company LLC',
          address: {
            street: '123 Test Street',
            city: 'Test City',
            state: 'TX',
            zip: '12345',
            country: 'US'
          },
          paymentTerms: 'NET_30' as const,
          currency: 'USD'
        };

        const customerResult = await enhancedBillComService.createCustomerWithRetry(testCustomer);
        return NextResponse.json({
          success: customerResult.success,
          data: customerResult.data,
          message: customerResult.success ? 'Customer test successful' : `Customer test failed: ${customerResult.error}`
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'Bill.com Enhanced Integration Service',
            version: '2.0.0',
            features: [
              'Rate limiting (900 requests/hour)',
              'Circuit breaker pattern',
              'Exponential backoff retry',
              'Session management',
              'Comprehensive error handling',
              'Real-time metrics tracking',
              'Production environment support'
            ],
            endpoints: {
              'GET ?action=status': 'Get comprehensive system status',
              'GET ?action=health': 'Health check with authentication test',
              'GET ?action=test-auth': 'Test Bill.com authentication',
              'GET ?action=test-customer': 'Test customer creation',
              'POST': 'Create invoices and process payments'
            }
          },
          message: 'Bill.com Enhanced service is online'
        });
    }
  } catch (error) {
    console.error('Bill.com Enhanced API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        service: 'billcom-enhanced'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();

    switch (action) {
      case 'create-customer':
        const customerResult = await enhancedBillComService.createCustomerWithRetry(body);
        return NextResponse.json({
          success: customerResult.success,
          data: customerResult.data,
          message: customerResult.success ? 'Customer created successfully' : `Customer creation failed: ${customerResult.error}`
        }, { status: customerResult.success ? 200 : 400 });

      case 'create-invoice':
        const invoiceResult = await enhancedBillComService.createInvoiceWithRetry(body);
        return NextResponse.json({
          success: invoiceResult.success,
          data: invoiceResult.data,
          message: invoiceResult.success ? 'Invoice created successfully' : `Invoice creation failed: ${invoiceResult.error}`
        }, { status: invoiceResult.success ? 200 : 400 });

      case 'process-payment':
        const { invoiceId, ...paymentData } = body;
        const paymentResult = await enhancedBillComService.processPayment(invoiceId, paymentData);
        return NextResponse.json({
          success: paymentResult.success,
          data: paymentResult.data,
          message: paymentResult.success ? 'Payment processed successfully' : `Payment processing failed: ${paymentResult.error}`
        }, { status: paymentResult.success ? 200 : 400 });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Bill.com Enhanced POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

