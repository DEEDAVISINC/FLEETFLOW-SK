import { NextRequest, NextResponse } from 'next/server';
import { enhancedTwilioService } from '../../services/EnhancedTwilioService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        // Get comprehensive system status
        const status = enhancedTwilioService.getSystemStatus();
        return NextResponse.json({
          success: true,
          data: status,
          message: `Twilio Enhanced Service: ${status.status}`
        });

      case 'health':
        // Health check with connection test
        const health = await enhancedTwilioService.healthCheck();
        
        return NextResponse.json({
          success: health.healthy,
          data: {
            healthy: health.healthy,
            status: health.details.status || 'UNKNOWN',
            configured: health.details.configured,
            connectionTest: health.details.connectionTest || false,
            fromNumber: health.details.fromNumber,
            uptime: process.uptime(),
            lastMessage: health.details.metrics?.lastMessageTime ? 
              new Date(health.details.metrics.lastMessageTime).toISOString() : null,
            lastError: health.details.metrics?.lastErrorTime ? 
              new Date(health.details.metrics.lastErrorTime).toISOString() : null,
            successRate: health.details.metrics?.totalRequests > 0 ? 
              (health.details.metrics.successfulMessages / health.details.metrics.totalRequests * 100).toFixed(2) + '%' : 'N/A',
            avgResponseTime: health.details.metrics?.avgResponseTime ? 
              health.details.metrics.avgResponseTime.toFixed(0) + 'ms' : 'N/A'
          },
          message: health.healthy ? 'Service is healthy' : 'Service has issues'
        }, { status: health.healthy ? 200 : 503 });

      case 'cost-analysis':
        // Get cost analysis and recommendations
        const costAnalysis = enhancedTwilioService.getCostAnalysis();
        return NextResponse.json({
          success: true,
          data: costAnalysis,
          message: 'Cost analysis retrieved successfully'
        });

      case 'test-sms':
        // Send a test SMS
        const testPhone = searchParams.get('phone') || '+1234567890';
        const testMessage = searchParams.get('message') || '🧪 FleetFlow SMS Test - Enhanced service working correctly!';
        
        if (testPhone === '+1234567890') {
          return NextResponse.json({
            success: false,
            message: 'Please provide a valid phone number: ?action=test-sms&phone=+1234567890&message=your_message'
          });
        }

        const testResult = await enhancedTwilioService.sendSMSWithRetry({
          to: testPhone,
          message: testMessage,
          urgency: 'normal',
          template: 'custom'
        });

        return NextResponse.json({
          success: testResult.success,
          data: testResult,
          message: testResult.success ? 'Test SMS sent successfully' : `Test SMS failed: ${testResult.error}`
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'Twilio Enhanced SMS Service',
            version: '2.0.0',
            features: [
              'Rate limiting (100/min, 3K/hour, 50K/day)',
              'Delivery status tracking',
              'Automatic retry with exponential backoff',
              'Cost monitoring and analysis',
              'Batch messaging with concurrency control',
              'Comprehensive error handling',
              'Real-time metrics tracking',
              'Phone number validation'
            ],
            endpoints: {
              'GET ?action=status': 'Get comprehensive system status',
              'GET ?action=health': 'Health check with connection test',
              'GET ?action=cost-analysis': 'Get cost analysis and recommendations',
              'GET ?action=test-sms&phone=+1xxx&message=text': 'Send test SMS',
              'POST ?action=send-sms': 'Send single SMS',
              'POST ?action=send-batch': 'Send batch SMS messages',
              'POST ?action=delivery-status': 'Handle Twilio delivery webhooks'
            }
          },
          message: 'Twilio Enhanced SMS service is online'
        });
    }
  } catch (error) {
    console.error('Twilio Enhanced API error:', error);
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        service: 'twilio-enhanced'
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
      case 'send-sms':
        // Send single SMS
        const smsResult = await enhancedTwilioService.sendSMSWithRetry(body);
        return NextResponse.json({
          success: smsResult.success,
          data: smsResult,
          message: smsResult.success ? 'SMS sent successfully' : `SMS failed: ${smsResult.error}`
        }, { status: smsResult.success ? 200 : 400 });

      case 'send-batch':
        // Send batch SMS
        const { messages, concurrency = 5 } = body;
        if (!Array.isArray(messages)) {
          return NextResponse.json({
            success: false,
            message: 'Messages array is required'
          }, { status: 400 });
        }

        const batchResult = await enhancedTwilioService.sendBatchSMS(messages, concurrency);
        return NextResponse.json({
          success: true,
          data: batchResult,
          message: `Batch SMS completed: ${batchResult.summary.successful}/${batchResult.summary.total} successful`
        });

      case 'delivery-status':
        // Handle Twilio delivery status webhook
        enhancedTwilioService.handleDeliveryStatus(body);
        return NextResponse.json({
          success: true,
          message: 'Delivery status updated'
        });

      case 'get-delivery-status':
        // Get delivery status for specific message
        const { messageId } = body;
        if (!messageId) {
          return NextResponse.json({
            success: false,
            message: 'Message ID is required'
          }, { status: 400 });
        }

        const deliveryStatus = enhancedTwilioService.getDeliveryStatus(messageId);
        return NextResponse.json({
          success: !!deliveryStatus,
          data: deliveryStatus,
          message: deliveryStatus ? 'Delivery status found' : 'Message ID not found'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Twilio Enhanced POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

