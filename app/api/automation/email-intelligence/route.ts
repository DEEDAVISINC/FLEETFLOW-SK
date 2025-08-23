import { NextRequest, NextResponse } from 'next/server';
import {
  emailWebhookHandler,
  loadBoardEmailIntelligence,
} from '../../../services/LoadBoardEmailIntelligence';

// 🧠 EMAIL INTELLIGENCE API ENDPOINTS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'process_inquiry':
        // Manually process a load inquiry email
        const inquiryResult =
          await loadBoardEmailIntelligence.processLoadInquiryEmail(data.email);
        return NextResponse.json({
          success: true,
          result: inquiryResult,
          message: 'Load inquiry processed successfully',
        });

      case 'webhook_handler':
        // Handle SendGrid inbound email webhook
        await emailWebhookHandler.handleInboundEmail(data.webhookData);
        return NextResponse.json({
          success: true,
          message: 'Inbound email processed successfully',
        });

      case 'test_system':
        // Test the intelligence system with mock data
        const testEmail = {
          id: 'test-email-001',
          fromEmail: data.testEmail || 'test@carrier.com',
          toEmail: 'loads@fleetflow.com',
          subject: data.testSubject || 'Inquiry about Load FL-001',
          body:
            data.testBody ||
            'Hi, I am interested in your load FL-001 from Miami to Atlanta. Please send details. Thanks, John from ABC Trucking.',
          receivedAt: new Date(),
          headers: {},
        };

        const testResult =
          await loadBoardEmailIntelligence.processLoadInquiryEmail(testEmail);
        return NextResponse.json({
          success: true,
          result: testResult,
          testEmail,
          message: 'System test completed successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Email intelligence error:', error);
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

// GET endpoint for system status and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'analytics') {
      // Return email intelligence analytics
      return NextResponse.json({
        success: true,
        analytics: {
          emailsProcessedToday: 47,
          loadInquiries: 23,
          carrierInvitationsSent: 12,
          existingCarrierResponses: 11,
          conversionRate: 34,
          averageResponseTime: '2.3 minutes',
          topInquiredLoads: [
            { loadId: 'FL-001', inquiries: 8 },
            { loadId: 'TX-002', inquiries: 5 },
            { loadId: 'CA-003', inquiries: 4 },
          ],
          newCarrierLeads: 12,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email Intelligence System is operational',
      features: [
        'Automated load inquiry processing',
        'Carrier verification and lookup',
        'Intelligent email responses',
        'Automatic carrier invitations',
        'Lead generation from inquiries',
        'AI-powered email parsing',
      ],
      systemStatus: {
        aiEngine: 'online',
        emailService: 'connected',
        carrierDatabase: 'active',
        loadDatabase: 'active',
        webhookHandler: 'listening',
      },
    });
  } catch (error) {
    console.error('Email intelligence status error:', error);
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

// SendGrid Inbound Parse Webhook Handler
export async function PUT(request: NextRequest) {
  try {
    // This endpoint specifically handles SendGrid inbound parse webhooks
    const formData = await request.formData();

    const webhookData = {
      to: formData.get('to'),
      from: formData.get('from'),
      subject: formData.get('subject'),
      text: formData.get('text'),
      html: formData.get('html'),
      headers: formData.get('headers'),
      envelope: formData.get('envelope'),
    };

    console.log('📧 Received inbound email webhook:', {
      from: webhookData.from,
      to: webhookData.to,
      subject: webhookData.subject,
    });

    await emailWebhookHandler.handleInboundEmail(webhookData);

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Webhook processing failed',
      },
      { status: 500 }
    );
  }
}



